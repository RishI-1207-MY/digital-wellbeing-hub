
import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import DashboardTabs from '@/components/dashboard/DashboardTabs';
import { useAuth } from '@/hooks/useAuth';

const Dashboard = () => {
  const { user, loading } = useAuth();

  return (
    <DashboardLayout user={user} loading={loading}>
      {user && <DashboardTabs userRole={user.role} />}
    </DashboardLayout>
  );
};

export default Dashboard;
