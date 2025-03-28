
/**
 * Utility functions for image processing
 */

/**
 * Get image dimensions from a File
 */
export const getImageDimensions = (file: File): Promise<{width: number, height: number}> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(img.src); // Clean up
      resolve({ width: img.width, height: img.height });
    };
    img.src = URL.createObjectURL(file);
  });
};

/**
 * Create optimized versions of an image
 */
export const createOptimizedVersions = async (
  file: File,
  originalPath: string
): Promise<Record<string, string>> => {
  if (!file.type.startsWith('image/')) {
    return {};
  }

  try {
    const sizes: Record<string, string> = {};
    const sizeConfigs = [
      { name: 'small', maxWidth: 400, quality: 0.7 },
      { name: 'medium', maxWidth: 800, quality: 0.8 },
      { name: 'large', maxWidth: 1200, quality: 0.85 }
    ];

    // For images under threshold size, create optimized versions
    // In a production setup, you would use a proper image processing library
    if (file.size < 5 * 1024 * 1024) { // Only process files under 5MB
      for (const config of sizeConfigs) {
        const optimizedPath = await resizeImage(file, config.name, config.maxWidth, config.quality);
        if (optimizedPath) {
          sizes[config.name] = optimizedPath;
        }
      }
    }
    
    return sizes;
  } catch (error) {
    console.error('Error creating optimized versions:', error);
    return {};
  }
};

/**
 * Resize an image to a specific width while maintaining aspect ratio
 */
const resizeImage = async (
  file: File, 
  sizeName: string, 
  maxWidth: number, 
  quality: number
): Promise<string | null> => {
  try {
    const canvas = document.createElement('canvas');
    const img = new Image();
    
    await new Promise<void>((resolve) => {
      img.onload = () => {
        // Calculate dimensions maintaining aspect ratio
        const aspectRatio = img.width / img.height;
        const width = Math.min(img.width, maxWidth);
        const height = width / aspectRatio;
        
        canvas.width = width;
        canvas.height = height;
        
        // Draw resized image to canvas
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
        }
        
        resolve();
      };
      img.src = URL.createObjectURL(file);
    });
    
    // Convert canvas to blob
    const blob = await new Promise<Blob | null>(resolve => {
      canvas.toBlob(resolve, 'image/jpeg', quality);
    });
    
    if (!blob) {
      return null;
    }
    
    // Create a sanitized path for the optimized version
    const sanitizedFilename = file.name
      .replace(/[,\s·]+/g, '-')
      .replace(/[^a-zA-Z0-9\-_.]/g, '')
      .replace(/-+/g, '-')
      .replace(/^-+|-+$/g, '');
      
    const optimizedPath = `optimized/${sizeName}/${sanitizedFilename}`;
    
    // Upload optimized version
    const optimizedFile = new File([blob], `${sizeName}-${sanitizedFilename}`, { type: 'image/jpeg' });
    
    const { error, data } = await import('@/integrations/supabase/client').then(module => {
      const { supabase } = module;
      return supabase.storage
        .from('website-images')
        .upload(optimizedPath, optimizedFile, {
          cacheControl: '3600',
          upsert: true
        });
    });
        
    if (error) {
      console.error(`Error uploading ${sizeName} version:`, error);
      return null;
    }
    
    return optimizedPath;
  } catch (error) {
    console.error(`Error resizing image to ${sizeName}:`, error);
    return null;
  }
};
