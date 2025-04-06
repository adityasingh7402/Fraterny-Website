
/**
 * Service for uploading images to Supabase storage and database
 */
import { supabase } from "@/integrations/supabase/client";
import { WebsiteImage, ImageMetadata } from "./types";
import { getImageDimensions } from "./utils/dimensions";
import { sanitizeFilename } from "./utils/fileUtils";
import { generateContentHash } from "./utils/hashUtils";
import { STORAGE_BUCKET_NAME } from "./constants";
import { createOptimizedVersions } from "./utils/optimizationService";
import { generateTinyPlaceholder, generateColorPlaceholder } from "./utils/placeholderService";
import { removeExistingImage, cleanupUploadedFiles } from "./utils/cleanupUtils";
import { constructStoragePath, normalizeStoragePath } from "@/utils/pathUtils";

/**
 * Upload an image to storage and database
 */
export const uploadImage = async (
  file: File,
  key: string,
  description: string,
  alt_text: string,
  category?: string
): Promise<WebsiteImage | null> => {
  try {
    // Validate inputs
    if (!file || !key || !description) {
      console.error('Missing required parameters for uploadImage');
      return null;
    }
    
    // Normalize the key - remove leading/trailing spaces, ensure no leading slash
    const normalizedKey = key.trim().replace(/^\/+/, '');
    
    // Check if image with this key already exists
    const { data: existingImage } = await supabase
      .from('website_images')
      .select('*')
      .eq('key', normalizedKey)
      .maybeSingle();
      
    // If it exists, remove the existing image files first
    if (existingImage) {
      console.log('Replacing existing image:', existingImage);
      await removeExistingImage(existingImage as WebsiteImage);
    }
    
    // Get file extension and sanitize filename
    const fileExt = file.name.split('.').pop()?.toLowerCase() || 'jpg';
    const sanitizedFilename = sanitizeFilename(file.name);
    const timestamp = Date.now();
    
    // Create a storage path that includes the key for organization
    const storagePath = normalizeStoragePath(`${normalizedKey}.${fileExt}`);
    console.log('Storage path:', storagePath);
    
    // Upload the original file
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(STORAGE_BUCKET_NAME)
      .upload(storagePath, file, {
        cacheControl: '31536000', // 1 year - we use content hashes for cache busting
        upsert: true
      });
      
    if (uploadError) {
      console.error('Error uploading image:', uploadError);
      return null;
    }
    
    console.log('Upload successful:', uploadData.path);
    
    // Create optimized versions
    const sizeVariants = await createOptimizedVersions(file, storagePath);
    
    // Get image dimensions
    let width = null;
    let height = null;
    try {
      const dimensions = await getImageDimensions(file);
      width = dimensions.width;
      height = dimensions.height;
    } catch (err) {
      console.warn('Failed to get image dimensions:', err);
    }
    
    // Generate content hash for cache busting
    const contentHash = await generateContentHash(file);
    
    // Generate placeholders
    const tinyPlaceholder = await generateTinyPlaceholder(file);
    const colorPlaceholder = await generateColorPlaceholder(file);
    
    // Prepare metadata
    const metadata: Record<string, any> = {
      contentHash,
      lastModified: new Date().toISOString(),
      placeholders: {
        tiny: tinyPlaceholder,
        color: colorPlaceholder
      }
    };
    
    // Prepare database entry
    const imageData = {
      key: normalizedKey,
      description,
      alt_text,
      category,
      storage_path: storagePath,
      width,
      height,
      sizes: sizeVariants,
      metadata
    };
    
    // Insert or update database entry
    let result;
    if (existingImage) {
      // Update existing record
      const { data, error } = await supabase
        .from('website_images')
        .update({
          ...imageData,
          updated_at: new Date().toISOString()
        })
        .eq('id', existingImage.id)
        .select()
        .single();
        
      if (error) {
        console.error('Error updating image record:', error);
        await cleanupUploadedFiles(storagePath, sizeVariants);
        return null;
      }
      
      result = data;
    } else {
      // Insert new record
      const { data, error } = await supabase
        .from('website_images')
        .insert([imageData])
        .select()
        .single();
        
      if (error) {
        console.error('Error inserting image record:', error);
        await cleanupUploadedFiles(storagePath, sizeVariants);
        return null;
      }
      
      result = data;
    }
    
    // Get the public URL
    const { data: publicUrlData } = await supabase.storage
      .from(STORAGE_BUCKET_NAME)
      .getPublicUrl(storagePath);
      
    // Add URL to the result
    const finalResult: WebsiteImage = {
      ...(result as WebsiteImage),
      url: publicUrlData?.publicUrl || null
    };
    
    return finalResult;
  } catch (error) {
    console.error('Unexpected error in uploadImage:', error);
    return null;
  }
};

/**
 * Delete an image by key
 */
export const deleteImage = async (key: string): Promise<boolean> => {
  try {
    // Get the image record
    const { data: image, error: getError } = await supabase
      .from('website_images')
      .select('*')
      .eq('key', key.trim())
      .maybeSingle();
      
    if (getError || !image) {
      console.error(`Error getting image "${key}" for deletion:`, getError || 'Not found');
      return false;
    }
    
    // Remove files from storage
    await removeExistingImage(image as WebsiteImage);
    
    // Delete database record
    const { error: deleteError } = await supabase
      .from('website_images')
      .delete()
      .eq('key', key.trim());
      
    if (deleteError) {
      console.error(`Error deleting image record for "${key}":`, deleteError);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error(`Unexpected error deleting image "${key}":`, error);
    return false;
  }
};
