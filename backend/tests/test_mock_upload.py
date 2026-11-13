import io
from PIL import Image, ImageDraw
from app.api.routes_analyze import extract_document

class MockFileWrapper:
    def __init__(self, content: bytes):
        self._content = content
    def read(self):
        return self._content

class MockUploadFile:
    def __init__(self, filename: str, content: bytes):
        self.filename = filename
        self.file = MockFileWrapper(content)

def main():
    img = Image.new('RGB', (450, 100), color=(255, 255, 255))
    d = ImageDraw.Draw(img)
    d.text((15, 30), "Platelets: 250000 /cumm [NORMAL]", fill=(0, 0, 0))
    buf = io.BytesIO()
    img.save(buf, format='PNG')
    
    mock = MockUploadFile('test.png', buf.getvalue())
    res = extract_document(mock)
    print("Endpoint verified successfully!")
    print("  File:", res.filename)
    print("  Method:", res.method)
    print("  Chars:", res.character_count)
    print("  Text:", res.extracted_text)
    assert res.character_count > 0
    assert "250000" in res.extracted_text or "Platelet" in res.extracted_text

if __name__ == "__main__":
    main()
