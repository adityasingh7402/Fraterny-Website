
import React from 'react';
import { createImageProps } from '../utils';
import { getCdnUrl } from '@/utils/cdn/cdnUrlService';

interface BasicImageProps {
  src: string;
  alt: string;
  className?: string;
  loading?: 'lazy' | 'eager';
  fetchPriority?: 'high' | 'low' | 'auto';
  onClick?: () => void;
  fallbackSrc?: string;
  width?: number;
  height?: number;
  sizes?: string;
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
  useCdn?: boolean;
  onLoad?: () => void;
  onError?: () => void;
}

/**
 * Basic image component for simple URL sources
 * With CDN support, proper error handling, and correct React props
 */
export const BasicImage = ({
  src,
  alt,
  className,
  loading = 'lazy',
  fetchPriority,
  onClick,
  fallbackSrc = '/placeholder.svg',
  width,
  height,
  sizes,
  objectFit = 'cover',
  useCdn = true,
  onLoad,
  onError
}: BasicImageProps) => {
  // Process through CDN if enabled
  const processedSrc = useCdn ? getCdnUrl(src) || src : src;
  const processedFallbackSrc = useCdn ? getCdnUrl(fallbackSrc) || fallbackSrc : fallbackSrc;
  
  // Log for debugging
  console.log(`[BasicImage] Rendering image: ${alt} with URL: ${processedSrc}`);
  
  // Handle error state
  const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    console.error(`Image failed to load: ${processedSrc}`);
    // If the image fails to load, replace with fallback
    if (e.currentTarget.src !== processedFallbackSrc) {
      e.currentTarget.src = processedFallbackSrc;
    }
    onError?.();
  };
  
  const handleLoad = () => {
    console.log(`Image successfully loaded: ${processedSrc}`);
    onLoad?.();
  };
  
  const imgProps = createImageProps(
    processedSrc, 
    alt, 
    className, 
    loading, 
    sizes,
    width, 
    height, 
    processedFallbackSrc
  );
  
  // Apply object-fit directly to the style object for the img element
  const style = { 
    ...imgProps.style, 
    objectFit 
  };
  
  // Fix for the fetchPriority warning - use the lowercase DOM attribute
  // Don't include fetchpriority in the React component props directly
  const imgAttributes: Record<string, any> = {};
  if (fetchPriority) {
    imgAttributes.fetchpriority = fetchPriority.toLowerCase();
  }
  
  return <img 
    {...imgProps} 
    {...imgAttributes}
    style={style} 
    onClick={onClick}
    loading={loading}
    onLoad={handleLoad}
    onError={handleError}
  />;
};
