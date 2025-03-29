
import { supabase } from "@/integrations/supabase/client";
import { WebsiteImage } from "../types";

/**
 * Remove an existing image and its optimized versions
 */
export const removeExistingImage = async (existingImage: WebsiteImage): Promise<void> => {
  try {
    // Remove the existing file from storage
    if (existingImage.storage_path) {
      await supabase.storage.from('website-images').remove([existingImage.storage_path]);
      
      // Also remove any optimized versions
      if (existingImage.sizes && typeof existingImage.sizes === 'object') {
        const sizes = existingImage.sizes as Record<string, string>;
        await Promise.all(
          Object.values(sizes).map(path => 
            supabase.storage.from('website-images').remove([path])
          )
        );
      }
    }
    
    // Delete the existing record
    await supabase.from('website_images').delete().eq('id', existingImage.id);
  } catch (error) {
    console.error('Error removing existing image:', error);
    // Continue with the upload process even if cleanup fails
  }
};

/**
 * Clean up uploaded files if record creation fails
 */
export const cleanupUploadedFiles = async (
  storagePath: string,
  optimizedSizes: Record<string, string>
): Promise<void> => {
  try {
    // Clean up the uploaded file if we couldn't create the record
    await supabase.storage.from('website-images').remove([storagePath]);
    
    // Also clean up any optimized versions
    await Promise.all(
      Object.values(optimizedSizes).map(path => 
        supabase.storage.from('website-images').remove([path])
      )
    );
  } catch (error) {
    console.error('Error cleaning up uploaded files:', error);
  }
};
