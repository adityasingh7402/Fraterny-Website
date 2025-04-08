import React from 'react';

interface LoadingPlaceholderProps {
  alt: string;
  className?: string;
  width?: number | string;
  height?: number | string;
  isHero?: boolean;
  stage?: 'tiny' | 'low' | 'medium' | 'full';
  aspectRatio?: number;
  placeholderSrc?: string;
  colorPlaceholder?: string;
}

const STAGE_STYLES = {
  tiny: {
    blur: 'blur-sm',
    opacity: 'opacity-30'
  },
  low: {
    blur: 'blur',
    opacity: 'opacity-50'
  },
  medium: {
    blur: 'blur-0',
    opacity: 'opacity-70'
  },
  full: {
    blur: 'blur-0',
    opacity: 'opacity-100'
  }
};

/**
 * Enhanced loading placeholder for images with progressive loading support
 * Implements a staged loading approach: color → tiny image → full image
 */
export const LoadingPlaceholder: React.FC<LoadingPlaceholderProps> = ({
  alt,
  className = '',
  width,
  height,
  isHero = false,
  stage = 'tiny'
}) => {
  // Calculate container style
  const containerStyle: React.CSSProperties = {
    width: typeof width === 'string' ? width : width ? `${width}px` : '100%',
    height: typeof height === 'string' ? height : height ? `${height}px` : 'auto',
    position: 'relative',
    overflow: 'hidden'
  };

  // Get stage-specific styles
  const stageStyle = STAGE_STYLES[stage];

  return (
    <div 
      className={`relative ${className}`}
      style={containerStyle}
      role="status"
      aria-label={`Loading ${alt}`}
    >
      {/* Background with gradient animation */}
      <div 
        className={`absolute inset-0 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 
          animate-pulse ${stageStyle.opacity}`}
        style={{
          backgroundSize: '200% 100%',
          animation: 'gradient 1.5s ease infinite'
        }}
      />

      {/* Content placeholder */}
      <div 
        className={`absolute inset-0 flex items-center justify-center ${stageStyle.blur}`}
      >
        {isHero ? (
          // Hero image placeholder
          <div className="w-full h-full bg-gray-200" />
        ) : (
          // Regular image placeholder
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-gray-300 border-t-primary rounded-full animate-spin" />
          </div>
        )}
      </div>

      {/* Loading indicator */}
      <div className="absolute bottom-2 right-2 text-xs text-gray-500">
        {stage.toUpperCase()}
      </div>
    </div>
  );
};
