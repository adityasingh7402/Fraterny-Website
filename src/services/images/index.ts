
// Export direct image service functions
export { 
  getImageUrl, 
  getMultipleImageUrls,
  clearImageUrlCache
} from './directImageService';

// Export validation functions
export { 
  isValidImageKey,
  isValidImageUrl
} from './validation';

// Re-export type definitions
export * from './types';

// Export constants
export { 
  IMAGE_CATEGORIES,
  IMAGE_USAGE_MAP,
  defaultImagesMap
} from './constants';

// Re-export legacy functions for backward compatibility
export * from './uploadService';
export * from './updateService';
export * from './deleteService';
export * from './services/url';
export * from './services/placeholderService';
export * from './services/cacheService';
export * from './services/cacheVersionService';
export { 
  fetchImageByKey,
  fetchAllImages,
  fetchImagesByCategory,
  clearImageCache,
  invalidateImageCache
} from './fetchService';

// Export legacy cache instances for backward compatibility
export { imageCache, urlCache } from './cache';
