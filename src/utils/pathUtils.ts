/**
 * Path normalization utilities for consistent image path handling
 */
import { STORAGE_BUCKET_NAME } from "@/services/images/constants";

/**
 * Normalizes storage paths to ensure consistent formatting
 * - Removes duplicate bucket prefixes
 * - Ensures paths are properly formatted for use in URLs
 */
export const normalizeStoragePath = (path: string): string => {
  if (!path) return '';
  
  // Normalize slashes - ensure path doesn't start with slash for consistent joining
  let normalizedPath = path.trim();
  normalizedPath = normalizedPath.startsWith('/') ? normalizedPath.substring(1) : normalizedPath;
  
  // Remove duplicate bucket prefixes - use the proper storage bucket name with correct spacing
  const bucketPrefix = `${STORAGE_BUCKET_NAME}/`;
  
  // If path contains multiple bucket prefixes, normalize it
  if (normalizedPath.includes(bucketPrefix)) {
    // Split by bucket prefix to identify duplicates
    const parts = normalizedPath.split(bucketPrefix);
    
    // If we have more than one part after splitting (excluding first empty part if any),
    // it means we have at least one bucket prefix
    if (parts.length > 1) {
      // Join all non-empty parts after the first occurrence of the bucket prefix
      const pathWithoutDuplicates = parts.slice(1).filter(Boolean).join('/');
      return `${bucketPrefix}${pathWithoutDuplicates}`;
    }
  }
  
  // If no bucket prefix found, path is already normalized or needs prefix
  if (!normalizedPath.startsWith(bucketPrefix)) {
    return `${bucketPrefix}${normalizedPath}`;
  }
  
  // Path already has exactly one bucket prefix
  return normalizedPath;
};

/**
 * Constructs a properly formatted storage path for Supabase
 */
export const constructStoragePath = (storagePath: string): string => {
  // Normalize the path first to remove any duplicate bucket names
  const normalizedPath = normalizeStoragePath(storagePath);
  
  // If the path already starts with the bucket name, return it
  if (normalizedPath.startsWith(`${STORAGE_BUCKET_NAME}/`)) {
    return normalizedPath;
  }
  
  // Otherwise, add the bucket name prefix
  return `${STORAGE_BUCKET_NAME}/${normalizedPath}`;
};

/**
 * Converts Supabase internal storage path to URL-safe path
 * Handles the transformation from 'Website Images' to 'website-images' for URLs
 */
export const storagePathToCdnPath = (storagePath: string): string => {
  // First normalize to ensure consistent format with the correct bucket name
  const normalizedPath = normalizeStoragePath(storagePath);
  
  // Replace the storage bucket name with the URL-compatible format (lowercase, hyphenated)
  // This is needed because Supabase URLs use the hyphenated version
  return normalizedPath.replace(
    `${STORAGE_BUCKET_NAME}/`, 
    'website-images/'
  );
};

/**
 * Constructs a direct Supabase URL for public access to storage
 */
export const constructCdnUrl = (storagePath: string, baseUrl?: string): string => {
  const cdnPath = storagePathToCdnPath(storagePath);
  const baseUrl_ = baseUrl || 'https://eukenximajiuhrtljnpw.supabase.co/storage/v1/object/public/';
  
  return `${baseUrl_}${cdnPath}`;
};
