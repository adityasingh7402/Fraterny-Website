import { supabase } from "@/integrations/supabase/client";
import { urlCache } from "../utils/urlCache";
import { WebsiteImage } from "../types";
import { addHashToUrl } from "../utils/hashUtils";
import { getGlobalCacheVersion } from "./cacheVersionService";

// Constants
const STORAGE_BUCKET = 'website-images';  // Updated to match exact bucket name

/**
 * Get the image URL by key
 */
export const getImageUrlByKey = async (key: string): Promise<string> => {
  try {
    console.log(`[getImageUrlByKey] Starting URL generation for key: "${key}"`);

    // First check if this URL is in the URL cache
    const cachedUrl = urlCache.get(`url:${key}`);
    if (cachedUrl && typeof cachedUrl === 'string' && cachedUrl !== 'null') {
      console.log(`[getImageUrlByKey] Using valid cached URL for ${key}:`, cachedUrl);
      return cachedUrl;
    } else {
      // Clear invalid cache entry if it exists
      urlCache.delete(`url:${key}`);
    }

    // Fetch the image record to get the storage path and metadata
    const { data, error } = await supabase
      .from('website_images')
      .select('storage_path, metadata')
      .eq('key', key)
      .maybeSingle();

    console.log(`[getImageUrlByKey] Database response for ${key}:`, {
      data,
      error,
      hasStoragePath: data?.storage_path ? true : false,
      storagePath: data?.storage_path
    });

    if (error) {
      console.error(`[getImageUrlByKey] Database error:`, error);
      return '/placeholder.svg';
    }

    if (!data || !data.storage_path) {
      console.warn(`[getImageUrlByKey] Missing data or storage_path`);
      return '/placeholder.svg';
    }

    // Try to get a public URL first
    const publicUrlResult = supabase.storage
      .from(STORAGE_BUCKET)
      .getPublicUrl(data.storage_path);

    console.log(`[getImageUrlByKey] Public URL generation attempt:`, {
      bucket: STORAGE_BUCKET,
      storagePath: data.storage_path,
      result: publicUrlResult
    });

    let finalUrl = '';

    if (publicUrlResult.data?.publicUrl) {
      finalUrl = publicUrlResult.data.publicUrl;
      console.log(`[getImageUrlByKey] Successfully generated public URL:`, finalUrl);
    } else {
      // Fall back to signed URL if public URL is not available
      console.log(`[getImageUrlByKey] Falling back to signed URL`);
      const signedUrlResult = await supabase.storage
        .from(STORAGE_BUCKET)
        .createSignedUrl(data.storage_path, 3600);

      if (!signedUrlResult.data?.signedUrl) {
        console.warn(`[getImageUrlByKey] Failed to generate any URL`);
        return '/placeholder.svg';
      }

      finalUrl = signedUrlResult.data.signedUrl;
    }

    // Only cache and return valid URLs
    if (finalUrl && typeof finalUrl === 'string' && finalUrl !== 'null') {
      const ttl = finalUrl.includes('token=') ? 3000 : 3600;
      urlCache.set(`url:${key}`, finalUrl, ttl);
      return finalUrl;
    }

    return '/placeholder.svg';
  } catch (e) {
    console.error(`[getImageUrlByKey] Unexpected error:`, e);
    return '/placeholder.svg';
  }
};

/**
 * Get the image URL by key and size
 */
export const getImageUrlByKeyAndSize = async (
  key: string, 
  size: 'small' | 'medium' | 'large'
): Promise<string> => {
  const cacheKey = `url:${key}:${size}`;
  
  // First check if this URL is already cached
  const cachedUrl = urlCache.get(cacheKey);
  if (cachedUrl) {
    console.log(`[getImageUrlByKeyAndSize] Using cached URL for ${key} (size: ${size})`);
    return cachedUrl;
  }

  try {
    console.log(`[getImageUrlByKeyAndSize] Fetching image with key ${key}, size ${size}...`);

    // Fetch the image record to get sizes and metadata
    const { data, error } = await supabase
      .from('website_images')
      .select('sizes, storage_path, metadata')
      .eq('key', key)
      .maybeSingle();

    if (error) {
      console.error(`[getImageUrlByKeyAndSize] Error fetching image with key ${key}:`, error);
      return '/placeholder.svg';
    }

    if (!data) {
      console.warn(`[getImageUrlByKeyAndSize] No image found for key ${key}`);
      return '/placeholder.svg';
    }
    
    // Get the global cache version from website settings
    const globalVersion = await getGlobalCacheVersion();
    
    // Extract content hash from metadata if available using safe type checking
    let contentHash = null;
    if (typeof data.metadata === 'object' && data.metadata !== null && !Array.isArray(data.metadata)) {
      contentHash = data.metadata.contentHash || null;
    }
    
    // Check if sizes exists and if the requested size is available
    if (data.sizes && data.sizes[size]) {
      // Get the public URL for this optimized size
      const { data: urlData } = supabase.storage
        .from(STORAGE_BUCKET)  // Using constant instead of hardcoded string
        .getPublicUrl(data.sizes[size]);

      if (!urlData || !urlData.publicUrl) {
        console.warn(`[getImageUrlByKeyAndSize] Failed to get public URL for size path: ${data.sizes[size]}`);
        return '/placeholder.svg';
      }

      // Build the final URL with both content hash and global version for cache busting
      let finalUrl = urlData.publicUrl;
      if (contentHash) {
        // Use content hash as primary cache key
        finalUrl = addHashToUrl(finalUrl, contentHash);
      }
      
      // Add global version as secondary cache parameter if available
      if (globalVersion) {
        finalUrl = finalUrl.includes('?') 
          ? `${finalUrl}&gv=${globalVersion}` 
          : `${finalUrl}?gv=${globalVersion}`;
      }

      console.log(`[getImageUrlByKeyAndSize] Retrieved sized URL for ${key} (${size}): ${finalUrl}`);

      // Cache the URL for future use
      urlCache.set(cacheKey, finalUrl);
      
      return finalUrl;
    }

    // If the requested size doesn't exist, fall back to the original image
    console.log(`[getImageUrlByKeyAndSize] Size ${size} not found for ${key}, falling back to original`);
    return getImageUrlByKey(key);
  } catch (e) {
    console.error(`[getImageUrlByKeyAndSize] Unexpected error for key ${key}, size ${size}:`, e);
    return '/placeholder.svg';
  }
};
