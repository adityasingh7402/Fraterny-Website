import React, { useState, useEffect, useRef } from 'react';
import advancedImageOptimizer from '@/services/images/services/advancedOptimizationService';
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
  isBanner?: boolean;
  priority?: 'high' | 'low' | 'auto';
}

interface LoadingStage {
  name: 'tiny' | 'low' | 'medium' | 'full';
  quality: number;
  maxWidth: number;
}

const LOADING_STAGES: LoadingStage[] = [
  { name: 'tiny', quality: 20, maxWidth: 100 },
  { name: 'low', quality: 40, maxWidth: 400 },
  { name: 'medium', quality: 60, maxWidth: 800 },
  { name: 'full', quality: 80, maxWidth: 1920 }
];

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  className = '',
  loading = 'lazy',
  width,
  height,
  sizes,
  objectFit,
  quality = 80,
  maxWidth = 1920,
  preserveAspectRatio = true,
  isBanner = false,
  priority = 'auto'
}) => {
  const [optimizedSrc, setOptimizedSrc] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const [currentStage, setCurrentStage] = useState<LoadingStage['name']>('tiny');
  const controllerRef = useRef<AbortController | null>(null);
  const network = useNetworkStatus();

  // Determine the appropriate objectFit value
  const finalObjectFit = objectFit || (isBanner ? 'cover' : 'contain');

  useEffect(() => {
    const loadOptimizedImage = async () => {
      // Cancel any existing request
      if (controllerRef.current) {
        controllerRef.current.abort();
      }
      controllerRef.current = new AbortController();

      try {
        setIsLoading(true);
        setError(false);

        // Adjust base quality based on network conditions
        const baseQuality = network.effectiveConnectionType === '4g' 
          ? quality 
          : Math.max(quality - 20, 40);

        // Progressive loading through stages
        for (const stage of LOADING_STAGES) {
          if (controllerRef.current.signal.aborted) return;

          const adjustedQuality = Math.min(
            baseQuality,
            stage.quality
          );

          const url = await advancedImageOptimizer.getOptimizedUrl(src, {
            maxWidth: Math.min(maxWidth, stage.maxWidth),
            quality: adjustedQuality,
            preserveAspectRatio,
            stage: stage.name,
            signal: controllerRef.current.signal
          });

          setOptimizedSrc(url);
          setCurrentStage(stage.name);
        }
      } catch (err) {
        if (err.name === 'AbortError') return;
        console.error('Error loading optimized image:', err);
        setError(true);
      } finally {
        controllerRef.current = null;
        setIsLoading(false);
      }
    };

    loadOptimizedImage();

    // Cleanup on unmount
    return () => {
      if (controllerRef.current) {
        controllerRef.current.abort();
      }
    };
  }, [src, quality, maxWidth, preserveAspectRatio, network.effectiveConnectionType]);

  // Show loading placeholder while optimizing
  if (isLoading) {
    return (
      <LoadingPlaceholder
        alt={alt}
        className={className}
        width={typeof width === 'string' ? parseInt(width, 10) : width}
        height={typeof height === 'string' ? parseInt(height, 10) : height}
        stage={currentStage}
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
        onRetry={() => {
          setError(false);
          setIsLoading(true);
        }}
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
      fetchPriority={priority}
      style={{
        objectFit: finalObjectFit,
        width: '100%',
        height: '100%',
        maxWidth: '100%',
        maxHeight: '100%',
        transition: 'opacity 0.3s ease-in-out',
        opacity: currentStage === 'full' ? 1 : 0.8
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
        onRetry={() => {
          // Force remount of OptimizedImage
          const key = Math.random().toString(36).substring(7);
          return <OptimizedImage {...props} key={key} />;
        }}
      />
    }
  >
    <OptimizedImage {...props} />
  </ErrorBoundary>
); 
