
import { urlCache } from "../cacheService";

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
