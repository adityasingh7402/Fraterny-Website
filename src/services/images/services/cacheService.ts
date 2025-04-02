
import { urlCache } from "../cache";

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
  // Use less verbose logging for individual key clears
  urlCache.delete(`url:${key}`);
  urlCache.delete(`placeholder:tiny:${key}`);
  urlCache.delete(`placeholder:color:${key}`);
  
  // Clear size variants
  ['small', 'medium', 'large'].forEach(size => {
    urlCache.delete(`url:${key}:${size}`);
  });
  
  // Since we're using batch deletion, this will be processed efficiently
};

/**
 * Selectively clear URL cache for images in a specific category
 */
export const clearImageUrlCacheByCategory = (category: string): number => {
  console.log(`Clearing URL cache for category: ${category}`);
  
  // This is an estimate since we don't store category in the URL cache directly
  let count = 0;
  
  // We'll need to get the list of keys in this category from the DB or another source
  // For now, we'll just do a pattern-based invalidation if possible
  count = urlCache.invalidateByMatcher(key => key.includes(`:${category}:`));
  
  return count;
};

/**
 * Selectively clear URL cache based on a pattern
 */
export const selectiveClearImageUrlCache = (pattern: string): number => {
  console.log(`Clearing URL cache with pattern: ${pattern}`);
  
  let count = 0;
  count = urlCache.invalidateByMatcher(key => key.includes(pattern));
  
  return count;
};

/**
 * Clear URL cache for images matching a prefix
 */
export const clearImageUrlCacheByPrefix = (prefix: string): number => {
  console.log(`Clearing URL cache for keys with prefix: ${prefix}`);
  
  let count = 0;
  count = urlCache.invalidateByMatcher(key => {
    // Extract the image key from cache keys like "url:hero-image" or "url:hero-image:small"
    const matches = key.match(/^(?:url|placeholder:[^:]+):([^:]+)(?::.+)?$/);
    return matches && matches[1].startsWith(prefix);
  });
  
  return count;
};
