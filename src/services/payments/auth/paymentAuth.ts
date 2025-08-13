import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { PaymentContext } from '../types';
import { sessionManager } from './sessionManager';
import { validateSessionId, validateTestId } from '../utils/validation';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

// Payment authentication service class
class PaymentAuthService {
  
  // Check if user is authenticated and handle redirect if needed
  async checkAuthAndRedirect(
    sessionId: string,
    testId: string,
    currentPath?: string
  ): Promise<{
    needsAuth: boolean;
    user?: User;
    redirected?: boolean;
  }> {
    try {
      // Validate inputs
      const sessionValidation = validateSessionId(sessionId);
      if (!sessionValidation.isValid) {
        throw new Error(`Invalid session ID: ${sessionValidation.errors.join(', ')}`);
      }

      const testValidation = validateTestId(testId);
      if (!testValidation.isValid) {
        throw new Error(`Invalid test ID: ${testValidation.errors.join(', ')}`);
      }

      // Check current authentication status
      const { data: { user }, error } = await supabase.auth.getUser();
      
      if (error || !user) {
        await this.storeContextAndRedirect(sessionId, testId, currentPath);
        return { needsAuth: true, redirected: true };
      }

      // If user is authenticated, return success
      if (user) {
        return {
          needsAuth: false,
          user,
        };
      }

      // User needs authentication - store context and redirect
      await this.storeContextAndRedirect(sessionId, testId, currentPath);
      
      return {
        needsAuth: true,
        redirected: true,
      };

    } catch (error) {
      console.error('Payment auth check failed:', error);
      throw error;
    }
  }

  // Store payment context and redirect to authentication

  private async storeContextAndRedirect(
  sessionId: string,
  testId: string,
  currentPath?: string
): Promise<void> {
  try {
    // Create and store payment context
    const returnUrl = currentPath || window.location.href;
    const context = sessionManager.createPaymentContext(sessionId, testId, returnUrl);
    
    // Mark that authentication is required
    sessionManager.createSessionData(sessionId, testId, true);
    
    console.log('Stored payment context, auth required:', context);
    
    // Don't trigger sign-in here - let the component handle it
    // The toast will be shown in the component's error handling
    
  } catch (error) {
    console.error('Failed to store context:', error);
    throw new Error('Failed to store payment context');
  }
}

  // Initiate Google sign-in flow
  private async initiateGoogleSignIn(): Promise<void> {
    
  }

  // Handle return from authentication (call this after successful auth)
  async handlePostAuthReturn(): Promise<{
    hasPaymentContext: boolean;
    context?: PaymentContext;
    canResumePayment: boolean;
    error?: string;
  }> {
    try {
      // Check if we have a valid payment context to resume
      const resumeResult = sessionManager.resumePaymentFlow();
      
      if (!resumeResult.canResume) {
        return {
          hasPaymentContext: false,
          canResumePayment: false,
          error: resumeResult.reason,
        };
      }

      // Mark authentication as completed
      sessionManager.markAuthenticationCompleted();
      
      console.log('Post-auth return successful, can resume payment:', resumeResult.context);
      
      return {
        hasPaymentContext: true,
        context: resumeResult.context!,
        canResumePayment: true,
      };

    } catch (error) {
      console.error('Post-auth return handling failed:', error);
      return {
        hasPaymentContext: false,
        canResumePayment: false,
        error: 'Failed to handle post-authentication return',
      };
    }
  }

  // Check if current page load is a return from authentication
  isPostAuthReturn(): boolean {
    // Check URL parameters that Supabase auth might add
    const urlParams = new URLSearchParams(window.location.search);
    const hasAuthParams = urlParams.has('access_token') || 
                         urlParams.has('refresh_token') ||
                         urlParams.has('code');
    
    // Check if we have stored payment context
    const hasStoredContext = sessionManager.getPaymentContext() !== null;
    
    return hasAuthParams && hasStoredContext;
  }

  // Get current user safely
  async getCurrentUser(): Promise<User | null> {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      
      if (error) {
        console.error('Failed to get current user:', error);
        return null;
      }
      
      return user;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  }

  // Validate user for payment (additional checks if needed)
  validateUserForPayment(user: User): {
    isValid: boolean;
    reason?: string;
  } {
    if (!user) {
      return {
        isValid: false,
        reason: 'User not authenticated',
      };
    }

    if (!user.email) {
      return {
        isValid: false,
        reason: 'User email not available',
      };
    }

    return { isValid: true };
  }

  // Get user info for payment processing
  getUserInfoForPayment(user: User): {
    email: string;
    name?: string;
    userId: string;
  } {
    return {
      email: user.email!,
      name: user.user_metadata?.full_name || user.user_metadata?.name,
      userId: user.id,
    };
  }

  // Calculate authentication duration (useful for analytics)
  calculateAuthenticationDuration(): number | null {
    const sessionData = sessionManager.getSessionData();
    
    if (!sessionData || !sessionData.authenticationRequired) {
      return null;
    }

    // This is a simplified calculation - you might want to store
    // the exact auth start time for more accuracy
    const sessionStart = new Date(sessionData.sessionStartTime);
    const now = new Date();
    
    return Math.floor((now.getTime() - sessionStart.getTime()) / (60 * 1000)); // minutes
  }

  // Clean up authentication flow data
  cleanupAuthFlow(): void {
    // Clear payment context and session data
    sessionManager.clearAllData();
    
    // Clean up URL parameters if present
    if (this.isPostAuthReturn()) {
      const url = new URL(window.location.href);
      url.searchParams.delete('access_token');
      url.searchParams.delete('refresh_token');
      url.searchParams.delete('code');
      url.searchParams.delete('token_type');
      url.searchParams.delete('expires_in');
      
      // Update URL without page reload
      window.history.replaceState({}, document.title, url.toString());
    }
  }

  // Get authentication flow state for debugging
  getAuthFlowState(): {
    isAuthenticated: boolean;
    hasPaymentContext: boolean;
    requiresAuth: boolean;
    isPostAuthReturn: boolean;
    sessionDuration: number;
  } {
    const user = supabase.auth.getUser();
    const flowState = sessionManager.getPaymentFlowState();
    
    return {
      isAuthenticated: !!user,
      hasPaymentContext: flowState.hasPaymentContext,
      requiresAuth: flowState.requiresAuth,
      isPostAuthReturn: this.isPostAuthReturn(),
      sessionDuration: flowState.sessionDuration,
    };
  }
}

// Create and export singleton instance
export const paymentAuthService = new PaymentAuthService();

// Export the class for testing or custom instances
export { PaymentAuthService };

// Utility functions for direct use
export const checkAuthForPayment = async (
  sessionId: string,
  testId: string,
  currentPath?: string
) => {
  return paymentAuthService.checkAuthAndRedirect(sessionId, testId, currentPath);
};

export const handleAuthReturn = async () => {
  return paymentAuthService.handlePostAuthReturn();
};

export const isPostAuthReturn = (): boolean => {
  return paymentAuthService.isPostAuthReturn();
};

export const getCurrentUser = async (): Promise<User | null> => {
  return paymentAuthService.getCurrentUser();
};

export const cleanupAuthFlow = (): void => {
  paymentAuthService.cleanupAuthFlow();
};