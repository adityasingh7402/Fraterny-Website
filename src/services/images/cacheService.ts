
// This file is now just a façade that re-exports from the new modular cache files
// for backward compatibility

// Re-export cache instances
export { imageCache, urlCache } from './cache';

// Re-export cache utility functions
export { 
  clearImageCache,
  invalidateImageCache,
  selectiveInvalidateCache,
  getCachedImage,
  cacheImage
} from './utils/cacheUtils';

// Re-export URL cache functions
export {
  clearImageUrlCache,
  clearImageUrlCacheForKey,
  clearImageUrlCacheByCategory,
  selectiveClearImageUrlCache,
  clearImageUrlCacheByPrefix
} from './services/cacheService';

// Re-export types
export type { CacheEntry } from './cache/types';
