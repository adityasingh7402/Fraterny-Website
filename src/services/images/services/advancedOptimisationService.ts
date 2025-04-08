import { supabase } from "@/integrations/supabase/client";
import { urlCache } from "../utils/urlCache";
import { generateContentHash } from "../utils/hashUtils";
import { CACHE_CONFIG } from '../constants';

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
  stage?: 'tiny' | 'low' | 'medium' | 'full';
  signal?: AbortSignal;
}

interface BrowserCapabilities {
  webp: boolean;
  avif: boolean;
  highDensity: boolean;
}

/**
 * Advanced image optimization service with multiple format support
 */
export class AdvancedImageOptimizer {
  private static instance: AdvancedImageOptimizer;
  private browserCapabilities: BrowserCapabilities | null = null;
  private readonly CACHE_KEY_PREFIX = 'optimized_image_';
  private static readonly DEFAULT_OPTIONS: OptimizationOptions = {
    maxWidth: 1920,
    quality: 80,
    formats: ['webp', 'jpeg'],
    preserveAspectRatio: true
  };
  private readonly MAX_CACHE_SIZE = 50 * 1024 * 1024; // 50MB
  private readonly MAX_ITEMS = 100;
  private memoryPressureListener: (() => void) | null = null;

  private constructor() {
    this.detectBrowserCapabilities();
    this.setupMemoryPressureHandling();
  }

  static getInstance(): AdvancedImageOptimizer {
    if (!AdvancedImageOptimizer.instance) {
      AdvancedImageOptimizer.instance = new AdvancedImageOptimizer();
    }
    return AdvancedImageOptimizer.instance;
  }

  private detectBrowserCapabilities(): void {
    if (typeof window === 'undefined') return;

    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    
    if (!context) {
      this.browserCapabilities = {
        webp: false,
        avif: false,
        highDensity: window.devicePixelRatio > 1
      };
      return;
    }

    this.browserCapabilities = {
      webp: canvas.toDataURL('image/webp').startsWith('data:image/webp'),
      avif: false, // AVIF detection is more complex
      highDensity: window.devicePixelRatio > 1
    };
  }

  private getOptimizedFormat(url: string): string {
    if (!this.browserCapabilities) return 'jpg';

    const extension = url.split('.').pop()?.toLowerCase();
    
    if (this.browserCapabilities.avif && extension !== 'gif') {
      return 'avif';
    }
    
    if (this.browserCapabilities.webp && extension !== 'gif') {
      return 'webp';
    }
    
    return extension || 'jpg';
  }

  private generateCacheKey(url: string, options: OptimizationOptions): string {
    const params = new URLSearchParams();
    
    if (options.maxWidth) params.append('w', options.maxWidth.toString());
    if (options.quality) params.append('q', options.quality.toString());
    if (options.preserveAspectRatio) params.append('ar', '1');
    if (options.stage) params.append('s', options.stage);
    
    return `${this.CACHE_KEY_PREFIX}${url}_${params.toString()}`;
  }

  /**
   * Optimize an image with multiple formats and sizes
   */
  static async optimizeImage(
    file: File,
    options: OptimizationOptions = {}
  ): Promise<OptimizedImage[]> {
    const finalOptions = { ...this.DEFAULT_OPTIONS, ...options };
    const results: OptimizedImage[] = [];
    let img: HTMLImageElement | null = null;
    const canvas = document.createElement('canvas');
    
    try {
      // Generate content hash for cache busting
      const contentHash = await generateContentHash(file);
      
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Could not create canvas context');
      
      // Load and resize image
      img = await this.loadImage(file);
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
    } finally {
      // Clean up resources
      if (img) {
        URL.revokeObjectURL((img as any).__objectUrl);
      }
      canvas.remove();
    }
  }

  /**
   * Load an image into memory
   */
  private static loadImage(file: File): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const objectUrl = URL.createObjectURL(file);
      img.onload = () => resolve(img);
      img.onerror = (err) => {
        URL.revokeObjectURL(objectUrl);
        reject(err);
      };
      img.src = objectUrl;
      // Store the object URL for cleanup
      (img as any).__objectUrl = objectUrl;
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
    try {
      // Check AVIF support
      const avifSupported = document.createElement('canvas')
        .toDataURL('image/avif')
        .indexOf('data:image/avif') === 0;

      // Check WebP support
      const webpSupported = document.createElement('canvas')
        .toDataURL('image/webp')
        .indexOf('data:image/webp') === 0;

      return avifSupported ? 'avif' : webpSupported ? 'webp' : 'jpeg';
    } catch (error) {
      console.warn('Format detection failed, falling back to JPEG');
      return 'jpeg';
    }
  }

  private getCacheSize(): number {
    return Object.keys(sessionStorage)
      .filter(key => key.startsWith(this.CACHE_KEY_PREFIX))
      .reduce((total, key) => {
        const item = sessionStorage.getItem(key);
        return total + (item ? item.length * 2 : 0); // Approximate size in bytes
      }, 0);
  }

  private evictOldestItems(): void {
    const items = Object.keys(sessionStorage)
      .filter(key => key.startsWith(this.CACHE_KEY_PREFIX))
      .map(key => ({
        key,
        timestamp: JSON.parse(sessionStorage.getItem(key) || '{}').timestamp || 0
      }))
      .sort((a, b) => a.timestamp - b.timestamp);

    while (items.length > this.MAX_ITEMS || this.getCacheSize() > this.MAX_CACHE_SIZE) {
      const item = items.shift();
      if (item) {
        sessionStorage.removeItem(item.key);
      }
    }
  }

  /**
   * Get optimized image URL with format detection
   */
  async getOptimizedUrl(url: string, options: OptimizationOptions = {}): Promise<string> {
    try {
      const mergedOptions = { ...AdvancedImageOptimizer.DEFAULT_OPTIONS, ...options };
      const cacheKey = this.generateCacheKey(url, mergedOptions);
      const cachedUrl = sessionStorage.getItem(cacheKey);
      
      if (cachedUrl) {
        const { timestamp, url: cachedImageUrl } = JSON.parse(cachedUrl);
        if (Date.now() - timestamp < CACHE_CONFIG.URL_TTL) {
          return cachedImageUrl;
        }
      }

      const format = this.getOptimizedFormat(url);
      const optimizedUrl = await this.optimizeImage(url, mergedOptions, format);

      // Check cache size before adding new item
      if (this.getCacheSize() + (optimizedUrl.length * 2) > this.MAX_CACHE_SIZE) {
        this.evictOldestItems();
      }

      sessionStorage.setItem(cacheKey, JSON.stringify({
        timestamp: Date.now(),
        url: optimizedUrl
      }));

      return optimizedUrl;
    } catch (error) {
      console.error('Error optimizing image:', error);
      throw error;
    }
  }

  private async optimizeImage(
    url: string,
    options: OptimizationOptions,
    format: string
  ): Promise<string> {
    // Check for abort signal
    if (options.signal?.aborted) {
      throw new Error('Optimization aborted');
    }

    // Create a new URL with optimization parameters
    const optimizedUrl = new URL(url);
    
    // Add optimization parameters
    if (options.maxWidth) {
      optimizedUrl.searchParams.append('width', options.maxWidth.toString());
    }
    
    if (options.quality) {
      optimizedUrl.searchParams.append('quality', options.quality.toString());
    }
    
    if (options.preserveAspectRatio) {
      optimizedUrl.searchParams.append('ar', '1');
    }
    
    optimizedUrl.searchParams.append('format', format);
    
    if (options.stage) {
      optimizedUrl.searchParams.append('stage', options.stage);
    }

    // Add device pixel ratio for high-density displays
    if (this.browserCapabilities?.highDensity) {
      optimizedUrl.searchParams.append('dpr', window.devicePixelRatio.toString());
    }

    return optimizedUrl.toString();
  }

  private setupMemoryPressureHandling(): void {
    if (typeof window !== 'undefined' && 'performance' in window) {
      this.memoryPressureListener = () => {
        const memory = (performance as any).memory;
        if (memory && memory.usedJSHeapSize > memory.jsHeapSizeLimit * 0.8) {
          this.clearCache();
        }
      };
      
      window.addEventListener('memory-pressure', this.memoryPressureListener);
    }
  }

  private cleanupMemoryPressureHandling(): void {
    if (this.memoryPressureListener) {
      window.removeEventListener('memory-pressure', this.memoryPressureListener);
      this.memoryPressureListener = null;
    }
  }

  clearCache(): void {
    Object.keys(sessionStorage)
      .filter(key => key.startsWith(this.CACHE_KEY_PREFIX))
      .forEach(key => sessionStorage.removeItem(key));
  }

  // Add cleanup in destructor
  destroy(): void {
    this.cleanupMemoryPressureHandling();
    this.clearCache();
  }
}
// Export the singleton instance
export const advancedImageOptimizer = AdvancedImageOptimizer.getInstance(); 
