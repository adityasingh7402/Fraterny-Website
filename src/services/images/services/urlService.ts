
import { supabase } from "@/integrations/supabase/client";
import { urlCache } from "../cacheService";
import { getGlobalCacheVersion } from "./cacheVersionService";
import { trackApiCall } from "@/utils/apiMonitoring";
import { createBatchedFunction } from "@/utils/batchApiRequests";
import { Json } from "@/integrations/supabase/types";

// Helper function to safely extract contentHash from metadata
const getContentHashFromMetadata = (metadata: Json | null): string | null => {
  if (!metadata) return null;
  
  // If metadata is a string (JSON string), try to parse it
  if (typeof metadata === 'string') {
    try {
      const parsed = JSON.parse(metadata);
      return parsed?.contentHash || null;
    } catch {
      return null;
    }
  }
  
  // If metadata is an object (already parsed JSON), access contentHash directly
  if (typeof metadata === 'object' && metadata !== null) {
    return (metadata as Record<string, any>).contentHash || null;
  }
  
  return null;
};

/**
 * Get a signed URL for an image by its key
 */
export const getImageUrlByKey = async (key: string): Promise<string> => {
  if (!key) return '/placeholder.svg';
  
  const normalizedKey = key.trim();
  const cacheKey = `url:${normalizedKey}`;
  
  // Try to get from cache first
  const cachedUrl = urlCache.get(cacheKey);
  if (cachedUrl) {
    return cachedUrl;
  }
  
  // Track API call
  trackApiCall('getImageUrlByKey');
  
  try {
    // Get global cache version for proper versioning
    const cacheVersion = await getGlobalCacheVersion();
    
    // Get image record from database
    const { data: image, error } = await supabase
      .from('website_images')
      .select('storage_path, metadata')
      .eq('key', normalizedKey)
      .maybeSingle();
    
    if (error || !image) {
      console.error(`Error loading image with key "${normalizedKey}":`, error);
      return '/placeholder.svg';
    }
    
    // Get storage path
    const { storage_path: storagePath } = image;
    
    if (!storagePath) {
      console.error(`No storage path found for image with key "${normalizedKey}"`);
      return '/placeholder.svg';
    }
    
    // Get content hash for cache busting using the helper function
    const contentHash = getContentHashFromMetadata(image.metadata);
    
    // Create signed URL
    const { data: { signedUrl }, error: signedUrlError } = await supabase.storage
      .from('images')
      .createSignedUrl(storagePath, 60 * 60); // 1 hour expiry
    
    if (signedUrlError || !signedUrl) {
      console.error(`Error creating signed URL for "${normalizedKey}":`, signedUrlError);
      return '/placeholder.svg';
    }
    
    // Add versioning to URL for cache busting
    const versionedUrl = new URL(signedUrl);
    if (contentHash) {
      versionedUrl.searchParams.append('v', contentHash);
    } else if (cacheVersion) {
      versionedUrl.searchParams.append('v', cacheVersion);
    }
    
    const finalUrl = versionedUrl.toString();
    
    // Cache the URL
    urlCache.set(cacheKey, finalUrl);
    
    return finalUrl;
  } catch (error) {
    console.error(`Unexpected error in getImageUrlByKey for "${normalizedKey}":`, error);
    return '/placeholder.svg';
  }
};

/**
 * Get a signed URL for an image by its key and size variant
 */
export const getImageUrlByKeyAndSize = async (
  key: string, 
  size: 'small' | 'medium' | 'large'
): Promise<string> => {
  if (!key) return '/placeholder.svg';
  
  const normalizedKey = key.trim();
  const cacheKey = `url:${normalizedKey}:${size}`;
  
  // Try to get from cache first
  const cachedUrl = urlCache.get(cacheKey);
  if (cachedUrl) {
    return cachedUrl;
  }
  
  // Track API call
  trackApiCall('getImageUrlByKeyAndSize');
  
  try {
    // Get global cache version for proper versioning
    const cacheVersion = await getGlobalCacheVersion();
    
    // Get image record from database
    const { data: image, error } = await supabase
      .from('website_images')
      .select('storage_path, metadata')
      .eq('key', normalizedKey)
      .maybeSingle();
    
    if (error || !image) {
      console.error(`Error loading image with key "${normalizedKey}":`, error);
      return '/placeholder.svg';
    }
    
    // Get storage path
    const { storage_path: storagePath } = image;
    
    if (!storagePath) {
      console.error(`No storage path found for image with key "${normalizedKey}"`);
      return '/placeholder.svg';
    }
    
    // Get content hash for cache busting using the helper function
    const contentHash = getContentHashFromMetadata(image.metadata);
    
    // Create signed URL
    const { data: { signedUrl }, error: signedUrlError } = await supabase.storage
      .from('images')
      .createSignedUrl(storagePath, 60 * 60); // 1 hour expiry
    
    if (signedUrlError || !signedUrl) {
      console.error(`Error creating signed URL for "${normalizedKey}":`, signedUrlError);
      return '/placeholder.svg';
    }
    
    // Add versioning to URL for cache busting
    const versionedUrl = new URL(signedUrl);
    if (contentHash) {
      versionedUrl.searchParams.append('v', contentHash);
    } else if (cacheVersion) {
      versionedUrl.searchParams.append('v', cacheVersion);
    }
    
    const finalUrl = versionedUrl.toString();
    
    // Cache the URL
    urlCache.set(cacheKey, finalUrl);
    
    return finalUrl;
  } catch (error) {
    console.error(`Unexpected error in getImageUrlByKey for "${normalizedKey}":`, error);
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
    const storagePaths: Array<{key: string, storagePath: string, contentHash?: string}> = [];
    
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
    
    // Batch sign URLs (if Supabase allows)
    for (const { key, storagePath, contentHash } of storagePaths) {
      try {
        const { data: { signedUrl }, error: signedUrlError } = await supabase.storage
          .from('images')
          .createSignedUrl(storagePath, 60 * 60); // 1 hour expiry
        
        if (signedUrlError || !signedUrl) {
          result[key] = '/placeholder.svg';
          continue;
        }
        
        // Add versioning to URL for cache busting
        const versionedUrl = new URL(signedUrl);
        if (contentHash) {
          versionedUrl.searchParams.append('v', contentHash);
        } else if (cacheVersion) {
          versionedUrl.searchParams.append('v', cacheVersion);
        }
        
        const finalUrl = versionedUrl.toString();
        
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

// Create batched versions of the functions
export const getImageUrlBatched = createBatchedFunction(
  getImageUrlByKey,
  'getImageUrl',
  50, // 50ms delay to collect batch requests
  async (items) => {
    // Extract all keys
    const keys = items.map(item => item.args[0]);
    
    // Fetch all URLs in a batch
    const urlMap = await batchGetImageUrls(keys);
    
    // Return URLs in the same order as the keys
    return keys.map(key => urlMap[key] || '/placeholder.svg');
  }
);
