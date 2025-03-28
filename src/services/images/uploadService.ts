
import { supabase } from "@/integrations/supabase/client";
import { WebsiteImage } from "./types";
import { handleApiError } from "@/utils/errorHandling";

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
    // Generate a unique filename
    const filename = `${Date.now()}-${file.name.replace(/\s+/g, '-')}`;
    // Fix: Don't include the key in the storage path, just use it as a database identifier
    const storagePath = filename;
    
    // Get image dimensions if it's an image file
    let dimensions = { width: null, height: null };
    
    if (file.type.startsWith('image/')) {
      try {
        dimensions = await getImageDimensions(file);
      } catch (err) {
        console.error('Could not get image dimensions:', err);
      }
    }
    
    // Upload the file to storage
    const { error: uploadError } = await supabase.storage
      .from('website-images')
      .upload(storagePath, file);
    
    if (uploadError) {
      return handleApiError(uploadError, 'Error uploading image', false) as null;
    }
    
    // Create optimized versions if it's an image
    const optimizedSizes = await createOptimizedVersions(file, storagePath);
    
    // Get the public URL for the uploaded file
    const { data: { publicUrl } } = supabase.storage
      .from('website-images')
      .getPublicUrl(storagePath);
    
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
      // Clean up the uploaded file if we couldn't create the record
      await supabase.storage.from('website-images').remove([storagePath]);
      
      // Also clean up any optimized versions
      Object.values(optimizedSizes).forEach(async (path) => {
        await supabase.storage.from('website-images').remove([path]);
      });
      
      return handleApiError(insertError, 'Error creating image record', false) as null;
    }
    
    return data;
  } catch (error) {
    return handleApiError(error, 'Error in image upload process', false) as null;
  }
};
