
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
  fallbackSrc: string;
  width?: number;
  height?: number;
  sizes?: string;
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
  fallbackSrc,
  width,
  height,
  sizes
}: ResponsivePictureProps) => {
  const imgProps = createImageProps(
    sources.desktop, alt, className, loading, sizes,
    width, height, fallbackSrc, fetchPriority
  );
  
  return (
    <picture onClick={onClick}>
      {sources.mobile && <source media="(max-width: 640px)" srcSet={sources.mobile} />}
      {sources.tablet && <source media="(max-width: 1024px)" srcSet={sources.tablet} />}
      <source media="(min-width: 641px)" srcSet={sources.desktop} />
      <img {...imgProps} />
    </picture>
  );
};
