
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import PatientCard from './PatientCard';

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

interface PatientListViewProps {
  patients: Patient[];
  loading: boolean;
  viewEHR: (patientName: string) => void;
  startVideoConsultation: (patientName: string) => void;
}

const PatientListView: React.FC<PatientListViewProps> = ({ 
  patients, 
  loading, 
  viewEHR, 
  startVideoConsultation 
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  
  const filteredPatients = patients.filter(patient => 
    patient.full_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <Input
          placeholder="Search patients..."
          className="pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      {loading ? (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-lifesage-primary"></div>
          <p className="mt-2 text-gray-500">Loading patients...</p>
        </div>
      ) : filteredPatients.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">No patients found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredPatients.map(patient => (
            <PatientCard 
              key={patient.id}
              patient={patient}
              viewEHR={viewEHR}
              startVideoConsultation={startVideoConsultation}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default PatientListView;
