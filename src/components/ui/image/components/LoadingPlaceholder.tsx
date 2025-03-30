
import React from 'react';

interface LoadingPlaceholderProps {
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  aspectRatio?: number;
  placeholderSrc?: string; // New prop for tiny image placeholder
}

/**
 * Loading placeholder for when images are still being fetched
 * Enhanced with Low-Quality Image Placeholder (LQIP) support
 */
export const LoadingPlaceholder = ({ 
  alt,
  className = '',
  width,
  height,
  aspectRatio = 16/9,
  placeholderSrc
}: LoadingPlaceholderProps) => {
  // If we have a placeholder image, display it with blur effect
  if (placeholderSrc) {
    return (
      <div 
        className={`relative overflow-hidden ${className}`}
        style={{ 
          aspectRatio: width && height ? `${width}/${height}` : aspectRatio ? `${aspectRatio}` : '16/9',
          width: width,
          height: height 
        }}
        aria-label={`Loading ${alt}`}
      >
        <img 
          src={placeholderSrc}
          alt={`Loading preview for ${alt}`}
          className="w-full h-full object-cover blur-sm scale-110"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gray-200 animate-pulse opacity-30" />
      </div>
    );
  }
  
  // Fallback to the standard loading placeholder
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
