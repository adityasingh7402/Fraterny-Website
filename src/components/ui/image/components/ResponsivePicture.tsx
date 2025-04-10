import React from 'react';
import { createImageProps } from '../utils';
import { ResponsiveImageSource } from '../types';

interface ResponsivePictureProps {
  sources: ResponsiveImageSource;
  alt: string;
  className?: string;
  loading?: 'lazy' | 'eager';
  fetchPriority?: 'high' | 'low' | 'auto';
  onClick?: () => void;
  fallbackSrc?: string;
  width?: number;
  height?: number;
  sizes?: string;
  useMobileSrc?: boolean;
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
}

/**
 * Responsive picture component for different device sizes
 */
export const ResponsivePicture = ({
  sources,
  alt,
  className,
  loading = 'lazy',
  fetchPriority,
  onClick,
  fallbackSrc = '/placeholder.svg',
  width,
  height,
  sizes,
  useMobileSrc,
  objectFit = 'contain'
}: ResponsivePictureProps) => {
  const imgProps = createImageProps(
    sources.desktop, 
    alt, 
    className, 
    loading, 
    sizes,
    width, 
    height, 
    fallbackSrc, 
    fetchPriority
  );
  
  // Apply object-fit directly to the style object for the img element
  const style = { 
    ...imgProps.style, 
    objectFit 
  };
  
  return (
    <picture onClick={onClick}>
      {sources.mobile && <source media="(max-width: 640px)" srcSet={sources.mobile} />}
      {sources.tablet && <source media="(max-width: 1024px)" srcSet={sources.tablet} />}
      <source media="(min-width: 641px)" srcSet={sources.desktop} />
      <img {...imgProps} style={style} />
    </picture>
  );
};
