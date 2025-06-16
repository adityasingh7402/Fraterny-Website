// Define the responsive image source type
export interface ResponsiveImageSource {
  mobile: string;
  tablet?: string;
  desktop: string;
}

// Define the image cache entry type
export interface ImageCacheEntry {
  url: string;
  aspectRatio: number | undefined;
  tinyPlaceholder: string | null;
  colorPlaceholder: string | null;
  contentHash: string | null;
  timestamp: number;
  lastUpdated: string;
  globalVersion: string | null;
  networkType: string;
  deviceType: 'mobile' | 'desktop';
  estimatedSize: string;
}

// Define the memory cache entry type
export interface MemoryCacheEntry {
  data: ImageCacheEntry;
  timestamp: number;
  ttl: number;
}

// Add ImageLoadingState interface that was missing
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
