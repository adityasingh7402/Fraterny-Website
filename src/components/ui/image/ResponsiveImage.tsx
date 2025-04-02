
import React, { useState, useEffect } from 'react';
import { useResponsiveImage } from './useResponsiveImage';
import { useIsMobile } from '@/hooks/use-mobile';
import { LoadingPlaceholder } from './components/LoadingPlaceholder';
import { ErrorPlaceholder } from './components/ErrorPlaceholder';
import { ResponsiveImageProps, ResponsiveImageSource } from './types';
import { ResponsivePicture } from './components/ResponsivePicture';
import { BasicImage } from './components/BasicImage';
import { CacheDebugInfo } from './components/CacheDebugInfo';
import { MobileOptimizedImage } from './components/MobileOptimizedImage';
import { useNetworkStatus } from '@/hooks/use-network-status';

/**
 * A component that renders responsive images with different sources for mobile, tablet, and desktop
 * Enhanced with content-based cache keys, debugging capabilities, and mobile optimization
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
  objectFit = 'cover',
  debugCache = false
}: ResponsiveImageProps) => {
  const isMobile = useIsMobile();
  const network = useNetworkStatus();
  
  // Log detection of mobile state for this component instance with more context
  useEffect(() => {
    console.log(`[ResponsiveImage] (${dynamicKey || alt}) - Device detected as: ${isMobile ? 'MOBILE' : 'DESKTOP'}`);
  }, [isMobile, dynamicKey, alt]);
  
  // Determine if we should use lower quality images based on network conditions
  const useLowQualityOnPoorConnection = 
    network.saveDataEnabled || 
    ['slow-2g', '2g'].includes(network.effectiveConnectionType) ||
    (network.rtt !== null && network.rtt > 500);

  // Handle priority for browser loading hint
  // Adjust based on network conditions
  const finalFetchPriority = priority 
    ? 'high' 
    : (fetchPriority || (loading === 'eager' 
        ? (useLowQualityOnPoorConnection ? 'auto' : 'high') 
        : 'auto'));

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
  } = useResponsiveImage(dynamicKey, 
    // Use a smaller size on poor connections
    useLowQualityOnPoorConnection && size === 'large' ? 'medium' : size, 
    debugCache);
  
  // For debugging
  useEffect(() => {
    if (dynamicKey && dynamicSrc) {
      console.log(`[ResponsiveImage] Rendered ${dynamicKey} with URL: ${dynamicSrc}`);
      if (useLowQualityOnPoorConnection) {
        console.log(`[ResponsiveImage] Using lower quality for ${dynamicKey} due to network conditions`);
      }
    }
  }, [dynamicKey, dynamicSrc, useLowQualityOnPoorConnection]);

  // PRIORITY 1: If dynamicKey is provided, use it exclusively
  if (dynamicKey) {
    // If we're loading a dynamic image and it's still loading
    if (isLoading) {
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
    if (error) {
      return (
        <ErrorPlaceholder 
          alt={alt} 
          className={className}
          width={width}
          height={height}
          aspectRatio={aspectRatio || 16/9}
          fallbackSrc={fallbackSrc}
        />
      );
    }

    // If we have a dynamic source, use it with mobile optimization
    if (dynamicSrc) {
      return (
        <div className={`relative ${className}`} style={{ width, height }}>
          <MobileOptimizedImage
            src={dynamicSrc}
            lowQualitySrc={tinyPlaceholder || undefined}
            alt={alt}
            loading={loading}
            className="w-full h-full"
            width={width}
            height={height}
            sizes={sizes}
            objectFit={objectFit}
          />
          {onClick && (
            <div 
              className="absolute inset-0 cursor-pointer" 
              onClick={onClick}
              aria-label={`Click to interact with ${alt}`}
            />
          )}
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
  }

  // PRIORITY 2: For static responsive image object with mobile, tablet, desktop variants
  // Only used for local images not managed through database
  if (typeof src === 'object' && 'mobile' in src && 'desktop' in src) {
    console.log('[ResponsiveImage] Rendering responsive image with sources:', src);
    console.log(`[ResponsiveImage] Device detection for ${alt}: ${isMobile ? 'MOBILE' : 'DESKTOP'}`);
    console.log(`[ResponsiveImage] Will use ${isMobile ? 'MOBILE' : 'DESKTOP'} source for ${alt}`);
    
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
          fallbackSrc={fallbackSrc}
          useMobileSrc={isMobile}
          objectFit={objectFit}
        />
        {debugCache && (
          <CacheDebugInfo
            url={isMobile ? src.mobile : (src.desktop || src.mobile)}
            isLoading={false}
            isCached={false}
          />
        )}
      </div>
    );
  }

  // PRIORITY 3: Default case: simple image for local assets
  return (
    <div className="relative" style={{ width, height }}>
      <BasicImage
        src={typeof src === 'string' ? src : fallbackSrc}
        alt={alt}
        loading={loading}
        fetchPriority={finalFetchPriority}
        onClick={onClick}
        className={className || "w-full h-full"}
        width={width}
        height={height}
        sizes={sizes}
        fallbackSrc={fallbackSrc}
        objectFit={objectFit}
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
