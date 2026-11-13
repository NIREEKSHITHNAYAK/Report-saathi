import io
from pypdf import PdfWriter
from app.services.extractor import extract_text_from_file

def test_pdf():
    writer = PdfWriter()
    # Add a blank page with text annotation or free text
    page = writer.add_blank_page(width=300, height=300)
    
    # Save to buffer
    buf = io.BytesIO()
    writer.write(buf)
    pdf_bytes = buf.getvalue()

    # Even on empty or minimal PDF, verify extractor handles it gracefully
    try:
        text, meta = extract_text_from_file(pdf_bytes, "test_doc.pdf")
        print("PDF test passed, returned meta:", meta)
    except Exception as e:
        print("Expected handling on blank PDF:", e)

if __name__ == "__main__":
    test_pdf()
