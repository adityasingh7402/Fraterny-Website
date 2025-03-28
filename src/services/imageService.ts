
import { supabase } from "@/integrations/supabase/client";

export interface WebsiteImage {
  id: string;
  key: string;
  description: string;
  storage_path: string;
  alt_text: string;
  created_at: string;
  updated_at: string;
}

/**
 * Fetch image metadata by key
 */
export const fetchImageByKey = async (key: string): Promise<WebsiteImage | null> => {
  const { data, error } = await supabase
    .from('website_images')
    .select('*')
    .eq('key', key)
    .maybeSingle();
  
  if (error) {
    console.error('Error fetching image:', error);
    return null;
  }
  
  return data;
};

/**
 * Fetch all website images
 */
export const fetchAllImages = async (): Promise<WebsiteImage[]> => {
  const { data, error } = await supabase
    .from('website_images')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching images:', error);
    return [];
  }
  
  return data || [];
};

/**
 * Upload a new image to storage and create an entry in the website_images table
 */
export const uploadImage = async (
  file: File,
  key: string,
  description: string,
  alt_text: string
): Promise<WebsiteImage | null> => {
  try {
    // Generate a unique filename
    const filename = `${Date.now()}-${file.name.replace(/\s+/g, '-')}`;
    const storagePath = `${key}/${filename}`;
    
    // Upload the file to storage
    const { error: uploadError } = await supabase.storage
      .from('website-images')
      .upload(storagePath, file);
    
    if (uploadError) {
      console.error('Error uploading image:', uploadError);
      return null;
    }
    
    // Get the public URL for the uploaded file
    const { data: { publicUrl } } = supabase.storage
      .from('website-images')
      .getPublicUrl(storagePath);
    
    // Create an entry in the website_images table
    const { data, error: insertError } = await supabase
      .from('website_images')
      .insert({
        key,
        description,
        storage_path: storagePath,
        alt_text
      })
      .select()
      .single();
    
    if (insertError) {
      console.error('Error creating image record:', insertError);
      // Clean up the uploaded file if we couldn't create the record
      await supabase.storage.from('website-images').remove([storagePath]);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Error in image upload process:', error);
    return null;
  }
};

/**
 * Update an existing image entry
 */
export const updateImage = async (
  id: string,
  data: Partial<WebsiteImage>
): Promise<WebsiteImage | null> => {
  const { data: updatedImage, error } = await supabase
    .from('website_images')
    .update({
      ...data,
      updated_at: new Date().toISOString()
    })
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error('Error updating image:', error);
    return null;
  }
  
  return updatedImage;
};

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

/**
 * Get public URL for an image by its key
 */
export const getImageUrlByKey = async (key: string): Promise<string | null> => {
  const image = await fetchImageByKey(key);
  
  if (!image) {
    return null;
  }
  
  const { data } = supabase.storage
    .from('website-images')
    .getPublicUrl(image.storage_path);
  
  return data.publicUrl;
};
