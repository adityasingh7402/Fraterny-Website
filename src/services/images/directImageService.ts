
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
  // Validate input early to prevent invalid requests
  if (!key || !isValidImageKey(key)) {
    console.warn(`Invalid image key provided: "${key}", returning placeholder`);
    return '/placeholder.svg';
  }
  
  const normalizedKey = key.trim();
  
  // Check cache first
  const cachedItem = urlCache[normalizedKey];
  if (cachedItem && cachedItem.expires > Date.now()) {
    return cachedItem.url;
  }
  
  try {
    // First verify the image exists in our database
    const { data: imageExists, error: lookupError } = await supabase
      .from('website_images')
      .select('id')
      .eq('key', normalizedKey)
      .maybeSingle();
      
    if (lookupError || !imageExists) {
      console.error(`Image key "${normalizedKey}" not found in database:`, 
        lookupError || 'No record found');
      return '/placeholder.svg';
    }
    
    // Get URL directly from storage
    const { data: urlData } = await supabase.storage
      .from('website-images')
      .getPublicUrl(normalizedKey);
    
    if (!urlData || !urlData.publicUrl || !isValidImageUrl(urlData.publicUrl)) {
      console.error(`Failed to get valid URL for key "${normalizedKey}"`);
      return '/placeholder.svg';
    }
    
    // Cache the URL
    urlCache[normalizedKey] = {
      url: urlData.publicUrl,
      expires: Date.now() + CACHE_DURATION
    };
    
    return urlData.publicUrl;
  } catch (error) {
    console.error(`Error getting URL for image "${normalizedKey}":`, error);
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
