
import React, { useEffect, useState } from 'react';
import { useResponsiveImage } from './useResponsiveImage';
import { useImagePerformanceMonitoring } from './utils';
import { ResponsiveImageProps } from './types';
import { LoadingPlaceholder } from './components/LoadingPlaceholder';
import { ErrorPlaceholder } from './components/ErrorPlaceholder';
import { BasicImage } from './components/BasicImage';
import { ResponsivePicture } from './components/ResponsivePicture';
import { useImageSource } from './hooks/useImageSource';
import { useIsMobile } from '@/hooks/use-mobile';

/**
 * ResponsiveImage component that serves different image sizes based on screen width
 * Enhanced with Low-Quality Image Placeholders for improved loading experience
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
  sizes = '100vw',
  priority,
}: ResponsiveImageProps) => {
  // Get device type
  const isMobile = useIsMobile();
  
  // State for tiny placeholder image
  const [placeholderSrc, setPlaceholderSrc] = useState<string | null>(null);
  
  // Get desktop and mobile keys if dynamicKey is provided
  const desktopKey = dynamicKey || '';
  const mobileKey = dynamicKey ? `${dynamicKey}-mobile` : '';
  
  // Use the custom hooks to handle desktop and mobile image loading
  const { isLoading: isDesktopLoading, error: desktopError, dynamicSrc: desktopDynamicSrc, aspectRatio: desktopAspectRatio } = 
    useResponsiveImage(desktopKey, size);
  const { isLoading: isMobileLoading, error: mobileError, dynamicSrc: mobileDynamicSrc } = 
    useResponsiveImage(mobileKey, size);
  
  // Combined loading state
  const isLoading = !!(dynamicKey && (isDesktopLoading || (mobileKey && isMobileLoading)));
  
  // Monitor image loading performance
  useImagePerformanceMonitoring(src, desktopDynamicSrc || mobileDynamicSrc);
  
  // Generate tiny placeholder when loading starts
  useEffect(() => {
    if (isLoading) {
      // Try to get placeholder from dynamicKey or src
      if (dynamicKey) {
        // Use pre-generated placeholders based on keys when available
        if (dynamicKey.includes('hero-background')) {
          setPlaceholderSrc('/images/hero/luxury-villa-placeholder.svg');
        } else if (dynamicKey.includes('experience-hero')) {
          setPlaceholderSrc('/images/hero/experience-hero-placeholder.svg');
        } else {
          setPlaceholderSrc(null);
        }
      } else if (typeof src === 'string') {
        // If it's a string src, we can use it as is but at tiny size
        setPlaceholderSrc(src);
      } else if (src && typeof src === 'object') {
        // For responsive image sources, use mobile if available, otherwise desktop
        setPlaceholderSrc(src.mobile || src.desktop);
      }
    }
  }, [isLoading, dynamicKey, src]);
  
  // If we're still loading dynamic images, show a loading placeholder
  if (isLoading) {
    return (
      <LoadingPlaceholder 
        alt={alt}
        className={className}
        width={width}
        height={height}
        aspectRatio={desktopAspectRatio}
        placeholderSrc={placeholderSrc}
      />
    );
  }
  
  // Check if we have dynamic sources
  const hasDynamicDesktop = !desktopError && !!desktopDynamicSrc;
  const hasDynamicMobile = !mobileError && !!mobileDynamicSrc;
  
  // If there was an error loading both images or no dynamic source found for both, use fallback
  if (dynamicKey && ((!desktopDynamicSrc && !mobileDynamicSrc) || (desktopError && mobileError))) {
    console.log(`Using fallback for ${dynamicKey} - desktop error: ${desktopError}, mobile error: ${mobileError}`);
    
    // If src is provided as a fallback, use it instead of showing error state
    if (src) {
      // Render the appropriate image component based on src type
      if (typeof src === 'string') {
        return (
          <BasicImage
            src={src}
            alt={alt}
            className={className}
            loading={loading}
            fetchPriority={priority || fetchPriority}
            onClick={onClick}
            fallbackSrc={typeof fallbackSrc === 'string' ? fallbackSrc : '/placeholder.svg'}
            width={width}
            height={height}
            sizes={sizes}
          />
        );
      } else if (typeof src === 'object') {
        return (
          <ResponsivePicture
            sources={src}
            alt={alt}
            className={className}
            loading={loading}
            fetchPriority={priority || fetchPriority}
            onClick={onClick}
            fallbackSrc={typeof fallbackSrc === 'string' ? fallbackSrc : '/placeholder.svg'}
            width={width}
            height={height}
            sizes={sizes}
          />
        );
      }
    }
    
    // Otherwise show placeholder/error state
    return (
      <ErrorPlaceholder 
        alt={alt}
        className={className}
        width={width}
        height={height}
        fallbackSrc={fallbackSrc}
      />
    );
  }
  
  // Resolve the appropriate image source
  const { resolvedSrc } = useImageSource(
    src, 
    hasDynamicDesktop, 
    hasDynamicMobile, 
    desktopDynamicSrc, 
    mobileDynamicSrc,
    isMobile
  );
  
  // Render the appropriate image component based on resolvedSrc type
  if (typeof resolvedSrc === 'string') {
    return (
      <BasicImage
        src={resolvedSrc}
        alt={alt}
        className={className}
        loading={loading}
        fetchPriority={priority || fetchPriority}
        onClick={onClick}
        fallbackSrc={typeof fallbackSrc === 'string' ? fallbackSrc : '/placeholder.svg'}
        width={width}
        height={height}
        sizes={sizes}
      />
    );
  } else if (resolvedSrc) {
    return (
      <ResponsivePicture
        sources={resolvedSrc}
        alt={alt}
        className={className}
        loading={loading}
        fetchPriority={priority || fetchPriority}
        onClick={onClick}
        fallbackSrc={typeof fallbackSrc === 'string' ? fallbackSrc : '/placeholder.svg'}
        width={width}
        height={height}
        sizes={sizes}
      />
    );
  }
  
  // Fallback for empty src
  return (
    <ErrorPlaceholder 
      alt={alt}
      className={className}
      width={width}
      height={height}
      fallbackSrc="No image provided"
    />
  );
};

export default ResponsiveImage;
