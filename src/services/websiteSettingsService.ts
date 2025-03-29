
import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";
import { format, parseISO } from "date-fns";
import { formatInTimeZone } from "date-fns-tz";

export interface WebsiteSettings {
  registration_days_left: number;
  available_seats: number;
  registration_close_date: string;
  accepting_applications_for_date: string;
}

// Define the shape of the data returned from the database
type WebsiteSettingRow = Database['public']['Tables']['website_settings']['Row'];

// Cache for website settings
let settingsCache: {
  settings: WebsiteSettings | null;
  timestamp: number;
} | null = null;

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

/**
 * Fetches website settings from Supabase with caching
 */
export const fetchWebsiteSettings = async (): Promise<WebsiteSettings> => {
  try {
    // Check if we have valid cached settings
    if (settingsCache && Date.now() - settingsCache.timestamp < CACHE_DURATION) {
      console.log('Using cached website settings');
      return settingsCache.settings as WebsiteSettings;
    }
    
    const { data, error } = await supabase
      .from('website_settings')
      .select('key, value');
    
    if (error) {
      console.error('Error fetching website settings:', error);
      throw error;
    }
    
    const defaultSettings: WebsiteSettings = {
      registration_days_left: 30,
      available_seats: 20,
      registration_close_date: '2025-03-30',
      accepting_applications_for_date: 'February 2026',
    };
    
    // Convert the array of key-value pairs into an object
    if (data && data.length > 0) {
      const settings = data.reduce((acc: Record<string, string>, item) => {
        acc[item.key] = item.value;
        return acc;
      }, {});
      
      const parsedSettings = {
        registration_days_left: parseInt(settings.registration_days_left || defaultSettings.registration_days_left.toString()),
        available_seats: parseInt(settings.available_seats || defaultSettings.available_seats.toString()),
        registration_close_date: settings.registration_close_date || defaultSettings.registration_close_date,
        accepting_applications_for_date: settings.accepting_applications_for_date || defaultSettings.accepting_applications_for_date,
      };
      
      // Update cache
      settingsCache = {
        settings: parsedSettings,
        timestamp: Date.now()
      };
      
      return parsedSettings;
    }
    
    // Update cache with default settings
    settingsCache = {
      settings: defaultSettings,
      timestamp: Date.now()
    };
    
    return defaultSettings;
  } catch (error) {
    console.error('Failed to fetch website settings:', error);
    // Return default values if there's an error
    const defaultSettings = {
      registration_days_left: 30,
      available_seats: 20,
      registration_close_date: '2025-03-30',
      accepting_applications_for_date: 'February 2026',
    };
    
    return defaultSettings;
  }
};

/**
 * Invalidates the settings cache, forcing a refresh on next fetch
 */
export const invalidateSettingsCache = (): void => {
  settingsCache = null;
  console.log('Website settings cache invalidated');
};

/**
 * Updates a website setting
 */
export const updateWebsiteSetting = async (key: string, value: string): Promise<boolean> => {
  try {
    // Check if the setting exists
    const { data: existingData, error: checkError } = await supabase
      .from('website_settings')
      .select('id')
      .eq('key', key)
      .maybeSingle();
    
    if (checkError) {
      console.error(`Error checking if setting "${key}" exists:`, checkError);
      return false;
    }
    
    if (existingData) {
      // Update existing setting
      const { error: updateError } = await supabase
        .from('website_settings')
        .update({ 
          value, 
          updated_at: new Date().toISOString() 
        })
        .eq('key', key);
      
      if (updateError) {
        console.error(`Error updating setting "${key}":`, updateError);
        return false;
      }
    } else {
      // Insert new setting
      const { error: insertError } = await supabase
        .from('website_settings')
        .insert({
          key,
          value
        });
      
      if (insertError) {
        console.error(`Error creating setting "${key}":`, insertError);
        return false;
      }
    }
    
    // Invalidate cache
    invalidateSettingsCache();
    
    return true;
  } catch (error) {
    console.error(`Unexpected error in updateWebsiteSetting for key "${key}":`, error);
    return false;
  }
};

/**
 * Calculates days left until a given date (in any timezone)
 * @param dateString - Target date in YYYY-MM-DD format
 * @param timezone - Timezone to use for calculation, defaults to 'Asia/Kolkata' (IST)
 * @returns Number of days left
 */
export const calculateDaysLeft = (dateString: string, timezone: string = 'Asia/Kolkata'): number => {
  try {
    const targetDate = new Date(dateString);
    
    // Get the current date in the specified timezone
    const nowInTimezone = new Date();
    const nowFormatted = formatInTimeZone(nowInTimezone, timezone, 'yyyy-MM-dd');
    const todayInTimezone = parseISO(nowFormatted);
    
    // Calculate difference in milliseconds
    const diffTime = targetDate.getTime() - todayInTimezone.getTime();
    
    // Convert to days and return (use Math.ceil to round up)
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  } catch (error) {
    console.error('Error calculating days left:', error);
    return 0;
  }
};

/**
 * Updates the days left count based on registration close date
 * Should be run once per day at midnight IST
 */
export const updateDaysLeftCount = async (): Promise<boolean> => {
  try {
    const settings = await fetchWebsiteSettings();
    const daysLeft = calculateDaysLeft(settings.registration_close_date);
    
    return await updateWebsiteSetting('registration_days_left', daysLeft.toString());
  } catch (error) {
    console.error('Error updating days left count:', error);
    return false;
  }
};

/**
 * Formats the registration close date into a human-readable format
 */
export const formatRegistrationCloseDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    return format(date, 'MMMM yyyy');
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'March 2025'; // Fallback
  }
};
