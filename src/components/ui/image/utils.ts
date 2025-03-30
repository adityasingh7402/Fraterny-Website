
import { useEffect } from 'react';
import { ResponsiveImageSource } from './types';

/**
 * Utility function to create common props for the img element
 */
export const createImageProps = (
  src: string,
  alt: string,
  className: string | undefined,
  loading: 'lazy' | 'eager',
  sizes: string | undefined,
  width: number | undefined,
  height: number | undefined,
  fallbackSrc: string,
  fetchPriority?: 'high' | 'low' | 'auto'
): React.ImgHTMLAttributes<HTMLImageElement> => {
  // Create a props object for the img element
  const imgProps: React.ImgHTMLAttributes<HTMLImageElement> = {
    src,
    alt,
    className,
    loading,
    decoding: "async",
    sizes,
    width,
    height,
    onError: (e) => {
      console.warn(`Failed to load image: ${e.currentTarget.src}`);
      if (e.currentTarget.src !== fallbackSrc) {
        e.currentTarget.src = fallbackSrc;
      }
    }
  };
  
  return imgProps;
};

/**
 * Utility hook to monitor image loading performance
 */
export const useImagePerformanceMonitoring = (
  imageSrc: string | ResponsiveImageSource | undefined, 
  dynamicSrc: string | null
) => {
  useEffect(() => {
    if (typeof window !== 'undefined' && 'PerformanceObserver' in window) {
      // Determine the image URL to monitor
      const imgUrl = typeof imageSrc === 'string' ? 
        imageSrc : 
        (
          imageSrc?.desktop || 
          dynamicSrc || 
          ''
        );
      
      // Skip monitoring for empty URLs
      if (!imgUrl) return;
      
      const loadStart = performance.now();
      
      return () => {
        // Only log significant image loads (not placeholders)
        if (imgUrl && !imgUrl.includes('placeholder')) {
          const loadTime = performance.now() - loadStart;
          console.debug(`Image load time (${imgUrl.split('/').pop()}): ${loadTime.toFixed(0)}ms`);
        }
      };
    }
  }, [imageSrc, dynamicSrc]);
};
