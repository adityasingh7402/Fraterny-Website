
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
    console.log(`[getImageUrlByKey] Using cached URL for ${key}`);
    return cachedUrl;
  }

  try {
    console.log(`[getImageUrlByKey] Fetching image with key ${key}...`);

    // Fetch the image record to get the storage path
    const { data, error } = await supabase
      .from('website_images')
      .select('storage_path')
      .eq('key', key)
      .maybeSingle();

    if (error) {
      console.error(`[getImageUrlByKey] Error fetching image with key ${key}:`, error);
      return '/placeholder.svg';
    }

    if (!data || !data.storage_path) {
      console.warn(`[getImageUrlByKey] No image or storage path found for key ${key}`);
      return '/placeholder.svg';
    }

    // Get the public URL for this storage path
    const { data: urlData } = supabase.storage
      .from('website-images')
      .getPublicUrl(data.storage_path);

    if (!urlData || !urlData.publicUrl) {
      console.warn(`[getImageUrlByKey] Failed to get public URL for storage path: ${data.storage_path}`);
      return '/placeholder.svg';
    }

    // No content hash since metadata column doesn't exist yet
    const finalUrl = urlData.publicUrl;
    console.log(`[getImageUrlByKey] Retrieved URL for ${key}: ${finalUrl}`);

    // Cache the URL for future use
    urlCache.set(`url:${key}`, finalUrl);

    return finalUrl;
  } catch (e) {
    console.error(`[getImageUrlByKey] Unexpected error for key ${key}:`, e);
    return '/placeholder.svg';
  }
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
    console.log(`[getImageUrlByKeyAndSize] Using cached URL for ${key} (size: ${size})`);
    return cachedUrl;
  }

  try {
    console.log(`[getImageUrlByKeyAndSize] Fetching image with key ${key}, size ${size}...`);

    // Fetch the image record to get sizes
    const { data, error } = await supabase
      .from('website_images')
      .select('sizes, storage_path')
      .eq('key', key)
      .maybeSingle();

    if (error) {
      console.error(`[getImageUrlByKeyAndSize] Error fetching image with key ${key}:`, error);
      return '/placeholder.svg';
    }

    if (!data) {
      console.warn(`[getImageUrlByKeyAndSize] No image found for key ${key}`);
      return '/placeholder.svg';
    }
    
    // Check if sizes exists and if the requested size is available
    if (data.sizes && data.sizes[size]) {
      // Get the public URL for this optimized size
      const { data: urlData } = supabase.storage
        .from('website-images')
        .getPublicUrl(data.sizes[size]);

      if (!urlData || !urlData.publicUrl) {
        console.warn(`[getImageUrlByKeyAndSize] Failed to get public URL for size path: ${data.sizes[size]}`);
        return '/placeholder.svg';
      }

      // No content hash since metadata column doesn't exist yet
      const finalUrl = urlData.publicUrl;
      console.log(`[getImageUrlByKeyAndSize] Retrieved sized URL for ${key} (${size}): ${finalUrl}`);

      // Cache the URL for future use
      urlCache.set(cacheKey, finalUrl);
      
      return finalUrl;
    }

    // If the requested size doesn't exist, fall back to the original image
    console.log(`[getImageUrlByKeyAndSize] Size ${size} not found for ${key}, falling back to original`);
    return getImageUrlByKey(key);
  } catch (e) {
    console.error(`[getImageUrlByKeyAndSize] Unexpected error for key ${key}, size ${size}:`, e);
    return '/placeholder.svg';
  }
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
  
  // Clear all related cache entries
  urlCache.delete(`url:${key}`);
  urlCache.delete(`placeholder:tiny:${key}`);
  urlCache.delete(`placeholder:color:${key}`);
  
  // Clear size variants
  ['small', 'medium', 'large'].forEach(size => {
    urlCache.delete(`url:${key}:${size}`);
  });
  
  console.log(`Cache entries for key ${key} cleared`);
};
