
import { Database } from "@/integrations/supabase/types";

export interface WebsiteSettings {
  registration_days_left: number;
  available_seats: number;
  registration_close_date: string;
  accepting_applications_for_date: string;
  // Price fields
  insider_access_price: string;
  insider_access_original_price: string;
  main_experience_price: string;
  main_experience_original_price: string;
  executive_escape_price: string;
  executive_escape_original_price: string;
  // New field for applications received
  applications_received?: string;
  upcoming_editions: VillaEdition[];
}

export interface VillaEdition {
  id: string;
  startDate: string;        // ISO format: "2025-09-14"
  endDate: string;          // ISO format: "2025-09-20"
  timeFrame?: string | null; // Optional: "Morning: 9 AM - 12 PM"
  isActive: boolean;
  allocationStatus: 'available' | 'limited' | 'sold_out';
  allotedSeats: number;
  totalSeats: number;
  displayOrder: number;
  createdAt?: string;
}

// Define the shape of the data returned from the database
export type WebsiteSettingRow = Database['public']['Tables']['website_settings']['Row'];

// Cache for website settings
export interface SettingsCache {
  settings: WebsiteSettings | null;
  timestamp: number;
}
