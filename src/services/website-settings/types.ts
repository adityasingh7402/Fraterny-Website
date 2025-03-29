
import { Database } from "@/integrations/supabase/types";

export interface WebsiteSettings {
  registration_days_left: number;
  available_seats: number;
  registration_close_date: string;
  accepting_applications_for_date: string;
}

// Define the shape of the data returned from the database
export type WebsiteSettingRow = Database['public']['Tables']['website_settings']['Row'];

// Cache for website settings
export interface SettingsCache {
  settings: WebsiteSettings | null;
  timestamp: number;
}
