
import { supabase } from "@/integrations/supabase/client";
import { removeExistingImage } from './utils/cleanupUtils';
import { WebsiteImage } from './types';

/**
 * Delete an image and its storage files (including optimized versions)
 */
export const deleteImage = async (id: string): Promise<boolean> => {
  try {
    // First get the complete image record
    const { data: image, error: fetchError } = await supabase
      .from('website_images')
      .select('*')
      .eq('id', id)
      .single();
    
    if (fetchError || !image) {
      console.error('Error fetching image for deletion:', fetchError);
      return false;
    }
    
    // Use the comprehensive cleanup utility to remove all files and database record
    await removeExistingImage(image as WebsiteImage);
    
    console.log(`✅ Successfully deleted image: ${image.key}`);
    return true;
    
  } catch (error) {
    console.error('Error deleting image:', error);
    return false;
  }
};
