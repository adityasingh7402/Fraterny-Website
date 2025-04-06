
/**
 * Legacy hook for image loading - uses the new system underneath
 * Maintains backward compatibility with existing code
 */

import { useImageUrl, useMultipleImageUrls } from './useImage';

// Re-export the imports with the correct names for backward compatibility
export { useImageUrl, useMultipleImageUrls };

// Create a default export object
export default { 
  useImageUrl, 
  useMultipleImageUrls 
};
