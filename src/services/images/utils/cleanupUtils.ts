
import { supabase } from "@/integrations/supabase/client";
import { WebsiteImage } from "../types";

// The actual bucket name in Supabase
const STORAGE_BUCKET_NAME = 'Website Images';

/**
 * Remove an existing image from both storage and database
 */
export const removeExistingImage = async (image: WebsiteImage): Promise<void> => {
  try {
    if (image.storage_path) {
      // Remove the original file
      await supabase.storage
        .from(STORAGE_BUCKET_NAME)
        .remove([image.storage_path]);
        
      // Remove any optimized versions if they exist
      if (image.sizes && typeof image.sizes === 'object') {
        const optimizedPaths = Object.values(image.sizes).filter(Boolean);
        if (optimizedPaths.length > 0) {
          await supabase.storage
            .from(STORAGE_BUCKET_NAME)
            .remove(optimizedPaths as string[]);
        }
      }
    }
    
    // Remove the database record
    await supabase
      .from('website_images')
      .delete()
      .eq('id', image.id);
      
  } catch (error) {
    console.error(`Error removing existing image with ID ${image.id}:`, error);
    // Continue with process even if cleanup fails
  }
};

/**
 * Clean up uploaded files if database insertion fails
 */
export const cleanupUploadedFiles = async (
  originalPath: string,
  optimizedSizes: Record<string, string>
): Promise<void> => {
  try {
    const filesToRemove = [originalPath];
    
    // Add optimized versions to the removal list
    Object.values(optimizedSizes).forEach(path => {
      if (path) filesToRemove.push(path);
    });
    
    // Remove all files in one batch operation
    await supabase.storage
      .from(STORAGE_BUCKET_NAME)
      .remove(filesToRemove);
      
    console.log(`Cleaned up ${filesToRemove.length} files after failed upload`);
  } catch (error) {
    console.error('Error cleaning up uploaded files:', error);
    // Silently fail as this is just cleanup
  }
};
