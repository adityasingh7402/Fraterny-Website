
/**
 * Service for creating optimized versions of images
 */
import { supabase } from "@/integrations/supabase/client";
import { STORAGE_BUCKET_NAME } from "../constants";
import { OptimizationOptions } from "../types";
import { resizeImage } from "./optimizationUtils";

/**
 * Create optimized versions of an image for different screen sizes
 */
export const createOptimizedVersions = async (
  file: File,
  originalPath: string
): Promise<Record<string, string>> => {
  if (!file.type.startsWith('image/')) {
    console.log('Not an image file, skipping optimization');
    return {};
  }
  
  try {
    const sizes = {
      small: 320,
      medium: 640,
      large: 1280
    };
    
    const results: Record<string, string> = {};
    
    // Process each size in parallel
    const operations = Object.entries(sizes).map(async ([size, width]) => {
      try {
        const pathInfo = originalPath.split('.');
        const extension = pathInfo.pop() || 'webp';
        const basePath = pathInfo.join('.');
        const newPath = `${basePath}_${size}.webp`;
        
        // Create optimized version
        const blob = await resizeImage(file, width, undefined, 0.85, 'webp');
        
        if (!blob) {
          console.warn(`Failed to create ${size} version`);
          return null;
        }
        
        // Convert Blob to File with appropriate name
        const optimizedFile = new File([blob], `${file.name}_${size}.webp`, {
          type: 'image/webp'
        });
        
        // Upload optimized version
        const { data, error } = await supabase.storage
          .from(STORAGE_BUCKET_NAME)
          .upload(newPath, optimizedFile, {
            cacheControl: '31536000',
            upsert: true
          });
          
        if (error) {
          console.error(`Error uploading ${size} version:`, error);
          return null;
        }
        
        // Store the path
        results[size] = newPath;
        return { size, path: newPath };
      } catch (err) {
        console.error(`Error creating ${size} version:`, err);
        return null;
      }
    });
    
    // Wait for all operations to complete
    await Promise.all(operations);
    
    console.log('Optimized versions created:', results);
    return results;
  } catch (error) {
    console.error('Error creating optimized versions:', error);
    return {};
  }
};

/**
 * Generate a thumbnail or resized version of an image
 */
export const generateImageVariant = async (
  imageKey: string,
  size: 'small' | 'medium' | 'large',
  options: OptimizationOptions = {}
): Promise<string | null> => {
  try {
    // Get the original image record
    const { data: image, error } = await supabase
      .from('website_images')
      .select('storage_path, sizes')
      .eq('key', imageKey)
      .maybeSingle();
      
    if (error || !image) {
      console.error(`Error getting image "${imageKey}" for optimization:`, error || 'Not found');
      return null;
    }
    
    // Check if we already have this size
    const sizes = image.sizes as Record<string, string> || {};
    if (sizes[size]) {
      return sizes[size];
    }
    
    // Set dimensions based on size
    let width, height;
    switch (size) {
      case 'small':
        width = options.width || 320;
        break;
      case 'medium':
        width = options.width || 640;
        break;
      case 'large':
        width = options.width || 1280;
        break;
    }
    
    // Generate the variant through a serverless function
    const response = await fetch('/api/images/resize', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        key: imageKey,
        width,
        height: options.height,
        quality: options.quality || 80,
        format: options.format || 'webp',
      }),
    });
    
    if (!response.ok) {
      console.error(`Error generating image variant for "${imageKey}":`, await response.text());
      return null;
    }
    
    const result = await response.json();
    
    // Update the database with the new size variant
    if (result.path) {
      const updatedSizes = { ...sizes };
      updatedSizes[size] = result.path;
      
      const { error: updateError } = await supabase
        .from('website_images')
        .update({ sizes: updatedSizes })
        .eq('key', imageKey);
        
      if (updateError) {
        console.error(`Error updating image "${imageKey}" with new size variant:`, updateError);
      }
      
      return result.path;
    }
    
    return null;
  } catch (error) {
    console.error(`Error generating image variant for "${imageKey}":`, error);
    return null;
  }
};
