
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
      
      // Check if this is a permissions error
      if (bucketsError.message.includes('policy') || bucketsError.message.includes('permission')) {
        console.log("Permission error when checking buckets. Assuming bucket exists.");
        // We'll assume the bucket exists but we lack permission to create/list buckets
        return true;
      }
      
      return false;
    }
    
    // Normalize bucket names to avoid case/spacing issues
    const normalizedBucketNames = buckets?.map(bucket => bucket.name.toLowerCase().replace(/\s+/g, '-')) || [];
    
    // Look for the website-images bucket (normalized)
    const bucketExists = normalizedBucketNames.includes('website-images');
    
    if (!bucketExists) {
      console.log("Bucket 'website-images' not found, attempting to create it");
      
      // Create bucket if it doesn't exist
      const { error: createError } = await supabase.storage
        .createBucket('website-images', {
          public: true
        });
        
      if (createError) {
        console.error("Error creating bucket:", createError);
        
        // If we get a permission error, the bucket might exist but be named differently
        // or we don't have permission to create buckets
        if (createError.message.includes('policy') || createError.message.includes('permission')) {
          console.log("Permission error when creating bucket. Will attempt to use existing bucket.");
          return true;
        }
        
        return false;
      }
      
      console.log("Bucket created successfully");
      return true;
    }
    
    console.log("Bucket 'website-images' already exists");
    return true;
  } catch (error) {
    console.error("Unexpected error in ensureImageBucketExists:", error);
    return false;
  }
};

/**
 * Initialize bucket and storage during app startup
 * This should only be called after authentication is established
 */
export const initializeImageStorage = async () => {
  try {
    const success = await ensureImageBucketExists();
    if (!success) {
      console.warn("Could not ensure image bucket exists. Some image functionality may be limited.");
    }
  } catch (error) {
    console.error("Error initializing image storage:", error);
  }
};
