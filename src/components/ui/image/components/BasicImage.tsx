
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
}

/**
 * Basic image component for simple URL sources
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
  objectFit = 'cover'
}: BasicImageProps) => {
  const imgProps = createImageProps(
    src, alt, className, loading, sizes,
    width, height, 
    fallbackSrc, 
    fetchPriority
  );
  
  // Add style for object-fit if provided
  const style = objectFit ? { objectFit, ...imgProps.style } : imgProps.style;
  
  // Use fetchPriority as a regular prop, not fetchpriority (lowercase)
  return <img {...imgProps} style={style} onClick={onClick} fetchPriority={fetchPriority} />;
};
