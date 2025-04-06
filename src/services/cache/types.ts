
/**
 * Cache layer types
 */
export type CacheLayerType = 'memory' | 'localStorage' | 'reactQuery' | 'serviceWorker' | 'all';

/**
 * Cache operation types
 */
export type CacheOperationType = 'get' | 'set' | 'invalidate' | 'clear';

/**
 * Cache priority levels
 * 1 = highest (critical data)
 * 5 = lowest (easily regenerated data)
 */
export type CachePriority = 1 | 2 | 3 | 4 | 5;

/**
 * Cache invalidation scope
 */
export type CacheInvalidationScope = 'global' | 'category' | 'prefix' | 'key';

/**
 * Cache options
 */
export interface CacheOptions {
  // Optional layers to include/exclude
  layers?: CacheLayerType[];
  skipLayers?: CacheLayerType[];
  
  // TTL in milliseconds
  ttl?: number;
  
  // Priority (1-5, with 1 being highest)
  priority?: CachePriority;
  
  // Debug mode
  verbose?: boolean;
  
  // Force operation even if condition would prevent it
  force?: boolean;
  
  // Additional metadata
  metadata?: Record<string, any>;
}

/**
 * Invalidation options
 */
export interface InvalidationOptions extends CacheOptions {
  // Whether to cascade invalidation to other layers
  cascade?: boolean;
  
  // Whether to notify components about invalidation
  notifyComponents?: boolean;
}

/**
 * Cache Coordinator interface
 */
export interface CacheCoordinator {
  // Image operations
  getImage: (key: string, options?: CacheOptions) => Promise<any>;
  getImageUrl: (key: string, size?: string, options?: CacheOptions) => Promise<string | null>;
  setImage: (key: string, data: any, options?: CacheOptions) => Promise<void>;
  setImageUrl: (key: string, url: string, size?: string, options?: CacheOptions) => Promise<void>;
  
  // Invalidation operations
  invalidateImage: (key: string, options?: InvalidationOptions) => Promise<void>;
  invalidateCategory: (category: string, options?: InvalidationOptions) => Promise<void>;
  invalidateByPrefix: (prefix: string, options?: InvalidationOptions) => Promise<void>;
  invalidateAll: (options?: InvalidationOptions) => Promise<void>;
  
  // Version management
  updateCacheVersion: (scope: CacheInvalidationScope, target?: string) => Promise<void>;
  getCacheVersion: () => Promise<string | null>;
  
  // Service worker integration
  syncWithServiceWorker: () => Promise<boolean>;
}

/**
 * Type guard for WebsiteImage
 */
export function isValidWebsiteImage(data: any): boolean {
  if (!data || typeof data !== 'object') return false;
  
  // Check required properties
  if (!data.id || !data.key || !data.url) return false;
  
  // URL must be a string
  if (typeof data.url !== 'string') return false;
  
  return true;
}
