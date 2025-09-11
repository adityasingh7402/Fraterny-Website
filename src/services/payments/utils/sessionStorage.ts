import { PaymentContext, StoredSessionData } from '../types';
import { STORAGE_KEYS } from '../razorpay/config';

// Session storage utility class
class SessionStorageManager {
  
  // Store payment context for post-auth retrieval
  storePaymentContext(context: PaymentContext): void {
    try {
      const serialized = JSON.stringify(context);
      sessionStorage.setItem(STORAGE_KEYS.PAYMENT_CONTEXT, serialized);
    } catch (error) {
      console.error('Failed to store payment context:', error);
      throw new Error('Unable to store payment context');
    }
  }

  // Retrieve payment context after authentication
  getPaymentContext(): PaymentContext | null {
    try {
      const stored = sessionStorage.getItem(STORAGE_KEYS.PAYMENT_CONTEXT);
      if (!stored) return null;
      
      const context = JSON.parse(stored) as PaymentContext;
      
      // Validate context age (expire after 1 hour)
      const oneHour = 60 * 60 * 1000;
      if (Date.now() - context.timestamp > oneHour) {
        this.clearPaymentContext();
        return null;
      }
      
      return context;
    } catch (error) {
      console.error('Failed to retrieve payment context:', error);
      this.clearPaymentContext();
      return null;
    }
  }

  // Clear payment context
  clearPaymentContext(): void {
    try {
      sessionStorage.removeItem(STORAGE_KEYS.PAYMENT_CONTEXT);
    } catch (error) {
      console.error('Failed to clear payment context:', error);
    }
  }

  // Store session data
  storeSessionData(data: StoredSessionData): void {
    try {
      const serialized = JSON.stringify(data);
      sessionStorage.setItem(STORAGE_KEYS.SESSION_DATA, serialized);
    } catch (error) {
      console.error('Failed to store session data:', error);
      throw new Error('Unable to store session data');
    }
  }

  // Get session data
  getSessionData(): StoredSessionData | null {
    try {
      const stored = sessionStorage.getItem(STORAGE_KEYS.SESSION_DATA);
      if (!stored) return null;
      
      return JSON.parse(stored) as StoredSessionData;
    } catch (error) {
      console.error('Failed to retrieve session data:', error);
      this.clearSessionData();
      return null;
    }
  }

  // Clear session data
  clearSessionData(): void {
    try {
      sessionStorage.removeItem(STORAGE_KEYS.SESSION_DATA);
    } catch (error) {
      console.error('Failed to clear session data:', error);
    }
  }

  // Store pricing snapshot
  storePricingSnapshot(tier: string, amount: number): void {
    try {
      const snapshot = {
        tier,
        amount,
        calculatedAt: new Date().toISOString(),
      };
      const serialized = JSON.stringify(snapshot);
      sessionStorage.setItem(STORAGE_KEYS.PRICING_SNAPSHOT, serialized);
    } catch (error) {
      console.error('Failed to store pricing snapshot:', error);
    }
  }

  // Get pricing snapshot
  getPricingSnapshot(): { tier: string; amount: number; calculatedAt: string } | null {
    try {
      const stored = sessionStorage.getItem(STORAGE_KEYS.PRICING_SNAPSHOT);
      if (!stored) return null;
      
      return JSON.parse(stored);
    } catch (error) {
      console.error('Failed to retrieve pricing snapshot:', error);
      this.clearPricingSnapshot();
      return null;
    }
  }

  // Clear pricing snapshot
  clearPricingSnapshot(): void {
    try {
      sessionStorage.removeItem(STORAGE_KEYS.PRICING_SNAPSHOT);
    } catch (error) {
      console.error('Failed to clear pricing snapshot:', error);
    }
  }

  // Clear all payment-related storage
  clearAllPaymentData(): void {
    this.clearPaymentContext();
    this.clearSessionData();
    this.clearPricingSnapshot();
  }

  // Check if browser supports sessionStorage
  // isSessionStorageAvailable(): boolean {
  //   try {
  //     const test = '__test__';
  //     sessionStorage.setItem(test, test);
  //     sessionStorage.removeItem(test);
  //     return true;
  //   } catch (error) {
  //     return false;
  //   }
  // }

  // Get current session start time (create if doesn't exist)
  getOrCreateSessionStartTime(): string {
    const key = 'session_start_time';
    let startTime = sessionStorage.getItem(key);
    
    if (!startTime) {
      startTime = new Date().toISOString();
      sessionStorage.setItem(key, startTime);
    }
    
    return startTime;
  }

  // Clear session start time
  // clearSessionStartTime(): void {
  //   sessionStorage.removeItem('session_start_time');
  // }

  // Debug: Get all payment-related storage items
  // getAllPaymentStorageItems(): Record<string, any> {
  //   return {
  //     paymentContext: this.getPaymentContext(),
  //     sessionData: this.getSessionData(),
  //     pricingSnapshot: this.getPricingSnapshot(),
  //     sessionStartTime: sessionStorage.getItem('session_start_time'),
  //   };
  // }
}

// Create and export singleton instance
export const sessionStorageManager = new SessionStorageManager();

// Export the class for testing or custom instances
export { SessionStorageManager };

// Utility functions for direct use
// export const storePaymentContext = (context: PaymentContext): void => {
//   sessionStorageManager.storePaymentContext(context);
// };

// export const getPaymentContext = (): PaymentContext | null => {
//   return sessionStorageManager.getPaymentContext();
// };

// export const clearPaymentContext = (): void => {
//   sessionStorageManager.clearPaymentContext();
// };

// export const clearAllPaymentData = (): void => {
//   sessionStorageManager.clearAllPaymentData();
// };