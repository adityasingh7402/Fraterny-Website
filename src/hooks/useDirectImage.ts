
/**
 * Legacy hook for image loading - uses the new system underneath
 * Maintains backward compatibility with existing code
 */

// Simply re-export the new implementation for backward compatibility
export { useImageUrl, useMultipleImageUrls } from './useImage';
export default { useImageUrl, useMultipleImageUrls };
