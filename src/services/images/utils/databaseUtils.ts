
import { supabase } from "@/integrations/supabase/client";
import { STORAGE_BUCKET_NAME } from "../constants";

/**
 * Create a new image record in the database
 */
export const createImageRecord = async (
  key: string,
  description: string,
  storagePath: string,
  altText: string,
  category: string | undefined,
  dimensions: { width: number | null, height: number | null },
  optimizedSizes: Record<string, string>
) => {
  return await supabase
    .from('website_images')
    .insert({
      key,
      description,
      storage_path: storagePath,
      alt_text: altText,
      category: category || null,
      width: dimensions.width,
      height: dimensions.height,
      sizes: optimizedSizes
    })
    .select()
    .single();
};

/**
 * Get the public URL for an image stored in the bucket
 */
export const getPublicImageUrl = async (storagePath: string): Promise<string | null> => {
  try {
    const { data } = await supabase.storage
      .from(STORAGE_BUCKET_NAME)
      .getPublicUrl(storagePath);
      
    return data?.publicUrl || null;
  } catch (error) {
    console.error(`Error getting public URL for path ${storagePath}:`, error);
    return null;
  }
};

/**
 * Check if a file exists in the storage bucket
 */
export const checkFileExists = async (storagePath: string): Promise<boolean> => {
  try {
    // We can use download with head:true to check if a file exists without downloading it
    const { data } = await supabase.storage
      .from(STORAGE_BUCKET_NAME)
      .download(storagePath, { transform: { width: 1, height: 1 } });
      
    return !!data;
  } catch (error) {
    console.error(`Error checking if file exists at path ${storagePath}:`, error);
    return false;
  }
};
