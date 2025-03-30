
import { supabase } from "@/integrations/supabase/client";
import { urlCache } from "./cacheService";
import { WebsiteImage } from "./types";
import { addHashToUrl } from "./utils/hashUtils";

/**
 * Get the image URL by key
 */
export const getImageUrlByKey = async (key: string): Promise<string> => {
  // First check if this URL is in the URL cache
  const cachedUrl = urlCache.get(`url:${key}`);
  if (cachedUrl) {
    return cachedUrl;
  }

  // Fetch the image record to get the storage path
  const { data, error } = await supabase
    .from('website_images')
    .select('storage_path')
    .eq('key', key)
    .maybeSingle();

  if (error || !data) {
    console.error(`Error fetching image with key ${key}:`, error);
    return '/placeholder.svg';
  }

  // Get the public URL for this storage path
  const { data: urlData } = supabase.storage
    .from('website-images')
    .getPublicUrl(data.storage_path);

  // No content hash since metadata column doesn't exist yet
  const finalUrl = urlData.publicUrl;

  // Cache the URL for future use
  urlCache.set(`url:${key}`, finalUrl);

  return finalUrl;
};

/**
 * Get the image URL by key and size
 */
export const getImageUrlByKeyAndSize = async (
  key: string, 
  size: 'small' | 'medium' | 'large'
): Promise<string> => {
  const cacheKey = `url:${key}:${size}`;
  
  // First check if this URL is already cached
  const cachedUrl = urlCache.get(cacheKey);
  if (cachedUrl) {
    return cachedUrl;
  }

  // Fetch the image record to get sizes
  const { data, error } = await supabase
    .from('website_images')
    .select('sizes')
    .eq('key', key)
    .maybeSingle();

  if (error || !data) {
    console.error(`Error fetching image with key ${key}:`, error);
    return '/placeholder.svg';
  }
  
  if (data.sizes && data.sizes[size]) {
    // Get the public URL for this optimized size
    const { data: urlData } = supabase.storage
      .from('website-images')
      .getPublicUrl(data.sizes[size]);

    // No content hash since metadata column doesn't exist yet
    const finalUrl = urlData.publicUrl;

    // Cache the URL for future use
    urlCache.set(cacheKey, finalUrl);
    
    return finalUrl;
  }

  // If the requested size doesn't exist, fall back to the original image
  return getImageUrlByKey(key);
};

/**
 * Get image placeholders by key
 */
export const getImagePlaceholdersByKey = async (
  key: string
): Promise<{ 
  tinyPlaceholder: string | null; 
  colorPlaceholder: string | null;
}> => {
  // Check cache for placeholders
  const cachedTiny = urlCache.get(`placeholder:tiny:${key}`);
  const cachedColor = urlCache.get(`placeholder:color:${key}`);
  
  if (cachedTiny && cachedColor) {
    return { 
      tinyPlaceholder: cachedTiny, 
      colorPlaceholder: cachedColor 
    };
  }

  // For now, return null placeholders until we have the metadata column
  return { tinyPlaceholder: null, colorPlaceholder: null };
};

/**
 * Clear URL cache to force fresh URL generation
 */
export const clearImageUrlCache = (): void => {
  console.log('Clearing image URL cache');
  urlCache.clear();
};

/**
 * Clear URL cache for a specific key
 */
export const clearImageUrlCacheForKey = (key: string): void => {
  console.log(`Clearing URL cache for key: ${key}`);
  urlCache.invalidate(key);
};
