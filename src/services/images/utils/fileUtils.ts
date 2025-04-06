/**
 * Utility functions for file operations
 */

/**
 * Sanitize a filename to ensure it works with Supabase storage
 * Remove special characters, spaces, and other problematic characters
 */
export const sanitizeFilename = (filename: string): string => {
  // Remove characters that might cause problems in URLs or file paths
  let sanitized = filename
    // Replace spaces, commas and special characters with hyphens
    .replace(/[,\s·]+/g, '-')
    // Remove all other special characters and keep only alphanumerics, hyphens, and dots
    .replace(/[^a-zA-Z0-9\-_.]/g, '')
    // Remove consecutive hyphens
    .replace(/-+/g, '-')
    // Trim hyphens from beginning and end
    .replace(/^-+|-+$/g, '');
  
  // Ensure the filename is not too long (max 100 chars)
  if (sanitized.length > 100) {
    const extension = sanitized.lastIndexOf('.') > 0 
      ? sanitized.substring(sanitized.lastIndexOf('.'))
      : '';
    sanitized = sanitized.substring(0, 100 - extension.length) + extension;
  }
  
  return sanitized;
};
