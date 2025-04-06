
/**
 * Legacy hook for image loading - uses the new system underneath
 * Maintains backward compatibility with existing code
 */

import { useImageUrl, useMultipleImageUrls } from './useImage';

// Re-export the imports for backward compatibility
export { useImageUrl, useMultipleImageUrls };
export default { useImageUrl, useMultipleImageUrls };
