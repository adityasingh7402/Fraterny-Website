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
 * Constructs a properly formatted URL for the CDN
 * Ensures path always has the format: website-images/image-path.ext
 * 
 * @param storagePath The raw storage path
 * @returns A properly formatted CDN path
 */
export const constructCdnPath = (storagePath: string): string => {
  // Normalize first to ensure consistency and remove any duplicate prefixes
  const normalizedPath = normalizeStoragePath(storagePath);
  
  // Ensure the normalized path includes the bucket name exactly once
  const bucketName = 'website-images';
  if (!normalizedPath.startsWith(`${bucketName}/`)) {
    return `${bucketName}/${normalizedPath.replace(`${bucketName}/`, '')}`;
  }
  
  return normalizedPath;
};
