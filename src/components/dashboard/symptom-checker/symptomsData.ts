
// Common symptoms data for the symptom checker
export const commonSymptoms = [
  { id: "fever", label: "Fever" },
  { id: "cough", label: "Cough" },
  { id: "sore-throat", label: "Sore Throat" },
  { id: "runny-nose", label: "Runny Nose" },
  { id: "congestion", label: "Congestion" },
  { id: "headache", label: "Headache" },
  { id: "body-aches", label: "Body Aches" },
  { id: "fatigue", label: "Fatigue" },
  { id: "sneezing", label: "Sneezing" },
  { id: "itchy-eyes", label: "Itchy Eyes" }
];

// Mock disease prediction data - will be replaced with actual AI predictions
export const mockPredictions: Record<string, { 
  prediction: string, 
  confidence: number, 
  recommendation: string 
}> = {
  "fever,headache": {
    prediction: "Common Cold",
    confidence: 0.6,
    recommendation: "Rest, hydrate, and take over-the-counter pain relievers if needed. See a doctor if symptoms worsen or persist beyond a week."
  },
  "fever,cough,body-aches": {
    prediction: "Influenza",
    confidence: 0.8,
    recommendation: "Rest, hydrate, and monitor symptoms. Consider antiviral medication if diagnosed within 48 hours. Contact your doctor if symptoms become severe."
  },
  "runny-nose,sneezing,itchy-eyes": {
    prediction: "Seasonal Allergies",
    confidence: 0.9,
    recommendation: "Try over-the-counter antihistamines, avoid allergens, and consider seeing an allergist for long-term management strategies."
  },
  "sore-throat,fever": {
    prediction: "Strep Throat",
    confidence: 0.5,
    recommendation: "See a healthcare provider for testing and possible antibiotics. Rest and use pain relievers for comfort."
  },
  "cough,congestion,fatigue": {
    prediction: "Bronchitis",
    confidence: 0.7,
    recommendation: "Rest, increase fluid intake, and use a humidifier. Consult a doctor if symptoms persist or you have difficulty breathing."
  }
};

// Default prediction if no match is found
export const defaultPrediction = {
  prediction: "Unknown Condition",
  confidence: 0,
  recommendation: "Based on the symptoms provided, a specific condition cannot be determined. Please consult with a healthcare professional for a proper diagnosis."
};
