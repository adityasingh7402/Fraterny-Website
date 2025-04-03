
/**
 * Handler for placeholder image requests
 */

/**
 * Creates a SVG placeholder image
 * @param {Object} corsHeaders - CORS headers to include in response
 * @returns {Response} SVG placeholder response
 */
export function createPlaceholderSvg(corsHeaders) {
  // Create a simple SVG placeholder with brand colors
  const placeholderSvg = `<svg width="800" height="600" xmlns="http://www.w3.org/2000/svg">
    <rect width="800" height="600" fill="#0A1A2F"/>
    <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="32" text-anchor="middle" fill="#fff">Image Placeholder</text>
  </svg>`;
  
  return new Response(placeholderSvg, {
    headers: {
      ...corsHeaders,
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'public, max-age=86400'
    }
  });
}

/**
 * Creates an error placeholder SVG with the error message
 * @param {string} path - Image path that failed to load
 * @param {Object} corsHeaders - CORS headers to include in response
 * @param {string} errorMessage - Optional error message to display
 * @returns {Response} Error SVG response
 */
export function createErrorPlaceholderSvg(path, corsHeaders, errorMessage) {
  const errorText = errorMessage ? `Error: ${errorMessage}` : 'Image Not Found';
  
  const errorSvg = `<svg width="800" height="600" xmlns="http://www.w3.org/2000/svg">
    <rect width="800" height="600" fill="#0A1A2F"/>
    <text x="50%" y="45%" font-family="Arial, sans-serif" font-size="32" text-anchor="middle" fill="#fff">Image Not Found</text>
    <text x="50%" y="55%" font-family="Arial, sans-serif" font-size="16" text-anchor="middle" fill="#E07A5F">Path: ${path}</text>
    ${errorMessage ? `<text x="50%" y="65%" font-family="Arial, sans-serif" font-size="14" text-anchor="middle" fill="#D4AF37">${errorText}</text>` : ''}
  </svg>`;
  
  return new Response(errorSvg, {
    status: 200, // Return 200 OK instead of 404 to prevent client errors
    headers: {
      ...corsHeaders,
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'public, max-age=3600',
      'CDN-Cache': 'MISS',
      'CDN-Error': errorMessage || 'Image not found'
    }
  });
}
