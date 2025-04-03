/**
 * Handler for image requests
 */
import { createErrorPlaceholderSvg } from './placeholderHandler';

/**
 * Determines if a path is an image request
 * @param {string} pathname - URL pathname to check
 * @returns {boolean} True if the path is an image request
 */
export function isImageRequest(pathname) {
  return pathname.startsWith('/images/') || 
    pathname.startsWith('/website-images/') ||
    pathname.match(/\/\d+\-ChatGPT\-Image/) ||  // Handle timestamps with ChatGPT image paths
    pathname.includes('/storage/v1/object/public') ||
    pathname.startsWith('/lovable-uploads/');
}

/**
 * Constructs the origin URL to fetch the image from
 * @param {URL} url - Request URL
 * @returns {string} Origin URL
 */
export function constructOriginUrl(url) {
  // If the URL already contains the Supabase domain, extract just the path
  if (url.pathname.includes('/storage/v1/object/public')) {
    // It's already a Supabase URL - keep it as is
    const fullPath = url.pathname + url.search;  // Include query parameters
    return `https://eukenximajiuhrtljnpw.supabase.co${fullPath}`;
  } 
  // Special case for placeholder.svg
  else if (url.pathname.includes('placeholder.svg')) {
    return url.href;
  }
  else {
    // Regular images path - construct the Supabase URL
    return `https://eukenximajiuhrtljnpw.supabase.co/storage/v1/object/public${url.pathname}${url.search}`;
  }
}

/**
 * Fetches an image with retry logic
 * @param {string} url - URL to fetch
 * @param {Request} request - Original request
 * @param {number} maxAttempts - Maximum number of retry attempts
 * @returns {Response|null} Fetch response or null if failed
 */
export async function fetchWithRetry(url, request, maxAttempts = 2) {
  let attempts = 0;
  let response = null;
  
  // Special case for placeholder.svg - don't try to fetch from Supabase
  if (url.includes('placeholder.svg')) {
    return null; // Return null to trigger our placeholder generator
  }
  
  while (attempts < maxAttempts) {
    try {
      response = await fetch(url, {
        cf: {
          // Enable Cloudflare's image optimization if available
          image: {
            quality: 85,
            fit: "scale-down",
          },
          cacheTtl: 31536000, // Cache for 1 year
          cacheEverything: true,
        },
        headers: request.headers,
        method: request.method
      });
      
      // If successful, break out of retry loop
      if (response.ok) break;
      
      // If not found, no need to retry
      if (response.status === 404) break;
      
      console.log(`Attempt ${attempts + 1} failed with status ${response.status}`);
      
    } catch (fetchError) {
      console.error(`Attempt ${attempts + 1} failed: ${fetchError.message}`);
    }
    
    // Exponential backoff before retry
    attempts++;
    if (attempts < maxAttempts) {
      const backoffMs = Math.min(1000 * Math.pow(2, attempts), 3000);
      await new Promise(resolve => setTimeout(resolve, backoffMs));
    }
  }
  
  return response;
}

/**
 * Handles image requests
 * @param {URL} url - Request URL
 * @param {Request} request - Original request
 * @param {Object} corsHeaders - CORS headers to include in response
 * @returns {Promise<Response>} Response with the image or error
 */
export async function handleImageRequest(url, request, corsHeaders) {
  try {
    // Extract the path to forward to origin
    const imagePath = url.pathname;
    
    // Determine the origin URL to fetch
    let originUrl = constructOriginUrl(url);
    
    console.log(`Forwarding request to: ${originUrl}`);
    
    // Fetch the image with retry logic
    const response = await fetchWithRetry(originUrl, request);
    
    // If the image exists, return it with proper headers
    if (response && response.ok) {
      let newHeaders = new Headers(response.headers);
      
      // Add CORS headers
      Object.keys(corsHeaders).forEach(key => {
        newHeaders.set(key, corsHeaders[key]);
      });
      
      // Add caching headers for better performance
      newHeaders.set('Cache-Control', 'public, max-age=31536000');
      newHeaders.set('CDN-Cache', 'HIT');
      newHeaders.set('CDN-Provider', 'Cloudflare-Worker');
      
      // Return the response with the updated headers
      return new Response(response.body, {
        status: response.status,
        headers: newHeaders
      });
    } else {
      // Get error status or default to 404
      const errorStatus = response ? response.status : 404;
      const errorMessage = response ? `Origin returned ${response.status}` : 'Image not found';
      
      // If image doesn't exist, return proper error response with placeholder
      if (url.searchParams.get('format') === 'json') {
        // Return JSON error if requested
        return new Response(JSON.stringify({
          error: 'Image not found',
          path: imagePath,
          status: errorStatus,
          message: errorMessage
        }), {
          status: errorStatus,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
            'Cache-Control': 'no-store'
          }
        });
      } else {
        // Return placeholder SVG
        return createErrorPlaceholderSvg(imagePath, corsHeaders);
      }
    }
  } catch (error) {
    console.error(`Error handling image request for ${url.pathname}:`, error);
    
    // Return JSON error if requested
    if (url.searchParams.get('format') === 'json') {
      return new Response(JSON.stringify({
        error: 'Error processing image',
        path: url.pathname,
        message: error.message || 'Unknown error'
      }), {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store'
        }
      });
    }
    
    // Otherwise return error placeholder
    return createErrorPlaceholderSvg(url.pathname, corsHeaders, error.message);
  }
}
