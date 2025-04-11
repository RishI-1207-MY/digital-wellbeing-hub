
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import SymptomForm from './SymptomForm';
import AnalysisResult from './AnalysisResult';
import { PredictionResult, analyzeSymptomsWithMock } from './symptomCheckerService';

const SymptomChecker = () => {
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [duration, setDuration] = useState<string>("");
  const [additionalInfo, setAdditionalInfo] = useState<string>("");
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSymptomChange = (symptomId: string, checked: boolean) => {
    if (checked) {
      setSelectedSymptoms([...selectedSymptoms, symptomId]);
    } else {
      setSelectedSymptoms(selectedSymptoms.filter(s => s !== symptomId));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedSymptoms.length === 0) {
      toast({
        title: "Please select symptoms",
        description: "You need to select at least one symptom for analysis",
        variant: "destructive",
      });
      return;
    }

    if (!duration) {
      toast({
        title: "Duration required",
        description: "Please indicate how long you've had these symptoms",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    
    try {
      // Call the symptom analysis service
      const prediction = await analyzeSymptomsWithMock(selectedSymptoms, duration, additionalInfo);
      setResult(prediction);
    } catch (error: any) {
      console.error('Error analyzing symptoms:', error);
      toast({
        title: "Analysis Failed",
        description: error.message || "Could not analyze symptoms. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setSelectedSymptoms([]);
    setDuration("");
    setAdditionalInfo("");
    setResult(null);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Advanced Symptom Checker</CardTitle>
        <CardDescription>
          Check your symptoms and get AI-powered healthcare advice
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!result ? (
          <SymptomForm 
            selectedSymptoms={selectedSymptoms}
            duration={duration}
            additionalInfo={additionalInfo}
            loading={loading}
            onSymptomChange={handleSymptomChange}
            onDurationChange={setDuration}
            onAdditionalInfoChange={setAdditionalInfo}
            onSubmit={handleSubmit}
          />
        ) : (
          <AnalysisResult 
            result={result} 
            onReset={resetForm} 
          />
        )}
      </CardContent>
    </Card>
  );
};

export default SymptomChecker;
