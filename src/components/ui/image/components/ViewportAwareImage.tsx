
import React, { useState, useEffect } from 'react';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import { useNetworkStatus } from '@/hooks/use-network-status';
import { trackImageLoadStart, trackImageLoadComplete, trackImageLoadFailure } from '@/utils/imagePerformanceMonitor';

interface ViewportAwareImageProps {
  src: string;
  alt: string;
  lowQualitySrc?: string;
  width?: number;
  height?: number;
  className?: string;
  sizes?: string;
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
  fallbackSrc?: string;
  onLoad?: () => void;
  onError?: () => void;
  fetchPriority?: 'high' | 'low' | 'auto';
}

export const ViewportAwareImage: React.FC<ViewportAwareImageProps> = ({
  src,
  alt,
  lowQualitySrc,
  width,
  height,
  className,
  sizes,
  objectFit = 'cover',
  fallbackSrc = '/placeholder.svg',
  onLoad,
  onError,
  fetchPriority = 'auto',
}) => {
  const network = useNetworkStatus();
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [imageSrc, setImageSrc] = useState(lowQualitySrc || (isValidSrc(src) ? src : fallbackSrc));
  
  // Define margin based on network conditions
  let rootMargin = '200px';
  if (network.saveDataEnabled || (network.rtt !== null && network.rtt > 500)) {
    rootMargin = '100px'; // Load closer to viewport on slow connections
  } else if (network.rtt !== null && network.rtt < 50) {
    rootMargin = '400px'; // Load further ahead on fast connections
  }
  
  // Function to validate src is not undefined or malformed
  function isValidSrc(url: string | undefined): boolean {
    if (!url) return false;
    
    // Check for undefined keyword in URL (common error)
    if (url.includes('/undefined') || url === 'undefined') {
      console.error(`[ViewportAwareImage] Invalid URL contains 'undefined': ${url}`);
      return false;
    }
    
    // Simple check for URL structure
    try {
      return url.startsWith('http') || url.startsWith('/');
    } catch (e) {
      console.error(`[ViewportAwareImage] URL validation error: ${e}`);
      return false;
    }
  }
  
  // Use intersection observer with dynamic rootMargin
  const [ref, isVisible] = useIntersectionObserver<HTMLDivElement>({
    rootMargin,
    triggerOnce: true,
  });

  // Load high-quality image when element is visible or about to be visible
  useEffect(() => {
    if (isVisible && !isLoaded && !hasError) {
      // Validate src before attempting to load
      if (!isValidSrc(src)) {
        console.error(`[ViewportAwareImage] Skipping invalid src: ${src}`);
        setHasError(true);
        setImageSrc(fallbackSrc);
        trackImageLoadFailure(src || 'unknown-src', new Error('Invalid source URL'));
        onError?.();
        return;
      }
      
      console.log(`[ViewportAwareImage] Loading image: ${src}`);
      trackImageLoadStart(src);
      
      const startTime = performance.now();
      const img = new Image();
      img.src = src;
      
      img.onload = () => {
        const loadTime = performance.now() - startTime;
        console.log(`[ViewportAwareImage] Successfully loaded: ${src} in ${loadTime.toFixed(2)}ms`);
        trackImageLoadComplete(src, loadTime);
        
        setImageSrc(src);
        setIsLoaded(true);
        onLoad?.();
      };
      
      img.onerror = () => {
        console.error(`[ViewportAwareImage] Failed to load: ${src}, using fallback: ${fallbackSrc}`);
        trackImageLoadFailure(src, new Error('Image load failed'));
        
        setHasError(true);
        setImageSrc(fallbackSrc);
        onError?.();
      };
    }
  }, [isVisible, src, isLoaded, hasError, fallbackSrc, onLoad, onError]);

  // Apply appropriate styles for fade-in effect and maintaining aspect ratio
  const style: React.CSSProperties = {
    objectFit,
    transition: 'opacity 0.3s ease-in-out',
    opacity: lowQualitySrc && !isLoaded ? 0.5 : 1,
  };

  // Add width and height if provided
  if (width) style.width = width;
  if (height) style.height = height;

  // Fix for fetchPriority - use the lowercase DOM attribute name
  const imgAttributes: Record<string, any> = {};
  if (fetchPriority) {
    imgAttributes.fetchpriority = (isVisible ? fetchPriority : 'low').toLowerCase();
  }

  return (
    <div
      ref={ref}
      className={className}
      style={{
        position: 'relative',
        overflow: 'hidden',
        width: width ? `${width}px` : '100%',
        height: height ? `${height}px` : 'auto',
      }}
    >
      {/* Image with proper attributes for SEO and accessibility */}
      <img
        src={imageSrc}
        alt={alt}
        width={width}
        height={height}
        sizes={sizes}
        style={style}
        loading="lazy" // Native lazy loading as backup
        className={`${className} w-full h-full`}
        {...imgAttributes}
        onError={() => {
          console.error(`[ViewportAwareImage] Error loading image: ${imageSrc}`);
          if (imageSrc !== fallbackSrc) {
            setImageSrc(fallbackSrc);
            setHasError(true);
            onError?.();
          }
        }}
      />
    </div>
  );
};
