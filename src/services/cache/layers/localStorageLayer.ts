
/**
 * LocalStorage cache layer implementation
 */

import { localStorageCacheService } from '../../images/cache/localStorageCacheService';
import { WebsiteImage } from '../../images/types';
import { CachePriority, isValidWebsiteImage } from '../types';
import { logCacheOperation } from '../utils';

/**
 * Check if localStorage is available
 */
export const isLocalStorageAvailable = (): boolean => {
  return localStorageCacheService.isValid();
};

/**
 * Get an image from localStorage cache
 */
export const getImageFromLocalStorage = (key: string): WebsiteImage | null => {
  if (!isLocalStorageAvailable()) return null;
  
  const result = localStorageCacheService.getImage(key);
  if (result === null) return null;
  
  // Ensure the result is a valid WebsiteImage
  if (result?.data && isValidWebsiteImage(result.data)) {
    return result.data;
  }
  
  return null;
};

/**
 * Set an image in localStorage cache
 */
export const setImageInLocalStorage = (key: string, data: WebsiteImage, priority: CachePriority = 3): boolean => {
  if (!isLocalStorageAvailable()) return false;
  
  if (!isValidWebsiteImage(data)) {
    console.warn(`[LocalStorageCache] Attempted to cache invalid WebsiteImage data:`, data);
    return false;
  }
  
  return localStorageCacheService.setImage(key, data, priority);
};

/**
 * Get an image URL from localStorage cache
 */
export const getImageUrlFromLocalStorage = (key: string, size?: string): string | null => {
  if (!isLocalStorageAvailable()) return null;
  
  const urlKey = size ? `${key}:${size}` : key;
  return localStorageCacheService.getUrl(`url:${urlKey}`);
};

/**
 * Set an image URL in localStorage cache
 */
export const setImageUrlInLocalStorage = (
  key: string, 
  url: string, 
  size?: string, 
  priority?: CachePriority
): boolean => {
  if (!isLocalStorageAvailable()) return false;
  
  if (typeof url !== 'string' || url.trim() === '') {
    console.warn(`[LocalStorageCache] Attempted to cache invalid URL:`, url);
    return false;
  }
  
  const urlKey = size ? `${key}:${size}` : key;
  return localStorageCacheService.setUrl(`url:${urlKey}`, url, priority);
};

/**
 * Clear URL cache for a specific key in localStorage
 */
export const clearUrlCacheForKeyInLocalStorage = (key: string): boolean => {
  if (!isLocalStorageAvailable()) return false;
  
  return localStorageCacheService.clearUrlCacheForKey(`url:${key}`);
};

/**
 * Clear all image and URL caches in localStorage
 */
export const clearLocalStorageCache = (): boolean => {
  if (!isLocalStorageAvailable()) return false;
  
  return localStorageCacheService.clearCache();
};

/**
 * Get the global version from localStorage
 */
export const getGlobalVersionFromLocalStorage = (): string | null => {
  if (!isLocalStorageAvailable()) return null;
  
  return localStorageCacheService.getGlobalVersion();
};

/**
 * Update the global version in localStorage
 */
export const updateGlobalVersionInLocalStorage = (version: string): boolean => {
  if (!isLocalStorageAvailable()) return false;
  
  return localStorageCacheService.updateGlobalVersion(version);
};
