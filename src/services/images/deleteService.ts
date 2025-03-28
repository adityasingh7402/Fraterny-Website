
import { supabase } from "@/integrations/supabase/client";

/**
 * Delete an image and its storage file
 */
export const deleteImage = async (id: string): Promise<boolean> => {
  // First get the storage path
  const { data: image, error: fetchError } = await supabase
    .from('website_images')
    .select('storage_path')
    .eq('id', id)
    .single();
  
  if (fetchError || !image) {
    console.error('Error fetching image for deletion:', fetchError);
    return false;
  }
  
  // Delete the file from storage
  const { error: storageError } = await supabase.storage
    .from('website-images')
    .remove([image.storage_path]);
  
  if (storageError) {
    console.error('Error deleting image from storage:', storageError);
    return false;
  }
  
  // Delete the record from the database
  const { error: deleteError } = await supabase
    .from('website_images')
    .delete()
    .eq('id', id);
  
  if (deleteError) {
    console.error('Error deleting image record:', deleteError);
    return false;
  }
  
  return true;
};
