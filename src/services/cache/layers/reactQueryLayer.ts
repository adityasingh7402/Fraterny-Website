/**
 * React Query cache layer implementation
 */

import { getQueryClient, isReactQueryAvailable } from '../queryClient';
import { WebsiteImage } from '../../images/types';
import { isValidWebsiteImage } from '../types';

/**
 * Get an image from React Query cache
 */
export const getImageFromReactQuery = (key: string): WebsiteImage | null => {
  if (!isReactQueryAvailable()) return null;

  try {
    const queryClient = getQueryClient();
    const queryKey = ['image', key];
    const cachedData = queryClient?.getQueryData(queryKey);

    if (cachedData !== undefined && isValidWebsiteImage(cachedData)) {
      return cachedData as WebsiteImage; // ✅ TS-safe casting
    }
  } catch (error) {
    console.error(`[ReactQueryCache] Error getting image data:`, error);
  }

  return null;
};

/**
 * Set an image in React Query cache
 */
export const setImageInReactQuery = (key: string, data: WebsiteImage): boolean => {
  if (!isReactQueryAvailable()) return false;

  if (!isValidWebsiteImage(data)) {
    console.warn(`[ReactQueryCache] Attempted to cache invalid WebsiteImage data:`, data);
    return false;
  }

  try {
    const queryClient = getQueryClient();
    const queryKey = ['image', key];
    queryClient?.setQueryData(queryKey, data);
    return true;
  } catch (error) {
    console.error(`[ReactQueryCache] Error setting image data:`, error);
    return false;
  }
};

/**
 * Get an image URL from React Query cache
 */
export const getImageUrlFromReactQuery = (key: string, size?: string): string | null => {
  if (!isReactQueryAvailable()) return null;

  try {
    const queryClient = getQueryClient();
    const queryKey = ['imageUrl', key, size];
    const cachedData = queryClient?.getQueryData(queryKey);

    if (cachedData !== undefined) {
      if (isValidWebsiteImage(cachedData) && typeof (cachedData as any).url === 'string') {
        return (cachedData as any).url;
      } else if (
        typeof cachedData === 'object' &&
        cachedData !== null &&
        'url' in cachedData &&
        typeof (cachedData as any).url === 'string'
      ) {
        return (cachedData as any).url;
      }
    }
  } catch (error) {
    console.error(`[ReactQueryCache] Error getting URL data:`, error);
  }

  return null;
};

/**
 * Set an image URL in React Query cache
 */
export const setImageUrlInReactQuery = (key: string, url: string, size?: string): boolean => {
  if (!isReactQueryAvailable()) return false;

  if (typeof url !== 'string' || url.trim() === '') {
    console.warn(`[ReactQueryCache] Attempted to cache invalid URL:`, url);
    return false;
  }

  try {
    const queryClient = getQueryClient();
    const queryKey = ['imageUrl', key, size];
    queryClient?.setQueryData(queryKey, { url, key, size });
    return true;
  } catch (error) {
    console.error(`[ReactQueryCache] Error setting URL data:`, error);
    return false;
  }
};

/**
 * Invalidate an image in React Query cache
 */
export const invalidateImageInReactQuery = (key: string): boolean => {
  if (!isReactQueryAvailable()) return false;

  try {
    const queryClient = getQueryClient();

    queryClient?.invalidateQueries({ queryKey: ['image', key] });
    queryClient?.invalidateQueries({ queryKey: ['imageUrl', key] });

    return true;
  } catch (error) {
    console.error(`[ReactQueryCache] Error invalidating image:`, error);
    return false;
  }
};

/**
 * Invalidate a category of images in React Query cache
 */
export const invalidateCategoryInReactQuery = (category: string): boolean => {
  if (!isReactQueryAvailable()) return false;

  try {
    const queryClient = getQueryClient();

    queryClient?.invalidateQueries({
      queryKey: ['images', 'category', category],
      refetchType: 'all',
    });

    return true;
  } catch (error) {
    console.error(`[ReactQueryCache] Error invalidating category:`, error);
    return false;
  }
};

/**
 * Invalidate images by prefix in React Query cache
 */
export const invalidateByPrefixInReactQuery = (prefix: string): boolean => {
  if (!isReactQueryAvailable()) return false;

  try {
    const queryClient = getQueryClient();

    queryClient?.invalidateQueries({
      predicate: (query) => {
        const queryKey = query.queryKey;
        if (Array.isArray(queryKey) && queryKey.length >= 2) {
          return (
            (queryKey[0] === 'image' || queryKey[0] === 'imageUrl') &&
            typeof queryKey[1] === 'string' &&
            queryKey[1].startsWith(prefix)
          );
        }
        return false;
      },
      refetchType: 'none',
    });

    return true;
  } catch (error) {
    console.error(`[ReactQueryCache] Error invalidating by prefix:`, error);
    return false;
  }
};

/**
 * Clear all image caches in React Query
 */
export const clearReactQueryCache = (): boolean => {
  if (!isReactQueryAvailable()) return false;

  try {
    const queryClient = getQueryClient();

    queryClient?.invalidateQueries({ queryKey: ['image'], exact: false });
    queryClient?.invalidateQueries({ queryKey: ['imageUrl'], exact: false });
    queryClient?.invalidateQueries({ queryKey: ['images'], exact: false });

    return true;
  } catch (error) {
    console.error(`[ReactQueryCache] Error clearing cache:`, error);
    return false;
  }
};
