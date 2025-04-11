
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PatientDashboard from './PatientDashboard';
import DoctorDashboard from './DoctorDashboard';
import HealthChatbot from '@/components/chat/HealthChatbot';
import VideoConsultation from '@/components/consultation/VideoConsultation';
import SymptomChecker from './symptom-checker/SymptomChecker';
import AppointmentBooking from '@/components/appointments/AppointmentBooking';
import MedicalReportUpload from '@/components/reports/MedicalReportUpload';
import { useAuth } from '@/hooks/useAuth';

interface DashboardTabsProps {
  userRole: 'doctor' | 'patient';
}

const DashboardTabs: React.FC<DashboardTabsProps> = ({ userRole }) => {
  const { user } = useAuth();
  
  return (
    <>
      <h1 className="text-2xl font-bold mb-6">
        {userRole === 'doctor' ? 'Provider Dashboard' : 'Patient Dashboard'}
        {user?.name && <span className="ml-2 text-lg font-normal text-gray-500">Welcome, {user.name}</span>}
      </h1>
      
      {userRole === 'doctor' ? (
        // Doctor-specific tabs
        <Tabs defaultValue="dashboard">
          <TabsList className="mb-6 bg-white">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="patients">My Patients</TabsTrigger>
            <TabsTrigger value="consultations">Video Consultations</TabsTrigger>
          </TabsList>
          
          <TabsContent value="dashboard">
            <DoctorDashboard />
          </TabsContent>
          
          <TabsContent value="patients">
            <DoctorDashboard activeTab="patients" />
          </TabsContent>
          
          <TabsContent value="consultations">
            <VideoConsultation userRole="doctor" />
          </TabsContent>
        </Tabs>
      ) : (
        // Patient-specific tabs
        <Tabs defaultValue="dashboard">
          <TabsList className="mb-6 bg-white">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="appointments">Appointments</TabsTrigger>
            <TabsTrigger value="consultation">Video Consultation</TabsTrigger>
            <TabsTrigger value="chat">AI Health Assistant</TabsTrigger>
            <TabsTrigger value="symptom-checker">Symptom Checker</TabsTrigger>
            <TabsTrigger value="reports">Medical Reports</TabsTrigger>
          </TabsList>
          
          <TabsContent value="dashboard">
            <PatientDashboard />
          </TabsContent>
          
          <TabsContent value="appointments">
            <AppointmentBooking />
          </TabsContent>
          
          <TabsContent value="consultation">
            <VideoConsultation userRole="patient" />
          </TabsContent>
          
          <TabsContent value="chat">
            <HealthChatbot />
          </TabsContent>
          
          <TabsContent value="symptom-checker">
            <SymptomChecker />
          </TabsContent>
          
          <TabsContent value="reports">
            <MedicalReportUpload />
          </TabsContent>
        </Tabs>
      )}
    </>
  );
};

export default DashboardTabs;
