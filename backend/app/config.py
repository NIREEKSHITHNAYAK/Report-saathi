import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    APP_NAME: str = "ReportSaathi API"
    APP_VERSION: str = "0.1.0"
    DEBUG: bool = True
    
    # Gemini
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    
    # Tesseract OCR
    TESSERACT_CMD: str = os.getenv("TESSERACT_CMD", r"D:\Tesseract OCR\tesseract.exe")

    # Server & CORS
    HOST: str = "127.0.0.1"
    PORT: int = 8000
    FRONTEND_URL: str = "http://localhost:5173"
    
    # Optional Supabase
    SUPABASE_URL: str = os.getenv("SUPABASE_URL", "")
    SUPABASE_KEY: str = os.getenv("SUPABASE_KEY", "")

    class Config:
        env_file = ".env"
        extra = "ignore"

settings = Settings()
