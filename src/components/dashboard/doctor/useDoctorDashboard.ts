
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { PatientWithProfile, AppointmentWithPatient } from '@/integrations/supabase/types-augmentation';

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

interface Appointment {
  id: string;
  patient_id: string;
  patient_name: string;
  appointment_date: string;
  appointment_time: string;
  reason: string;
  status: string;
  notes: string | null;
}

export const useDoctorDashboard = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();
  
  // Fetch patients data
  useEffect(() => {
    const fetchPatients = async () => {
      if (!user?.id) return;
      
      try {
        const { data, error } = await supabase
          .from('patients')
          .select(`
            id,
            date_of_birth,
            medical_history,
            profiles!inner (
              id,
              full_name
            )
          `);
        
        if (error) throw error;
        
        if (data) {
          // For demo, we'll add synthetic statuses and conditions
          const enhancedPatients = data.map((patient: PatientWithProfile, index: number) => {
            // Create synthetic data for demonstration
            const statuses = ['stable', 'follow-up', 'critical', 'emergency'] as const;
            const randomStatus = statuses[index % statuses.length];
            
            const conditions = [
              ["Hypertension", "Type 2 Diabetes"],
              ["Asthma"],
              ["Coronary Artery Disease", "Hypertension"],
              ["Anxiety", "Migraines"],
              ["COPD", "Hypertension"]
            ];
            
            const alerts = randomStatus === 'emergency' 
              ? ["Emergency alert triggered 10 minutes ago"] 
              : randomStatus === 'critical' 
                ? ["Irregular heartbeat detected"] 
                : [];
                
            return {
              id: patient.id,
              profile_id: patient.profiles.id,
              full_name: patient.profiles.full_name,
              date_of_birth: patient.date_of_birth,
              medical_history: patient.medical_history,
              status: randomStatus,
              alerts,
              conditions: conditions[index % conditions.length]
            };
          });
          
          setPatients(enhancedPatients);
        }
      } catch (error) {
        console.error("Error fetching patients:", error);
        toast({
          title: "Error",
          description: "Failed to load patients data",
          variant: "destructive"
        });
      }
    };
    
    fetchPatients();
  }, [user, toast]);
  
  // Fetch appointments
  useEffect(() => {
    const fetchAppointments = async () => {
      if (!user?.id) return;
      
      try {
        const { data, error } = await supabase
          .from('appointments')
          .select(`
            id,
            patient_id,
            appointment_date,
            appointment_time,
            reason,
            status,
            notes,
            patients!inner (
              profiles!inner (
                full_name
              )
            )
          `)
          .eq('doctor_id', user.id);
        
        if (error) throw error;
        
        if (data) {
          const formattedAppointments = data.map((appointment: AppointmentWithPatient) => ({
            id: appointment.id,
            patient_id: appointment.patient_id,
            patient_name: appointment.patients.profiles.full_name,
            appointment_date: appointment.appointment_date,
            appointment_time: appointment.appointment_time,
            reason: appointment.reason,
            status: appointment.status,
            notes: appointment.notes
          }));
          
          setAppointments(formattedAppointments);
        }
      } catch (error) {
        console.error("Error fetching appointments:", error);
        toast({
          title: "Error",
          description: "Failed to load appointments data",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchAppointments();
  }, [user, toast]);

  const startVideoConsultation = (patientName: string) => {
    toast({
      title: "Starting Video Consultation",
      description: `Connecting with ${patientName} via WebRTC. Initiating secure connection.`,
    });
  };
  
  const viewEHR = (patientName: string) => {
    toast({
      title: "Electronic Health Records",
      description: `Accessing ${patientName}'s EHR. Loading patient data.`,
    });
  };
  
  const respondToEmergency = (patientName: string) => {
    toast({
      title: "Emergency Response",
      description: `Initiating emergency protocol for ${patientName}. Connecting to patient via priority WebRTC channel.`,
      variant: "destructive",
    });
  };

  return {
    patients,
    appointments,
    loading,
    startVideoConsultation,
    viewEHR,
    respondToEmergency
  };
};
