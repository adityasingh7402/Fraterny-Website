
import React from 'react';

interface ErrorPlaceholderProps {
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  fallbackSrc: string | React.ReactNode;
}

/**
 * Error placeholder for when image loading fails
 */
export const ErrorPlaceholder = ({ 
  alt, 
  className = '', 
  width, 
  height, 
  fallbackSrc 
}: ErrorPlaceholderProps) => {
  return (
    <div 
      className={`bg-gray-100 flex items-center justify-center ${className}`}
      style={{ 
        aspectRatio: width && height ? `${width}/${height}` : '16/9',
        width: width,
        height: height 
      }}
    >
      {typeof fallbackSrc === 'string' ? (
        <img 
          src={fallbackSrc} 
          alt={`Placeholder for ${alt}`} 
          className="max-h-full max-w-full p-4 opacity-30"
          width={width}
          height={height}
        />
      ) : (
        <div className="text-gray-400 text-sm text-center p-4">
          Image not found
        </div>
      )}
    </div>
  );
};
