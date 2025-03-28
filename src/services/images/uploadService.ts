
import { supabase } from "@/integrations/supabase/client";
import { WebsiteImage } from "./types";

/**
 * Get image dimensions from a File
 */
const getImageDimensions = (file: File): Promise<{width: number, height: number}> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(img.src); // Clean up
      resolve({ width: img.width, height: img.height });
    };
    img.src = URL.createObjectURL(file);
  });
};

/**
 * Upload a new image to storage and create an entry in the website_images table
 */
export const uploadImage = async (
  file: File,
  key: string,
  description: string,
  alt_text: string,
  category?: string
): Promise<WebsiteImage | null> => {
  try {
    // Generate a unique filename
    const filename = `${Date.now()}-${file.name.replace(/\s+/g, '-')}`;
    const storagePath = `${key}/${filename}`;
    
    // Get image dimensions if it's an image file
    let dimensions = { width: null, height: null };
    
    if (file.type.startsWith('image/')) {
      try {
        dimensions = await getImageDimensions(file);
      } catch (err) {
        console.error('Could not get image dimensions:', err);
      }
    }
    
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
        alt_text,
        category: category || null,
        width: dimensions.width,
        height: dimensions.height
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
