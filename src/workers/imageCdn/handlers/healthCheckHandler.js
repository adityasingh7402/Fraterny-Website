
/**
 * Handler for health check requests
 */

/**
 * Creates a health check response
 * @param {Object} corsHeaders - CORS headers to include in response
 * @returns {Response} Health check response
 */
export function createHealthCheckResponse(corsHeaders) {
  return new Response(JSON.stringify({
    status: 'ok',
    version: '1.2.0',
    timestamp: new Date().toISOString()
  }), {
    headers: {
      ...corsHeaders,
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store'
    }
  });
}
