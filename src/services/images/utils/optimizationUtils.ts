
import { supabase } from "@/integrations/supabase/client";

/**
 * Utility functions for optimizing images
 */

/**
 * Resize an image to a specific width while maintaining aspect ratio
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
    
    const { error, data } = await supabase.storage
      .from('website-images')
      .upload(optimizedPath, optimizedFile, {
        cacheControl: '3600',
        upsert: true
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
