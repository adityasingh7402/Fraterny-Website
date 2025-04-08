
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
  style?: React.CSSProperties;
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
  preserveCropDimensions = true,
  style = {}
}: BasicImageProps) => {
  const imgProps = createImageProps(
    src, alt, className, loading, sizes,
    width, height, 
    fallbackSrc, 
    fetchPriority
  );
  
  // Calculate dimensions based on props and container
  const finalStyle: React.CSSProperties = { 
    ...imgProps.style,
    ...style,
    objectFit,
    // Only set width/height if explicitly provided
    ...(width ? { width: typeof width === 'string' ? width : `${width}px` } : {}),
    ...(height ? { height: typeof height === 'string' ? height : `${height}px` } : {}),
    // Ensure proper scaling
    maxWidth: '100%',
    maxHeight: '100%',
    // Maintain aspect ratio
    ...(aspectRatio ? { aspectRatio: `${aspectRatio}` } : {}),
    // Center the image
    objectPosition: 'center'
  };
  
  // If preserving crop dimensions, ensure the image maintains its aspect ratio
  if (preserveCropDimensions) {
    finalStyle.objectPosition = 'center';
    if (!aspectRatio) {
      // Calculate aspect ratio from width and height if not provided
      const w = typeof width === 'number' ? width : undefined;
      const h = typeof height === 'number' ? height : undefined;
      if (w && h) {
        finalStyle.aspectRatio = `${w}/${h}`;
      }
    }
  }
  
  return <img {...imgProps} style={finalStyle} onClick={onClick} fetchPriority={fetchPriority} />;
};
