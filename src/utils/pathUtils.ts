/**
 * Path normalization utilities for consistent image path handling
 */

/**
 * Normalizes storage paths to ensure consistent formatting
 * - Removes duplicate "website-images/" prefixes
 * - Ensures paths are properly formatted for use in URLs
 * 
 * @param path Storage path to normalize
 * @returns Normalized path without duplicate bucket prefixes
 */
export const normalizeStoragePath = (path: string): string => {
  if (!path) return '';
  
  // Normalize slashes - ensure path doesn't start with slash for consistent joining
  let normalizedPath = path.trim();
  normalizedPath = normalizedPath.startsWith('/') ? normalizedPath.substring(1) : normalizedPath;
  
  // Remove duplicate bucket prefixes
  const bucketName = 'website-images';
  const bucketPrefix = `${bucketName}/`;
  
  // Check if path starts with bucket prefix
  if (normalizedPath.startsWith(bucketPrefix)) {
    // If it already has the bucket name, just return the path as is
    return normalizedPath;
  }
  
  // Path doesn't have bucket prefix, so it's already correct
  return normalizedPath;
}

/**
 * Constructs a properly formatted storage path for Supabase
 * Ensures the bucket name is included exactly once
 * 
 * @param storagePath The raw storage path
 * @param bucketName The bucket name (defaults to 'website-images')
 * @returns A properly formatted storage path
 */
export const constructStoragePath = (
  storagePath: string, 
  bucketName: string = 'website-images'
): string => {
  // Normalize the path first
  const normalizedPath = normalizeStoragePath(storagePath);
  
  // If the path already starts with the bucket name, return it
  if (normalizedPath.startsWith(`${bucketName}/`)) {
    return normalizedPath;
  }
  
  // Otherwise, add the bucket name prefix
  return `${bucketName}/${normalizedPath}`;
}

/**
 * Constructs a properly formatted URL for the CDN
 * 
 * @param storagePath The raw storage path
 * @returns A properly formatted CDN path
 */
export const constructCdnPath = (storagePath: string): string => {
  // Normalize first to ensure consistency
  const normalizedPath = normalizeStoragePath(storagePath);
  
  // For CDN, we need to ensure the path includes the bucket name
  if (normalizedPath.startsWith('website-images/')) {
    return normalizedPath;
  }
  
  // Otherwise, add the bucket name prefix
  return `website-images/${normalizedPath}`;
}
