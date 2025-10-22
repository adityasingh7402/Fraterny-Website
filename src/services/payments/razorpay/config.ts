// // @ts-ignore
// import process from 'process';



// // Razorpay configuration
// export const RAZORPAY_CONFIG = {
//   // Get from environment variables (safe for client-side)
//   KEY_ID: import.meta.env.VITE_RAZORPAY_KEY_ID || '',
  
//   // Default configuration
//   CURRENCY: 'INR',
  
//   // App branding
//   COMPANY_NAME: 'Fraterny', // Replace with your actual app name
  
//   // Theme configuration
//   THEME: {
//     COLOR: '#3399cc', // Replace with your brand color
//   },
  
//   // Payment modal configuration
//   MODAL: {
//     BACKDROP_CLOSE: false,
//     ESCAPE_CLOSE: true,
//     HANDLE_REQUEST: true,
//   },
// } as const;

// // Pricing configuration
// export const PRICING_CONFIG = {
//   // Early bird pricing (first 1 minute)
//   EARLY_BIRD: {
//     DURATION_MINUTES: 30,
//     AMOUNT: Number(import.meta.env.VITE_EARLY_BIRD_PRICE), // ₹950 in paise - Changed to Rs1 for testing
//     DESCRIPTION: 'Early Bird Special',
//   },

//   // Regular pricing (after 1 minute)
//   REGULAR: {
//     AMOUNT: Number(import.meta.env.VITE_REGULAR_PRICE), // ₹950 in paise - Changed to Rs1 for testing
//     DESCRIPTION: 'Regular Pricing',
//   },
// } as const;

// // Session storage keys
// export const STORAGE_KEYS = {
//   PAYMENT_CONTEXT: 'payment_context',
//   SESSION_DATA: 'session_data',
//   PRICING_SNAPSHOT: 'pricing_snapshot',
// } as const;

// // API endpoints configuration
// export const API_CONFIG = {
//   BASE_URL: 'https://api.fraterny.in',
//   ENDPOINTS: {
//     CREATE_ORDER: '/api/payments/create-order',
//     COMPLETE_PAYMENT: '/api/payments/complete',
//     VERIFY_PAYMENT: '/api/payments/verify',
//   },
//   TIMEOUT: 30000, // 30 seconds
// } as const;

// // console.log('🔧 DEBUG - Environment Variables:');
// // console.log('VITE_API_BASE_URL:', import.meta.env.VITE_API_BASE_URL);
// // console.log('API_CONFIG.BASE_URL:', API_CONFIG.BASE_URL);
// // console.log('Full API_CONFIG:', API_CONFIG);

// // Validation rules
// export const VALIDATION_RULES = {
//   SESSION_ID: {
//     MIN_LENGTH: 10,
//     MAX_LENGTH: 100,
//     PATTERN: /^[a-zA-Z0-9_-]+$/,
//   },
//   TEST_ID: {
//     MIN_LENGTH: 3,
//     MAX_LENGTH: 50,
//     PATTERN: /^[a-zA-Z0-9_-]+$/,
//   },
//   AMOUNT: {
//     MIN: 100, // ₹1 in paise
//     MAX: 10000000, // ₹100,000 in paise
//   },
// } as const;

// // Error messages
// export const ERROR_MESSAGES = {
//   AUTHENTICATION_REQUIRED: 'Please sign in to continue with payment',
//   PAYMENT_FAILED: 'Payment failed. Please try again.',
//   NETWORK_ERROR: 'Network error. Please check your connection and try again.',
//   SESSION_EXPIRED: 'Your session has expired. Please start again.',
//   INVALID_AMOUNT: 'Invalid payment amount',
//   ORDER_CREATION_FAILED: 'Failed to create payment order. Please try again.',
//   RAZORPAY_LOAD_FAILED: 'Failed to load payment gateway. Please refresh and try again.',
// } as const;


// // Utility function to validate environment variables
// export const validateConfig = (): { isValid: boolean; missingVars: string[] } => {
//   const missingVars: string[] = [];
  
//   if (typeof window !== 'undefined') {
//     if (!import.meta.env.VITE_RAZORPAY_KEY_ID?.trim()) {  // ✅ CORRECT
//       missingVars.push('VITE_RAZORPAY_KEY_ID');
//     }
    
//     if (!import.meta.env.VITE_API_BASE_URL?.trim()) {     // ✅ CORRECT
//       missingVars.push('VITE_API_BASE_URL');
//     }
//   }
  
//   return {
//     isValid: missingVars.length === 0,
//     missingVars,
//   };
// };

// // Export types for the config
// export type PricingTierName = keyof typeof PRICING_CONFIG;
// export type StorageKey = keyof typeof STORAGE_KEYS;
// export type ApiEndpoint = keyof typeof API_CONFIG.ENDPOINTS;




import process from 'process';
import { locationService } from '../../../services/locationService';

// Razorpay configuration
export const RAZORPAY_CONFIG = {
  KEY_ID: import.meta.env.VITE_RAZORPAY_KEY_ID || '',
  CURRENCY: 'INR',
  COMPANY_NAME: 'Fraterny',
  THEME: {
    COLOR: '#3399cc',
  },
  MODAL: {
    BACKDROP_CLOSE: false,
    ESCAPE_CLOSE: true,
    HANDLE_REQUEST: true,
  },
} as const;

// Pricing configuration
export const PRICING_CONFIG = {
  INDIA: { 
    amount: Number(import.meta.env.VITE_INDIA_PRICE_PAISE),
    originalAmount: Number(import.meta.env.VITE_INDIA_ORIGINAL_PRICE_PAISE || import.meta.env.VITE_INDIA_PRICE_PAISE * 1.3), // Default to 30% higher if not set
    currency: 'INR',
    description: 'India Pricing' 
  },
  INTERNATIONAL: { 
    amount: Number(import.meta.env.VITE_INTERNATIONAL_PRICE_CENTS),
    originalAmount: Number(import.meta.env.VITE_INTERNATIONAL_ORIGINAL_PRICE_CENTS || import.meta.env.VITE_INTERNATIONAL_PRICE_CENTS * 1.25), // Default to 25% higher if not set
    currency: 'USD', 
    description: 'International Pricing'
  }
}

// API endpoints configuration
export const API_CONFIG = {
  BASE_URL: 'https://api.fraterny.in',
  ENDPOINTS: {
    CREATE_ORDER: '/api/payments/create-order',
    COMPLETE_PAYMENT: '/api/payments/complete',
    VERIFY_PAYMENT: '/api/payments/verify',
  },
  TIMEOUT: 30000,
} as const;

export const STORAGE_KEYS = {
  PAYMENT_CONTEXT: 'payment_context',
  SESSION_DATA: 'session_data',
  PRICING_SNAPSHOT: 'pricing_snapshot',
} as const;

// Helper function to get location for backend (just the isIndia flag)
export const getUserLocationFlag = async (): Promise<boolean> => {
  try {
    const locationData = await locationService.getUserLocation();
    //console.log('🔍 getUserLocationFlag - Raw location data:', locationData);
    //console.log('🔍 getUserLocationFlag - isIndia result:', locationData.isIndia);
    return locationData.isIndia;
  } catch (error) {
    console.error('Failed to get location flag:', error);
    return false; // Default to non-India on error
  }
};

// Helper function for display pricing only (frontend display)
// export const getDisplayPricing = async () => {
//   try {
//     const locationData = await locationService.getUserLocation();
//     const isIndia = locationData.isIndia;
    
//     if (isIndia) {
//       // India pricing display - hardcoded
//       const indiaPrice = 950;
//       return {
//         currency: 'INR',
//         symbol: '₹',
//         amount: indiaPrice,
//         display: `₹${indiaPrice}`,
//         originalDisplay: '₹1200',
//         isIndia: true,
//       };
//     } else {
//       // International pricing display - hardcoded
//       const usdPrice = 20;
//       return {
//         currency: 'USD',
//         symbol: '$',
//         amount: usdPrice,
//         display: `$${usdPrice}`,
//         originalDisplay: '$25',
//         isIndia: false,
//       };
//     }
//   } catch (error) {
//     console.error('Failed to get display pricing:', error);
//     // Fallback to India pricing
//     return {
//       currency: 'INR',
//       symbol: '₹',
//       amount: 950,
//       display: '₹950',
//       originalDisplay: '₹1200',
//       isIndia: true,
//     };
//   }
// };

export const getPriceForLocation = async () => {
  try {
    // Import the dynamic pricing service
    const { getPricingForDisplay } = await import('@/services/admin-pricing');
    
    // Get pricing based on environment configuration
    const pricingResult = await getPricingForDisplay();
    
    if (!pricingResult.success || !pricingResult.data) {
      throw new Error(pricingResult.error || 'Failed to get pricing data');
    }
    
    console.log(`💰 Using ${pricingResult.source} pricing data`);
    
    const isIndia = await getUserLocationFlag();
    console.log('🌍 getPriceForLocation - Location detected:', { isIndia });
    
    if (isIndia) {
      // Use India Razorpay pricing
      const amountInPaise = pricingResult.data.razorpay.india.price;
      const originalAmountInPaise = pricingResult.data.razorpay.india.displayPrice;
      
      const amountInRupees = Math.round(amountInPaise / 100);
      const originalAmountInRupees = Math.round(originalAmountInPaise / 100);
      
      console.log('🇮🇳 India pricing calculated:', {
        amountInPaise,
        originalAmountInPaise,
        amountInRupees,
        originalAmountInRupees,
        source: pricingResult.source
      });
      
      return {
        main: `₹${amountInRupees}`,
        original: `₹${originalAmountInRupees}`,
        currency: 'INR',
        symbol: '₹',
        amount: amountInPaise, // Return amount in paise for Razorpay
        isIndia: true
      };
    } else {
      // Use International Razorpay pricing
      const amountInCents = pricingResult.data.razorpay.international.price;
      const originalAmountInCents = pricingResult.data.razorpay.international.displayPrice;
      
      const amountInDollars = Math.round(amountInCents / 100);
      const originalAmountInDollars = Math.round(originalAmountInCents / 100);
      
      console.log('🌍 International pricing calculated:', {
        amountInCents,
        originalAmountInCents,
        amountInDollars,
        originalAmountInDollars,
        source: pricingResult.source
      });
      
      return {
        main: `$${amountInDollars}`,
        original: `$${originalAmountInDollars}`, 
        currency: 'USD',
        symbol: '$',
        amount: amountInCents, // Return amount in cents for Razorpay
        isIndia: false
      };
    }
  } catch (error) {
    console.error('Error getting dynamic pricing, falling back to environment:', error);
    
    // Fallback to environment variables
    const isIndia = await getUserLocationFlag();
    
    if (isIndia) {
      const fallbackAmountInPaise = Number(import.meta.env.VITE_INDIA_PRICE_PAISE) || 95000;
      const fallbackOriginalAmountInPaise = Number(import.meta.env.VITE_INDIA_ORIGINAL_PRICE_PAISE) || 120000;
      
      const fallbackAmount = Math.round(fallbackAmountInPaise / 100);
      const fallbackOriginalAmount = Math.round(fallbackOriginalAmountInPaise / 100);
      
      return {
        main: `₹${fallbackAmount}`,
        original: `₹${fallbackOriginalAmount}`,
        currency: 'INR',
        symbol: '₹',
        amount: fallbackAmountInPaise, // Return amount in paise for Razorpay
        isIndia: true
      };
    } else {
      const fallbackAmountInCents = Number(import.meta.env.VITE_INTERNATIONAL_PRICE_CENTS) || 2000;
      const fallbackOriginalAmountInCents = Number(import.meta.env.VITE_INTERNATIONAL_ORIGINAL_PRICE_CENTS) || 2500;
      
      const fallbackAmount = Math.round(fallbackAmountInCents / 100);
      const fallbackOriginalAmount = Math.round(fallbackOriginalAmountInCents / 100);
      
      return {
        main: `$${fallbackAmount}`,
        original: `$${fallbackOriginalAmount}`,
        currency: 'USD',
        symbol: '$',
        amount: fallbackAmountInCents, // Return amount in cents for Razorpay
        isIndia: false
      };
    }
  }
};

export const getCurrencySymbol = (isIndia: boolean) => isIndia ? '₹' : '$';
export const formatPrice = (amount: number, isIndia: boolean) => {
  const symbol = getCurrencySymbol(isIndia);
  return `${symbol}${amount}`;
};


// Validation rules
export const VALIDATION_RULES = {
  // SESSION_ID: {
  //   MIN_LENGTH: 10,
  //   MAX_LENGTH: 100,
  //   PATTERN: /^[a-zA-Z0-9_-]+$/,
  // },
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



// // Utility function to validate environment variables
export const validateConfig = (): { isValid: boolean; missingVars: string[] } => {
  const missingVars: string[] = [];
  
  if (typeof window !== 'undefined') {
    if (!import.meta.env.VITE_RAZORPAY_KEY_ID?.trim()) {  // ✅ CORRECT
      missingVars.push('VITE_RAZORPAY_KEY_ID');
    }
    
    if (!import.meta.env.VITE_API_BASE_URL?.trim()) {     // ✅ CORRECT
      missingVars.push('VITE_API_BASE_URL');
    }
  }
  
  return {
    isValid: missingVars.length === 0,
    missingVars,
  };
};

export const getLocationBasedPricing = (isIndia: boolean) => {
  const selectedConfig = isIndia ? PRICING_CONFIG.INDIA : PRICING_CONFIG.INTERNATIONAL;
  console.log('💰 getLocationBasedPricing:', {
    isIndia,
    selectedConfig,
    PRICING_CONFIG_INDIA: PRICING_CONFIG.INDIA,
    PRICING_CONFIG_INTERNATIONAL: PRICING_CONFIG.INTERNATIONAL
  });
  return selectedConfig;
};

// Export types for the config
export type PricingTierName = keyof typeof PRICING_CONFIG;
export type StorageKey = keyof typeof STORAGE_KEYS;
export type ApiEndpoint = keyof typeof API_CONFIG.ENDPOINTS;
