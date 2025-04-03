
/**
 * CORS utilities for the CDN worker
 */

/**
 * Creates CORS headers for cross-origin requests
 * @returns {Object} CORS headers
 */
export function getCorsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, HEAD, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
}
