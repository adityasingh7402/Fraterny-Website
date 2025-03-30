
import { supabase } from "@/integrations/supabase/client";

/**
 * Utility functions for optimizing images
 */

/**
 * Resize an image to a specific width while maintaining aspect ratio and convert to WebP
 * Enhanced with extended cache duration for better performance
 */
export const resizeImage = async (
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
    
    // Convert canvas to WebP blob with specified quality
    const blob = await new Promise<Blob | null>(resolve => {
      // Use WebP format with specified quality
      canvas.toBlob(resolve, 'image/webp', quality);
    });
    
    if (!blob) {
      return null;
    }
    
    // Create a sanitized path for the optimized version
    const fileNameWithoutExtension = file.name
      .replace(/\.[^/.]+$/, "") // Remove file extension
      .replace(/[,\s·]+/g, '-')
      .replace(/[^a-zA-Z0-9\-_.]/g, '')
      .replace(/-+/g, '-')
      .replace(/^-+|-+$/g, '');
      
    // Use .webp extension for the output file
    const optimizedPath = `optimized/${sizeName}/${fileNameWithoutExtension}.webp`;
    
    // Upload optimized version with extended cache duration
    const optimizedFile = new File([blob], `${sizeName}-${fileNameWithoutExtension}.webp`, { type: 'image/webp' });
    
    const { error, data } = await supabase.storage
      .from('website-images')
      .upload(optimizedPath, optimizedFile, {
        cacheControl: '31536000', // 1 year cache (up from 3600 seconds)
        upsert: true
      });
        
    if (error) {
      console.error(`Error uploading ${sizeName} WebP version:`, error);
      return null;
    }
    
    return optimizedPath;
  } catch (error) {
    console.error(`Error resizing image to ${sizeName} WebP:`, error);
    return null;
  }
};
