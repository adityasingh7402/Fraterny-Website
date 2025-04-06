
import { supabase } from "@/integrations/supabase/client";
import { STORAGE_BUCKET_NAME } from "../constants";

/**
 * Get correct storage path for an image
 */
export const getStoragePath = (key: string): string => {
  // Normalize the key and ensure it doesn't start with a slash
  return key.trim().replace(/^\/+/, '');
};

/**
 * Get public URL for an image stored in Supabase Storage
 */
export const getPublicUrl = async (path: string): Promise<string | null> => {
  try {
    const { data } = await supabase.storage
      .from(STORAGE_BUCKET_NAME)
      .getPublicUrl(path);
      
    return data?.publicUrl || null;
  } catch (error) {
    console.error(`Error getting public URL for path "${path}":`, error);
    return null;
  }
};

/**
 * Ensure consistent database queries for images
 */
export const queryImageByKey = async (key: string) => {
  return supabase
    .from('website_images')
    .select('*')
    .eq('key', key.trim())
    .maybeSingle();
};

/**
 * Check if an image exists in the database
 */
export const imageExists = async (key: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('website_images')
      .select('id')
      .eq('key', key.trim())
      .maybeSingle();
      
    return !error && !!data;
  } catch (error) {
    console.error(`Error checking if image "${key}" exists:`, error);
    return false;
  }
};
