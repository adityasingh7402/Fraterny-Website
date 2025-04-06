
import { useReactQueryImages } from './react-query-images';

// Re-export the hook for direct use
export { useReactQueryImages };

// Add exports for the individual hooks
export {
  useNetworkAwareCacheConfig,
  useImageQueries,
  useImageUrlQueries,
  usePrefetchImages,
  useInvalidateImageCache
} from './react-query-images';
