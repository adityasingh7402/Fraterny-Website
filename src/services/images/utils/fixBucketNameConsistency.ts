
/**
 * Utility to find and fix bucket name inconsistencies
 */
import { supabase } from "@/integrations/supabase/client";
import { STORAGE_BUCKET_NAME } from "../constants";

/**
 * Normalize a storage path to use the correct bucket name
 */
export const normalizeBucketPath = (path: string): string => {
  // If path is empty or null, return empty string
  if (!path) return '';
  
  // List of incorrect bucket names that might be in the database
  const incorrectNames = [
    'website-images',
    'Website-Images',
    'website_images',
    'Website_Images'
  ];
  
  let normalized = path;
  
  // Replace any incorrect bucket names with the correct one
  incorrectNames.forEach(incorrect => {
    // Check different patterns (with and without trailing slash)
    const patterns = [
      `${incorrect}/`, 
      `${incorrect}\\`
    ];
    
    patterns.forEach(pattern => {
      if (normalized.startsWith(pattern)) {
        normalized = normalized.replace(pattern, `${STORAGE_BUCKET_NAME}/`);
      }
    });
  });
  
  // If the path doesn't start with the correct bucket name, add it
  if (!normalized.startsWith(`${STORAGE_BUCKET_NAME}/`)) {
    // Remove any leading slashes first
    while (normalized.startsWith('/') || normalized.startsWith('\\')) {
      normalized = normalized.substring(1);
    }
    normalized = `${STORAGE_BUCKET_NAME}/${normalized}`;
  }
  
  return normalized;
};

/**
 * Scan the database for storage paths with incorrect bucket names and fix them
 */
export const fixInconsistentBucketNames = async (): Promise<{
  scanned: number;
  fixed: number;
  errors: number;
}> => {
  let scanned = 0;
  let fixed = 0;
  let errors = 0;
  
  try {
    // Get all image records
    const { data: images, error } = await supabase
      .from('website_images')
      .select('id, storage_path, sizes');
      
    if (error) {
      console.error('Error fetching images for bucket name consistency check:', error);
      return { scanned: 0, fixed: 0, errors: 1 };
    }
    
    scanned = images?.length || 0;
    
    // Process each image
    for (const image of images || []) {
      try {
        let needsUpdate = false;
        const updates: Record<string, any> = {};
        
        // Check main storage path
        if (image.storage_path) {
          const normalizedPath = normalizeBucketPath(image.storage_path);
          if (normalizedPath !== image.storage_path) {
            updates.storage_path = normalizedPath;
            needsUpdate = true;
          }
        }
        
        // Check sizes object for paths
        if (image.sizes && typeof image.sizes === 'object') {
          const normalizedSizes: Record<string, string> = {};
          let sizesChanged = false;
          
          // Check each size path
          Object.entries(image.sizes).forEach(([size, path]) => {
            if (typeof path === 'string') {
              const normalizedPath = normalizeBucketPath(path);
              normalizedSizes[size] = normalizedPath;
              if (normalizedPath !== path) {
                sizesChanged = true;
              }
            } else {
              normalizedSizes[size] = path as string;
            }
          });
          
          if (sizesChanged) {
            updates.sizes = normalizedSizes;
            needsUpdate = true;
          }
        }
        
        // If any updates needed, update the record
        if (needsUpdate) {
          const { error: updateError } = await supabase
            .from('website_images')
            .update(updates)
            .eq('id', image.id);
            
          if (updateError) {
            console.error(`Error updating image ${image.id}:`, updateError);
            errors++;
          } else {
            fixed++;
          }
        }
      } catch (e) {
        console.error(`Error processing image ${image.id}:`, e);
        errors++;
      }
    }
    
    console.log(`Bucket name consistency check complete: ${scanned} scanned, ${fixed} fixed, ${errors} errors`);
    return { scanned, fixed, errors };
  } catch (e) {
    console.error('Unexpected error in fixInconsistentBucketNames:', e);
    return { scanned, fixed, errors: errors + 1 };
  }
};
