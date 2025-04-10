
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const commonSymptoms = [
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

const EnhancedSymptomChecker = () => {
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [duration, setDuration] = useState<string>("");
  const [additionalInfo, setAdditionalInfo] = useState<string>("");
  const [result, setResult] = useState<null | {
    prediction: string;
    confidence: number;
    recommendation: string;
  }>(null);
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
      // Call the disease prediction edge function
      const { data, error } = await supabase.functions.invoke('disease-prediction', {
        body: { symptoms: selectedSymptoms }
      });

      if (error) {
        throw new Error(error.message);
      }

      // Set the prediction result
      setResult(data);
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

  const getSeverityColor = (confidence: number) => {
    if (confidence === 0) return 'text-gray-600';
    if (confidence < 0.4) return 'text-green-600';
    if (confidence < 0.7) return 'text-orange-500';
    return 'text-red-600';
  };

  const getSeverityLevel = (confidence: number) => {
    if (confidence === 0) return 'Unknown';
    if (confidence < 0.4) return 'Mild';
    if (confidence < 0.7) return 'Moderate';
    return 'Severe';
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
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <Label>Select your symptoms:</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {commonSymptoms.map((symptom) => (
                  <div key={symptom.id} className="flex items-center space-x-2">
                    <Checkbox 
                      id={symptom.id} 
                      checked={selectedSymptoms.includes(symptom.id)}
                      onCheckedChange={(checked) => 
                        handleSymptomChange(symptom.id, checked as boolean)
                      }
                    />
                    <Label htmlFor={symptom.id} className="cursor-pointer">
                      {symptom.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="duration">How many days have you had these symptoms?</Label>
              <Input 
                id="duration" 
                type="number" 
                placeholder="Enter number of days" 
                min="1"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="additionalInfo">
                Additional information (optional)
              </Label>
              <Textarea 
                id="additionalInfo"
                placeholder="Describe any other symptoms or relevant information"
                value={additionalInfo}
                onChange={(e) => setAdditionalInfo(e.target.value)}
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : "Check Symptoms"}
            </Button>
          </form>
        ) : (
          <div className="space-y-6">
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-medium text-lg mb-2">AI Health Assessment</h3>
              <p className="text-lg font-semibold mb-1">
                Possible Condition: <span className={getSeverityColor(result.confidence)}>{result.prediction}</span>
              </p>
              <p className="text-gray-600 mb-4">
                <span className="font-medium">Severity Level:</span> {getSeverityLevel(result.confidence)}
              </p>
              <div className="border-t pt-3">
                <h4 className="font-medium mb-1">Recommendation:</h4>
                <p className="text-gray-700">{result.recommendation}</p>
              </div>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Important:</strong> This is an AI-powered preliminary assessment based on the symptoms you reported. 
                For medical advice, please consult with a healthcare professional. In case of emergency, 
                contact emergency services immediately.
              </p>
            </div>
            
            <Button variant="outline" onClick={resetForm} className="w-full">
              Check Different Symptoms
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EnhancedSymptomChecker;
