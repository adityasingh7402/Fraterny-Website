
import { supabase } from "@/integrations/supabase/client";
import { isValidImageKey, isValidImageUrl } from "./validation";

// Simple in-memory cache with expiration
const urlCache: Record<string, { url: string, expires: number }> = {};
const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes

// Storage bucket name (fixed to match the actual bucket name in Supabase)
const STORAGE_BUCKET_NAME = 'Website Images'; // Correct name with space and capitalization

/**
 * Simplified function to get image URL directly from database
 * This version doesn't require a storage bucket
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
    
    // Get the image URL from the website_images table
    const { data: imageData, error: lookupError } = await supabase
      .from('website_images')
      .select('id, key, storage_path, description')
      .eq('key', normalizedKey)
      .maybeSingle();
      
    console.log(`[getImageUrl] Database lookup result:`, imageData || 'No record found');
    
    if (lookupError) {
      console.error(`[getImageUrl] Database error for key "${normalizedKey}":`, lookupError);
      return '/placeholder.svg';
    }
    
    if (!imageData) {
      console.warn(`[getImageUrl] No image found with key "${normalizedKey}" in database`);
      return '/placeholder.svg';
    }
    
    // Generate URL from storage bucket using the storage_path if available, or fall back to key
    const storagePath = imageData.storage_path || imageData.key;
    
    // Get the URL from Supabase Storage using the correct bucket name
    // Note: The getPublicUrl method doesn't return an error property in its response
    const { data: urlData } = await supabase.storage
      .from(STORAGE_BUCKET_NAME)
      .getPublicUrl(storagePath);
    
    if (!urlData || !urlData.publicUrl) {
      console.error(`[getImageUrl] Failed to generate URL for key "${normalizedKey}"`);
      return '/placeholder.svg';
    }
    
    const imageUrl = urlData.publicUrl;
    console.log(`[getImageUrl] Generated URL for "${normalizedKey}": ${imageUrl}`);
    
    // Cache the URL
    urlCache[normalizedKey] = {
      url: imageUrl,
      expires: Date.now() + CACHE_DURATION
    };
    
    return imageUrl;
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
