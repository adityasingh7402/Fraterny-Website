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
  width?: number | string;
  height?: number | string;
  sizes?: string;
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
  aspectRatio?: number;
  preserveCropDimensions?: boolean;
}

/**
 * Basic image component for simple URL sources
 * Enhanced to better handle aspect ratios and maintain crop dimensions
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
  objectFit = 'contain',
  aspectRatio,
  preserveCropDimensions = true
}: BasicImageProps) => {
  const imgProps = createImageProps(
    src, alt, className, loading, sizes,
    width, height, 
    fallbackSrc, 
    fetchPriority
  );
  
  // Apply object-fit and ensure proper scaling
  const style = { 
    ...imgProps.style,
    objectFit,
     width: '100%',
    height: '100%',
  };
  
  // If preserving crop dimensions, ensure the image maintains its aspect ratio
  if (preserveCropDimensions && aspectRatio) {
    style.objectPosition = 'center';
    style.aspectRatio = `${aspectRatio}`;
  }
  
  // Use fetchPriority as a regular prop, not fetchpriority (lowercase)
  return <img {...imgProps} style={style} onClick={onClick} fetchPriority={fetchPriority} />;
};
