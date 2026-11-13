from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

class Biomarker(BaseModel):
    name: str = Field(..., description="Name of the test or biomarker, e.g., 'Hemoglobin (Hb)'")
    value: str = Field(..., description="Observed result value from report, e.g., '10.2'")
    unit: Optional[str] = Field(None, description="Measurement unit, e.g., 'g/dL'")
    reference_range: Optional[str] = Field(None, description="Exact normal range printed on report; None if missing (never invented)")
    status: str = Field("Normal", description="Status: 'Normal', 'High', 'Low', or 'Borderline'")
    plain_explanation: str = Field(..., description="Everyday analogy or layman description of what this measures")
    what_it_means: str = Field(..., description="What the observed result indicates in plain English")

class BiomarkerPanel(BaseModel):
    category_name: str = Field(..., description="Category or panel, e.g., 'Complete Blood Count', 'Kidney Function'")
    biomarkers: List[Biomarker] = Field(default_factory=list)

class DoctorQuestion(BaseModel):
    topic: str = Field(..., description="Specific biomarker or concern")
    question: str = Field(..., description="Clear question the patient can ask their doctor")
    context: str = Field(..., description="Why this question is relevant based on the lab findings")

class ReportAnalyzeResponse(BaseModel):
    status: str = "success"
    filename: str
    extraction_method: str
    page_count: int
    character_count: int
    processing_time_ms: int
    extracted_text: str
    report_title: str = "Laboratory Test Report"
    summary: str
    biomarkers: List[Biomarker] = Field(default_factory=list)
    questions_for_doctor: List[DoctorQuestion] = Field(default_factory=list)
    lifestyle_tips: List[str] = Field(default_factory=list)
    disclaimer: str = (
        "This summary is generated for educational purposes only and is not medical advice, "
        "diagnosis, or treatment. Always consult a qualified physician or healthcare provider "
        "regarding any medical condition or laboratory results."
    )
    # New field for Gemini structured results
    gemini_results: List[Dict[str, Any]] = Field(default_factory=list, description="List of structured test items from Gemini")
    meta: Dict[str, Any] = Field(default_factory=dict)

class HealthResponse(BaseModel):
    status: str = "ok"
    app: str = "ReportSaathi API"
    version: str = "0.1.0"
    ocr_engine: str = "Tesseract OCR"
    supported_formats: List[str] = ["pdf", "jpg", "jpeg", "png"]

class ExtractionResponse(BaseModel):
    filename: str
    extracted_text: str
    method: str
    page_count: int
    character_count: int
    meta: dict = Field(default_factory=dict)
