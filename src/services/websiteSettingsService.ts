
import { supabase } from "@/integrations/supabase/client";

export interface WebsiteSettings {
  registration_days_left: number;
  available_seats: number;
  registration_close_date: string;
}

// Define the shape of the data returned from the database
interface WebsiteSettingRow {
  key: string;
  value: string;
}

/**
 * Fetches website settings from Supabase
 */
export const fetchWebsiteSettings = async (): Promise<WebsiteSettings> => {
  try {
    // Using type assertion to bypass the type checking issue
    const { data, error } = await supabase
      .from('website_settings')
      .select('key, value') as { data: WebsiteSettingRow[] | null, error: any };
    
    if (error) {
      console.error('Error fetching website settings:', error);
      throw error;
    }
    
    const defaultSettings: WebsiteSettings = {
      registration_days_left: 30,
      available_seats: 20,
      registration_close_date: '2025-03-31',
    };
    
    // Convert the array of key-value pairs into an object
    if (data && data.length > 0) {
      const settings = data.reduce((acc: Record<string, string>, item: WebsiteSettingRow) => {
        acc[item.key] = item.value;
        return acc;
      }, {});
      
      return {
        registration_days_left: parseInt(settings.registration_days_left || defaultSettings.registration_days_left.toString()),
        available_seats: parseInt(settings.available_seats || defaultSettings.available_seats.toString()),
        registration_close_date: settings.registration_close_date || defaultSettings.registration_close_date,
      };
    }
    
    return defaultSettings;
  } catch (error) {
    console.error('Failed to fetch website settings:', error);
    // Return default values if there's an error
    return {
      registration_days_left: 30,
      available_seats: 20,
      registration_close_date: '2025-03-31',
    };
  }
};

/**
 * Formats the registration close date into a human-readable format
 */
export const formatRegistrationCloseDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'long',
      year: 'numeric'
    }).format(date);
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'March 2025'; // Fallback
  }
};
