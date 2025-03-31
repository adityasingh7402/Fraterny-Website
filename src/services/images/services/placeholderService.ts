
import { supabase } from "@/integrations/supabase/client";
import { urlCache } from "../cacheService";
import { Json } from "@/integrations/supabase/types";

/**
 * Get image placeholders by key
 */
export const getImagePlaceholdersByKey = async (
  key: string
): Promise<{ 
  tinyPlaceholder: string | null; 
  colorPlaceholder: string | null;
}> => {
  // Check cache for placeholders
  const cachedTiny = urlCache.get(`placeholder:tiny:${key}`);
  const cachedColor = urlCache.get(`placeholder:color:${key}`);
  
  if (cachedTiny && cachedColor) {
    return { 
      tinyPlaceholder: cachedTiny, 
      colorPlaceholder: cachedColor 
    };
  }

  try {
    // Attempt to fetch placeholders from metadata
    const { data, error } = await supabase
      .from('website_images')
      .select('metadata')
      .eq('key', key)
      .maybeSingle();

    if (error || !data || !data.metadata) {
      return { tinyPlaceholder: null, colorPlaceholder: null };
    }

    // Safe access to nested properties using type checking
    let tinyPlaceholder = null;
    let colorPlaceholder = null;
    
    if (typeof data.metadata === 'object' && data.metadata !== null && !Array.isArray(data.metadata)) {
      const placeholders = data.metadata.placeholders;
      if (typeof placeholders === 'object' && placeholders !== null && !Array.isArray(placeholders)) {
        tinyPlaceholder = placeholders.tiny || null;
        colorPlaceholder = placeholders.color || null;
      }
    }

    // Cache the placeholders if they exist
    if (tinyPlaceholder) {
      urlCache.set(`placeholder:tiny:${key}`, tinyPlaceholder);
    }
    if (colorPlaceholder) {
      urlCache.set(`placeholder:color:${key}`, colorPlaceholder);
    }

    return { tinyPlaceholder, colorPlaceholder };
  } catch (e) {
    console.error(`Error fetching placeholders for key ${key}:`, e);
    return { tinyPlaceholder: null, colorPlaceholder: null };
  }
};
