
import { Json } from '@/integrations/supabase/types';

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
  metadata?: Record<string, any> | Json; // Updated to accept both Record type and Json from Supabase
}

// Re-export other types here if needed
