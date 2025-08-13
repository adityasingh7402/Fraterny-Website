import { CreateOrderRequest, CreateOrderResponse, PaymentError } from '../types';
import { paymentAuthService } from '../auth/paymentAuth';
import { dynamicPricingService } from '../pricing/dynamicPricing';
import { sessionManager } from '../auth/sessionManager';
import { paymentApiService } from '../api/paymentApi';
import { validateCreateOrderRequest } from '../utils/validation';

// Order creation service class
class OrderCreationService {

  // Create a new payment order
  async createPaymentOrder(
    sessionId: string,
    testId: string
  ): Promise<CreateOrderResponse> {
    try {
      console.log('Starting order creation process:', { sessionId, testId });

      // Step 1: Check authentication
      const authResult = await paymentAuthService.checkAuthAndRedirect(
        sessionId,
        testId,
        window.location.pathname
      );

      if (authResult.needsAuth) {
        throw new Error('AUTHENTICATION_REQUIRED');
      }

      if (!authResult.user) {
        throw new Error('User authentication failed');
      }

      // Step 2: Get or create session start time
      const sessionStartTime = sessionManager.getOrCreateSessionStartTime();

      // Step 3: Calculate current pricing
      const currentPricing = dynamicPricingService.calculatePricing(sessionStartTime);
      console.log('Current pricing:', currentPricing);

      // Step 4: Create session data first, then update with pricing
      const existingSessionData = sessionManager.getSessionData();
      if (!existingSessionData) {
        console.log('Creating new session data...');
        sessionManager.createSessionData(sessionId, testId, false);
      }

      // Now update with pricing
      sessionManager.updateSessionDataWithPricing(currentPricing.name, currentPricing.amount);

      // Step 5: Prepare metadata
      const metadata = sessionManager.prepareSessionMetadata();

      // Step 6: Build order request
      const orderRequest: CreateOrderRequest = {
        sessionId,
        testId,
        userId: authResult.user.id,
        pricingTier: currentPricing.name,
        amount: currentPricing.amount,
        sessionStartTime,
        metadata: {
          ...metadata,
          authenticationRequired: authResult.needsAuth || false,
        },
      };

      // Step 7: Validate order request
      const validation = validateCreateOrderRequest(orderRequest);
      if (!validation.isValid) {
        throw new Error(`Order validation failed: ${validation.errors.join(', ')}`);
      }

      // Step 8: Call backend API to create order
      console.log('Calling backend to create order...');
      const orderResponse = await paymentApiService.createOrder(orderRequest);

      console.log('Order created successfully:', orderResponse);
      return orderResponse;

    } catch (error) {
      console.error('Order creation failed:', error);
      throw this.handleOrderCreationError(error);
    }
  }

  // Validate order before creating
  async validateOrderCreation(
    sessionId: string,
    testId: string
  ): Promise<{
    isValid: boolean;
    pricing?: any;
    user?: any;
    errors?: string[];
  }> {
    const errors: string[] = [];

    try {
      // Check authentication
      const user = await paymentAuthService.getCurrentUser();
      if (!user) {
        errors.push('User not authenticated');
      }

      // Validate user for payment
      if (user) {
        const userValidation = paymentAuthService.validateUserForPayment(user);
        if (!userValidation.isValid) {
          errors.push(userValidation.reason || 'User validation failed');
        }
      }

      // Check session continuity
      const continuityCheck = sessionManager.validateSessionContinuity(sessionId, testId);
      if (!continuityCheck.isValid) {
        // This is a warning, not necessarily an error
        console.warn('Session continuity check:', continuityCheck.reason);
      }

      // Get current pricing
      const sessionStartTime = sessionManager.getOrCreateSessionStartTime();
      const pricing = dynamicPricingService.calculatePricing(sessionStartTime);

      return {
        isValid: errors.length === 0,
        pricing,
        user,
        errors: errors.length > 0 ? errors : undefined,
      };

    } catch (error) {
      console.error('Order validation error:', error);
      errors.push('Validation process failed');
      
      return {
        isValid: false,
        errors,
      };
    }
  }

  // Get order preview information
  async getOrderPreview(
    sessionId: string,
    testId: string
  ): Promise<{
    pricing: any;
    user: any;
    metadata: any;
    canProceed: boolean;
    errors?: string[];
  }> {
    try {
      const validation = await this.validateOrderCreation(sessionId, testId);
      
      if (!validation.isValid) {
        return {
          pricing: validation.pricing,
          user: validation.user,
          metadata: null,
          canProceed: false,
          errors: validation.errors,
        };
      }

      const metadata = sessionManager.prepareSessionMetadata();

      return {
        pricing: validation.pricing,
        user: validation.user,
        metadata,
        canProceed: true,
      };

    } catch (error) {
      console.error('Order preview error:', error);
      return {
        pricing: null,
        user: null,
        metadata: null,
        canProceed: false,
        errors: ['Failed to generate order preview'],
      };
    }
  }

  // Handle different types of order creation errors
  private handleOrderCreationError(error: any): Error {
    const errorMessage = error?.message || 'Unknown error';

    // Map specific errors to user-friendly messages
    if (errorMessage === 'AUTHENTICATION_REQUIRED') {
      return new Error('AUTHENTICATION_REQUIRED');
    }

    if (errorMessage.includes('Network error')) {
      return new Error('NETWORK_ERROR');
    }

    if (errorMessage.includes('validation')) {
      return new Error('INVALID_DATA');
    }

    if (errorMessage.includes('Server error') || errorMessage.includes('500')) {
      return new Error('SERVER_ERROR');
    }

    if (errorMessage.includes('timeout')) {
      return new Error('TIMEOUT_ERROR');
    }

    // Default to order creation failed
    return new Error('ORDER_CREATION_FAILED');
  }

  // Retry order creation with exponential backoff
  async retryOrderCreation(
    sessionId: string,
    testId: string,
    maxRetries: number = 3
  ): Promise<CreateOrderResponse> {
    let lastError: Error;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        console.log(`Order creation attempt ${attempt}/${maxRetries}`);
        
        // Add delay for retries (exponential backoff)
        if (attempt > 1) {
          const delay = Math.pow(2, attempt - 1) * 1000; // 2s, 4s, 8s
          await new Promise(resolve => setTimeout(resolve, delay));
        }

        return await this.createPaymentOrder(sessionId, testId);

      } catch (error) {
        lastError = error as Error;
        console.warn(`Order creation attempt ${attempt} failed:`, error);

        // Don't retry for certain types of errors
        if (error instanceof Error) {
          const nonRetryableErrors = [
            'AUTHENTICATION_REQUIRED',
            'INVALID_DATA',
            'USER_VALIDATION_FAILED'
          ];
          
          if (nonRetryableErrors.some(errType => error.message.includes(errType))) {
            throw error;
          }
        }
      }
    }

    // If all retries failed, throw the last error
    throw lastError!;
  }

  // Get order creation status for debugging
  getOrderCreationDebugInfo(): {
    authFlow: any;
    sessionFlow: any;
    pricingInfo: any;
  } {
    const sessionStartTime = sessionManager.getOrCreateSessionStartTime();
    
    return {
      authFlow: paymentAuthService.getAuthFlowState(),
      sessionFlow: sessionManager.getPaymentFlowState(),
      pricingInfo: dynamicPricingService.getPricingSummary(sessionStartTime),
    };
  }
}

// Create and export singleton instance
export const orderCreationService = new OrderCreationService();

// Export the class for testing or custom instances
export { OrderCreationService };

// Utility functions for direct use
export const createOrder = async (sessionId: string, testId: string): Promise<CreateOrderResponse> => {
  return orderCreationService.createPaymentOrder(sessionId, testId);
};

export const validateOrder = async (sessionId: string, testId: string) => {
  return orderCreationService.validateOrderCreation(sessionId, testId);
};

export const getOrderPreview = async (sessionId: string, testId: string) => {
  return orderCreationService.getOrderPreview(sessionId, testId);
};

export const retryCreateOrder = async (sessionId: string, testId: string, maxRetries?: number) => {
  return orderCreationService.retryOrderCreation(sessionId, testId, maxRetries);
};