
/**
 * Memory cache layer implementation
 */

import { imageCache, urlCache } from '../../images/cache/instances';
import { WebsiteImage } from '../../images/types';
import { isValidWebsiteImage } from '../types';
import { logCacheOperation } from '../utils';

/**
 * Get an image from memory cache
 */
export const getImageFromMemory = (key: string): WebsiteImage | null | undefined => {
  const cacheKey = `image:${key}`;
  return imageCache.get(cacheKey);
};

/**
 * Set an image in memory cache
 */
export const setImageInMemory = (key: string, data: WebsiteImage): void => {
  if (!isValidWebsiteImage(data)) {
    console.warn(`[MemoryCache] Attempted to cache invalid WebsiteImage data:`, data);
    return;
  }
  
  const cacheKey = `image:${key}`;
  imageCache.set(cacheKey, data);
};

/**
 * Get an image URL from memory cache
 */
export const getImageUrlFromMemory = (key: string, size?: string): string | undefined => {
  const urlKey = size ? `${key}:${size}` : key;
  const cacheKey = `url:${urlKey}`;
  return urlCache.get(cacheKey);
};

/**
 * Set an image URL in memory cache
 */
export const setImageUrlInMemory = (key: string, url: string, size?: string): void => {
  if (typeof url !== 'string' || url.trim() === '') {
    console.warn(`[MemoryCache] Attempted to cache invalid URL:`, url);
    return;
  }
  
  const urlKey = size ? `${key}:${size}` : key;
  const cacheKey = `url:${urlKey}`;
  urlCache.set(cacheKey, url);
};

/**
 * Invalidate an image in memory cache
 */
export const invalidateImageInMemory = (key: string): void => {
  const cacheKey = `image:${key}`;
  imageCache.invalidate(cacheKey);
  
  // Also invalidate URL cache for this key
  urlCache.invalidate(`url:${key}`);
  
  // Invalidate size variants
  ['small', 'medium', 'large'].forEach(size => {
    urlCache.invalidate(`url:${key}:${size}`);
  });
};

/**
 * Invalidate images by category in memory cache
 */
export const invalidateCategoryInMemory = (category: string): void => {
  // Use selective invalidation for categories
  imageCache.invalidateByMatcher(key => {
    // Extract potential category from cache key format
    const categoryMatch = key.match(/image:(.+?):/);
    return categoryMatch && categoryMatch[1] === category;
  });
  
  // Also invalidate URL cache for this category
  urlCache.invalidateByMatcher(key => key.includes(`:${category}:`));
};

/**
 * Invalidate images by prefix in memory cache
 */
export const invalidateByPrefixInMemory = (prefix: string): void => {
  // Use selective invalidation for prefixes
  imageCache.invalidateByMatcher(key => key.includes(`image:${prefix}`));
  
  // Also invalidate URL cache for this prefix
  urlCache.invalidateByMatcher(key => {
    // Extract the image key from cache keys like "url:hero-image" or "url:hero-image:small"
    const matches = key.match(/^(?:url|placeholder:[^:]+):([^:]+)(?::.+)?$/);
    return matches && matches[1].startsWith(prefix);
  });
};

/**
 * Clear all images from memory cache
 */
export const clearMemoryCache = (): void => {
  imageCache.clear();
  urlCache.clear();
};
