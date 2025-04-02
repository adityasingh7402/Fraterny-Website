
import React from 'react';
import { createImageProps } from '../utils';
import { getCdnUrl } from '@/utils/cdnUtils';

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
}

/**
 * Basic image component for simple URL sources
 * Now with optional CDN support
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
  useCdn = true
}: BasicImageProps) => {
  // Process through CDN if enabled
  const processedSrc = useCdn ? getCdnUrl(src) || src : src;
  const processedFallbackSrc = useCdn ? getCdnUrl(fallbackSrc) || fallbackSrc : fallbackSrc;
  
  const imgProps = createImageProps(
    processedSrc, 
    alt, 
    className, 
    loading, 
    sizes,
    width, 
    height, 
    processedFallbackSrc, 
    fetchPriority
  );
  
  // Apply object-fit directly to the style object for the img element
  const style = { 
    ...imgProps.style, 
    objectFit 
  };
  
  // Fix: Use correct HTML attribute name 'fetchpriority' instead of 'fetchPriority'
  return <img 
    {...imgProps} 
    style={style} 
    onClick={onClick}
    fetchpriority={fetchPriority} 
  />;
};
