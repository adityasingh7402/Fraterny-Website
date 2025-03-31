
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
    
    await new Promise<void>((resolve, reject) => {
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
          
          // Add a slight blur effect directly on canvas for mobile-optimized look
          ctx.filter = 'blur(1px)';
          ctx.drawImage(canvas, 0, 0);
          ctx.filter = 'none';
        }
        
        resolve();
      };
      img.onerror = (err) => {
        console.error('Error loading image for placeholder generation:', err);
        reject(err);
      };
      img.src = URL.createObjectURL(file);
    });
    
    // Convert to base64 data URL with very low quality for minimum size
    const dataUrl = canvas.toDataURL('image/webp', 0.1);
    
    // Log placeholder size for debugging
    const approximateKb = Math.round((dataUrl.length * 0.75) / 1024);
    console.log(`Generated placeholder: ~${approximateKb}KB`);
    
    return dataUrl;
  } catch (error) {
    console.error('Error generating tiny placeholder:', error);
    return null;
  }
};

/**
 * Generate a color-based placeholder derived from the dominant color
 * Useful as an ultra-lightweight fallback when even a tiny image is too much
 */
export const generateColorPlaceholder = async (file: File): Promise<string | null> => {
  try {
    if (!file.type.startsWith('image/')) {
      return null;
    }

    const canvas = document.createElement('canvas');
    canvas.width = 3;
    canvas.height = 3;
    const img = new Image();
    
    await new Promise<void>((resolve, reject) => {
      img.onload = () => {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, 3, 3);
          
          // Get the center pixel color
          const centerPixel = ctx.getImageData(1, 1, 1, 1).data;
          const [r, g, b] = centerPixel;
          
          // Clear and fill with the color
          ctx.clearRect(0, 0, 3, 3);
          ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
          ctx.fillRect(0, 0, 3, 3);
        }
        resolve();
      };
      img.onerror = reject;
      img.src = URL.createObjectURL(file);
    });
    
    // Get the color as CSS value
    const colorDataUrl = canvas.toDataURL('image/webp', 1.0);
    return colorDataUrl;
  } catch (error) {
    console.error('Error generating color placeholder:', error);
    return null;
  }
};
