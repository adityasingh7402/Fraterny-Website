
import { Json } from '@/integrations/supabase/types';

export interface ImageMetadata {
  placeholders?: {
    tiny?: string;
    color?: string;
  };
  contentHash?: string;
  lastModified?: string;
  [key: string]: any;
}

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
  sizes?: Record<string, string> | Json; // Handle both Record type and Json from Supabase
  metadata?: ImageMetadata | Json; // Updated to accept both structured type and Json from Supabase
  url?: string; // Add URL property that can be computed when needed
}

// Export ImageSizes interface for use in other files
export interface ImageSizes {
  small?: string;
  medium?: string;
  large?: string;
  original?: string;
}

// Re-export other types here if needed
