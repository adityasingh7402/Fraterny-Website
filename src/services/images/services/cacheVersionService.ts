import { supabase } from "@/integrations/supabase/client";
import { urlCache } from "../cache";
import { 
  clearImageUrlCache, 
  clearImageUrlCacheByCategory,
  clearImageUrlCacheByPrefix
} from "./cacheService";

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
 * Now with optional scope parameter for more targeted invalidation
 */
export const updateGlobalCacheVersion = async (options?: {
  scope?: 'global' | 'category' | 'prefix';
  target?: string;
}): Promise<boolean> => {
  try {
    const scope = options?.scope || 'global';
    const target = options?.target;
    
    // Generate a new timestamp-based version
    const newVersion = `v${Date.now()}`;
    let cacheVersionKey = 'global_cache_version';
    let invalidationTarget = '';
    
    // Create different version keys based on scope
    if (scope === 'category' && target) {
      cacheVersionKey = `cache_version_category_${target}`;
      invalidationTarget = `category:${target}`;
      console.log(`Updating cache version for category: ${target}`);
    } else if (scope === 'prefix' && target) {
      cacheVersionKey = `cache_version_prefix_${target}`;
      invalidationTarget = `prefix:${target}`;
      console.log(`Updating cache version for prefix: ${target}`);
    } else {
      console.log('Updating global cache version');
    }
    
    // Update in the database
    const { error } = await supabase
      .from('website_settings')
      .upsert({ 
        key: cacheVersionKey, 
        value: newVersion,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'key'
      });

    if (error) {
      console.error(`Failed to update cache version for ${scope}:`, error);
      return false;
    }
    
    // Clear URL cache selectively based on scope
    if (scope === 'global') {
      // Full clear for global updates
      clearImageUrlCache();
    } else if (scope === 'category' && target) {
      // Selective clear for category
      clearImageUrlCacheByCategory(target);
    } else if (scope === 'prefix' && target) {
      // Selective clear for prefix
      clearImageUrlCacheByPrefix(target);
    }
    
    // Update in-memory cache
    urlCache.set(`cache:version:${invalidationTarget || 'global'}`, newVersion, 60000); // 1 minute TTL
    
    console.log(`Cache version updated to ${newVersion} for ${scope}${target ? ': ' + target : ''}`);
    return true;
  } catch (e) {
    console.error('Error updating cache version:', e);
    return false;
  }
};
