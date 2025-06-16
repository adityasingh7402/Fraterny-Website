
import { resizeImage } from "./optimizationUtils";
import { generateContentHash } from "./hashUtils";

/**
 * Create optimized WebP versions of an image
 */
export const createOptimizedVersions = async (
  file: File,
  originalPath: string,
  isMobile: boolean = false
): Promise<Record<string, string>> => {
  if (!file.type.startsWith('image/')) {
    return {};
  }

  try {
    const sizes: Record<string, string> = {};
    // 🎯 MOBILE-SPECIFIC SIZE CONFIGURATIONS
    const sizeConfigs = isMobile 
      ? [
          // MOBILE CONFIGURATIONS - Aggressive compression for 300KB target
          { name: 'small', maxWidth: 300, quality: 0.6 },    // ~100KB
          { name: 'medium', maxWidth: 500, quality: 0.65 },  // ~200KB  
          { name: 'large', maxWidth: 700, quality: 0.7 },    // ~300KB
        ]
      : [
          // DESKTOP CONFIGURATIONS - Higher quality for larger screens
          { name: 'small', maxWidth: 600, quality: 0.8 },
          { name: 'medium', maxWidth: 1000, quality: 0.85 },
          { name: 'large', maxWidth: 1400, quality: 0.9 },
          { name: 'original', maxWidth: 2000, quality: 0.95 }
        ];

    // Generate content hash for consistent file naming/caching
    // const contentHash = await generateContentHash(file);

    // // For images under threshold size, create optimized WebP versions
    // if (file.size < 10 * 1024 * 1024) { // Up to 10MB
    //   for (const config of sizeConfigs) {
    //     // Include content hash in optimization for better caching
    //     const optimizedPath = await resizeImage(
    //       file, 
    //       config.name, 
    //       config.maxWidth, 
    //       config.quality,
    //       contentHash
    //     );
    //     if (optimizedPath) {
    //       sizes[config.name] = optimizedPath;
    //     }
    //   }
    // }

    // Generate content hash for consistent file naming/caching
    const contentHash = await generateContentHash(file);
    
    console.log(`🎯 Creating ${isMobile ? 'MOBILE' : 'DESKTOP'} optimized versions for ${file.name}`);

    // For images under threshold size, create optimized WebP versions
    if (file.size < 15 * 1024 * 1024) { // Increased limit to 15MB
      for (const config of sizeConfigs) {
        // Include content hash and mobile flag in optimization
        const optimizedPath = await resizeImage(
          file, 
          config.name, 
          config.maxWidth, 
          config.quality,
          contentHash,
          isMobile // Pass mobile flag
        );
        
        if (optimizedPath) {
          sizes[config.name] = optimizedPath;
          console.log(`✅ Created ${config.name} ${isMobile ? 'mobile' : 'desktop'} version`);
        }
      }
    }
    
    return sizes;
  } catch (error) {
    console.error('Error creating optimized WebP versions:', error);
    return {};
  }
};
