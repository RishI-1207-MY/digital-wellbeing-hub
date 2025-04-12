
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export type UserRole = 'patient' | 'doctor';

export type User = {
  id: string;
  email: string;
  role: UserRole;
  name?: string;
  specialty?: string;
  verification_status?: 'pending' | 'approved' | 'rejected';
};

export async function fetchUserProfile(userId: string): Promise<User | null> {
  try {
    // Check if profile exists for the user
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('id, email, role, full_name, specialty')
      .eq('id', userId)
      .maybeSingle();

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching user profile:', error);
      throw error;
    }

    if (!profile) return null;

    // If the user is a doctor, check verification status
    let verificationStatus = undefined;
    
    if (profile.role === 'doctor') {
      const { data, error: doctorError } = await supabase
        .from('doctors')
        .select('verification_status')
        .eq('id', profile.id)
        .maybeSingle();
        
      if (!doctorError && data) {
        verificationStatus = data.verification_status;
      }
    }
    
    return {
      id: profile.id,
      email: profile.email,
      role: profile.role as UserRole,
      name: profile.full_name,
      specialty: profile.specialty || undefined,
      verification_status: verificationStatus
    };
  } catch (error) {
    console.error('Failed to fetch user profile', error);
    return null;
  }
}

export async function createUserProfile(userId: string, userData: any): Promise<User | null> {
  try {
    const newProfile = {
      id: userId,
      email: userData.email,
      role: userData.role,
      full_name: userData.name || userData.email?.split('@')[0] || 'User',
      specialty: userData.specialty || null
    };

    const { error: insertError } = await supabase
      .from('profiles')
      .insert(newProfile);

    if (insertError) {
      console.error('Error creating user profile:', insertError);
      throw insertError;
    }

    // Also create a record in the patients or doctors table
    if (userData.role === 'patient') {
      await supabase
        .from('patients')
        .insert({ id: userId });
    } else if (userData.role === 'doctor') {
      await supabase
        .from('doctors')
        .insert({ 
          id: userId, 
          specialty: userData.specialty || 'General Practice',
          experience: userData.experience || 0,
          bio: userData.bio || '',
          verification_status: 'pending'
        });
    }

    return {
      id: userId,
      email: userData.email || '',
      role: userData.role,
      name: userData.name,
      specialty: userData.specialty,
      verification_status: userData.role === 'doctor' ? 'pending' : undefined
    };
  } catch (error) {
    console.error('Failed to create user profile', error);
    return null;
  }
}
