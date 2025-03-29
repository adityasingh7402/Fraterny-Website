
import { resizeImage } from "./optimizationUtils";

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
