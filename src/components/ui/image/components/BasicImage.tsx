
import React from 'react';
import { createImageProps } from '../utils';

interface BasicImageProps {
  src: string;
  alt: string;
  className?: string;
  loading?: 'lazy' | 'eager';
  fetchPriority?: 'high' | 'low' | 'auto';
  onClick?: () => void;
  fallbackSrc?: string;
  width?: number;
  height?: number;
  sizes?: string;
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
  useCdn?: boolean;
  onLoad?: () => void;
  onError?: () => void;
}

/**
 * Basic image component for simple URL sources
 * With proper error handling and correct React props
 */
export const BasicImage = ({
  src,
  alt,
  className,
  loading = 'lazy',
  fetchPriority,
  onClick,
  fallbackSrc = '/placeholder.svg',
  width,
  height,
  sizes,
  objectFit = 'cover',
  useCdn = false, // This is now ignored but kept for backward compatibility
  onLoad,
  onError
}: BasicImageProps) => {
  // Handle error state
  const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    console.error(`Image failed to load: ${src}, falling back to: ${fallbackSrc}`);
    // If the image fails to load, replace with fallback
    if (e.currentTarget.src !== fallbackSrc) {
      e.currentTarget.src = fallbackSrc;
    }
    onError?.();
  };
  
  const handleLoad = () => {
    console.log(`Image successfully loaded: ${src}`);
    onLoad?.();
  };
  
  const imgProps = createImageProps(
    src, 
    alt, 
    className, 
    loading, 
    sizes,
    width, 
    height, 
    fallbackSrc
  );
  
  // Apply object-fit directly to the style object for the img element
  const style = { 
    ...imgProps.style, 
    objectFit 
  };
  
  // Fix for the fetchPriority warning - use the lowercase DOM attribute
  const imgAttributes: Record<string, any> = {};
  if (fetchPriority) {
    imgAttributes.fetchpriority = fetchPriority.toLowerCase();
  }
  
  return <img 
    {...imgProps} 
    {...imgAttributes}
    style={style} 
    onClick={onClick}
    loading={loading}
    onLoad={handleLoad}
    onError={handleError}
  />;
};
