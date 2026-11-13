import io
import re
import shutil
from typing import Dict, Any, Tuple
import pytesseract
from PIL import Image, ImageEnhance, ImageFilter
import pdfplumber
import pypdfium2

from app.config import settings

# Configure Tesseract binary path
if shutil.which("tesseract"):
    pass
elif settings.TESSERACT_CMD:
    pytesseract.pytesseract.tesseract_cmd = settings.TESSERACT_CMD


def mask_pii(text: str) -> str:
    """
    Mask common Personally Identifiable Information (PII) before text is sent to LLM.
    """
    if not text:
        return text

    # Mask email addresses
    text = re.sub(r'[\w\.-]+@[\w\.-]+\.\w+', '[REDACTED_EMAIL]', text)

    # Mask phone numbers (10+ digits with optional dashes, parens, country codes)
    text = re.sub(r'(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}', '[REDACTED_PHONE]', text)

    # Mask Patient ID / UHID / MRN
    text = re.sub(r'(?i)(patient\s*id|uhid|mrn|reg\s*no|bar\s*code|sample\s*id)\s*[:#-]?\s*[\w\d-]+', r'\1: [REDACTED_ID]', text)

    # Mask Patient Name labels (e.g. "Patient Name: Jane Doe", "Name: Jane Doe")
    text = re.sub(r'(?i)(patient\s*name|name\s*of\s*patient|pt\s*name)\s*[:#-]?\s*([A-Za-z\.\s]+)(?=\n|\r|,|;|\bAge\b|\bGender\b|\bSex\b|$)', r'\1: [REDACTED_NAME]', text)

    # Mask Doctor / Referrer Names
    text = re.sub(r'(?i)(referred\s*by|ref\s*by|dr\.?)\s*[:#-]?\s*([A-Za-z\.\s]+)(?=\n|\r|,|;|$)', r'\1: [REDACTED_DOCTOR]', text)

    return text


def clean_extracted_text(text: str) -> str:
    """
    Clean OCR / PDF text: normalize whitespace, remove non-printable characters.
    """
    if not text:
        return ""

    # Replace carriage returns with standard newlines
    text = text.replace('\r\n', '\n').replace('\r', '\n')

    # Remove non-printable control characters (except newline, tab)
    text = re.sub(r'[^\x20-\x7E\n\t]', ' ', text)

    # Collapse excessive blank lines
    text = re.sub(r'\n{3,}', '\n\n', text)

    # Collapse multiple inline spaces
    text = re.sub(r'[ \t]{2,}', ' ', text)

    return text.strip()


def preprocess_image_for_ocr(image: Image.Image) -> Image.Image:
    """
    Enhance contrast and convert to grayscale for higher Tesseract accuracy.
    """
    # Convert to grayscale
    gray = image.convert('L')
    
    # Increase contrast
    enhancer = ImageEnhance.Contrast(gray)
    enhanced = enhancer.enhance(1.8)
    
    # Mild sharpen
    sharpened = enhanced.filter(ImageFilter.SHARPEN)
    
    return sharpened


def extract_from_image_bytes(image_bytes: bytes) -> Tuple[str, Dict[str, Any]]:
    """
    Perform Tesseract OCR on image bytes.
    """
    image = Image.open(io.BytesIO(image_bytes))
    
    # Pre-process image
    processed_image = preprocess_image_for_ocr(image)
    
    # OCR with custom Tesseract PSM (Page Segmentation Mode 3: Fully automatic page segmentation)
    ocr_text = pytesseract.image_to_string(processed_image, config='--oem 3 --psm 3')
    
    cleaned = clean_extracted_text(ocr_text)
    masked = mask_pii(cleaned)

    meta = {
        "extraction_method": "ocr_tesseract",
        "page_count": 1,
        "image_size": f"{image.width}x{image.height}",
        "raw_char_count": len(ocr_text),
        "cleaned_char_count": len(masked)
    }
    return masked, meta


def extract_from_pdf_bytes(pdf_bytes: bytes) -> Tuple[str, Dict[str, Any]]:
    """
    Extract text from PDF. Tries digital text extraction first;
    falls back to OCR per page if digital extraction yields minimal text.
    """
    extracted_pages = []
    is_scanned_pdf = False
    
    # 1. Try digital text extraction with pdfplumber
    try:
        with pdfplumber.open(io.BytesIO(pdf_bytes)) as pdf:
            total_pages = len(pdf.pages)
            for page_num, page in enumerate(pdf.pages, start=1):
                page_text = page.extract_text(layout=True) or ""
                
                # If page has very little text (< 50 chars), it's likely an image/scan
                if len(page_text.strip()) < 50:
                    is_scanned_pdf = True
                    break
                extracted_pages.append(page_text)
    except Exception:
        is_scanned_pdf = True

    # 2. If it's a scanned PDF, render pages using pypdfium2 and OCR each page
    if is_scanned_pdf or len(extracted_pages) == 0:
        extracted_pages = []
        pdf = pypdfium2.PdfDocument(pdf_bytes)
        total_pages = len(pdf)
        
        for i in range(total_pages):
            page = pdf[i]
            # Render at 200 DPI (scale ~2.77) for high-quality OCR without excessive memory usage
            bitmap = page.render(scale=2.77)
            pil_image = bitmap.to_pil()
            processed_image = preprocess_image_for_ocr(pil_image)
            page_ocr = pytesseract.image_to_string(processed_image, config='--oem 3 --psm 3')
            extracted_pages.append(page_ocr)

        method = "ocr_tesseract_pdf"
    else:
        method = "pdf_native"

    combined_text = "\n\n--- Page Break ---\n\n".join(extracted_pages)
    cleaned = clean_extracted_text(combined_text)
    masked = mask_pii(cleaned)

    meta = {
        "extraction_method": method,
        "page_count": total_pages,
        "raw_char_count": len(combined_text),
        "cleaned_char_count": len(masked)
    }
    return masked, meta


def extract_text_from_file(file_bytes: bytes, filename: str) -> Tuple[str, Dict[str, Any]]:
    """
    Main entrypoint: extracts and sanitizes text from PDF or image files.
    """
    ext = filename.lower().split('.')[-1]
    
    if ext == 'pdf':
        return extract_from_pdf_bytes(file_bytes)
    elif ext in ['png', 'jpg', 'jpeg', 'webp', 'bmp', 'tiff', 'tif']:
        return extract_from_image_bytes(file_bytes)
    else:
        raise ValueError(f"Unsupported file format: '.{ext}'. Supported formats are PDF, PNG, JPG, JPEG, WEBP.")
