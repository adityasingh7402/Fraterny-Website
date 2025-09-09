import axios, { AxiosResponse, AxiosError } from 'axios';
import { CreateOrderRequest, CreateOrderResponse, PaymentCompletionRequest } from '../types';
import { apiEndpoints } from './endpoints';
import { API_CONFIG } from '../razorpay/config';
import { validateCreateOrderRequest, validatePaymentCompletionRequest } from '../utils/validation';

// API response wrapper interface
interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Payment API service class
class PaymentApiService {
  private axiosInstance;

  constructor() {
  //   console.log('🔧 PaymentApiService - Constructor Debug:');
  // console.log('API_CONFIG.BASE_URL:', API_CONFIG.BASE_URL);
  // console.log('import.meta.env.VITE_API_BASE_URL:', import.meta.env.VITE_API_BASE_URL);

    // Create axios instance with default configuration
    this.axiosInstance = axios.create({
      baseURL: API_CONFIG.BASE_URL,
      timeout: API_CONFIG.TIMEOUT,
      headers: {
        'Content-Type': 'application/json',
      },
    });

      // console.log('🔧 Axios instance baseURL:', this.axiosInstance.defaults.baseURL);

    // Add request interceptor for logging and auth
    this.axiosInstance.interceptors.request.use(
      (config) => {
        // console.log(`Making API request to: ${config.method?.toUpperCase()} ${config.url}`);        
        return config;
      },
      (error) => {
        // console.error('Request interceptor error:', error);
        return Promise.reject(error);
      }
    );

    // Add response interceptor for error handling
    this.axiosInstance.interceptors.response.use(
      (response) => {
        console.log(`API response from ${response.config.url}:`, response);
        return response;
      },
      (error) => {
        console.error('API response error:', error);
        return Promise.reject(this.handleApiError(error));
      }
    );
  }

  // Create payment order
  async createOrder(orderData: CreateOrderRequest): Promise<CreateOrderResponse> {
    try {
      console.log('🔧 createOrder Debug:');
    console.log('apiEndpoints.createOrder:', apiEndpoints.createOrder);
    console.log('API_CONFIG.BASE_URL:', API_CONFIG.BASE_URL);
    console.log('Full URL being called:', apiEndpoints.createOrder);
    
    console.log('Creating payment order:', orderData)
      // Validate request data
      const validation = validateCreateOrderRequest(orderData);
      if (!validation.isValid) {
        throw new Error(`Invalid order data: ${validation.errors.join(', ')}`);
      }

      console.log('Creating payment order:', orderData);

      const response: AxiosResponse<ApiResponse<CreateOrderResponse>> = await this.axiosInstance.post(
        apiEndpoints.createOrder,
        orderData
      );

      if (!response.data.success) {
        throw new Error(response.data.error || 'Failed to create payment order');
      }

      if (!response.data.data) {
        throw new Error('No order data received from server');
      }

      console.log('Payment order created successfully:', response.data.data);
      return response.data.data;

    } catch (error) {
      console.error('Create order API error:', error);
      throw this.processApiError(error, 'Failed to create payment order');
    }
  }

  // Complete payment (send final payment data)
  async completePayment(paymentData: PaymentCompletionRequest): Promise<void> {
    try {
      // Validate request data
      const validation = validatePaymentCompletionRequest(paymentData);
      if (!validation.isValid) {
        throw new Error(`Invalid payment data: ${validation.errors.join(', ')}`);
      }

      console.log('Completing payment:', {
        userId: paymentData.userId,
        sessionId: paymentData.originalSessionId,
        testId: paymentData.testId,
        status: paymentData.paymentData.status,
      });
      console.log('🚀 Sending payment completion data:', JSON.stringify(paymentData, null, 2));

      const response: AxiosResponse<ApiResponse> = await this.axiosInstance.post(
        apiEndpoints.completePayment,
        paymentData
      );

      if (!response.data.success) {
        throw new Error(response.data.error || 'Failed to complete payment');
      }

      console.log('Payment completed successfully');

    } catch (error) {
      console.error('Complete payment API error:', error);
      throw this.processApiError(error, 'Failed to complete payment');
    }
  }

  // Verify payment (optional - for additional verification)
  async verifyPayment(verificationData: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
  }): Promise<{ verified: boolean }> {
    try {
      console.log('Verifying payment:', verificationData.razorpay_payment_id);

      const response: AxiosResponse<ApiResponse<{ verified: boolean }>> = await this.axiosInstance.post(
        apiEndpoints.verifyPayment,
        verificationData
      );

      if (!response.data.success) {
        throw new Error(response.data.error || 'Payment verification failed');
      }

      const result = response.data.data || { verified: false };
      console.log('Payment verification result:', result);
      
      return result;

    } catch (error) {
      console.error('Verify payment API error:', error);
      throw this.processApiError(error, 'Failed to verify payment');
    }
  }

  // Health check for API connectivity
  async healthCheck(): Promise<boolean> {
    try {
      const response = await this.axiosInstance.get('/health', {
        timeout: 5000, // Shorter timeout for health check
      });
      
      return response.status === 200;
    } catch (error) {
      console.warn('API health check failed:', error);
      return false;
    }
  }

  // Handle axios errors and convert to user-friendly messages
  private handleApiError(error: AxiosError): Error {
    if (error.response) {
      // Server responded with error status
      const status = error.response.status;
      const data = error.response.data as any;
      
      switch (status) {
        case 400:
          return new Error(data?.error || 'Invalid request data');
        case 401:
          return new Error('Authentication required');
        case 403:
          return new Error('Access denied');
        case 404:
          return new Error('Service not found');
        case 429:
          return new Error('Too many requests. Please try again later');
        case 500:
          return new Error('Server error. Please try again');
        case 503:
          return new Error('Service temporarily unavailable');
        default:
          return new Error(data?.error || `Server error (${status})`);
      }
    } else if (error.request) {
      // Network error
      return new Error('Network error. Please check your connection and try again');
    } else {
      // Other error
      return new Error(error.message || 'Unexpected error occurred');
    }
  }

  // Process API errors with context
  private processApiError(error: any, context: string): Error {
    if (error.message) {
      return new Error(`${context}: ${error.message}`);
    }
    
    return new Error(`${context}: Unknown error occurred`);
  }

  // Get API status information
  async getApiStatus(): Promise<{
    isHealthy: boolean;
    baseUrl: string;
    timestamp: string;
  }> {
    const isHealthy = await this.healthCheck();
    
    return {
      isHealthy,
      baseUrl: API_CONFIG.BASE_URL,
      timestamp: new Date().toISOString(),
    };
  }

  // Update base URL if needed
  updateBaseUrl(newBaseUrl: string): void {
    this.axiosInstance.defaults.baseURL = newBaseUrl;
    apiEndpoints.updateBaseUrl(newBaseUrl);
  }

  // Get request configuration for debugging
  getRequestConfig(): {
    baseURL: string;
    timeout: number;
    headers: any;
  } {
    return {
      baseURL: this.axiosInstance.defaults.baseURL || '',
      timeout: this.axiosInstance.defaults.timeout || 0,
      headers: this.axiosInstance.defaults.headers,
    };
  }
}

// Create and export singleton instance
export const paymentApiService = new PaymentApiService();

// Export the class for testing or custom instances
export { PaymentApiService };

// Utility functions for direct use
export const createPaymentOrder = async (orderData: CreateOrderRequest): Promise<CreateOrderResponse> => {
  return paymentApiService.createOrder(orderData);
};

export const completePayment = async (paymentData: PaymentCompletionRequest): Promise<void> => {
  return paymentApiService.completePayment(paymentData);
};

export const verifyPayment = async (verificationData: {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}): Promise<{ verified: boolean }> => {
  return paymentApiService.verifyPayment(verificationData);
};

export const checkApiHealth = async (): Promise<boolean> => {
  return paymentApiService.healthCheck();
};

export const getApiStatus = async () => {
  return paymentApiService.getApiStatus();
};