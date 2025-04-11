
import React from 'react';
import { Button } from '@/components/ui/button';
import { PredictionResult, getSeverityColor, getSeverityLevel } from './symptomCheckerService';

interface AnalysisResultProps {
  result: PredictionResult;
  onReset: () => void;
}

const AnalysisResult: React.FC<AnalysisResultProps> = ({ result, onReset }) => {
  return (
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
      
      <Button variant="outline" onClick={onReset} className="w-full">
        Check Different Symptoms
      </Button>
    </div>
  );
};

export default AnalysisResult;
