import React from 'react';

interface LoadingPlaceholderProps {
  alt: string;
  className?: string;
  width?: number | string;
  height?: number | string;
  aspectRatio?: number;
  placeholderSrc?: string; // Tiny image placeholder
  colorPlaceholder?: string; // Color-based placeholder as ultra-lightweight fallback
}

/**
 * Enhanced loading placeholder for images with progressive loading support
 * Implements a staged loading approach: color → tiny image → full image
 */
export const LoadingPlaceholder = ({ 
  alt,
  className = '',
  width,
  height,
  aspectRatio = 16/9,
  placeholderSrc,
  colorPlaceholder
}: LoadingPlaceholderProps) => {
  const containerStyle: React.CSSProperties = {
    width: width ? (typeof width === 'string' ? width : `${width}px`) : '100%',
    height: height ? (typeof height === 'string' ? height : `${height}px`) : 'auto',
    aspectRatio: width && height ? undefined : `${aspectRatio}`,
    backgroundColor: '#f3f4f6',
    position: 'relative',
    overflow: 'hidden'
  };

  // If we have a placeholder image, display it with blur effect
  if (placeholderSrc) {
    return (
      <div 
        className={`relative overflow-hidden ${className}`}
        style={containerStyle}
        aria-label={`Loading ${alt}`}
      >
        <img 
          src={placeholderSrc}
          alt={`Loading preview for ${alt}`}
          className="absolute inset-0 w-full h-full object-contain"
          loading="eager"
          fetchPriority="high" // Ensure placeholder loads ASAP
        />
        <div className="absolute inset-0 bg-gray-200 animate-pulse opacity-30" />
      </div>
    );
  }
  
  // If we have a color placeholder, use that as background
  if (colorPlaceholder) {
    return (
      <div 
        className={`relative overflow-hidden ${className}`}
        style={{
          ...containerStyle,
          backgroundImage: `url(${colorPlaceholder})`,
          backgroundSize: "contain",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat"
        }}
        aria-label={`Loading ${alt}`}
      >
        <div className="absolute inset-0 animate-pulse opacity-30" />
      </div>
    );
  }
  
  // Fallback to the standard loading placeholder
  return (
    <div 
      className={`bg-gray-200 animate-pulse ${className}`} 
      aria-label={`Loading ${alt}`}
      style={containerStyle}
    />
  );
};
