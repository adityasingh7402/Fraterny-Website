
/**
 * Unified exports for the image service
 */

// Export main image service functions
export {
  getImageUrl,
  getImageUrlBySize,
  getMultipleImageUrls,
  getImageMetadata,
  clearImageUrlCache,
  clearImageCache,
  uploadImage,
  deleteImage,
  isValidImageKey,
  // Export cache instances for advanced usage
  imageCache,
  urlCache
} from './ImageService';

// Export types
export * from './types';

// Export constants
export * from './constants';

// Export utility functions for advanced usage
export * from './utils/databaseUtils';
export * from './utils/cleanupUtils';
export * from './utils/optimizationService';
