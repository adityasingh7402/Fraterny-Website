// Re-export type definitions
export * from './types';

// Re-export constants
export * from './constants';

// Re-export functions from individual service files
export * from './uploadService';
export * from './updateService';
export * from './deleteService';

// Export URL service functions directly
export { 
  getImageUrlByKey, 
  getImageUrlByKeyAndSize,
  getImageUrlsByKeys
} from './services/urlService';

// Export placeholder functions
export { 
  getImagePlaceholdersByKey 
} from './services/placeholderService';

// Export cache management functions
export {
  clearImageUrlCache,
  clearImageUrlCacheForKey
} from './services/cacheService';

// Export cache version management
export {
  getGlobalCacheVersion,
  updateGlobalCacheVersion 
} from './services/cacheVersionService';

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
