
import { supabase } from "@/integrations/supabase/client";
import { STORAGE_BUCKET_NAME } from "../constants";

/**
 * Clean up orphaned images from storage that don't have database entries
 */
export const cleanUpOrphanedImages = async (): Promise<{
  checked: number;
  removed: number;
  errors: number;
}> => {
  let checked = 0;
  let removed = 0;
  let errors = 0;
  
  try {
    // Get all files from storage
    const { data: files, error: storageError } = await supabase.storage
      .from(STORAGE_BUCKET_NAME)
      .list();
      
    if (storageError) {
      console.error('Error listing files from storage:', storageError);
      return { checked: 0, removed: 0, errors: 1 };
    }
    
    if (!files || files.length === 0) {
      return { checked: 0, removed: 0, errors: 0 };
    }
    
    checked = files.length;
    
    // Process files in batches to avoid overwhelming the database
    const batchSize = 50;
    for (let i = 0; i < files.length; i += batchSize) {
      const batch = files.slice(i, i + batchSize);
      
      for (const file of batch) {
        try {
          // Check if this file has a database entry
          const { data, error } = await supabase
            .from('website_images')
            .select('id')
            .or(`storage_path.eq.${file.name},key.eq.${file.name}`)
            .maybeSingle();
            
          if (error) {
            console.error(`Error checking database for file "${file.name}":`, error);
            errors++;
            continue;
          }
          
          // If no matching record, delete the file
          if (!data) {
            const { error: deleteError } = await supabase.storage
              .from(STORAGE_BUCKET_NAME)
              .remove([file.name]);
              
            if (deleteError) {
              console.error(`Error deleting orphaned file "${file.name}":`, deleteError);
              errors++;
            } else {
              removed++;
              console.log(`Removed orphaned file: ${file.name}`);
            }
          }
        } catch (itemError) {
          console.error(`Error processing file "${file.name}":`, itemError);
          errors++;
        }
      }
    }
    
    return { checked, removed, errors };
  } catch (error) {
    console.error('Error in cleanUpOrphanedImages:', error);
    return { checked, removed, errors: errors + 1 };
  }
};

/**
 * Clean up expired cache entries
 */
export const cleanupExpiredCache = (): number => {
  try {
    let removedCount = 0;
    const now = Date.now();
    
    // Clean localStorage cache
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('img_cache:')) {
        try {
          const item = localStorage.getItem(key);
          if (item) {
            const parsed = JSON.parse(item);
            if (parsed.expires && parsed.expires < now) {
              localStorage.removeItem(key);
              removedCount++;
            }
          }
        } catch (e) {
          // Ignore parsing errors, just remove the item
          localStorage.removeItem(key);
          removedCount++;
        }
      }
    }
    
    return removedCount;
  } catch (error) {
    console.error('Error cleaning expired cache entries:', error);
    return 0;
  }
};
