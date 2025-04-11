
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { Search, UserCircle, Video, FileText, Bell, Calendar } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

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

interface DoctorDashboardProps {
  activeTab?: 'dashboard' | 'patients';
}

const DoctorDashboard: React.FC<DoctorDashboardProps> = ({ activeTab = 'dashboard' }) => {
  const [searchTerm, setSearchTerm] = useState("");
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
            profiles:id (
              id,
              full_name
            )
          `);
        
        if (error) throw error;
        
        // For demo, we'll add synthetic statuses and conditions
        const enhancedPatients = (data || []).map((patient, index) => {
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
            patients:patient_id (
              profiles:id (
                full_name
              )
            )
          `)
          .eq('doctor_id', user.id);
        
        if (error) throw error;
        
        const formattedAppointments = (data || []).map(appointment => ({
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
  
  const filteredPatients = patients.filter(patient => 
    patient.full_name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
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

  // Patient List View (used for both dashboard and patients tab)
  const PatientListView = () => (
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
          ))}
        </div>
      )}
    </div>
  );

  // Dashboard Tab Content - Overview with emergency alerts and today's appointments
  const DashboardTabContent = () => (
    <div className="space-y-6">
      {/* Emergency Alerts */}
      {filteredPatients.some(patient => patient.status === "emergency") && (
        <Card className="bg-red-50 border-red-100">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-red-700">
              <Bell className="mr-2 h-5 w-5" />
              Emergency Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {filteredPatients
                .filter(patient => patient.status === "emergency")
                .map(patient => (
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
      )}

      {/* Today's Appointments */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="mr-2 h-5 w-5" />
            Today's Schedule
          </CardTitle>
          <CardDescription>
            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-4">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-lifesage-primary"></div>
              <p className="mt-2 text-gray-500">Loading appointments...</p>
            </div>
          ) : appointments.length === 0 ? (
            <div className="text-center py-4">
              <p className="text-gray-500">No appointments scheduled for today.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {appointments.map(appointment => {
                const isToday = new Date(appointment.appointment_date).toDateString() === new Date().toDateString();
                if (!isToday) return null;
                
                return (
                  <div 
                    key={appointment.id} 
                    className={`flex justify-between items-center p-3 rounded-lg border
                      ${appointment.status === 'active' ? 'bg-green-50 border-green-200' : 'bg-white'}
                    `}
                  >
                    <div>
                      <div className="flex items-center">
                        <span className="font-medium">{appointment.patient_name}</span>
                        {appointment.status === 'active' && (
                          <Badge className="ml-2 bg-green-500">In Progress</Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-500">
                        {appointment.reason} • {appointment.appointment_time}
                      </p>
                    </div>
                    <Button 
                      variant={appointment.status === 'active' ? 'default' : 'outline'} 
                      size="sm"
                      onClick={() => startVideoConsultation(appointment.patient_name)}
                    >
                      <Video className="h-4 w-4 mr-1" />
                      {appointment.status === 'active' ? 'Join Now' : 'Start Call'}
                    </Button>
                  </div>
                );
              })}
              {appointments.filter(a => new Date(a.appointment_date).toDateString() === new Date().toDateString()).length === 0 && (
                <div className="text-center py-4">
                  <p className="text-gray-500">No appointments scheduled for today.</p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );

  // Return different views based on the active tab
  return activeTab === 'dashboard' ? <DashboardTabContent /> : <PatientListView />;
};

// Helper component for patient status badges
const StatusBadge = ({ status }: { status: string }) => {
  switch (status) {
    case 'emergency':
      return <Badge className="bg-red-500">Emergency</Badge>;
    case 'critical':
      return <Badge className="bg-orange-500">Critical</Badge>;
    case 'follow-up':
      return <Badge variant="outline" className="text-blue-500 border-blue-200">Follow-up</Badge>;
    default:
      return <Badge variant="outline" className="text-green-500 border-green-200">Stable</Badge>;
  }
};

export default DoctorDashboard;
