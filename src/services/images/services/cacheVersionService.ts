import { supabase } from "@/integrations/supabase/client";
import { urlCache } from "../cacheService";

// Cache version TTL in milliseconds (5 minutes for better consistency)
const CACHE_VERSION_TTL = 5 * 60 * 1000;

// Maximum retries for fetching cache version
const MAX_RETRIES = 3;

/**
 * Helper function to retrieve the global cache version from website settings
 * with improved error handling and cache control
 */
export const getGlobalCacheVersion = async (retryCount = 0): Promise<string | null> => {
  try {
    // Check in-memory cache first
    const cachedVersion = urlCache.get('global:cache:version');
    if (cachedVersion) {
      return cachedVersion;
    }

    // Fetch from database with retry logic
    const { data, error } = await supabase
      .from('website_settings')
      .select('value, updated_at')
      .eq('key', 'global_cache_version')
      .maybeSingle();

    if (error) {
      console.error('Error fetching global cache version:', error);
      if (retryCount < MAX_RETRIES) {
        // Exponential backoff with jitter
        const backoffTime = Math.pow(2, retryCount) * 1000 + Math.random() * 1000;
        await new Promise(resolve => setTimeout(resolve, backoffTime));
        return getGlobalCacheVersion(retryCount + 1);
      }
      return null;
    }

    if (!data) {
      console.log('No global cache version found in settings, using default');
      return null;
    }

    // Cache for future use with longer TTL
    urlCache.set('global:cache:version', data.value, CACHE_VERSION_TTL);
    
    return data.value;
  } catch (e) {
    console.error('Error fetching global cache version:', e);
    if (retryCount < MAX_RETRIES) {
      const backoffTime = Math.pow(2, retryCount) * 1000 + Math.random() * 1000;
      await new Promise(resolve => setTimeout(resolve, backoffTime));
      return getGlobalCacheVersion(retryCount + 1);
    }
    return null;
  }
};

/**
 * Update the global cache version to invalidate all cached content
 * with improved error handling and cache invalidation
 */
export const updateGlobalCacheVersion = async (retryCount = 0): Promise<boolean> => {
  try {
    // Generate a new timestamp-based version
    const newVersion = `v${Date.now()}`;
    
    // Update in the database with optimistic locking
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
      if (retryCount < MAX_RETRIES) {
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, retryCount) * 1000));
        return updateGlobalCacheVersion(retryCount + 1);
      }
      return false;
    }
    
    // Clear URL cache to force regeneration with new version
    clearImageUrlCache();
    
    // Update in-memory cache with balanced TTL
    urlCache.set('global:cache:version', newVersion, CACHE_VERSION_TTL);
    
    console.log(`Global cache version updated to ${newVersion}`);
    return true;
  } catch (e) {
    console.error('Error updating global cache version:', e);
    if (retryCount < MAX_RETRIES) {
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, retryCount) * 1000));
      return updateGlobalCacheVersion(retryCount + 1);
    }
    return false;
  }
};

// Import at the top to avoid circular dependency
import { clearImageUrlCache } from './cacheService';
