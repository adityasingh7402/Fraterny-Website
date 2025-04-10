import { supabase } from "@/integrations/supabase/client";
import { urlCache } from "../utils/urlCache";
import { WebsiteImage } from "../types";
import { addHashToUrl } from "../utils/hashUtils";
import { getGlobalCacheVersion } from "./cacheVersionService";

// Constants
const STORAGE_BUCKET = 'website-images';
const CACHE_TTL = {
  DEFAULT: 3600,          // 1 hour
  SIGNED: 1800,          // 30 minutes for signed URLs
  SIZED: 7200,          // 2 hours for sized images (less likely to change)
};

/**
 * Validate a cached URL
 */
const isValidCachedUrl = (url: unknown): url is string => {
  return typeof url === 'string' && url.length > 0 && !url.includes('/placeholder.svg');
};

/**
 * Get the image URL by key
 */
export const getImageUrlByKey = async (key: string): Promise<string> => {
  try {
    // Check cache first with proper validation
    const cacheKey = `url:${key}`;
    const cachedUrl = urlCache.get(cacheKey);
    if (isValidCachedUrl(cachedUrl)) {
      console.log(`[getImageUrlByKey] Using cached URL for ${key}`);
      return cachedUrl;
    }

    console.log(`[getImageUrlByKey] Generating fresh URL for ${key}`);

    // Fetch the image record
    const { data, error } = await supabase
      .from('website_images')
      .select('storage_path, metadata')
      .eq('key', key)
      .maybeSingle();

    if (error || !data?.storage_path) {
      console.error(`[getImageUrlByKey] Error or missing path for ${key}:`, error || 'No storage_path');
      return '/placeholder.svg';
    }

    // Get the public URL - this is the key part that must remain unmodified
    const { data: publicUrlData } = supabase.storage
      .from(STORAGE_BUCKET)
      .getPublicUrl(data.storage_path);

    if (!publicUrlData?.publicUrl) {
      console.error(`[getImageUrlByKey] Failed to generate public URL for ${key}`);
      return '/placeholder.svg';
    }

    const finalUrl = publicUrlData.publicUrl;

    // Add cache control headers through URL parameters without breaking the URL structure
    const urlWithCacheControl = new URL(finalUrl);
    
    // Add a cache version if image has been modified (using metadata)
    if (data.metadata?.lastModified) {
      urlWithCacheControl.searchParams.append('v', data.metadata.lastModified);
    }

    // Get global cache version for system-wide cache busting if needed
    try {
      const globalVersion = await getGlobalCacheVersion();
      if (globalVersion) {
        urlWithCacheControl.searchParams.append('gv', globalVersion);
      }
    } catch (e) {
      console.warn(`[getImageUrlByKey] Failed to get global version, continuing without it:`, e);
    }

    const finalUrlWithCache = urlWithCacheControl.toString();

    // Cache the URL with appropriate TTL
    urlCache.set(cacheKey, finalUrlWithCache, CACHE_TTL.DEFAULT);

    console.log(`[getImageUrlByKey] Successfully generated URL for ${key}`);
    return finalUrlWithCache;

  } catch (e) {
    console.error(`[getImageUrlByKey] Unexpected error for ${key}:`, e);
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
  
  // Check cache first with proper validation
  const cachedUrl = urlCache.get(cacheKey);
  if (isValidCachedUrl(cachedUrl)) {
    console.log(`[getImageUrlByKeyAndSize] Using cached URL for ${key} (size: ${size})`);
    return cachedUrl;
  }

  try {
    console.log(`[getImageUrlByKeyAndSize] Fetching image with key ${key}, size ${size}...`);

    // Fetch the image record
    const { data, error } = await supabase
      .from('website_images')
      .select('sizes, storage_path')
      .eq('key', key)
      .maybeSingle();

    if (error || !data) {
      console.error(`[getImageUrlByKeyAndSize] Error fetching image:`, error || 'No data');
      return '/placeholder.svg';
    }

    // Check if sized version exists
    if (data.sizes?.[size]) {
      const { data: urlData } = supabase.storage
        .from(STORAGE_BUCKET)
        .getPublicUrl(data.sizes[size]);

      if (!urlData?.publicUrl) {
        console.warn(`[getImageUrlByKeyAndSize] Failed to get sized URL, falling back to original`);
        return getImageUrlByKey(key);
      }

      // Cache the sized URL
      urlCache.set(cacheKey, urlData.publicUrl, CACHE_TTL.SIZED);
      return urlData.publicUrl;
    }

    // Fall back to original image if size not available
    console.log(`[getImageUrlByKeyAndSize] Size ${size} not found, using original`);
    return getImageUrlByKey(key);
  } catch (e) {
    console.error(`[getImageUrlByKeyAndSize] Unexpected error:`, e);
    return '/placeholder.svg';
  }
};
