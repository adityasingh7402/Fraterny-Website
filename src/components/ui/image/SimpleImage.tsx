
import React, { useState } from 'react';
import { useImageUrl } from '@/hooks/useDirectImage';

interface SimpleImageProps {
  dynamicKey?: string;
  src?: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
  fallbackSrc?: string;
  onLoad?: () => void;
  onError?: () => void;
}

/**
 * A simplified image component with direct Supabase integration
 * Uses a single source of truth for validation and URL retrieval
 */
export const SimpleImage: React.FC<SimpleImageProps> = ({
  dynamicKey,
  src,
  alt,
  className = '',
  width,
  height,
  objectFit = 'cover',
  fallbackSrc = '/placeholder.svg',
  onLoad,
  onError
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadError, setLoadError] = useState(false);
  
  // Use our custom hook if we have a dynamicKey
  const { url, isLoading, error } = useImageUrl(dynamicKey);
  
  // Determine the source to use
  const imageSrc = dynamicKey 
    ? (url || fallbackSrc) 
    : (src || fallbackSrc);
  
  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };
  
  const handleError = () => {
    setLoadError(true);
    onError?.();
  };
  
  return (
    <div className={`relative ${className}`} style={{ width, height }}>
      {/* Loading state */}
      {((dynamicKey && isLoading) || (!isLoaded && !loadError)) && (
        <div className="absolute inset-0 bg-gray-100 animate-pulse" />
      )}
      
      {/* Image */}
      <img
        src={imageSrc}
        alt={alt}
        className={`w-full h-full transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
        style={{ objectFit }}
        width={width}
        height={height}
        onLoad={handleLoad}
        onError={handleError}
      />
      
      {/* Error state - show fallback if image fails to load */}
      {(loadError || (dynamicKey && error)) && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-50 text-gray-400">
          <span>Image not available</span>
        </div>
      )}
    </div>
  );
};
