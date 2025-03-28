
import React, { useEffect, useState } from 'react';
import { getImageUrlByKey, getImageUrlByKeyAndSize } from '@/services/images';
import { toast } from 'sonner';

interface ResponsiveImageProps {
  src?: {
    mobile: string;
    tablet?: string;
    desktop: string;
  } | string;
  alt: string;
  className?: string;
  loading?: 'lazy' | 'eager';
  fetchPriority?: 'high' | 'low' | 'auto';
  onClick?: () => void;
  dynamicKey?: string; // Key for fetching from Supabase by key
  size?: 'small' | 'medium' | 'large'; // Optional size for optimized images
  fallbackSrc?: string; // Fallback image
  width?: number; // Optional width attribute for better CLS handling
  height?: number; // Optional height attribute for better CLS handling
  sizes?: string; // Optional sizes attribute for responsive images
}

/**
 * ResponsiveImage component that serves different image sizes based on screen width
 * Enhanced with width/height attributes to prevent CLS and sizes attribute for responsive loading
 */
const ResponsiveImage = ({
  src,
  alt,
  className = '',
  loading = 'lazy',
  fetchPriority,
  onClick,
  dynamicKey,
  size,
  fallbackSrc = "/placeholder.svg",
  width,
  height,
  sizes = '100vw'
}: ResponsiveImageProps) => {
  const [dynamicSrc, setDynamicSrc] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(!!dynamicKey);
  const [error, setError] = useState(false);
  const [aspectRatio, setAspectRatio] = useState<string | undefined>(undefined);
  
  // Performance monitoring for image loading
  useEffect(() => {
    if (typeof window !== 'undefined' && 'PerformanceObserver' in window) {
      // Report image loading performance
      const imgUrl = typeof src === 'string' ? src : (src?.desktop || dynamicSrc || '');
      
      const loadStart = performance.now();
      
      return () => {
        if (imgUrl) {
          // Only log significant image loads (not placeholders)
          if (!imgUrl.includes('placeholder')) {
            const loadTime = performance.now() - loadStart;
            console.debug(`Image load time (${imgUrl.split('/').pop()}): ${loadTime.toFixed(0)}ms`);
          }
        }
      };
    }
  }, [src, dynamicSrc]);
  
  // Fetch dynamic image if dynamicKey is provided
  useEffect(() => {
    if (!dynamicKey) return;
    
    setIsLoading(true);
    setError(false);
    
    const fetchImage = async () => {
      try {
        // If size is specified, try to get that specific size
        if (size) {
          const url = await getImageUrlByKeyAndSize(dynamicKey, size);
          setDynamicSrc(url);
        } else {
          // Otherwise get the original image
          const url = await getImageUrlByKey(dynamicKey);
          setDynamicSrc(url);
        }
      } catch (error) {
        console.error(`Failed to load image with key ${dynamicKey}:`, error);
        setError(true);
        // Don't show toast for development placeholder images
        if (!dynamicKey.startsWith('villalab-') && !dynamicKey.startsWith('hero-')) {
          toast.error(`Failed to load image: ${dynamicKey}`, {
            description: "Please check if this image exists in your storage.",
            duration: 3000,
          });
        }
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchImage();
  }, [dynamicKey, size]);
  
  // If we're still loading a dynamic image, show a loading placeholder
  if (isLoading) {
    return (
      <div 
        className={`bg-gray-200 animate-pulse ${className}`} 
        aria-label={`Loading ${alt}`}
        style={{ 
          aspectRatio: aspectRatio || '16/9',
          width: width,
          height: height 
        }}
      ></div>
    );
  }
  
  // If there was an error loading the image, show a placeholder
  if (error || (!dynamicSrc && dynamicKey)) {
    return (
      <div 
        className={`bg-gray-100 flex items-center justify-center ${className}`}
        style={{ 
          aspectRatio: aspectRatio || '16/9',
          width: width,
          height: height 
        }}
      >
        {fallbackSrc ? (
          <img 
            src={fallbackSrc} 
            alt={`Placeholder for ${alt}`} 
            className="max-h-full max-w-full p-4 opacity-30"
            width={width}
            height={height}
          />
        ) : (
          <div className="text-gray-400 text-sm text-center p-4">
            Image not found
          </div>
        )}
      </div>
    );
  }
  
  // If we have a dynamicSrc, use that instead of the props.src
  const imageSrc = dynamicSrc || src;
  
  // If imageSrc is a string (from dynamicKey), use the same image for all sizes
  if (typeof imageSrc === 'string') {
    // Create a props object for the img element and conditionally add fetchPriority
    const imgProps: React.ImgHTMLAttributes<HTMLImageElement> = {
      src: imageSrc,
      alt,
      className,
      loading,
      decoding: "async",
      sizes,
      width,
      height,
      onError: (e) => {
        console.warn(`Failed to load image: ${e.currentTarget.src}`);
        e.currentTarget.src = fallbackSrc;
      }
    };
    
    if (fetchPriority) {
      imgProps.fetchPriority = fetchPriority;
    }
    
    return <img {...imgProps} onClick={onClick} />;
  }
  
  // Use tablet image if provided, otherwise fall back to desktop
  const tabletSrc = imageSrc.tablet || imageSrc.desktop;
  
  // Handle image loading error
  const handleError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    console.warn(`Failed to load image: ${e.currentTarget.src}`);
    e.currentTarget.src = fallbackSrc;
  };
  
  // Create a props object for the img element and conditionally add fetchPriority
  const imgProps: React.ImgHTMLAttributes<HTMLImageElement> = {
    src: imageSrc.desktop, // Fallback for browsers that don't support <picture>
    alt,
    className,
    loading,
    decoding: "async",
    sizes,
    width,
    height,
    onError: handleError
  };
  
  // Only add fetchPriority if it exists
  if (fetchPriority) {
    imgProps.fetchPriority = fetchPriority;
  }
  
  return (
    <picture onClick={onClick}>
      <source media="(max-width: 640px)" srcSet={imageSrc.mobile} />
      <source media="(max-width: 1024px)" srcSet={tabletSrc} />
      <source media="(min-width: 1025px)" srcSet={imageSrc.desktop} />
      <img {...imgProps} />
    </picture>
  );
};

export default ResponsiveImage;
