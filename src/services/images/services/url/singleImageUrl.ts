
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
  if (!key) return '/placeholder.svg';
  
  const normalizedKey = key.trim();
  const cacheKey = `url:${normalizedKey}`;
  
  // Try to get from cache first
  const cachedUrl = urlCache.get(cacheKey);
  if (cachedUrl && isValidUrl(cachedUrl)) {
    return cachedUrl;
  }
  
  // Track API call
  trackApiCall('getImageUrlByKey');
  console.log(`Fetching signed URL for image key: "${normalizedKey}"`);
  
  try {
    // Get global cache version for proper versioning
    const cacheVersion = await getGlobalCacheVersion();
    
    // Monitor this database request
    const monitor = monitorNetworkRequest('supabase:website_images');
    
    // Get image record from database
    const { data: image, error } = await supabase
      .from('website_images')
      .select('storage_path, metadata')
      .eq('key', normalizedKey)
      .maybeSingle();
    
    if (error) {
      monitor.failure(error);
      throw new Error(`Error loading image with key "${normalizedKey}": ${error.message}`);
    }
    
    monitor.success();
    
    if (!image) {
      return handleImageNotFound(normalizedKey);
    }
    
    // Get storage path
    const { storage_path: storagePath } = image;
    
    if (!storagePath) {
      return handleImageWithoutPath(normalizedKey);
    }
    
    // Validate storage path
    if (!debugStoragePath(storagePath)) {
      return '/placeholder.svg';
    }
    
    // Get content hash for cache busting
    const contentHash = getContentHashFromMetadata(image.metadata);
    
    // Create signed URL
    const signedUrl = await createSignedUrl(storagePath);
    
    if (!signedUrl || signedUrl === '/placeholder.svg') {
      return '/placeholder.svg';
    }
    
    // Add versioning to URL for cache busting
    const finalUrl = createVersionedUrl(signedUrl, contentHash, cacheVersion);
    
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
  console.error(`No storage path found for image with key "${key}"`);
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
      .select('storage_path, metadata')
      .eq('key', normalizedKey)
      .maybeSingle();
    
    if (error || !image) {
      throw new Error(`Error loading image with key "${normalizedKey}": ${error?.message || 'No image found'}`);
    }
    
    // Get storage path
    const { storage_path: storagePath } = image;
    
    if (!storagePath) {
      return handleImageWithoutPath(normalizedKey);
    }
    
    // Get content hash for cache busting
    const contentHash = getContentHashFromMetadata(image.metadata);
    
    // Create signed URL
    const signedUrl = await createSignedUrl(storagePath);
    
    if (!signedUrl || signedUrl === '/placeholder.svg') {
      return '/placeholder.svg';
    }
    
    // Add versioning to URL for cache busting
    const finalUrl = createVersionedUrl(signedUrl, contentHash, cacheVersion);
    
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
