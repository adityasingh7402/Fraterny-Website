
/**
 * Type definitions for the responsive image components
 */

// Source can be a string or an object with responsive variants
export type ResponsiveImageSource = string | {
  mobile: string;
  tablet?: string;
  desktop: string;
};

// Props for the ResponsiveImage component
export interface ResponsiveImageProps {
  src: ResponsiveImageSource | "";
  alt: string;
  className?: string;
  loading?: 'lazy' | 'eager';
  priority?: boolean;
  fetchPriority?: 'high' | 'low' | 'auto';
  onClick?: () => void;
  dynamicKey?: string;
  size?: 'small' | 'medium' | 'large';
  fallbackSrc?: string;
  width?: number | string;
  height?: number | string;
  sizes?: string;
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
  debugCache?: boolean;
  preserveCropDimensions?: boolean;
}

// State for tracking image loading and metadata
export interface ImageLoadingState {
  isLoading: boolean;
  error: boolean;
  dynamicSrc: string | null;
  aspectRatio: number | undefined;
  tinyPlaceholder: string | null;
  colorPlaceholder: string | null;
  contentHash: string | null;
  isCached: boolean;
  lastUpdated: string | null;
  originalWidth?: number;
  originalHeight?: number;
}
