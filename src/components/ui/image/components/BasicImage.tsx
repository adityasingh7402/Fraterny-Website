
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
  objectFit = 'cover',
  aspectRatio,
  preserveCropDimensions = false
}: BasicImageProps) => {
  const imgProps = createImageProps(
    src, alt, className, loading, sizes,
    width, height, 
    fallbackSrc, 
    fetchPriority
  );
  
  // Apply object-fit directly to the style object for the img element
  const style = { 
    ...imgProps.style,
    objectFit,
  };
  
  // If we want to preserve the crop dimensions and have an aspect ratio,
  // add object-position center to ensure the image is centered
  if (preserveCropDimensions && aspectRatio) {
    style.objectPosition = 'center';
  }
  
  // Use fetchPriority as a regular prop, not fetchpriority (lowercase)
  return <img {...imgProps} style={style} onClick={onClick} fetchPriority={fetchPriority} />;
};
