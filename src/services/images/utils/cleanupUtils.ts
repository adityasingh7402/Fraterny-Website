
/**
 * Utility functions for cleaning up uploaded files
 */
import { supabase } from "@/integrations/supabase/client";
import { STORAGE_BUCKET_NAME } from "../constants";
import { WebsiteImage } from "../types";

/**
 * Remove an existing image from storage and update database
 */
export const removeExistingImage = async (image: WebsiteImage): Promise<boolean> => {
  try {
    // Prepare paths to remove
    const pathsToRemove = [image.storage_path];
    
    // Add any size variants
    if (image.sizes && typeof image.sizes === 'object') {
      Object.values(image.sizes).forEach(path => {
        if (typeof path === 'string' && path) {
          pathsToRemove.push(path);
        }
      });
    }
    
    // Remove files from storage
    const { error } = await supabase.storage
      .from(STORAGE_BUCKET_NAME)
      .remove(pathsToRemove);
      
    if (error) {
      console.error(`Error removing files for image "${image.key}":`, error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error(`Error removing existing image "${image.key}":`, error);
    return false;
  }
};

/**
 * Clean up uploaded files if database insertion fails
 */
export const cleanupUploadedFiles = async (
  mainPath: string,
  sizeVariants: Record<string, string> = {}
): Promise<void> => {
  try {
    // Collect all paths to remove
    const pathsToRemove = [mainPath];
    
    // Add size variants
    Object.values(sizeVariants).forEach(path => {
      if (path) {
        pathsToRemove.push(path);
      }
    });
    
    // Remove all files
    const { error } = await supabase.storage
      .from(STORAGE_BUCKET_NAME)
      .remove(pathsToRemove);
      
    if (error) {
      console.error('Error cleaning up uploaded files:', error);
    }
  } catch (error) {
    console.error('Error in cleanup process:', error);
  }
};
