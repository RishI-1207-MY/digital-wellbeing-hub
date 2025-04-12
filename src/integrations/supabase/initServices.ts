
import { supabase } from './client';

export const initSupabaseServices = async () => {
  try {
    // Check if doctor_verifications bucket exists
    const { data: buckets, error } = await supabase.storage.listBuckets();
    
    if (error) {
      console.error('Error checking buckets:', error);
      return;
    }
    
    // Check for both doctor_verifications and patient_documents buckets
    const verificationBucketExists = buckets.some(bucket => bucket.name === 'doctor_verifications');
    const documentsBucketExists = buckets.some(bucket => bucket.name === 'patient_documents');
    
    // Create doctor_verifications bucket if it doesn't exist
    if (!verificationBucketExists) {
      const { error: createError } = await supabase.storage.createBucket('doctor_verifications', {
        public: false,
        fileSizeLimit: 10485760, // 10MB
      });
      
      if (createError) {
        console.error('Error creating doctor_verifications bucket:', createError);
      } else {
        console.log('Created doctor_verifications bucket');
      }
    }
    
    // Create patient_documents bucket if it doesn't exist
    if (!documentsBucketExists) {
      const { error: createError } = await supabase.storage.createBucket('patient_documents', {
        public: false,
        fileSizeLimit: 10485760, // 10MB
      });
      
      if (createError) {
        console.error('Error creating patient_documents bucket:', createError);
      } else {
        console.log('Created patient_documents bucket');
      }
    }
    
    console.log('Supabase storage buckets initialized');
  } catch (err) {
    console.error('Error initializing Supabase services:', err);
  }
};
