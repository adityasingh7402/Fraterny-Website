import { supabase } from "@/integrations/supabase/client";
import { WebsiteImage } from "./types";
import { handleApiError } from "@/utils/errorHandling";
import { invalidateImageCache } from "./fetchService";
import { getImageDimensions, createOptimizedVersions } from "./utils/imageProcessing";

/**
 * Upload a new image to storage and create an entry in the website_images table
 */
export const uploadImage = async (
  file: File,
  key: string,
  description: string,
  alt_text: string,
  category?: string
): Promise<WebsiteImage | null> => {
  try {
    console.log(`Starting upload for image with key: ${key}`);
    
    // Generate a unique filename with proper sanitization
    const timestamp = Date.now();
    const sanitizedFilename = sanitizeFilename(file.name);
    const filename = `${timestamp}-${sanitizedFilename}`;
    const storagePath = filename;
    
    // Get image dimensions if it's an image file
    let dimensions = { width: null, height: null };
    
    if (file.type.startsWith('image/')) {
      try {
        dimensions = await getImageDimensions(file);
        console.log(`Image dimensions: ${dimensions.width}x${dimensions.height}`);
      } catch (err) {
        console.error('Could not get image dimensions:', err);
      }
    }
    
    // Check if an image with this key already exists - if so, remove it
    const { data: existingImage } = await supabase
      .from('website_images')
      .select('*')
      .eq('key', key)
      .maybeSingle();
      
    if (existingImage) {
      console.log(`Found existing image with key: ${key}, will replace it`);
      await removeExistingImage(existingImage);
    }
    
    // Upload the file to storage
    console.log(`Uploading file to storage: ${storagePath}`);
    const { error: uploadError } = await supabase.storage
      .from('website-images')
      .upload(storagePath, file, {
        cacheControl: '3600',
        upsert: true
      });
    
    if (uploadError) {
      console.error('Upload error:', uploadError);
      return handleApiError(uploadError, 'Error uploading image', false) as null;
    }
    
    // Create optimized versions if it's an image
    console.log('Creating optimized versions...');
    const optimizedSizes = await createOptimizedVersions(file, storagePath);
    console.log('Optimized sizes:', optimizedSizes);
    
    // Create an entry in the website_images table
    const { data, error: insertError } = await createImageRecord(
      key, 
      description, 
      storagePath, 
      alt_text, 
      category, 
      dimensions, 
      optimizedSizes
    );
    
    if (insertError) {
      console.error('Insert error:', insertError);
      
      // Clean up the uploaded file if we couldn't create the record
      await cleanupUploadedFiles(storagePath, optimizedSizes);
      
      return handleApiError(insertError, 'Error creating image record', false) as null;
    }
    
    // Invalidate cache for this key to ensure fresh data
    invalidateImageCache(key);
    
    console.log(`Successfully uploaded and created record for image with key: ${key}`);
    return data;
  } catch (error) {
    console.error('Error in upload process:', error);
    return handleApiError(error, 'Error in image upload process', false) as null;
  }
};

/**
 * Sanitize a filename to ensure it works with Supabase storage
 * Remove special characters, spaces, and other problematic characters
 */
const sanitizeFilename = (filename: string): string => {
  // Remove characters that might cause problems in URLs or file paths
  let sanitized = filename
    // Replace spaces, commas and special characters with hyphens
    .replace(/[,\s·]+/g, '-')
    // Remove all other special characters and keep only alphanumerics, hyphens, and dots
    .replace(/[^a-zA-Z0-9\-_.]/g, '')
    // Remove consecutive hyphens
    .replace(/-+/g, '-')
    // Trim hyphens from beginning and end
    .replace(/^-+|-+$/g, '');
  
  // Ensure the filename is not too long (max 100 chars)
  if (sanitized.length > 100) {
    const extension = sanitized.lastIndexOf('.') > 0 
      ? sanitized.substring(sanitized.lastIndexOf('.'))
      : '';
    sanitized = sanitized.substring(0, 100 - extension.length) + extension;
  }
  
  return sanitized;
};

/**
 * Remove an existing image and its optimized versions
 */
const removeExistingImage = async (existingImage: WebsiteImage): Promise<void> => {
  try {
    // Remove the existing file from storage
    if (existingImage.storage_path) {
      await supabase.storage.from('website-images').remove([existingImage.storage_path]);
      
      // Also remove any optimized versions
      if (existingImage.sizes && typeof existingImage.sizes === 'object') {
        const sizes = existingImage.sizes as Record<string, string>;
        await Promise.all(
          Object.values(sizes).map(path => 
            supabase.storage.from('website-images').remove([path])
          )
        );
      }
    }
    
    // Delete the existing record
    await supabase.from('website_images').delete().eq('id', existingImage.id);
  } catch (error) {
    console.error('Error removing existing image:', error);
    // Continue with the upload process even if cleanup fails
  }
};

/**
 * Create a new image record in the database
 */
const createImageRecord = async (
  key: string,
  description: string,
  storagePath: string,
  altText: string,
  category: string | undefined,
  dimensions: { width: number | null, height: number | null },
  optimizedSizes: Record<string, string>
) => {
  return await supabase
    .from('website_images')
    .insert({
      key,
      description,
      storage_path: storagePath,
      alt_text: altText,
      category: category || null,
      width: dimensions.width,
      height: dimensions.height,
      sizes: optimizedSizes
    })
    .select()
    .single();
};

/**
 * Clean up uploaded files if record creation fails
 */
const cleanupUploadedFiles = async (
  storagePath: string,
  optimizedSizes: Record<string, string>
): Promise<void> => {
  try {
    // Clean up the uploaded file if we couldn't create the record
    await supabase.storage.from('website-images').remove([storagePath]);
    
    // Also clean up any optimized versions
    await Promise.all(
      Object.values(optimizedSizes).map(path => 
        supabase.storage.from('website-images').remove([path])
      )
    );
  } catch (error) {
    console.error('Error cleaning up uploaded files:', error);
  }
};
