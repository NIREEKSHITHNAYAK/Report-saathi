import io
import asyncio
import httpx
from PIL import Image, ImageDraw
from app.main import app

async def run_test():
    img = Image.new('RGB', (450, 100), color=(255, 255, 255))
    d = ImageDraw.Draw(img)
    d.text((15, 30), "Platelets: 250000 /cumm [NORMAL]", fill=(0, 0, 0))

    img_bytes = io.BytesIO()
    img.save(img_bytes, format='PNG')
    raw_data = img_bytes.getvalue()

    transport = httpx.ASGITransport(app=app)
    async with httpx.AsyncClient(transport=transport, base_url="http://test") as client:
        files = {"file": ("test_platelets.png", raw_data, "image/png")}
        response = await client.post("/api/extract", files=files)
        print("Status code:", response.status_code)
        data = response.json()
        print("Response data:", data)
        assert response.status_code == 200
        assert data["character_count"] > 0
        assert "250000" in data["extracted_text"] or "Platelet" in data["extracted_text"]
        print("Async ASGI /api/extract test passed successfully!")

if __name__ == "__main__":
    asyncio.run(run_test())
