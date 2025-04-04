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
import { imageCache, urlCache } from '../images/cache/instances';
import { localStorageCacheService } from '../images/cache/localStorageCacheService';
import { getGlobalCacheVersion, updateGlobalCacheVersion } from '../images/services/cacheVersionService';
import { WebsiteImage } from '../images/types';

// Singleton instance of the cache coordinator
let queryClientInstance: QueryClient | null = null;

// Debug mode for verbose logging
const DEBUG_CACHE = process.env.NODE_ENV === 'development';

/**
 * Set the Query Client instance to be used by the coordinator
 */
export const setQueryClient = (queryClient: QueryClient) => {
  queryClientInstance = queryClient;
};

/**
 * Get the current Query Client instance
 */
export const getQueryClient = (): QueryClient | null => {
  return queryClientInstance;
};

/**
 * Cache Layer Types
 */
export type CacheLayerType = 'memory' | 'localStorage' | 'reactQuery' | 'serviceWorker' | 'all';

/**
 * Cache Operation Types
 */
export type CacheOperationType = 'get' | 'set' | 'invalidate' | 'clear';

/**
 * Cache Invalidation Scope
 */
export type CacheInvalidationScope = 'global' | 'category' | 'prefix' | 'key';

/**
 * Cache Priority - used to determine which items to keep in limited storage
 */
export type CachePriority = 1 | 2 | 3 | 4 | 5; // 1 is highest priority

/**
 * Cache Coordinator Interface
 */
export interface CacheCoordinator {
  // Get operations
  getImage: (key: string, options?: CacheOptions) => Promise<any>;
  getImageUrl: (key: string, size?: string, options?: CacheOptions) => Promise<string | null>;
  
  // Set operations
  setImage: (key: string, data: any, options?: CacheOptions) => Promise<void>;
  setImageUrl: (key: string, url: string, size?: string, options?: CacheOptions) => Promise<void>;
  
  // Invalidation operations
  invalidateImage: (key: string, options?: InvalidationOptions) => Promise<void>;
  invalidateCategory: (category: string, options?: InvalidationOptions) => Promise<void>;
  invalidateByPrefix: (prefix: string, options?: InvalidationOptions) => Promise<void>;
  invalidateAll: (options?: InvalidationOptions) => Promise<void>;
  
  // Version control
  updateCacheVersion: (scope: CacheInvalidationScope, target?: string) => Promise<void>;
  getCacheVersion: () => Promise<string | null>;
  
  // Service worker communication
  syncWithServiceWorker: () => Promise<boolean>;
}

/**
 * Cache Options
 */
export interface CacheOptions {
  layers?: CacheLayerType[];
  priority?: CachePriority;
  ttl?: number; // Time to live in milliseconds
  skipLayers?: CacheLayerType[];
  force?: boolean; // Force operation even if conditions would normally prevent it
  metadata?: Record<string, any>; // Additional metadata to store with the cached item
}

/**
 * Invalidation Options
 */
export interface InvalidationOptions {
  layers?: CacheLayerType[];
  cascade?: boolean; // Whether to cascade invalidation to related items
  notifyComponents?: boolean; // Whether to notify components about invalidation
  skipLayers?: CacheLayerType[];
}

/**
 * Default cache options
 */
const defaultCacheOptions: CacheOptions = {
  layers: ['all'],
  priority: 3,
  ttl: 15 * 60 * 1000, // 15 minutes default
  skipLayers: [],
  force: false,
  metadata: {}
};

/**
 * Default invalidation options
 */
const defaultInvalidationOptions: InvalidationOptions = {
  layers: ['all'],
  cascade: true,
  notifyComponents: true,
  skipLayers: []
};

/**
 * Log cache operations in debug mode
 */
const logCacheOperation = (
  operation: CacheOperationType, 
  key: string, 
  result: any, 
  options?: CacheOptions | InvalidationOptions
) => {
  if (DEBUG_CACHE) {
    console.log(`[CacheCoordinator] ${operation.toUpperCase()} ${key}`, { result, options });
  }
};

/**
 * Check if a cache layer should be included in the operation
 */
const shouldIncludeLayer = (
  layer: CacheLayerType, 
  options?: CacheOptions | InvalidationOptions
): boolean => {
  if (!options) return true;
  
  const layers = (options as any).layers || ['all'];
  const skipLayers = (options as any).skipLayers || [];
  
  return (layers.includes('all') || layers.includes(layer)) && !skipLayers.includes(layer);
};

/**
 * Check if React Query is available
 */
const isReactQueryAvailable = (): boolean => {
  return !!queryClientInstance;
};

/**
 * Communicate with the service worker
 */
const communicateWithServiceWorker = async (
  action: string, 
  payload: Record<string, any> = {}
): Promise<boolean> => {
  try {
    if (typeof navigator === 'undefined' || !('serviceWorker' in navigator) || !navigator.serviceWorker.controller) {
      return false;
    }
    
    navigator.serviceWorker.controller.postMessage({
      action,
      ...payload,
      timestamp: Date.now()
    });
    
    return true;
  } catch (error) {
    console.error(`[CacheCoordinator] Error communicating with service worker:`, error);
    return false;
  }
};

// Helper function to check if an object is a valid WebsiteImage
const isValidWebsiteImage = (data: unknown): data is WebsiteImage => {
  if (!data || typeof data !== 'object') return false;
  
  const imageData = data as Record<string, unknown>;
  return (
    'id' in imageData &&
    'key' in imageData &&
    'description' in imageData &&
    'storage_path' in imageData &&
    'alt_text' in imageData &&
    typeof imageData.id === 'string' &&
    typeof imageData.key === 'string' &&
    typeof imageData.description === 'string' &&
    typeof imageData.storage_path === 'string' &&
    typeof imageData.alt_text === 'string'
  );
};

/**
 * Create the cache coordinator
 */
export const createCacheCoordinator = (): CacheCoordinator => {
  /**
   * Get an image from cache
   */
  const getImage = async (key: string, options?: CacheOptions): Promise<any> => {
    const opts = { ...defaultCacheOptions, ...options };
    let result = null;
    
    // Try memory cache first (fastest)
    if (shouldIncludeLayer('memory', opts)) {
      const cacheKey = `image:${key}`;
      result = imageCache.get(cacheKey);
      
      if (result !== undefined) {
        logCacheOperation('get', key, { source: 'memory', hit: true }, opts);
        return result;
      }
    }
    
    // Try localStorage next
    if (shouldIncludeLayer('localStorage', opts) && localStorageCacheService.isValid()) {
      result = localStorageCacheService.getImage(key);
      
      if (result !== null) {
        // Also update memory cache
        if (shouldIncludeLayer('memory', opts)) {
          const cacheKey = `image:${key}`;
          imageCache.set(cacheKey, result.data);
        }
        
        logCacheOperation('get', key, { source: 'localStorage', hit: true }, opts);
        return result.data;
      }
    }
    
    // Try React Query cache
    if (shouldIncludeLayer('reactQuery', opts) && isReactQueryAvailable()) {
      try {
        // Attempt to get from React Query cache without triggering a refetch
        const queryKey = ['image', key];
        const cachedData: unknown = queryClientInstance?.getQueryData(queryKey);
        
        if (cachedData !== undefined) {
          // Update other caches
          if (shouldIncludeLayer('memory', opts)) {
            const cacheKey = `image:${key}`;
            imageCache.set(cacheKey, cachedData);
          }
          
          if (shouldIncludeLayer('localStorage', opts) && localStorageCacheService.isValid()) {
            // Use the type guard to ensure cachedData is a valid WebsiteImage
            if (isValidWebsiteImage(cachedData)) {
              // Now TypeScript knows cachedData is WebsiteImage
              localStorageCacheService.setImage(key, cachedData, opts.priority || 3);
            } else {
              console.warn(`[CacheCoordinator] Data from React Query cache is not a valid WebsiteImage:`, cachedData);
            }
          }
          
          logCacheOperation('get', key, { source: 'reactQuery', hit: true }, opts);
          return cachedData;
        }
      } catch (error) {
        console.error(`[CacheCoordinator] Error getting data from React Query cache:`, error);
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
    let result = null;
    
    // Try memory cache first (fastest)
    if (shouldIncludeLayer('memory', opts)) {
      const cacheKey = `url:${urlKey}`;
      result = urlCache.get(cacheKey);
      
      if (result !== undefined) {
        logCacheOperation('get', `url:${urlKey}`, { source: 'memory', hit: true }, opts);
        return result;
      }
    }
    
    // Try localStorage next
    if (shouldIncludeLayer('localStorage', opts) && localStorageCacheService.isValid()) {
      result = localStorageCacheService.getUrl(`url:${urlKey}`);
      
      if (result !== null) {
        // Also update memory cache
        if (shouldIncludeLayer('memory', opts)) {
          const cacheKey = `url:${urlKey}`;
          urlCache.set(cacheKey, result);
        }
        
        logCacheOperation('get', `url:${urlKey}`, { source: 'localStorage', hit: true }, opts);
        return result;
      }
    }
    
    // Try React Query cache
    if (shouldIncludeLayer('reactQuery', opts) && isReactQueryAvailable()) {
      try {
        // Attempt to get from React Query cache without triggering a refetch
        const queryKey = ['imageUrl', key, size];
        const cachedData: unknown = queryClientInstance?.getQueryData(queryKey);
        
        if (cachedData !== undefined) {
          // Safely access the url property
          const url = typeof cachedData === 'object' && cachedData !== null && 'url' in cachedData && typeof cachedData.url === 'string' 
            ? cachedData.url 
            : null;
            
          if (url) {
            // Update other caches
            if (shouldIncludeLayer('memory', opts)) {
              const cacheKey = `url:${urlKey}`;
              urlCache.set(cacheKey, url);
            }
            
            if (shouldIncludeLayer('localStorage', opts) && localStorageCacheService.isValid()) {
              localStorageCacheService.setUrl(`url:${urlKey}`, url, opts.priority);
            }
            
            logCacheOperation('get', `url:${urlKey}`, { source: 'reactQuery', hit: true }, opts);
            return url;
          }
        }
      } catch (error) {
        console.error(`[CacheCoordinator] Error getting URL from React Query cache:`, error);
      }
    }
    
    // If we got here, the URL was not found in any cache
    logCacheOperation('get', `url:${urlKey}`, { hit: false }, opts);
    return null;
  };
  
  /**
   * Set an image in cache
   */
  const setImage = async (key: string, data: any, options?: CacheOptions): Promise<void> => {
    const opts = { ...defaultCacheOptions, ...options };
    
    // Set in memory cache
    if (shouldIncludeLayer('memory', opts)) {
      const cacheKey = `image:${key}`;
      imageCache.set(cacheKey, data);
    }
    
    // Set in localStorage
    if (shouldIncludeLayer('localStorage', opts) && localStorageCacheService.isValid()) {
      // Check if data is a valid WebsiteImage before storing in localStorage
      if (isValidWebsiteImage(data)) {
        localStorageCacheService.setImage(key, data, opts.priority || 3);
      } else {
        console.warn(`[CacheCoordinator] Attempted to cache invalid WebsiteImage data:`, data);
      }
    }
    
    // Set in React Query cache
    if (shouldIncludeLayer('reactQuery', opts) && isReactQueryAvailable()) {
      try {
        const queryKey = ['image', key];
        queryClientInstance?.setQueryData(queryKey, data);
      } catch (error) {
        console.error(`[CacheCoordinator] Error setting data in React Query cache:`, error);
      }
    }
    
    logCacheOperation('set', key, { success: true }, opts);
  };
  
  /**
   * Set an image URL in cache
   */
  const setImageUrl = async (key: string, url: string, size?: string, options?: CacheOptions): Promise<void> => {
    const opts = { ...defaultCacheOptions, ...options };
    const urlKey = size ? `${key}:${size}` : key;
    
    // Set in memory cache
    if (shouldIncludeLayer('memory', opts)) {
      const cacheKey = `url:${urlKey}`;
      urlCache.set(cacheKey, url);
    }
    
    // Set in localStorage
    if (shouldIncludeLayer('localStorage', opts) && localStorageCacheService.isValid()) {
      localStorageCacheService.setUrl(`url:${urlKey}`, url, opts.priority);
    }
    
    // Set in React Query cache
    if (shouldIncludeLayer('reactQuery', opts) && isReactQueryAvailable()) {
      try {
        const queryKey = ['imageUrl', key, size];
        queryClientInstance?.setQueryData(queryKey, { url, key, size });
      } catch (error) {
        console.error(`[CacheCoordinator] Error setting URL in React Query cache:`, error);
      }
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
      const cacheKey = `image:${key}`;
      imageCache.invalidate(cacheKey);
      
      // Also invalidate URL cache for this key
      urlCache.invalidate(`url:${key}`);
      
      // Invalidate size variants
      ['small', 'medium', 'large'].forEach(size => {
        urlCache.invalidate(`url:${key}:${size}`);
      });
    }
    
    // Invalidate in localStorage
    if (shouldIncludeLayer('localStorage', opts) && localStorageCacheService.isValid()) {
      localStorageCacheService.clearUrlCacheForKey(`url:${key}`);
      
      // We don't have a direct method to clear image by key in localStorage, so we use this approach
      ['', ':small', ':medium', ':large'].forEach(suffix => {
        localStorageCacheService.clearUrlCacheForKey(`url:${key}${suffix}`);
      });
    }
    
    // Invalidate in React Query cache
    if (shouldIncludeLayer('reactQuery', opts) && isReactQueryAvailable()) {
      try {
        // Invalidate image data
        queryClientInstance?.invalidateQueries({ queryKey: ['image', key] });
        
        // Invalidate image URLs
        queryClientInstance?.invalidateQueries({ queryKey: ['imageUrl', key] });
      } catch (error) {
        console.error(`[CacheCoordinator] Error invalidating in React Query cache:`, error);
      }
    }
    
    // Invalidate in service worker
    if (shouldIncludeLayer('serviceWorker', opts)) {
      communicateWithServiceWorker('clearCache', { key });
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
      // Use selective invalidation for categories
      imageCache.invalidateByMatcher(key => {
        // Extract potential category from cache key format
        const categoryMatch = key.match(/image:(.+?):/);
        return categoryMatch && categoryMatch[1] === category;
      });
      
      // Also invalidate URL cache for this category
      urlCache.invalidateByMatcher(key => key.includes(`:${category}:`));
    }
    
    // Invalidate in localStorage (if we had category indexes)
    if (shouldIncludeLayer('localStorage', opts) && localStorageCacheService.isValid()) {
      // This is a more limited operation since we don't have good category indexing in localStorage
      localStorageCacheService.clearCache(); // This is a bit aggressive
    }
    
    // Invalidate in React Query cache
    if (shouldIncludeLayer('reactQuery', opts) && isReactQueryAvailable()) {
      try {
        // Invalidate category queries
        queryClientInstance?.invalidateQueries({ 
          queryKey: ['images', 'category', category],
          refetchType: 'all'
        });
      } catch (error) {
        console.error(`[CacheCoordinator] Error invalidating category in React Query cache:`, error);
      }
    }
    
    // Update global cache version for this category
    if (opts.cascade) {
      await updateGlobalCacheVersion({ scope: 'category', target: category });
      
      // Notify service worker
      if (shouldIncludeLayer('serviceWorker', opts)) {
        communicateWithServiceWorker('updateCacheVersion', { 
          version: `category-${category}-${Date.now()}` 
        });
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
      // Use selective invalidation for prefixes
      imageCache.invalidateByMatcher(key => key.includes(`image:${prefix}`));
      
      // Also invalidate URL cache for this prefix
      urlCache.invalidateByMatcher(key => {
        // Extract the image key from cache keys like "url:hero-image" or "url:hero-image:small"
        const matches = key.match(/^(?:url|placeholder:[^:]+):([^:]+)(?::.+)?$/);
        return matches && matches[1].startsWith(prefix);
      });
    }
    
    // Invalidate in localStorage
    if (shouldIncludeLayer('localStorage', opts) && localStorageCacheService.isValid()) {
      // This is a more limited operation since we don't have good prefix indexing in localStorage
      localStorageCacheService.clearCache(); // This is aggressive
    }
    
    // Invalidate in React Query cache
    if (shouldIncludeLayer('reactQuery', opts) && isReactQueryAvailable()) {
      try {
        // This is imprecise but the best we can do with React Query's API
        queryClientInstance?.invalidateQueries({ 
          predicate: (query) => {
            const queryKey = query.queryKey;
            if (Array.isArray(queryKey) && queryKey.length >= 2) {
              // Check if the second element of the query key (usually the image key) starts with the prefix
              return (
                (queryKey[0] === 'image' || queryKey[0] === 'imageUrl') && 
                typeof queryKey[1] === 'string' && 
                queryKey[1].startsWith(prefix)
              );
            }
            return false;
          },
          refetchType: 'none'
        });
      } catch (error) {
        console.error(`[CacheCoordinator] Error invalidating by prefix in React Query cache:`, error);
      }
    }
    
    // Update global cache version for this prefix
    if (opts.cascade) {
      await updateGlobalCacheVersion({ scope: 'prefix', target: prefix });
      
      // Notify service worker
      if (shouldIncludeLayer('serviceWorker', opts)) {
        communicateWithServiceWorker('updateCacheVersion', { 
          version: `prefix-${prefix}-${Date.now()}` 
        });
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
      imageCache.clear();
      urlCache.clear();
    }
    
    // Invalidate in localStorage
    if (shouldIncludeLayer('localStorage', opts) && localStorageCacheService.isValid()) {
      localStorageCacheService.clearCache();
    }
    
    // Invalidate in React Query cache
    if (shouldIncludeLayer('reactQuery', opts) && isReactQueryAvailable()) {
      try {
        // Invalidate all image-related queries
        queryClientInstance?.invalidateQueries({ 
          queryKey: ['image'],
          exact: false
        });
        
        queryClientInstance?.invalidateQueries({ 
          queryKey: ['imageUrl'],
          exact: false
        });
        
        queryClientInstance?.invalidateQueries({ 
          queryKey: ['images'],
          exact: false
        });
      } catch (error) {
        console.error(`[CacheCoordinator] Error invalidating all in React Query cache:`, error);
      }
    }
    
    // Update global cache version
    if (opts.cascade) {
      await updateGlobalCacheVersion({ scope: 'global' });
      
      // Notify service worker
      if (shouldIncludeLayer('serviceWorker', opts)) {
        communicateWithServiceWorker('clearCache');
        communicateWithServiceWorker('updateCacheVersion', { 
          version: `global-${Date.now()}` 
        });
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
      communicateWithServiceWorker('updateCacheVersion', { 
        version: `${scope}${target ? `-${target}` : ''}-${Date.now()}` 
      });
      
      if (DEBUG_CACHE) {
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
  
  /**
   * Sync with service worker
   */
  const syncWithServiceWorker = async (): Promise<boolean> => {
    try {
      const version = await getGlobalCacheVersion();
      
      if (version) {
        return await communicateWithServiceWorker('updateCacheVersion', { version });
      }
      
      return false;
    } catch (error) {
      console.error(`[CacheCoordinator] Error syncing with service worker:`, error);
      return false;
    }
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
