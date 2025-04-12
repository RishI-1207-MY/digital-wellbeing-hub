
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { fetchUserProfile, createUserProfile, User } from '@/services/userProfileService';
import { useAuthState } from './useAuthState';

export const useAuth = () => {
  const { user, loading, setLoading, updateUser } = useAuthState();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_OUT') {
          updateUser(null);
          navigate('/login');
          return;
        }

        if (session?.user) {
          try {
            // First try to fetch existing profile
            const profile = await fetchUserProfile(session.user.id);
            
            if (profile) {
              updateUser(profile);
            } else {
              // If no profile exists, create one based on user metadata
              const metadata = session.user.user_metadata;
              if (metadata && metadata.role) {
                const newUser = await createUserProfile(session.user.id, {
                  email: session.user.email,
                  role: metadata.role,
                  name: metadata.name,
                  specialty: metadata.specialty,
                  experience: metadata.experience,
                  bio: metadata.bio
                });
                
                if (newUser) {
                  updateUser(newUser);
                }
              }
            }
          } catch (error) {
            console.error('Failed to fetch or create user profile', error);
            toast({
              title: "Error",
              description: "Failed to load user profile. Please try logging in again.",
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
        // Try to fetch existing profile
        const profile = await fetchUserProfile(session.user.id);
        
        if (profile) {
          updateUser(profile);
        } else {
          // If no profile exists, create one based on user metadata
          const metadata = session.user.user_metadata;
          if (metadata && metadata.role) {
            const newUser = await createUserProfile(session.user.id, {
              email: session.user.email,
              role: metadata.role,
              name: metadata.name,
              specialty: metadata.specialty,
              experience: metadata.experience,
              bio: metadata.bio
            });
            
            if (newUser) {
              updateUser(newUser);
            }
          }
        }
      } catch (error) {
        console.error('Failed to fetch or create user profile', error);
        toast({
          title: "Error",
          description: "Failed to load user profile. Please try logging in again.",
          variant: "destructive",
        });
      }
      
      setLoading(false);
    };
    
    checkAuth();
    
    return () => {
      subscription?.unsubscribe();
    };
  }, [navigate, toast, updateUser, setLoading]);

  return { user, loading };
};

// Re-export the User type for convenience
export type { User };
