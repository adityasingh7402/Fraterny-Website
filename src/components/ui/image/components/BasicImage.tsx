import React, { useEffect, useState } from 'react';
import { createImageProps } from '../utils';
import { getImageUrlByKey } from '@/services/images';

interface BasicImageProps {
  src: string;
  alt: string;
  className?: string;
  loading?: 'lazy' | 'eager';
  fetchPriority?: 'high' | 'low' | 'auto';
  onClick?: () => void;
  fallbackSrc?: string;
  width?: number | string;
  height?: number | string;
  sizes?: string;
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
  aspectRatio?: number;
  preserveCropDimensions?: boolean;
  style?: React.CSSProperties;
  dynamicKey?: string;
}

/**
 * Basic image component for simple URL sources
 * Enhanced to better handle aspect ratios and maintain crop dimensions
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
  objectFit = 'contain',
  aspectRatio,
  preserveCropDimensions = true,
  style: customStyle,
  dynamicKey
}: BasicImageProps) => {
  const [currentSrc, setCurrentSrc] = useState(src);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    // Reset error state when src changes
    setIsError(false);
    setCurrentSrc(src);
  }, [src]);

  useEffect(() => {
    // If using a dynamic key, fetch the signed URL
    if (dynamicKey && !isError) {
      const fetchSignedUrl = async () => {
        try {
          const signedUrl = await getImageUrlByKey(dynamicKey);
          if (signedUrl && signedUrl !== '/placeholder.svg') {
            setCurrentSrc(signedUrl);
          }
        } catch (error) {
          console.error(`Error fetching signed URL for ${dynamicKey}:`, error);
          setIsError(true);
        }
      };

      fetchSignedUrl();

      // Refresh the signed URL periodically (every 45 minutes)
      const refreshInterval = setInterval(fetchSignedUrl, 45 * 60 * 1000);
      return () => clearInterval(refreshInterval);
    }
  }, [dynamicKey, isError]);

  const imgProps = createImageProps(
    currentSrc,
    alt,
    className,
    loading,
    sizes,
    width,
    height,
    fallbackSrc,
    fetchPriority
  );
  
  // Calculate dimensions based on props and container
  const style: React.CSSProperties = { 
    ...imgProps.style,
    ...customStyle,
    objectFit,
    // Only set width/height if explicitly provided
    ...(width ? { width: typeof width === 'string' ? width : `${width}px` } : {}),
    ...(height ? { height: typeof height === 'string' ? height : `${height}px` } : {}),
    // Ensure proper scaling
    maxWidth: '100%',
    maxHeight: '100%',
    // Maintain aspect ratio
    ...(aspectRatio ? { aspectRatio: `${aspectRatio}` } : {}),
    // Center the image
    objectPosition: 'center'
  };
  
  // If preserving crop dimensions, ensure the image maintains its aspect ratio
  if (preserveCropDimensions) {
    style.objectPosition = 'center';
    if (!aspectRatio) {
      // Calculate aspect ratio from width and height if not provided
      const w = typeof width === 'number' ? width : undefined;
      const h = typeof height === 'number' ? height : undefined;
      if (w && h) {
        style.aspectRatio = `${w}/${h}`;
      }
    }
  }
  
  return <img {...imgProps} style={style} onClick={onClick} fetchPriority={fetchPriority} onError={(e) => {
    console.warn(`Failed to load image: ${e.currentTarget.src}`);
    setIsError(true);
    if (e.currentTarget.src !== fallbackSrc) {
      e.currentTarget.src = fallbackSrc;
    }
  }} />;
};
