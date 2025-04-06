
import { supabase } from "@/integrations/supabase/client";
import { urlCache } from "../../cache";
import { getGlobalCacheVersion } from "../cacheVersionService";
import { trackApiCall } from "@/utils/apiMonitoring";
import { getContentHashFromMetadata, createVersionedUrl, isValidImageKey } from "./utils";
import { isValidUrl } from "@/utils/debugUtils";
import { handleError } from "@/utils/errorHandling";
import { IMAGE_KEYS } from "@/pages/admin/images/components/upload/constants";

// Cache of validated keys for performance
const validKeyCache = new Map<string, boolean>();

/**
 * Enhanced key validation with caching for performance
 */
const validateAndNormalizeKey = (key: string | null | undefined): string | null => {
  if (!key || typeof key !== 'string' || key.trim() === '') {
    console.error(`Invalid key provided: "${key}"`);
    return null;
  }
  
  const normalizedKey = key.trim();
  
  // Check cache first
  if (validKeyCache.has(normalizedKey)) {
    return validKeyCache.get(normalizedKey) ? normalizedKey : null;
  }
  
  // Validate the key is in our predefined list
  const isValid = isValidImageKey(normalizedKey);
  validKeyCache.set(normalizedKey, isValid);
  
  if (!isValid) {
    const allKeys = IMAGE_KEYS.map(item => item.key);
    const similarKeys = allKeys.filter(k => 
      k.includes(normalizedKey) || normalizedKey.includes(k)
    ).slice(0, 3);
    
    if (similarKeys.length > 0) {
      console.warn(`Key "${normalizedKey}" is not valid. Did you mean: ${similarKeys.join(', ')}?`);
    } else {
      console.error(`Key "${normalizedKey}" is not valid and no similar keys found.`);
    }
    
    return null;
  }
  
  return normalizedKey;
};

/**
 * Get a signed URL for an image by its key
 */
export const getImageUrlByKey = async (key: string): Promise<string> => {
  // Enhanced validation to prevent undefined/null/empty keys
  const validKey = validateAndNormalizeKey(key);
  if (!validKey) {
    console.error(`[getImageUrlByKey] Invalid key: "${key}", returning placeholder`);
    return '/placeholder.svg';
  }
  
  const cacheKey = `url:${validKey}`;
  
  // Try to get from cache first
  const cachedUrl = urlCache.get(cacheKey);
  if (cachedUrl && isValidUrl(cachedUrl)) {
    console.log(`Using cached URL for key "${validKey}": ${cachedUrl}`);
    return cachedUrl;
  }
  
  // Track API call
  trackApiCall('getImageUrlByKey');
  console.log(`Fetching URL for image key: "${validKey}"`);
  
  try {
    // Get global cache version for proper versioning
    const cacheVersion = await getGlobalCacheVersion();
    
    // Get image record from database to get the key and metadata
    const { data: image, error } = await supabase
      .from('website_images')
      .select('key, metadata')
      .eq('key', validKey)
      .maybeSingle();
    
    if (error) {
      console.error(`Database error loading image with key "${validKey}":`, error);
      return '/placeholder.svg';
    }
    
    if (!image) {
      console.warn(`No image found with key "${validKey}" in database`);
      return '/placeholder.svg';
    }
    
    // IMPORTANT: Verify key exists and is not undefined before proceeding
    const imageKey = image.key;
    if (!imageKey) {
      console.error(`Image found but has no key for "${validKey}" - database inconsistency`);
      return '/placeholder.svg';
    }
    
    // Get content hash for cache busting
    const contentHash = getContentHashFromMetadata(image.metadata);
    
    // Create public URL using the key directly
    const { data: urlData } = await supabase.storage
      .from('website-images')
      .getPublicUrl(imageKey);
    
    if (!urlData || !urlData.publicUrl) {
      console.error(`Failed to get public URL for image key: "${imageKey}"`);
      return '/placeholder.svg';
    }
    
    // Add versioning to URL for cache busting
    const finalUrl = createVersionedUrl(urlData.publicUrl, contentHash, cacheVersion);
    console.log(`Generated versioned URL for "${validKey}": ${finalUrl}`);
    
    // Cache the URL
    urlCache.set(cacheKey, finalUrl);
    
    return finalUrl;
  } catch (error) {
    handleError(
      error,
      `Error getting URL for image "${validKey}"`,
      { silent: true, context: { key: validKey } }
    );
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
  // Enhanced validation to prevent undefined/null/empty keys
  const validKey = validateAndNormalizeKey(key);
  if (!validKey) {
    console.error(`[getImageUrlByKeyAndSize] Invalid key: "${key}", returning placeholder`);
    return '/placeholder.svg';
  }
  
  const cacheKey = `url:${validKey}:${size}`;
  
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
      .eq('key', validKey)
      .maybeSingle();
    
    if (error) {
      console.error(`Database error loading image with key "${validKey}":`, error);
      return '/placeholder.svg';
    }
    
    if (!image) {
      console.warn(`No image found with key "${validKey}" in database`);
      return '/placeholder.svg';
    }
    
    // IMPORTANT: Verify key exists and is not undefined before proceeding
    const imageKey = image.key;
    if (!imageKey) {
      console.error(`Image found but has no key for "${validKey}" - database inconsistency`);
      return '/placeholder.svg';
    }
    
    // For sized variants, we append size suffix to the key
    const sizedKey = `${imageKey}-${size}`;
    
    // Get content hash for cache busting
    const contentHash = getContentHashFromMetadata(image.metadata);
    
    // First try to get the sized version
    const { data: urlData } = await supabase.storage
      .from('website-images')
      .getPublicUrl(sizedKey);
      
    if (!urlData || !urlData.publicUrl) {
      console.log(`Sized version "${sizedKey}" not found, falling back to original`);
      
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
      `Error getting URL for image "${validKey}" with size ${size}`,
      { silent: true, context: { key: validKey, size } }
    );
    return '/placeholder.svg';
  }
};
