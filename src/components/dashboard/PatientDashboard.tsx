import React, { useState, useEffect } from 'react';
import VitalsDisplay from './VitalsDisplay';
import EnhancedSymptomChecker from './EnhancedSymptomChecker';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Bell, MessageCircle, Video, Pill, Calendar, FileUp } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

const PatientDashboard = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [emergencyLoading, setEmergencyLoading] = useState(false);
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
  
  const handleEmergencyAlert = () => {
    setEmergencyLoading(true);
    
    const createEmergencyAlert = async () => {
      if (!user?.id) return;
      
      try {
        const { error } = await supabase
          .from('consultations')
          .insert({
            patient_id: user.id,
            status: 'emergency',
          });
          
        if (error) throw error;
        
        toast({
          title: "Emergency Alert Sent",
          description: "Your healthcare provider has been notified. Stay calm and await contact.",
          variant: "destructive",
        });
      } catch (error) {
        console.error('Error sending emergency alert:', error);
        toast({
          title: "Error",
          description: "Failed to send emergency alert. Please call emergency services directly.",
          variant: "destructive",
        });
      } finally {
        setEmergencyLoading(false);
      }
    };
    
    createEmergencyAlert();
  };

  const startMentalHealthChat = () => {
    toast({
      title: "Mental Health Support",
      description: "This feature is coming soon. You'll be able to chat anonymously with mental health professionals.",
    });
  };

  const startVideoConsultation = () => {
    const consultationTab = document.querySelector('[data-value="consultation"]');
    if (consultationTab && consultationTab instanceof HTMLElement) {
      consultationTab.click();
    }
  };

  const goToAppointments = () => {
    const appointmentsTab = document.querySelector('[data-value="appointments"]');
    if (appointmentsTab && appointmentsTab instanceof HTMLElement) {
      appointmentsTab.click();
    }
  };

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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-red-50 border-red-100">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-red-700">
              <Bell className="mr-2 h-5 w-5" />
              Emergency Alert
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-red-600 mb-4">
              Use only in case of medical emergency requiring immediate attention
            </p>
            <Button 
              variant="destructive" 
              className="w-full bg-red-600 hover:bg-red-700"
              onClick={handleEmergencyAlert}
              disabled={emergencyLoading}
            >
              {emergencyLoading ? "Sending Alert..." : "Send Emergency Alert"}
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-purple-50 border-purple-100">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-purple-700">
              <MessageCircle className="mr-2 h-5 w-5" />
              Mental Health Support
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-purple-600 mb-4">
              Connect with mental health professionals through secure chat
            </p>
            <Button 
              className="w-full bg-purple-600 hover:bg-purple-700"
              onClick={startMentalHealthChat}
            >
              Start Anonymous Chat
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-blue-50 border-blue-100">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-blue-700">
              <Video className="mr-2 h-5 w-5" />
              Video Consultation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-blue-600 mb-4">
              Schedule or start a video call with your healthcare provider
            </p>
            <Button 
              className="w-full bg-blue-600 hover:bg-blue-700"
              onClick={startVideoConsultation}
            >
              Start Consultation
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-green-50 border-green-100">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-green-700">
              <Calendar className="mr-2 h-5 w-5" />
              Book Appointment
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-green-600 mb-4">
              Schedule an appointment with one of our healthcare providers
            </p>
            <Button 
              className="w-full bg-green-600 hover:bg-green-700"
              onClick={goToAppointments}
            >
              Book Now
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-amber-50 border-amber-100">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-amber-700">
              <FileUp className="mr-2 h-5 w-5" />
              Upload Medical Reports
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-amber-600 mb-4">
              Share your medical reports securely with your healthcare provider
            </p>
            <Button 
              className="w-full bg-amber-600 hover:bg-amber-700"
              onClick={goToReports}
            >
              Upload Reports
            </Button>
          </CardContent>
        </Card>
      </div>

      <VitalsDisplay />

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileUp className="mr-2 h-5 w-5" />
            My Medical Documents
          </CardTitle>
          <CardDescription>
            Your recently uploaded medical reports and documents
          </CardDescription>
        </CardHeader>
        <CardContent>
          {documents.length === 0 ? (
            <div className="text-center py-4">
              <p className="text-gray-500">No documents uploaded yet.</p>
              <Button variant="outline" className="mt-4" onClick={goToReports}>
                Upload Your First Document
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              {documents.map((doc, index) => (
                <div key={index} className="flex justify-between items-center p-3 border rounded hover:bg-gray-50">
                  <div>
                    <p className="font-medium">{doc.name}</p>
                    <p className="text-xs text-gray-500">
                      Uploaded: {new Date(doc.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <Button variant="ghost" size="sm">View</Button>
                </div>
              ))}
              <Button variant="outline" className="w-full mt-4" onClick={goToReports}>
                Upload More Documents
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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

        <EnhancedSymptomChecker />
      </div>
    </div>
  );
};

export default PatientDashboard;
