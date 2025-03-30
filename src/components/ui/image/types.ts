
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
}

export interface ImageLoadingState {
  isLoading: boolean;
  error: boolean;
  dynamicSrc: string | null;
  aspectRatio?: number; // Changed from string to number to match what getImageAspectRatio returns
}
