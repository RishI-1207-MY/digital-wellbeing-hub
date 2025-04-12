
import React, { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

// Import Components
import VitalsDisplay from './VitalsDisplay';
import EnhancedSymptomChecker from './EnhancedSymptomChecker';
import EmergencyAlert from './patient/EmergencyAlert';
import MentalHealthSupport from './patient/MentalHealthSupport';
import VideoConsultationCard from './patient/VideoConsultation';
import AppointmentBookingCard from './patient/AppointmentBooking';
import MedicalReportUploadCard from './patient/MedicalReportUpload';
import DocumentsSection from './patient/DocumentsSection';
import MedicationsSection from './patient/MedicationsSection';

const PatientDashboard = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [medications, setMedications] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchPatientData = async () => {
      if (!user?.id) return;
      
      setIsLoading(true);
      try {
        setMedications([
          { id: 1, name: "Lisinopril", dosage: "10mg", schedule: "Once daily", purpose: "Blood pressure" },
          { id: 2, name: "Metformin", dosage: "500mg", schedule: "Twice daily with meals", purpose: "Blood sugar" },
          { id: 3, name: "Atorvastatin", dosage: "20mg", schedule: "Once daily at bedtime", purpose: "Cholesterol" },
          { id: 4, name: "Levothyroxine", dosage: "50mcg", schedule: "Once daily in the morning", purpose: "Thyroid" }
        ]);
        
        const { data: documentFiles, error: documentsError } = await supabase
          .storage
          .from('patient_documents')
          .list(`${user.id}/`);
          
        if (documentsError) {
          console.error('Error fetching documents:', documentsError);
          toast({
            title: "Error",
            description: "Failed to load your medical documents",
            variant: "destructive",
          });
        } else {
          setDocuments(documentFiles || []);
        }
      } catch (error) {
        console.error('Error fetching patient data:', error);
        toast({
          title: "Error",
          description: "Failed to load dashboard data",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPatientData();
  }, [user, toast]);
  
  const goToReports = () => {
    const reportsTab = document.querySelector('[data-value="reports"]');
    if (reportsTab && reportsTab instanceof HTMLElement) {
      reportsTab.click();
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-lifesage-primary"></div>
        <span className="ml-3 text-lg">Loading your health dashboard...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Emergency and Support Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <EmergencyAlert />
        <MentalHealthSupport />
        <VideoConsultationCard />
      </div>

      {/* Appointment and Reports Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <AppointmentBookingCard />
        <MedicalReportUploadCard />
      </div>

      {/* Vitals Display */}
      <VitalsDisplay />

      {/* Documents Section */}
      <DocumentsSection 
        documents={documents}
        goToReports={goToReports}
      />

      {/* Medications and Symptom Checker */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <MedicationsSection medications={medications} />
        <EnhancedSymptomChecker />
      </div>
    </div>
  );
};

export default PatientDashboard;
