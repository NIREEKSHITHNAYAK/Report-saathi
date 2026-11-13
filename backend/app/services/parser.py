import re
from typing import List, Dict, Any, Optional
from app.schemas.report import Biomarker, DoctorQuestion

# Knowledge base of clinical biomarkers, everyday analogies, and educational explanations
BIOMARKER_KNOWLEDGE = {
    "hemoglobin": {
        "display_name": "Hemoglobin (Hb)",
        "category": "Red Blood Cells",
        "analogy": "Hemoglobin is like a fleet of delivery trucks transporting oxygen from your lungs to your muscles and brain.",
        "plain_explanation": "A specialized protein packed inside red blood cells that binds oxygen.",
        "low_meaning": "Lower than typical, which commonly causes fatigue, low energy, or lightheadedness (mild anemia).",
        "high_meaning": "Higher than typical, which can happen with dehydration, smoking, or living at higher altitudes.",
        "normal_meaning": "Optimal oxygen-carrying capacity in your bloodstream."
    },
    "rbc": {
        "display_name": "RBC (Red Blood Cell Count)",
        "category": "Red Blood Cells",
        "analogy": "Think of red blood cells as the individual delivery vehicles traveling through your circulatory highway.",
        "plain_explanation": "The total number of oxygen-carrying cells circulating in your blood.",
        "low_meaning": "Fewer oxygen-carrying vehicles than average, consistent with anemia.",
        "high_meaning": "Above average concentration of red blood cells.",
        "normal_meaning": "Normal red cell count supporting healthy daily stamina."
    },
    "hematocrit": {
        "display_name": "Hematocrit (PCV)",
        "category": "Red Blood Cells",
        "analogy": "Hematocrit is like traffic density: the percentage of whole blood that consists of red cells.",
        "plain_explanation": "The proportion of red blood cells relative to plasma fluid.",
        "low_meaning": "A smaller proportion of your blood is solid red cells.",
        "high_meaning": "Higher concentration of red cells, often associated with dehydration.",
        "normal_meaning": "Healthy ratio of cells to fluid."
    },
    "mcv": {
        "display_name": "Mean Corpuscular Volume (MCV)",
        "category": "Red Blood Cells",
        "analogy": "MCV measures the average physical 'shoe size' of each red blood cell.",
        "plain_explanation": "Indicates whether red blood cells are small, normal, or enlarged.",
        "low_meaning": "Red blood cells are smaller than average (microcytic), often indicating iron deficiency.",
        "high_meaning": "Red blood cells are larger than average (macrocytic), often linked to Vitamin B12 or folate status.",
        "normal_meaning": "Normal cell size (normocytic)."
    },
    "wbc": {
        "display_name": "Total Leukocyte Count (WBC)",
        "category": "Immune System",
        "analogy": "White blood cells are your body's personal security team, defending against bacterial and viral invaders.",
        "plain_explanation": "Primary frontline defense cells of your immune system.",
        "low_meaning": "Lower immune cell count, which may make fighting infections more challenging.",
        "high_meaning": "Elevated immune cell count, often a natural response to recent infection, stress, or inflammation.",
        "normal_meaning": "Balanced immune defense showing no active acute infection."
    },
    "platelets": {
        "display_name": "Platelet Count",
        "category": "Clotting",
        "analogy": "Platelets are microscopic emergency road-repair kits that seal tiny leaks whenever tissue gets scraped.",
        "plain_explanation": "Cell fragments responsible for normal blood clotting and stopping bleeding.",
        "low_meaning": "Fewer clotting fragments, which may cause easier bruising or prolonged bleeding.",
        "high_meaning": "Higher clotting fragments, often responsive to inflammation or infection.",
        "normal_meaning": "Optimal clotting ability for everyday health."
    },
    "cholesterol": {
        "display_name": "Total Cholesterol",
        "category": "Lipid Profile",
        "analogy": "Total cholesterol is the total count of all fat particles circulating in your bloodstream.",
        "plain_explanation": "The combined measurement of HDL, LDL, and other circulating blood fats.",
        "low_meaning": "Unusually low cholesterol levels.",
        "high_meaning": "Elevated circulating fats; suggests prioritizing heart-healthy nutrition and active movement.",
        "normal_meaning": "Desirable cardiovascular cholesterol balance."
    },
    "ldl": {
        "display_name": "LDL Cholesterol ('Bad')",
        "category": "Lipid Profile",
        "analogy": "LDL is like delivery trucks that can drop sticky cargo on artery walls if there are too many on the road.",
        "plain_explanation": "Lipoprotein that delivers cholesterol to tissues; excess can accumulate as arterial plaque.",
        "low_meaning": "Optimal, very clean arterial lipid environment.",
        "high_meaning": "Above desirable target; a valuable signal to focus on soluble fiber, exercise, and healthy fats.",
        "normal_meaning": "Healthy low-risk range for cardiovascular wellness."
    },
    "hdl": {
        "display_name": "HDL Cholesterol ('Good')",
        "category": "Lipid Profile",
        "analogy": "HDL acts like street-sweeper trucks that scrub excess fat off arterial walls and return it to the liver.",
        "plain_explanation": "High-Density Lipoprotein that protects against cardiovascular plaque accumulation.",
        "low_meaning": "Lower protective reserve; aerobic exercise and olive oil can help raise this.",
        "high_meaning": "High protective reserve supporting heart health.",
        "normal_meaning": "Desirable level of protective HDL."
    },
    "triglycerides": {
        "display_name": "Triglycerides",
        "category": "Lipid Profile",
        "analogy": "Triglycerides are fuel reserve tanks that store unused calories from dietary sugars, carbs, and fats.",
        "plain_explanation": "The most common form of stored fat circulating in your bloodstream.",
        "low_meaning": "Very low circulating triglycerides.",
        "high_meaning": "Elevated circulating fuel; often responds very quickly to reducing sweetened drinks, alcohol, and refined carbs.",
        "normal_meaning": "Healthy circulating fuel storage level."
    },
    "glucose": {
        "display_name": "Fasting Blood Glucose",
        "category": "Metabolism",
        "analogy": "Glucose is the fuel in your blood; when fasting, your body should keep fuel levels below 100 mg/dL.",
        "plain_explanation": "Measures circulating blood sugar after an overnight fast.",
        "low_meaning": "Below standard fasting range; may cause shakiness or sweating.",
        "high_meaning": "Elevated fasting blood sugar; an empowering early opportunity to balance carbs, protein, and post-meal walks.",
        "normal_meaning": "Optimal fasting glucose regulation."
    },
    "creatinine": {
        "display_name": "Serum Creatinine",
        "category": "Kidney Health",
        "analogy": "Creatinine is natural muscle breakdown debris that your kidney filters are constantly clearing away.",
        "plain_explanation": "Standard benchmark of kidney filtration efficiency.",
        "low_meaning": "Low muscle mass or lower protein intake.",
        "high_meaning": "Slower filtration clearance; important to correlate with hydration and discuss with your doctor.",
        "normal_meaning": "Kidney filters are operating cleanly and effectively."
    },
    "egfr": {
        "display_name": "eGFR (Kidney Filtration Rate)",
        "category": "Kidney Health",
        "analogy": "eGFR is the speed and efficiency rating of your kidney filtration system.",
        "plain_explanation": "Calculates how many milliliters of blood your kidneys clean each minute.",
        "low_meaning": "Filtration rate is reduced below standard optimal pace.",
        "high_meaning": "Excellent, high-capacity filtration performance.",
        "normal_meaning": "Normal kidney filtration capacity (> 60-90 mL/min)."
    },
    "alt": {
        "display_name": "ALT / SGPT (Liver Enzyme)",
        "category": "Liver Health",
        "analogy": "An enzyme tucked safely inside liver cells; when liver cells are irritated or stressed, it spills into blood.",
        "plain_explanation": "A primary benchmark of liver cellular integrity.",
        "low_meaning": "Completely normal.",
        "high_meaning": "Indicates mild liver cellular stress, which can occur with certain medications, alcohol, or fatty liver.",
        "normal_meaning": "Healthy, unstressed liver tissue with minimal enzyme spillover."
    },
    "ast": {
        "display_name": "AST / SGOT (Liver Enzyme)",
        "category": "Liver Health",
        "analogy": "Another cellular enzyme found in liver and muscle cells.",
        "plain_explanation": "Evaluates liver and muscle tissue health.",
        "low_meaning": "Normal.",
        "high_meaning": "May indicate liver or muscle irritation.",
        "normal_meaning": "Normal range; no significant cellular release."
    },
    "potassium": {
        "display_name": "Potassium (Electrolyte)",
        "category": "Electrolytes",
        "analogy": "Governs the electrical rhythm of your heartbeat and smooth muscle contractions.",
        "plain_explanation": "Crucial mineral regulating cardiac and muscular conductivity.",
        "low_meaning": "Low potassium can trigger muscle cramps or cardiac fatigue.",
        "high_meaning": "High potassium requires medical attention to safeguard heart rhythms.",
        "normal_meaning": "Optimal cardiac and muscular electrolyte balance."
    },
    "sodium": {
        "display_name": "Sodium (Electrolyte)",
        "category": "Electrolytes",
        "analogy": "Regulates water pressure and fluid balance between the inside and outside of your cells.",
        "plain_explanation": "Vital mineral controlling total body hydration and nerve signaling.",
        "low_meaning": "May cause headache or fatigue; often tied to hydration imbalances or diuretics.",
        "high_meaning": "Often caused by dehydration or high fluid loss.",
        "normal_meaning": "Healthy fluid and electrolyte equilibrium."
    }
}


def parse_reference_range(range_str: Optional[str]) -> Optional[tuple]:
    """
    Parse reference range string like '12.0 - 15.5' or '< 200' or '> 40'.
    Returns (low, high) floats if parsable, else None.
    """
    if not range_str:
        return None
    try:
        # Check for range: '12.0 - 15.5'
        match_range = re.search(r'([0-9]+(?:\.[0-9]+)?)\s*[-–—to]+\s*([0-9]+(?:\.[0-9]+)?)', range_str, re.IGNORECASE)
        if match_range:
            return float(match_range.group(1)), float(match_range.group(2))
        
        # Check for less than: '< 200' or '<= 200'
        match_lt = re.search(r'[<≤]\s*([0-9]+(?:\.[0-9]+)?)', range_str)
        if match_lt:
            return 0.0, float(match_lt.group(1))

        # Check for greater than: '> 40'
        match_gt = re.search(r'[>≥]\s*([0-9]+(?:\.[0-9]+)?)', range_str)
        if match_gt:
            return float(match_gt.group(1)), 999999.0
    except Exception:
        pass
    return None


def evaluate_status(value_str: str, range_str: Optional[str], text_flag: Optional[str]) -> str:
    """
    Determine if a value is Normal, High, Low, or Borderline based strictly
    on extracted reference range and printed report flags.
    Never invents or guesses if missing.
    """
    # 1. Respect explicitly printed report flags if present
    if text_flag:
        flag_upper = text_flag.upper()
        if "HIGH" in flag_upper or "ELEVATED" in flag_upper or flag_upper == "H":
            return "High"
        if "LOW" in flag_upper or "DECREASED" in flag_upper or flag_upper == "L":
            return "Low"
        if "BORDERLINE" in flag_upper:
            return "Borderline"
        if "NORMAL" in flag_upper or flag_upper == "N":
            return "Normal"

    # 2. Evaluate against parsed reference range
    if range_str:
        bounds = parse_reference_range(range_str)
        if bounds:
            try:
                # Remove commas, e.g. 7,400 -> 7400
                val_clean = re.sub(r'[^0-9\.]', '', value_str)
                val_num = float(val_clean)
                low, high = bounds
                if val_num < low:
                    return "Low"
                elif val_num > high:
                    return "High"
                else:
                    return "Normal"
            except Exception:
                pass

    return "Unknown"


def extract_structured_biomarkers(raw_text: str) -> List[Biomarker]:
    """
    Extracts real lab biomarkers directly present in the text.
    Never invents missing values or reference ranges.
    """
    biomarkers: List[Biomarker] = []
    seen_keys = set()
    lines = raw_text.split('\n')

    # Keyword patterns for known markers
    patterns = {
        "hemoglobin": [r'\b(hemoglobin|hb|haemoglobin)\b'],
        "rbc": [r'\b(rbc|red\s*blood\s*cell|total\s*rbc)\b'],
        "hematocrit": [r'\b(hematocrit|pcv|packed\s*cell\s*volume)\b'],
        "mcv": [r'\b(mcv|mean\s*corpuscular\s*vol)\b'],
        "wbc": [r'\b(wbc|total\s*leucocyte\s*count|white\s*blood\s*cell|tlc)\b'],
        "platelets": [r'\b(platelet|platelets|thrombocyte)\b'],
        "cholesterol": [r'\b(total\s*cholesterol|serum\s*cholesterol)\b'],
        "ldl": [r'\b(ldl|ldl\s*cholesterol|bad\s*cholesterol)\b'],
        "hdl": [r'\b(hdl|hdl\s*cholesterol|good\s*cholesterol)\b'],
        "triglycerides": [r'\b(triglyceride|triglycerides|tg)\b'],
        "glucose": [r'\b(fasting\s*glucose|fasting\s*blood\s*sugar|fbs|glucose\s*fasting)\b'],
        "creatinine": [r'\b(creatinine|serum\s*creatinine)\b'],
        "egfr": [r'\b(egfr|estimated\s*gfr|gfr)\b'],
        "alt": [r'\b(alt|sgpt|alanine\s*aminotransferase)\b'],
        "ast": [r'\b(ast|sgot|aspartate\s*aminotransferase)\b'],
        "potassium": [r'\b(potassium|serum\s*potassium)\b'],
        "sodium": [r'\b(sodium|serum\s*sodium)\b']
    }

    for line in lines:
        line_clean = line.strip()
        if not line_clean or len(line_clean) < 4:
            continue

        for key, regexes in patterns.items():
            if key in seen_keys:
                continue

            matched = False
            for r in regexes:
                if re.search(r, line_clean, re.IGNORECASE):
                    matched = True
                    break

            if matched:
                # Find numerical values on the line (ignoring patient ID or dates)
                # Look for numbers, optionally with commas and decimals
                numbers = re.findall(r'\b[0-9]{1,3}(?:,[0-9]{3})*(?:\.[0-9]+)?\b', line_clean)
                if numbers:
                    observed_val = numbers[0].replace(',', '')
                    
                    # Look for reference range string on the same line (e.g. 12.0 - 15.5 or < 200 or 40 - 75)
                    range_match = re.search(r'([<>]?\s*[0-9]+(?:\.[0-9]+)?\s*[-–—to]\s*[0-9]+(?:\.[0-9]+)?|[<≤>≥]\s*[0-9]+(?:\.[0-9]+)?)', line_clean)
                    extracted_range = range_match.group(0).strip() if range_match else None

                    # Look for units on the line (e.g., g/dL, mg/dL, %, /cumm, fL, pg)
                    unit_match = re.search(r'\b(g/dl|mg/dl|%|/cumm|cells/mcl|mill/cumm|fl|pg|u/l|meq/l|mmol/l)\b', line_clean, re.IGNORECASE)
                    extracted_unit = unit_match.group(0) if unit_match else None

                    # Check for printed status flags like [LOW], [HIGH], High, Low, Normal
                    flag_match = re.search(r'\[?(HIGH|LOW|NORMAL|BORDERLINE|ELEVATED)\]?', line_clean, re.IGNORECASE)
                    flag_str = flag_match.group(1) if flag_match else None

                    status = evaluate_status(observed_val, extracted_range, flag_str)
                    knowledge = BIOMARKER_KNOWLEDGE[key]

                    if status == "Low":
                        what_it_means = knowledge["low_meaning"]
                    elif status == "High":
                        what_it_means = knowledge["high_meaning"]
                    elif status == "Borderline":
                        what_it_means = "The report marks this result as borderline; discuss its meaning with your healthcare provider."
                    elif status == "Unknown":
                        what_it_means = "The report does not include a readable reference range or status, so this value was not classified."
                    else:
                        what_it_means = knowledge["normal_meaning"]

                    biomarkers.append(Biomarker(
                        name=knowledge["display_name"],
                        value=observed_val,
                        unit=extracted_unit,
                        reference_range=extracted_range,  # None if not printed on report (never invent!)
                        status=status,
                        plain_explanation=knowledge["analogy"],
                        what_it_means=what_it_means
                    ))
                    seen_keys.add(key)
                    break

    return biomarkers


def generate_educational_insights(biomarkers: List[Biomarker], raw_text: str) -> Dict[str, Any]:
    """
    Generate questions for doctor, overview summary, and educational habits
    strictly based on the detected biomarkers.
    """
    questions: List[DoctorQuestion] = []
    attention_biomarkers = [b for b in biomarkers if b.status in {"High", "Low", "Borderline"}]
    unassessed_biomarkers = [b for b in biomarkers if b.status == "Unknown"]

    # Generate tailored questions for out-of-range biomarkers
    for b in attention_biomarkers:
        if "Hemoglobin" in b.name or "RBC" in b.name:
            questions.append(DoctorQuestion(
                topic=f"{b.name} ({b.value} {b.unit or ''})",
                question=f"Could my {b.name} reading be related to dietary iron intake, absorption, or another source of red cell loss?",
                context="Clarifies whether you need a ferritin (stored iron) check or simple nutritional adjustments."
            ))
        elif "Cholesterol" in b.name or "LDL" in b.name or "Triglycerides" in b.name:
            questions.append(DoctorQuestion(
                topic=f"{b.name} ({b.value} {b.unit or ''})",
                question=f"What dietary and aerobic exercise targets would you recommend to help bring my {b.name} into desirable range?",
                context="Determines whether a 3-month lifestyle trial is appropriate before considering lipid medication."
            ))
        elif "Glucose" in b.name:
            questions.append(DoctorQuestion(
                topic=f"Fasting Glucose ({b.value} {b.unit or ''})",
                question="Would you recommend checking my HbA1c to evaluate my average 3-month blood sugar balance?",
                context="HbA1c provides a continuous 90-day view rather than a single-day fasting snapshot."
            ))
        elif "Creatinine" in b.name:
            questions.append(DoctorQuestion(
                topic=f"Serum Creatinine ({b.value} {b.unit or ''})",
                question="Could my creatinine level be influenced by recent hydration levels or muscle activity?",
                context="Helps assess whether hydration or re-testing in a few weeks is appropriate."
            ))

    if not questions and unassessed_biomarkers:
        questions.append(DoctorQuestion(
            topic="Missing reference range or status",
            question="Could you confirm the reference range or interpretation for the extracted result?",
            context="The report did not provide a readable range or status, so this result was not classified."
        ))
    elif not questions:
        questions.append(DoctorQuestion(
            topic="Overall Health Maintenance",
            question="Are there any preventive health habits or routine screenings you recommend for my age and lifestyle?",
            context="Proactive discussions help maintain healthy biomarker numbers year-round."
        ))

    # Overall Summary
    if attention_biomarkers:
        attention_names = ", ".join([b.name for b in attention_biomarkers[:2]])
        summary = f"The report marks {attention_names} outside the printed reference range. Discuss these results with your healthcare provider."
    elif unassessed_biomarkers:
        unassessed_names = ", ".join([b.name for b in unassessed_biomarkers[:2]])
        summary = f"A readable reference range or report status was not available for {unassessed_names}. These values have not been classified as normal or abnormal."
    elif biomarkers:
        summary = "The extracted markers with readable report ranges or flags are marked within range. Review the report with your healthcare provider for context."
    else:
        summary = "No recognizable biomarker values could be extracted. Review the extracted text and consult your healthcare provider for interpretation."

    lifestyle_tips = [
        "Stay consistently hydrated throughout the day; dehydration can temporarily concentrate blood values.",
        "Eat a colorful variety of whole fruits, leafy vegetables, and fiber to support cardiovascular and metabolic health.",
        "Aim for 20-30 minutes of moderate physical activity daily to promote optimal circulation and immune function."
    ]

    return {
        "summary": summary,
        "questions_for_doctor": questions,
        "lifestyle_tips": lifestyle_tips
    }
