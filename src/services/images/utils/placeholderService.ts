
/**
 * Utility functions for generating Low-Quality Image Placeholders (LQIP)
 */

/**
 * Generate a tiny placeholder image from an original file
 * This creates a very small WebP that can be inlined or quickly loaded
 */
export const generateTinyPlaceholder = async (file: File): Promise<string | null> => {
  try {
    if (!file.type.startsWith('image/')) {
      return null;
    }

    const canvas = document.createElement('canvas');
    const img = new Image();
    
    await new Promise<void>((resolve) => {
      img.onload = () => {
        // Use a very small size for the placeholder (e.g., 20px wide)
        const placeholderWidth = 20;
        const aspectRatio = img.width / img.height;
        const placeholderHeight = placeholderWidth / aspectRatio;
        
        canvas.width = placeholderWidth;
        canvas.height = placeholderHeight;
        
        const ctx = canvas.getContext('2d');
        if (ctx) {
          // Apply slight blur for smoother upscaling
          ctx.imageSmoothingEnabled = true;
          ctx.drawImage(img, 0, 0, placeholderWidth, placeholderHeight);
        }
        
        resolve();
      };
      img.src = URL.createObjectURL(file);
    });
    
    // Convert to base64 data URL with very low quality
    const dataUrl = canvas.toDataURL('image/webp', 0.1);
    return dataUrl;
  } catch (error) {
    console.error('Error generating tiny placeholder:', error);
    return null;
  }
};
