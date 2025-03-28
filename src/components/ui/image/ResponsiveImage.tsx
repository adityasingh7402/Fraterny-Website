
import React from 'react';
import { useResponsiveImage } from './useResponsiveImage';
import { useImagePerformanceMonitoring, createImageProps } from './utils';
import { ResponsiveImageProps } from './types';

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
  // Use the custom hook to handle image loading
  const { isLoading, error, dynamicSrc } = useResponsiveImage(dynamicKey, size);
  
  // Monitor image loading performance
  useImagePerformanceMonitoring(src, dynamicSrc);
  
  // If we're still loading a dynamic image, show a loading placeholder
  if (isLoading) {
    return (
      <div 
        className={`bg-gray-200 animate-pulse ${className}`} 
        aria-label={`Loading ${alt}`}
        style={{ 
          aspectRatio: '16/9',
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
          aspectRatio: '16/9',
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
  
  // Render different image styles based on the type of imageSrc
  return renderImage(imageSrc, {
    alt,
    className,
    loading, 
    fetchPriority,
    onClick,
    fallbackSrc,
    width,
    height,
    sizes
  });
};

/**
 * Helper function to render the appropriate image based on source type
 */
function renderImage(
  imageSrc: string | { mobile: string; tablet?: string; desktop: string; } | undefined,
  props: Omit<ResponsiveImageProps, 'src' | 'dynamicKey' | 'size'>
) {
  const { 
    alt, className, loading, fetchPriority, onClick, 
    fallbackSrc, width, height, sizes 
  } = props;

  // If imageSrc is a string (from dynamicKey), use the same image for all sizes
  if (typeof imageSrc === 'string') {
    const imgProps = createImageProps(
      imageSrc, alt, className, loading, sizes,
      width, height, fallbackSrc, fetchPriority
    );
    
    return <img {...imgProps} onClick={onClick} />;
  }
  
  // If imageSrc is an object with responsive breakpoints
  if (imageSrc) {
    // Use tablet image if provided, otherwise fall back to desktop
    const tabletSrc = imageSrc.tablet || imageSrc.desktop;
    
    // Create common image props
    const imgProps = createImageProps(
      imageSrc.desktop, alt, className, loading, sizes,
      width, height, fallbackSrc, fetchPriority
    );
    
    return (
      <picture onClick={onClick}>
        <source media="(max-width: 640px)" srcSet={imageSrc.mobile} />
        <source media="(max-width: 1024px)" srcSet={tabletSrc} />
        <source media="(min-width: 1025px)" srcSet={imageSrc.desktop} />
        <img {...imgProps} />
      </picture>
    );
  }
  
  // Fallback for empty src
  return (
    <div 
      className={`bg-gray-100 flex items-center justify-center ${className}`}
      style={{ 
        aspectRatio: '16/9',
        width, 
        height 
      }}
    >
      <div className="text-gray-400 text-sm text-center p-4">No image provided</div>
    </div>
  );
}

export default ResponsiveImage;
