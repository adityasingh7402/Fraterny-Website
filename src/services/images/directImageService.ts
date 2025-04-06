
/**
 * Simple direct image service facade that uses our unified system
 * Maintains backward compatibility with existing code
 */
import { 
  getImageUrl, 
  getMultipleImageUrls as getMultipleUrls,
  clearImageUrlCache as clearUrlCache,
  isValidImageKey
} from './ImageService';

// Export the unified functions for backward compatibility
export { getImageUrl, isValidImageKey };

/**
 * Get multiple image URLs in one batch - preserved for backward compatibility
 */
export const getMultipleImageUrls = getMultipleUrls;

/**
 * Clear the URL cache - preserved for backward compatibility
 */
export const clearImageUrlCache = clearUrlCache;
