
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
  verification_status?: 'pending' | 'approved' | 'rejected';
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
            // Check if profile exists for the user
            const { data: profile, error } = await supabase
              .from('profiles')
              .select('id, email, role, full_name, specialty')
              .eq('id', session.user.id)
              .maybeSingle(); // Use maybeSingle instead of single to avoid errors when no profile is found

            if (error && error.code !== 'PGRST116') {
              console.error('Error fetching user profile:', error);
              throw error;
            }

            if (profile) {
              // If the user is a doctor, check verification status
              let verificationStatus = undefined;
              
              if (profile.role === 'doctor') {
                const { data: doctorData, error: doctorError } = await supabase
                  .from('doctors')
                  .select('verification_status')
                  .eq('id', profile.id)
                  .maybeSingle();
                  
                if (!doctorError && doctorData) {
                  verificationStatus = doctorData.verification_status;
                }
              }
              
              setUser({
                id: profile.id,
                email: profile.email,
                role: profile.role as 'patient' | 'doctor',
                name: profile.full_name,
                specialty: profile.specialty || undefined,
                verification_status: verificationStatus
              });
            } else {
              // If no profile exists, we'll create one based on user metadata
              const metadata = session.user.user_metadata;
              if (metadata && metadata.role) {
                const newProfile = {
                  id: session.user.id,
                  email: session.user.email,
                  role: metadata.role,
                  full_name: metadata.name || session.user.email?.split('@')[0] || 'User',
                  specialty: metadata.specialty || null
                };

                const { error: insertError } = await supabase
                  .from('profiles')
                  .insert(newProfile);

                if (insertError) {
                  console.error('Error creating user profile:', insertError);
                  throw insertError;
                }

                // Also create a record in the patients or doctors table
                if (metadata.role === 'patient') {
                  await supabase
                    .from('patients')
                    .insert({ id: session.user.id });
                } else if (metadata.role === 'doctor') {
                  await supabase
                    .from('doctors')
                    .insert({ 
                      id: session.user.id, 
                      specialty: metadata.specialty || 'General Practice',
                      experience: metadata.experience || 0,
                      bio: metadata.bio || '',
                      verification_status: 'pending'
                    });
                }

                setUser({
                  id: session.user.id,
                  email: session.user.email || '',
                  role: metadata.role,
                  name: metadata.name,
                  specialty: metadata.specialty,
                  verification_status: metadata.role === 'doctor' ? 'pending' : undefined
                });
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
        // Get user profile from profiles table
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('id, email, role, full_name, specialty')
          .eq('id', session.user.id)
          .maybeSingle(); // Use maybeSingle instead of single

        if (error && error.code !== 'PGRST116') {
          console.error('Error fetching user profile:', error);
          throw error;
        }

        if (profile) {
          // If the user is a doctor, check verification status
          let verificationStatus = undefined;
          
          if (profile.role === 'doctor') {
            const { data: doctorData, error: doctorError } = await supabase
              .from('doctors')
              .select('verification_status')
              .eq('id', profile.id)
              .maybeSingle();
              
            if (!doctorError && doctorData) {
              verificationStatus = doctorData.verification_status;
            }
          }
          
          setUser({
            id: profile.id,
            email: profile.email,
            role: profile.role as 'patient' | 'doctor',
            name: profile.full_name,
            specialty: profile.specialty || undefined,
            verification_status: verificationStatus
          });
        } else {
          // If no profile exists, create one based on user metadata
          const metadata = session.user.user_metadata;
          if (metadata && metadata.role) {
            const newProfile = {
              id: session.user.id,
              email: session.user.email,
              role: metadata.role,
              full_name: metadata.name || session.user.email?.split('@')[0] || 'User',
              specialty: metadata.specialty || null
            };

            const { error: insertError } = await supabase
              .from('profiles')
              .insert(newProfile);

            if (insertError) {
              console.error('Error creating user profile:', insertError);
              throw insertError;
            }

            // Also create a record in the patients or doctors table
            if (metadata.role === 'patient') {
              await supabase
                .from('patients')
                .insert({ id: session.user.id });
            } else if (metadata.role === 'doctor') {
              await supabase
                .from('doctors')
                .insert({ 
                  id: session.user.id, 
                  specialty: metadata.specialty || 'General Practice',
                  experience: metadata.experience || 0,
                  bio: metadata.bio || '',
                  verification_status: 'pending'
                });
            }

            setUser({
              id: session.user.id,
              email: session.user.email || '',
              role: metadata.role,
              name: metadata.name,
              specialty: metadata.specialty,
              verification_status: metadata.role === 'doctor' ? 'pending' : undefined
            });
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
  }, [navigate, toast]);

  return { user, loading };
};
