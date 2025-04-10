
// Define the responsive image source type
export interface ResponsiveImageSource {
  mobile: string;
  tablet?: string;
  desktop: string;
}

// Add ImageLoadingState interface that was missing
export interface ImageLoadingState {
  isLoading: boolean;
  error: boolean;
  dynamicSrc: string | null;
  aspectRatio?: number;
  tinyPlaceholder: string | null;
  colorPlaceholder: string | null;
  contentHash: string | null;
  isCached: boolean;
  lastUpdated: string | null;
}

// Add objectFit to the ResponsiveImageProps interface - include scale-down in types
export interface ResponsiveImageProps {
  src?: string | ResponsiveImageSource;
  alt: string;
  className?: string;
  loading?: 'lazy' | 'eager';
  priority?: boolean;
  fetchPriority?: 'high' | 'low' | 'auto';
  onClick?: () => void;
  dynamicKey?: string;
  size?: 'small' | 'medium' | 'large';
  fallbackSrc?: string;
  width?: number;
  height?: number;
  sizes?: string;
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
  debugCache?: boolean;
}
