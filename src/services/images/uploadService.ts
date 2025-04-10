
import { supabase } from "@/integrations/supabase/client";
import { WebsiteImage } from "./types";
import { handleApiError } from "@/utils/errorHandling";
import { invalidateImageCache } from "./fetchService";
import { getImageDimensions } from "./utils/dimensions";
import { createOptimizedVersions } from "./utils/optimizationService";
import { generateTinyPlaceholder, generateColorPlaceholder } from "./utils/placeholderService";
import { sanitizeFilename } from "./utils/fileUtils";
import { removeExistingImage, cleanupUploadedFiles } from "./utils/cleanupUtils";
import { createImageRecord } from "./utils/databaseUtils";
import { generateContentHash } from "./utils/hashUtils";

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
      await removeExistingImage(existingImage as WebsiteImage);
    }
    
    // Generate placeholders for better loading experience (especially on mobile)
    let placeholderData = null;
    let colorPlaceholder = null;
    
    if (file.type.startsWith('image/')) {
      try {
        console.log('Generating image placeholders...');
        placeholderData = await generateTinyPlaceholder(file);
        colorPlaceholder = await generateColorPlaceholder(file);
      } catch (err) {
        console.error('Could not generate placeholders:', err);
      }
    }
    
    // Generate content hash for cache optimization
    const contentHash = await generateContentHash(file);
    console.log(`Generated content hash: ${contentHash} for key: ${key}`);
    
    // Upload the file to storage with enhanced caching headers
    console.log(`Uploading file to storage: ${storagePath}`);
    const { error: uploadError } = await supabase.storage
      .from('website-images')
      .upload(storagePath, file, {
        cacheControl: '31536000', // 1 year cache
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
    
    // Create an entry in the website_images table with enhanced metadata including content hash
    const metadata = {
      placeholders: {
        tiny: placeholderData,
        color: colorPlaceholder
      },
      contentHash: contentHash, // Store content hash in metadata
      lastModified: new Date().toISOString()
    };
    
    const { data, error: insertError } = await supabase
      .from('website_images')
      .insert({
        key,
        description,
        storage_path: storagePath,
        alt_text,
        category,
        width: dimensions.width,
        height: dimensions.height,
        sizes: optimizedSizes,
        metadata // Add metadata including content hash
      })
      .select()
      .single();
    
    if (insertError) {
      console.error('Insert error:', insertError);
      
      // Clean up the uploaded file if we couldn't create the record
      await cleanupUploadedFiles(storagePath, optimizedSizes);
      
      return handleApiError(insertError, 'Error creating image record', false) as null;
    }
    
    // Invalidate cache for this key to ensure fresh data
    invalidateImageCache(key);
    
    console.log(`Successfully uploaded and created record for image with key: ${key}`);
    return data as WebsiteImage;
  } catch (error) {
    console.error('Error in upload process:', error);
    return handleApiError(error, 'Error in image upload process', false) as null;
  }
};
