
import { supabase } from '@/integrations/supabase/client';
import { mockPredictions, defaultPrediction } from './symptomsData';

export interface PredictionResult {
  prediction: string;
  confidence: number;
  recommendation: string;
}

export const analyzeSymptomsWithMock = async (
  symptoms: string[],
  duration: string,
  additionalInfo?: string
): Promise<PredictionResult> => {
  return new Promise((resolve) => {
    // Simulate an API call with a timeout
    setTimeout(() => {
      // Sort symptoms to ensure consistent key lookup
      const sortedSymptoms = [...symptoms].sort().join(',');
      
      // Find the closest match in our mock data or use the default
      const matchedPrediction = mockPredictions[sortedSymptoms] || defaultPrediction;
      
      resolve(matchedPrediction);
    }, 1500);
  });
};

export const analyzeSymptomsWithAPI = async (
  symptoms: string[],
  duration: string,
  additionalInfo?: string
): Promise<PredictionResult> => {
  try {
    // This would be replaced with an actual API call
    const { data, error } = await supabase.functions.invoke('disease-prediction', {
      body: { symptoms, duration, additionalInfo },
    });

    if (error) throw new Error(error.message);
    return data as PredictionResult;
  } catch (error) {
    console.error('Error analyzing symptoms:', error);
    throw error;
  }
};

// Helper functions for the UI
export const getSeverityColor = (confidence: number): string => {
  if (confidence === 0) return 'text-gray-600';
  if (confidence < 0.4) return 'text-green-600';
  if (confidence < 0.7) return 'text-orange-500';
  return 'text-red-600';
};

export const getSeverityLevel = (confidence: number): string => {
  if (confidence === 0) return 'Unknown';
  if (confidence < 0.4) return 'Mild';
  if (confidence < 0.7) return 'Moderate';
  return 'Severe';
};
