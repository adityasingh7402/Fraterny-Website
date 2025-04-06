
import { supabase } from "@/integrations/supabase/client";
import { isValidImageKey, isValidImageUrl } from "./validation";

// Simple in-memory cache with expiration
const urlCache: Record<string, { url: string, expires: number }> = {};
const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes

/**
 * Simplified function to get image URL directly from Supabase storage
 * Single responsibility: Convert an image key to a URL
 */
export const getImageUrl = async (key: string | undefined): Promise<string> => {
  console.log(`[getImageUrl] Called with key: "${key}"`);
  
  // Validate input early to prevent invalid requests
  if (!key || !isValidImageKey(key)) {
    console.warn(`[getImageUrl] Invalid image key provided: "${key}", returning placeholder`);
    return '/placeholder.svg';
  }
  
  const normalizedKey = key.trim();
  
  // Check cache first
  const cachedItem = urlCache[normalizedKey];
  if (cachedItem && cachedItem.expires > Date.now()) {
    console.log(`[getImageUrl] Using cached URL for key "${normalizedKey}": ${cachedItem.url}`);
    return cachedItem.url;
  }
  
  try {
    console.log(`[getImageUrl] Looking up database record for key: "${normalizedKey}"`);
    
    // First verify the image exists in our database
    const { data: imageExists, error: lookupError } = await supabase
      .from('website_images')
      .select('id, key, storage_path')
      .eq('key', normalizedKey)
      .maybeSingle();
      
    console.log(`[getImageUrl] Database lookup result:`, imageExists || 'No record found');
    
    if (lookupError) {
      console.error(`[getImageUrl] Database error for key "${normalizedKey}":`, lookupError);
      return '/placeholder.svg';
    }
    
    if (!imageExists) {
      console.warn(`[getImageUrl] No image found with key "${normalizedKey}" in database`);
      return '/placeholder.svg';
    }
    
    // IMPORTANT: Verify key exists and is not undefined before proceeding
    const imageKey = imageExists.storage_path || imageExists.key;
    if (!imageKey) {
      console.error(`[getImageUrl] Image found but has no storage_path or key for "${normalizedKey}"`);
      return '/placeholder.svg';
    }
    
    console.log(`[getImageUrl] Getting public URL for storage path: "${imageKey}"`);
    
    // Get URL directly from storage
    const { data: urlData } = await supabase.storage
      .from('website-images')
      .getPublicUrl(imageKey);
    
    // Fixed: TypeScript error - checking urlData properly
    if (!urlData || !urlData.publicUrl || !isValidImageUrl(urlData.publicUrl)) {
      console.error(`[getImageUrl] Failed to get valid URL for key "${normalizedKey}"`);
      return '/placeholder.svg';
    }
    
    console.log(`[getImageUrl] Successfully got public URL for "${normalizedKey}": ${urlData.publicUrl}`);
    
    // Cache the URL
    urlCache[normalizedKey] = {
      url: urlData.publicUrl,
      expires: Date.now() + CACHE_DURATION
    };
    
    return urlData.publicUrl;
  } catch (error) {
    console.error(`[getImageUrl] Error getting URL for image "${normalizedKey}":`, error);
    return '/placeholder.svg';
  }
};

/**
 * Get multiple image URLs in one batch
 */
export const getMultipleImageUrls = async (keys: string[] | undefined): Promise<Record<string, string>> => {
  if (!keys || !Array.isArray(keys) || keys.length === 0) {
    return {};
  }
  
  // Filter and normalize keys early in the process
  const validKeys = keys
    .filter(Boolean)
    .filter(key => isValidImageKey(key))
    .map(key => key.trim());
  
  if (validKeys.length === 0) {
    return {};
  }
  
  // Process in parallel for efficiency
  const results = await Promise.all(
    validKeys.map(async (key) => {
      const url = await getImageUrl(key);
      return { key, url };
    })
  );
  
  // Convert to record format
  return results.reduce((acc, { key, url }) => {
    acc[key] = url;
    return acc;
  }, {} as Record<string, string>);
};

/**
 * Clear the URL cache
 */
export const clearImageUrlCache = (): void => {
  Object.keys(urlCache).forEach(key => {
    delete urlCache[key];
  });
};
