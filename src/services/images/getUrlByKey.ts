
import { supabase } from "@/integrations/supabase/client";
import { urlCache } from "./cacheService";
import { WebsiteImage } from "./types";
import { addHashToUrl } from "./utils/hashUtils";

/**
 * Get the image URL by key
 */
export const getImageUrlByKey = async (key: string): Promise<string> => {
  // First check if this URL is in the URL cache
  const cachedUrl = urlCache.get(`url:${key}`);
  if (cachedUrl) {
    console.log(`[getImageUrlByKey] Using cached URL for ${key}`);
    return cachedUrl;
  }

  try {
    console.log(`[getImageUrlByKey] Fetching image with key ${key}...`);

    // Fetch the image record to get the storage path and metadata
    const { data, error } = await supabase
      .from('website_images')
      .select('storage_path, metadata')
      .eq('key', key)
      .maybeSingle();

    if (error) {
      console.error(`[getImageUrlByKey] Error fetching image with key ${key}:`, error);
      return '/placeholder.svg';
    }

    if (!data || !data.storage_path) {
      console.warn(`[getImageUrlByKey] No image or storage path found for key ${key}`);
      return '/placeholder.svg';
    }

    // Get the global cache version from website settings
    const globalVersion = await getGlobalCacheVersion();

    // Get the public URL for this storage path
    const { data: urlData } = supabase.storage
      .from('website-images')
      .getPublicUrl(data.storage_path);

    if (!urlData || !urlData.publicUrl) {
      console.warn(`[getImageUrlByKey] Failed to get public URL for storage path: ${data.storage_path}`);
      return '/placeholder.svg';
    }

    // Extract content hash from metadata if available
    // Use safe type checking to avoid errors with different metadata formats
    const contentHash = typeof data.metadata === 'object' && data.metadata !== null
      ? data.metadata.contentHash || null
      : null;
    
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

    console.log(`[getImageUrlByKey] Retrieved URL for ${key}: ${finalUrl}`);

    // Cache the URL for future use
    urlCache.set(`url:${key}`, finalUrl);

    return finalUrl;
  } catch (e) {
    console.error(`[getImageUrlByKey] Unexpected error for key ${key}:`, e);
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
    const contentHash = typeof data.metadata === 'object' && data.metadata !== null
      ? data.metadata.contentHash || null
      : null;
    
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

/**
 * Get image placeholders by key
 */
export const getImagePlaceholdersByKey = async (
  key: string
): Promise<{ 
  tinyPlaceholder: string | null; 
  colorPlaceholder: string | null;
}> => {
  // Check cache for placeholders
  const cachedTiny = urlCache.get(`placeholder:tiny:${key}`);
  const cachedColor = urlCache.get(`placeholder:color:${key}`);
  
  if (cachedTiny && cachedColor) {
    return { 
      tinyPlaceholder: cachedTiny, 
      colorPlaceholder: cachedColor 
    };
  }

  try {
    // Attempt to fetch placeholders from metadata
    const { data, error } = await supabase
      .from('website_images')
      .select('metadata')
      .eq('key', key)
      .maybeSingle();

    if (error || !data || !data.metadata) {
      return { tinyPlaceholder: null, colorPlaceholder: null };
    }

    // Safe access to nested properties using type checking
    let tinyPlaceholder = null;
    let colorPlaceholder = null;
    
    if (typeof data.metadata === 'object' && data.metadata !== null) {
      const placeholders = data.metadata.placeholders;
      if (typeof placeholders === 'object' && placeholders !== null) {
        tinyPlaceholder = placeholders.tiny || null;
        colorPlaceholder = placeholders.color || null;
      }
    }

    // Cache the placeholders if they exist
    if (tinyPlaceholder) {
      urlCache.set(`placeholder:tiny:${key}`, tinyPlaceholder);
    }
    if (colorPlaceholder) {
      urlCache.set(`placeholder:color:${key}`, colorPlaceholder);
    }

    return { tinyPlaceholder, colorPlaceholder };
  } catch (e) {
    console.error(`Error fetching placeholders for key ${key}:`, e);
    return { tinyPlaceholder: null, colorPlaceholder: null };
  }
};

/**
 * Helper function to retrieve the global cache version from website settings
 */
export const getGlobalCacheVersion = async (): Promise<string | null> => {
  try {
    // Check in-memory cache first
    const cachedVersion = urlCache.get('global:cache:version');
    if (cachedVersion) {
      return cachedVersion;
    }

    // Fetch from database
    const { data, error } = await supabase
      .from('website_settings')
      .select('value')
      .eq('key', 'global_cache_version')
      .maybeSingle();

    if (error || !data) {
      console.log('No global cache version found in settings, using default');
      return null;
    }

    // Cache for future use (short TTL)
    urlCache.set('global:cache:version', data.value, 60000); // 1 minute TTL
    
    return data.value;
  } catch (e) {
    console.error('Error fetching global cache version:', e);
    return null;
  }
};

/**
 * Update the global cache version to invalidate all cached content
 */
export const updateGlobalCacheVersion = async (): Promise<boolean> => {
  try {
    // Generate a new timestamp-based version
    const newVersion = `v${Date.now()}`;
    
    // Update in the database
    const { error } = await supabase
      .from('website_settings')
      .upsert({ 
        key: 'global_cache_version', 
        value: newVersion,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'key'
      });

    if (error) {
      console.error('Failed to update global cache version:', error);
      return false;
    }
    
    // Clear URL cache to force regeneration with new version
    clearImageUrlCache();
    
    // Update in-memory cache
    urlCache.set('global:cache:version', newVersion, 60000); // 1 minute TTL
    
    console.log(`Global cache version updated to ${newVersion}`);
    return true;
  } catch (e) {
    console.error('Error updating global cache version:', e);
    return false;
  }
};

/**
 * Clear URL cache to force fresh URL generation
 */
export const clearImageUrlCache = (): void => {
  console.log('Clearing image URL cache');
  urlCache.clear();
};

/**
 * Clear URL cache for a specific key
 */
export const clearImageUrlCacheForKey = (key: string): void => {
  console.log(`Clearing URL cache for key: ${key}`);
  
  // Clear all related cache entries
  urlCache.delete(`url:${key}`);
  urlCache.delete(`placeholder:tiny:${key}`);
  urlCache.delete(`placeholder:color:${key}`);
  
  // Clear size variants
  ['small', 'medium', 'large'].forEach(size => {
    urlCache.delete(`url:${key}:${size}`);
  });
  
  console.log(`Cache entries for key ${key} cleared`);
};
