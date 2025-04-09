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
    if (cachedUrl) {
      console.log(`[getImageUrlByKey] Using cached URL for ${key}:`, cachedUrl);
      return cachedUrl;
    }

    // Fetch the image record to get the storage path and metadata
    const { data, error } = await supabase
      .from('website_images')
      .select('storage_path, metadata')
      .eq('key', key)
      .maybeSingle();

    // Log the complete database response
    console.log(`[getImageUrlByKey] Complete database response:`, {
      data,
      error,
      hasStoragePath: data?.storage_path ? true : false,
      storagePath: data?.storage_path,
      metadata: data?.metadata
    });

    if (error) {
      console.error(`[getImageUrlByKey] Database error:`, error);
      return '/placeholder.svg';
    }

    if (!data || !data.storage_path) {
      console.warn(`[getImageUrlByKey] Missing data or storage_path`);
      return '/placeholder.svg';
    }

    // Get the global cache version from website settings
    const globalVersion = await getGlobalCacheVersion();
    console.log(`[getImageUrlByKey] Global cache version for ${key}:`, globalVersion);

    // Try to get a public URL first
    const publicUrlResult = supabase.storage
      .from(STORAGE_BUCKET)
      .getPublicUrl(data.storage_path);

    // Log the complete URL generation attempt
    console.log(`[getImageUrlByKey] URL generation details:`, {
      bucket: STORAGE_BUCKET,
      storagePath: data.storage_path,
      publicUrlResult,
      constructedUrl: publicUrlResult.data?.publicUrl,
      error: publicUrlResult.error
    });

    if (!publicUrlResult.data?.publicUrl) {
      console.error(`[getImageUrlByKey] Failed to generate public URL:`, publicUrlResult);
      return '/placeholder.svg';
    }

    let finalUrl = publicUrlResult.data.publicUrl;

    // Log the final URL before returning
    console.log(`[getImageUrlByKey] Final URL:`, {
      originalUrl: finalUrl,
      key,
      bucket: STORAGE_BUCKET,
      storagePath: data.storage_path
    });

    // Extract content hash from metadata if available
    let contentHash = null;
    if (typeof data.metadata === 'object' && data.metadata !== null && !Array.isArray(data.metadata)) {
      contentHash = data.metadata.contentHash || null;
    }
    
    console.log(`[getImageUrlByKey] Content hash for ${key}:`, contentHash);
    
    // Build the final URL with both content hash and global version for cache busting
    if (contentHash) {
      finalUrl = addHashToUrl(finalUrl, contentHash);
    }
    
    // Add global version as secondary cache parameter if available
    if (globalVersion) {
      finalUrl = finalUrl.includes('?') 
        ? `${finalUrl}&gv=${globalVersion}` 
        : `${finalUrl}?gv=${globalVersion}`;
    }

    console.log(`[getImageUrlByKey] Final URL for ${key}:`, finalUrl);

    // Cache the URL for future use (with shorter TTL for signed URLs)
    const ttl = finalUrl.includes('token=') ? 3000 : 3600; // 50 minutes for signed URLs, 1 hour for public
    urlCache.set(`url:${key}`, finalUrl, ttl);

    return finalUrl;
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
