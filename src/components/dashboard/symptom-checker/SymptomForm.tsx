
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { commonSymptoms } from './symptomsData';

interface SymptomFormProps {
  selectedSymptoms: string[];
  duration: string;
  additionalInfo: string;
  loading: boolean;
  onSymptomChange: (symptomId: string, checked: boolean) => void;
  onDurationChange: (value: string) => void;
  onAdditionalInfoChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

const SymptomForm: React.FC<SymptomFormProps> = ({
  selectedSymptoms,
  duration,
  additionalInfo,
  loading,
  onSymptomChange,
  onDurationChange,
  onAdditionalInfoChange,
  onSubmit
}) => {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="space-y-4">
        <Label>Select your symptoms:</Label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {commonSymptoms.map((symptom) => (
            <div key={symptom.id} className="flex items-center space-x-2">
              <Checkbox 
                id={symptom.id} 
                checked={selectedSymptoms.includes(symptom.id)}
                onCheckedChange={(checked) => 
                  onSymptomChange(symptom.id, checked as boolean)
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
          onChange={(e) => onDurationChange(e.target.value)}
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
          onChange={(e) => onAdditionalInfoChange(e.target.value)}
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
  );
};

export default SymptomForm;
