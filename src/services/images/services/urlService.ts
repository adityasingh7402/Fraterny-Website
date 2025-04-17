import { supabase } from "@/integrations/supabase/client";
import { urlCache } from "../cacheService";
import { WebsiteImage } from "../types";
import { addHashToUrl } from "../utils/hashUtils";
import { getGlobalCacheVersion } from "./cacheVersionService";

// Basic environment detection
const isDevelopment = typeof window !== 'undefined' && 
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

// Cache configuration
const CACHE_TTL = isDevelopment ? 300000 : 3600000; // 5 min vs 1 hour
const MAX_CACHE_SIZE = 1000;
const MAX_RETRIES = 3;

// Basic logging
const log = (message: string, data?: any) => {
  if (isDevelopment) {
    console.log(`[ImageCache] ${message}`, data);
  }
};

// Improved cache management
const manageCache = () => {
  // Get current cache version
  const currentVersion = urlCache.get('global:cache:version');
  
  // Only clear cache entries that don't match current version
  if (currentVersion) {
    const pattern = `^url:.*:(?!${currentVersion})`;
    urlCache.invalidate(pattern);
  }
  
  // If cache is still too large, clear oldest entries
  if (urlCache.size > MAX_CACHE_SIZE) {
    const entries = [...urlCache.entries()];
    entries.sort((a, b) => a[1].timestamp - b[1].timestamp);
    const entriesToRemove = entries.slice(0, Math.floor(MAX_CACHE_SIZE * 0.2)); // Remove 20% of oldest entries
    entriesToRemove.forEach(([key]) => urlCache.delete(key));
  }
  
  log('Cache managed', { currentVersion, size: urlCache.size });
};

// Improved TTL strategy
const getTTL = (key: string) => {
  if (key.includes('global:')) return 5 * 60 * 1000; // 5 minutes for global
  return CACHE_TTL; // Default TTL
};

/**
 * Get the image URL by key with improved cache control
 */
export const getImageUrlByKey = async (key: string, retryCount = 0): Promise<string> => {
  // Get current cache version
  const globalVersion = await getGlobalCacheVersion();
  const cacheKey = `url:${key}:v${globalVersion || 'initial'}`;
  
  // Check cache with version-specific key
  const cachedUrl = urlCache.get(cacheKey);
  if (cachedUrl) {
    log(`Using cached URL for ${key}`, { version: globalVersion });
    return cachedUrl;
  }

  try {
    log(`Fetching image with key ${key}...`);

    // Fetch the image record with optimized query
    const { data, error } = await supabase
      .from('website_images')
      .select('storage_path, metadata')
      .eq('key', key)
      .maybeSingle();

    if (error) {
      log(`Error fetching image with key ${key}`, { error });
      if (retryCount < MAX_RETRIES) {
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, retryCount) * 1000));
        return getImageUrlByKey(key, retryCount + 1);
      }
      return '/placeholder.svg';
    }

    if (!data || !data.storage_path) {
      log(`No image or storage path found for key ${key}`);
      return '/placeholder.svg';
    }

    // Get the public URL for this storage path
    const { data: urlData } = supabase.storage
      .from('website-images')
      .getPublicUrl(data.storage_path);

    if (!urlData || !urlData.publicUrl) {
      log(`Failed to get public URL for storage path`, { path: data.storage_path });
      return '/placeholder.svg';
    }

    // Extract content hash from metadata
    let contentHash = null;
    if (typeof data.metadata === 'object' && data.metadata !== null && !Array.isArray(data.metadata)) {
      contentHash = data.metadata.contentHash || null;
    }
    
    // Build the final URL with enhanced cache parameters
    let finalUrl = urlData.publicUrl;
    if (contentHash) {
      finalUrl = addHashToUrl(finalUrl, contentHash);
    }
    
    // Add global version and cache control parameters
    const cacheParams = new URLSearchParams();
    if (globalVersion) {
      cacheParams.append('gv', globalVersion);
    }
    // Add timestamp for both dev and prod to prevent browser caching
    cacheParams.append('_', Date.now().toString());
    
    finalUrl = finalUrl.includes('?') 
      ? `${finalUrl}&${cacheParams.toString()}`
      : `${finalUrl}?${cacheParams.toString()}`;

    log(`Retrieved URL for ${key}`, { url: finalUrl });

    // Cache the URL with version-specific key and appropriate TTL
    urlCache.set(cacheKey, finalUrl, getTTL(cacheKey));

    // Manage cache size
    manageCache();

    return finalUrl;
  } catch (e) {
    log(`Unexpected error for key ${key}`, { error: e });
    if (retryCount < MAX_RETRIES) {
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, retryCount) * 1000));
      return getImageUrlByKey(key, retryCount + 1);
    }
    return '/placeholder.svg';
  }
};

/**
 * Get the image URL by key and size with improved cache control
 */
export const getImageUrlByKeyAndSize = async (
  key: string, 
  size: 'small' | 'medium' | 'large'
): Promise<string> => {
  // Get current cache version
  const globalVersion = await getGlobalCacheVersion();
  const cacheKey = `url:${key}:${size}:${globalVersion || 'default'}`;
  
  // Check cache with version-specific key
  const cachedUrl = urlCache.get(cacheKey);
  if (cachedUrl) {
    console.log(`[getImageUrlByKeyAndSize] Using cached URL for ${key} (size: ${size}, version: ${globalVersion})`);
    return cachedUrl;
  }

  try {
    console.log(`[getImageUrlByKeyAndSize] Fetching image with key ${key}, size ${size}...`);

    // Fetch the image record with optimized query
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
    
    // Extract content hash from metadata
    let contentHash = null;
    if (typeof data.metadata === 'object' && data.metadata !== null && !Array.isArray(data.metadata)) {
      contentHash = data.metadata.contentHash || null;
    }
    
    // Check if sizes exists and if the requested size is available
    if (data.sizes && data.sizes[size]) {
      // Get the public URL for this optimized size
      const { data: urlData } = supabase.storage
        .from('website-images')
        .getPublicUrl(data.sizes[size]);

      if (!urlData || !urlData.publicUrl) {
        console.warn(`[getImageUrlByKeyAndSize] Failed to get public URL for size path: ${data.sizes[size]}`);
        return '/placeholder.svg';
      }

      // Build the final URL with enhanced cache parameters
      let finalUrl = urlData.publicUrl;
      if (contentHash) {
        finalUrl = addHashToUrl(finalUrl, contentHash);
      }
      
      // Add global version and cache control parameters
      const cacheParams = new URLSearchParams();
      if (globalVersion) {
        cacheParams.append('gv', globalVersion);
      }
      cacheParams.append('_', Date.now().toString()); // Prevent browser caching
      
      finalUrl = finalUrl.includes('?') 
        ? `${finalUrl}&${cacheParams.toString()}`
        : `${finalUrl}?${cacheParams.toString()}`;

      console.log(`[getImageUrlByKeyAndSize] Retrieved sized URL for ${key} (${size}): ${finalUrl}`);

      // Cache the URL with version-specific key and longer TTL
      urlCache.set(cacheKey, finalUrl, CACHE_TTL);
      
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

/**
 * Get multiple image URLs by keys in a single batch operation
 * @param keys Array of image keys to fetch
 * @param size Optional size parameter for responsive images
 * @returns Record of image keys to their URLs
 */
export const getImageUrlsByKeys = async (
  keys: string[],
  size?: 'small' | 'medium' | 'large'
): Promise<Record<string, string>> => {
  const urls: Record<string, string> = {};
  
  // First check cache for all keys
  keys.forEach(key => {
    const cacheKey = size ? `url:${key}:${size}` : `url:${key}`;
    const cachedUrl = urlCache.get(cacheKey);
    if (cachedUrl) {
      urls[key] = cachedUrl;
    }
  });
  
  // Get remaining uncached keys
  const uncachedKeys = keys.filter(key => !urls[key]);
  if (uncachedKeys.length === 0) return urls;
  
  try {
    // Fetch remaining URLs in batch
    const { data, error } = await supabase
      .from('website_images')
      .select('key, storage_path, sizes, metadata')
      .in('key', uncachedKeys);
    
    if (error) {
      console.error('[getImageUrlsByKeys] Error fetching batch of image URLs:', error);
      return urls;
    }
    
    // Process and cache each URL
    for (const image of data) {
      const url = size && image.sizes?.[size]
        ? await getImageUrlByKeyAndSize(image.key, size)
        : await getImageUrlByKey(image.key);
      
      urls[image.key] = url;
    }
    
    return urls;
  } catch (e) {
    console.error('[getImageUrlsByKeys] Unexpected error:', e);
    return urls;
  }
};
