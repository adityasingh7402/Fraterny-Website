
import { supabase } from "@/integrations/supabase/client";
import { WebsiteImage } from "./types";
import { handleApiError } from "@/utils/errorHandling";
import { invalidateImageCache } from "./fetchService";

/**
 * Get image dimensions from a File
 */
const getImageDimensions = (file: File): Promise<{width: number, height: number}> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(img.src); // Clean up
      resolve({ width: img.width, height: img.height });
    };
    img.src = URL.createObjectURL(file);
  });
};

/**
 * Create optimized versions of an image
 */
const createOptimizedVersions = async (
  file: File,
  originalPath: string
): Promise<Record<string, string>> => {
  if (!file.type.startsWith('image/')) {
    return {};
  }

  try {
    const sizes: Record<string, string> = {};
    const sizeConfigs = [
      { name: 'small', maxWidth: 400 },
      { name: 'medium', maxWidth: 800 },
      { name: 'large', maxWidth: 1200 }
    ];

    // For images under threshold size, create optimized versions
    // In a production setup, you would use a proper image processing library
    // This is a simplified example - in a real app, use a proper image service
    if (file.size < 5 * 1024 * 1024) { // Only process files under 5MB
      for (const config of sizeConfigs) {
        const canvas = document.createElement('canvas');
        const img = new Image();
        
        await new Promise<void>((resolve) => {
          img.onload = () => {
            // Calculate dimensions maintaining aspect ratio
            const aspectRatio = img.width / img.height;
            const width = Math.min(img.width, config.maxWidth);
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
        
        // Convert canvas to blob with quality adjustment based on size
        const quality = config.name === 'small' ? 0.7 : 0.85;
        const blob = await new Promise<Blob | null>(resolve => {
          canvas.toBlob(resolve, 'image/jpeg', quality);
        });
        
        if (blob) {
          // Upload optimized version
          const optimizedFile = new File([blob], `${config.name}-${file.name}`, { type: 'image/jpeg' });
          const optimizedPath = `optimized/${config.name}/${file.name.replace(/\s+/g, '-')}`;
          
          const { error } = await supabase.storage
            .from('website-images')
            .upload(optimizedPath, optimizedFile);
            
          if (!error) {
            sizes[config.name] = optimizedPath;
          }
        }
      }
    }
    
    return sizes;
  } catch (error) {
    console.error('Error creating optimized versions:', error);
    return {};
  }
};

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
    
    // Generate a unique filename
    const timestamp = Date.now();
    const filename = `${timestamp}-${file.name.replace(/\s+/g, '-')}`;
    // Fix: Don't include the key in the storage path, just use it as a database identifier
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
    
    // Get the public URL for the uploaded file
    const { data: { publicUrl } } = supabase.storage
      .from('website-images')
      .getPublicUrl(storagePath);
    
    console.log(`Public URL: ${publicUrl}`);
    
    // Create an entry in the website_images table
    const { data, error: insertError } = await supabase
      .from('website_images')
      .insert({
        key,
        description,
        storage_path: storagePath,
        alt_text,
        category: category || null,
        width: dimensions.width,
        height: dimensions.height,
        sizes: optimizedSizes
      })
      .select()
      .single();
    
    if (insertError) {
      console.error('Insert error:', insertError);
      
      // Clean up the uploaded file if we couldn't create the record
      await supabase.storage.from('website-images').remove([storagePath]);
      
      // Also clean up any optimized versions
      Object.values(optimizedSizes).forEach(async (path) => {
        await supabase.storage.from('website-images').remove([path]);
      });
      
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
