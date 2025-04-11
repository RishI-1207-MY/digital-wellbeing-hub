
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bell } from 'lucide-react';

interface Patient {
  id: string;
  profile_id: string;
  full_name: string;
  date_of_birth: string | null;
  medical_history: string | null;
  status?: 'stable' | 'follow-up' | 'critical' | 'emergency';
  alerts?: string[];
  conditions?: string[];
}

interface EmergencyAlertsProps {
  patients: Patient[];
  respondToEmergency: (patientName: string) => void;
}

const EmergencyAlerts: React.FC<EmergencyAlertsProps> = ({ 
  patients, 
  respondToEmergency 
}) => {
  const emergencyPatients = patients.filter(patient => patient.status === "emergency");
  
  if (emergencyPatients.length === 0) {
    return null;
  }

  return (
    <Card className="bg-red-50 border-red-100">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center text-red-700">
          <Bell className="mr-2 h-5 w-5" />
          Emergency Alerts
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {emergencyPatients.map(patient => (
            <div key={patient.id} className="flex items-center justify-between bg-white p-3 rounded-lg border border-red-200">
              <div>
                <span className="font-medium text-red-800">{patient.full_name}</span>
                <p className="text-sm text-red-600">
                  {patient.alerts && patient.alerts[0]}
                </p>
              </div>
              <Button 
                className="bg-red-600 hover:bg-red-700"
                onClick={() => respondToEmergency(patient.full_name)}
              >
                Respond Now
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default EmergencyAlerts;
