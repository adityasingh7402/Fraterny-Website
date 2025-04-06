
import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useMemo } from 'react';
import { setQueryClient, CacheLayerType, CacheOptions } from '@/services/cache';
import { useNetworkStatus } from './use-network-status';

/**
 * Hook to access the cache coordinator with React Query integration
 */
export const useCacheCoordinator = () => {
  const queryClient = useQueryClient();
  const network = useNetworkStatus();
  
  // Register query client with cache coordinator if not already registered
  useEffect(() => {
    setQueryClient(queryClient);
  }, [queryClient]);
  
  // Create network-aware cache options
  const cacheOptions = useMemo(() => {
    // Determine appropriate cache options based on network conditions
    const isOffline = !network.online;
    const isSlowConnection = ['slow-2g', '2g'].includes(network.effectiveConnectionType);
    const isMediumConnection = ['3g'].includes(network.effectiveConnectionType);
    const isSaveData = network.saveDataEnabled;
    
    if (isOffline) {
      // When offline, prioritize localStorage and don't attempt network fetches
      return {
        priority: 1 as const,
        ttl: 24 * 60 * 60 * 1000, // 24 hours for offline
        layers: ['memory', 'localStorage', 'serviceWorker'] as CacheLayerType[],
        skipLayers: ['reactQuery'] as CacheLayerType[], // Skip React Query to avoid refetches
      };
    }
    
    if (isSlowConnection || isSaveData) {
      // On slow connections or save data mode, prioritize cache and extend TTL
      return {
        priority: 2 as const,
        ttl: 60 * 60 * 1000, // 1 hour for slow connections
        layers: ['memory', 'localStorage', 'reactQuery', 'serviceWorker'] as CacheLayerType[],
      };
    }
    
    if (isMediumConnection) {
      // Medium connections get standard caching
      return {
        priority: 3 as const,
        ttl: 15 * 60 * 1000, // 15 minutes for medium connections
        layers: ['memory', 'localStorage', 'reactQuery', 'serviceWorker'] as CacheLayerType[],
      };
    }
    
    // Fast connections get shorter TTL
    return {
      priority: 3 as const,
      ttl: 5 * 60 * 1000, // 5 minutes for fast connections
      layers: ['memory', 'localStorage', 'reactQuery', 'serviceWorker'] as CacheLayerType[],
    };
  }, [
    network.online, 
    network.effectiveConnectionType, 
    network.saveDataEnabled
  ]);

  return {
    // Simplified interface focused on the cache options
    cacheOptions,
    networkStatus: network,
    
    // Methods to be implemented
    getImage: async (key: string) => {
      // Implement properly with the new cache system
      const result = await queryClient.fetchQuery({
        queryKey: ['image', key],
        queryFn: async () => {
          // Fetch the image data
          return { key };
        },
        staleTime: cacheOptions.ttl,
      });
      return result;
    },
    
    getImageUrl: async (key: string, size?: string) => {
      // Get image URL, leveraging React Query cache
      const result = await queryClient.fetchQuery({
        queryKey: ['imageUrl', key, size],
        queryFn: async () => {
          // Use the supabase client to get the URL
          return `/placeholder.svg`;
        },
        staleTime: cacheOptions.ttl,
      });
      return result;
    },
    
    invalidateImage: async (key: string) => {
      // Invalidate all related queries for this image
      await queryClient.invalidateQueries({ queryKey: ['image', key] });
      await queryClient.invalidateQueries({ queryKey: ['imageUrl', key] });
    },
    
    invalidateAll: async () => {
      // Invalidate all image-related queries
      await queryClient.invalidateQueries({ queryKey: ['image'] });
      await queryClient.invalidateQueries({ queryKey: ['imageUrl'] });
    }
  };
};

/**
 * Hook that provides a simple interface for image cache operations
 */
export const useImageCache = () => {
  const coordinator = useCacheCoordinator();
  
  return {
    // Get image data
    getImage: async (key: string) => {
      return await coordinator.getImage(key);
    },
    
    // Get image URL
    getImageUrl: async (key: string, size?: string) => {
      return await coordinator.getImageUrl(key, size);
    },
    
    // Invalidate a specific image
    invalidateImage: async (key: string) => {
      await coordinator.invalidateImage(key);
    },
    
    // Invalidate all images
    invalidateAllImages: async () => {
      await coordinator.invalidateAll();
    },
    
    // Network-aware options
    networkStatus: coordinator.networkStatus,
    cacheOptions: coordinator.cacheOptions
  };
};
