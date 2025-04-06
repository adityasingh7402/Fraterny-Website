
/**
 * Legacy hook for direct image access - now just re-exports
 * from the main useImage hook for consistency and consolidation.
 */

import { 
  useImageUrl, 
  useMultipleImageUrls, 
  useImagePreloader,
  getImageUrlByKey,
  getImageUrlByKeyAndSize,
  getMultipleImageUrls
} from './useImage';

// Re-export the hooks
export { 
  useImageUrl, 
  useMultipleImageUrls, 
  useImagePreloader,
  getImageUrlByKey,
  getImageUrlByKeyAndSize,
  getMultipleImageUrls
};

// Create a default export object for backward compatibility
export default { 
  useImageUrl, 
  useMultipleImageUrls,
  useImagePreloader
};
