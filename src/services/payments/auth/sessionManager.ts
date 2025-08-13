import { PaymentContext, StoredSessionData } from '../types';
import { sessionStorageManager } from '../utils/sessionStorage';
import { validatePaymentContext, validateSessionId, validateTestId } from '../utils/validation';

// Session manager class for handling payment-related session data
class SessionManager {
  
  // Create and store a new payment context
  createPaymentContext(
    originalSessionId: string,
    testId: string,
    returnUrl?: string
  ): PaymentContext {
    // Validate inputs
    const sessionValidation = validateSessionId(originalSessionId);
    if (!sessionValidation.isValid) {
      throw new Error(`Invalid session ID: ${sessionValidation.errors.join(', ')}`);
    }

    const testValidation = validateTestId(testId);
    if (!testValidation.isValid) {
      throw new Error(`Invalid test ID: ${testValidation.errors.join(', ')}`);
    }

    // Create payment context
    const context: PaymentContext = {
      originalSessionId,
      testId,
      sessionStartTime: this.getOrCreateSessionStartTime(),
      returnUrl: returnUrl || window.location.href,
      timestamp: Date.now(),
    };

    // Validate the created context
    const contextValidation = validatePaymentContext(context);
    if (!contextValidation.isValid) {
      throw new Error(`Invalid payment context: ${contextValidation.errors.join(', ')}`);
    }

    // Store the context
    sessionStorageManager.storePaymentContext(context);
    
    return context;
  }

  // Retrieve stored payment context
  getPaymentContext(): PaymentContext | null {
    return sessionStorageManager.getPaymentContext();
  }

  // Clear payment context
  clearPaymentContext(): void {
    sessionStorageManager.clearPaymentContext();
  }

  // Create and store session data
  createSessionData(
    originalSessionId: string,
    testId: string,
    authenticationRequired: boolean = false
  ): StoredSessionData {
    const sessionData: StoredSessionData = {
      sessionStartTime: this.getOrCreateSessionStartTime(),
      originalSessionId,
      testId,
      authenticationRequired,
    };

    sessionStorageManager.storeSessionData(sessionData);
    return sessionData;
  }

  // Get stored session data
  getSessionData(): StoredSessionData | null {
    return sessionStorageManager.getSessionData();
  }

  // Update session data with pricing snapshot
  updateSessionDataWithPricing(tier: string, amount: number): void {
    const existingData = this.getSessionData();
    
    if (!existingData) {
      throw new Error('No session data found to update');
    }

    const updatedData: StoredSessionData = {
      ...existingData,
      pricingSnapshot: {
        tier,
        amount,
        calculatedAt: new Date().toISOString(),
      },
    };

    sessionStorageManager.storeSessionData(updatedData);
    sessionStorageManager.storePricingSnapshot(tier, amount);
  }

  // Check if user needs authentication for payment
  requiresAuthentication(): boolean {
    const sessionData = this.getSessionData();
    return sessionData?.authenticationRequired ?? false;
  }

  // Mark authentication as completed
  markAuthenticationCompleted(): void {
    const sessionData = this.getSessionData();
    
    if (sessionData) {
      const updatedData: StoredSessionData = {
        ...sessionData,
        authenticationRequired: false,
      };
      sessionStorageManager.storeSessionData(updatedData);
    }
  }

  // Get or create session start time
  getOrCreateSessionStartTime(): string {
    return sessionStorageManager.getOrCreateSessionStartTime();
  }

  // Reset session start time (for new sessions)
  resetSessionStartTime(): string {
    sessionStorageManager.clearSessionStartTime();
    return sessionStorageManager.getOrCreateSessionStartTime();
  }

  // Get session duration in minutes
  getSessionDuration(): number {
    const startTime = sessionStorageManager.getSessionData()?.sessionStartTime;
    
    if (!startTime) {
      return 0;
    }

    const start = new Date(startTime);
    const now = new Date();
    const durationMs = now.getTime() - start.getTime();
    
    return Math.floor(durationMs / (60 * 1000)); // Convert to minutes
  }

  // Check if session is expired (based on your business logic)
  isSessionExpired(maxDurationMinutes: number = 120): boolean {
    const duration = this.getSessionDuration();
    return duration > maxDurationMinutes;
  }

  // Prepare session metadata for API calls
  prepareSessionMetadata(): {
    userAgent: string;
    timestamp: string;
    sessionDuration: number;
    authenticationRequired: boolean;
  } {
    const sessionData = this.getSessionData();
    
    return {
      userAgent: navigator.userAgent,
      timestamp: new Date().toISOString(),
      sessionDuration: this.getSessionDuration(),
      authenticationRequired: sessionData?.authenticationRequired ?? false,
    };
  }

  // Get payment flow state
  getPaymentFlowState(): {
    hasPaymentContext: boolean;
    hasSessionData: boolean;
    hasPricingSnapshot: boolean;
    sessionDuration: number;
    requiresAuth: boolean;
  } {
    const paymentContext = this.getPaymentContext();
    const sessionData = this.getSessionData();
    const pricingSnapshot = sessionStorageManager.getPricingSnapshot();

    return {
      hasPaymentContext: !!paymentContext,
      hasSessionData: !!sessionData,
      hasPricingSnapshot: !!pricingSnapshot,
      sessionDuration: this.getSessionDuration(),
      requiresAuth: this.requiresAuthentication(),
    };
  }

  // Resume payment flow after authentication
  resumePaymentFlow(): {
    context: PaymentContext | null;
    sessionData: StoredSessionData | null;
    canResume: boolean;
    reason?: string;
  } {
    const context = this.getPaymentContext();
    const sessionData = this.getSessionData();

    if (!context) {
      return {
        context: null,
        sessionData: null,
        canResume: false,
        reason: 'No payment context found',
      };
    }

    if (!sessionData) {
      return {
        context,
        sessionData: null,
        canResume: false,
        reason: 'No session data found',
      };
    }

    // Check if context is still valid (not too old)
    const contextAge = Date.now() - context.timestamp;
    const oneHour = 60 * 60 * 1000;

    if (contextAge > oneHour) {
      this.clearAllData();
      return {
        context: null,
        sessionData: null,
        canResume: false,
        reason: 'Payment context has expired',
      };
    }

    return {
      context,
      sessionData,
      canResume: true,
    };
  }

  // Validate session continuity
  validateSessionContinuity(
    currentSessionId: string,
    currentTestId: string
  ): { isValid: boolean; reason?: string } {
    const sessionData = this.getSessionData();
    const paymentContext = this.getPaymentContext();

    if (!sessionData || !paymentContext) {
      return {
        isValid: false,
        reason: 'Missing session data or payment context',
      };
    }

    if (paymentContext.originalSessionId !== currentSessionId) {
      return {
        isValid: false,
        reason: 'Session ID mismatch',
      };
    }

    if (paymentContext.testId !== currentTestId) {
      return {
        isValid: false,
        reason: 'Test ID mismatch',
      };
    }

    return { isValid: true };
  }

  // Clear all session-related data
  clearAllData(): void {
    sessionStorageManager.clearAllPaymentData();
  }

  // Get debug information
  getDebugInfo(): {
    paymentContext: PaymentContext | null;
    sessionData: StoredSessionData | null;
    pricingSnapshot: any;
    flowState: any;
    sessionDuration: number;
  } {
    return {
      paymentContext: this.getPaymentContext(),
      sessionData: this.getSessionData(),
      pricingSnapshot: sessionStorageManager.getPricingSnapshot(),
      flowState: this.getPaymentFlowState(),
      sessionDuration: this.getSessionDuration(),
    };
  }
}

// Create and export singleton instance
export const sessionManager = new SessionManager();

// Export the class for testing or custom instances
export { SessionManager };

// Utility functions for direct use
export const createPaymentContext = (
  originalSessionId: string,
  testId: string,
  returnUrl?: string
): PaymentContext => {
  return sessionManager.createPaymentContext(originalSessionId, testId, returnUrl);
};

export const getPaymentContext = (): PaymentContext | null => {
  return sessionManager.getPaymentContext();
};

export const clearPaymentData = (): void => {
  sessionManager.clearAllData();
};

export const resumePaymentFlow = () => {
  return sessionManager.resumePaymentFlow();
};

export const getSessionDuration = (): number => {
  return sessionManager.getSessionDuration();
};