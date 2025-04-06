
import React, { useState, useEffect } from 'react';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import { useNetworkStatus } from '@/hooks/use-network-status';

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
  const [imageSrc, setImageSrc] = useState(lowQualitySrc || fallbackSrc);
  
  // Define margin based on network conditions
  let rootMargin = '200px';
  if (network.saveDataEnabled || network.rtt > 500) {
    rootMargin = '100px'; // Load closer to viewport on slow connections
  } else if (network.rtt < 50) {
    rootMargin = '400px'; // Load further ahead on fast connections
  }
  
  // Use intersection observer with dynamic rootMargin
  const [ref, isVisible] = useIntersectionObserver<HTMLDivElement>({
    rootMargin,
    triggerOnce: true,
  });

  // Load high-quality image when element is visible or about to be visible
  useEffect(() => {
    if (isVisible && !isLoaded && !hasError) {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        setImageSrc(src);
        setIsLoaded(true);
        onLoad?.();
      };
      img.onerror = () => {
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
