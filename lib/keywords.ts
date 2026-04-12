const HEALTH_TERMS: string[] = [
  // Multi-word phrases
  "lower back pain", "back pain", "chest pain", "joint pain", "muscle pain",
  "shortness of breath", "difficulty breathing", "high blood pressure",
  "low blood pressure", "blood pressure", "heart rate", "heart attack",
  "heart disease", "blood sugar", "blood glucose", "runny nose",
  "sore throat", "dry cough", "chest tightness", "muscle aches",
  "muscle weakness", "weight loss", "weight gain", "loss of appetite",
  "type 2 diabetes", "type 1 diabetes", "high cholesterol",
  "kidney disease", "liver disease", "herniated disc", "herniated disk",
  "physical therapy", "panic attack", "sleep apnea",
  // Symptoms
  "fever", "fatigue", "nausea", "vomiting", "dizziness", "headache",
  "migraine", "cough", "wheezing", "chills", "sweating", "swelling",
  "rash", "itching", "bleeding", "diarrhea", "constipation",
  "insomnia", "palpitations", "numbness", "tingling", "weakness",
  "stiffness", "cramps", "inflammation", "infection", "pain",
  // Conditions
  "diabetes", "hypertension", "asthma", "arthritis", "cancer", "anemia",
  "flu", "influenza", "covid", "pneumonia", "bronchitis", "sinusitis",
  "thyroid", "obesity", "osteoporosis", "fibromyalgia", "lupus",
  "psoriasis", "eczema", "depression", "anxiety", "epilepsy",
  "seizure", "dementia", "stroke", "ulcer", "gastritis", "colitis",
  "hepatitis", "cholesterol", "allergy", "allergies", "syndrome",
  "chronic", "acute", "disorder",
  // Body parts
  "heart", "lung", "lungs", "kidney", "kidneys", "liver", "stomach",
  "brain", "spine", "joints", "muscles", "bone", "skin", "blood",
  "nerve", "nerves", "chest", "throat", "neck", "shoulder", "knee",
  "hip", "leg", "foot",
  // Medications
  "ibuprofen", "paracetamol", "acetaminophen", "aspirin", "metformin",
  "lisinopril", "atorvastatin", "amoxicillin", "antibiotic", "insulin",
  "steroid", "inhaler", "salbutamol", "painkiller", "medication",
  "prescription",
  // Procedures / vitals
  "surgery", "therapy", "chemotherapy", "mri", "ct scan", "x-ray",
  "ecg", "ultrasound", "vaccine", "diagnosis", "treatment",
  "oxygen", "pulse", "temperature", "bmi", "glucose",
];

export function extractHealthKeywords(text: string): string[] {
  const lower = text.toLowerCase();
  const found = new Set<string>();

  // Sort longest first so "lower back pain" matches before "back pain" or "pain"
  const sorted = [...HEALTH_TERMS].sort((a, b) => b.length - a.length);

  for (const term of sorted) {
    const idx = lower.indexOf(term);
    if (idx === -1) continue;

    const before = idx === 0 ? " " : lower[idx - 1];
    const after = idx + term.length >= lower.length ? " " : lower[idx + term.length];
    const boundaryStart = /[\s,.()\-\/]/.test(before) || idx === 0;
    const boundaryEnd = /[\s,.()\-\/]/.test(after) || idx + term.length === lower.length;

    if (boundaryStart && boundaryEnd) {
      found.add(term);
    }
  }

  // Also catch capitalised drug/condition names not in the list (e.g. "Metformin", "Lisinopril")
  const stopWords = new Set([
    "This","That","With","From","Have","Been","They","Their","There",
    "When","What","Will","Would","Could","Should","Also","Some","More",
    "About","After","Before","During","Patient","Please","Currently","History",
  ]);
  const capsWords = text.match(/\b[A-Z][a-z]{4,}\b/g) || [];
  for (const word of capsWords) {
    if (!stopWords.has(word) && !found.has(word.toLowerCase())) {
      found.add(word);
    }
  }

  return Array.from(found)
    .sort((a, b) => (b.match(/ /g) || []).length - (a.match(/ /g) || []).length)
    .slice(0, 18);
}