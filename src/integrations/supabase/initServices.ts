
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
        
        // Add a policy to allow authenticated users to upload
        const { error: policyError } = await supabase.storage.from('doctor_verifications').createPolicy('authenticated-uploads', {
          name: 'authenticated-uploads',
          definition: {
            // Only allow users to upload files with their user ID as prefix
            operations: ['INSERT', 'UPDATE'],
            path_filter: `${supabase.auth.session()?.user?.id}*`
          },
          type: 'STORAGE'
        });
        
        if (policyError) {
          console.error('Error creating storage policy:', policyError);
        }
      }
    }
  } catch (err) {
    console.error('Error initializing Supabase services:', err);
  }
};
