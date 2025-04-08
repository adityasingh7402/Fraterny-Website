
import React, { useState } from 'react';
import { BasicImage } from './BasicImage';
import { LoadingPlaceholder } from './LoadingPlaceholder';
import { ErrorPlaceholder } from './ErrorPlaceholder';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number | string;
  height?: number | string;
  className?: string;
  loading?: 'lazy' | 'eager';
  fetchPriority?: 'high' | 'low' | 'auto';
  sizes?: string;
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
  aspectRatio?: number;
  placeholderSrc?: string;
  lowQualitySrc?: string;
  preserveCropDimensions?: boolean;
}

/**
 * A wrapper component that provides error handling and loading states for images
 */
export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  width,
  height,
  className = '',
  loading = 'lazy',
  fetchPriority,
  sizes,
  objectFit = 'cover',
  aspectRatio,
  placeholderSrc,
  lowQualitySrc,
  preserveCropDimensions = true,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  
  const handleLoad = () => {
    setIsLoading(false);
  };
  
  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
  };
  
  if (hasError) {
    return (
      <ErrorPlaceholder 
        alt={alt}
        className={className}
        width={width}
        height={height}
        aspectRatio={aspectRatio}
        fallbackSrc={lowQualitySrc || placeholderSrc}
        onRetry={() => {
          setHasError(false);
          setIsLoading(true);
        }}
      />
    );
  }
  
  return (
    <>
      {isLoading && (
        <LoadingPlaceholder
          alt={alt}
          className={className}
          width={width}
          height={height}
          aspectRatio={aspectRatio}
          placeholderSrc={placeholderSrc}
        />
      )}
      
      <BasicImage
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={`${className} ${isLoading ? 'opacity-0' : 'opacity-100'}`}
        loading={loading}
        fetchPriority={fetchPriority}
        sizes={sizes}
        objectFit={objectFit}
        aspectRatio={aspectRatio}
        preserveCropDimensions={preserveCropDimensions}
        style={{ transition: 'opacity 0.2s ease-in-out' }}
        onClick={handleLoad}
        fallbackSrc={lowQualitySrc || placeholderSrc || '/placeholder.svg'}
      />
    </>
  );
};
