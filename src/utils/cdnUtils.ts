
/**
 * Legacy CDN Utils Module - Kept for backwards compatibility
 * 
 * This file is maintained for existing imports, but all functionality
 * has been moved to dedicated modules in src/utils/cdn/
 */

// Re-export all functionality from the new modular structure
export * from './cdn';

// Add backwards compatibility for renamed functions
export { getPathExclusions as getCdnPathExclusions } from './cdn';
