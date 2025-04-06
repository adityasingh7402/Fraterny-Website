
/**
 * Legacy facade for the image service
 * Maintains backward compatibility with existing code
 */

// Re-export everything from the new modular system
export * from './images';

// For debugging purposes, log when this file is imported
console.log('[IMAGE SYSTEM] Using updated image caching system with consistent storage bucket names');
