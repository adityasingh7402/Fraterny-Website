
import React, { useState, useEffect, useRef } from 'react';
import { BasicImage } from './components/BasicImage';

interface ViewportAwareImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  sizes?: string;
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
  fallbackSrc?: string;
  fetchPriority?: 'high' | 'low' | 'auto';
  lowQualitySrc?: string | null;
  onLoad?: () => void;
  onError?: () => void;
}

/**
 * Viewport-aware image component that only loads images when they are about to enter the viewport
 */
export const ViewportAwareImage: React.FC<ViewportAwareImageProps> = ({
  src,
  alt,
  className,
  width,
  height,
  sizes,
  objectFit = 'cover',
  fallbackSrc = '/placeholder.svg',
  fetchPriority = 'auto',
  lowQualitySrc,
  onLoad,
  onError
}) => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const imageRef = useRef<HTMLDivElement>(null);

  // Log the src for debugging purposes
  useEffect(() => {
    console.log(`[ViewportAwareImage] Loading image: ${src}`);
  }, [src]);

  // Set up intersection observer to detect when image is about to enter viewport
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setIsIntersecting(true);
            // Disconnect observer once image is set to load
            observer.disconnect();
          }
        });
      },
      {
        rootMargin: '200px', // Load images 200px before they enter viewport
        threshold: 0.01
      }
    );

    if (imageRef.current) {
      observer.observe(imageRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  const handleLoad = () => {
    setIsLoaded(true);
    console.log(`[ViewportAwareImage] Successfully loaded: ${src}`);
    onLoad?.();
  };

  const handleError = () => {
    console.error(`[ViewportAwareImage] Failed to load image: ${src}`);
    onError?.();
  };

  return (
    <div 
      ref={imageRef} 
      className={`relative ${className || ''}`} 
      style={{ 
        width: width !== undefined ? width : '100%', 
        height: height !== undefined ? height : '100%' 
      }}
    >
      {/* Show low-quality placeholder image */}
      {lowQualitySrc && !isLoaded && (
        <img 
          src={lowQualitySrc} 
          alt={alt} 
          className="absolute inset-0 w-full h-full"
          style={{ objectFit }}
        />
      )}
      
      {/* Show a very basic placeholder until intersection */}
      {!isIntersecting && !lowQualitySrc && (
        <div className="w-full h-full bg-gray-100 animate-pulse"></div>
      )}
      
      {/* Only load the actual image when about to be in viewport */}
      {isIntersecting && (
        <BasicImage
          src={src}
          alt={alt}
          className={`w-full h-full ${isLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}
          width={width}
          height={height}
          sizes={sizes}
          objectFit={objectFit}
          fallbackSrc={fallbackSrc}
          fetchPriority={fetchPriority}
          loading="lazy"
          onLoad={handleLoad}
          onError={handleError}
        />
      )}
    </div>
  );
};
