
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

  // Fetch the image record to get the storage path and content hash
  const { data, error } = await supabase
    .from('website_images')
    .select('storage_path, metadata')
    .eq('key', key)
    .maybeSingle();

  if (error || !data) {
    console.error(`Error fetching image with key ${key}:`, error);
    return '/placeholder.svg';
  }

  // Get content hash from metadata if available
  const contentHash = data.metadata?.contentHash || '';

  // Get the public URL for this storage path
  const { data: urlData } = supabase.storage
    .from('website-images')
    .getPublicUrl(data.storage_path);

  // Add content hash as a query parameter for cache busting
  const finalUrl = contentHash 
    ? addHashToUrl(urlData.publicUrl, contentHash) 
    : urlData.publicUrl;

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

  // Fetch the image record to get sizes and content hash
  const { data, error } = await supabase
    .from('website_images')
    .select('sizes, metadata')
    .eq('key', key)
    .maybeSingle();

  if (error || !data) {
    console.error(`Error fetching image with key ${key}:`, error);
    return '/placeholder.svg';
  }

  // Get content hash from metadata if available
  const contentHash = data.metadata?.contentHash || '';
  
  if (data.sizes && data.sizes[size]) {
    // Get the public URL for this optimized size
    const { data: urlData } = supabase.storage
      .from('website-images')
      .getPublicUrl(data.sizes[size]);

    // Add content hash as query parameter for cache busting
    const finalUrl = contentHash 
      ? addHashToUrl(urlData.publicUrl, contentHash) 
      : urlData.publicUrl;

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

  // Fetch the image record to get metadata with placeholders
  const { data, error } = await supabase
    .from('website_images')
    .select('metadata')
    .eq('key', key)
    .maybeSingle();

  if (error || !data || !data.metadata) {
    return { tinyPlaceholder: null, colorPlaceholder: null };
  }

  const tinyPlaceholder = data.metadata?.placeholders?.tiny || null;
  const colorPlaceholder = data.metadata?.placeholders?.color || null;

  // Cache placeholders for future use
  if (tinyPlaceholder) {
    urlCache.set(`placeholder:tiny:${key}`, tinyPlaceholder);
  }
  
  if (colorPlaceholder) {
    urlCache.set(`placeholder:color:${key}`, colorPlaceholder);
  }

  return { tinyPlaceholder, colorPlaceholder };
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
