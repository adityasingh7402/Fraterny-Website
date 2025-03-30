
export interface ResponsiveImageSource {
  mobile: string;
  tablet?: string;
  desktop: string;
}

export interface ResponsiveImageProps {
  src?: ResponsiveImageSource | string;
  alt: string;
  className?: string;
  loading?: 'lazy' | 'eager';
  fetchPriority?: 'high' | 'low' | 'auto';
  priority?: 'high' | 'low' | 'auto'; // Added as a replacement for fetchPriority
  onClick?: () => void;
  dynamicKey?: string;
  size?: 'small' | 'medium' | 'large';
  fallbackSrc?: string;
  width?: number;
  height?: number;
  sizes?: string;
  debugCache?: boolean; // New prop for debugging cache behavior
}

export interface ImageLoadingState {
  isLoading: boolean;
  error: boolean;
  dynamicSrc: string | null;
  aspectRatio?: number;
  tinyPlaceholder?: string | null; // Added tiny image placeholder
  colorPlaceholder?: string | null; // Added color-based placeholder
}

