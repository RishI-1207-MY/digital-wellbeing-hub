
import React from 'react';
import PatientListView from './doctor/PatientListView';
import EmergencyAlerts from './doctor/EmergencyAlerts';
import TodaySchedule from './doctor/TodaySchedule';
import { useDoctorDashboard } from './doctor/useDoctorDashboard';

interface DoctorDashboardProps {
  activeTab?: 'dashboard' | 'patients';
}

const DoctorDashboard: React.FC<DoctorDashboardProps> = ({ activeTab = 'dashboard' }) => {
  const {
    patients,
    appointments,
    loading,
    startVideoConsultation,
    viewEHR,
    respondToEmergency
  } = useDoctorDashboard();
  
  // Dashboard Tab Content - Overview with emergency alerts and today's appointments
  const DashboardTabContent = () => (
    <div className="space-y-6">
      {/* Emergency Alerts */}
      <EmergencyAlerts 
        patients={patients} 
        respondToEmergency={respondToEmergency} 
      />

      {/* Today's Appointments */}
      <TodaySchedule 
        appointments={appointments} 
        loading={loading} 
        startVideoConsultation={startVideoConsultation} 
      />
    </div>
  );

  // Return different views based on the active tab
  return activeTab === 'dashboard' ? (
    <DashboardTabContent />
  ) : (
    <PatientListView 
      patients={patients} 
      loading={loading} 
      viewEHR={viewEHR} 
      startVideoConsultation={startVideoConsultation} 
    />
  );
};

export default DoctorDashboard;
