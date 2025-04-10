import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { LogOut, Menu, X } from 'lucide-react';
import PatientDashboard from '@/components/dashboard/PatientDashboard';
import DoctorDashboard from '@/components/dashboard/DoctorDashboard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import HealthChatbot from '@/components/chat/HealthChatbot';
import VideoConsultation from '@/components/consultation/VideoConsultation';
import EnhancedSymptomChecker from '@/components/dashboard/EnhancedSymptomChecker';
import { supabase } from '@/integrations/supabase/client';

type User = {
  email: string;
  role: 'patient' | 'doctor';
  name?: string;
};

const Dashboard = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Check if user is logged in
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      
      if (!data.session) {
        navigate('/login');
        return;
      }
      
      // Get user data from localStorage (in a real app, this would come from a database)
      const storedUser = localStorage.getItem('user');
      
      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser as User);
        } catch (error) {
          console.error('Failed to parse user data', error);
          navigate('/login');
        }
      } else {
        // If no user data in localStorage, create mock data based on email
        const email = data.session.user.email || '';
        const mockUser: User = {
          email: email,
          role: email.includes('doctor') ? 'doctor' : 'patient',
          name: email.split('@')[0]
        };
        
        localStorage.setItem('user', JSON.stringify(mockUser));
        setUser(mockUser);
      }
      
      setLoading(false);
    };
    
    checkAuth();
    
    // Set up auth state change listener
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        localStorage.removeItem('user');
        navigate('/login');
      }
    });
    
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem('user');
    toast({
      title: "Logged out successfully",
      description: "You have been logged out of your account",
    });
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-lifesage-primary"></div>
          <p className="mt-4 text-gray-500">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-20 bg-black bg-opacity-50 lg:hidden" 
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
      
      {/* Sidebar */}
      <div 
        className={`fixed inset-y-0 left-0 z-30 w-64 transform bg-white shadow-lg transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between px-4 py-6 border-b">
            <h1 className="text-xl font-bold text-lifesage-primary">LifeSage Health</h1>
            <button className="lg:hidden" onClick={() => setSidebarOpen(false)}>
              <X className="h-6 w-6" />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto px-4 py-4">
            <div className="mb-6 text-center">
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                <span className="text-xl font-medium text-gray-600">
                  {user?.email?.charAt(0).toUpperCase() || 'U'}
                </span>
              </div>
              <h2 className="mt-2 text-lg font-medium">
                {user?.email?.split('@')[0] || 'User'}
              </h2>
              <p className="text-sm text-gray-500 capitalize">
                {user?.role || 'User'}
              </p>
            </div>
            
            <nav className="space-y-1">
              <a
                href="#"
                className="flex items-center rounded-md px-3 py-2 text-sm font-medium text-lifesage-primary bg-blue-50"
              >
                Dashboard
              </a>
              {user?.role === 'patient' ? (
                <>
                  <a
                    href="#"
                    className="flex items-center rounded-md px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  >
                    My Health Records
                  </a>
                  <a
                    href="#"
                    className="flex items-center rounded-md px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  >
                    Appointments
                  </a>
                  <a
                    href="#"
                    className="flex items-center rounded-md px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  >
                    Medications
                  </a>
                  <a
                    href="#"
                    className="flex items-center rounded-md px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  >
                    Mental Health
                  </a>
                </>
              ) : (
                <>
                  <a
                    href="#"
                    className="flex items-center rounded-md px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  >
                    Patient Records
                  </a>
                  <a
                    href="#"
                    className="flex items-center rounded-md px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  >
                    Appointments
                  </a>
                  <a
                    href="#"
                    className="flex items-center rounded-md px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  >
                    Telemedicine
                  </a>
                </>
              )}
              <a
                href="#"
                className="flex items-center rounded-md px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              >
                Settings
              </a>
            </nav>
          </div>
          
          <div className="border-t p-4">
            <Button 
              variant="outline" 
              className="w-full justify-start text-gray-500" 
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Log out
            </Button>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navigation */}
        <header className="bg-white shadow-sm z-10">
          <div className="flex items-center justify-between p-4">
            <button 
              className="lg:hidden text-gray-500 focus:outline-none"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-6 w-6" />
            </button>
            <div className="lg:hidden text-lg font-semibold text-lifesage-primary">
              LifeSage Health
            </div>
            <div className="flex items-center space-x-4">
              <span className="hidden md:inline text-sm text-gray-500">
                {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
              </span>
              <Button variant="ghost" size="sm" onClick={handleLogout} className="md:hidden">
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </header>
        
        {/* Dashboard Content with Tabs */}
        <main className="flex-1 overflow-y-auto bg-gray-100 p-4 md:p-6">
          <h1 className="text-2xl font-bold mb-6">
            {user?.role === 'doctor' ? 'Provider Dashboard' : 'Patient Dashboard'}
          </h1>
          
          <Tabs defaultValue="dashboard">
            <TabsList className="mb-6 bg-white">
              <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
              <TabsTrigger value="chat">AI Health Assistant</TabsTrigger>
              <TabsTrigger value="consultation">Video Consultation</TabsTrigger>
              <TabsTrigger value="symptom-checker">Symptom Checker</TabsTrigger>
            </TabsList>
            
            <TabsContent value="dashboard">
              {user?.role === 'doctor' ? <DoctorDashboard /> : <PatientDashboard />}
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
          </Tabs>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
