
// Re-export type definitions
export * from './types';

// Re-export constants
export * from './constants';

// Re-export functions from individual service files
export * from './uploadService';
export * from './updateService';
export * from './deleteService';

// Export getUrlByKey functions directly
export { 
  getImageUrlByKey, 
  getImageUrlByKeyAndSize,
  getImagePlaceholdersByKey,
  clearImageUrlCache,
  clearImageUrlCacheForKey,
  getGlobalCacheVersion,
  updateGlobalCacheVersion 
} from './getUrlByKey';

// Export fetchService functions explicitly to avoid naming conflicts
export { 
  fetchImageByKey,
  fetchAllImages,
  fetchImagesByCategory,
  clearImageCache,
  invalidateImageCache
} from './fetchService';

// Export cache instances for advanced usage
export { imageCache, urlCache } from './cacheService';

// Export utility functions for broader use
export * from './utils/cacheUtils';
export * from './utils/queryUtils';
export * from './utils/fileUtils';
export * from './utils/cleanupUtils';
export * from './utils/databaseUtils';

// Export image processing utilities
export * from './utils/dimensions';
export * from './utils/optimizationService';
export * from './utils/optimizationUtils';
export * from './utils/placeholderService';
export * from './utils/hashUtils';
