
import { supabase } from "@/integrations/supabase/client";
import { WebsiteSettings, WebsiteSettingRow, VillaEdition } from './types';
import { getSettingsFromCache, updateSettingsCache, invalidateSettingsCache } from './settingsCache';
import { calculateDaysLeft } from './dateUtils';

// Default settings to use when nothing is available
const DEFAULT_SETTINGS: WebsiteSettings = {
  registration_days_left: 30,
  available_seats: 20,
  registration_close_date: '2025-03-30',
  accepting_applications_for_date: 'February 2026',
  // Add the pricing fields
  insider_access_price: "₹499/month",
  insider_access_original_price: "₹699/month",
  main_experience_price: "₹45,000 - ₹60,000",
  main_experience_original_price: "₹65,000 - ₹80,000",
  executive_escape_price: "₹1,50,000+",
  executive_escape_original_price: "₹1,85,000+",
  // Set default for applications received
  applications_received: "42",
  // ADD THIS NEW FIELD
  upcoming_editions: [
    {
      id: "edition-1",
      startDate: "2025-09-14",
      endDate: "2025-09-20",
      timeFrame: null,
      isActive: true,
      allocationStatus: 'available',
      allotedSeats: 0,
      totalSeats: 20,
      displayOrder: 1,
      createdAt: new Date().toISOString()
    },
    {
      id: "edition-2",
      startDate: "2025-10-01",
      endDate: "2025-10-07",
      timeFrame: null,
      isActive: true,
      allocationStatus: 'available',
      allotedSeats: 0,
      totalSeats: 20,
      displayOrder: 2,
      createdAt: new Date().toISOString()
    },
    {
      id: "edition-3",
      startDate: "2025-10-09",
      endDate: "2025-10-15",
      timeFrame: null,
      isActive: true,
      allocationStatus: 'available',
      allotedSeats: 0,
      totalSeats: 20,
      displayOrder: 3,
      createdAt: new Date().toISOString()
    },
    {
      id: "edition-4",
      startDate: "2025-10-17",
      endDate: "2025-10-23",
      timeFrame: null,
      isActive: true,
      allocationStatus: 'available',
      allotedSeats: 0,
      totalSeats: 20,
      displayOrder: 4,
      createdAt: new Date().toISOString()
    }
  ]
};

/**
 * Fetches website settings from Supabase with caching
 */
export const fetchWebsiteSettings = async (): Promise<WebsiteSettings> => {
  try {
    // Check if we have valid cached settings
    const cachedSettings = getSettingsFromCache();
    if (cachedSettings) {
      return cachedSettings;
    }
    
    const { data, error } = await supabase
      .from('website_settings')
      .select('key, value');
    
    if (error) {
      console.error('Error fetching website settings:', error);
      throw error;
    }
    
    // Convert the array of key-value pairs into an object
    if (data && data.length > 0) {
      const settings = data.reduce((acc: Record<string, string>, item) => {
        acc[item.key] = item.value;
        return acc;
      }, {});
      
      const parsedSettings: WebsiteSettings = {
        registration_days_left: parseInt(settings.registration_days_left || DEFAULT_SETTINGS.registration_days_left.toString()),
        available_seats: parseInt(settings.available_seats || DEFAULT_SETTINGS.available_seats.toString()),
        registration_close_date: settings.registration_close_date || DEFAULT_SETTINGS.registration_close_date,
        accepting_applications_for_date: settings.accepting_applications_for_date || DEFAULT_SETTINGS.accepting_applications_for_date,
        // Add the pricing fields
        insider_access_price: settings.insider_access_price || DEFAULT_SETTINGS.insider_access_price,
        insider_access_original_price: settings.insider_access_original_price || DEFAULT_SETTINGS.insider_access_original_price,
        main_experience_price: settings.main_experience_price || DEFAULT_SETTINGS.main_experience_price,
        main_experience_original_price: settings.main_experience_original_price || DEFAULT_SETTINGS.main_experience_original_price,
        executive_escape_price: settings.executive_escape_price || DEFAULT_SETTINGS.executive_escape_price,
        executive_escape_original_price: settings.executive_escape_original_price || DEFAULT_SETTINGS.executive_escape_original_price,
        // Include applications_received field
        applications_received: settings.applications_received || DEFAULT_SETTINGS.applications_received,
        // ADD THIS - Parse upcoming editions from JSON
        upcoming_editions: settings.upcoming_editions 
          ? JSON.parse(settings.upcoming_editions) 
          : DEFAULT_SETTINGS.upcoming_editions
      };
      
      // Update cache
      updateSettingsCache(parsedSettings);
      
      return parsedSettings;
    }
    
    // Update cache with default settings
    updateSettingsCache(DEFAULT_SETTINGS);
    
    return DEFAULT_SETTINGS;
  } catch (error) {
    console.error('Failed to fetch website settings:', error);
    // Return default values if there's an error
    return DEFAULT_SETTINGS;
  }
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
 * Updates the days left count based on registration close date
 * Should be run once per day at midnight IST
 */
export const updateDaysLeftCount = async (): Promise<boolean> => {
  try {
    const settings = await fetchWebsiteSettings();
    
    // Use the local calculateDaysLeft function
    const daysLeft = calculateDaysLeft(settings.registration_close_date);
    
    return await updateWebsiteSetting('registration_days_left', daysLeft.toString());
  } catch (error) {
    console.error('Error updating days left count:', error);
    return false;
  }
};



/**
 * Get all upcoming editions
 */
export const fetchUpcomingEditions = async (): Promise<VillaEdition[]> => {
  const settings = await fetchWebsiteSettings();
  return settings.upcoming_editions || [];
};

/**
 * Update the entire editions array
 */
export const updateUpcomingEditions = async (
  editions: VillaEdition[]
): Promise<boolean> => {
  return await updateWebsiteSetting(
    'upcoming_editions', 
    JSON.stringify(editions)
  );
};

/**
 * Add a new edition
 */
export const addEdition = async (
  edition: Omit<VillaEdition, 'id' | 'createdAt'>
): Promise<boolean> => {
  const editions = await fetchUpcomingEditions();
  
  const newEdition: VillaEdition = {
    ...edition,
    id: `edition-${Date.now()}`,
    createdAt: new Date().toISOString()
  };
  
  editions.push(newEdition);
  return await updateUpcomingEditions(editions);
};

/**
 * Update a specific edition
 */
export const updateEdition = async (
  id: string,
  updates: Partial<VillaEdition>
): Promise<boolean> => {
  const editions = await fetchUpcomingEditions();
  const index = editions.findIndex(e => e.id === id);
  
  if (index === -1) return false;
  
  editions[index] = { ...editions[index], ...updates };
  return await updateUpcomingEditions(editions);
};

/**
 * Delete an edition
 */
export const deleteEdition = async (id: string): Promise<boolean> => {
  const editions = await fetchUpcomingEditions();
  const filtered = editions.filter(e => e.id !== id);
  
  return await updateUpcomingEditions(filtered);
};

/**
 * Reorder editions
 */
export const reorderEditions = async (
  editionIds: string[]
): Promise<boolean> => {
  const editions = await fetchUpcomingEditions();
  
  const reordered = editionIds.map((id, index) => {
    const edition = editions.find(e => e.id === id);
    return edition ? { ...edition, displayOrder: index + 1 } : null;
  }).filter(Boolean) as VillaEdition[];
  
  return await updateUpcomingEditions(reordered);
};
