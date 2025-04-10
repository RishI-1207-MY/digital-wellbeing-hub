
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';

// Mock symptom analysis
const analyzeSymptoms = (symptoms: string[], duration: number, additionalInfo: string) => {
  // This is a very simplified mock algorithm
  const commonColdSymptoms = ['fever', 'cough', 'sore throat', 'runny nose', 'congestion', 'headache'];
  const fluSymptoms = ['fever', 'cough', 'sore throat', 'body aches', 'fatigue', 'headache'];
  const allergiesSymptoms = ['runny nose', 'sneezing', 'itchy eyes', 'congestion'];
  
  let coldCount = 0;
  let fluCount = 0;
  let allergyCount = 0;
  
  symptoms.forEach(symptom => {
    if (commonColdSymptoms.includes(symptom.toLowerCase())) coldCount++;
    if (fluSymptoms.includes(symptom.toLowerCase())) fluCount++;
    if (allergiesSymptoms.includes(symptom.toLowerCase())) allergyCount++;
  });
  
  // Duration factor - flu symptoms are usually more sudden and intense
  if (duration <= 2 && fluCount >= 3) fluCount += 2;
  if (duration >= 7 && allergyCount >= 2) allergyCount += 2;
  
  // Additional text analysis (very simplified)
  const lowercaseInfo = additionalInfo.toLowerCase();
  if (lowercaseInfo.includes('seasonal') || lowercaseInfo.includes('every year')) allergyCount += 2;
  if (lowercaseInfo.includes('contact') || lowercaseInfo.includes('exposed')) fluCount += 1;
  
  // Determine most likely condition
  const max = Math.max(coldCount, fluCount, allergyCount);
  
  if (max === 0) return {
    condition: "Inconclusive",
    recommendation: "Your symptoms don't match our common patterns. Please consult with a healthcare provider for personalized advice.",
    severity: "unknown"
  };
  
  if (coldCount === max) return {
    condition: "Common Cold",
    recommendation: "Rest, drink fluids, and take over-the-counter cold medications if needed. If symptoms worsen or persist beyond 10 days, consult your doctor.",
    severity: "mild"
  };
  
  if (fluCount === max) return {
    condition: "Possible Influenza",
    recommendation: "Rest, stay hydrated, and take fever reducers. Consider scheduling a telehealth consultation to discuss antiviral medications if caught early. Seek medical attention if you have difficulty breathing or symptoms worsen.",
    severity: "moderate"
  };
  
  if (allergyCount === max) return {
    condition: "Seasonal Allergies",
    recommendation: "Over-the-counter antihistamines may help. Avoid known allergens when possible. If symptoms are severe or chronic, consider consulting with an allergist.",
    severity: "mild"
  };
  
  return {
    condition: "Inconclusive",
    recommendation: "Your symptoms are complex. We recommend scheduling a telehealth consultation for a more thorough evaluation.",
    severity: "unknown"
  };
};

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

const SymptomChecker = () => {
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [duration, setDuration] = useState<string>("");
  const [additionalInfo, setAdditionalInfo] = useState<string>("");
  const [result, setResult] = useState<null | {
    condition: string;
    recommendation: string;
    severity: string;
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

  const handleSubmit = (e: React.FormEvent) => {
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
    
    // Simulate API delay
    setTimeout(() => {
      const analysisResult = analyzeSymptoms(
        selectedSymptoms, 
        parseInt(duration), 
        additionalInfo
      );
      setResult(analysisResult);
      setLoading(false);
    }, 1500);
  };

  const resetForm = () => {
    setSelectedSymptoms([]);
    setDuration("");
    setAdditionalInfo("");
    setResult(null);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'mild': return 'text-green-600';
      case 'moderate': return 'text-orange-500';
      case 'severe': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Symptom Checker</CardTitle>
        <CardDescription>
          Check your symptoms and get preliminary healthcare advice
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
              {loading ? "Analyzing..." : "Check Symptoms"}
            </Button>
          </form>
        ) : (
          <div className="space-y-6">
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-medium text-lg mb-2">Preliminary Assessment</h3>
              <p className="text-lg font-semibold mb-1">
                Possible Condition: <span className={getSeverityColor(result.severity)}>{result.condition}</span>
              </p>
              <p className="text-gray-600 mb-4">
                <span className="font-medium">Severity Level:</span> {result.severity.charAt(0).toUpperCase() + result.severity.slice(1)}
              </p>
              <div className="border-t pt-3">
                <h4 className="font-medium mb-1">Recommendation:</h4>
                <p className="text-gray-700">{result.recommendation}</p>
              </div>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Important:</strong> This is not a medical diagnosis. This tool provides preliminary information 
                based on the symptoms you reported. For medical advice, please consult with a healthcare professional.
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

export default SymptomChecker;
