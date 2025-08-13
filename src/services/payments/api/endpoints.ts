import { API_CONFIG } from '../razorpay/config';

// API endpoint builder
class ApiEndpoints {
  private baseUrl: string;

  constructor(baseUrl: string = API_CONFIG.BASE_URL) {
    this.baseUrl = baseUrl.replace(/\/$/, ''); // Remove trailing slash
  }

  // Build full URL for an endpoint
  private buildUrl(endpoint: string): string {
    return `${this.baseUrl}${endpoint}`;
  }

  // Payment related endpoints
  get createOrder(): string {
    return this.buildUrl(API_CONFIG.ENDPOINTS.CREATE_ORDER);
  }

  get completePayment(): string {
    return this.buildUrl(API_CONFIG.ENDPOINTS.COMPLETE_PAYMENT);
  }

  get verifyPayment(): string {
    return this.buildUrl(API_CONFIG.ENDPOINTS.VERIFY_PAYMENT);
  }

  // Method to update base URL if needed
  updateBaseUrl(newBaseUrl: string): void {
    this.baseUrl = newBaseUrl.replace(/\/$/, '');
  }

  // Get all endpoints as an object
  getAllEndpoints(): Record<string, string> {
    return {
      createOrder: this.createOrder,
      completePayment: this.completePayment,
      verifyPayment: this.verifyPayment,
    };
  }
}

// Create and export singleton instance
export const apiEndpoints = new ApiEndpoints();

// Export the class for testing or custom instances
export { ApiEndpoints };

// Helper function to validate if URL is reachable (optional utility)
export const validateEndpoint = async (url: string): Promise<boolean> => {
  try {
    const response = await fetch(url, { 
      method: 'HEAD',
      mode: 'cors',
    });
    return response.ok;
  } catch (error) {
    console.warn(`Endpoint validation failed for: ${url}`, error);
    return false;
  }
};

// Environment-specific endpoint configurations
export const getEnvironmentEndpoints = (environment: 'development' | 'staging' | 'production') => {
  const configs = {
    development: 'http://localhost:3000',
    staging: 'https://staging-api.yourapp.com', // Replace with your staging URL
    production: 'https://api.yourapp.com',       // Replace with your production URL
  };

  return new ApiEndpoints(configs[environment]);
};

// Export endpoint URLs as constants for direct use
export const PAYMENT_ENDPOINTS = {
  CREATE_ORDER: apiEndpoints.createOrder,
  COMPLETE_PAYMENT: apiEndpoints.completePayment,
  VERIFY_PAYMENT: apiEndpoints.verifyPayment,
} as const;