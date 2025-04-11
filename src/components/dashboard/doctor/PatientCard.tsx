
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { UserCircle, FileText, Video } from 'lucide-react';
import StatusBadge from './StatusBadge';

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

interface PatientCardProps {
  patient: Patient;
  viewEHR: (patientName: string) => void;
  startVideoConsultation: (patientName: string) => void;
}

const PatientCard: React.FC<PatientCardProps> = ({ 
  patient, 
  viewEHR, 
  startVideoConsultation 
}) => {
  return (
    <Card key={patient.id} className={`
      ${patient.status === 'emergency' ? 'border-red-300 shadow-md' : ''}
      ${patient.status === 'critical' ? 'border-orange-300' : ''}
    `}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-center">
            <UserCircle className="h-8 w-8 mr-2 text-gray-400" />
            <div>
              <CardTitle className="text-lg">{patient.full_name}</CardTitle>
              <CardDescription>
                {patient.date_of_birth ? new Date(patient.date_of_birth).toLocaleDateString() : 'No DOB'} • Last visit: Recent
              </CardDescription>
            </div>
          </div>
          <StatusBadge status={patient.status || 'stable'} />
        </div>
      </CardHeader>
      <CardContent>
        {patient.conditions && patient.conditions.length > 0 && (
          <div className="mb-3">
            <p className="text-sm font-medium mb-1">Conditions:</p>
            <div className="flex flex-wrap gap-1">
              {patient.conditions.map((condition, i) => (
                <Badge key={i} variant="secondary" className="text-xs">
                  {condition}
                </Badge>
              ))}
            </div>
          </div>
        )}
        
        {patient.alerts && patient.alerts.length > 0 && (
          <div className="mb-3 p-2 bg-red-50 rounded-md">
            <p className="text-sm font-medium text-red-800 mb-1">Alerts:</p>
            <ul className="text-sm text-red-700">
              {patient.alerts.map((alert, i) => (
                <li key={i}>{alert}</li>
              ))}
            </ul>
          </div>
        )}
        
        <div className="flex space-x-2 mt-2">
          <Button 
            variant="outline" 
            size="sm"
            className="flex-1"
            onClick={() => viewEHR(patient.full_name)}
          >
            <FileText className="h-4 w-4 mr-1" />
            View EHR
          </Button>
          <Button 
            variant={patient.status === 'emergency' ? 'destructive' : 'default'} 
            size="sm"
            className="flex-1"
            onClick={() => startVideoConsultation(patient.full_name)}
          >
            <Video className="h-4 w-4 mr-1" />
            {patient.status === 'emergency' ? 'Urgent Call' : 'Video Call'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PatientCard;
