// Core payment interfaces
export interface PaymentContext {
  originalSessionId: string;    // Session before auth
  testId: string;
  sessionStartTime: string;     // When the original session started
  returnUrl: string;            // Where to return after auth
  timestamp: number;            // When context was stored
}

// Pricing related interfaces
export interface PricingTier {
  name: 'early' | 'regular';
  amount: number;               // in paise
  description: string;
  validUntil?: Date;
  timeRemaining?: number;       // minutes remaining for current tier
}

// API request interfaces
export interface CreateOrderRequest {
  sessionId: string;
  testId: string;
  userId: string;   
  fixEmail: string;          // To fix missing email issue
  //fixName: string;           // To fix missing name issue           
  pricingTier: 'early' | 'regular';
  amount: number;              // in paise
  sessionStartTime: string;    // Original session start time
  isIndia: boolean;
  metadata: {
    userAgent: string;
    timestamp: string;
    authenticationRequired: boolean;
    isIndia: boolean;
    location: string | null;
  };
}

export interface CreateOrderResponse {
  razorpayOrderId: string;
  amount: number;
  currency: string;
  paymentSessionId: string;    // Backend generated session ID
}

// Payment completion interfaces
export interface PaymentCompletionRequest {
  userId: string;
  originalSessionId: string;   // Session before auth
  testId: string;
  paymentSessionId: string;    // From create-order response
  paymentData: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
    amount: number;
    currency: string;
    status: 'success' | 'failed';
  };
  metadata: {
    pricingTier: 'early' | 'regular';
    sessionStartTime: string;
    paymentStartTime: string;
    paymentCompletedTime: string;
    authenticationFlow: boolean;
    userAgent: string;
    timingData: {
      sessionToPaymentDuration: number;  // minutes
      authenticationDuration?: number;   // minutes (if auth was required)
    };
  };
}

// Razorpay specific interfaces
export interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: RazorpayResponse) => void;
  prefill: {
    email?: string;
    name?: string;
  };
  theme: {
    color: string;
  };
}

export interface RazorpayResponse {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

// Session storage interfaces
export interface StoredSessionData {
  sessionStartTime: string;
  originalSessionId: string;
  testId: string;
  authenticationRequired: boolean;
  pricingSnapshot?: {
    tier: string;
    amount: number;
    calculatedAt: string;
  };
}

// Payment flow result interfaces
export interface PaymentResult {
  success: boolean;
  paymentData?: RazorpayResponse | PayPalPaymentData;
  error?: string;
}

// PayPal specific interfaces
export interface PayPalPaymentData {
  paypal_order_id: string;
  amount: number;
  currency: string;
  status: string;
  payer_email?: string;
}

// Extended payment completion request for multiple gateways
export interface UnifiedPaymentCompletionRequest extends Omit<PaymentCompletionRequest, 'paymentData'> {
  paymentData: {
    // Razorpay fields (optional)
    razorpay_order_id?: string;
    razorpay_payment_id?: string;
    razorpay_signature?: string;
    // PayPal fields (optional)
    paypal_order_id?: string;
    payer_email?: string;
    // Common fields
    amount: number;
    currency: string;
    status: 'success' | 'failed' | 'completed';
    gateway: 'razorpay' | 'paypal';
  };
}

// Error types
export type PaymentError = 
  | 'AUTHENTICATION_REQUIRED'
  | 'PAYMENT_FAILED'
  | 'NETWORK_ERROR'
  | 'SESSION_EXPIRED'
  | 'INVALID_AMOUNT'
  | 'ORDER_CREATION_FAILED';

export interface PaymentErrorDetails {
  type: PaymentError;
  message: string;
  retryable: boolean;
}