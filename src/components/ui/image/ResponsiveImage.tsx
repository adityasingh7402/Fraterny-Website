
import React, { useState, useEffect } from 'react';
import { useResponsiveImage } from './useResponsiveImage';
import { useIsMobile } from '@/hooks/use-mobile';
import { LoadingPlaceholder } from './components/LoadingPlaceholder';
import { ErrorPlaceholder } from './components/ErrorPlaceholder';
import { ResponsiveImageProps } from './types';
import { ResponsivePicture } from './components/ResponsivePicture';
import { BasicImage } from './components/BasicImage';
import { CacheDebugInfo } from './components/CacheDebugInfo';

/**
 * A component that renders responsive images with different sources for mobile, tablet, and desktop
 * Enhanced with content-based cache keys and debugging capabilities
 */
const ResponsiveImage = ({
  src,
  alt,
  className = '',
  loading = 'lazy',
  priority,
  fetchPriority,
  onClick,
  dynamicKey,
  size,
  fallbackSrc = '/placeholder.svg',
  width,
  height,
  sizes,
  debugCache = false
}: ResponsiveImageProps) => {
  const [useMobileSrc, setUseMobileSrc] = useState<boolean | null>(null);
  const isMobile = useIsMobile();

  // Set mobile source flag based on device detection
  useEffect(() => {
    setUseMobileSrc(isMobile);
  }, [isMobile]);

  // Handle priority for browser loading hint
  const finalFetchPriority = priority || fetchPriority || (loading === 'eager' ? 'high' : 'auto');

  // Use the hook to load dynamic images from storage
  const { 
    isLoading, 
    error, 
    dynamicSrc, 
    aspectRatio,
    tinyPlaceholder,
    colorPlaceholder,
    contentHash,
    isCached,
    lastUpdated
  } = useResponsiveImage(dynamicKey, size, debugCache);
  
  // If we're loading a dynamic image and it's still loading
  if (dynamicKey && isLoading) {
    return (
      <LoadingPlaceholder
        alt={alt}
        className={className}
        width={width}
        height={height}
        aspectRatio={aspectRatio}
        placeholderSrc={tinyPlaceholder || undefined}
        colorPlaceholder={colorPlaceholder || undefined}
      />
    );
  }

  // If there was an error loading the dynamic image
  if (dynamicKey && error) {
    return (
      <ErrorPlaceholder 
        alt={alt} 
        className={className}
        width={width}
        height={height}
        aspectRatio={aspectRatio}
        fallbackSrc={fallbackSrc}
      />
    );
  }

  // If we have a dynamic source, use it
  if (dynamicKey && dynamicSrc) {
    return (
      <div className={`relative ${className}`} style={{ width, height }}>
        <BasicImage
          src={dynamicSrc}
          alt={alt}
          loading={loading}
          fetchPriority={finalFetchPriority}
          onClick={onClick}
          className={className}
          width={width}
          height={height}
          sizes={sizes}
          fallbackSrc={fallbackSrc}
        />
        {debugCache && (
          <CacheDebugInfo
            dynamicKey={dynamicKey}
            url={dynamicSrc}
            isLoading={isLoading}
            isCached={isCached}
            contentHash={contentHash}
            lastUpdated={lastUpdated}
          />
        )}
      </div>
    );
  }

  // For responsive image object with mobile, tablet, desktop variants
  if (typeof src === 'object' && 'mobile' in src && 'desktop' in src) {
    return (
      <div className="relative" style={{ width, height }}>
        <ResponsivePicture
          sources={{
            mobile: src.mobile,
            tablet: src.tablet,
            desktop: src.desktop
          }}
          alt={alt}
          className={className}
          loading={loading}
          fetchPriority={finalFetchPriority}
          onClick={onClick}
          width={width}
          height={height}
          sizes={sizes}
          useMobileSrc={useMobileSrc}
          fallbackSrc={fallbackSrc}
        />
        {debugCache && (
          <CacheDebugInfo
            url={useMobileSrc ? src.mobile : (src.desktop || src.mobile)}
            isLoading={false}
            isCached={false}
          />
        )}
      </div>
    );
  }

  // Default case: simple image
  return (
    <div className="relative" style={{ width, height }}>
      <BasicImage
        src={typeof src === 'string' ? src : fallbackSrc}
        alt={alt}
        loading={loading}
        fetchPriority={finalFetchPriority}
        onClick={onClick}
        className={className}
        width={width}
        height={height}
        sizes={sizes}
        fallbackSrc={fallbackSrc}
      />
      {debugCache && (
        <CacheDebugInfo
          url={typeof src === 'string' ? src : fallbackSrc}
          isLoading={false}
          isCached={false}
        />
      )}
    </div>
  );
};

export default ResponsiveImage;
