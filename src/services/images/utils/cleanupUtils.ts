
import { supabase } from "@/integrations/supabase/client";
import { WebsiteImage } from "../types";

/**
 * Remove an existing image and its optimized versions
 */
export const removeExistingImage = async (existingImage: WebsiteImage): Promise<void> => {
  try {
    console.log(`🗑️ Removing existing image: ${existingImage.key} (ID: ${existingImage.id})`);
    
    // Check current authentication status and permissions
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    console.log('🔐 Current user:', user ? { id: user.id, email: "aditya@fraterny.com", role: "service_role" } : 'No user');
    
    if (authError) {
      console.error('🔴 Auth error:', authError);
    }
    
    // First, collect all file paths to remove
    const filesToRemove: string[] = [];
    
    if (existingImage.storage_path) {
      filesToRemove.push(existingImage.storage_path);
      console.log(`📁 Main file to remove: ${existingImage.storage_path}`);
    }
    
    // Also remove any optimized versions
    if (existingImage.sizes && typeof existingImage.sizes === 'object') {
      const sizes = existingImage.sizes as Record<string, string>;
      const optimizedPaths = Object.values(sizes).filter(path => path && typeof path === 'string');
      filesToRemove.push(...optimizedPaths);
      console.log(`🖼️ Optimized files to remove: ${optimizedPaths.length} files`);
    }
    
    // Remove all files from storage in batch
    if (filesToRemove.length > 0) {
      console.log(`🔄 Removing ${filesToRemove.length} files from storage...`);
      console.log('📋 Files to remove:', filesToRemove);
      
      const { data: removedFiles, error: storageError } = await supabase.storage
        .from('website-images')
        .remove(filesToRemove);
      
      if (storageError) {
        console.error('❌ Storage removal error:', storageError);
        console.error('Files that failed to remove:', filesToRemove);
      } else {
        console.log(`✅ Storage removal response:`, { removedFiles, removedCount: removedFiles?.length || 0 });
        
        // Check if any files were actually removed
        if (!removedFiles || removedFiles.length === 0) {
          console.warn('⚠️ No files were removed from storage. Files may not exist or paths may be incorrect.');
          
          // Check individual files by trying to download them (this verifies existence)
          const existingFiles: string[] = [];
          const missingFiles: string[] = [];
          
          for (const filePath of filesToRemove) {
            try {
              const { data } = await supabase.storage
                .from('website-images')
                .download(filePath);
              
              if (data) {
                existingFiles.push(filePath);
                console.log(`✅ File exists: ${filePath}`);
              } else {
                missingFiles.push(filePath);
              }
            } catch (error) {
              missingFiles.push(filePath);
              console.log(`❌ File missing: ${filePath}`);
            }
          }
          
          console.log(`📊 Summary: ${existingFiles.length} exist, ${missingFiles.length} missing`);
          
          // Try to remove existing files one by one
          if (existingFiles.length > 0) {
            console.log('🔄 Attempting to remove existing files individually...');
            let individualRemovalCount = 0;
            
            for (const filePath of existingFiles) {
              try {
                console.log(`🔄 Attempting to remove: ${filePath}`);
                
                const { data: removeData, error: individualError } = await supabase.storage
                  .from('website-images')
                  .remove([filePath]);
                
                console.log(`📊 Remove response for ${filePath}:`, { data: removeData, error: individualError });
                
                if (!individualError) {
                  // Verify the file was actually deleted by trying to download it
                  try {
                    const { data: verifyData, error: verifyError } = await supabase.storage
                      .from('website-images')
                      .download(filePath);
                    
                    if (verifyError || !verifyData) {
                      individualRemovalCount++;
                      console.log(`✅ VERIFIED deleted: ${filePath}`);
                    } else {
                      console.error(`❌ FILE STILL EXISTS after "successful" removal: ${filePath}`);
                      console.error('This indicates a permissions or RLS policy issue!');
                    }
                  } catch (verifyErr) {
                    // If download fails, file is likely deleted
                    individualRemovalCount++;
                    console.log(`✅ VERIFIED deleted (download failed as expected): ${filePath}`);
                  }
                } else {
                  console.error(`❌ Failed to remove: ${filePath}`, individualError);
                }
              } catch (error) {
                console.error(`❌ Error removing: ${filePath}`, error);
              }
            }
            
            console.log(`🎯 Individual removal completed: ${individualRemovalCount}/${existingFiles.length} files removed`);
          }
        }
      }
    }
    
    // Delete the existing record from database
    console.log(`🗄️ Removing database record for image ID: ${existingImage.id}`);
    const { error: deleteError } = await supabase
      .from('website_images')
      .delete()
      .eq('id', existingImage.id);
    
    if (deleteError) {
      console.error('❌ Database deletion error:', deleteError);
      throw new Error(`Failed to delete image record: ${deleteError.message}`);
    } else {
      console.log(`✅ Successfully removed database record for image: ${existingImage.key}`);
    }
    
  } catch (error) {
    console.error('❌ Error removing existing image:', error);
    // Re-throw the error so the calling function knows cleanup failed
    throw error;
  }
};

/**
 * Clean up uploaded files if record creation fails
 */
export const cleanupUploadedFiles = async (
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
