
import { supabase } from "@/integrations/supabase/client";
import { STORAGE_BUCKET_NAME } from "../constants";

/**
 * Utility to find and fix inconsistent storage paths in the database
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
      .select('id, key, storage_path');
      
    if (error) {
      console.error('Error fetching images to check bucket names:', error);
      throw error;
    }
    
    if (!images || images.length === 0) {
      console.log('No images found to check');
      return { scanned: 0, fixed: 0, errors: 0 };
    }
    
    scanned = images.length;
    console.log(`Checking ${scanned} images for bucket name consistency...`);
    
    // Process each image
    for (const image of images) {
      try {
        if (!image.storage_path) {
          // If no storage path, use the key
          const { error: updateError } = await supabase
            .from('website_images')
            .update({ storage_path: image.key })
            .eq('id', image.id);
            
          if (updateError) {
            console.error(`Error updating missing storage path for image ${image.id}:`, updateError);
            errors++;
          } else {
            fixed++;
          }
          continue;
        }
        
        // Check for inconsistent bucket name format
        if (image.storage_path.includes('website-images/')) {
          // Fix the path to use correct bucket name
          const correctedPath = image.storage_path.replace('website-images/', '');
          
          const { error: updateError } = await supabase
            .from('website_images')
            .update({ storage_path: correctedPath })
            .eq('id', image.id);
            
          if (updateError) {
            console.error(`Error fixing storage path for image ${image.id}:`, updateError);
            errors++;
          } else {
            fixed++;
            console.log(`Fixed storage path for image ${image.key} from ${image.storage_path} to ${correctedPath}`);
          }
        }
      } catch (itemError) {
        console.error(`Error processing image ${image.id}:`, itemError);
        errors++;
      }
    }
    
    // Also check for size variants with inconsistent names
    const { data: imagesWithSizes, error: sizesError } = await supabase
      .from('website_images')
      .select('id, key, sizes')
      .not('sizes', 'is', null);
      
    if (sizesError) {
      console.error('Error fetching images with sizes:', sizesError);
      return { scanned, fixed, errors: errors + 1 };
    }
    
    if (imagesWithSizes && imagesWithSizes.length > 0) {
      console.log(`Checking size variants for ${imagesWithSizes.length} images...`);
      
      for (const image of imagesWithSizes) {
        try {
          let sizesFix = false;
          const sizes = image.sizes as Record<string, string>;
          
          if (sizes && typeof sizes === 'object') {
            const updatedSizes = { ...sizes };
            
            // Fix each size variant
            for (const [size, path] of Object.entries(sizes)) {
              if (typeof path === 'string' && path.includes('website-images/')) {
                // Fix the path
                updatedSizes[size] = path.replace('website-images/', '');
                sizesFix = true;
              }
            }
            
            if (sizesFix) {
              // Update the sizes in the database
              const { error: updateError } = await supabase
                .from('website_images')
                .update({ sizes: updatedSizes })
                .eq('id', image.id);
                
              if (updateError) {
                console.error(`Error updating size paths for image ${image.id}:`, updateError);
                errors++;
              } else {
                fixed++;
              }
            }
          }
        } catch (sizeError) {
          console.error(`Error processing size variants for image ${image.id}:`, sizeError);
          errors++;
        }
      }
    }
    
    console.log(`Bucket name consistency check completed: ${scanned} scanned, ${fixed} fixed, ${errors} errors`);
    return { scanned, fixed, errors };
  } catch (error) {
    console.error('Error in fixInconsistentBucketNames:', error);
    return { scanned, fixed, errors: errors + 1 };
  }
};

/**
 * Validate storage paths with correct bucket name
 */
export const validateStoragePath = (path: string | null | undefined): string | null => {
  if (!path) return null;
  
  // Ensure path doesn't contain incorrect bucket name format
  if (path.includes('website-images/')) {
    return path.replace('website-images/', '');
  }
  
  return path;
};

/**
 * Get the correct storage path formatting for an image
 */
export const getCorrectStoragePath = async (imageKey: string): Promise<string | null> => {
  try {
    const { data, error } = await supabase
      .from('website_images')
      .select('storage_path')
      .eq('key', imageKey)
      .maybeSingle();
      
    if (error || !data) {
      console.error(`Error getting storage path for "${imageKey}":`, error || 'Not found');
      return null;
    }
    
    return validateStoragePath(data.storage_path) || imageKey;
  } catch (error) {
    console.error(`Error in getCorrectStoragePath for "${imageKey}":`, error);
    return null;
  }
};

/**
 * Fix inconsistent storage path in a single image record
 */
export const fixSingleImagePath = async (imageId: string): Promise<boolean> => {
  try {
    // Get the image record
    const { data: image, error } = await supabase
      .from('website_images')
      .select('id, key, storage_path, sizes')
      .eq('id', imageId)
      .single();
      
    if (error || !image) {
      console.error(`Error getting image ${imageId}:`, error || 'Not found');
      return false;
    }
    
    const updates: any = {};
    let needsUpdate = false;
    
    // Fix main storage path
    if (image.storage_path && image.storage_path.includes('website-images/')) {
      updates.storage_path = image.storage_path.replace('website-images/', '');
      needsUpdate = true;
    } else if (!image.storage_path) {
      updates.storage_path = image.key;
      needsUpdate = true;
    }
    
    // Fix size variants
    if (image.sizes && typeof image.sizes === 'object') {
      const updatedSizes = { ...image.sizes };
      let sizesFix = false;
      
      for (const [size, path] of Object.entries(image.sizes)) {
        if (typeof path === 'string' && path.includes('website-images/')) {
          updatedSizes[size] = path.replace('website-images/', '');
          sizesFix = true;
        }
      }
      
      if (sizesFix) {
        updates.sizes = updatedSizes;
        needsUpdate = true;
      }
    }
    
    if (needsUpdate) {
      // Update the record
      const { error: updateError } = await supabase
        .from('website_images')
        .update(updates)
        .eq('id', imageId);
        
      if (updateError) {
        console.error(`Error updating image ${imageId}:`, updateError);
        return false;
      }
      
      return true;
    }
    
    return false; // No update needed
  } catch (error) {
    console.error(`Unexpected error in fixSingleImagePath for ${imageId}:`, error);
    return false;
  }
};
