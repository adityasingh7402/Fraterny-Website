/**
 * Domain detection and URL utilities for multi-domain SEO support
 * Supports both fraterny.in and fraterny.us
 */

/**
 * Get the current domain from window.location
 */
export const getCurrentDomain = (): string => {
  if (typeof window === 'undefined') {
    return 'https://fraterny.us'; // Default for SSR
  }
  
  const hostname = window.location.hostname;
  
  // Detect domain
  if (hostname.includes('fraterny.us')) {
    return 'https://fraterny.us';
  } else if (hostname.includes('fraterny.in')) {
    return 'https://fraterny.in';
  } else if (hostname === 'localhost' || hostname === '127.0.0.1') {
    // For local development, default to .us
    return 'https://fraterny.us';
  }
  
  // Fallback to .us for any other case
  return 'https://fraterny.us';
};

/**
 * Get canonical URL for the current page with correct domain
 */
export const getCanonicalUrl = (path: string = ''): string => {
  const domain = getCurrentDomain();
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${domain}${cleanPath}`;
};

/**
 * Get the correct sitemap URL for current domain
 */
export const getSitemapUrl = (): string => {
  const domain = getCurrentDomain();
  return `${domain}/sitemap.xml`;
};

/**
 * Get the correct robots.txt URL for current domain
 */
export const getRobotsUrl = (): string => {
  const domain = getCurrentDomain();
  return `${domain}/robots.txt`;
};

/**
 * Check if current domain is .us
 */
export const isUsDomain = (): boolean => {
  return getCurrentDomain().includes('fraterny.us');
};

/**
 * Check if current domain is .in
 */
export const isInDomain = (): boolean => {
  return getCurrentDomain().includes('fraterny.in');
};
