
/**
 * Convenience file to re-export all CDN-related utilities
 * This helps avoid circular dependencies
 */

// Re-export from the cdn module
export * from './cdn/index';

// Create alias exports for the functions being used in PathExclusions.tsx
export const addCdnPathExclusion = (path: string): void => {
  const { addPathExclusion } = require('./cdn/cdnExclusions');
  addPathExclusion(path);
};

export const removeCdnPathExclusion = (path: string): void => {
  const { removePathExclusion } = require('./cdn/cdnExclusions');
  removePathExclusion(path);
};

export const clearCdnPathExclusions = (): void => {
  const { resetPathExclusions } = require('./cdn/cdnExclusions');
  resetPathExclusions();
};
