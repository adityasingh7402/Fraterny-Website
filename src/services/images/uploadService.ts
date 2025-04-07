import { supabase } from "@/integrations/supabase/client";
import { WebsiteImage } from "./types";
import { handleApiError } from "@/utils/errorHandling";
import { invalidateImageCache } from "./fetchService";
import { getImageDimensions } from "./utils/dimensions";
import { generateTinyPlaceholder, generateColorPlaceholder } from "./utils/placeholderService";
import { sanitizeFilename } from "./utils/fileUtils";
import { removeExistingImage, cleanupUploadedFiles } from "./utils/cleanupUtils";
import { createImageRecord } from "./utils/databaseUtils";
import { generateContentHash } from "./utils/hashUtils";
import { AdvancedImageOptimizer } from "./services/advancedOptimizationService";

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
    
    // Generate placeholders for better loading experience
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
    
    // Optimize the image with multiple formats
    console.log('Optimizing image with multiple formats...');
    const optimizedVersions = await AdvancedImageOptimizer.optimizeImage(file, {
      maxWidth: 1920,
      quality: 80,
      formats: ['avif', 'webp', 'jpeg'],
      preserveAspectRatio: true
    });
    
    // Create optimized sizes mapping
    const optimizedSizes: Record<string, string> = {};
    optimizedVersions.forEach(version => {
      optimizedSizes[version.format] = version.path;
    });
    
    // Create metadata with enhanced information
    const metadata = {
      placeholders: {
        tiny: placeholderData,
        color: colorPlaceholder
      },
      contentHash,
      lastModified: new Date().toISOString(),
      optimizedVersions: optimizedVersions.map(v => ({
        format: v.format,
        width: v.width,
        height: v.height,
        quality: v.quality
      }))
    };
    
    // Create an entry in the website_images table using the new interface
    const { data, error: insertError } = await createImageRecord({
      key,
      description,
      storagePath,
      altText: alt_text,
      category,
      dimensions,
      optimizedSizes,
      metadata
    });
    
    if (insertError) {
      console.error('Insert error:', insertError);
      await cleanupUploadedFiles(storagePath, optimizedSizes);
      return handleApiError(insertError, 'Error creating image record', false) as null;
    }
    
    invalidateImageCache(key);
    console.log(`Successfully uploaded and created record for image with key: ${key}`);
    return data as WebsiteImage;
  } catch (error) {
    console.error('Unexpected error in uploadImage:', error);
    return handleApiError(error, 'Unexpected error during image upload', false) as null;
  }
};
