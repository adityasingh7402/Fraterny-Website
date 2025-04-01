
import React from 'react';
import { createImageProps } from '../utils';
import { ResponsiveImageSource } from '../types';
import { getCdnUrl } from '@/utils/cdnUtils';

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
  useCdn?: boolean;
}

/**
 * Responsive picture component for different device sizes
 * Now with optional CDN support
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
  objectFit = 'cover',
  useCdn = true
}: ResponsivePictureProps) => {
  // Process all URLs through CDN if enabled
  const processedSources = useCdn ? {
    desktop: getCdnUrl(sources.desktop) || sources.desktop,
    mobile: sources.mobile ? (getCdnUrl(sources.mobile) || sources.mobile) : undefined,
    tablet: sources.tablet ? (getCdnUrl(sources.tablet) || sources.tablet) : undefined
  } : sources;
  
  const processedFallbackSrc = useCdn ? getCdnUrl(fallbackSrc) || fallbackSrc : fallbackSrc;
  
  const imgProps = createImageProps(
    processedSources.desktop, 
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
  
  return (
    <picture onClick={onClick}>
      {processedSources.mobile && <source media="(max-width: 640px)" srcSet={processedSources.mobile} />}
      {processedSources.tablet && <source media="(max-width: 1024px)" srcSet={processedSources.tablet} />}
      <source media="(min-width: 641px)" srcSet={processedSources.desktop} />
      <img {...imgProps} style={style} fetchPriority={fetchPriority} />
    </picture>
  );
};
