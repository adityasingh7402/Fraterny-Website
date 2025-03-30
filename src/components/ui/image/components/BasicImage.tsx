
import React from 'react';
import { createImageProps } from '../utils';

interface BasicImageProps {
  src: string;
  alt: string;
  className?: string;
  loading?: 'lazy' | 'eager';
  fetchPriority?: 'high' | 'low' | 'auto';
  onClick?: () => void;
  fallbackSrc: string;
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
  fallbackSrc,
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
  
  return <img {...imgProps} onClick={onClick} />;
};

