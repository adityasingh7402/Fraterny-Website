
import { supabase } from "@/integrations/supabase/client";
import { STORAGE_BUCKET_NAME } from "../constants";

/**
 * Create optimized versions of an uploaded image
 * This is a simplified version that just uploads the same file with different names
 * In a real implementation, you would resize and compress the images
 */
export const createOptimizedVersions = async (
  file: File,
  originalPath: string
): Promise<Record<string, string>> => {
  // If it's not an image file, don't create optimized versions
  if (!file.type.startsWith('image/')) {
    return {};
  }
  
  try {
    // Create paths for different sizes
    const pathWithoutExt = originalPath.replace(/\.[^/.]+$/, "");
    const extension = originalPath.split('.').pop() || 'jpg';
    
    const smallPath = `optimized/${pathWithoutExt}-small.${extension}`;
    const mediumPath = `optimized/${pathWithoutExt}-medium.${extension}`;
    const largePath = `optimized/${pathWithoutExt}-large.${extension}`;
    
    // In a real implementation, you would resize and compress the image
    // For now, we'll just use the same file for all sizes
    
    // Upload optimized versions
    await supabase.storage
      .from(STORAGE_BUCKET_NAME)
      .upload(smallPath, file, {
        cacheControl: '31536000', // 1 year cache
        upsert: true
      });
      
    await supabase.storage
      .from(STORAGE_BUCKET_NAME)
      .upload(mediumPath, file, {
        cacheControl: '31536000', // 1 year cache
        upsert: true
      });
      
    await supabase.storage
      .from(STORAGE_BUCKET_NAME)
      .upload(largePath, file, {
        cacheControl: '31536000', // 1 year cache
        upsert: true
      });
    
    // Return paths to optimized versions
    return {
      small: smallPath,
      medium: mediumPath,
      large: largePath
    };
  } catch (error) {
    console.error('Error creating optimized versions:', error);
    // Return empty object if optimization fails
    return {};
  }
};
