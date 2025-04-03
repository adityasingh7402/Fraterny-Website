
import { supabase } from "@/integrations/supabase/client";
import { localStorageCacheService } from '../cache/localStorageCacheService';
import { updateServiceWorkerCacheVersion } from "@/utils/serviceWorkerRegistration";

// Cache for global version
let cachedGlobalVersion: string | null = null;
let cachedVersionTimestamp: number = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

/**
 * Get the global cache version, with localStorage support
 */
export const getGlobalCacheVersion = async (): Promise<string | null> => {
  try {
    // First check if we have a valid cached version
    if (cachedGlobalVersion && (Date.now() - cachedVersionTimestamp < CACHE_DURATION)) {
      return cachedGlobalVersion;
    }
    
    // Then check if we have a version in localStorage
    if (localStorageCacheService.isValid()) {
      const storedVersion = localStorageCacheService.getGlobalVersion();
      if (storedVersion) {
        cachedGlobalVersion = storedVersion;
        cachedVersionTimestamp = Date.now();
        return storedVersion;
      }
    }
    
    // If not, fetch from the database
    const { data, error } = await supabase
      .from('website_settings')
      .select('value')
      .eq('key', 'cache_version')
      .maybeSingle();
    
    if (error) {
      console.error('Error fetching global cache version:', error);
      return null;
    }
    
    const version = data?.value || null;
    
    // Cache the version
    cachedGlobalVersion = version;
    cachedVersionTimestamp = Date.now();
    
    // Also store in localStorage
    if (version && localStorageCacheService.isValid()) {
      localStorageCacheService.updateGlobalVersion(version);
    }
    
    return version;
  } catch (error) {
    console.error('Unexpected error fetching global cache version:', error);
    return null;
  }
};

/**
 * Update the global cache version
 * This will force all clients to regenerate their caches
 */
export const updateGlobalCacheVersion = async (options: {
  scope?: 'global' | 'prefix' | 'category';
  target?: string;
} = {}): Promise<boolean> => {
  try {
    const { scope = 'global', target } = options;
    
    // Generate a new version string
    const timestamp = Date.now();
    const randomPart = Math.floor(Math.random() * 1000);
    const versionString = `${scope}${target ? `:${target}` : ''}:${timestamp}-${randomPart}`;
    
    // Update in the database
    const { error } = await supabase
      .from('website_settings')
      .upsert({
        key: 'cache_version',
        value: versionString,
        description: 'Global cache version for coordinating client cache invalidation',
        updated_at: new Date().toISOString()
      });
    
    if (error) {
      console.error('Error updating global cache version:', error);
      return false;
    }
    
    // Update our local cache
    cachedGlobalVersion = versionString;
    cachedVersionTimestamp = Date.now();
    
    // Update localStorage
    if (localStorageCacheService.isValid()) {
      localStorageCacheService.updateGlobalVersion(versionString);
    }
    
    // Also update the service worker cache version if available
    try {
      updateServiceWorkerCacheVersion(versionString)
        .then(success => {
          if (success) {
            console.log('Service worker cache version updated successfully');
          }
        })
        .catch(err => {
          console.warn('Failed to update service worker cache version:', err);
        });
    } catch (err) {
      console.warn('Error while trying to update service worker cache:', err);
    }
    
    console.log(`Global cache version updated: ${versionString}`);
    return true;
  } catch (error) {
    console.error('Unexpected error updating global cache version:', error);
    return false;
  }
};
