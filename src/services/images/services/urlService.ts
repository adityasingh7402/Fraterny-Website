import { supabase } from "@/integrations/supabase/client";
import { urlCache } from "../cacheService";
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
  // Skip logging for common operations in development
  if (isDevelopment) {
    // Skip logging for cached URLs and cache management
    if (message.includes('Using cached URL') || 
        message.includes('Cache managed') ||
        message.includes('Generated') ||
        message.includes('Retrieved URL')) {
      return;
    }
    
    // Only log important events
    if (message.includes('Error') || 
        message.includes('No image') || 
        message.includes('Failed') ||
        message.includes('Fallback')) {
      console.log(`[ImageCache] ${message}`, data);
    }
  }
};

// Improved cache management
const manageCache = async () => {
  // Get current cache version
  const currentVersion = await urlCache.get('global:cache:version');
  
  // Only clear cache entries that don't match current version
  if (currentVersion) {
    const pattern = `^url:.*:(?!${currentVersion})`;
    await urlCache.invalidate(pattern);
  }
  
  // If cache is still too large, clear oldest entries
  if (urlCache.size > MAX_CACHE_SIZE) {
    const entries = [...urlCache.entries()];
    entries.sort((a, b) => a[1].timestamp - b[1].timestamp);
    const entriesToRemove = entries.slice(0, Math.floor(MAX_CACHE_SIZE * 0.2)); // Remove 20% of oldest entries
    entriesToRemove.forEach(([key]) => urlCache.delete(key));
  }
};

// Improved TTL strategy
const getTTL = (key: string) => {
  if (key.includes('global:')) return 5 * 60 * 1000; // 5 minutes for global
  return CACHE_TTL; // Default TTL
};

interface ImageMetadata {
  contentHash?: string;
  [key: string]: any;
}

interface ImageSizes {
  small?: string;
  medium?: string;
  large?: string;
  [key: string]: string | undefined;
}

// interface ImageData {
//   storage_path: string;
//   metadata?: ImageMetadata;
//   sizes?: ImageSizes;
// }

type ImageSize = 'small' | 'medium' | 'large';

/**
 * Get the image URL by key with improved cache control
 */
export const getImageUrlByKey = async (key: string, retryCount = 0): Promise<string> => {
  // Get current cache version
  const globalVersion = await getGlobalCacheVersion();
  const cacheKey = `url:${key}:v${globalVersion || 'initial'}`;
  
  // Check cache with version-specific key
  const cachedUrl = await urlCache.get(cacheKey);
  if (cachedUrl) {
    log(`Using cached URL for ${key}`, { version: globalVersion });
    return cachedUrl as string;
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
      
      // Try fallback logic for mobile/desktop variants
      let fallbackKey: string | null = null;
      
      if (key.endsWith('-mobile')) {
        // If mobile version not found, try desktop version
        fallbackKey = key.replace('-mobile', '');
        log(`Mobile key ${key} not found, trying desktop fallback: ${fallbackKey}`);
      } else if (!key.endsWith('-mobile')) {
        // If desktop version not found, try mobile version
        fallbackKey = `${key}-mobile`;
        log(`Desktop key ${key} not found, trying mobile fallback: ${fallbackKey}`);
      }
      
      // Attempt fallback if we have one and haven't tried it yet
      if (fallbackKey && retryCount === 0) {
        log(`Attempting fallback with key: ${fallbackKey}`);
        try {
          const fallbackUrl = await getImageUrlByKey(fallbackKey, 1); // Prevent infinite recursion with retryCount = 1
          if (fallbackUrl && fallbackUrl !== '/placeholder.svg') {
            log(`Fallback successful for ${fallbackKey}`);
            return fallbackUrl;
          }
          log(`Fallback failed for ${fallbackKey}, using placeholder`);
        } catch (fallbackError) {
          log(`Fallback also failed for ${fallbackKey}`, fallbackError);
        }
      }
      
      log(`No fallback available for key ${key}, using placeholder`);
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

    // 🎯 MOBILE DEVICE DETECTION
    const isMobileDevice = typeof window !== 'undefined' && 
      (window.innerWidth <= 768 || /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
    
    const isMobileKey = key.includes('-mobile');
    const shouldOptimizeForMobile = isMobileDevice || isMobileKey;

    log(`🎯 Generated ${shouldOptimizeForMobile ? 'MOBILE' : 'DESKTOP'} optimized URL for ${key}`);

    // Extract content hash from metadata
    let contentHash: string | null = null;
    if (typeof data.metadata === 'object' && data.metadata !== null && !Array.isArray(data.metadata)) {
      contentHash = (data.metadata as ImageMetadata).contentHash || null;
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
    await manageCache();

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
  size: ImageSize
): Promise<string> => {
  // Get current cache version
  const globalVersion = await getGlobalCacheVersion();
  const cacheKey = `url:${key}:${size}:${globalVersion || 'default'}`;
  
  // Check cache with version-specific key
  const cachedUrl = await urlCache.get(cacheKey);
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
    let contentHash: string | null = null;
    if (typeof data.metadata === 'object' && data.metadata !== null && !Array.isArray(data.metadata)) {
      contentHash = (data.metadata as ImageMetadata).contentHash || null;
    }
    
    // Check if sizes exists and if the requested size is available
    if (data.sizes && typeof data.sizes === 'object' && !Array.isArray(data.sizes)) {
      const sizes = data.sizes as ImageSizes;
      const sizePath = sizes[size];
      
      if (!sizePath) {
        console.warn(`[getImageUrlByKeyAndSize] Size ${size} not found for key ${key}`);
        return '/placeholder.svg';
      }

      const { data: urlData } = supabase.storage
        .from('website-images')
        .getPublicUrl(sizePath);

      if (!urlData || !urlData.publicUrl) {
        console.warn(`[getImageUrlByKeyAndSize] Failed to get public URL for size path: ${sizePath}`);
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
      // Add timestamp for both dev and prod to prevent browser caching
      cacheParams.append('_', Date.now().toString());
      
      finalUrl = finalUrl.includes('?') 
        ? `${finalUrl}&${cacheParams.toString()}`
        : `${finalUrl}?${cacheParams.toString()}`;

      // Cache the URL with version-specific key and appropriate TTL
      urlCache.set(cacheKey, finalUrl, getTTL(cacheKey));

      // Manage cache size
      await manageCache();

      return finalUrl;
    }

    // If size not found, fall back to original image
    console.warn(`[getImageUrlByKeyAndSize] Size ${size} not found for key ${key}, falling back to original image`);
    return getImageUrlByKey(key);
  } catch (e) {
    console.error(`[getImageUrlByKeyAndSize] Unexpected error for key ${key}:`, e);
    return '/placeholder.svg';
  }
};

/**
 * Get multiple image URLs by keys
 */
export const getImageUrlsByKeys = async (
  keys: string[],
  size?: ImageSize
): Promise<Record<string, string>> => {
  const results: Record<string, string> = {};
  
  // Process keys in parallel with Promise.all
  await Promise.all(
    keys.map(async (key) => {
      try {
        const url = size 
          ? await getImageUrlByKeyAndSize(key, size)
          : await getImageUrlByKey(key);
        results[key] = url;
      } catch (error) {
        console.error(`Error getting URL for key ${key}:`, error);
        results[key] = '/placeholder.svg';
      }
    })
  );
  
  return results;
};
