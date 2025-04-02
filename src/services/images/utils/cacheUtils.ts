
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
 * Selectively invalidate cache based on pattern or category
 * More targeted than full invalidation but less specific than single key
 */
export const selectiveInvalidateCache = (pattern: string, options: {
  isCategory?: boolean;
  isPrefix?: boolean;
  metadataMatch?: Record<string, any>;
} = {}): number => {
  const { isCategory, isPrefix, metadataMatch } = options;
  let count = 0;
  
  if (isCategory) {
    // Invalidate by category
    console.log(`Selectively invalidating cache for category: ${pattern}`);
    count = imageCache.invalidateByMatcher(key => {
      // Extract potential category from cache key format
      const categoryMatch = key.match(/image:(.+?):/);
      return categoryMatch && categoryMatch[1] === pattern;
    });
  } else if (isPrefix) {
    // Invalidate by key prefix
    console.log(`Selectively invalidating cache for keys with prefix: ${pattern}`);
    count = imageCache.invalidateByMatcher(key => key.includes(`image:${pattern}`));
  } else if (metadataMatch) {
    // Invalidate by metadata properties
    console.log(`Selectively invalidating cache based on metadata`);
    count = imageCache.invalidateByMatcher(key => {
      const image = imageCache.get(key);
      if (!image || !image.metadata) return false;
      
      // Check if all metadata properties match
      return Object.entries(metadataMatch).every(([k, v]) => 
        image.metadata && image.metadata[k] === v
      );
    });
  } else {
    // Default pattern-based invalidation
    console.log(`Selectively invalidating cache for pattern: ${pattern}`);
    count = imageCache.invalidateByMatcher(key => key.includes(pattern));
  }
  
  console.log(`Invalidated ${count} cache entries`);
  return count;
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

