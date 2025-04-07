import React, { useState, useEffect } from 'react';
import { AdvancedImageOptimizer } from '@/services/images/services/advancedOptimizationService';
import { useNetworkStatus } from '@/hooks/use-network-status';
import { LoadingPlaceholder } from './LoadingPlaceholder';
import { ErrorPlaceholder } from './ErrorPlaceholder';
import { ErrorBoundary } from 'react-error-boundary';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  loading?: 'lazy' | 'eager';
  width?: number | string;
  height?: number | string;
  sizes?: string;
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
  quality?: number;
  maxWidth?: number;
  preserveAspectRatio?: boolean;
}

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  className = '',
  loading = 'lazy',
  width,
  height,
  sizes,
  objectFit = 'contain',
  quality = 80,
  maxWidth = 1920,
  preserveAspectRatio = true
}) => {
  const [optimizedSrc, setOptimizedSrc] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const network = useNetworkStatus();

  useEffect(() => {
    const loadOptimizedImage = async (retries = 3) => {
      try {
        setIsLoading(true);
        setError(false);

        // Adjust quality based on network conditions
        const adjustedQuality = network.effectiveConnectionType === '4g' 
          ? quality 
          : Math.max(quality - 20, 40); // Lower quality on slower connections

        // Get optimized URL with format detection
        const url = await AdvancedImageOptimizer.getOptimizedUrl(src, {
          maxWidth,
          quality: adjustedQuality,
          preserveAspectRatio
        });

        setOptimizedSrc(url);
      } catch (err) {
        console.error('Error loading optimized image:', err);
        setError(true);
        if (retries > 0) {
          return loadOptimizedImage(retries - 1);
        }
        throw err;
      } finally {
        setIsLoading(false);
      }
    };

    loadOptimizedImage();
  }, [src, quality, maxWidth, preserveAspectRatio, network.effectiveConnectionType]);

  // Show loading placeholder while optimizing
  if (isLoading) {
    return (
      <LoadingPlaceholder
        alt={alt}
        className={className}
        width={typeof width === 'string' ? parseInt(width, 10) : width}
        height={typeof height === 'string' ? parseInt(height, 10) : height}
      />
    );
  }

  // Show error placeholder if optimization failed
  if (error || !optimizedSrc) {
    return (
      <ErrorPlaceholder
        alt={alt}
        className={className}
        width={typeof width === 'string' ? parseInt(width, 10) : width}
        height={typeof height === 'string' ? parseInt(height, 10) : height}
      />
    );
  }

  // Render optimized image
  return (
    <img
      src={optimizedSrc}
      alt={alt}
      className={className}
      loading={loading}
      width={width}
      height={height}
      sizes={sizes}
      style={{
        objectFit,
        width: '100%',
        height: '100%'
      }}
    />
  );
};

export const OptimizedImageWithBoundary: React.FC<OptimizedImageProps> = (props) => (
  <ErrorBoundary 
    fallback={
      <ErrorPlaceholder
        alt={props.alt}
        className={props.className}
        width={typeof props.width === 'string' ? parseInt(props.width, 10) : props.width}
        height={typeof props.height === 'string' ? parseInt(props.height, 10) : props.height}
      />
    }
  >
    <OptimizedImage {...props} />
  </ErrorBoundary>
); 
