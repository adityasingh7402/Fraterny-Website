
import { supabase } from "@/integrations/supabase/client";
import { urlCache } from "../../cacheService";
import { getGlobalCacheVersion } from "../cacheVersionService";
import { trackApiCall } from "@/utils/apiMonitoring";
import { getContentHashFromMetadata, createVersionedUrl } from "./utils";

/**
 * Get a URL for an image by key in a batched query pattern
 */
export const getImageUrlBatched = async (key: string): Promise<string> => {
  if (!key || typeof key !== 'string' || key.trim() === '') {
    console.error(`Invalid key in getImageUrlBatched: "${key}"`);
    return '/placeholder.svg';
  }
  
  const normalizedKey = key.trim();
  const cacheKey = `url:${normalizedKey}`;
  
  // Try to get from cache first
  const cachedUrl = urlCache.get(cacheKey);
  if (cachedUrl) {
    console.log(`[getImageUrlBatched] Using cached URL for key "${normalizedKey}": ${cachedUrl}`);
    return cachedUrl;
  }
  
  // Track API call
  trackApiCall('getImageUrlBatched');
  console.log(`[getImageUrlBatched] Fetching URL for key: "${normalizedKey}"`);
  
  try {
    // Get global cache version
    const cacheVersion = await getGlobalCacheVersion();
    
    // Get image record from database to find key
    const { data: image, error } = await supabase
      .from('website_images')
      .select('key, metadata')
      .eq('key', normalizedKey)
      .maybeSingle();
    
    if (error) {
      console.error(`[getImageUrlBatched] Database error for key "${normalizedKey}":`, error);
      return '/placeholder.svg';
    }
    
    if (!image) {
      console.warn(`[getImageUrlBatched] No image found with key "${normalizedKey}"`);
      return '/placeholder.svg';
    }
    
    // IMPORTANT: Use the key directly for storage
    const imageKey = image.key;
    
    if (!imageKey) {
      console.error(`[getImageUrlBatched] Image found but has no key for "${normalizedKey}"`);
      return '/placeholder.svg';
    }
    
    // Get content hash for cache busting
    const contentHash = getContentHashFromMetadata(image.metadata);
    
    // Create public URL using the key directly
    const { data } = await supabase.storage
      .from('website-images')
      .getPublicUrl(imageKey);
    
    if (!data || !data.publicUrl) {
      console.error(`[getImageUrlBatched] Failed to get public URL for key "${imageKey}"`);
      return '/placeholder.svg';
    }
    
    // Add versioning to URL for cache busting
    const finalUrl = createVersionedUrl(data.publicUrl, contentHash, cacheVersion);
    console.log(`[getImageUrlBatched] Generated URL for key "${normalizedKey}": ${finalUrl}`);
    
    // Cache the URL
    urlCache.set(cacheKey, finalUrl);
    
    return finalUrl;
  } catch (error) {
    console.error(`[getImageUrlBatched] Error getting URL for key "${normalizedKey}":`, error);
    return '/placeholder.svg';
  }
};

/**
 * Batch implementation for getting multiple image URLs at once
 */
export const batchGetImageUrls = async (keys: string[]): Promise<Record<string, string>> => {
  if (!keys || keys.length === 0) return {};
  
  // Track as a single API call
  trackApiCall('batchGetImageUrls');
  
  try {
    // Get global cache version for proper versioning
    const cacheVersion = await getGlobalCacheVersion();
    
    // Normalize keys
    const normalizedKeys = keys.map(k => k?.trim() || '').filter(k => k !== '');
    
    if (normalizedKeys.length === 0) {
      console.warn('[batchGetImageUrls] All keys were invalid or empty');
      return {};
    }
    
    // Check cache first for all keys
    const result: Record<string, string> = {};
    const keysToFetch: string[] = [];
    
    for (const key of normalizedKeys) {
      const cacheKey = `url:${key}`;
      const cachedUrl = urlCache.get(cacheKey);
      
      if (cachedUrl) {
        result[key] = cachedUrl;
      } else {
        keysToFetch.push(key);
      }
    }
    
    // If all keys were in cache, return early
    if (keysToFetch.length === 0) {
      return result;
    }
    
    console.log(`[batchGetImageUrls] Fetching ${keysToFetch.length} uncached keys: ${keysToFetch.join(', ')}`);
    
    // Fetch all missing keys in a single query
    const { data: images, error } = await supabase
      .from('website_images')
      .select('key, metadata')
      .in('key', keysToFetch);
    
    if (error) {
      console.error('[batchGetImageUrls] Error batch loading images:', error);
      // Fill missing keys with placeholders
      for (const key of keysToFetch) {
        result[key] = '/placeholder.svg';
      }
      return result;
    }
    
    // Create a map for easy lookup
    const imageMap = new Map(images?.map(img => [img.key, img]) || []);
    
    // Process each key to get URLs
    for (const key of keysToFetch) {
      const image = imageMap.get(key);
      
      if (!image) {
        console.warn(`[batchGetImageUrls] No image found for key "${key}" in batch operation`);
        result[key] = '/placeholder.svg';
        continue;
      }
      
      try {
        // IMPORTANT: Use the key directly for storage
        const imageKey = image.key;
        
        if (!imageKey) {
          console.error(`[batchGetImageUrls] Image found but has no key for "${key}"`);
          result[key] = '/placeholder.svg';
          continue;
        }
        
        // Get content hash for cache busting
        const contentHash = getContentHashFromMetadata(image.metadata);
        
        // Get public URL using the key directly
        const { data } = await supabase.storage
          .from('website-images')
          .getPublicUrl(imageKey);
        
        if (!data || !data.publicUrl) {
          console.error(`[batchGetImageUrls] Failed to get public URL for image key "${imageKey}"`);
          result[key] = '/placeholder.svg';
          continue;
        }
        
        // Add versioning to URL for cache busting
        const finalUrl = createVersionedUrl(data.publicUrl, contentHash, cacheVersion);
        
        // Set result and cache
        result[key] = finalUrl;
        urlCache.set(`url:${key}`, finalUrl);
      } catch (innerError) {
        console.error(`[batchGetImageUrls] Error processing key "${key}" in batch:`, innerError);
        result[key] = '/placeholder.svg';
      }
    }
    
    return result;
  } catch (error) {
    console.error('[batchGetImageUrls] Unexpected error in batchGetImageUrls:', error);
    return keys.reduce((acc, key) => {
      acc[key] = '/placeholder.svg';
      return acc;
    }, {} as Record<string, string>);
  }
};
