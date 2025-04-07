import { supabase } from "@/integrations/supabase/client";
import { WebsiteImage } from "../types";

interface CreateImageRecordParams {
  key: string;
  description: string;
  storagePath: string;
  altText: string;
  category?: string;
  dimensions: { width: number | null; height: number | null };
  optimizedSizes: Record<string, string>;
  metadata: {
    placeholders: {
      tiny: string | null;
      color: string | null;
    };
    contentHash: string;
    lastModified: string;
    optimizedVersions: Array<{
      format: string;
      width: number;
      height: number;
      quality: number;
    }>;
  };
}

/**
 * Create a new image record in the database with enhanced metadata
 */
export const createImageRecord = async ({
  key,
  description,
  storagePath,
  altText,
  category,
  dimensions,
  optimizedSizes,
  metadata
}: CreateImageRecordParams) => {
  return await supabase
    .from('website_images')
    .insert({
      key,
      description,
      storage_path: storagePath,
      alt_text: altText,
      category: category || null,
      width: dimensions.width,
      height: dimensions.height,
      sizes: optimizedSizes,
      metadata
    })
    .select()
    .single();
};
