export interface Biomarker {
  id: string;
  name: string;
  category: string;
  value: string;
  unit: string;
  reference_range: string;
  status: 'Normal' | 'High' | 'Low' | 'Borderline' | 'Unknown';
  analogy: string;
  plain_explanation: string;
  what_it_means: string;
}

export interface DoctorQuestion {
  id: string;
  topic: string;
  question: string;
  context: string;
}

export interface MockReport {
  id: string;
  title: string;
  patientInfo: {
    age: string;
    gender: string;
    sampleDate: string;
    sampleType: string;
  };
  summary: string;
  keyHighlights: {
    attentionCount: number;
    normalCount: number;
    headline: string;
  };
  biomarkers: Biomarker[];
  questionsForDoctor: DoctorQuestion[];
  educationalTips: string[];
}

export const MOCK_REPORTS: Record<string, MockReport> = {
  cbc: {
    id: 'cbc',
    title: 'Complete Blood Count (CBC)',
    patientInfo: {
      age: '34 Years',
      gender: 'Female',
      sampleDate: 'November 12, 2026',
      sampleType: 'Whole Blood (EDTA)',
    },
    summary:
      'Your blood count shows that your white blood cells (infection fighters) and platelets (clotting cells) are in healthy normal ranges. Your hemoglobin and red cell count are slightly lower than average, which commonly points toward mild iron-deficiency anemia.',
    keyHighlights: {
      attentionCount: 3,
      normalCount: 5,
      headline: 'Mild low hemoglobin observed; white cells and platelets are normal.',
    },
    biomarkers: [
      {
        id: 'hb',
        name: 'Hemoglobin (Hb)',
        category: 'Red Blood Cells',
        value: '10.2',
        unit: 'g/dL',
        reference_range: '12.0 - 15.5',
        status: 'Low',
        analogy: 'Hemoglobin is like a fleet of delivery trucks carrying fresh oxygen from your lungs to every organ and muscle.',
        plain_explanation: 'This protein inside red blood cells binds to oxygen and gives blood its rich red color.',
        what_it_means: 'A reading of 10.2 g/dL means your body has fewer oxygen carriers than typical, which can explain feelings of fatigue, cold hands, or lightheadedness.',
      },
      {
        id: 'rbc',
        name: 'RBC (Red Blood Cell Count)',
        category: 'Red Blood Cells',
        value: '3.75',
        unit: 'million/mcL',
        reference_range: '3.80 - 5.20',
        status: 'Low',
        analogy: 'Think of RBCs as the individual delivery vehicles traveling through your circulatory highway.',
        plain_explanation: 'Measures the absolute number of oxygen-carrying cells in a drop of blood.',
        what_it_means: 'Slightly below standard female range, consistent with the lower hemoglobin reading.',
      },
      {
        id: 'pcv',
        name: 'Hematocrit (PCV)',
        category: 'Red Blood Cells',
        value: '31.4',
        unit: '%',
        reference_range: '36.0 - 46.0',
        status: 'Low',
        analogy: 'Hematocrit is like the density of traffic: the percentage of your total blood volume made up of red cells.',
        plain_explanation: 'Reflects the proportion of whole blood that consists of red blood cells.',
        what_it_means: 'At 31.4%, a smaller fraction of your blood is solid red cells, usually confirming mild anemia.',
      },
      {
        id: 'mcv',
        name: 'Mean Corpuscular Volume (MCV)',
        category: 'Red Blood Cells',
        value: '84.0',
        unit: 'fL',
        reference_range: '80.0 - 100.0',
        status: 'Normal',
        analogy: 'MCV measures the physical shoe size of each red blood cell.',
        plain_explanation: 'Measures the average size of your red blood cells.',
        what_it_means: 'Your red blood cells are normal in physical size (normocytic), which helps narrow down the causes of low hemoglobin.',
      },
      {
        id: 'wbc',
        name: 'Total Leukocyte Count (WBC)',
        category: 'Immune System',
        value: '6,800',
        unit: 'cells/mcL',
        reference_range: '4,000 - 11,000',
        status: 'Normal',
        analogy: 'White blood cells are your body’s personal security guard squad, scanning for bacterial or viral intruders.',
        plain_explanation: 'Key cells of your immune defense system.',
        what_it_means: 'Your immune cell count is well-balanced, showing no signs of active infection or systemic inflammation.',
      },
      {
        id: 'platelets',
        name: 'Platelet Count',
        category: 'Clotting',
        value: '265,000',
        unit: '/mcL',
        reference_range: '150,000 - 450,000',
        status: 'Normal',
        analogy: 'Platelets are like microscopic emergency road-repair kits that plug tiny leaks whenever you get a scrape.',
        plain_explanation: 'Cell fragments essential for normal blood clotting and tissue repair.',
        what_it_means: 'Optimal clotting potential; your body can safely stop minor bleeding.',
      },
      {
        id: 'neutrophils',
        name: 'Neutrophils',
        category: 'Immune System',
        value: '62',
        unit: '%',
        reference_range: '40 - 75',
        status: 'Normal',
        analogy: 'First-responder tactical units that rush to fight acute bacterial threats.',
        plain_explanation: 'The most abundant type of white blood cell.',
        what_it_means: 'In healthy balance, indicating no immediate bacterial alarm.',
      },
      {
        id: 'lymphocytes',
        name: 'Lymphocytes',
        category: 'Immune System',
        value: '29',
        unit: '%',
        reference_range: '20 - 45',
        status: 'Normal',
        analogy: 'Specialized intelligence agents that recognize recurring viruses and manage antibodies.',
        plain_explanation: 'B-cells and T-cells responsible for targeted immunity.',
        what_it_means: 'Normal cellular defense activity.',
      },
    ],
    questionsForDoctor: [
      {
        id: 'q1',
        topic: 'Mild Low Hemoglobin (10.2 g/dL)',
        question: 'Could my lower hemoglobin be related to dietary iron, heavy periods, or another source of iron loss?',
        context: 'Clarifies whether you need an iron supplement, ferritin blood check, or simple nutrition adjustments.',
      },
      {
        id: 'q2',
        topic: 'Testing Ferritin & B12',
        question: 'Would you recommend checking my serum ferritin (stored iron) or Vitamin B12 levels before taking any supplement?',
        context: 'Ensures targeted treatment rather than guessing with over-the-counter multivitamins.',
      },
      {
        id: 'q3',
        topic: 'Retesting Timeline',
        question: 'When should we re-check my complete blood count to see if my levels have rebounded?',
        context: 'Most physicians suggest retesting in 8 to 12 weeks after dietary tweaks or supplements.',
      },
    ],
    educationalTips: [
      'Pair iron-rich foods (spinach, lentils, lean poultry) with Vitamin C (citrus, bell peppers) to dramatically boost natural iron absorption.',
      'Avoid drinking strong black tea or coffee right alongside meals, as tannins can inhibit iron uptake by up to 50%.',
      'Stay consistently hydrated; mild dehydration can artificially concentrate blood readings.',
    ],
  },

  lipid: {
    id: 'lipid',
    title: 'Lipid Profile (Cholesterol & Fats)',
    patientInfo: {
      age: '48 Years',
      gender: 'Male',
      sampleDate: 'November 10, 2026',
      sampleType: 'Serum (12-Hour Fasting)',
    },
    summary:
      'Your lipid panel shows elevated Total and LDL ("bad") cholesterol, alongside borderline high triglycerides. Your HDL ("protective") cholesterol is slightly low. These numbers are a valuable early heads-up to focus on heart-healthy nutrition and active movement.',
    keyHighlights: {
      attentionCount: 4,
      normalCount: 1,
      headline: 'Elevated LDL & Triglycerides; HDL is slightly low.',
    },
    biomarkers: [
      {
        id: 'total_chol',
        name: 'Total Cholesterol',
        category: 'Blood Lipids',
        value: '238',
        unit: 'mg/dL',
        reference_range: '< 200',
        status: 'High',
        analogy: 'Total cholesterol is the total headcount of all fat-carrying particles floating through your bloodstream.',
        plain_explanation: 'Sum of your HDL, LDL, and VLDL fats.',
        what_it_means: 'At 238 mg/dL, overall blood lipids are above the desirable cutoff (< 200 mg/dL).',
      },
      {
        id: 'ldl',
        name: 'LDL Cholesterol ("Bad")',
        category: 'Blood Lipids',
        value: '158',
        unit: 'mg/dL',
        reference_range: '< 100',
        status: 'High',
        analogy: 'LDL is like clumsy delivery trucks that drop sticky cargo along highway walls, which can build up plaque over time.',
        plain_explanation: 'Low-Density Lipoprotein transports cholesterol to tissues but can deposit on arterial walls.',
        what_it_means: 'A level of 158 mg/dL is considered elevated and suggests prioritizing cardiovascular diet modifications.',
      },
      {
        id: 'hdl',
        name: 'HDL Cholesterol ("Good")',
        category: 'Blood Lipids',
        value: '38',
        unit: 'mg/dL',
        reference_range: '> 40 (Male) / > 50 (Female)',
        status: 'Low',
        analogy: 'HDL acts like street-sweeper trucks that scrub excess fat off arterial walls and ferry it back to the liver for disposal.',
        plain_explanation: 'High-Density Lipoprotein is protective against cardiovascular buildup.',
        what_it_means: 'At 38 mg/dL, having a slightly lower reserve of "cleaners" means it’s beneficial to boost levels with brisk cardio and olive oil.',
      },
      {
        id: 'trig',
        name: 'Triglycerides',
        category: 'Blood Lipids',
        value: '185',
        unit: 'mg/dL',
        reference_range: '< 150',
        status: 'Borderline',
        analogy: 'Triglycerides are fuel reserve tanks that store unused calories from dietary sugars, carbs, and fats.',
        plain_explanation: 'The most common form of stored fat circulating in the bloodstream.',
        what_it_means: '185 mg/dL is borderline high; often responds very quickly to reducing sweetened drinks, alcohol, and refined carbohydrates.',
      },
      {
        id: 'ratio',
        name: 'Total / HDL Cholesterol Ratio',
        category: 'Risk Ratio',
        value: '6.26',
        unit: 'Ratio',
        reference_range: '< 4.5',
        status: 'High',
        analogy: 'The ratio balances the amount of potential clutter against the capacity of your cleanup crew.',
        plain_explanation: 'A mathematical indicator doctors use to assess cardiovascular balance.',
        what_it_means: 'Higher ratio reflects the combination of elevated LDL and modest HDL.',
      },
    ],
    questionsForDoctor: [
      {
        id: 'lq1',
        topic: 'Cardiovascular Risk Assessment',
        question: 'Considering my age and blood pressure, what is my overall 10-year cardiovascular risk score?',
        context: 'Helps determine whether lifestyle adjustments alone are sufficient or if medication is warranted.',
      },
      {
        id: 'lq2',
        topic: 'Diet & Exercise Plan',
        question: 'Can we try a 3-month structured Mediterranean diet and aerobic exercise plan before discussing statin therapy?',
        context: 'Many patients reduce triglycerides and LDL significantly through diet and daily 30-minute brisk walking.',
      },
      {
        id: 'lq3',
        topic: 'Follow-up Fasting Test',
        question: 'Should I repeat this test fasting in 3 months to track my progress?',
        context: 'Tracks the direct impact of lifestyle adjustments.',
      },
    ],
    educationalTips: [
      'Incorporate soluble fiber daily (oats, chia seeds, kidney beans, apples); soluble fiber binds to cholesterol in your digestive tract and carries it out.',
      'Replace saturated cooking fats (butter, palm oil) with heart-healthy monounsaturated fats (extra virgin olive oil, nuts, seeds).',
      'Aim for 150 minutes of moderate aerobic activity weekly (e.g., 30 minutes of brisk walking 5 days a week) to raise protective HDL.',
    ],
  },

  cmp: {
    id: 'cmp',
    title: 'Metabolic & Kidney/Liver Panel (CMP)',
    patientInfo: {
      age: '52 Years',
      gender: 'Female',
      sampleDate: 'November 11, 2026',
      sampleType: 'Serum Blood',
    },
    summary:
      'Your metabolic panel indicates healthy liver enzymes, normal electrolytes, and sound kidney filtration. Fasting blood glucose is in the borderline/prediabetes range, which serves as an empowering early opportunity to balance carbohydrates and daily movement.',
    keyHighlights: {
      attentionCount: 1,
      normalCount: 6,
      headline: 'Liver and kidneys functioning normally; fasting blood glucose is mildly elevated.',
    },
    biomarkers: [
      {
        id: 'glucose',
        name: 'Fasting Blood Glucose',
        category: 'Metabolism',
        value: '108',
        unit: 'mg/dL',
        reference_range: '70 - 99',
        status: 'Borderline',
        analogy: 'Glucose is the fuel in your blood; when fasting, your body should keep fuel levels below 100 mg/dL.',
        plain_explanation: 'Measures sugar concentration in blood after an overnight fast.',
        what_it_means: '108 mg/dL falls in the "impaired fasting glucose" (100–125 mg/dL) range. Often readily reversible with dietary balance.',
      },
      {
        id: 'creatinine',
        name: 'Serum Creatinine',
        category: 'Kidney Health',
        value: '0.85',
        unit: 'mg/dL',
        reference_range: '0.60 - 1.10',
        status: 'Normal',
        analogy: 'Creatinine is normal muscle breakdown debris that your kidney filters are constantly clearing away.',
        plain_explanation: 'Key benchmark of kidney filtration efficiency.',
        what_it_means: 'Optimal filtration; kidneys are filtering and clearing metabolic waste effectively.',
      },
      {
        id: 'egfr',
        name: 'eGFR (Kidney Filtration Rate)',
        category: 'Kidney Health',
        value: '94',
        unit: 'mL/min/1.73m²',
        reference_range: '> 60',
        status: 'Normal',
        analogy: 'eGFR is the speed and power rating of your kidney filtration system.',
        plain_explanation: 'Calculated measure of how many milliliters of blood your kidneys clean per minute.',
        what_it_means: 'Excellent kidney filtration performance (> 90 is Stage 1 / optimal).',
      },
      {
        id: 'sgpt',
        name: 'ALT / SGPT (Liver Enzyme)',
        category: 'Liver Health',
        value: '22',
        unit: 'U/L',
        reference_range: '7 - 35',
        status: 'Normal',
        analogy: 'An enzyme tucked safely inside liver cells; when liver cells are irritated, it spills out.',
        plain_explanation: 'Primary indicator of liver cell health.',
        what_it_means: 'Very low spillover, indicating healthy, unstressed liver tissue.',
      },
      {
        id: 'sgot',
        name: 'AST / SGOT (Liver Enzyme)',
        category: 'Liver Health',
        value: '25',
        unit: 'U/L',
        reference_range: '10 - 35',
        status: 'Normal',
        analogy: 'Another cellular enzyme found in liver and heart tissues.',
        plain_explanation: 'Assesses liver and muscle cell integrity.',
        what_it_means: 'Within desirable range.',
      },
      {
        id: 'sodium',
        name: 'Sodium (Electrolyte)',
        category: 'Electrolytes',
        value: '139',
        unit: 'mEq/L',
        reference_range: '136 - 145',
        status: 'Normal',
        analogy: 'Controls water pressure inside and outside your cells.',
        plain_explanation: 'Vital mineral regulating fluid balance and nerve impulses.',
        what_it_means: 'Normal fluid and electrolyte balance.',
      },
      {
        id: 'potassium',
        name: 'Potassium (Electrolyte)',
        category: 'Electrolytes',
        value: '4.2',
        unit: 'mEq/L',
        reference_range: '3.5 - 5.1',
        status: 'Normal',
        analogy: 'Governs the electrical rhythm of your heartbeat and muscle contractions.',
        plain_explanation: 'Crucial mineral for cardiac and muscular health.',
        what_it_means: 'Normal cardiac rhythm electrolyte balance.',
      },
    ],
    questionsForDoctor: [
      {
        id: 'cq1',
        topic: 'Fasting Glucose (108 mg/dL)',
        question: 'Should I follow this up with an HbA1c test to see my average 3-month blood sugar control?',
        context: 'HbA1c provides a reliable long-term view rather than a single day’s fasting snapshot.',
      },
      {
        id: 'cq2',
        topic: 'Preventing Progression',
        question: 'What specific dietary changes and strength-training routines work best to reverse prediabetes?',
        context: 'Building lean muscle significantly improves insulin sensitivity and glucose uptake.',
      },
    ],
    educationalTips: [
      'Take a 10- to 15-minute gentle walk immediately after meals to help muscles absorb circulating blood sugar without requiring excess insulin.',
      'Prioritize protein and dietary fiber in your first meal of the day to avoid mid-morning blood sugar spikes.',
      'Aim for 7–8 hours of sound sleep; chronic sleep deprivation can temporarily induce insulin resistance.',
    ],
  },
};
