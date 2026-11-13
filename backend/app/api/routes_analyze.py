import os
import time
import tempfile
import logging
from typing import Set
from fastapi import APIRouter, UploadFile, File, HTTPException, status
from app.schemas.report import ReportAnalyzeResponse, ExtractionResponse
from app.services.extractor import extract_text_from_file
from app.services.parser import extract_structured_biomarkers, generate_educational_insights

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api", tags=["Medical Reports Analysis"])

# Constraints
MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024  # 10 MB
SUPPORTED_EXTENSIONS: Set[str] = {'pdf', 'jpg', 'jpeg', 'png'}


def validate_upload(file: UploadFile) -> str:
    """Validate filename presence and supported extension."""
    if not file.filename:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No filename provided in upload request."
        )

    ext = file.filename.rsplit('.', 1)[-1].lower() if '.' in file.filename else ''
    if ext not in SUPPORTED_EXTENSIONS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Unsupported file format ('.{ext}'). Allowed formats: PDF, JPG, JPEG, PNG."
        )
    return ext


def read_and_validate_upload(file: UploadFile, ext: str) -> bytes:
    """Read at most the configured limit and verify the file signature."""
    try:
        content = file.file.read(MAX_FILE_SIZE_BYTES + 1)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Could not read uploaded file: {str(e)}"
        )

    if not content:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="The uploaded file is empty (0 bytes). Please upload a valid laboratory report."
        )

    if len(content) > MAX_FILE_SIZE_BYTES:
        raise HTTPException(
            status_code=status.HTTP_413_CONTENT_TOO_LARGE,
            detail="File exceeds maximum allowed size of 10 MB."
        )

    signatures = {
        'pdf': content.startswith(b'%PDF-'),
        'jpg': content.startswith(b'\xff\xd8\xff'),
        'jpeg': content.startswith(b'\xff\xd8\xff'),
        'png': content.startswith(b'\x89PNG\r\n\x1a\n'),
    }
    if not signatures[ext]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"The file contents do not match the .{ext} extension. Please upload a valid PDF, JPG, or PNG."
        )

    return content


@router.post("/reports/analyze", response_model=ReportAnalyzeResponse)
@router.post("/analyze", response_model=ReportAnalyzeResponse)
def analyze_report(file: UploadFile = File(...)):
    """
    Primary endpoint: Ingests medical lab report (PDF/JPG/PNG).
    Performs safe temporary file handling, OCR/PDF extraction,
    PII sanitization, and structured educational explanation.
    Never invents missing values or reference ranges.
    """
    start_time = time.time()
    ext = validate_upload(file)

    content = read_and_validate_upload(file, ext)

    # 2. Safe temporary file handling
    temp_file_path = None
    try:
        with tempfile.NamedTemporaryFile(delete=False, suffix=f".{ext}") as temp_file:
            temp_file.write(content)
            temp_file_path = temp_file.name

        # Read back from disk for safety verification
        with open(temp_file_path, "rb") as f:
            verified_bytes = f.read()

        # 3. Extract text (PDF native or Tesseract OCR)
        try:
            extracted_text, meta = extract_text_from_file(verified_bytes, file.filename)
        except pytesseract.pytesseract.TesseractNotFoundError:
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail="Tesseract OCR is unavailable. Install Tesseract and configure TESSERACT_CMD to process scanned reports."
            )
        except Exception as e:
            logger.info("Could not extract uploaded document: %s", e)
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail="This file could not be read as a valid document. Please check that it is not damaged and try another copy."
            )

        if not extracted_text or not extracted_text.strip():
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail="Unable to extract legible text from this document. Please ensure the scan is clear, well-lit, in focus, and not blank."
            )

        # 4. Extract real biomarkers without inventing missing values
        biomarkers = extract_structured_biomarkers(extracted_text)
        insights = generate_educational_insights(biomarkers, extracted_text)

        elapsed_ms = int((time.time() - start_time) * 1000)

        # Infer title from text or filename
        report_title = "Laboratory Test Report"
        lower_text = extracted_text.lower()
        if "complete blood count" in lower_text or "cbc" in lower_text:
            report_title = "Complete Blood Count (CBC)"
        elif "lipid" in lower_text or "cholesterol" in lower_text:
            report_title = "Lipid Profile (Cholesterol & Fats)"
        elif "metabolic" in lower_text or "liver" in lower_text or "kidney" in lower_text:
            report_title = "Comprehensive Metabolic Panel (CMP)"

        # Call Gemini to get structured test items (may raise RuntimeError)
        try:
            gemini_results = extract_structured_results(extracted_text)
        except Exception as e:
            logger.error(f"Gemini integration failed: {e}")
            gemini_results = []  # fallback to empty list

        return ReportAnalyzeResponse(
            status="success",
            filename=file.filename,
            extraction_method=meta.get("extraction_method", "unknown"),
            page_count=meta.get("page_count", 1),
            character_count=len(extracted_text),
            processing_time_ms=elapsed_ms,
            extracted_text=extracted_text,
            report_title=report_title,
            summary=insights["summary"],
            biomarkers=biomarkers,
            questions_for_doctor=insights["questions_for_doctor"],
            lifestyle_tips=insights["lifestyle_tips"],
            gemini_results=gemini_results,
            meta=meta
        )

    except HTTPException:
        raise
    except Exception as e:
        logger.exception("Internal error analyzing report")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred while analyzing the document: {str(e)}"
        )
    finally:
        # Safe cleanup: Always remove temporary file from disk
        if temp_file_path and os.path.exists(temp_file_path):
            try:
                os.unlink(temp_file_path)
            except Exception as e:
                logger.warning(f"Could not remove temporary file {temp_file_path}: {e}")


@router.post("/extract", response_model=ExtractionResponse)
def extract_document(file: UploadFile = File(...)):
    """
    Lightweight extraction endpoint returning raw sanitized text.
    """
    ext = validate_upload(file)
    content = read_and_validate_upload(file, ext)

    try:
        extracted_text, meta = extract_text_from_file(content, file.filename)
    except pytesseract.pytesseract.TesseractNotFoundError:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Tesseract OCR is unavailable. Install Tesseract and configure TESSERACT_CMD to process scanned reports."
        )
    except Exception as e:
        logger.info("Could not extract uploaded document: %s", e)
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="This file could not be read as a valid document. Please check that it is not damaged and try another copy."
        )
    if not extracted_text.strip():
        raise HTTPException(status_code=422, detail="No legible text extracted.")

    return ExtractionResponse(
        filename=file.filename,
        extracted_text=extracted_text,
        method=meta.get("extraction_method", "unknown"),
        page_count=meta.get("page_count", 1),
        character_count=len(extracted_text),
        meta=meta
    )
