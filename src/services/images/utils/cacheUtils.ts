
/**
 * Utility functions for cache management
 */
import { imageCache } from "../cacheService";

/**
 * Clear image cache
 */
export const clearImageCache = (): void => {
  imageCache.clear();
  console.log('Image cache cleared');
};

/**
 * Invalidate cache for specific image
 */
export const invalidateImageCache = (key: string): void => {
  imageCache.invalidate(key);
  console.log(`Cache invalidated for image with key: ${key}`);
};

/**
 * Check cache for image by key and return cached data if available
 */
export const getCachedImage = (key: string): any | undefined => {
  const cacheKey = `image:${key.trim()}`;
  const cached = imageCache.get(cacheKey);
  
  if (cached !== undefined) {
    console.log(`Cache hit for image key: ${key}`);
    return cached;
  }
  
  return undefined;
};

/**
 * Store image in cache
 */
export const cacheImage = (key: string, data: any): void => {
  const cacheKey = `image:${key.trim()}`;
  imageCache.set(cacheKey, data);
};
