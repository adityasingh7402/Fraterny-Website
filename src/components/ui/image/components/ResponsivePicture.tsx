
import React, { useEffect } from 'react';
import { createImageProps } from '../utils';
import { ResponsiveImageSource } from '../types';

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
 * Now with improved mobile detection support and proper DOM properties
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
  useCdn = false // No longer used but kept for backward compatibility
}: ResponsivePictureProps) => {
  // Enhanced logging for better debugging
  useEffect(() => {
    console.log(`[ResponsivePicture] ${alt} - Sources available:`, {
      mobile: sources.mobile ? '✓' : '✗',
      tablet: sources.tablet ? '✓' : '✗', 
      desktop: sources.desktop ? '✓' : '✗'
    });
    console.log(`[ResponsivePicture] ${alt} - Device detected as: ${useMobileSrc ? 'MOBILE' : 'DESKTOP'}`);
  }, [sources, useMobileSrc, alt]);
  
  // Determine which source to use for the img element (for browsers that don't support picture)
  const defaultImgSrc = useMobileSrc && sources.mobile 
    ? sources.mobile
    : sources.desktop;
  
  console.log(`[ResponsivePicture] ${alt} - Selected image source: ${defaultImgSrc}`);
  console.log(`[ResponsivePicture] ${alt} - Selection based on useMobileSrc: ${useMobileSrc}`);
  
  const imgProps = createImageProps(
    defaultImgSrc, 
    alt, 
    className, 
    loading, 
    sizes,
    width, 
    height, 
    fallbackSrc
  );
  
  // Apply object-fit directly to the style object for the img element
  const style = { 
    ...imgProps.style, 
    objectFit 
  };
  
  // Fix for fetchPriority - use lowercase DOM attribute
  const imgAttributes: Record<string, any> = {};
  if (fetchPriority) {
    imgAttributes.fetchpriority = fetchPriority.toLowerCase();
  }
  
  return (
    <picture onClick={onClick}>
      {sources.mobile && (
        <source 
          media="(max-width: 640px)" 
          srcSet={sources.mobile} 
          data-testid="mobile-source"
        />
      )}
      {sources.tablet && (
        <source 
          media="(max-width: 1024px)" 
          srcSet={sources.tablet} 
          data-testid="tablet-source"
        />
      )}
      <source 
        media="(min-width: 641px)" 
        srcSet={sources.desktop} 
        data-testid="desktop-source"
      />
      <img 
        {...imgProps} 
        {...imgAttributes} // Use our fixed attributes
        style={style} 
        data-mobile={useMobileSrc ? "true" : "false"}
        onError={(e) => {
          console.error(`[ResponsivePicture] Image failed to load: ${(e.target as HTMLImageElement).src}`);
          if ((e.target as HTMLImageElement).src !== fallbackSrc) {
            (e.target as HTMLImageElement).src = fallbackSrc;
          }
        }}
      />
    </picture>
  );
};
