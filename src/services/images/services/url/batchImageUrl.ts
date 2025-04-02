
import { supabase } from "@/integrations/supabase/client";
import { urlCache } from "../../cacheService";
import { getGlobalCacheVersion } from "../cacheVersionService";
import { trackApiCall } from "@/utils/apiMonitoring";
import { getContentHashFromMetadata, createSignedUrl, createVersionedUrl } from "./utils";

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
    const normalizedKeys = keys.map(k => k.trim());
    
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
    
    // Fetch all missing keys in a single query
    const { data: images, error } = await supabase
      .from('website_images')
      .select('key, storage_path, metadata')
      .in('key', keysToFetch);
    
    if (error) {
      console.error('Error batch loading images:', error);
      // Fill missing keys with placeholders
      for (const key of keysToFetch) {
        result[key] = '/placeholder.svg';
      }
      return result;
    }
    
    // Create a map for easy lookup
    const imageMap = new Map(images?.map(img => [img.key, img]) || []);
    
    // For each key, either get the image or use a placeholder
    const storagePaths: Array<{key: string, storagePath: string, contentHash?: string | null}> = [];
    
    for (const key of keysToFetch) {
      const image = imageMap.get(key);
      if (!image || !image.storage_path) {
        result[key] = '/placeholder.svg';
      } else {
        storagePaths.push({
          key, 
          storagePath: image.storage_path,
          contentHash: getContentHashFromMetadata(image.metadata)
        });
      }
    }
    
    // Process each storage path to get signed URLs
    for (const { key, storagePath, contentHash } of storagePaths) {
      try {
        const signedUrl = await createSignedUrl(storagePath);
        
        if (!signedUrl || signedUrl === '/placeholder.svg') {
          result[key] = '/placeholder.svg';
          continue;
        }
        
        // Add versioning to URL for cache busting
        const finalUrl = createVersionedUrl(signedUrl, contentHash, cacheVersion);
        
        // Update result and cache
        result[key] = finalUrl;
        urlCache.set(`url:${key}`, finalUrl);
      } catch (error) {
        console.error(`Error creating signed URL for "${key}":`, error);
        result[key] = '/placeholder.svg';
      }
    }
    
    return result;
  } catch (error) {
    console.error('Unexpected error in batchGetImageUrls:', error);
    return keys.reduce((acc, key) => {
      acc[key] = '/placeholder.svg';
      return acc;
    }, {} as Record<string, string>);
  }
};
