
/**
 * Exports all cache-related functionality from a single entry point
 */

// Export the cache coordinator instance and interface
export { 
  cacheCoordinator,
  setQueryClient,
  getQueryClient
} from './cacheCoordinator';

// Export types
export type { 
  CacheCoordinator,
  CacheInvalidationScope,
  CacheLayerType,
  CacheOperationType,
  CacheOptions,
  CachePriority,
  InvalidationOptions
} from './types';

// Export utility functions
export { 
  logCacheOperation,
  shouldIncludeLayer,
  communicateWithServiceWorker
} from './utils';

// Export validation functions
export { isValidWebsiteImage } from './types';
