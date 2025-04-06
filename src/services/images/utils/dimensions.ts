
/**
 * Utility functions for working with image dimensions
 */

/**
 * Get the dimensions of an image file
 */
export const getImageDimensions = (file: File): Promise<{ width: number; height: number }> => {
  return new Promise((resolve, reject) => {
    // Skip non-image files
    if (!file.type.startsWith('image/')) {
      reject(new Error('Not an image file'));
      return;
    }
    
    const img = new Image();
    
    img.onload = () => {
      const dimensions = {
        width: img.width,
        height: img.height
      };
      
      // Clean up object URL
      URL.revokeObjectURL(img.src);
      
      resolve(dimensions);
    };
    
    img.onerror = () => {
      // Clean up object URL
      URL.revokeObjectURL(img.src);
      reject(new Error('Failed to load image for dimension detection'));
    };
    
    // Create object URL for the image
    img.src = URL.createObjectURL(file);
  });
};
