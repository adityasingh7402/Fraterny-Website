
import { supabase } from '@/integrations/supabase/client';
import { WebsiteImage } from './types';

/**
 * Get the URL of an image by its key
 * @param key Unique key to identify the image
 * @returns URL of the image
 */
export const getImageUrlByKey = async (key: string): Promise<string> => {
  // Fetch the image record from the database
  const { data, error } = await supabase
    .from('website_images')
    .select('*')
    .eq('key', key)
    .single();
  
  if (error || !data) {
    console.error('Error fetching image:', error);
    throw new Error(`Image with key "${key}" not found`);
  }
  
  const imageRecord = data as WebsiteImage;
  
  // Get the public URL from storage
  const { data: urlData } = supabase.storage
    .from('website-images')
    .getPublicUrl(imageRecord.storage_path);
  
  return urlData.publicUrl;
};

/**
 * Get the URL of an image by its key and size
 * @param key Unique key to identify the image
 * @param size Size of the image (small, medium, large)
 * @returns URL of the sized image or original if the size doesn't exist
 */
export const getImageUrlByKeyAndSize = async (
  key: string, 
  size: 'small' | 'medium' | 'large'
): Promise<string> => {
  // Fetch the image record from the database
  const { data, error } = await supabase
    .from('website_images')
    .select('*')
    .eq('key', key)
    .single();
  
  if (error || !data) {
    console.error('Error fetching image:', error);
    throw new Error(`Image with key "${key}" not found`);
  }
  
  const imageRecord = data as WebsiteImage;
  
  // Check if the requested size exists
  if (imageRecord.sizes && typeof imageRecord.sizes === 'object') {
    const sizes = imageRecord.sizes as Record<string, string>;
    
    if (sizes[size]) {
      // Get the public URL for the sized version
      const { data: urlData } = supabase.storage
        .from('website-images')
        .getPublicUrl(sizes[size]);
      
      return urlData.publicUrl;
    }
  }
  
  // Fallback to original image if size doesn't exist
  const { data: urlData } = supabase.storage
    .from('website-images')
    .getPublicUrl(imageRecord.storage_path);
  
  return urlData.publicUrl;
};
