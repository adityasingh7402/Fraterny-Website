
import React, { useState, useEffect } from 'react';
import { useResponsiveImage } from './useResponsiveImage';
import { useImagePerformanceMonitoring, createImageProps } from './utils';
import { ResponsiveImageProps } from './types';

/**
 * ResponsiveImage component that serves different image sizes based on screen width
 * Enhanced with width/height attributes to prevent CLS and sizes attribute for responsive loading
 */
const ResponsiveImage = ({
  src,
  alt,
  className = '',
  loading = 'lazy',
  fetchPriority,
  onClick,
  dynamicKey,
  size,
  fallbackSrc = "/placeholder.svg",
  width,
  height,
  sizes = '100vw'
}: ResponsiveImageProps) => {
  // Get desktop and mobile keys if dynamicKey is provided
  const desktopKey = dynamicKey || '';
  const mobileKey = dynamicKey ? `${dynamicKey}-mobile` : '';
  
  // Use the custom hooks to handle desktop and mobile image loading
  const { isLoading: isDesktopLoading, error: desktopError, dynamicSrc: desktopDynamicSrc } = 
    useResponsiveImage(desktopKey, size);
  const { isLoading: isMobileLoading, error: mobileError, dynamicSrc: mobileDynamicSrc } = 
    useResponsiveImage(mobileKey, size);
  
  // Combined loading state
  const isLoading = (!!dynamicKey && (isDesktopLoading || (mobileKey && isMobileLoading)));
  
  // Monitor image loading performance
  useImagePerformanceMonitoring(src, desktopDynamicSrc || mobileDynamicSrc);
  
  // If we're still loading dynamic images, show a loading placeholder
  if (isLoading) {
    return (
      <div 
        className={`bg-gray-200 animate-pulse ${className}`} 
        aria-label={`Loading ${alt}`}
        style={{ 
          aspectRatio: width && height ? `${width}/${height}` : '16/9',
          width: width,
          height: height 
        }}
      ></div>
    );
  }
  
  // Check if we have dynamic sources
  const hasDynamicDesktop = !desktopError && desktopDynamicSrc;
  const hasDynamicMobile = !mobileError && mobileDynamicSrc;
  
  // If there was an error loading both images or no dynamic source found for both, use fallback
  if ((desktopError || !desktopDynamicSrc) && (mobileError || !mobileDynamicSrc) && dynamicKey) {
    console.log(`Using fallback for ${dynamicKey} - desktop error: ${desktopError}, mobile error: ${mobileError}`);
    
    // If src is provided as a fallback, use it instead of showing error state
    if (src) {
      return renderImage(src, {
        alt,
        className,
        loading, 
        fetchPriority,
        onClick,
        fallbackSrc,
        width,
        height,
        sizes
      });
    }
    
    // Otherwise show placeholder/error state
    return (
      <div 
        className={`bg-gray-100 flex items-center justify-center ${className}`}
        style={{ 
          aspectRatio: width && height ? `${width}/${height}` : '16/9',
          width: width,
          height: height 
        }}
      >
        {typeof fallbackSrc === 'string' ? (
          <img 
            src={fallbackSrc} 
            alt={`Placeholder for ${alt}`} 
            className="max-h-full max-w-full p-4 opacity-30"
            width={width}
            height={height}
          />
        ) : (
          <div className="text-gray-400 text-sm text-center p-4">
            Image not found
          </div>
        )}
      </div>
    );
  }
  
  // If we have dynamic sources, create a responsive image object
  let imageSrc = src;
  
  if (hasDynamicDesktop || hasDynamicMobile) {
    if (typeof src === 'object') {
      // Preserve the existing structure but replace with dynamic sources where available
      imageSrc = {
        mobile: hasDynamicMobile ? mobileDynamicSrc! : src.mobile,
        desktop: hasDynamicDesktop ? desktopDynamicSrc! : src.desktop
      };
    } else if (hasDynamicDesktop && hasDynamicMobile) {
      // Create a new responsive object with both dynamic sources
      imageSrc = {
        mobile: mobileDynamicSrc!,
        desktop: desktopDynamicSrc!
      };
    } else if (hasDynamicDesktop) {
      // We only have desktop dynamic source
      imageSrc = desktopDynamicSrc;
    }
  }
  
  // Render different image styles based on the type of imageSrc
  return renderImage(imageSrc, {
    alt,
    className,
    loading, 
    fetchPriority,
    onClick,
    fallbackSrc,
    width,
    height,
    sizes
  });
};

/**
 * Helper function to render the appropriate image based on source type
 */
function renderImage(
  imageSrc: string | { mobile: string; tablet?: string; desktop: string; } | undefined,
  props: Omit<ResponsiveImageProps, 'src' | 'dynamicKey' | 'size'>
) {
  const { 
    alt, className, loading, fetchPriority, onClick, 
    fallbackSrc, width, height, sizes 
  } = props;

  // If imageSrc is a string (simple URL), use the same image for all sizes
  if (typeof imageSrc === 'string') {
    const imgProps = createImageProps(
      imageSrc, alt, className, loading, sizes,
      width, height, 
      typeof fallbackSrc === 'string' ? fallbackSrc : '/placeholder.svg', 
      fetchPriority
    );
    
    return <img {...imgProps} onClick={onClick} />;
  }
  
  // If imageSrc is an object with responsive breakpoints
  if (imageSrc) {
    // Create common image props
    const imgProps = createImageProps(
      imageSrc.desktop, alt, className, loading, sizes,
      width, height, 
      typeof fallbackSrc === 'string' ? fallbackSrc : '/placeholder.svg',
      fetchPriority
    );
    
    return (
      <picture onClick={onClick}>
        {imageSrc.mobile && <source media="(max-width: 640px)" srcSet={imageSrc.mobile} />}
        {imageSrc.tablet && <source media="(max-width: 1024px)" srcSet={imageSrc.tablet} />}
        <source media="(min-width: 641px)" srcSet={imageSrc.desktop} />
        <img {...imgProps} />
      </picture>
    );
  }
  
  // Fallback for empty src
  return (
    <div 
      className={`bg-gray-100 flex items-center justify-center ${className}`}
      style={{ 
        aspectRatio: width && height ? `${width}/${height}` : '16/9',
        width, 
        height 
      }}
    >
      <div className="text-gray-400 text-sm text-center p-4">No image provided</div>
    </div>
  );
}

export default ResponsiveImage;
