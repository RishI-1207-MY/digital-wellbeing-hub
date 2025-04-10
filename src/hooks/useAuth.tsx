
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

type User = {
  email: string;
  role: 'patient' | 'doctor';
  name?: string;
};

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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

  return { user, loading };
};
