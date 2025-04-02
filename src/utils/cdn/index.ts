
/**
 * CDN Utilities Module
 * Exports all CDN-related functionality
 */

// Re-export from config
export { 
  CDN_URL, 
  CDN_STORAGE_KEY,
  CDN_EXCLUSIONS_KEY,
  DEFAULT_EXCLUSIONS,
  CACHE_EXPIRATION
} from './cdnConfig';

// Re-export from exclusions
export {
  getPathExclusions,
  shouldExcludePath,
  addCdnPathExclusion,
  removeCdnPathExclusion,
  clearCdnPathExclusions,
  getDefaultExclusions
} from './cdnExclusions';

// Re-export from network
export {
  testCdnConnection,
  getCdnAvailability,
  isCdnAvailabilityCacheValid,
  getCdnError,
  resetCdnAvailabilityCache
} from './cdnNetwork';

// Re-export from url service
export {
  getCdnUrl,
  shouldUseCdn,
  isCdnEnabled,
  getCdnBaseUrl,
  parseSupabaseUrl
} from './cdnUrlService';
