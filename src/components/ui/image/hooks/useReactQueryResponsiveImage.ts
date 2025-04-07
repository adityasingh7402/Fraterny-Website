
import { useState, useEffect } from 'react';
import { useReactQueryImages } from '@/hooks/useReactQueryImages';
import { getImagePlaceholdersByKey } from '@/services/images';
import { useNetworkStatus } from '@/hooks/use-network-status';
import { ImageLoadingState } from '../types';

/**
 * Enhanced hook that combines React Query with existing image loading system
 */
export const useReactQueryResponsiveImage = (
  dynamicKey?: string,
  size?: 'small' | 'medium' | 'large',
  debugCache?: boolean
): ImageLoadingState => {
  const [state, setState] = useState<ImageLoadingState>({
    isLoading: !!dynamicKey,
    error: false,
    dynamicSrc: null,
    aspectRatio: undefined,
    tinyPlaceholder: null,
    colorPlaceholder: null,
    contentHash: null,
    isCached: false,
    lastUpdated: null
  });
  
  const network = useNetworkStatus();
  const { useImageUrl, useImage } = useReactQueryImages();
  
  // Use React Query to fetch the image URL
  const { 
    data: urlData, 
    isLoading: urlLoading,
    error: urlError
  } = useImageUrl(dynamicKey, size);
  
  // In parallel, fetch the image metadata to get additional information
  const {
    data: imageData,
    isLoading: imageLoading,
    error: imageError
  } = useImage(dynamicKey);
  
  // Combine the data from both queries to provide all necessary information
  useEffect(() => {
    if (!dynamicKey) return;
    
    const loadPlaceholders = async () => {
      try {
        if (!imageData && !urlData) return;
        
        // Get placeholders for progressive loading
        let placeholderData = { tinyPlaceholder: null, colorPlaceholder: null };
        
        // Prioritize placeholders on slow connections
        const fetchPlaceholdersFirst = ['slow-2g', '2g'].includes(network.effectiveConnectionType);
        
        if (fetchPlaceholdersFirst) {
          placeholderData = await getImagePlaceholdersByKey(dynamicKey);
          
          // Show placeholder immediately
          if (placeholderData.tinyPlaceholder) {
            setState(prev => ({
              ...prev,
              tinyPlaceholder: placeholderData.tinyPlaceholder,
              colorPlaceholder: placeholderData.colorPlaceholder,
            }));
          }
        }
        
        // If we have the URL data, we can show the image
        if (urlData && urlData.url) {
          // Check if we have any content hash from the metadata
          let contentHash = null;
          if (imageData && imageData.metadata && typeof imageData.metadata === 'object') {
            contentHash = imageData.metadata.contentHash || null;
          }
          
          // If we don't have placeholders yet, fetch them
          if (!placeholderData.tinyPlaceholder && !fetchPlaceholdersFirst) {
            placeholderData = await getImagePlaceholdersByKey(dynamicKey);
          }
          
          // Calculate aspect ratio
          let aspectRatio: number | undefined = undefined;
          if (imageData && imageData.width && imageData.height) {
            aspectRatio = imageData.width / imageData.height;
          }
          
          // Update state with all the information
          setState({
            isLoading: false,
            error: false,
            dynamicSrc: urlData.url,
            aspectRatio,
            tinyPlaceholder: placeholderData.tinyPlaceholder,
            colorPlaceholder: placeholderData.colorPlaceholder,
            contentHash,
            isCached: true, // We're using React Query, so it's always from cache first
            lastUpdated: imageData?.updated_at || null
          });
        }
      } catch (error) {
        console.error(`Error in useReactQueryResponsiveImage for ${dynamicKey}:`, error);
        setState(prev => ({ ...prev, error: true, isLoading: false }));
      }
    };
    
    // Only need to load placeholders if we have the URL
    if (!urlLoading && !imageLoading && !urlError && !imageError) {
      loadPlaceholders();
    }
    
    // Set error state if there was a problem
    if (urlError || imageError) {
      setState(prev => ({ ...prev, error: true, isLoading: false }));
    }
    
  }, [dynamicKey, urlData, imageData, urlLoading, imageLoading, urlError, imageError, network.effectiveConnectionType]);
  
  return state;
};
