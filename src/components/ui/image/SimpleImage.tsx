
import React, { useState, useEffect } from 'react';
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
  
  // Better logging for debugging
  useEffect(() => {
    if (dynamicKey) {
      console.log(`[SimpleImage] Rendering with dynamicKey: "${dynamicKey}"`);
      console.log(`[SimpleImage] URL from hook: "${url}", isLoading: ${isLoading}, error: ${error}`);
    } else if (src) {
      console.log(`[SimpleImage] Rendering with direct src: "${src}"`);
    } else {
      console.log(`[SimpleImage] Rendering with fallback: "${fallbackSrc}"`);
    }
  }, [dynamicKey, url, isLoading, error, src, fallbackSrc]);
  
  // Determine the source to use
  const imageSrc = dynamicKey 
    ? (url || fallbackSrc) 
    : (src || fallbackSrc);
  
  const handleLoad = () => {
    console.log(`[SimpleImage] Image loaded successfully: ${imageSrc}`);
    setIsLoaded(true);
    onLoad?.();
  };
  
  const handleError = () => {
    console.error(`[SimpleImage] Image failed to load: ${imageSrc}`);
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
      
      {/* Error state with more details */}
      {(loadError || (dynamicKey && error)) && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-50 text-gray-400 p-2 text-sm">
          <span>Image not available</span>
          <span className="text-xs mt-1">{dynamicKey || src}</span>
        </div>
      )}
    </div>
  );
};
