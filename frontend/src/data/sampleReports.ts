import type { ExtractionResponse } from '../types/report';

export const SAMPLE_CBC_REPORT: ExtractionResponse = {
  filename: 'Sample_Complete_Blood_Count.pdf',
  method: 'pdf_native',
  page_count: 1,
  character_count: 620,
  extracted_text: `METROPOLIS HEALTH DIAGNOSTICS
PATIENT ID: [REDACTED_ID]
NAME: [REDACTED_NAME]
AGE: 34 Y / FEMALE
COLLECTED: 12-Nov-2026

COMPLETE BLOOD COUNT (CBC)
-------------------------------------------------------------------
Test Description              Observed Value   Reference Range   Unit
-------------------------------------------------------------------
Hemoglobin (Hb)               10.2             12.0 - 15.5       g/dL     [LOW]
Packed Cell Volume (PCV)      31.5             36.0 - 46.0       %        [LOW]
RBC Count                     3.8              3.80 - 5.20       mill/cumm
Mean Corpuscular Vol (MCV)    76.0             80.0 - 100.0      fL       [LOW]
MCH                           24.1             27.0 - 33.0       pg       [LOW]
MCHC                          31.0             32.0 - 36.0       g/dL     [LOW]
Total Leucocyte Count (WBC)   7,400            4,000 - 11,000    /cumm    [NORMAL]
Platelet Count                245,000          150,000 - 450,000 /cumm    [NORMAL]

DIFFERENTIAL LEUCOCYTE COUNT (DLC)
Neutrophils                   62               40 - 75           %
Lymphocytes                   28               20 - 45           %
Monocytes                     6                2 - 10            %
Eosinophils                   3                1 - 6             %
Basophils                     1                0 - 1             %
-------------------------------------------------------------------
Note: Microcytic hypochromic red cell picture observed. Correlate clinically.`,
  meta: {
    extraction_method: 'pdf_native',
    sample: true,
  },
};

export const SAMPLE_LIPID_REPORT: ExtractionResponse = {
  filename: 'Sample_Lipid_Profile.pdf',
  method: 'pdf_native',
  page_count: 1,
  character_count: 580,
  extracted_text: `APEX CLINICAL LABORATORIES
PATIENT ID: [REDACTED_ID]
NAME: [REDACTED_NAME]
AGE: 48 Y / MALE
FASTING: 12 Hours

LIPID PANEL (CHOLESTEROL PROFILE)
-------------------------------------------------------------------
Investigation                 Observed Value   Desirable Range   Unit
-------------------------------------------------------------------
Total Cholesterol             242              < 200             mg/dL    [HIGH]
Triglycerides                 195              < 150             mg/dL    [BORDERLINE HIGH]
HDL Cholesterol ('Good')      38               > 40              mg/dL    [LOW]
LDL Cholesterol ('Bad')       165              < 100             mg/dL    [HIGH]
VLDL Cholesterol              39               < 30              mg/dL    [HIGH]
Total / HDL Ratio             6.37             < 4.5                      [HIGH]
LDL / HDL Ratio               4.34             < 3.0                      [HIGH]
-------------------------------------------------------------------
Comments: Moderate hyperlipidemia detected. Fasting blood glucose recommended.`,
  meta: {
    extraction_method: 'pdf_native',
    sample: true,
  },
};
