
import { supabase } from "@/integrations/supabase/client";
import { toast } from 'sonner';

/**
 * Ensures the website-images bucket exists in Supabase storage
 * Creates it if it doesn't exist yet
 */
export const ensureImageBucketExists = async (): Promise<boolean> => {
  try {
    // Check if bucket exists
    const { data: buckets, error: bucketsError } = await supabase.storage
      .listBuckets();
      
    if (bucketsError) {
      console.error("Error checking buckets:", bucketsError);
      return false;
    }
    
    // Look for the website-images bucket
    const bucketExists = buckets?.some(bucket => bucket.name === 'website-images');
    
    if (!bucketExists) {
      console.log("Creating website-images bucket");
      // Create bucket if it doesn't exist
      const { error: createError } = await supabase.storage
        .createBucket('website-images', {
          public: true
        });
        
      if (createError) {
        console.error("Error creating bucket:", createError);
        return false;
      }
      
      console.log("Bucket created successfully");
      return true;
    }
    
    return true;
  } catch (error) {
    console.error("Unexpected error in ensureImageBucketExists:", error);
    return false;
  }
};

/**
 * Initialize bucket and storage during app startup
 */
export const initializeImageStorage = async () => {
  try {
    const success = await ensureImageBucketExists();
    if (!success) {
      console.warn("Could not ensure image bucket exists");
    }
  } catch (error) {
    console.error("Error initializing image storage:", error);
  }
};
