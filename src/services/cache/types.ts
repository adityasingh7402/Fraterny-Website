
/**
 * Cache system type definitions
 */

import { WebsiteImage } from '../images/types';

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
  getImage: (key: string, options?: CacheOptions) => Promise<WebsiteImage | null>;
  getImageUrl: (key: string, size?: string, options?: CacheOptions) => Promise<string | null>;
  
  // Set operations
  setImage: (key: string, data: WebsiteImage, options?: CacheOptions) => Promise<void>;
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
 * Type guard for WebsiteImage
 * Ensures an object has all required properties to be a valid WebsiteImage
 */
export function isValidWebsiteImage(obj: any): obj is WebsiteImage {
  return obj && 
         typeof obj === 'object' &&
         'id' in obj &&
         'key' in obj &&
         'description' in obj &&
         'storage_path' in obj &&
         'alt_text' in obj &&
         typeof obj.id === 'string' &&
         typeof obj.key === 'string' &&
         typeof obj.description === 'string' &&
         typeof obj.storage_path === 'string';
}
