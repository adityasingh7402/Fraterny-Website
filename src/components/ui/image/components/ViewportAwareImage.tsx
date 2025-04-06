
import React, { useState, useEffect } from 'react';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import { isValidImageUrl } from '@/services/images/validation';

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
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [actualSrc, setActualSrc] = useState<string>(fallbackSrc);
  
  // Validate source URL immediately - prevent invalid URLs from attempting to load
  useEffect(() => {
    if (!isValidImageUrl(src)) {
      console.error(`Invalid source URL: "${src}", using fallback`);
      setActualSrc(fallbackSrc);
      setHasError(true);
      if (onError) onError();
    } else {
      // If we have a low quality placeholder, show it immediately
      if (lowQualitySrc && isValidImageUrl(lowQualitySrc)) {
        setActualSrc(lowQualitySrc);
      }
    }
  }, [src, fallbackSrc, lowQualitySrc, onError]);
  
  // Use intersection observer 
  const [ref, isVisible] = useIntersectionObserver<HTMLDivElement>({
    rootMargin: '200px',
    triggerOnce: true,
  });

  // Load high-quality image when element is visible
  useEffect(() => {
    if (isVisible && !isLoaded && !hasError && isValidImageUrl(src)) {
      console.log(`Loading image: ${src}`);
      
      const img = new Image();
      img.src = src;
      
      img.onload = () => {
        setActualSrc(src);
        setIsLoaded(true);
        if (onLoad) onLoad();
      };
      
      img.onerror = () => {
        console.error(`Failed to load: ${src}, using fallback: ${fallbackSrc}`);
        setHasError(true);
        setActualSrc(fallbackSrc);
        if (onError) onError();
      };
    }
  }, [isVisible, src, isLoaded, hasError, fallbackSrc, onLoad, onError]);

  // Apply styles for transition
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
      {/* Show a very basic placeholder until intersection */}
      {!isVisible && (
        <div className="w-full h-full bg-gray-100 animate-pulse"></div>
      )}
      
      {/* Image with proper attributes */}
      {isVisible && (
        <img
          src={actualSrc}
          alt={alt}
          width={width}
          height={height}
          sizes={sizes}
          style={style}
          loading="lazy"
          className={`${className} w-full h-full`}
          {...imgAttributes}
          onError={() => {
            console.error(`Error loading image: ${actualSrc}`);
            if (actualSrc !== fallbackSrc) {
              setActualSrc(fallbackSrc);
              setHasError(true);
              if (onError) onError();
            }
          }}
        />
      )}
    </div>
  );
};
