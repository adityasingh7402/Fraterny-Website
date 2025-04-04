
/**
 * Handler for image requests
 */
import { createErrorPlaceholderSvg } from './placeholderHandler';

// Added debug mode for worker
const DEBUG_WORKER = true;

/**
 * Normalizes storage paths to ensure consistent formatting
 * This is a JavaScript version of the TypeScript util since workers use plain JS
 * 
 * @param {string} path Storage path to normalize
 * @returns {string} Normalized path without duplicate bucket prefixes
 */
function normalizeStoragePath(path) {
  if (!path) return '';
  
  // Normalize slashes - ensure path doesn't start with slash for consistent joining
  let normalizedPath = path.trim();
  normalizedPath = normalizedPath.startsWith('/') ? normalizedPath.substring(1) : normalizedPath;
  
  // Remove duplicate bucket prefixes
  const bucketName = 'website-images';
  const bucketPrefix = `${bucketName}/`;
  
  // If path starts with duplicate bucket names, normalize it
  const bucketPrefixCount = normalizedPath.split(bucketPrefix).length - 1;
  
  if (bucketPrefixCount > 1) {
    // Remove all occurrences and add back once
    const pathWithoutBucket = normalizedPath.replace(new RegExp(bucketPrefix, 'g'), '');
    return `${bucketPrefix}${pathWithoutBucket}`;
  }
  
  // Return the path with proper bucket prefix
  if (!normalizedPath.startsWith(bucketPrefix)) {
    return `${bucketPrefix}${normalizedPath}`;
  }
  
  return normalizedPath;
}

/**
 * Determines if a path is an image request
 * @param {string} pathname - URL pathname to check
 * @returns {boolean} True if the path is an image request
 */
export function isImageRequest(pathname) {
  // Enhanced path detection for better matching
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
  // Get the path and normalize it
  let path = url.pathname;
  
  // If the URL already contains the Supabase domain, extract just the path
  if (path.includes('/storage/v1/object/public')) {
    // It's already a Supabase URL - parse out the path after 'public'
    const pathParts = path.split('/public/');
    if (pathParts.length >= 2) {
      // Normalize the path after '/public/'
      const storagePath = pathParts[1];
      const normalizedPath = normalizeStoragePath(storagePath);
      
      // Reconstruct the full path with normalized storage path
      const fullPath = `/storage/v1/object/public/${normalizedPath}${url.search}`;  // Include query parameters
      
      if (DEBUG_WORKER) console.log(`[CDN Worker] Supabase URL detected, normalized path: ${fullPath}`);
      return `https://eukenximajiuhrtljnpw.supabase.co${fullPath}`;
    }
    
    // Fallback for unexpected format
    const fullPath = path + url.search;
    if (DEBUG_WORKER) console.log(`[CDN Worker] Supabase URL detected, using path: ${fullPath}`);
    return `https://eukenximajiuhrtljnpw.supabase.co${fullPath}`;
  } 
  // Special case for placeholder.svg
  else if (path.includes('placeholder.svg')) {
    if (DEBUG_WORKER) console.log(`[CDN Worker] Placeholder SVG detected`);
    return url.href;
  }
  else {
    // Regular images path - normalize first
    let normalizedPath = normalizeStoragePath(path);
    
    // Ensure the path is properly formatted for Supabase
    if (!normalizedPath.startsWith('/')) {
      normalizedPath = '/' + normalizedPath;
    }
    
    // Construct the Supabase URL with normalized path
    const supabasePath = `/storage/v1/object/public${normalizedPath}${url.search}`;
    
    if (DEBUG_WORKER) console.log(`[CDN Worker] Constructing Supabase URL for path: ${path} -> ${supabasePath}`);
    return `https://eukenximajiuhrtljnpw.supabase.co${supabasePath}`;
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
      if (DEBUG_WORKER) console.log(`[CDN Worker] Attempt ${attempts + 1} to fetch: ${url}`);
      
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
      
      if (DEBUG_WORKER) {
        console.log(`[CDN Worker] Response for ${url}: Status ${response.status}, Content-Type: ${response.headers.get('content-type')}`);
      }
      
      // If successful, break out of retry loop
      if (response.ok) break;
      
      // If not found, no need to retry
      if (response.status === 404) {
        console.error(`[CDN Worker] 404 Not Found: ${url}`);
        break;
      }
      
      console.log(`[CDN Worker] Attempt ${attempts + 1} failed with status ${response.status}`);
      
    } catch (fetchError) {
      console.error(`[CDN Worker] Attempt ${attempts + 1} failed: ${fetchError.message}`);
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
    
    if (DEBUG_WORKER) console.log(`[CDN Worker] Forwarding request to: ${originUrl}`);
    
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
      
      // Debug info about the successful response
      if (DEBUG_WORKER) {
        console.log(`[CDN Worker] Successfully served: ${imagePath}`);
        console.log(`[CDN Worker] Content-Type: ${newHeaders.get('Content-Type')}`);
        console.log(`[CDN Worker] Content-Length: ${newHeaders.get('Content-Length')}`);
      }
      
      // Return the response with the updated headers
      return new Response(response.body, {
        status: response.status,
        headers: newHeaders
      });
    } else {
      // Get error status or default to 404
      const errorStatus = response ? response.status : 404;
      const errorMessage = response ? `Origin returned ${response.status}` : 'Image not found';
      
      console.error(`[CDN Worker] Error serving ${imagePath}: ${errorMessage}`);
      
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
    console.error(`[CDN Worker] Error handling image request for ${url.pathname}:`, error);
    
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
