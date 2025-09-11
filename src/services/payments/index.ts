// // Main payment service exports

// import { paymentHandlerService } from './razorpay/paymentHandler';
// import type { PaymentResult } from './types';
// import { PricingTier } from './types';
// import { dynamicPricingService } from './pricing/dynamicPricing';
// import { sessionManager } from './auth/sessionManager';
// import { getPricingDisplayInfo } from './pricing/pricingUtils';
// import { paymentAuthService } from './auth/paymentAuth';
// import { validateConfig } from './razorpay/config';

// // Core types
// export type {
//   PaymentContext,
//   PricingTier,
//   CreateOrderRequest,
//   CreateOrderResponse,
//   PaymentCompletionRequest,
//   RazorpayOptions,
//   RazorpayResponse,
//   PaymentResult,
//   StoredSessionData,
//   PaymentError,
//   PaymentErrorDetails,
// } from './types';

// // Configuration
// export {
//   RAZORPAY_CONFIG,
//   PRICING_CONFIG,
//   STORAGE_KEYS,
//   API_CONFIG,
//   VALIDATION_RULES,
//   ERROR_MESSAGES,
//   validateConfig,
// } from './razorpay/config';

// // Main payment handler (primary interface)
// export {
//   paymentHandlerService,
//   PaymentHandlerService,
//   initiatePayment,
//   resumePaymentAfterAuth,
//   isRazorpayReady,
//   getPaymentStatus,
//   cleanupPayment,
// } from './razorpay/paymentHandler';

// // Order creation
// export {
//   orderCreationService,
//   OrderCreationService,
//   createOrder,
//   validateOrder,
//   getOrderPreview,
//   retryCreateOrder,
// } from './razorpay/orderCreation';

// // Authentication services
// export {
//   paymentAuthService,
//   PaymentAuthService,
//   checkAuthForPayment,
//   handleAuthReturn,
//   isPostAuthReturn,
//   getCurrentUser,
//   cleanupAuthFlow,
// } from './auth/paymentAuth';

// // Session management
// export {
//   sessionManager,
//   SessionManager,
//   createPaymentContext,
//   getPaymentContext,
//   clearPaymentData,
//   resumePaymentFlow,
//   getSessionDuration,
// } from './auth/sessionManager';

// // Pricing services
// export {
//   dynamicPricingService,
//   DynamicPricingService,
//   getCurrentPricing,
//   isEarlyBirdEligible,
//   getTimeRemaining,
//   getPricingSummary,
// } from './pricing/dynamicPricing';

// // Pricing utilities
// export {
//   formatCurrency,
//   rupeesToPaise,
//   paiseToRupees,
//   calculateDiscountPercentage,
//   getEarlyBirdDiscountPercentage,
//   formatDiscountPercentage,
//   getPricingDisplayInfo,
//   formatTimeRemaining,
//   formatDetailedTimeRemaining,
//   getUrgencyLevel,
//   getUrgencyMessage,
//   getUrgencyClass,
//   getPricingComparison,
//   validatePricingAmount,
//   getPaymentButtonText,
//   getPricingBadgeText,
//   getAllPricingInfo,
// } from './pricing/pricingUtils';

// // API services
// export {
//   paymentApiService,
//   PaymentApiService,
//   createPaymentOrder,
//   completePayment,
//   verifyPayment,
//   checkApiHealth,
//   getApiStatus,
// } from './api/paymentApi';

// // API endpoints
// export {
//   apiEndpoints,
//   ApiEndpoints,
//   validateEndpoint,
//   getEnvironmentEndpoints,
//   PAYMENT_ENDPOINTS,
// } from './api/endpoints';

// // Session storage utilities
// export {
//   sessionStorageManager,
//   SessionStorageManager,
//   storePaymentContext,
//   clearPaymentContext,
//   clearAllPaymentData,
// } from './utils/sessionStorage';

// // Validation utilities
// export {
//   validateSessionId,
//   validateTestId,
//   validateUserId,
//   validateAmount,
//   validateEmail,
//   validateDateString,
//   validatePaymentContext,
//   validateCreateOrderRequest,
//   validatePaymentCompletionRequest,
//   throwIfInvalid,
//   sanitizeString,
//   isNotEmpty,
// } from './utils/validation';

// // ============================================================================
// // CONVENIENCE EXPORTS - Most commonly used functions
// // ============================================================================

// // Primary payment functions (most apps will only need these)
// export {
//   // Main payment flow
//   initiatePayment as startPayment,
//   resumePaymentAfterAuth as continuePaymentAfterSignIn,
  
//   // Pricing information
//   getCurrentPricing as getPaymentPricing,
//   getPricingDisplayInfo as getDisplayPricing,
  
//   // Authentication helpers
//   isPostAuthReturn as isReturningFromSignIn,
//   handleAuthReturn as handleSignInReturn,
  
//   // Session utilities
//   getSessionDuration as getCurrentSessionDuration,
//   clearPaymentData as resetPaymentSession,
// } from './index';

// // ============================================================================
// // UTILITY CLASS - All-in-one payment service
// // ============================================================================

// /**
//  * Main Payment Service Class
//  * Provides a simplified interface for common payment operations
//  */
// export class PaymentService {
  
//   // Start payment process
//   static async startPayment(sessionId: string, testId: string): Promise<PaymentResult> {
//     return paymentHandlerService.initiatePayment(sessionId, testId);
//   }
  
//   // Get current pricing information
//   static getCurrentPricing(sessionStartTime?: string): PricingTier {
//     const startTime = sessionStartTime || sessionManager.getOrCreateSessionStartTime();
//     return dynamicPricingService.calculatePricing(startTime);
//   }
  
//   // Get pricing display information
//   static getPricingDisplay(sessionStartTime?: string): ReturnType<typeof getPricingDisplayInfo> {
//     const pricing = this.getCurrentPricing(sessionStartTime);
//     return getPricingDisplayInfo(pricing);
//   }
  
//   // Check if user needs authentication
//   static async requiresAuthentication(sessionId: string, testId: string): Promise<boolean> {
//     const authResult = await paymentAuthService.checkAuthAndRedirect(sessionId, testId);
//     return authResult.needsAuth;
//   }
  
//   // Handle return from authentication
//   static async handleAuthReturn(): Promise<PaymentResult | null> {
//     return paymentHandlerService.resumePaymentAfterAuth();
//   }
  
//   // Get payment service status
//   static getStatus(): {
//     payment: ReturnType<typeof paymentHandlerService.getPaymentHandlerStatus>;
//     session: ReturnType<typeof sessionManager.getPaymentFlowState>;
//     auth: ReturnType<typeof paymentAuthService.getAuthFlowState>;
//   } {
//     return {
//       payment: paymentHandlerService.getPaymentHandlerStatus(),
//       session: sessionManager.getPaymentFlowState(),
//       auth: paymentAuthService.getAuthFlowState(),
//     };
//   }
  
//   // Clean up all payment data
//   static cleanup(): void {
//     paymentHandlerService.cleanup();
//   }
  
//   // Validate configuration
//   static validateSetup(): {
//     isValid: boolean;
//     issues: string[];
//   } {
//     const configValidation = validateConfig();
//     const paymentStatus = paymentHandlerService.getPaymentHandlerStatus();
    
//     return {
//       isValid: configValidation.isValid && paymentStatus.configValid,
//       issues: [
//         ...configValidation.missingVars.map(v => `Missing environment variable: ${v}`),
//         ...(!paymentStatus.configValid ? ['Invalid Razorpay configuration'] : []),
//       ],
//     };
//   }
// }

// // ============================================================================
// // DEFAULT EXPORT - Main payment service instance
// // ============================================================================

// export default PaymentService;

// // ============================================================================
// // VERSION INFO
// // ============================================================================

// export const PAYMENT_SERVICE_VERSION = '1.0.0';
// export const PAYMENT_SERVICE_INFO = {
//   version: PAYMENT_SERVICE_VERSION,
//   name: 'Payment Service',
//   description: 'Comprehensive payment integration with Razorpay',
//   features: [
//     'Dynamic pricing (early bird / regular)',
//     'Google OAuth integration',
//     'Session management',
//     'Automatic authentication flow',
//     'Comprehensive error handling',
//     'TypeScript support',
//   ],
// } as const;



// src/services/payments/index.ts - SIMPLIFIED
import { paymentHandlerService } from './razorpay/paymentHandler';
import { sessionManager } from './auth/sessionManager';
import type { PaymentResult } from './types';

export class PaymentService {
  static async startPayment(sessionId: string, testId: string): Promise<PaymentResult> {
    return paymentHandlerService.initiatePayment(sessionId, testId);
  }
}

export { sessionManager };
export default PaymentService;

// Types that are actually used
export type { PaymentResult, PaymentContext, StoredSessionData } from './types';