
import { supabase } from "@/integrations/supabase/client";
import { WebsiteImage } from "./types";

/**
 * Update an existing image entry
 */
export const updateImage = async (
  id: string,
  data: Partial<WebsiteImage>
): Promise<WebsiteImage | null> => {
  const { data: updatedImage, error } = await supabase
    .from('website_images')
    .update({
      ...data,
      updated_at: new Date().toISOString()
    })
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error('Error updating image:', error);
    return null;
  }
  
  return updatedImage as WebsiteImage;
};
