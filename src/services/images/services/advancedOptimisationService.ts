import { supabase } from "@/integrations/supabase/client";
import { urlCache } from "../cacheService";
import { generateContentHash } from "../utils/hashUtils";

interface OptimizedImage {
  path: string;
  format: 'avif' | 'webp' | 'jpeg';
  width: number;
  height: number;
  quality: number;
}

interface OptimizationOptions {
  maxWidth?: number;
  quality?: number;
  formats?: ('avif' | 'webp' | 'jpeg')[];
  preserveAspectRatio?: boolean;
}

/**
 * Advanced image optimization service with multiple format support
 */
export class AdvancedImageOptimizer {
  private static readonly DEFAULT_OPTIONS: OptimizationOptions = {
    maxWidth: 1920,
    quality: 80,
    formats: ['avif', 'webp', 'jpeg'],
    preserveAspectRatio: true
  };

  /**
   * Optimize an image with multiple formats and sizes
   */
  static async optimizeImage(
    file: File,
    options: OptimizationOptions = {}
  ): Promise<OptimizedImage[]> {
    const finalOptions = { ...this.DEFAULT_OPTIONS, ...options };
    const results: OptimizedImage[] = [];
    
    // Generate content hash for cache busting
    const contentHash = await generateContentHash(file);
    
    // Create canvas for image manipulation
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Could not create canvas context');
    
    // Load and resize image
    const img = await this.loadImage(file);
    const dimensions = this.calculateDimensions(img, finalOptions.maxWidth!);
    
    canvas.width = dimensions.width;
    canvas.height = dimensions.height;
    ctx.drawImage(img, 0, 0, dimensions.width, dimensions.height);
    
    // Generate optimized versions for each format
    for (const format of finalOptions.formats!) {
      const optimized = await this.generateOptimizedVersion(
        canvas,
        format,
        finalOptions.quality!,
        contentHash
      );
      
      if (optimized) {
        results.push({
          path: optimized,
          format,
          width: dimensions.width,
          height: dimensions.height,
          quality: finalOptions.quality!
        });
      }
    }
    
    return results;
  }

  /**
   * Load an image into memory
   */
  private static loadImage(file: File): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = URL.createObjectURL(file);
    });
  }

  /**
   * Calculate dimensions while preserving aspect ratio
   */
  private static calculateDimensions(
    img: HTMLImageElement,
    maxWidth: number
  ): { width: number; height: number } {
    const aspectRatio = img.width / img.height;
    const width = Math.min(img.width, maxWidth);
    const height = width / aspectRatio;
    return { width, height };
  }

  /**
   * Generate optimized version in specific format
   */
  private static async generateOptimizedVersion(
    canvas: HTMLCanvasElement,
    format: 'avif' | 'webp' | 'jpeg',
    quality: number,
    contentHash: string
  ): Promise<string | null> {
    try {
      // Convert canvas to blob with specified format and quality
      const blob = await new Promise<Blob | null>((resolve) => {
        const mimeType = `image/${format}`;
        canvas.toBlob(resolve, mimeType, quality / 100);
      });

      if (!blob) return null;

      // Generate unique filename with format and hash
      const timestamp = Date.now();
      const filename = `optimized/${format}/${timestamp}-${contentHash}.${format}`;

      // Upload to Supabase storage
      const { error } = await supabase.storage
        .from('website-images')
        .upload(filename, blob, {
          cacheControl: '31536000', // 1 year cache
          upsert: true
        });

      if (error) {
        console.error(`Error uploading ${format} version:`, error);
        return null;
      }

      return filename;
    } catch (error) {
      console.error(`Error generating ${format} version:`, error);
      return null;
    }
  }

  /**
   * Get the best format for the current browser
   */
  static getBestFormat(): 'avif' | 'webp' | 'jpeg' {
    // Check AVIF support
    const avifSupported = document.createElement('canvas')
      .toDataURL('image/avif')
      .indexOf('data:image/avif') === 0;

    // Check WebP support
    const webpSupported = document.createElement('canvas')
      .toDataURL('image/webp')
      .indexOf('data:image/webp') === 0;

    return avifSupported ? 'avif' : webpSupported ? 'webp' : 'jpeg';
  }

  /**
   * Get optimized image URL with format detection
   */
  static async getOptimizedUrl(
    key: string,
    options: OptimizationOptions = {}
  ): Promise<string> {
    const cacheKey = `optimized:${key}:${JSON.stringify(options)}`;
    const cachedUrl = urlCache.get(cacheKey);
    
    if (cachedUrl) {
      return cachedUrl;
    }

    try {
      // Get image record from Supabase
      const { data, error } = await supabase
        .from('website_images')
        .select('storage_path, metadata')
        .eq('key', key)
        .maybeSingle();

      if (error || !data) {
        throw new Error('Image not found');
      }

      // Get the best format for current browser
      const bestFormat = this.getBestFormat();
      
      // Construct URL with format parameter
      const { data: urlData } = supabase.storage
        .from('website-images')
        .getPublicUrl(data.storage_path);

      if (!urlData || !urlData.publicUrl) {
        throw new Error('Could not get public URL');
      }

      // Add format parameter to URL
      const optimizedUrl = `${urlData.publicUrl}?format=${bestFormat}&width=${options.maxWidth}&quality=${options.quality}`;
      
      // Cache the URL
      urlCache.set(cacheKey, optimizedUrl);
      
      return optimizedUrl;
    } catch (error) {
      console.error('Error getting optimized URL:', error);
      return '/placeholder.svg';
    }
  }
} 
