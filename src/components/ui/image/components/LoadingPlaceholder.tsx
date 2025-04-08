
import React from 'react';

export interface LoadingPlaceholderProps {
  alt: string;
  className?: string;
  width?: number | string;
  height?: number | string;
  placeholderSrc?: string;
  colorPlaceholder?: string;
  aspectRatio?: number;
}

/**
 * Loading placeholder component for images
 */
export const LoadingPlaceholder = ({
  alt,
  className,
  width,
  height,
  placeholderSrc = '/placeholder.svg',
  colorPlaceholder,
  aspectRatio
}: LoadingPlaceholderProps) => {
  // Determine background styling
  const backgroundStyle = colorPlaceholder 
    ? { backgroundColor: colorPlaceholder }
    : { backgroundColor: '#f3f4f6' };
  
  // Apply dimensions directly to container
  const containerStyle: React.CSSProperties = {
    ...backgroundStyle,
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof height === 'number' ? `${height}px` : height,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    ...(aspectRatio ? { aspectRatio: aspectRatio.toString() } : {})
  };

  return (
    <div 
      className={`animate-pulse ${className || ''}`}
      style={containerStyle}
      role="img"
      aria-label={`Loading ${alt}`}
    >
      {placeholderSrc && (
        <img 
          src={placeholderSrc} 
          alt={`Loading placeholder for ${alt}`}
          className="w-full h-full object-cover opacity-30"
        />
      )}
    </div>
  );
};
