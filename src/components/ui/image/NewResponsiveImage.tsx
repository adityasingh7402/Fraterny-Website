
import React, { useState } from 'react';
import { ViewportAwareImage } from './components/ViewportAwareImage';
import { useImageUrl } from '@/hooks/useDirectImage';
import { isValidImageUrl } from '@/services/images/validation';

interface ResponsiveImageProps {
  src?: string | { mobile: string, desktop: string };
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
  fallbackSrc?: string;
  dynamicKey?: string;
  priority?: boolean;
  fetchPriority?: 'high' | 'low' | 'auto';
}

/**
 * Simplified image component that handles both direct URLs and Supabase dynamic keys
 */
const NewResponsiveImage: React.FC<ResponsiveImageProps> = ({
  src,
  alt,
  className = '',
  width,
  height,
  objectFit = 'cover',
  fallbackSrc = '/placeholder.svg',
  dynamicKey,
  priority = false,
  fetchPriority
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  
  // If we have a dynamic key, use the direct integration
  const { url, isLoading, error } = useImageUrl(dynamicKey);
  
  // Determine the final source to use
  let finalSrc = fallbackSrc;
  
  if (dynamicKey) {
    // Use URL from the dynamic key if available
    finalSrc = url || fallbackSrc;
  } else if (typeof src === 'object' && 'mobile' in src) {
    // Handle responsive image object with mobile/desktop variants
    const isMobile = window.innerWidth < 768;
    finalSrc = isMobile ? src.mobile : (src.desktop || src.mobile);
  } else if (typeof src === 'string' && isValidImageUrl(src)) {
    // Use direct string src if valid
    finalSrc = src;
  }
  
  return (
    <div className="relative" style={{ width, height }}>
      {(dynamicKey && isLoading) && (
        <div className="absolute inset-0 bg-gray-100 animate-pulse rounded" />
      )}
      
      <ViewportAwareImage
        src={finalSrc}
        alt={alt}
        className={className || "w-full h-full"}
        width={width}
        height={height}
        objectFit={objectFit}
        fallbackSrc={fallbackSrc}
        fetchPriority={priority ? 'high' : fetchPriority}
        onLoad={() => setIsLoaded(true)}
      />
    </div>
  );
};

export default NewResponsiveImage;
