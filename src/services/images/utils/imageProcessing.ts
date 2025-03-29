
/**
 * Re-export utility functions for image processing
 * This file serves as a facade for backward compatibility
 */

// Export functions from individual modules
export { getImageDimensions } from './dimensions';
export { createOptimizedVersions } from './optimizationService';
export { resizeImage } from './optimizationUtils';
