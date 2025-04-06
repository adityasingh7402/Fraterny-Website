
import { supabase } from "@/integrations/supabase/client";

/**
 * Create a new image record in the database
 */
export const createImageRecord = async (
  key: string,
  description: string,
  storagePath: string,
  altText: string,
  category: string | undefined,
  dimensions: { width: number | null, height: number | null },
  optimizedSizes: Record<string, string>
) => {
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
      sizes: optimizedSizes
    })
    .select()
    .single();
};
