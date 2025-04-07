
import React from 'react';

interface ResponsivePictureProps {
  sources: {
    mobile: string;
    tablet?: string;
    desktop: string;
  };
  alt: string;
  className?: string;
  loading?: 'lazy' | 'eager';
  fetchPriority?: 'high' | 'low' | 'auto';
  onClick?: () => void;
  width?: number | string;
  height?: number | string;
  sizes?: string;
  fallbackSrc?: string;
  useMobileSrc?: boolean;
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
  preserveCropDimensions?: boolean;
}

/**
 * Component that uses the HTML picture element for responsive images
 * Enhanced to maintain consistent aspect ratios and preserve crop dimensions
 */
export const ResponsivePicture = ({
  sources,
  alt,
  className = '',
  loading = 'lazy',
  fetchPriority,
  onClick,
  width,
  height,
  sizes,
  fallbackSrc = '/placeholder.svg',
  useMobileSrc = false,
  objectFit = 'cover',
  preserveCropDimensions = false
}: ResponsivePictureProps) => {
  const { mobile, tablet, desktop } = sources;
  
  // Use mobile source directly if specified
  const imgSrc = useMobileSrc ? mobile : desktop || mobile;
  
  // Style for the image, including object-fit property
  const imgStyle: React.CSSProperties = {
    width: '100%',
    height: '100%',
    objectFit
  };
  
  // If preserving crop dimensions, ensure consistent positioning
  if (preserveCropDimensions) {
    imgStyle.objectPosition = 'center';
  }
  
  return (
    <picture>
      {/* Mobile source */}
      <source 
        srcSet={mobile} 
        media="(max-width: 640px)" 
      />
      
      {/* Tablet source (if provided) */}
      {tablet && (
        <source 
          srcSet={tablet} 
          media="(min-width: 641px) and (max-width: 1024px)" 
        />
      )}
      
      {/* Desktop source */}
      <source 
        srcSet={desktop} 
        media="(min-width: 1025px)" 
      />
      
      {/* Fallback image element */}
      <img
        src={imgSrc || fallbackSrc}
        alt={alt}
        className={className}
        loading={loading}
        fetchpriority={fetchPriority}
        onClick={onClick}
        width={width}
        height={height}
        sizes={sizes}
        style={imgStyle}
        onError={(e) => {
          // Fallback to the default image if the source fails to load
          (e.target as HTMLImageElement).src = fallbackSrc;
        }}
      />
    </picture>
  );
};
