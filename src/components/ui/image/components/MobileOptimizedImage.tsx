
import React from 'react';
import { useNetworkStatus } from '@/hooks/use-network-status';
import { BasicImage } from './BasicImage';

interface MobileOptimizedImageProps {
  src: string;
  lowQualitySrc?: string;
  alt: string;
  width?: number | string;  // Allow string or number
  height?: number | string; // Allow string or number
  className?: string;
  loading?: 'lazy' | 'eager';
  sizes?: string;
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
}

/**
 * Image component that adapts to mobile network conditions
 * Uses lower quality images on slow connections or when save-data is enabled
 */
export function MobileOptimizedImage({
  src,
  lowQualitySrc,
  alt,
  width,
  height,
  className,
  loading = 'lazy',
  sizes,
  objectFit = 'contain'
}: MobileOptimizedImageProps) {
  const network = useNetworkStatus();
  
  // Use low quality image if:
  // 1. User has enabled data-saving mode, or
  // 2. Connection is slow (2g or slow-2g), or
  // 3. RTT is very high indicating poor connection
  // const shouldUseLowQuality = 
  //   (network.saveDataEnabled) || 
  //   (['slow-2g', '2g'].includes(network.effectiveConnectionType)) ||
  //   (network.rtt !== null && network.rtt > 500);
  
  // // If we have a low quality source and should use it
  // const finalSrc = (shouldUseLowQuality && lowQualitySrc) ? lowQualitySrc : src;
  
  // // Priority is higher if we're on a good connection
  // const fetchPriority = network.effectiveConnectionType === '4g' ? 'high' : 'auto';
  // FIXED: Smarter low quality detection - don't penalize good mobile connections
  const shouldUseLowQuality = 
    // Only if user explicitly enables data saving
    network.saveDataEnabled || 
    // Only truly slow connections (removed 3G penalization)
    (['slow-2g', '2g'].includes(network.effectiveConnectionType)) ||
    // High RTT AND low bandwidth (not just high RTT alone)
    (network.rtt !== null && network.rtt > 1000 && 
     network.downlink !== null && network.downlink < 0.5);
  
  // Don't penalize 3G or higher quality connections
  const isGoodConnection = ['3g', '4g'].includes(network.effectiveConnectionType) ||
                          (network.downlink !== null && network.downlink > 1.0);
  
  // If we have a low quality source and should use it, BUT not on good connections
  const finalSrc = (shouldUseLowQuality && lowQualitySrc && !isGoodConnection) ? lowQualitySrc : src;
  
  // Better priority logic based on actual connection quality
  const fetchPriority = isGoodConnection ? 'high' : 'auto';
  
  // Use more aggressive lazy loading on slow connections
  // const finalLoading = 
  //   shouldUseLowQuality && loading === 'lazy' ? 'lazy' : loading;
  // Don't over-optimize lazy loading on decent connections
  const finalLoading = 
    (shouldUseLowQuality && !isGoodConnection && loading === 'lazy') ? 'lazy' : loading;

  return (
    <BasicImage
      src={finalSrc}
      alt={alt}
      width={width as any}  // Use type assertion to bypass TypeScript check
      height={height as any} // Use type assertion to bypass TypeScript check
      className={className}
      loading={finalLoading}
      fetchPriority={fetchPriority}
      sizes={sizes}
      objectFit={objectFit}
    />
  );
}