
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
  getImageUrlByKeyAndSize 
} from './services/urlService';

// Export placeholder functions
export { 
  getImagePlaceholdersByKey 
} from './services/placeholderCacheService';

// Export cache management functions
export {
  clearImageUrlCache,
  clearImageUrlCacheForKey
} from './services/urlCacheService';

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
export { imageCache } from './cacheService';
export { urlCache } from './utils/urlCache';

// Export bucket management functions
export { ensureImageBucketExists, initializeImageStorage } from './utils/checkBucket';

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
export { generateTinyPlaceholder, generateColorPlaceholder } from './utils/placeholderGenerator';
export * from './utils/hashUtils';
