
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PatientDashboard from './PatientDashboard';
import DoctorDashboard from './DoctorDashboard';
import HealthChatbot from '@/components/chat/HealthChatbot';
import VideoConsultation from '@/components/consultation/VideoConsultation';
import EnhancedSymptomChecker from './EnhancedSymptomChecker';
import AppointmentBooking from '@/components/appointments/AppointmentBooking';
import MedicalReportUpload from '@/components/reports/MedicalReportUpload';

interface DashboardTabsProps {
  userRole: 'doctor' | 'patient';
}

const DashboardTabs: React.FC<DashboardTabsProps> = ({ userRole }) => {
  return (
    <>
      <h1 className="text-2xl font-bold mb-6">
        {userRole === 'doctor' ? 'Provider Dashboard' : 'Patient Dashboard'}
      </h1>
      
      <Tabs defaultValue="dashboard">
        <TabsList className="mb-6 bg-white">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="chat">AI Health Assistant</TabsTrigger>
          <TabsTrigger value="consultation">Video Consultation</TabsTrigger>
          <TabsTrigger value="symptom-checker">Symptom Checker</TabsTrigger>
          <TabsTrigger value="appointments">Appointments</TabsTrigger>
          <TabsTrigger value="reports">Medical Reports</TabsTrigger>
        </TabsList>
        
        <TabsContent value="dashboard">
          {userRole === 'doctor' ? <DoctorDashboard /> : <PatientDashboard />}
        </TabsContent>
        
        <TabsContent value="chat">
          <HealthChatbot />
        </TabsContent>
        
        <TabsContent value="consultation">
          <VideoConsultation />
        </TabsContent>
        
        <TabsContent value="symptom-checker">
          <EnhancedSymptomChecker />
        </TabsContent>
        
        <TabsContent value="appointments">
          <AppointmentBooking />
        </TabsContent>
        
        <TabsContent value="reports">
          <MedicalReportUpload />
        </TabsContent>
      </Tabs>
    </>
  );
};

export default DashboardTabs;
