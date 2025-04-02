
import React, { useEffect } from 'react';
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
 * Now with improved mobile detection support
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
  // Log out the sources to debug
  useEffect(() => {
    console.log('[ResponsivePicture] sources:', sources);
    console.log('[ResponsivePicture] useMobileSrc:', useMobileSrc);
  }, [sources, useMobileSrc]);

  // Process all URLs through CDN if enabled
  const processedSources = useCdn ? {
    desktop: getCdnUrl(sources.desktop) || sources.desktop,
    mobile: sources.mobile ? (getCdnUrl(sources.mobile) || sources.mobile) : undefined,
    tablet: sources.tablet ? (getCdnUrl(sources.tablet) || sources.tablet) : undefined
  } : sources;
  
  const processedFallbackSrc = useCdn ? getCdnUrl(fallbackSrc) || fallbackSrc : fallbackSrc;
  
  // Determine which source to use for the img element (for browsers that don't support picture)
  // CRITICAL FIX: Ensure we use mobile source when on mobile
  const defaultImgSrc = useMobileSrc && processedSources.mobile 
    ? processedSources.mobile
    : processedSources.desktop;
  
  console.log('[ResponsivePicture] Selected defaultImgSrc:', defaultImgSrc, 'based on useMobileSrc:', useMobileSrc);
  
  const imgProps = createImageProps(
    defaultImgSrc, 
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
      {processedSources.mobile && (
        <source 
          media="(max-width: 640px)" 
          srcSet={processedSources.mobile} 
          data-testid="mobile-source"
        />
      )}
      {processedSources.tablet && (
        <source 
          media="(max-width: 1024px)" 
          srcSet={processedSources.tablet} 
          data-testid="tablet-source"
        />
      )}
      <source 
        media="(min-width: 641px)" 
        srcSet={processedSources.desktop} 
        data-testid="desktop-source"
      />
      <img 
        {...imgProps} 
        style={style} 
        fetchPriority={fetchPriority} 
        data-mobile={useMobileSrc ? "true" : "false"}
      />
    </picture>
  );
};
