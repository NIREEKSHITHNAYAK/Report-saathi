import io
from PIL import Image, ImageDraw
from app.services.extractor import mask_pii, clean_extracted_text, extract_from_image_bytes

def test_pii_masking():
    raw_sample = """
    Patient Name: Johnathan Doe
    Age: 45 Y  Sex: Male
    UHID: 100984729
    Contact: +1-555-234-5678
    Email: john.doe@example.com
    Ref By Dr: Dr. Sarah Connor
    Hemoglobin: 13.8 g/dL (Normal: 13.0 - 17.0)
    """
    masked = mask_pii(raw_sample)
    assert "[REDACTED_NAME]" in masked
    assert "Johnathan Doe" not in masked
    assert "[REDACTED_PHONE]" in masked
    assert "+1-555-234-5678" not in masked
    assert "[REDACTED_EMAIL]" in masked
    assert "john.doe@example.com" not in masked
    assert "Hemoglobin: 13.8" in masked
    print("PII masking test passed.")

def test_ocr_extraction():
    # Create an image with legible text
    img = Image.new('RGB', (400, 100), color=(255, 255, 255))
    d = ImageDraw.Draw(img)
    d.text((20, 35), "Hemoglobin 14.2 g/dL Normal", fill=(0, 0, 0))

    img_byte_arr = io.BytesIO()
    img.save(img_byte_arr, format='PNG')
    img_bytes = img_byte_arr.getvalue()

    text, meta = extract_from_image_bytes(img_bytes)
    assert "Hemoglobin" in text or "14.2" in text
    assert meta["extraction_method"] == "ocr_tesseract"
    print("OCR extraction test passed with extracted text:", text.strip())

if __name__ == "__main__":
    test_pii_masking()
    test_ocr_extraction()
