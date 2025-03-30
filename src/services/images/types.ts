
export interface WebsiteImage {
  id: string;
  key: string;
  description: string;
  storage_path: string;
  alt_text: string;
  category?: string;
  created_at: string;
  updated_at: string;
  width?: number;
  height?: number;
  sizes?: Record<string, string> | any; // Updated to handle Json type from Supabase
  metadata?: Record<string, any>; // Added for placeholder storage
}

// Re-export other types here if needed
