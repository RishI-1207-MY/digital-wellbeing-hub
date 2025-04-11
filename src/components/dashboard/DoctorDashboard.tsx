
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { Search, UserCircle, Video, FileText, Bell, Calendar } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

// Mock patient data (would be replaced with Supabase data in a real app)
const patients = [
  { 
    id: 1, 
    name: "Sarah Johnson", 
    age: 42, 
    lastVisit: "2025-03-15",
    status: "stable",
    alerts: [],
    conditions: ["Hypertension", "Type 2 Diabetes"]
  },
  { 
    id: 2, 
    name: "Michael Chen", 
    age: 35, 
    lastVisit: "2025-04-01",
    status: "follow-up",
    alerts: [],
    conditions: ["Asthma"]
  },
  { 
    id: 3, 
    name: "Robert Garcia", 
    age: 67, 
    lastVisit: "2025-03-28",
    status: "critical",
    alerts: ["Irregular heartbeat detected"],
    conditions: ["Coronary Artery Disease", "Hypertension"]
  },
  { 
    id: 4, 
    name: "Emily Martinez", 
    age: 29, 
    lastVisit: "2025-02-22",
    status: "stable",
    alerts: [],
    conditions: ["Anxiety", "Migraines"]
  },
  { 
    id: 5, 
    name: "James Wilson", 
    age: 58, 
    lastVisit: "2025-04-05",
    status: "emergency",
    alerts: ["Emergency alert triggered 10 minutes ago"],
    conditions: ["COPD", "Hypertension"]
  }
];

// Mock appointments data (would be replaced with Supabase data in a real app)
const appointments = [
  { id: 1, patient: "Sarah Johnson", type: "Follow-up", time: "10:00 AM", date: "2025-04-10", status: "upcoming" },
  { id: 2, patient: "Robert Garcia", type: "Medication Review", time: "11:30 AM", date: "2025-04-10", status: "upcoming" },
  { id: 3, patient: "Emily Martinez", type: "Annual Physical", time: "2:15 PM", date: "2025-04-10", status: "upcoming" },
  { id: 4, patient: "Michael Chen", type: "Lab Results", time: "4:00 PM", date: "2025-04-10", status: "upcoming" },
  { id: 5, patient: "James Wilson", type: "Emergency Consultation", time: "Now", date: "2025-04-10", status: "active" }
];

interface DoctorDashboardProps {
  activeTab?: 'dashboard' | 'patients';
}

const DoctorDashboard: React.FC<DoctorDashboardProps> = ({ activeTab = 'dashboard' }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();
  const [registeredPatients, setRegisteredPatients] = useState<any[]>([]);
  
  // Fetch registered patients from Supabase (in a real app)
  useEffect(() => {
    const fetchRegisteredPatients = async () => {
      try {
        // This would be implemented in a real app with actual Supabase queries
        // const { data, error } = await supabase
        //   .from('profiles')
        //   .select('*')
        //   .eq('role', 'patient');
        
        // if (error) throw error;
        // setRegisteredPatients(data || []);
        
        // For now, we'll just use our mock data
        console.log("Would fetch registered patients from Supabase in a real app");
      } catch (error) {
        console.error("Error fetching patients:", error);
      }
    };
    
    fetchRegisteredPatients();
  }, []);
  
  const filteredPatients = patients.filter(patient => 
    patient.name.toLowerCase().includes(searchTerm.toLowerCase())
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
                    <CardTitle className="text-lg">{patient.name}</CardTitle>
                    <CardDescription>
                      {patient.age} years • Last visit: {new Date(patient.lastVisit).toLocaleDateString()}
                    </CardDescription>
                  </div>
                </div>
                <StatusBadge status={patient.status} />
              </div>
            </CardHeader>
            <CardContent>
              {patient.conditions.length > 0 && (
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
              
              {patient.alerts.length > 0 && (
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
                  onClick={() => viewEHR(patient.name)}
                >
                  <FileText className="h-4 w-4 mr-1" />
                  View EHR
                </Button>
                <Button 
                  variant={patient.status === 'emergency' ? 'destructive' : 'default'} 
                  size="sm"
                  className="flex-1"
                  onClick={() => startVideoConsultation(patient.name)}
                >
                  <Video className="h-4 w-4 mr-1" />
                  {patient.status === 'emergency' ? 'Urgent Call' : 'Video Call'}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  // Dashboard Tab Content - Overview with emergency alerts and today's appointments
  const DashboardTabContent = () => (
    <div className="space-y-6">
      {/* Emergency Alerts */}
      {patients.some(patient => patient.status === "emergency") && (
        <Card className="bg-red-50 border-red-100">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-red-700">
              <Bell className="mr-2 h-5 w-5" />
              Emergency Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {patients
                .filter(patient => patient.status === "emergency")
                .map(patient => (
                  <div key={patient.id} className="flex items-center justify-between bg-white p-3 rounded-lg border border-red-200">
                    <div>
                      <span className="font-medium text-red-800">{patient.name}</span>
                      <p className="text-sm text-red-600">
                        {patient.alerts[0]}
                      </p>
                    </div>
                    <Button 
                      className="bg-red-600 hover:bg-red-700"
                      onClick={() => respondToEmergency(patient.name)}
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
          <div className="space-y-4">
            {appointments.map(appointment => (
              <div 
                key={appointment.id} 
                className={`flex justify-between items-center p-3 rounded-lg border
                  ${appointment.status === 'active' ? 'bg-green-50 border-green-200' : 'bg-white'}
                `}
              >
                <div>
                  <div className="flex items-center">
                    <span className="font-medium">{appointment.patient}</span>
                    {appointment.status === 'active' && (
                      <Badge className="ml-2 bg-green-500">In Progress</Badge>
                    )}
                  </div>
                  <p className="text-sm text-gray-500">
                    {appointment.type} • {appointment.time}
                  </p>
                </div>
                <Button 
                  variant={appointment.status === 'active' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => startVideoConsultation(appointment.patient)}
                >
                  <Video className="h-4 w-4 mr-1" />
                  {appointment.status === 'active' ? 'Join Now' : 'Start Call'}
                </Button>
              </div>
            ))}
          </div>
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
