
import { useQuery } from '@tanstack/react-query';
import { fetchWebsiteSettings, updateWebsiteSetting, WebsiteSettings } from '@/services/website-settings';

/**
 * Custom hook for accessing and managing website settings
 * 
 * @returns Object containing website settings data and utility functions
 */
export const useWebsiteSettings = () => {
  // Fetch website settings with react-query
  const { 
    data: settings, 
    isLoading, 
    error, 
    refetch 
  } = useQuery({
    queryKey: ['websiteSettings'],
    queryFn: fetchWebsiteSettings,
  });

  /**
   * Function to update a specific website setting
   * 
   * @param key - The key of the setting to update
   * @param value - The new value for the setting
   * @returns Promise that resolves to a boolean indicating success
   */
  const updateSetting = async (key: string, value: string): Promise<boolean> => {
    const success = await updateWebsiteSetting(key, value);
    if (success) {
      // Refetch the settings to update the cache
      refetch();
    }
    return success;
  };

  /**
   * Helper function to safely get a numeric setting with fallback
   * 
   * @param key - The key to look up in settings
   * @param fallback - Fallback value if the setting doesn't exist
   * @returns The setting value as a number or the fallback
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
   * 
   * @param key - The key to look up in settings
   * @param fallback - Fallback value if the setting doesn't exist
   * @returns The setting value as a string or the fallback
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
