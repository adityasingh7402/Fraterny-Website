
/**
 * Re-export utility functions for image processing
 * This file serves as a facade for backward compatibility
 */

// Export functions from individual modules
export { getImageDimensions } from './utils/dimensions';
export { resizeImage } from './utils/optimizationUtils';
export { 
  createOptimizedVersions, 
  generateImageVariant 
} from './utils/optimizationService';
