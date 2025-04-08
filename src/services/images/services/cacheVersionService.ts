import { supabase } from "@/integrations/supabase/client";
import { urlCache } from "../utils/urlCache";
import { clearImageUrlCache } from './urlCacheService';

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
