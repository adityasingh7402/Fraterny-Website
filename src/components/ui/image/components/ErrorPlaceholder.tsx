import React from 'react';

interface ErrorPlaceholderProps {
  alt: string;
  className?: string;
  width?: number | string;
  height?: number | string;
  aspectRatio?: number;
  fallbackSrc?: string | React.ReactNode;
}

/**
 * Error placeholder for when image loading fails
 */
export const ErrorPlaceholder = ({ 
  alt, 
  className = '', 
  width, 
  height, 
  aspectRatio = 16/9,
  fallbackSrc = '/placeholder.svg'
}: ErrorPlaceholderProps) => {
  const containerStyle: React.CSSProperties = {
    width: width ? (typeof width === 'string' ? width : `${width}px`) : '100%',
    height: height ? (typeof height === 'string' ? height : `${height}px`) : 'auto',
    aspectRatio: width && height ? undefined : `${aspectRatio}`,
    backgroundColor: '#f3f4f6',
    position: 'relative',
    overflow: 'hidden'
  };

  return (
    <div 
      className={`flex items-center justify-center ${className}`}
      style={containerStyle}
    >
      {typeof fallbackSrc === 'string' ? (
        <img 
          src={fallbackSrc} 
          alt={`Placeholder for ${alt}`} 
          className="absolute inset-0 w-full h-full object-contain opacity-30"
          width={typeof width === 'number' ? width : undefined}
          height={typeof height === 'number' ? height : undefined}
        />
      ) : (
        <div className="text-gray-400 text-sm text-center p-4">
          Image not found
        </div>
      )}
    </div>
  );
};
