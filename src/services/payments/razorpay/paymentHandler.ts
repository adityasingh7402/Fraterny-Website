import { 
  CreateOrderResponse, 
  RazorpayOptions, 
  RazorpayResponse, 
  PaymentResult, 
  PaymentCompletionRequest 
} from '../types';
import { RAZORPAY_CONFIG, ERROR_MESSAGES } from './config';
import { paymentAuthService } from '../auth/paymentAuth';
import { sessionManager } from '../auth/sessionManager';
import { paymentApiService } from '../api/paymentApi';
import { orderCreationService } from './orderCreation';
import { googleAnalytics } from '../../analytics/googleAnalytics';

// Declare Razorpay for TypeScript
declare global {
  interface Window {
    Razorpay: any;
  }
}

// Main payment handler service class
class PaymentHandlerService {
  private isRazorpayLoaded: boolean = false;

  // Initialize payment flow
  async initiatePayment(
    sessionId: string,
    testId: string
  ): Promise<PaymentResult> {
    try {
      console.log('Initiating payment flow:', { sessionId, testId });

      // Step 1: Ensure Razorpay is loaded
      await this.ensureRazorpayLoaded();

      // Step 2: Create order (handles auth if needed)
      const orderData = await orderCreationService.createPaymentOrder(sessionId, testId);
      console.log('Order created:', orderData);

      // Step 3: Get current user info
      const user = await paymentAuthService.getCurrentUser();
      if (!user) {
        throw new Error('User authentication lost during payment initiation');
      }

      const userInfo = paymentAuthService.getUserInfoForPayment(user);
      console.log('User info for payment:', userInfo);
      

      // Step 4: Open Razorpay modal
      const paymentResult = await this.openRazorpayModal(orderData, userInfo);

      // Step 5: Handle payment result
      if (paymentResult.success && paymentResult.paymentData) {
        await this.handlePaymentSuccess(orderData, paymentResult.paymentData, user.id);
      }

      return paymentResult;

    } catch (error) {
      console.error('Payment initiation failed:', error);
      return this.handlePaymentError(error);
    }
  }

  // Ensure Razorpay script is loaded
  private async ensureRazorpayLoaded(): Promise<void> {
    if (this.isRazorpayLoaded && window.Razorpay) {
      return;
    }

    return new Promise((resolve, reject) => {
      // Check if already loaded
      if (window.Razorpay) {
        this.isRazorpayLoaded = true;
        resolve();
        return;
      }

      // Create script element
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;

      script.onload = () => {
        if (window.Razorpay) {
          this.isRazorpayLoaded = true;
          console.log('Razorpay script loaded successfully');
          resolve();
        } else {
          reject(new Error('Razorpay object not available after script load'));
        }
      };

      script.onerror = () => {
        reject(new Error('Failed to load Razorpay script'));
      };

      // Add to document
      document.head.appendChild(script);

      // Timeout after 10 seconds
      setTimeout(() => {
        if (!this.isRazorpayLoaded) {
          reject(new Error('Razorpay script load timeout'));
        }
      }, 10000);
    });
  }

  // Open Razorpay payment modal
  private async openRazorpayModal(
    orderData: CreateOrderResponse,
    userInfo: { email: string; name?: string; userId: string }
  ): Promise<PaymentResult> {
    return new Promise((resolve) => {
      try {
        const options: RazorpayOptions = {
          key: RAZORPAY_CONFIG.KEY_ID,
          amount: orderData.amount,
          currency: orderData.currency,
          name: RAZORPAY_CONFIG.COMPANY_NAME,
          description: `Payment for Test`,
          order_id: orderData.razorpayOrderId,
          // handler: (response: RazorpayResponse) => {
          //   console.log('Payment successful:', response);
          //   resolve({
          //     success: true,
          //     paymentData: response,
          //   });
          // },
          handler: (response: RazorpayResponse) => {
            console.log('Payment successful:', response);
            
            // Track payment success at Razorpay level
            googleAnalytics.trackPaymentSuccess({
              session_id: orderData.paymentSessionId,
              payment_id: response.razorpay_payment_id,
              order_id: response.razorpay_order_id,
              amount: orderData.amount
            });
            
            resolve({
              success: true,
              paymentData: response,
            });
          },
          prefill: {
            email: userInfo.email,
            name: userInfo.name,
          },
          theme: {
            color: RAZORPAY_CONFIG.THEME.COLOR,
          },
        };

        // Add modal configuration
        const modalOptions = {
          ...options,
          // modal: {
          //   ondismiss: () => {
          //     console.log('Payment modal dismissed by user');
          //     resolve({
          //       success: false,
          //       error: 'Payment cancelled by user',
          //     });
          //   },
          modal: {
            ondismiss: () => {
              console.log('Payment modal dismissed by user');
              
              // Track payment cancellation
              googleAnalytics.trackPaymentCancelled({
                session_id: orderData.paymentSessionId,
                cancel_reason: 'user_dismissed',
                amount: orderData.amount
              });
              
              resolve({
                success: false,
                error: 'Payment cancelled by user',
              });
            },
            escape: RAZORPAY_CONFIG.MODAL.ESCAPE_CLOSE,
            backdropclose: RAZORPAY_CONFIG.MODAL.BACKDROP_CLOSE,
          },
        };

        // Create and open Razorpay instance
        const rzp = new window.Razorpay(modalOptions);

        googleAnalytics.trackPaymentModalOpened({
          session_id: orderData.paymentSessionId,
          order_id: orderData.razorpayOrderId,
          amount: orderData.amount,
          currency: orderData.currency
        });

        // // Handle payment failure
        // rzp.on('payment.failed', (response: any) => {
        //   console.error('Payment failed:', response);
        //   resolve({
        //     success: false,
        //     error: response.error?.description || 'Payment failed',
        //   });
        // });

        // Handle payment failure
        rzp.on('payment.failed', (response: any) => {
          console.error('Payment failed:', response);
          
          // Track payment failure
          googleAnalytics.trackPaymentFailed({
            session_id: orderData.paymentSessionId,
            failure_reason: response.error?.description || 'Payment failed',
            error_code: response.error?.code || 'unknown',
            amount: orderData.amount
          });
          
          resolve({
            success: false,
            error: response.error?.description || 'Payment failed',
          });
        });

        // Open the modal
        rzp.open();

      } catch (error) {
        console.error('Error opening Razorpay modal:', error);
        resolve({
          success: false,
          error: 'Failed to open payment modal',
        });
      }
    });
  }

  // Handle successful payment
  private async handlePaymentSuccess(
    orderData: CreateOrderResponse,
    paymentData: RazorpayResponse,
    userId: string
  ): Promise<void> {
    try {
      console.log('Processing successful payment...');

      // Get session data
      const sessionData = sessionManager.getSessionData();
      if (!sessionData) {
        throw new Error('Session data not found');
      }

      // Calculate timing data
      const authDuration = paymentAuthService.calculateAuthenticationDuration();
      const sessionDuration = sessionManager.getSessionDuration();

      // Prepare completion request
      const completionRequest: PaymentCompletionRequest = {
        userId,
        originalSessionId: sessionData.originalSessionId,
        testId: sessionData.testId,
        paymentSessionId: orderData.paymentSessionId,
        gateway: 'razorpay',
        orderid: paymentData.razorpay_order_id, // populate for backend schema
        transaction_id: orderData.transaction_id, // ✅ Add transaction ID from backend
        paymentData: {
          order_id: paymentData.razorpay_order_id,
          payment_id: paymentData.razorpay_payment_id,
          razorpay_signature: paymentData.razorpay_signature,
          transaction_id: orderData.transaction_id,
          amount: orderData.amount,
          currency: orderData.currency,
          status: 'success',
          payer_id: "razorpay_no_payer",
          paypal_order_id: "razorpay_no_paypal_order"
        },
        metadata: {
          pricingTier: sessionData.pricingSnapshot?.tier as 'early' | 'regular' || 'regular',
          sessionStartTime: sessionData.sessionStartTime,
          paymentStartTime: new Date().toISOString(),
          paymentCompletedTime: new Date().toISOString(),
          authenticationFlow: sessionData.authenticationRequired,
          userAgent: navigator.userAgent,
          timingData: {
            sessionToPaymentDuration: sessionDuration,
            authenticationDuration: authDuration || undefined,
          },
        },
      };

      // Send completion data to backend
      await paymentApiService.completePayment(completionRequest);

      // Track payment completed (end-to-end success)
      googleAnalytics.trackPaymentCompleted({
        session_id: sessionData.originalSessionId,
        payment_id: paymentData.razorpay_payment_id,
        verification_success: true,
        total_duration: sessionDuration
      });

      // Track Google Ads conversion only if user came from Google Ads
      const urlParams = new URLSearchParams(window.location.search);
      const gclid = urlParams.get('gclid') || sessionStorage.getItem('gclid') || localStorage.getItem('gclid');

      if (gclid) {
        googleAnalytics.trackGoogleAdsConversion({
          session_id: sessionData.originalSessionId,
          payment_id: paymentData.razorpay_payment_id,
          amount: orderData.amount / 100,
          currency: orderData.currency
        });
      }

      // Track Reddit conversion if user came from Reddit
      if (googleAnalytics.isRedditTraffic()) {
        googleAnalytics.trackRedditConversion({
          session_id: sessionData.originalSessionId,
          payment_id: paymentData.razorpay_payment_id,
          amount: orderData.amount / 100,
          currency: orderData.currency
        });
      }

      // Clean up session data
      sessionManager.clearAllData();

      console.log('Payment completion processed successfully');

    } catch (error) {
      console.error('Error processing payment success:', error);
      // Don't throw here as payment was successful from Razorpay's perspective
      // Log the error for monitoring but don't interrupt the user flow
    }
  }

  // Handle payment errors
  private handlePaymentError(error: any): PaymentResult {
    console.error('Payment error:', error);

    const errorMessage = error?.message || 'Unknown payment error';

    // Map specific errors to user-friendly messages
    let userFriendlyMessage: string;

    if (errorMessage === 'AUTHENTICATION_REQUIRED') {
      userFriendlyMessage = ERROR_MESSAGES.AUTHENTICATION_REQUIRED;
    } else if (errorMessage.includes('Network error')) {
      userFriendlyMessage = ERROR_MESSAGES.NETWORK_ERROR;
    } else if (errorMessage.includes('Razorpay script')) {
      userFriendlyMessage = ERROR_MESSAGES.RAZORPAY_LOAD_FAILED;
    } else if (errorMessage.includes('ORDER_CREATION_FAILED')) {
      userFriendlyMessage = ERROR_MESSAGES.ORDER_CREATION_FAILED;
    } else {
      userFriendlyMessage = ERROR_MESSAGES.PAYMENT_FAILED;
    }

    return {
      success: false,
      error: userFriendlyMessage,
    };
  }

  // Resume payment flow after authentication
  // async resumePaymentAfterAuth(): Promise<PaymentResult | null> {
  //   try {
  //     console.log('Attempting to resume payment after authentication...');

  //     // Check if this is a post-auth return
  //     if (!paymentAuthService.isPostAuthReturn()) {
  //       return null;
  //     }

  //     // Handle post-auth return
  //     const authResult = await paymentAuthService.handlePostAuthReturn();
      
  //     if (!authResult.canResumePayment || !authResult.context) {
  //       console.log('Cannot resume payment:', authResult.error);
  //       return null;
  //     }

  //     // Resume payment with stored context
  //     const { originalSessionId, testId } = authResult.context;
  //     return await this.initiatePayment(originalSessionId, testId);

  //   } catch (error) {
  //     console.error('Error resuming payment after auth:', error);
  //     return {
  //       success: false,
  //       error: 'Failed to resume payment after authentication',
  //     };
  //   }
  // }

  // Check if Razorpay is available
  // isRazorpayAvailable(): boolean {
  //   return this.isRazorpayLoaded && !!window.Razorpay;
  // }

  // Get payment handler status
  // getPaymentHandlerStatus(): {
  //   razorpayLoaded: boolean;
  //   razorpayAvailable: boolean;
  //   configValid: boolean;
  // } {
  //   return {
  //     razorpayLoaded: this.isRazorpayLoaded,
  //     razorpayAvailable: this.isRazorpayAvailable(),
  //     configValid: !!RAZORPAY_CONFIG.KEY_ID,
  //   };
  // }

  // Cleanup function
  // cleanup(): void {
  //   // Clear any stored data
  //   sessionManager.clearAllData();
  //   paymentAuthService.cleanupAuthFlow();
    
  //   console.log('Payment handler cleanup completed');
  // }
}

// Create and export singleton instance
export const paymentHandlerService = new PaymentHandlerService();

// Export the class for testing or custom instances
export { PaymentHandlerService };

// Utility functions for direct use
// export const initiatePayment = async (sessionId: string, testId: string): Promise<PaymentResult> => {
//   return paymentHandlerService.initiatePayment(sessionId, testId);
// };

// export const resumePaymentAfterAuth = async (): Promise<PaymentResult | null> => {
//   return paymentHandlerService.resumePaymentAfterAuth();
// };

// export const isRazorpayReady = (): boolean => {
//   return paymentHandlerService.isRazorpayAvailable();
// };

// export const getPaymentStatus = () => {
//   return paymentHandlerService.getPaymentHandlerStatus();
// };

// export const cleanupPayment = (): void => {
//   paymentHandlerService.cleanup();
// };