
import { resizeImage } from "./optimizationUtils";
import { generateContentHash } from "./hashUtils";

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

    // Generate content hash for consistent file naming/caching
    const contentHash = await generateContentHash(file);

    // For images under threshold size, create optimized WebP versions
    if (file.size < 10 * 1024 * 1024) { // Up to 10MB
      for (const config of sizeConfigs) {
        // Include content hash in optimization for better caching
        const optimizedPath = await resizeImage(
          file, 
          config.name, 
          config.maxWidth, 
          config.quality,
          contentHash
        );
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
