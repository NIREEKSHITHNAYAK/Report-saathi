import os
import json
import logging
from typing import List, Dict, Any

import google.generativeai as genai

logger = logging.getLogger(__name__)

# Initialise Gemini client
API_KEY = os.getenv("GEMINI_API_KEY")
if not API_KEY:
    logger.warning("GEMINI_API_KEY not set; Gemini integration will be disabled.")
else:
    genai.configure(api_key=API_KEY)

# Prompt template for extracting structured test results
_PROMPT_TEMPLATE = """
You are an expert medical lab report interpreter. Given the raw extracted text from a laboratory report, produce a JSON array where each element corresponds to a lab test with the following fields:
- test_name: the exact name of the test as it appears in the report.
- extracted_value: the numeric or textual result extracted from the report (as a string). If the value is missing, set to null.
- unit: the measurement unit if present, otherwise null.
- reference_range: the reference range string exactly as printed, if present, otherwise null.
- explanation: a short, plain‑language explanation of what the test measures and what the result could mean. Do NOT provide diagnosis, treatment, or certainty statements.
- note: if any information is missing, ambiguous, or unclear, include a brief note advising the user to consult a qualified clinician. Otherwise omit this field.

Return ONLY a JSON array (no surrounding text). Do not fabricate any values, units or ranges; if they are not present in the input, set the corresponding fields to null.

Report text:
"""

def extract_structured_results(report_text: str) -> List[Dict[str, Any]]:
    """Send the report text to Gemini and return a list of structured results.

    Raises:
        RuntimeError: if Gemini response cannot be parsed or API key missing.
    """
    if not API_KEY:
        raise RuntimeError("GEMINI_API_KEY not configured.")

    prompt = _PROMPT_TEMPLATE + "\n" + report_text.strip() + "\n"
    try:
        model = genai.GenerativeModel("gemini-1.5-flash")
        response = model.generate_content(prompt)
        # Gemini may return text with surrounding whitespace
        json_text = response.text.strip()
        # Ensure it is a JSON array
        data = json.loads(json_text)
        if not isinstance(data, list):
            raise ValueError("Gemini response is not a JSON array.")
        return data
    except Exception as e:
        logger.exception("Gemini extraction failed")
        raise RuntimeError(f"Gemini extraction error: {e}")
