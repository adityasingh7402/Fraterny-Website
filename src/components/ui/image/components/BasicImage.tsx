
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
  sizes
}: BasicImageProps) => {
  const imgProps = createImageProps(
    src, alt, className, loading, sizes,
    width, height, 
    fallbackSrc, 
    fetchPriority
  );
  
  // Remove fetchPriority from imgProps to avoid React DOM warning
  // fetchPriority needs to be lowercase in the DOM
  const { fetchPriority: _, ...cleanProps } = imgProps;
  
  // Add it back with the correct DOM attribute name if it exists
  const finalProps: any = { ...cleanProps };
  if (fetchPriority) {
    finalProps.fetchpriority = fetchPriority;
  }
  
  return <img {...finalProps} onClick={onClick} />;
};
