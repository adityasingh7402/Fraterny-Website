
import { supabase } from "@/integrations/supabase/client";
import { urlCache } from "../../cacheService";
import { getGlobalCacheVersion } from "../cacheVersionService";
import { trackApiCall } from "@/utils/apiMonitoring";
import { getContentHashFromMetadata, createVersionedUrl, createSignedUrl } from "./utils";

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
    console.error(`Unexpected error in getImageUrlByKeyAndSize for "${normalizedKey}":`, error);
    return '/placeholder.svg';
  }
};
