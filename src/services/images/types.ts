
import { Json } from "@/integrations/supabase/types";

export interface WebsiteImage {
  id: string;
  key: string;
  description: string;
  storage_path: string;
  alt_text: string;
  category: string | null;
  sizes: Record<string, string> | Json | null;
  width: number | null;
  height: number | null;
  created_at: string;
  updated_at: string;
}
