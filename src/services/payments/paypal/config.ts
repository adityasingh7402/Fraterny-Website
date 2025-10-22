// PayPal configuration for payment processing
import { getUserLocationFlag } from '../razorpay/config';

// PayPal SDK configuration
export const PAYPAL_CONFIG = {
  // Production environment - live payments
  CLIENT_ID: import.meta.env.VITE_PAYPAL_CLIENT_ID || '',
  ENVIRONMENT: import.meta.env.VITE_PAYPAL_ENVIRONMENT || 'production', // 'sandbox' for testing, 'production' for live
  INTENT: 'capture', // 'capture' for immediate payment, 'authorize' for later capture
  
  // Currency will be dynamic based on location
  CURRENCY_INDIA: 'INR', // Indian Rupees for India
  CURRENCY_INTERNATIONAL: 'USD', // US Dollars for international
  
  // PayPal specific settings  
  DISABLE_FUNDING: [], // Allow all payment methods for testing
  ENABLE_FUNDING: ['paypal', 'card'], // Enable PayPal and cards for testing
  
  // Styling
  LAYOUT: 'vertical', // 'vertical' | 'horizontal'
  COLOR: 'blue', // 'gold' | 'blue' | 'silver' | 'white' | 'black'
  SHAPE: 'pill', // 'pill' | 'rect'
  LABEL: 'pay', // 'checkout' | 'credit' | 'pay' | 'buynow' | 'paypal' | 'installment'
  
  // Company info
  COMPANY_NAME: 'Fraterny',
  BRAND_NAME: 'Fraterny Assessment',
} as const;

// PayPal pricing configuration based on location
// NOTE: PayPal doesn't support INR, so we use USD for all regions
export const PAYPAL_PRICING_CONFIG = {
  // USD equivalent for Indian users (PayPal will handle conversion)
  INDIA: {
    amount: (Number(import.meta.env.VITE_PAYPAL_INDIA_PRICE_CENTS) / 100).toFixed(2) || '12.00',
    originalAmount: (Number(import.meta.env.VITE_PAYPAL_INDIA_ORIGINAL_PRICE_CENTS) / 100).toFixed(2) || '15.00',
    currency: 'USD',
    description: 'PayPal Payment (India)',
    displayAmount: `$${(Number(import.meta.env.VITE_PAYPAL_INDIA_PRICE_CENTS) / 100).toFixed(0) || '12'}`,
    displayOriginal: `$${(Number(import.meta.env.VITE_PAYPAL_INDIA_ORIGINAL_PRICE_CENTS) / 100).toFixed(0) || '15'}`
  },
  INTERNATIONAL: {
    amount: (Number(import.meta.env.VITE_PAYPAL_INTERNATIONAL_PRICE_CENTS) / 100).toFixed(2) || '20.00',
    originalAmount: (Number(import.meta.env.VITE_PAYPAL_INTERNATIONAL_ORIGINAL_PRICE_CENTS) / 100).toFixed(2) || '25.00',
    currency: 'USD', 
    description: 'PayPal Payment (International)',
    displayAmount: `$${(Number(import.meta.env.VITE_PAYPAL_INTERNATIONAL_PRICE_CENTS) / 100).toFixed(0) || '20'}`,
    displayOriginal: `$${(Number(import.meta.env.VITE_PAYPAL_INTERNATIONAL_ORIGINAL_PRICE_CENTS) / 100).toFixed(0) || '25'}`
  }
} as const;

// PayPal API endpoints
export const PAYPAL_API_CONFIG = {
  SANDBOX_BASE_URL: 'https://api-m.sandbox.paypal.com',
  PRODUCTION_BASE_URL: 'https://api-m.paypal.com',
  // Use production URL based on environment
  BASE_URL: PAYPAL_CONFIG.ENVIRONMENT === 'production' ? 'https://api-m.paypal.com' : 'https://api-m.sandbox.paypal.com',
  ENDPOINTS: {
    CREATE_ORDER: '/v2/checkout/orders',
    CAPTURE_ORDER: '/v2/checkout/orders/{id}/capture',
    GET_ORDER: '/v2/checkout/orders/{id}',
  },
  TIMEOUT: 30000,
} as const;

// Error messages specific to PayPal
export const PAYPAL_ERROR_MESSAGES = {
  SCRIPT_LOAD_FAILED: 'Failed to load PayPal payment system. Please refresh and try again.',
  ORDER_CREATION_FAILED: 'Failed to create PayPal order. Please try again.',
  PAYMENT_CANCELLED: 'PayPal payment was cancelled.',
  PAYMENT_FAILED: 'PayPal payment failed. Please try again.',
  INVALID_AMOUNT: 'Invalid payment amount for PayPal.',
  NETWORK_ERROR: 'Network error with PayPal. Please check your connection.',
  CAPTURE_FAILED: 'Failed to complete PayPal payment. Please contact support.',
} as const;

// Helper function to get PayPal pricing based on location
export const getPayPalPricingForLocation = async () => {
  try {
    // Import the dynamic pricing service
    const { getPricingForDisplay } = await import('@/services/admin-pricing');
    
    // Get pricing based on environment configuration
    const pricingResult = await getPricingForDisplay();
    
    if (!pricingResult.success || !pricingResult.data) {
      throw new Error(pricingResult.error || 'Failed to get PayPal pricing data');
    }
    
    console.log(`💰 PayPal using ${pricingResult.source} pricing data`);
    
    const isIndia = await getUserLocationFlag();
    console.log('🌍 getPayPalPricingForLocation - Location detected:', { isIndia });
    
    if (isIndia) {
      // Use India PayPal pricing
      const amountInCents = pricingResult.data.paypal.india.price;
      const originalAmountInCents = pricingResult.data.paypal.india.displayPrice;
      
      const amountInDollars = (amountInCents / 100).toFixed(2);
      const originalAmountInDollars = (originalAmountInCents / 100).toFixed(2);
      
      console.log('🇮🇳 PayPal India pricing calculated:', {
        amountInCents,
        originalAmountInCents,
        amountInDollars,
        originalAmountInDollars,
        source: pricingResult.source
      });
      
      return {
        amount: amountInDollars,
        originalAmount: originalAmountInDollars,
        currency: 'USD',
        description: 'PayPal Payment (India)',
        displayAmount: `$${Math.round(amountInCents / 100)}`,
        displayOriginal: `$${Math.round(originalAmountInCents / 100)}`,
        isIndia: true,
        numericAmount: parseFloat(amountInDollars)
      };
    } else {
      // Use International PayPal pricing
      const amountInCents = pricingResult.data.paypal.international.price;
      const originalAmountInCents = pricingResult.data.paypal.international.displayPrice;
      
      const amountInDollars = (amountInCents / 100).toFixed(2);
      const originalAmountInDollars = (originalAmountInCents / 100).toFixed(2);
      
      console.log('🌍 PayPal International pricing calculated:', {
        amountInCents,
        originalAmountInCents,
        amountInDollars,
        originalAmountInDollars,
        source: pricingResult.source
      });
      
      return {
        amount: amountInDollars,
        originalAmount: originalAmountInDollars,
        currency: 'USD',
        description: 'PayPal Payment (International)',
        displayAmount: `$${Math.round(amountInCents / 100)}`,
        displayOriginal: `$${Math.round(originalAmountInCents / 100)}`,
        isIndia: false,
        numericAmount: parseFloat(amountInDollars)
      };
    }
  } catch (error) {
    console.error('Error getting PayPal dynamic pricing, falling back to environment:', error);
    
    // Fallback to environment variables
    const isIndia = await getUserLocationFlag();
    
    const pricing = isIndia 
      ? PAYPAL_PRICING_CONFIG.INDIA 
      : PAYPAL_PRICING_CONFIG.INTERNATIONAL;
      
    return {
      ...pricing,
      isIndia,
      numericAmount: parseFloat(pricing.amount),
      numericOriginal: parseFloat(pricing.originalAmount)
    };
  }
};

// Validation function for PayPal configuration
export const validatePayPalConfig = (): { isValid: boolean; missingVars: string[] } => {
  const missingVars: string[] = [];
  
  if (typeof window !== 'undefined') {
    if (!PAYPAL_CONFIG.CLIENT_ID?.trim()) {
      missingVars.push('VITE_PAYPAL_CLIENT_ID');
    }
    
    // Check PayPal pricing environment variables
    if (!import.meta.env.VITE_PAYPAL_INDIA_PRICE_CENTS?.trim()) {
      missingVars.push('VITE_PAYPAL_INDIA_PRICE_CENTS');
    }
    
    if (!import.meta.env.VITE_PAYPAL_INDIA_ORIGINAL_PRICE_CENTS?.trim()) {
      missingVars.push('VITE_PAYPAL_INDIA_ORIGINAL_PRICE_CENTS');
    }
    
    if (!import.meta.env.VITE_PAYPAL_INTERNATIONAL_PRICE_CENTS?.trim()) {
      missingVars.push('VITE_PAYPAL_INTERNATIONAL_PRICE_CENTS');
    }
    
    if (!import.meta.env.VITE_PAYPAL_INTERNATIONAL_ORIGINAL_PRICE_CENTS?.trim()) {
      missingVars.push('VITE_PAYPAL_INTERNATIONAL_ORIGINAL_PRICE_CENTS');
    }
  }
  
  return {
    isValid: missingVars.length === 0,
    missingVars,
  };
};

// Get PayPal SDK URL with configuration
export const getPayPalSDKUrl = async (): Promise<string> => {
  // PayPal doesn't support INR, so always use USD
  const currency = 'USD';
  
  const params = new URLSearchParams({
    'client-id': PAYPAL_CONFIG.CLIENT_ID,
    'currency': currency,
    'intent': PAYPAL_CONFIG.INTENT,
    'components': 'buttons',
  });

  // Debug: log client id masked
  const cid = PAYPAL_CONFIG.CLIENT_ID || '';
  const masked = cid ? `${cid.slice(0,6)}...${cid.slice(-4)}` : 'undefined';
  console.log(`🔑 PayPal CLIENT_ID (masked): ${masked}`);
  
  // Only add disable-funding if there are items to disable
  if (PAYPAL_CONFIG.DISABLE_FUNDING.length > 0) {
    params.set('disable-funding', PAYPAL_CONFIG.DISABLE_FUNDING.join(','));
  }
  
  // Only add enable-funding if there are items to enable
  if (PAYPAL_CONFIG.ENABLE_FUNDING.length > 0) {
    params.set('enable-funding', PAYPAL_CONFIG.ENABLE_FUNDING.join(','));
  }
  
  const sdkUrl = `https://www.paypal.com/sdk/js?${params.toString()}`;
  console.log(`🌐 PayPal SDK configured with currency: ${currency} (PayPal doesn't support INR)`);
  console.log(`🚀 PayPal Environment: ${PAYPAL_CONFIG.ENVIRONMENT.toUpperCase()}`);
  console.log('PayPal SDK URL:', sdkUrl);
  return sdkUrl;
};

export type PayPalPricingTier = keyof typeof PAYPAL_PRICING_CONFIG;
export type PayPalEnvironment = typeof PAYPAL_CONFIG.ENVIRONMENT;