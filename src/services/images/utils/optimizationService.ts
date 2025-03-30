
import { resizeImage } from "./optimizationUtils";

/**
 * Create optimized WebP versions of an image
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
      { name: 'small', maxWidth: 400, quality: 0.75 },
      { name: 'medium', maxWidth: 800, quality: 0.8 },
      { name: 'large', maxWidth: 1200, quality: 0.85 },
      { name: 'original', maxWidth: 2000, quality: 0.9 } // Add high-quality version but with size limit
    ];

    // For images under threshold size, create optimized WebP versions
    if (file.size < 10 * 1024 * 1024) { // Increased from 5MB to 10MB
      for (const config of sizeConfigs) {
        const optimizedPath = await resizeImage(file, config.name, config.maxWidth, config.quality);
        if (optimizedPath) {
          sizes[config.name] = optimizedPath;
        }
      }
    }
    
    return sizes;
  } catch (error) {
    console.error('Error creating optimized WebP versions:', error);
    return {};
  }
};

