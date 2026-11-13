export interface Biomarker {
  name: string;
  value: string;
  unit?: string;
  reference_range?: string;
  status: 'Normal' | 'High' | 'Low' | 'Borderline' | 'Unknown';
  plain_explanation: string;
  what_it_means: string;
}

export interface BiomarkerPanel {
  category_name: string;
  biomarkers: Biomarker[];
}

export interface DoctorQuestion {
  topic: string;
  question: string;
  context: string;
}

export interface ReportAnalyzeResponse {
  status: string;
  filename: string;
  extraction_method: string;
  page_count: number;
  character_count: number;
  processing_time_ms: number;
  extracted_text: string;
  report_title: string;
  summary: string;
  biomarkers: Biomarker[];
  questions_for_doctor: DoctorQuestion[];
  lifestyle_tips: string[];
  disclaimer: string;
  meta?: Record<string, any>;
}

export interface HealthResponse {
  status: string;
  app: string;
  version: string;
  ocr_engine?: string;
  supported_formats?: string[];
}

export interface ExtractionResponse {
  filename: string;
  extracted_text: string;
  method: string;
  page_count: number;
  character_count: number;
  meta: Record<string, any>;
}
