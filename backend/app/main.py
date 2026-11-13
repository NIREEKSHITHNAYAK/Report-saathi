from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.schemas.report import HealthResponse
from app.api.routes_analyze import router as analyze_router

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="Backend API for ReportSaathi - Simplifying medical laboratory reports."
)

# CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows frontend on localhost
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routes
app.include_router(analyze_router)

import shutil
import pytesseract

@app.get("/api/health", response_model=HealthResponse)
def health_check():
    ocr_status = "Available" if shutil.which("tesseract") or settings.TESSERACT_CMD else "Unavailable"
    try:
        ver = pytesseract.get_tesseract_version()
        ocr_status = f"Tesseract OCR v{ver} (Ready)"
    except Exception:
        pass

    return HealthResponse(
        status="ok",
        app=settings.APP_NAME,
        version=settings.APP_VERSION,
        ocr_engine=ocr_status,
        supported_formats=["pdf", "jpg", "jpeg", "png"]
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host=settings.HOST, port=settings.PORT, reload=settings.DEBUG)
