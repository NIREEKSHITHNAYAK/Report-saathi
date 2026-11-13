import type { HealthResponse, ExtractionResponse, ReportAnalyzeResponse } from '../types/report';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export async function checkBackendHealth(): Promise<HealthResponse> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/health`);
    if (!res.ok) {
      throw new Error(`Server returned status ${res.status}`);
    }
    return await res.json();
  } catch (err: any) {
    throw new Error(err.message || 'Unable to connect to ReportSaathi backend');
  }
}

export async function analyzeReport(file: File): Promise<ReportAnalyzeResponse> {
  const formData = new FormData();
  formData.append('file', file);

  const res = await fetch(`${API_BASE_URL}/api/reports/analyze`, {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    let errorDetail = 'Failed to analyze report';
    try {
      const errorJson = await res.json();
      if (errorJson.detail) {
        errorDetail = errorJson.detail;
      }
    } catch {
      // fallback
    }
    throw new Error(errorDetail);
  }

  return await res.json();
}

export async function extractDocument(file: File): Promise<ExtractionResponse> {
  const formData = new FormData();
  formData.append('file', file);

  const res = await fetch(`${API_BASE_URL}/api/extract`, {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    let errorDetail = 'Failed to extract text from document';
    try {
      const errorJson = await res.json();
      if (errorJson.detail) {
        errorDetail = errorJson.detail;
      }
    } catch {
      // fallback
    }
    throw new Error(errorDetail);
  }

  return await res.json();
}
