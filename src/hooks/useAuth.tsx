
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

type User = {
  id: string;
  email: string;
  role: 'patient' | 'doctor';
  name?: string;
  specialty?: string;
};

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_OUT') {
          setUser(null);
          navigate('/login');
          return;
        }

        if (session?.user) {
          try {
            // Get user profile from profiles table
            const { data: profile, error } = await supabase
              .from('profiles')
              .select('id, email, role, full_name, specialty')
              .eq('id', session.user.id)
              .single();

            if (error) {
              console.error('Error fetching user profile:', error);
              throw error;
            }

            if (profile) {
              setUser({
                id: profile.id,
                email: profile.email,
                role: profile.role as 'patient' | 'doctor',
                name: profile.full_name,
                specialty: profile.specialty || undefined
              });
            }
          } catch (error) {
            console.error('Failed to fetch user profile', error);
            toast({
              title: "Error",
              description: "Failed to load user profile",
              variant: "destructive",
            });
          }
        }

        setLoading(false);
      }
    );

    // Check if user is already logged in
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        setLoading(false);
        // Only navigate to login if not already there
        if (window.location.pathname !== '/login' && window.location.pathname !== '/register') {
          navigate('/login');
        }
        return;
      }
      
      try {
        // Get user profile from profiles table
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('id, email, role, full_name, specialty')
          .eq('id', session.user.id)
          .single();

        if (error) {
          console.error('Error fetching user profile:', error);
          throw error;
        }

        if (profile) {
          setUser({
            id: profile.id,
            email: profile.email,
            role: profile.role as 'patient' | 'doctor',
            name: profile.full_name,
            specialty: profile.specialty || undefined
          });
        }
      } catch (error) {
        console.error('Failed to fetch user profile', error);
        toast({
          title: "Error",
          description: "Failed to load user profile",
          variant: "destructive",
        });
      }
      
      setLoading(false);
    };
    
    checkAuth();
    
    return () => {
      subscription?.unsubscribe();
    };
  }, [navigate, toast]);

  return { user, loading };
};
