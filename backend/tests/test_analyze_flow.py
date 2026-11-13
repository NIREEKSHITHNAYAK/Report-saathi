import io
from PIL import Image, ImageDraw
from fastapi import HTTPException
from app.main import health_check
from app.api.routes_analyze import analyze_report
from app.services.parser import extract_structured_biomarkers

class MockFileWrapper:
    def __init__(self, content: bytes):
        self._content = content
    def read(self, size=-1):
        return self._content if size < 0 else self._content[:size]

class MockUploadFile:
    def __init__(self, filename: str, content: bytes):
        self.filename = filename
        self.file = MockFileWrapper(content)

def test_health():
    res = health_check()
    assert res.status == "ok"
    assert "Tesseract" in res.ocr_engine
    print("Health check passed:", res.model_dump())

def test_unsupported():
    mock = MockUploadFile("bad.exe", b"content")
    try:
        analyze_report(mock)
        assert False, "Should have raised HTTPException"
    except HTTPException as e:
        assert e.status_code == 400
        assert "Unsupported file format" in e.detail
        print("Unsupported format test passed.")

def test_empty():
    mock = MockUploadFile("empty.png", b"")
    try:
        analyze_report(mock)
        assert False, "Should have raised HTTPException"
    except HTTPException as e:
        assert e.status_code == 400
        assert "empty" in e.detail.lower()
        print("Empty file test passed.")

def test_upload_validation():
    mismatched = MockUploadFile("report.png", b"not a PNG")
    try:
        analyze_report(mismatched)
        assert False, "Should reject content that does not match the extension"
    except HTTPException as e:
        assert e.status_code == 400
        assert "contents do not match" in e.detail

    oversized = MockUploadFile("large.png", b"\x89PNG\r\n\x1a\n" + b"0" * (10 * 1024 * 1024))
    try:
        analyze_report(oversized)
        assert False, "Should reject files larger than 10 MB"
    except HTTPException as e:
        assert e.status_code == 413

    print("Upload signature and size tests passed.")

def test_missing_range_is_unassessed():
    biomarkers = extract_structured_biomarkers("Hemoglobin: 13.2 g/dL")
    assert len(biomarkers) == 1
    assert biomarkers[0].value == "13.2"
    assert biomarkers[0].reference_range is None
    assert biomarkers[0].status == "Unknown"
    print("Missing range is not classified as normal.")

def test_valid_image_ocr():
    img = Image.new('RGB', (600, 160), color=(255, 255, 255))
    d = ImageDraw.Draw(img)
    d.text((20, 25), "COMPLETE BLOOD COUNT (CBC)", fill=(0, 0, 0))
    d.text((20, 60), "Hemoglobin: 10.2 g/dL (12.0 - 15.5) [LOW]", fill=(0, 0, 0))
    d.text((20, 95), "Total Leucocyte Count (WBC): 6800 /cumm [NORMAL]", fill=(0, 0, 0))

    buf = io.BytesIO()
    img.save(buf, format='PNG')

    mock = MockUploadFile("sample_cbc.png", buf.getvalue())
    res = analyze_report(mock)
    assert res.status == "success"
    assert res.character_count > 0
    assert len(res.biomarkers) > 0
    
    hb = next((b for b in res.biomarkers if "Hemoglobin" in b.name), None)
    assert hb is not None
    assert "10.2" in hb.value
    assert hb.status == "Low"
    assert hb.reference_range is not None

    print("Valid OCR analysis test passed:")
    print("  Report Title:", res.report_title)
    print("  Biomarkers parsed:", [b.name for b in res.biomarkers])
    print("  Questions:", len(res.questions_for_doctor))
    print("  Processing time:", res.processing_time_ms, "ms")

if __name__ == "__main__":
    test_health()
    test_unsupported()
    test_empty()
    test_upload_validation()
    test_missing_range_is_unassessed()
    test_valid_image_ocr()
    print("All backend tests verified successfully!")
