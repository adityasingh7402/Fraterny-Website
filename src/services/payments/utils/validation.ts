import { VALIDATION_RULES } from '../razorpay/config';
import { PaymentContext, CreateOrderRequest, PaymentCompletionRequest } from '../types';

// Validation result interface
interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

// Session ID validation
export const validateSessionId = (sessionId: string): ValidationResult => {
  const errors: string[] = [];
  
  if (!sessionId) {
    errors.push('Session ID is required');
    return { isValid: false, errors };
  }
  
  if (typeof sessionId !== 'string') {
    errors.push('Session ID must be a string');
  }
  
  // if (sessionId.length < VALIDATION_RULES.SESSION_ID.MIN_LENGTH) {
  //   errors.push(`Session ID must be at least ${VALIDATION_RULES.SESSION_ID.MIN_LENGTH} characters`);
  // }
  
  // if (sessionId.length > VALIDATION_RULES.SESSION_ID.MAX_LENGTH) {
  //   errors.push(`Session ID must be no more than ${VALIDATION_RULES.SESSION_ID.MAX_LENGTH} characters`);
  // }
  
  // if (!VALIDATION_RULES.SESSION_ID.PATTERN.test(sessionId)) {
  //   errors.push('Session ID contains invalid characters. Only letters, numbers, hyphens, and underscores are allowed');
  // }
  
  return { isValid: errors.length === 0, errors };
};

// Test ID validation
export const validateTestId = (testId: string): ValidationResult => {
  const errors: string[] = [];
  
  if (!testId) {
    errors.push('Test ID is required');
    return { isValid: false, errors };
  }
  
  if (typeof testId !== 'string') {
    errors.push('Test ID must be a string');
  }
  
  // if (testId.length < VALIDATION_RULES.TEST_ID.MIN_LENGTH) {
  //   errors.push(`Test ID must be at least ${VALIDATION_RULES.TEST_ID.MIN_LENGTH} characters`);
  // }
  
  // if (testId.length > VALIDATION_RULES.TEST_ID.MAX_LENGTH) {
  //   errors.push(`Test ID must be no more than ${VALIDATION_RULES.TEST_ID.MAX_LENGTH} characters`);
  // }
  
  // if (!VALIDATION_RULES.TEST_ID.PATTERN.test(testId)) {
  //   errors.push('Test ID contains invalid characters. Only letters, numbers, hyphens, and underscores are allowed');
  // }
  
  return { isValid: errors.length === 0, errors };
};

// User ID validation
export const validateUserId = (userId: string): ValidationResult => {
  const errors: string[] = [];
  
  if (!userId) {
    errors.push('User ID is required');
    return { isValid: false, errors };
  }
  
  if (typeof userId !== 'string') {
    errors.push('User ID must be a string');
  }
  
  if (userId.trim().length === 0) {
    errors.push('User ID cannot be empty');
  }
  
  return { isValid: errors.length === 0, errors };
};

// Amount validation
export const validateAmount = (amount: number): ValidationResult => {
  const errors: string[] = [];
  
  if (amount === undefined || amount === null) {
    errors.push('Amount is required');
    return { isValid: false, errors };
  }
  
  if (typeof amount !== 'number') {
    errors.push('Amount must be a number');
  }
  
  if (!Number.isInteger(amount)) {
    errors.push('Amount must be an integer (in paise)');
  }
  
  if (amount < VALIDATION_RULES.AMOUNT.MIN) {
    errors.push(`Amount must be at least ₹${VALIDATION_RULES.AMOUNT.MIN / 100}`);
  }
  
  if (amount > VALIDATION_RULES.AMOUNT.MAX) {
    errors.push(`Amount must be no more than ₹${VALIDATION_RULES.AMOUNT.MAX / 100}`);
  }
  
  return { isValid: errors.length === 0, errors };
};

// Email validation
export const validateEmail = (email: string): ValidationResult => {
  const errors: string[] = [];
  
  if (!email) {
    errors.push('Email is required');
    return { isValid: false, errors };
  }
  
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    errors.push('Invalid email format');
  }
  
  return { isValid: errors.length === 0, errors };
};

// Date string validation
export const validateDateString = (dateString: string, fieldName: string = 'Date'): ValidationResult => {
  const errors: string[] = [];
  
  if (!dateString) {
    errors.push(`${fieldName} is required`);
    return { isValid: false, errors };
  }
  
  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    errors.push(`${fieldName} is not a valid date`);
  }
  
  return { isValid: errors.length === 0, errors };
};

// Payment context validation
export const validatePaymentContext = (context: PaymentContext): ValidationResult => {
  const errors: string[] = [];
  
  // Validate session ID
  const sessionIdResult = validateSessionId(context.originalSessionId);
  if (!sessionIdResult.isValid) {
    errors.push(...sessionIdResult.errors.map(e => `Original ${e}`));
  }
  
  // Validate test ID
  const testIdResult = validateTestId(context.testId);
  if (!testIdResult.isValid) {
    errors.push(...testIdResult.errors);
  }
  
  // Validate session start time
  const startTimeResult = validateDateString(context.sessionStartTime, 'Session start time');
  if (!startTimeResult.isValid) {
    errors.push(...startTimeResult.errors);
  }
  
  // Validate return URL
  if (!context.returnUrl || typeof context.returnUrl !== 'string') {
    errors.push('Return URL is required and must be a string');
  }
  
  // Validate timestamp
  if (!context.timestamp || typeof context.timestamp !== 'number') {
    errors.push('Timestamp is required and must be a number');
  }
  
  return { isValid: errors.length === 0, errors };
};

// Create order request validation
export const validateCreateOrderRequest = (request: CreateOrderRequest): ValidationResult => {
  const errors: string[] = [];
  
  // Validate session ID
  const sessionIdResult = validateSessionId(request.sessionId);
  if (!sessionIdResult.isValid) {
    errors.push(...sessionIdResult.errors);
  }
  
  // Validate test ID
  const testIdResult = validateTestId(request.testId);
  if (!testIdResult.isValid) {
    errors.push(...testIdResult.errors);
  }
  
  // Validate user ID
  const userIdResult = validateUserId(request.userId);
  if (!userIdResult.isValid) {
    errors.push(...userIdResult.errors);
  }
  
  // Validate amount
  const amountResult = validateAmount(request.amount);
  if (!amountResult.isValid) {
    errors.push(...amountResult.errors);
  }
  
  // Validate pricing tier
  if (!['early', 'regular'].includes(request.pricingTier)) {
    errors.push('Pricing tier must be either "early" or "regular"');
  }
  
  // Validate session start time
  const startTimeResult = validateDateString(request.sessionStartTime, 'Session start time');
  if (!startTimeResult.isValid) {
    errors.push(...startTimeResult.errors);
  }
  
  // Validate metadata
  if (!request.metadata || typeof request.metadata !== 'object') {
    errors.push('Metadata is required and must be an object');
  } else {
    if (!request.metadata.userAgent || typeof request.metadata.userAgent !== 'string') {
      errors.push('User agent is required in metadata');
    }
    
    if (!request.metadata.timestamp || typeof request.metadata.timestamp !== 'string') {
      errors.push('Timestamp is required in metadata');
    }
    
    if (typeof request.metadata.authenticationRequired !== 'boolean') {
      errors.push('Authentication required flag is required in metadata');
    }
  }
  
  return { isValid: errors.length === 0, errors };
};

// Payment completion request validation
export const validatePaymentCompletionRequest = (request: PaymentCompletionRequest): ValidationResult => {
  const errors: string[] = [];
  
  // Validate user ID
  const userIdResult = validateUserId(request.userId);
  if (!userIdResult.isValid) {
    errors.push(...userIdResult.errors);
  }
  
  // Validate session IDs
  const originalSessionResult = validateSessionId(request.originalSessionId);
  if (!originalSessionResult.isValid) {
    errors.push(...originalSessionResult.errors.map(e => `Original ${e}`));
  }
  
  const paymentSessionResult = validateSessionId(request.paymentSessionId);
  if (!paymentSessionResult.isValid) {
    errors.push(...paymentSessionResult.errors.map(e => `Payment ${e}`));
  }
  
  // Validate test ID
  const testIdResult = validateTestId(request.testId);
  if (!testIdResult.isValid) {
    errors.push(...testIdResult.errors);
  }
  
  // Validate gateway
  if (!request.gateway || !['razorpay', 'paypal'].includes(request.gateway)) {
    errors.push('Gateway is required and must be either "razorpay" or "paypal"');
  }
  
  // Validate payment data
  if (!request.paymentData || typeof request.paymentData !== 'object') {
    errors.push('Payment data is required and must be an object');
  } else {
    const paymentData = request.paymentData;
    
    // Gateway-aware validation
    if (request.gateway === 'razorpay') {
      // Razorpay-specific validation
      if (!paymentData.order_id || typeof paymentData.order_id !== 'string') {
        errors.push('Razorpay order ID is required');
      }
      
      if (!paymentData.payment_id || typeof paymentData.payment_id !== 'string') {
        errors.push('Razorpay payment ID is required');
      }
      
      if (!paymentData.razorpay_signature || typeof paymentData.razorpay_signature !== 'string') {
        errors.push('Razorpay signature is required');
      }
    } else if (request.gateway === 'paypal') {
      // PayPal-specific validation
      if (!paymentData.order_id || typeof paymentData.order_id !== 'string') {
        errors.push('PayPal order ID is required');
      }
      
      if (!paymentData.payment_id || typeof paymentData.payment_id !== 'string') {
        errors.push('PayPal payment ID is required');
      }
      
      // PayPal doesn't require signature
      // payer_id is optional for PayPal validation
      // paypal_order_id is optional but helpful for backend compatibility
    } else {
      errors.push('Gateway must be either "razorpay" or "paypal"');
    }
    
    // Common validation for both gateways
    if (!['success', 'failed'].includes(paymentData.status)) {
      errors.push('Payment status must be either "success" or "failed"');
    }
    
    const amountResult = validateAmount(paymentData.amount);
    if (!amountResult.isValid) {
      errors.push(...amountResult.errors.map(e => `Payment ${e}`));
    }
  }
  
  return { isValid: errors.length === 0, errors };
};

// Utility function to throw validation errors
export const throwIfInvalid = (validationResult: ValidationResult, context: string = 'Validation'): void => {
  if (!validationResult.isValid) {
    throw new Error(`${context} failed: ${validationResult.errors.join(', ')}`);
  }
};

// Sanitize string inputs
export const sanitizeString = (input: string): string => {
  return input.trim().replace(/[<>]/g, '');
};

// Check if value is not null or undefined
export const isNotEmpty = (value: any): boolean => {
  return value !== null && value !== undefined && value !== '';
};