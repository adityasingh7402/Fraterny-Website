
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchWebsiteSettings, updateWebsiteSetting, WebsiteSettings } from '@/services/website-settings';

/**
 * Enhanced website settings hook using React Query for improved caching and performance
 * 
 * @returns Object containing website settings data and utility functions
 */
export const useReactQueryWebsiteSettings = () => {
  const queryClient = useQueryClient();
  
  // Use React Query to fetch and cache website settings
  const { 
    data: settings, 
    isLoading, 
    error,
    refetch 
  } = useQuery({
    queryKey: ['websiteSettings'],
    queryFn: fetchWebsiteSettings,
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
    gcTime: 30 * 60 * 1000,  // Keep inactive data in cache for 30 minutes (formerly cacheTime)
  });

  /**
   * Function to update a specific website setting with optimistic updates
   */
  const updateSetting = async (key: string, value: string): Promise<boolean> => {
    // Store the previous settings for rollback if needed
    const previousSettings = queryClient.getQueryData(['websiteSettings']);
    
    // Optimistically update the UI
    queryClient.setQueryData(['websiteSettings'], (old: WebsiteSettings | undefined) => {
      if (!old) return old;
      return {
        ...old,
        [key]: value
      };
    });
    
    try {
      // Perform the actual update
      const success = await updateWebsiteSetting(key, value);
      
      if (success) {
        // If successful, invalidate and refetch to ensure data consistency
        await queryClient.invalidateQueries({ queryKey: ['websiteSettings'] });
        return true;
      } else {
        // If failed, rollback to previous data
        queryClient.setQueryData(['websiteSettings'], previousSettings);
        return false;
      }
    } catch (error) {
      // On error, rollback and return false
      console.error("Error updating setting:", error);
      queryClient.setQueryData(['websiteSettings'], previousSettings);
      return false;
    }
  };

  /**
   * Helper function to safely get a numeric setting with fallback
   */
  const getNumericSetting = (key: keyof WebsiteSettings, fallback: number): number => {
    if (!settings) return fallback;
    
    const value = settings[key];
    if (typeof value === 'number') return value;
    
    const parsedValue = parseInt(String(value));
    return isNaN(parsedValue) ? fallback : parsedValue;
  };

  /**
   * Helper function to safely get a string setting with fallback
   */
  const getStringSetting = (key: keyof WebsiteSettings, fallback: string): string => {
    if (!settings) return fallback;
    
    const value = settings[key];
    return value ? String(value) : fallback;
  };

  return {
    settings,
    isLoading,
    error,
    refetch,
    updateSetting,
    getNumericSetting,
    getStringSetting
  };
};
