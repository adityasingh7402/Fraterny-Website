
import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useMemo } from 'react';
import { cacheCoordinator, setQueryClient } from '@/services/cache/cacheCoordinator';
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
        layers: ['memory', 'localStorage', 'serviceWorker'],
        skipLayers: ['reactQuery'], // Skip React Query to avoid refetches
      };
    }
    
    if (isSlowConnection || isSaveData) {
      // On slow connections or save data mode, prioritize cache and extend TTL
      return {
        priority: 2 as const,
        ttl: 60 * 60 * 1000, // 1 hour for slow connections
        layers: ['memory', 'localStorage', 'reactQuery', 'serviceWorker'],
      };
    }
    
    if (isMediumConnection) {
      // Medium connections get standard caching
      return {
        priority: 3 as const,
        ttl: 15 * 60 * 1000, // 15 minutes for medium connections
        layers: ['memory', 'localStorage', 'reactQuery', 'serviceWorker'],
      };
    }
    
    // Fast connections get shorter TTL
    return {
      priority: 3 as const,
      ttl: 5 * 60 * 1000, // 5 minutes for fast connections
      layers: ['memory', 'localStorage', 'reactQuery', 'serviceWorker'],
    };
  }, [
    network.online, 
    network.effectiveConnectionType, 
    network.saveDataEnabled
  ]);

  return {
    ...cacheCoordinator,
    cacheOptions,
    networkStatus: network
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
      return await coordinator.getImage(key, coordinator.cacheOptions);
    },
    
    // Get image URL
    getImageUrl: async (key: string, size?: string) => {
      return await coordinator.getImageUrl(key, size, coordinator.cacheOptions);
    },
    
    // Cache an image
    cacheImage: async (key: string, data: any) => {
      await coordinator.setImage(key, data, coordinator.cacheOptions);
    },
    
    // Cache an image URL
    cacheImageUrl: async (key: string, url: string, size?: string) => {
      await coordinator.setImageUrl(key, url, size, coordinator.cacheOptions);
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
