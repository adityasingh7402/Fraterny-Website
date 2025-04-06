
/**
 * Utility functions for file operations
 */

/**
 * Sanitize a filename to ensure it's safe to use in storage paths
 */
export const sanitizeFilename = (filename: string): string => {
  if (!filename) return 'unnamed-file';
  
  // Remove any path components
  let sanitized = filename.split(/[\/\\]/).pop() || filename;
  
  // Replace spaces and special characters
  sanitized = sanitized
    .replace(/[^a-zA-Z0-9._-]/g, '-')
    .replace(/--+/g, '-')
    .toLowerCase();
    
  return sanitized;
};

/**
 * Get the file extension from a filename or path
 */
export const getFileExtension = (filename: string): string => {
  if (!filename) return '';
  
  const parts = filename.split('.');
  if (parts.length <= 1) return '';
  
  return parts.pop()?.toLowerCase() || '';
};

/**
 * Check if a file is an image based on its type
 */
export const isImageFile = (file: File): boolean => {
  return file.type.startsWith('image/');
};

/**
 * Format bytes into a human-readable string
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};
