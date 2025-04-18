
import React, { useState } from 'react';
import VitalsDisplay from './VitalsDisplay';
import SymptomChecker from './SymptomChecker';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Bell, MessageCircle, Video, Pill } from 'lucide-react';

// Mock medication data
const medications = [
  { id: 1, name: "Lisinopril", dosage: "10mg", schedule: "Once daily", purpose: "Blood pressure" },
  { id: 2, name: "Metformin", dosage: "500mg", schedule: "Twice daily with meals", purpose: "Blood sugar" },
  { id: 3, name: "Atorvastatin", dosage: "20mg", schedule: "Once daily at bedtime", purpose: "Cholesterol" },
  { id: 4, name: "Levothyroxine", dosage: "50mcg", schedule: "Once daily in the morning", purpose: "Thyroid" }
];

const PatientDashboard = () => {
  const { toast } = useToast();
  const [emergencyLoading, setEmergencyLoading] = useState(false);
  
  const handleEmergencyAlert = () => {
    setEmergencyLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Emergency Alert Sent",
        description: "Your healthcare provider has been notified. Stay calm and await contact.",
        variant: "destructive",
      });
      setEmergencyLoading(false);
    }, 1500);
  };

  const startMentalHealthChat = () => {
    toast({
      title: "Mental Health Support",
      description: "This feature is coming soon. You'll be able to chat anonymously with mental health professionals.",
    });
  };

  const startVideoConsultation = () => {
    toast({
      title: "Video Consultation",
      description: "This feature is coming soon. You'll be able to connect with healthcare providers via video.",
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Cards */}
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

      {/* Vitals Section */}
      <VitalsDisplay />

      {/* Two Column Layout for Remaining Components */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Medication List */}
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

        {/* Symptom Checker */}
        <SymptomChecker />
      </div>
    </div>
  );
};

export default PatientDashboard;
