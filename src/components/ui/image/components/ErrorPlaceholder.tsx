import React from 'react';

interface ErrorPlaceholderProps {
  alt: string;
  className?: string;
  width?: number | string;
  height?: number | string;
  isHero?: boolean;
  onRetry?: () => void;
  errorType?: 'network' | 'format' | 'size' | 'corrupt';
}

const ERROR_MESSAGES = {
  network: 'Network error. Please check your connection.',
  format: 'Image format not supported.',
  size: 'Image size too large.',
  corrupt: 'Image file is corrupted.'
};

/**
 * Error placeholder for when image loading fails
 */
export const ErrorPlaceholder: React.FC<ErrorPlaceholderProps> = ({
  alt,
  className = '',
  width,
  height,
  isHero = false,
  onRetry,
  errorType = 'network'
}) => {
  // Calculate container style
  const containerStyle: React.CSSProperties = {
    width: typeof width === 'string' ? width : width ? `${width}px` : '100%',
    height: typeof height === 'string' ? height : height ? `${height}px` : 'auto',
    position: 'relative',
    overflow: 'hidden'
  };

  return (
    <div 
      className={`relative ${className}`}
      style={containerStyle}
      role="alert"
      aria-label={`Error loading ${alt}`}
    >
      {/* Error background */}
      <div className="absolute inset-0 bg-gray-100" />

      {/* Error content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
        {/* Error icon */}
        <div className="w-12 h-12 mb-4 text-red-500">
          <svg
            className="w-full h-full"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>

        {/* Error message */}
        <p className="text-sm text-gray-600 mb-4">
          {ERROR_MESSAGES[errorType]}
        </p>

        {/* Retry button */}
        {onRetry && (
          <button
            onClick={onRetry}
            className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            aria-label="Retry loading image"
          >
            Retry
          </button>
        )}
      </div>

      {/* Error type indicator */}
      <div className="absolute bottom-2 right-2 text-xs text-gray-500">
        {errorType.toUpperCase()}
      </div>
    </div>
  );
};
