import { supabase } from "@/integrations/supabase/client";
import { WebsiteImage } from "./types";

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
 * Fetch images by category
 */
export const fetchImagesByCategory = async (category: string): Promise<WebsiteImage[]> => {
  const { data, error } = await supabase
    .from('website_images')
    .select('*')
    .eq('category', category)
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching images by category:', error);
    return [];
  }
  
  return data || [];
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

/**
 * Get public URL for a specific size of an image by its key
 * If the requested size doesn't exist, returns the original image URL
 */
export const getImageUrlByKeyAndSize = async (key: string, size: string): Promise<string | null> => {
  const image = await fetchImageByKey(key);
  
  if (!image) {
    return null;
  }
  
  // If the image has the requested size in its sizes object, return that URL
  if (image.sizes && image.sizes[size]) {
    return image.sizes[size];
  }
  
  // Otherwise return the original image URL
  const { data } = supabase.storage
    .from('website-images')
    .getPublicUrl(image.storage_path);
  
  return data.publicUrl;
};
