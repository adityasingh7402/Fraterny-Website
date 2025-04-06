
/**
 * Legacy hook for image loading - uses the new system underneath
 * Maintains backward compatibility with existing code
 */

import { useImageUrl as useImageUrlHook, useMultipleImageUrls as useMultipleImageUrlsHook } from './useImage';

// Re-export the imports with the correct names for backward compatibility
export const useImageUrl = useImageUrlHook;
export const useMultipleImageUrls = useMultipleImageUrlsHook;

// Create a default export object
export default { 
  useImageUrl: useImageUrlHook, 
  useMultipleImageUrls: useMultipleImageUrlsHook 
};
