
/**
 * Error handling utilities for the CDN worker
 */

/**
 * Handles worker errors and returns a structured error response
 * @param {Error} err - The error that occurred
 * @param {Object} corsHeaders - CORS headers to include in response
 * @returns {Response} Structured error response
 */
export function handleWorkerError(err, corsHeaders) {
  // Return structured error response
  console.error(`Worker error: ${err.message}`);
  
  // Generate a request ID to help with debugging
  const requestId = crypto.randomUUID ? crypto.randomUUID() : Date.now().toString();
  
  return new Response(JSON.stringify({
    error: 'An error occurred processing your request',
    message: err.message || 'Unknown error',
    requestId: requestId,
    timestamp: new Date().toISOString()
  }), {
    status: 500,
    headers: {
      ...corsHeaders,
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store'
    }
  });
}
