
import React from 'react';
import { Pill } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface Medication {
  id: number;
  name: string;
  dosage: string;
  schedule: string;
  purpose: string;
}

interface MedicationsSectionProps {
  medications: Medication[];
}

const MedicationsSection: React.FC<MedicationsSectionProps> = ({ medications }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Pill className="mr-2 h-5 w-5" />
          My Medications
        </CardTitle>
        <CardDescription>
          Your current medication schedule
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {medications.map(med => (
            <div key={med.id} className="flex p-3 border rounded-lg hover:bg-gray-50">
              <div className="flex-grow">
                <h4 className="font-medium text-gray-900">{med.name}</h4>
                <p className="text-sm text-gray-500">{med.dosage} - {med.schedule}</p>
                <p className="text-xs text-gray-500 mt-1">For: {med.purpose}</p>
              </div>
              <div className="self-center">
                <Button variant="ghost" size="sm">
                  Details
                </Button>
              </div>
            </div>
          ))}
          <Button variant="outline" className="w-full mt-2">
            View All Medications
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default MedicationsSection;
