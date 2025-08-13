// @ts-ignore
import process from 'process';



// Razorpay configuration
export const RAZORPAY_CONFIG = {
  // Get from environment variables (safe for client-side)
  KEY_ID: import.meta.env.VITE_RAZORPAY_KEY_ID || '',
  
  // Default configuration
  CURRENCY: 'INR',
  
  // App branding
  COMPANY_NAME: 'Your App Name', // Replace with your actual app name
  
  // Theme configuration
  THEME: {
    COLOR: '#3399cc', // Replace with your brand color
  },
  
  // Payment modal configuration
  MODAL: {
    BACKDROP_CLOSE: false,
    ESCAPE_CLOSE: true,
    HANDLE_REQUEST: true,
  },
} as const;

// Pricing configuration
export const PRICING_CONFIG = {
  // Early bird pricing (first 30 minutes)
  EARLY_BIRD: {
    DURATION_MINUTES: 30,
    AMOUNT: 99900, // ₹999 in paise
    DESCRIPTION: 'Early Bird Special',
  },
  
  // Regular pricing (after 30 minutes)
  REGULAR: {
    AMOUNT: 149900, // ₹1499 in paise
    DESCRIPTION: 'Regular Pricing',
  },
} as const;

// Session storage keys
export const STORAGE_KEYS = {
  PAYMENT_CONTEXT: 'payment_context',
  SESSION_DATA: 'session_data',
  PRICING_SNAPSHOT: 'pricing_snapshot',
} as const;

// API endpoints configuration
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'https://api.fraterny.in/',
  ENDPOINTS: {
    CREATE_ORDER: '/api/payments/create-order',
    COMPLETE_PAYMENT: '/api/payments/complete',
    VERIFY_PAYMENT: '/api/payments/verify',
  },
  TIMEOUT: 30000, // 30 seconds
} as const;

// Validation rules
export const VALIDATION_RULES = {
  SESSION_ID: {
    MIN_LENGTH: 10,
    MAX_LENGTH: 100,
    PATTERN: /^[a-zA-Z0-9_-]+$/,
  },
  TEST_ID: {
    MIN_LENGTH: 3,
    MAX_LENGTH: 50,
    PATTERN: /^[a-zA-Z0-9_-]+$/,
  },
  AMOUNT: {
    MIN: 100, // ₹1 in paise
    MAX: 10000000, // ₹100,000 in paise
  },
} as const;

// Error messages
export const ERROR_MESSAGES = {
  AUTHENTICATION_REQUIRED: 'Please sign in to continue with payment',
  PAYMENT_FAILED: 'Payment failed. Please try again.',
  NETWORK_ERROR: 'Network error. Please check your connection and try again.',
  SESSION_EXPIRED: 'Your session has expired. Please start again.',
  INVALID_AMOUNT: 'Invalid payment amount',
  ORDER_CREATION_FAILED: 'Failed to create payment order. Please try again.',
  RAZORPAY_LOAD_FAILED: 'Failed to load payment gateway. Please refresh and try again.',
} as const;


// Utility function to validate environment variables
export const validateConfig = (): { isValid: boolean; missingVars: string[] } => {
  const missingVars: string[] = [];
  
  if (typeof window !== 'undefined') {
    if (!process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID) {
      missingVars.push('NEXT_PUBLIC_RAZORPAY_KEY_ID');
    }
    
    if (!process.env.NEXT_PUBLIC_API_BASE_URL) {
      missingVars.push('NEXT_PUBLIC_API_BASE_URL');
    }
  }
  
  return {
    isValid: missingVars.length === 0,
    missingVars,
  };
};

// Export types for the config
export type PricingTierName = keyof typeof PRICING_CONFIG;
export type StorageKey = keyof typeof STORAGE_KEYS;
export type ApiEndpoint = keyof typeof API_CONFIG.ENDPOINTS;