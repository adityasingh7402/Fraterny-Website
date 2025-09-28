import { API_CONFIG } from '../razorpay/config';
import { PAYPAL_CONFIG } from '../paypal/config';

// Mask sensitive values for logging
const maskValue = (value: string | undefined, showChars: number = 4): string => {
  if (!value) return 'undefined';
  if (value.length <= showChars * 2) return '*'.repeat(value.length);
  return `${value.slice(0, showChars)}...${value.slice(-showChars)}`;
};

// Log payment environment configuration (called once per payment attempt)
export const logPaymentEnv = (): void => {
  console.group('🔍 Payment Environment Debug');
  
  console.log('📡 API Configuration:');
  console.log(`  Base URL: ${API_CONFIG.BASE_URL}`);
  console.log(`  Timeout: ${API_CONFIG.TIMEOUT}ms`);
  
  console.log('🔑 PayPal Configuration:');
  console.log(`  Client ID: ${maskValue(PAYPAL_CONFIG.CLIENT_ID, 6)}`);
  console.log(`  Environment: ${PAYPAL_CONFIG.ENVIRONMENT}`);
  console.log(`  Currency (India): ${PAYPAL_CONFIG.CURRENCY_INDIA}`);
  console.log(`  Currency (International): ${PAYPAL_CONFIG.CURRENCY_INTERNATIONAL}`);
  
  console.log('💰 Environment Variables (Frontend):');
  const env = (import.meta as any).env || {};
  console.log(`  VITE_API_BASE_URL: ${env.VITE_API_BASE_URL || 'undefined'}`);
  console.log(`  VITE_PAYPAL_CLIENT_ID: ${maskValue(env.VITE_PAYPAL_CLIENT_ID, 6)}`);
  console.log(`  VITE_PAYPAL_ENVIRONMENT: ${env.VITE_PAYPAL_ENVIRONMENT || 'undefined'}`);
  console.log(`  VITE_RAZORPAY_KEY_ID: ${maskValue(env.VITE_RAZORPAY_KEY_ID)}`);
  
  console.log('💲 Pricing Environment Variables:');
  console.log(`  VITE_INDIA_PRICE_PAISE: ${env.VITE_INDIA_PRICE_PAISE || 'undefined'}`);
  console.log(`  VITE_INTERNATIONAL_PRICE_CENTS: ${env.VITE_INTERNATIONAL_PRICE_CENTS || 'undefined'}`);
  console.log(`  VITE_PAYPAL_INDIA_PRICE_CENTS: ${env.VITE_PAYPAL_INDIA_PRICE_CENTS || 'undefined'}`);
  console.log(`  VITE_PAYPAL_INTERNATIONAL_PRICE_CENTS: ${env.VITE_PAYPAL_INTERNATIONAL_PRICE_CENTS || 'undefined'}`);
  
  console.groupEnd();
};

// Quick validation helper
export const validatePaymentEnv = (): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  const env = (import.meta as any).env || {};
  
  // Check required variables
  if (!API_CONFIG.BASE_URL) errors.push('API_CONFIG.BASE_URL is empty');
  if (!PAYPAL_CONFIG.CLIENT_ID) errors.push('PAYPAL_CONFIG.CLIENT_ID is empty');
  if (!env.VITE_RAZORPAY_KEY_ID) errors.push('VITE_RAZORPAY_KEY_ID is missing');
  
  return {
    isValid: errors.length === 0,
    errors
  };
};