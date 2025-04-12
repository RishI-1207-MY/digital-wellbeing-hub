
import { supabase } from './client';

export const initSupabaseServices = async () => {
  try {
    // Check if doctor_verifications bucket exists
    const { data: buckets, error } = await supabase.storage.listBuckets();
    
    if (error) {
      console.error('Error checking buckets:', error);
      return;
    }
    
    const verificationBucketExists = buckets.some(bucket => bucket.name === 'doctor_verifications');
    
    if (!verificationBucketExists) {
      // Create the doctor_verifications bucket if it doesn't exist
      const { error: createError } = await supabase.storage.createBucket('doctor_verifications', {
        public: false,
        fileSizeLimit: 10485760, // 10MB
      });
      
      if (createError) {
        console.error('Error creating doctor_verifications bucket:', createError);
      } else {
        console.log('Created doctor_verifications bucket');
        
        // For newer versions of Supabase, policies are managed differently
        // We need to get the current session separately now
        const { data: sessionData } = await supabase.auth.getSession();
        
        if (sessionData?.session?.user?.id) {
          // Add storage policies using proper newer methods
          // Note: Policies are now typically managed through the Supabase dashboard or SQL
          console.log('Bucket created successfully. Storage policies can be configured in the Supabase dashboard.');
        }
      }
    }
  } catch (err) {
    console.error('Error initializing Supabase services:', err);
  }
};
