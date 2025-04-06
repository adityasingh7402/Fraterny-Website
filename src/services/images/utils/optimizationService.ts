
import { supabase } from "@/integrations/supabase/client";
import { STORAGE_BUCKET_NAME } from "../constants";
import { WebsiteImage, OptimizationOptions } from "../types";

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
    if (image.sizes && image.sizes[size]) {
      return image.sizes[size] as string;
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
      const sizes = { ...(image.sizes || {}) };
      sizes[size] = result.path;
      
      const { error: updateError } = await supabase
        .from('website_images')
        .update({ sizes })
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

/**
 * Generate placeholder images for progressive loading
 */
export const generatePlaceholders = async (
  imageKey: string
): Promise<{ tiny: string | null; color: string | null } | null> => {
  try {
    // Call the serverless function to generate placeholders
    const response = await fetch('/api/images/placeholders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ key: imageKey }),
    });
    
    if (!response.ok) {
      console.error(`Error generating placeholders for "${imageKey}":`, await response.text());
      return null;
    }
    
    const result = await response.json();
    
    // Update the database with the placeholders
    if (result.tiny || result.color) {
      const { data: image, error: getError } = await supabase
        .from('website_images')
        .select('metadata')
        .eq('key', imageKey)
        .maybeSingle();
        
      if (getError) {
        console.error(`Error getting image "${imageKey}" for placeholder update:`, getError);
        return result;
      }
      
      const metadata = { ...(image?.metadata || {}) };
      metadata.placeholders = {
        tiny: result.tiny,
        color: result.color
      };
      
      const { error: updateError } = await supabase
        .from('website_images')
        .update({ metadata })
        .eq('key', imageKey);
        
      if (updateError) {
        console.error(`Error updating image "${imageKey}" with placeholders:`, updateError);
      }
    }
    
    return result;
  } catch (error) {
    console.error(`Error generating placeholders for "${imageKey}":`, error);
    return null;
  }
};
