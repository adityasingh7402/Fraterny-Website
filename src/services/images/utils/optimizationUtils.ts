
/**
 * Utility functions for image optimization
 */

/**
 * Resize an image to specified dimensions
 */
export const resizeImage = async (
  file: File,
  maxWidth: number,
  maxHeight?: number,
  quality = 0.8,
  format = 'webp'
): Promise<Blob | null> => {
  try {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        // Calculate new dimensions
        let width = img.width;
        let height = img.height;
        
        if (width > maxWidth) {
          const ratio = width / maxWidth;
          width = maxWidth;
          height = Math.round(height / ratio);
        }
        
        if (maxHeight && height > maxHeight) {
          const ratio = height / maxHeight;
          height = maxHeight;
          width = Math.round(width / ratio);
        }
        
        // Create canvas for resizing
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        
        // Draw and resize
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Could not get canvas context'));
          return;
        }
        
        ctx.drawImage(img, 0, 0, width, height);
        
        // Convert to desired format
        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error('Failed to create image blob'));
            }
          },
          `image/${format}`,
          quality
        );
      };
      
      img.onerror = () => {
        reject(new Error('Failed to load image for resizing'));
      };
      
      // Load the image
      img.src = URL.createObjectURL(file);
    });
  } catch (error) {
    console.error('Error resizing image:', error);
    return null;
  }
};
