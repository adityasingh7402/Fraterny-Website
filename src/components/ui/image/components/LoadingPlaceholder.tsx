
import React from 'react';

interface LoadingPlaceholderProps {
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  aspectRatio?: number;
}

/**
 * Loading placeholder for when images are still being fetched
 */
export const LoadingPlaceholder = ({ 
  alt,
  className = '',
  width,
  height,
  aspectRatio = 16/9
}: LoadingPlaceholderProps) => {
  return (
    <div 
      className={`bg-gray-200 animate-pulse ${className}`} 
      aria-label={`Loading ${alt}`}
      style={{ 
        aspectRatio: width && height ? `${width}/${height}` : aspectRatio ? `${aspectRatio}` : '16/9',
        width: width,
        height: height 
      }}
    ></div>
  );
};
