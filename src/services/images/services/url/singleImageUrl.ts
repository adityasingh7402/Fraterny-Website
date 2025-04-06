
import { supabase } from "@/integrations/supabase/client";
import { urlCache } from "../../cacheService";
import { getGlobalCacheVersion } from "../cacheVersionService";
import { trackApiCall } from "@/utils/apiMonitoring";
import { getContentHashFromMetadata, createVersionedUrl, createSignedUrl } from "./utils";
import { debugStoragePath, monitorNetworkRequest, isValidUrl } from "@/utils/debugUtils";
import { handleError } from "@/utils/errorHandling";

/**
 * Get a signed URL for an image by its key
 */
export const getImageUrlByKey = async (key: string): Promise<string> => {
  if (!key || typeof key !== 'string' || key.trim() === '') {
    console.error(`Invalid key in getImageUrlByKey: "${key}"`);
    return '/placeholder.svg';
  }
  
  const normalizedKey = key.trim();
  const cacheKey = `url:${normalizedKey}`;
  
  // Try to get from cache first
  const cachedUrl = urlCache.get(cacheKey);
  if (cachedUrl && isValidUrl(cachedUrl)) {
    console.log(`Using cached URL for key "${normalizedKey}": ${cachedUrl}`);
    return cachedUrl;
  }
  
  // Track API call
  trackApiCall('getImageUrlByKey');
  console.log(`Fetching URL for image key: "${normalizedKey}"`);
  
  try {
    // Get global cache version for proper versioning
    const cacheVersion = await getGlobalCacheVersion();
    
    // Monitor this database request
    const monitor = monitorNetworkRequest('supabase:website_images');
    
    // Get image record from database to get the key and metadata
    const { data: image, error } = await supabase
      .from('website_images')
      .select('key, metadata')
      .eq('key', normalizedKey)
      .maybeSingle();
    
    if (error) {
      monitor.failure(error);
      console.error(`Database error loading image with key "${normalizedKey}":`, error);
      return '/placeholder.svg';
    }
    
    monitor.success();
    
    if (!image) {
      console.warn(`No image found with key "${normalizedKey}" in database`);
      return '/placeholder.svg';
    }
    
    // Use the key from the database record
    const imageKey = image.key;
    
    if (!imageKey) {
      console.error(`Image record exists but has no key for "${normalizedKey}"`);
      return '/placeholder.svg';
    }
    
    // Get content hash for cache busting
    const contentHash = getContentHashFromMetadata(image.metadata);
    
    // Create public URL using the storage API
    const { data: urlData, error: urlError } = await supabase.storage
      .from('website-images')
      .getPublicUrl(imageKey);
    
    if (urlError || !urlData || !urlData.publicUrl) {
      console.error(`Failed to get public URL for image key: "${imageKey}"`, urlError);
      return '/placeholder.svg';
    }
    
    // Add versioning to URL for cache busting
    const finalUrl = createVersionedUrl(urlData.publicUrl, contentHash, cacheVersion);
    console.log(`Generated versioned URL for "${normalizedKey}": ${finalUrl}`);
    
    // Cache the URL
    urlCache.set(cacheKey, finalUrl);
    
    return finalUrl;
  } catch (error) {
    handleError(
      error,
      `Error getting URL for image "${normalizedKey}"`,
      { silent: true, context: { key: normalizedKey } }
    );
    return '/placeholder.svg';
  }
};

// Helper functions to centralize error handling patterns
function handleImageNotFound(key: string): string {
  console.warn(`No image found with key "${key}"`);
  return '/placeholder.svg';
}

function handleImageWithoutPath(key: string): string {
  console.error(`No key found for image with key "${key}"`);
  return '/placeholder.svg';
}

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
  if (cachedUrl && isValidUrl(cachedUrl)) {
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
      .select('key, metadata')
      .eq('key', normalizedKey)
      .maybeSingle();
    
    if (error || !image) {
      throw new Error(`Error loading image with key "${normalizedKey}": ${error?.message || 'No image found'}`);
    }
    
    // CRITICAL FIX: Use the key directly instead of storage_path
    const imageKey = image.key;
    
    if (!imageKey) {
      return handleImageWithoutPath(normalizedKey);
    }
    
    // For sized variants, we could append size suffix to the key
    // This assumes your storage follows a pattern like "image-key-small.jpg"
    const sizedKey = size ? `${imageKey}-${size}` : imageKey;
    
    // Get content hash for cache busting
    const contentHash = getContentHashFromMetadata(image.metadata);
    
    // Create public URL using the key directly
    const { data: urlData } = await supabase.storage
      .from('website-images')
      .getPublicUrl(sizedKey);
      
    if (!urlData || !urlData.publicUrl) {
      // Fallback to original key if sized version doesn't exist
      const { data: fallbackData } = await supabase.storage
        .from('website-images')
        .getPublicUrl(imageKey);
        
      if (!fallbackData || !fallbackData.publicUrl) {
        console.error(`Failed to get public URL for image key: ${imageKey}`);
        return '/placeholder.svg';
      }
      
      // Add versioning to URL for cache busting
      const finalUrl = createVersionedUrl(fallbackData.publicUrl, contentHash, cacheVersion);
      
      // Cache the URL
      urlCache.set(cacheKey, finalUrl);
      
      return finalUrl;
    }
    
    // Add versioning to URL for cache busting
    const finalUrl = createVersionedUrl(urlData.publicUrl, contentHash, cacheVersion);
    
    // Cache the URL
    urlCache.set(cacheKey, finalUrl);
    
    return finalUrl;
  } catch (error) {
    handleError(
      error,
      `Error getting URL for image "${normalizedKey}" with size ${size}`,
      { silent: true, context: { key: normalizedKey, size } }
    );
    return '/placeholder.svg';
  }
};
