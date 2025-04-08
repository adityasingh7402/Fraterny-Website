
import React from 'react';

export interface ErrorPlaceholderProps {
  alt: string;
  className?: string;
  width?: number | string;
  height?: number | string;
  fallbackSrc?: string;
  aspectRatio?: number;
}

/**
 * Error placeholder component for images
 */
export const ErrorPlaceholder = ({
  alt,
  className,
  width,
  height,
  fallbackSrc = '/placeholder.svg',
  aspectRatio
}: ErrorPlaceholderProps) => {
  // Apply dimensions directly to container
  const containerStyle: React.CSSProperties = {
    backgroundColor: '#f9fafb',
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof height === 'number' ? `${height}px` : height,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    border: '1px solid #e5e7eb',
    ...(aspectRatio ? { aspectRatio: aspectRatio.toString() } : {})
  };

  return (
    <div
      className={className || ''}
      style={containerStyle}
      role="img"
      aria-label={`Failed to load ${alt}`}
    >
      <img
        src={fallbackSrc}
        alt={`Error placeholder for ${alt}`}
        style={{
          width: '50%',
          height: '50%',
          opacity: 0.5,
          objectFit: 'contain'
        }}
      />
    </div>
  );
};
