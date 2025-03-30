
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
  sizes?: Record<string, string> | any; // Handle both Record type and Json from Supabase
  metadata?: Record<string, any>; // Made metadata optional to handle databases without this column
}

// Re-export other types here if needed
