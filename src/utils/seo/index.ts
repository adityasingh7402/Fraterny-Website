// Export all structured data functions
export {
  generateImageStructuredData,
  generateImageOpenGraphTags,
  insertStructuredData,
  insertOpenGraphTags
} from './structuredData';

// Export domain utilities
export {
  getCurrentDomain,
  getCanonicalUrl,
  getSitemapUrl,
  getRobotsUrl,
  isUsDomain,
  isInDomain
} from './domainUtils';

// Export types that might be useful
export type { SEOMetadata } from '@/services/images/types';
