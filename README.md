# ReportSaathi 🩺

ReportSaathi is an educational web application that simplifies medical laboratory reports (such as Complete Blood Count, Lipid Profile, and Metabolic Panels) into clear, reassuring, plain-language explanations.

> **Disclaimer**: ReportSaathi is built for educational healthcare empowerment only and does not provide medical diagnoses, treatment advice, or prescriptions. Always consult a qualified physician or healthcare provider for medical advice.

---

## Architecture & Tech Stack

- **Frontend**: React 19 + TypeScript + Vite + Tailwind CSS + Lucide Icons
- **Backend**: Python 3.12 + FastAPI + Pydantic v2
- **Document Processing**: Tesseract OCR v5 + PyMuPDF / pdfplumber + Pillow
- **AI Engine**: Google Gemini API (Structured Schema Output)
- **Database / Auth (Optional)**: Supabase

---

## Getting Started Locally

### 1. Backend Setup
```bash
cd backend
python -m venv venv
# On Windows:
.\venv\Scripts\activate
# On Linux/macOS:
source venv/bin/activate

pip install -r requirements.txt
# Windows PowerShell:
Copy-Item .env.example .env
# Linux/macOS:
cp .env.example .env

uvicorn app.main:app --reload --port 8000
```

Install Tesseract OCR separately and make sure `tesseract` is on `PATH`. If it is installed elsewhere, set `TESSERACT_CMD` in `backend/.env` to the executable path. The API accepts PDF, JPG/JPEG, and PNG files up to 10 MB at `POST /api/reports/analyze`; `GET /api/health` reports API and OCR availability. Scanned PDFs and images require Tesseract. Missing reference ranges are left unspecified and are not treated as normal.

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173` in your browser. The frontend defaults to `http://localhost:8000` for the API; set `VITE_API_URL` in a frontend `.env` file to override it.
