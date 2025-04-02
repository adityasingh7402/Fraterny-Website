/**
 * API Monitoring utilities to track API request counts and performance
 */

// API call count tracking
interface ApiCallStats {
  total: number;
  endpoints: Record<string, number>;
  timestamps: number[];
}

// Initialize stats storage
const apiStats: ApiCallStats = {
  total: 0,
  endpoints: {},
  timestamps: []
};

// Track a new API call
export const trackApiCall = (endpoint: string): void => {
  apiStats.total++;
  apiStats.endpoints[endpoint] = (apiStats.endpoints[endpoint] || 0) + 1;
  apiStats.timestamps.push(Date.now());
  
  // Clean old timestamps (keep only last hour)
  const oneHourAgo = Date.now() - 60 * 60 * 1000;
  apiStats.timestamps = apiStats.timestamps.filter(t => t > oneHourAgo);
};

// Get stats for monitoring dashboard
export const getApiStats = (): {
  total: number;
  endpoints: Record<string, number>;
  requestsLastHour: number;
  requestsLastMinute: number;
} => {
  const now = Date.now();
  const oneMinuteAgo = now - 60 * 1000;
  
  return {
    total: apiStats.total,
    endpoints: {...apiStats.endpoints},
    requestsLastHour: apiStats.timestamps.length,
    requestsLastMinute: apiStats.timestamps.filter(t => t > oneMinuteAgo).length
  };
};

// Reset stats (mainly for testing)
export const resetApiStats = (): void => {
  apiStats.total = 0;
  apiStats.endpoints = {};
  apiStats.timestamps = [];
};
