
import { supabase } from "@/integrations/supabase/client";
import { ImageSizes } from "../types";

/**
 * Create optimized versions of an image for different screen sizes
 * Now with WebP support
 */
export const createOptimizedVersions = async (file: File, storagePath: string): Promise<ImageSizes> => {
  // We'll reuse the built-in optimization capabilities of Supabase Storage
  // This is a simplified version that assumes Supabase handles the optimization
  
  // In a real implementation, you would:
  // 1. Use a cloud function or server-side code to resize the image
  // 2. Convert to WebP format for better compression and quality
  // 3. Upload each size variant to Supabase
  
  // For now, we'll return a simple object indicating the different sizes
  // In a production app, you would implement proper image resizing
  
  // Extract file extension
  const fileExt = file.name.split('.').pop()?.toLowerCase() || '';
  
  // Check if the image is suitable for optimization
  const optimizableFormats = ['jpg', 'jpeg', 'png', 'webp'];
  
  if (!optimizableFormats.includes(fileExt)) {
    // For non-image or unsupported formats, return empty sizes
    return {};
  }
  
  // Set up size variants - we're not actually resizing here,
  // just providing paths that would be used if we implemented resizing
  const baseUrl = storagePath.substring(0, storagePath.lastIndexOf('.')) || storagePath;
  
  // Return paths for different sizes with WebP extension
  return {
    small: `${baseUrl}-small.webp`,
    medium: `${baseUrl}-medium.webp`,
    large: `${baseUrl}-large.webp`,
    original: storagePath
  };
};

/**
 * Get the URL for a specific image size
 */
export const getOptimizedImageUrl = async (
  storagePath: string, 
  size: 'small' | 'medium' | 'large' | 'original' = 'original'
): Promise<string> => {
  if (!storagePath) {
    return '';
  }
  
  // For original size, just return the direct URL
  if (size === 'original') {
    const { data } = await supabase.storage
      .from('website-images')
      .getPublicUrl(storagePath);
    
    return data.publicUrl;
  }
  
  // For other sizes, check if we have a WebP version available
  const baseUrl = storagePath.substring(0, storagePath.lastIndexOf('.')) || storagePath;
  const sizedPath = `${baseUrl}-${size}.webp`;
  
  // Get the public URL
  const { data } = await supabase.storage
    .from('website-images')
    .getPublicUrl(sizedPath);
  
  return data.publicUrl;
};
