/**
 * Cache Coordinator Service
 * 
 * This service coordinates all caching operations across different cache layers:
 * - React Query cache
 * - Memory caches (imageCache, urlCache)
 * - LocalStorage cache
 * - Service Worker cache
 * 
 * It ensures consistent cache behavior and proper invalidation across all layers.
 */

import { QueryClient } from '@tanstack/react-query';
import { WebsiteImage } from '../images/types';
import { getGlobalCacheVersion, updateGlobalCacheVersion } from '../images/services/cacheVersionService';

// Import types
import { 
  CacheCoordinator, 
  CacheInvalidationScope, 
  CacheLayerType,
  CacheOptions, 
  InvalidationOptions,
  isValidWebsiteImage
} from './types';

// Import config
import { defaultCacheOptions, defaultInvalidationOptions } from './config';

// Import utility functions
import { logCacheOperation, shouldIncludeLayer } from './utils';

// Import query client utilities
import { getQueryClient, isReactQueryAvailable, setQueryClient } from './queryClient';

// Import cache layer implementations
import * as memoryLayer from './layers/memoryLayer';
import * as localStorageLayer from './layers/localStorageLayer';
import * as reactQueryLayer from './layers/reactQueryLayer';
import * as serviceWorkerLayer from './layers/serviceWorkerLayer';

/**
 * Sync with service worker
 * @returns Promise<boolean> - whether sync was successful
 */
export const syncWithServiceWorker = async (): Promise<boolean> => {
  try {
    // Check if the service worker is active
    if (typeof navigator === 'undefined' || 
        !('serviceWorker' in navigator) || 
        !navigator.serviceWorker.controller) {
      console.log('Service worker not active or not supported, skipping sync');
      return false;
    }
    
    // Get the cache version
    const cacheVersion = await getGlobalCacheVersion();
    if (!cacheVersion) {
      console.warn('No cache version available for sync');
      return false;
    }
    
    // Send message to service worker to update cache version
    navigator.serviceWorker.controller.postMessage({
      action: 'updateCacheVersion',
      version: cacheVersion
    });
    
    return true;
  } catch (error) {
    console.error('Error syncing with service worker:', error);
    return false;
  }
};

/**
 * Create the cache coordinator
 */
export const createCacheCoordinator = (): CacheCoordinator => {
  /**
   * Get an image from cache
   */
  const getImage = async (key: string, options?: CacheOptions): Promise<WebsiteImage | null> => {
    const opts = { ...defaultCacheOptions, ...options };
    let result: WebsiteImage | null = null;
    
    // Try memory cache first (fastest)
    if (shouldIncludeLayer('memory', opts)) {
      result = memoryLayer.getImageFromMemory(key) || null;
      
      if (result !== null) {
        logCacheOperation('get', key, { source: 'memory', hit: true }, opts);
        return result;
      }
    }
    
    // Try localStorage next
    if (shouldIncludeLayer('localStorage', opts) && localStorageLayer.isLocalStorageAvailable()) {
      result = localStorageLayer.getImageFromLocalStorage(key);
      
      if (result !== null) {
        // Also update memory cache
        if (shouldIncludeLayer('memory', opts)) {
          memoryLayer.setImageInMemory(key, result);
        }
        
        logCacheOperation('get', key, { source: 'localStorage', hit: true }, opts);
        return result;
      }
    }
    
    // Try React Query cache
    if (shouldIncludeLayer('reactQuery', opts) && isReactQueryAvailable()) {
      result = reactQueryLayer.getImageFromReactQuery(key);
      
      if (result !== null) {
        // Update other caches
        if (shouldIncludeLayer('memory', opts)) {
          memoryLayer.setImageInMemory(key, result);
        }

        if (shouldIncludeLayer('localStorage', opts) && localStorageLayer.isLocalStorageAvailable()) {
          localStorageLayer.setImageInLocalStorage(key, result, opts.priority || 3);
        }

        logCacheOperation('get', key, { source: 'reactQuery', hit: true }, opts);
        return result;
      }
    }
    
    // If we got here, the image was not found in any cache
    logCacheOperation('get', key, { hit: false }, opts);
    return null;
  };
  
  /**
   * Get an image URL from cache
   */
  const getImageUrl = async (key: string, size?: string, options?: CacheOptions): Promise<string | null> => {
    const opts = { ...defaultCacheOptions, ...options };
    const urlKey = size ? `${key}:${size}` : key;
    let result: string | null = null;
    
    // Try memory cache first (fastest)
    if (shouldIncludeLayer('memory', opts)) {
      result = memoryLayer.getImageUrlFromMemory(key, size) || null;
      
      if (result !== null) {
        logCacheOperation('get', `url:${urlKey}`, { source: 'memory', hit: true }, opts);
        return result;
      }
    }
    
    // Try localStorage next
    if (shouldIncludeLayer('localStorage', opts) && localStorageLayer.isLocalStorageAvailable()) {
      result = localStorageLayer.getImageUrlFromLocalStorage(key, size);
      
      if (result !== null) {
        // Also update memory cache
        if (shouldIncludeLayer('memory', opts)) {
          memoryLayer.setImageUrlInMemory(key, result, size);
        }
        
        logCacheOperation('get', `url:${urlKey}`, { source: 'localStorage', hit: true }, opts);
        return result;
      }
    }
    
    // Try React Query cache
    if (shouldIncludeLayer('reactQuery', opts) && isReactQueryAvailable()) {
      result = reactQueryLayer.getImageUrlFromReactQuery(key, size);
      
      if (result !== null) {
        // Update other caches
        if (shouldIncludeLayer('memory', opts)) {
          memoryLayer.setImageUrlInMemory(key, result, size);
        }
        
        if (shouldIncludeLayer('localStorage', opts) && localStorageLayer.isLocalStorageAvailable()) {
          localStorageLayer.setImageUrlInLocalStorage(key, result, size, opts.priority);
        }
        
        logCacheOperation('get', `url:${urlKey}`, { source: 'reactQuery', hit: true }, opts);
        return result;
      }
    }
    
    // If we got here, the URL was not found in any cache
    logCacheOperation('get', `url:${urlKey}`, { hit: false }, opts);
    return null;
  };
  
  /**
   * Set an image in cache
   */
  const setImage = async (key: string, data: WebsiteImage, options?: CacheOptions): Promise<void> => {
    const opts = { ...defaultCacheOptions, ...options };
    
    // Validate the data before storing
    if (!isValidWebsiteImage(data)) {
      console.warn(`[CacheCoordinator] Attempted to cache invalid WebsiteImage data:`, data);
      return;
    }
    
    // Set in memory cache
    if (shouldIncludeLayer('memory', opts)) {
      memoryLayer.setImageInMemory(key, data);
    }
    
    // Set in localStorage
    if (shouldIncludeLayer('localStorage', opts) && localStorageLayer.isLocalStorageAvailable()) {
      localStorageLayer.setImageInLocalStorage(key, data, opts.priority || 3);
    }
    
    // Set in React Query cache
    if (shouldIncludeLayer('reactQuery', opts) && isReactQueryAvailable()) {
      reactQueryLayer.setImageInReactQuery(key, data);
    }
    
    logCacheOperation('set', key, { success: true }, opts);
  };
  
  /**
   * Set an image URL in cache
   */
  const setImageUrl = async (key: string, url: string, size?: string, options?: CacheOptions): Promise<void> => {
    const opts = { ...defaultCacheOptions, ...options };
    const urlKey = size ? `${key}:${size}` : key;
    
    // Validate URL
    if (typeof url !== 'string' || url.trim() === '') {
      console.warn(`[CacheCoordinator] Attempted to cache invalid URL:`, url);
      return;
    }
    
    // Set in memory cache
    if (shouldIncludeLayer('memory', opts)) {
      memoryLayer.setImageUrlInMemory(key, url, size);
    }
    
    // Set in localStorage
    if (shouldIncludeLayer('localStorage', opts) && localStorageLayer.isLocalStorageAvailable()) {
      localStorageLayer.setImageUrlInLocalStorage(key, url, size, opts.priority);
    }
    
    // Set in React Query cache
    if (shouldIncludeLayer('reactQuery', opts) && isReactQueryAvailable()) {
      reactQueryLayer.setImageUrlInReactQuery(key, url, size);
    }
    
    logCacheOperation('set', `url:${urlKey}`, { success: true }, opts);
  };
  
  /**
   * Invalidate an image in cache
   */
  const invalidateImage = async (key: string, options?: InvalidationOptions): Promise<void> => {
    const opts = { ...defaultInvalidationOptions, ...options };
    
    // Invalidate in memory cache
    if (shouldIncludeLayer('memory', opts)) {
      memoryLayer.invalidateImageInMemory(key);
    }
    
    // Invalidate in localStorage
    if (shouldIncludeLayer('localStorage', opts) && localStorageLayer.isLocalStorageAvailable()) {
      localStorageLayer.clearUrlCacheForKeyInLocalStorage(`url:${key}`);
      
      // We don't have a direct method to clear image by key in localStorage, so we use this approach
      ['', ':small', ':medium', ':large'].forEach(suffix => {
        localStorageLayer.clearUrlCacheForKeyInLocalStorage(`url:${key}${suffix}`);
      });
    }
    
    // Invalidate in React Query cache
    if (shouldIncludeLayer('reactQuery', opts) && isReactQueryAvailable()) {
      reactQueryLayer.invalidateImageInReactQuery(key);
    }
    
    // Invalidate in service worker
    if (shouldIncludeLayer('serviceWorker', opts)) {
      serviceWorkerLayer.invalidateImageInServiceWorker(key);
    }
    
    logCacheOperation('invalidate', key, { success: true }, opts);
  };
  
  /**
   * Invalidate a category of images
   */
  const invalidateCategory = async (category: string, options?: InvalidationOptions): Promise<void> => {
    const opts = { ...defaultInvalidationOptions, ...options };
    
    // Invalidate in memory cache
    if (shouldIncludeLayer('memory', opts)) {
      memoryLayer.invalidateCategoryInMemory(category);
    }
    
    // Invalidate in localStorage (if we had category indexes)
    if (shouldIncludeLayer('localStorage', opts) && localStorageLayer.isLocalStorageAvailable()) {
      // This is a more limited operation since we don't have good category indexing in localStorage
      localStorageLayer.clearLocalStorageCache(); // This is a bit aggressive
    }
    
    // Invalidate in React Query cache
    if (shouldIncludeLayer('reactQuery', opts) && isReactQueryAvailable()) {
      reactQueryLayer.invalidateCategoryInReactQuery(category);
    }
    
    // Update global cache version for this category
    if (opts.cascade) {
      await updateGlobalCacheVersion({ scope: 'category', target: category });
      
      // Notify service worker
      if (shouldIncludeLayer('serviceWorker', opts)) {
        serviceWorkerLayer.updateCacheVersionInServiceWorker(`category-${category}-${Date.now()}`);
      }
    }
    
    logCacheOperation('invalidate', `category:${category}`, { success: true }, opts);
  };
  
  /**
   * Invalidate images by prefix
   */
  const invalidateByPrefix = async (prefix: string, options?: InvalidationOptions): Promise<void> => {
    const opts = { ...defaultInvalidationOptions, ...options };
    
    // Invalidate in memory cache
    if (shouldIncludeLayer('memory', opts)) {
      memoryLayer.invalidateByPrefixInMemory(prefix);
    }
    
    // Invalidate in localStorage
    if (shouldIncludeLayer('localStorage', opts) && localStorageLayer.isLocalStorageAvailable()) {
      // This is a more limited operation since we don't have good prefix indexing in localStorage
      localStorageLayer.clearLocalStorageCache(); // This is aggressive
    }
    
    // Invalidate in React Query cache
    if (shouldIncludeLayer('reactQuery', opts) && isReactQueryAvailable()) {
      reactQueryLayer.invalidateByPrefixInReactQuery(prefix);
    }
    
    // Update global cache version for this prefix
    if (opts.cascade) {
      await updateGlobalCacheVersion({ scope: 'prefix', target: prefix });
      
      // Notify service worker
      if (shouldIncludeLayer('serviceWorker', opts)) {
        serviceWorkerLayer.updateCacheVersionInServiceWorker(`prefix-${prefix}-${Date.now()}`);
      }
    }
    
    logCacheOperation('invalidate', `prefix:${prefix}`, { success: true }, opts);
  };
  
  /**
   * Invalidate all images
   */
  const invalidateAll = async (options?: InvalidationOptions): Promise<void> => {
    const opts = { ...defaultInvalidationOptions, ...options };
    
    // Invalidate in memory cache
    if (shouldIncludeLayer('memory', opts)) {
      memoryLayer.clearMemoryCache();
    }
    
    // Invalidate in localStorage
    if (shouldIncludeLayer('localStorage', opts) && localStorageLayer.isLocalStorageAvailable()) {
      localStorageLayer.clearLocalStorageCache();
    }
    
    // Invalidate in React Query cache
    if (shouldIncludeLayer('reactQuery', opts) && isReactQueryAvailable()) {
      reactQueryLayer.clearReactQueryCache();
    }
    
    // Update global cache version
    if (opts.cascade) {
      await updateGlobalCacheVersion({ scope: 'global' });
      
      // Notify service worker
      if (shouldIncludeLayer('serviceWorker', opts)) {
        serviceWorkerLayer.clearServiceWorkerCache();
        serviceWorkerLayer.updateCacheVersionInServiceWorker(`global-${Date.now()}`);
      }
    }
    
    logCacheOperation('invalidate', 'all', { success: true }, opts);
  };
  
  /**
   * Update the cache version
   */
  const updateCacheVersion = async (scope: CacheInvalidationScope, target?: string): Promise<void> => {
    try {
      // Fix: Only pass allowed scope types to updateGlobalCacheVersion
      // Make sure 'key' scope is handled properly
      let effectiveScope: 'global' | 'category' | 'prefix' = 'global';
      
      if (scope === 'category') {
        effectiveScope = 'category';
      } else if (scope === 'prefix') {
        effectiveScope = 'prefix';
      } else if (scope === 'key') {
        // Handle 'key' scope by using 'prefix' with the key as target
        effectiveScope = 'prefix';
      }
      
      await updateGlobalCacheVersion({ scope: effectiveScope, target });
      
      // Notify service worker
      serviceWorkerLayer.updateCacheVersionInServiceWorker(`${scope}${target ? `-${target}` : ''}-${Date.now()}`);
      
      if (process.env.NODE_ENV === 'development') {
        console.log(`[CacheCoordinator] Updated cache version: ${scope}${target ? `:${target}` : ''}`);
      }
    } catch (error) {
      console.error(`[CacheCoordinator] Error updating cache version:`, error);
    }
  };
  
  /**
   * Get the current cache version
   */
  const getCacheVersion = async (): Promise<string | null> => {
    return await getGlobalCacheVersion();
  };
  
  return {
    getImage,
    getImageUrl,
    setImage,
    setImageUrl,
    invalidateImage,
    invalidateCategory,
    invalidateByPrefix,
    invalidateAll,
    updateCacheVersion,
    getCacheVersion,
    syncWithServiceWorker
  };
};

// Export a singleton instance of the cache coordinator
export const cacheCoordinator = createCacheCoordinator();

// Re-export the setQueryClient and getQueryClient functions
export { setQueryClient, getQueryClient };

// Re-export types
export type { 
  CacheCoordinator,
  CacheInvalidationScope,
  CacheLayerType,
  CacheOperationType,
  CacheOptions,
  CachePriority,
  InvalidationOptions
} from './types';
