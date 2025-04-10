/**
 * Utility functions for database queries
 */
import { supabase } from "@/integrations/supabase/client";
import { handleApiError } from "@/utils/errorHandling";
import { WebsiteImage } from "../types";

/**
 * Create a base query for images with selective field fetching
 */
export const createImagesQuery = () => {
  return supabase.from('website_images')
    .select('id, key, alt_text, description, category, storage_path, metadata, sizes, width, height, created_at, updated_at', { 
      count: 'exact' 
    });
};

/**
 * Apply search filter to query
 */
export const applySearchFilter = (query: any, searchTerm?: string) => {
  if (searchTerm && searchTerm.trim().length > 0) {
    const term = searchTerm.trim();
    // Search in key, description, alt_text and category
    return query.or(`key.ilike.%${term}%,description.ilike.%${term}%,alt_text.ilike.%${term}%,category.ilike.%${term}%`);
  }
  return query;
};

/**
 * Apply pagination to query
 */
export const applyPagination = (query: any, page: number, pageSize: number) => {
  return query
    .order('created_at', { ascending: false })
    .range((page - 1) * pageSize, page * pageSize - 1);
};

/**
 * Process query response
 */
export const processQueryResponse = (
  data: any, 
  error: any, 
  count: number | null,
  errorMessage: string
): { images: WebsiteImage[], total: number } => {
  if (error) {
    return handleApiError(error, errorMessage, false) as unknown as { images: WebsiteImage[], total: number };
  }
  
  return { 
    images: data || [], 
    total: count || 0 
  };
};
