import io
import os
import requests
from PIL import Image, ImageDraw

def test_live_server():
    base_url = os.environ.get("REPORTSAATHI_API_URL", "http://127.0.0.1:8000")

    # 1. Test Health endpoint
    r_health = requests.get(f"{base_url}/api/health", timeout=5)
    print("Health response:", r_health.status_code, r_health.json())
    assert r_health.status_code == 200
    assert r_health.json()["status"] == "ok"

    # 2. Test Invalid Format
    r_bad = requests.post(f"{base_url}/api/reports/analyze", files={"file": ("doc.txt", b"plain text", "text/plain")})
    print("Invalid format response:", r_bad.status_code, r_bad.json())
    assert r_bad.status_code == 400

    # 3. Test Live Image OCR Analysis
    img = Image.new('RGB', (600, 160), color=(255, 255, 255))
    d = ImageDraw.Draw(img)
    d.text((20, 25), "LIPID PROFILE (CHOLESTEROL)", fill=(0, 0, 0))
    d.text((20, 60), "Total Cholesterol: 242 mg/dL (< 200) [HIGH]", fill=(0, 0, 0))
    d.text((20, 95), "HDL Cholesterol: 38 mg/dL (> 40) [LOW]", fill=(0, 0, 0))

    buf = io.BytesIO()
    img.save(buf, format='PNG')
    
    r_upload = requests.post(
        f"{base_url}/api/reports/analyze",
        files={"file": ("my_lipid_test.png", buf.getvalue(), "image/png")},
        timeout=10
    )
    print("Upload status code:", r_upload.status_code)
    data = r_upload.json()
    print("Upload result:")
    print("  Report Title:", data.get("report_title"))
    print("  Extraction Method:", data.get("extraction_method"))
    print("  Biomarkers Detected:", [b["name"] for b in data.get("biomarkers", [])])
    print("  Summary snippet:", data.get("summary")[:80])
    print("  Doctor Questions:", len(data.get("questions_for_doctor", [])))
    print("  Processing Time:", data.get("processing_time_ms"), "ms")
    
    assert r_upload.status_code == 200
    assert data["status"] == "success"
    assert data["extracted_text"].strip()
    assert data["processing_time_ms"] >= 0
    assert len(data.get("biomarkers", [])) > 0
    print("Live HTTP End-to-End Test Passed Successfully!")

if __name__ == "__main__":
    test_live_server()
