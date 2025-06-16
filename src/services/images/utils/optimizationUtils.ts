
import { supabase } from "@/integrations/supabase/client";

/**
 * Utility functions for optimizing images
 */

/**
 * Resize an image to a specific width while maintaining aspect ratio and convert to WebP
 * Enhanced with content-based cache keys for better caching
 */
export const resizeImage = async (
  file: File, 
  sizeName: string, 
  maxWidth: number, 
  quality: number,
  contentHash?: string,
  isMobile: boolean = false
): Promise<string | null> => {
  try {
    const canvas = document.createElement('canvas');
    const img = new Image();
    
    await new Promise<void>((resolve) => {
      img.onload = () => {
        // Calculate dimensions maintaining aspect ratio
        // const aspectRatio = img.width / img.height;
        // const width = Math.min(img.width, maxWidth);
        // const height = width / aspectRatio;
        
        // canvas.width = width;
        // canvas.height = height;
        // 🎯 MOBILE-SPECIFIC SIZE CALCULATIONS
        const aspectRatio = img.width / img.height;
        
        // Apply mobile-specific width limits for 300KB target
        let targetWidth: number;
        if (isMobile) {
          targetWidth = Math.min(img.width, maxWidth * 0.7); // 30% smaller for mobile
        } else {
          targetWidth = Math.min(img.width, maxWidth);
        }
        
        const targetHeight = targetWidth / aspectRatio;
        
        canvas.width = targetWidth;
        canvas.height = targetHeight;
        
        // Draw resized image to canvas
        // Draw resized image to canvas
        // Enhanced canvas rendering for mobile optimization
        const ctx = canvas.getContext('2d');
        if (ctx) {
          // 🔧 MOBILE OPTIMIZATION: Better compression settings
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = isMobile ? 'medium' : 'high';
          ctx.drawImage(img, 0, 0, targetWidth, targetHeight);
        }
        
        resolve();
      };
      img.src = URL.createObjectURL(file);
    });
    
    // 🎯 MOBILE-SPECIFIC QUALITY REDUCTION
    const mobileQuality = isMobile ? quality * 0.7 : quality; // 30% lower quality for mobile
    
    // Convert canvas to WebP blob with mobile-optimized quality
    const blob = await new Promise<Blob | null>(resolve => {
      canvas.toBlob(resolve, 'image/webp', mobileQuality);
    });
    
    if (!blob) {
      return null;
    }

    // 🚨 ENFORCE 300KB LIMIT FOR MOBILE
    if (isMobile && blob.size > 300 * 1024) { // 300KB limit
      console.log(`🔄 Mobile image too large (${Math.round(blob.size/1024)}KB), re-compressing...`);
      
      // Retry with even more aggressive compression
      const aggressiveBlob = await new Promise<Blob | null>(resolve => {
        canvas.toBlob(resolve, 'image/webp', mobileQuality * 0.6); // 40% more compression
      });
      
      if (aggressiveBlob && aggressiveBlob.size <= 300 * 1024) {
        console.log(`✅ Mobile image compressed to ${Math.round(aggressiveBlob.size/1024)}KB`);
        return await uploadOptimizedImage(aggressiveBlob, file, sizeName, contentHash, true);
      } else {
        // Last resort: resize smaller
        canvas.width = canvas.width * 0.8;
        canvas.height = canvas.height * 0.8;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        }
        
        const finalBlob = await new Promise<Blob | null>(resolve => {
          canvas.toBlob(resolve, 'image/webp', 0.5); // Very aggressive compression
        });
        
        console.log(`🔧 Final mobile compression: ${Math.round((finalBlob?.size || 0)/1024)}KB`);
        return await uploadOptimizedImage(finalBlob, file, sizeName, contentHash, true);
      }
    }
    
    // 🎯 LOG FILE SIZE FOR MONITORING
    console.log(`📊 ${isMobile ? 'Mobile' : 'Desktop'} ${sizeName}: ${Math.round(blob.size/1024)}KB`);
    
    // Create a sanitized path for the optimized version
    
    // Create a sanitized path for the optimized version
    const fileNameWithoutExtension = file.name
      .replace(/\.[^/.]+$/, "") // Remove file extension
      .replace(/[,\s·]+/g, '-')
      .replace(/[^a-zA-Z0-9\-_.]/g, '')
      .replace(/-+/g, '-')
      .replace(/^-+|-+$/g, '');
    
    // Include content hash in the path for better caching if provided
    const hashComponent = contentHash ? `-${contentHash}` : '';
    
    // Use .webp extension for the output file
    const optimizedPath = `optimized/${sizeName}/${fileNameWithoutExtension}${hashComponent}.webp`;
    
    // Upload optimized version with extended cache duration
    const optimizedFile = new File([blob], `${sizeName}-${fileNameWithoutExtension}${hashComponent}.webp`, { type: 'image/webp' });
    
    // const { error, data } = await supabase.storage
    //   .from('website-images')
    //   .upload(optimizedPath, optimizedFile, {
    //     cacheControl: '31536000', // 1 year cache
    //     upsert: true
    //   });
        
    // if (error) {
    //   console.error(`Error uploading ${sizeName} WebP version:`, error);
    //   return null;
    // }
    
    // return optimizedPath;
    // Upload normally for desktop or compliant mobile images
    return await uploadOptimizedImage(blob, file, sizeName, contentHash, isMobile);
  } catch (error) {
    console.error(`Error resizing image to ${sizeName} WebP:`, error);
    return null;
  }
};
/**
 * ✅ HELPER: Upload optimized image with mobile-aware cache settings
 */
const uploadOptimizedImage = async (
  blob: Blob | null, 
  originalFile: File, 
  sizeName: string, 
  contentHash?: string,
  isMobile: boolean = false
): Promise<string | null> => {
  if (!blob) return null;
  
  const fileNameWithoutExtension = originalFile.name
    .replace(/\.[^/.]+$/, "")
    .replace(/[,\s·]+/g, '-')
    .replace(/[^a-zA-Z0-9\-_.]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
  
  const hashComponent = contentHash ? `-${contentHash}` : '';
  const deviceSuffix = isMobile ? '-mobile' : '';
  
  // 🎯 MOBILE-AWARE PATH STRUCTURE
  const optimizedPath = `optimized/${sizeName}/${fileNameWithoutExtension}${deviceSuffix}${hashComponent}.webp`;
  
  const optimizedFile = new File([blob], `${sizeName}-${fileNameWithoutExtension}${deviceSuffix}.webp`, { 
    type: 'image/webp' 
  });
  
  const { error } = await supabase.storage
    .from('website-images')
    .upload(optimizedPath, optimizedFile, {
      cacheControl: isMobile ? '86400' : '31536000', // Shorter cache for mobile (24h vs 1yr)
      upsert: true
    });
      
  if (error) {
    console.error(`Error uploading ${sizeName} version:`, error);
    return null;
  }
  
  console.log(`✅ Uploaded ${sizeName} ${isMobile ? 'mobile' : 'desktop'} version: ${Math.round(blob.size/1024)}KB`);
  return optimizedPath;
};