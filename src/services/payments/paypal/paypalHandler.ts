import { 
  PAYPAL_CONFIG, 
  PAYPAL_ERROR_MESSAGES, 
  getPayPalSDKUrl,
  getPayPalPricingForLocation 
} from './config';
import { paymentAuthService } from '../auth/paymentAuth';
import { sessionManager } from '../auth/sessionManager';
import { googleAnalytics } from '../../analytics/googleAnalytics';
import type { PaymentResult } from '../types';

// PayPal SDK types
declare global {
  interface Window {
    paypal?: {
      Buttons: (options: any) => {
        render: (selector: string) => Promise<void>;
      };
      FUNDING: {
        PAYPAL: string;
        CARD: string;
        CREDIT: string;
      };
    };
  }
}

// PayPal order data interface
interface PayPalOrderData {
  id: string;
  status: string;
  purchase_units: Array<{
    amount: {
      currency_code: string;
      value: string;
    };
    description: string;
  }>;
  payer?: {
    email_address?: string;
    name?: {
      given_name?: string;
      surname?: string;
    };
  };
}

// PayPal capture response interface
interface PayPalCaptureData {
  id: string;
  status: string;
  purchase_units: Array<{
    payments: {
      captures: Array<{
        id: string;
        status: string;
        amount: {
          currency_code: string;
          value: string;
        };
      }>;
    };
  }>;
}

class PayPalHandlerService {
  private isPayPalLoaded: boolean = false;
  private isInitializing: boolean = false;

  // Initialize PayPal payment flow
  async initiatePayPalPayment(
    sessionId: string,
    testId: string
  ): Promise<PaymentResult> {
    try {
      console.log('Initiating PayPal payment flow:', { sessionId, testId });

      // Step 1: Ensure PayPal SDK is loaded
      await this.ensurePayPalLoaded();

      // Step 2: Check authentication
      const user = await paymentAuthService.getCurrentUser();
      if (!user) {
        throw new Error('User authentication required for PayPal payment');
      }

      // Step 3: Get pricing based on location
      const pricingData = await getPayPalPricingForLocation();
      console.log('PayPal pricing data:', pricingData);

      // Step 4: Create PayPal payment (returns promise that resolves when payment completes)
      const paymentResult = await this.createPayPalPayment(sessionId, testId, pricingData, user);

      return paymentResult;

    } catch (error) {
      console.error('PayPal payment initiation failed:', error);
      return this.handlePayPalError(error);
    }
  }

  // Ensure PayPal SDK is loaded
  private async ensurePayPalLoaded(): Promise<void> {
    if (this.isPayPalLoaded && window.paypal) {
      return;
    }

    if (this.isInitializing) {
      // Wait for initialization to complete
      while (this.isInitializing) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      if (this.isPayPalLoaded && window.paypal) {
        return;
      }
    }

    this.isInitializing = true;

    try {
      return new Promise(async (resolve, reject) => {
        // Check if already loaded
        if (window.paypal) {
          this.isPayPalLoaded = true;
          this.isInitializing = false;
          resolve();
          return;
        }

        // Remove existing PayPal script if any
        const existingScript = document.querySelector('script[src*="paypal.com/sdk/js"]');
        if (existingScript) {
          existingScript.remove();
        }

        // Create script element with location-based currency
        const script = document.createElement('script');
        script.src = await getPayPalSDKUrl(); // Now async to get location-based currency
        script.async = true;

        script.onload = () => {
          if (window.paypal) {
            this.isPayPalLoaded = true;
            console.log('PayPal SDK loaded successfully');
            this.isInitializing = false;
            resolve();
          } else {
            this.isInitializing = false;
            reject(new Error('PayPal object not available after script load'));
          }
        };

        script.onerror = () => {
          this.isInitializing = false;
          reject(new Error('Failed to load PayPal SDK script'));
        };

        // Add to document
        document.head.appendChild(script);

        // Timeout after 15 seconds
        setTimeout(() => {
          if (!this.isPayPalLoaded) {
            this.isInitializing = false;
            reject(new Error('PayPal SDK load timeout'));
          }
        }, 15000);
      });
    } catch (error) {
      this.isInitializing = false;
      throw error;
    }
  }

  // Create PayPal payment and handle the flow
  private async createPayPalPayment(
    sessionId: string,
    testId: string,
    pricingData: any,
    user: any
  ): Promise<PaymentResult> {
    return new Promise((resolve) => {
      try {
        if (!window.paypal) {
          throw new Error('PayPal SDK not loaded');
        }

        // Create a container for PayPal buttons
        const containerId = 'paypal-button-container';
        let container = document.getElementById(containerId);
        
        if (!container) {
          container = document.createElement('div');
          container.id = containerId;
          container.style.cssText = 'position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); z-index: 10000; background: white; padding: 20px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); min-width: 300px;';
          document.body.appendChild(container);

          // Add close button
          const closeButton = document.createElement('button');
          closeButton.innerHTML = '×';
          closeButton.style.cssText = 'position: absolute; top: 10px; right: 10px; background: none; border: none; font-size: 20px; cursor: pointer; color: #666;';
          closeButton.onclick = () => {
            this.cleanup();
            resolve({
              success: false,
              error: PAYPAL_ERROR_MESSAGES.PAYMENT_CANCELLED,
            });
          };
          container.appendChild(closeButton);

          // Add title
          const title = document.createElement('h3');
          title.textContent = 'Complete payment with PayPal';
          title.style.cssText = 'margin: 0 0 15px 0; font-family: Arial, sans-serif; color: #333;';
          container.appendChild(title);

          // Add amount display
          const amountDisplay = document.createElement('div');
          amountDisplay.textContent = `Amount: ${pricingData.displayAmount}`;
          amountDisplay.style.cssText = 'margin-bottom: 15px; font-size: 16px; font-weight: bold; color: #333;';
          container.appendChild(amountDisplay);

          // PayPal button container
          const buttonContainer = document.createElement('div');
          buttonContainer.id = 'paypal-buttons';
          container.appendChild(buttonContainer);
        }

        // Initialize PayPal buttons
        const paypalButtons = window.paypal.Buttons({
          style: {
            layout: PAYPAL_CONFIG.LAYOUT,
            color: PAYPAL_CONFIG.COLOR,
            shape: PAYPAL_CONFIG.SHAPE,
            label: PAYPAL_CONFIG.LABEL,
          },
          
          // Create order
          createOrder: (data: any, actions: any) => {
            console.log('Creating PayPal order...');
            
            googleAnalytics.trackPaymentModalOpened({
              session_id: sessionId,
              order_id: 'paypal_order_pending',
              amount: pricingData.numericAmount * 100, // Convert to cents for analytics
              currency: pricingData.currency
            });

            return actions.order.create({
              purchase_units: [{
                amount: {
                  currency_code: pricingData.currency,
                  value: pricingData.amount,
                },
                description: `${PAYPAL_CONFIG.BRAND_NAME} - Assessment Report`,
                soft_descriptor: PAYPAL_CONFIG.COMPANY_NAME,
              }],
              application_context: {
                brand_name: PAYPAL_CONFIG.BRAND_NAME,
                shipping_preference: 'NO_SHIPPING',
                user_action: 'PAY_NOW',
              },
            });
          },

          // Handle approval
          onApprove: async (data: any, actions: any) => {
            console.log('PayPal payment approved:', data);
            
            try {
              // Capture the payment
              const orderData: PayPalOrderData = await actions.order.capture();
              console.log('PayPal payment captured:', orderData);

              // Track successful payment
              googleAnalytics.trackPaymentSuccess({
                session_id: sessionId,
                payment_id: orderData.id,
                order_id: orderData.id,
                amount: pricingData.numericAmount * 100
              });

              // Process successful payment
              await this.handlePayPalSuccess(orderData, sessionId, testId, pricingData, user.id);

              this.cleanup();
              
              resolve({
                success: true,
                paymentData: {
                  paypal_order_id: orderData.id,
                  amount: pricingData.numericAmount,
                  currency: pricingData.currency,
                  status: orderData.status,
                  payer_email: orderData.payer?.email_address,
                },
              });

            } catch (captureError) {
              console.error('PayPal capture error:', captureError);
              
              googleAnalytics.trackPaymentFailed({
                session_id: sessionId,
                failure_reason: 'PayPal capture failed',
                error_code: 'PAYPAL_CAPTURE_ERROR',
                amount: pricingData.numericAmount * 100
              });

              this.cleanup();
              
              resolve({
                success: false,
                error: PAYPAL_ERROR_MESSAGES.CAPTURE_FAILED,
              });
            }
          },

          // Handle errors
          onError: (err: any) => {
            console.error('PayPal payment error:', err);
            
            googleAnalytics.trackPaymentFailed({
              session_id: sessionId,
              failure_reason: 'PayPal payment error',
              error_code: err.code || 'PAYPAL_ERROR',
              amount: pricingData.numericAmount * 100
            });

            this.cleanup();
            
            resolve({
              success: false,
              error: PAYPAL_ERROR_MESSAGES.PAYMENT_FAILED,
            });
          },

          // Handle cancellation
          onCancel: (data: any) => {
            console.log('PayPal payment cancelled:', data);
            
            googleAnalytics.trackPaymentCancelled({
              session_id: sessionId,
              cancel_reason: 'user_cancelled_paypal',
              amount: pricingData.numericAmount * 100
            });

            this.cleanup();
            
            resolve({
              success: false,
              error: PAYPAL_ERROR_MESSAGES.PAYMENT_CANCELLED,
            });
          },
        });

        // Render PayPal buttons
        paypalButtons.render('#paypal-buttons').catch((renderError: any) => {
          console.error('Error rendering PayPal buttons:', renderError);
          this.cleanup();
          resolve({
            success: false,
            error: PAYPAL_ERROR_MESSAGES.SCRIPT_LOAD_FAILED,
          });
        });

      } catch (error) {
        console.error('Error creating PayPal payment:', error);
        this.cleanup();
        resolve({
          success: false,
          error: PAYPAL_ERROR_MESSAGES.ORDER_CREATION_FAILED,
        });
      }
    });
  }

  // Handle successful PayPal payment
  private async handlePayPalSuccess(
    orderData: PayPalOrderData,
    sessionId: string,
    testId: string,
    pricingData: any,
    userId: string
  ): Promise<void> {
    try {
      console.log('Processing successful PayPal payment...');

      // Get session data
      const sessionData = sessionManager.getSessionData();
      if (!sessionData) {
        throw new Error('Session data not found');
      }

      // Calculate timing data
      const authDuration = paymentAuthService.calculateAuthenticationDuration();
      const sessionDuration = sessionManager.getSessionDuration();

      // Prepare completion data for backend (similar to Razorpay)
      const completionData = {
        userId,
        originalSessionId: sessionData.originalSessionId,
        testId: sessionData.testId,
        paymentSessionId: sessionId, // Use current session ID
        paymentData: {
          paypal_order_id: orderData.id,
          amount: pricingData.numericAmount * 100, // Convert to cents
          currency: pricingData.currency,
          status: 'completed',
          gateway: 'paypal',
          payer_email: orderData.payer?.email_address,
        },
        metadata: {
          pricingTier: 'regular',
          sessionStartTime: sessionData.sessionStartTime,
          paymentStartTime: new Date().toISOString(),
          paymentCompletedTime: new Date().toISOString(),
          authenticationFlow: sessionData.authenticationRequired,
          userAgent: navigator.userAgent,
          paymentGateway: 'paypal',
          timingData: {
            sessionToPaymentDuration: sessionDuration,
            authenticationDuration: authDuration || undefined,
          },
        },
      };

      // For now, we'll log this data. In a real implementation, 
      // you'd send this to your backend API
      console.log('PayPal payment completion data:', completionData);
      
      // TODO: Send to backend
      // await paymentApiService.completePayment(completionData);

      // Track completion
      googleAnalytics.trackPaymentCompleted({
        session_id: sessionData.originalSessionId,
        payment_id: orderData.id,
        verification_success: true,
        total_duration: sessionDuration
      });

      // Track conversions if applicable
      const urlParams = new URLSearchParams(window.location.search);
      const gclid = urlParams.get('gclid') || sessionStorage.getItem('gclid') || localStorage.getItem('gclid');

      if (gclid) {
        googleAnalytics.trackGoogleAdsConversion({
          session_id: sessionData.originalSessionId,
          payment_id: orderData.id,
          amount: pricingData.numericAmount,
          currency: pricingData.currency
        });
      }

      if (googleAnalytics.isRedditTraffic()) {
        googleAnalytics.trackRedditConversion({
          session_id: sessionData.originalSessionId,
          payment_id: orderData.id,
          amount: pricingData.numericAmount,
          currency: pricingData.currency
        });
      }

      console.log('PayPal payment completion processed successfully');

    } catch (error) {
      console.error('Error processing PayPal payment success:', error);
      // Don't throw here as payment was successful from PayPal's perspective
    }
  }

  // Handle PayPal errors
  private handlePayPalError(error: any): PaymentResult {
    console.error('PayPal error:', error);

    const errorMessage = error?.message || 'Unknown PayPal error';

    let userFriendlyMessage: string;

    if (errorMessage.includes('authentication') || errorMessage.includes('Authentication')) {
      userFriendlyMessage = 'Please sign in to continue with PayPal payment.';
    } else if (errorMessage.includes('network') || errorMessage.includes('Network')) {
      userFriendlyMessage = PAYPAL_ERROR_MESSAGES.NETWORK_ERROR;
    } else if (errorMessage.includes('script') || errorMessage.includes('SDK')) {
      userFriendlyMessage = PAYPAL_ERROR_MESSAGES.SCRIPT_LOAD_FAILED;
    } else if (errorMessage.includes('timeout')) {
      userFriendlyMessage = 'PayPal loading timed out. Please try again.';
    } else {
      userFriendlyMessage = PAYPAL_ERROR_MESSAGES.PAYMENT_FAILED;
    }

    return {
      success: false,
      error: userFriendlyMessage,
    };
  }

  // Clean up PayPal UI elements
  private cleanup(): void {
    const container = document.getElementById('paypal-button-container');
    if (container) {
      container.remove();
    }
  }

  // Check if PayPal is available
  isPayPalAvailable(): boolean {
    return this.isPayPalLoaded && !!window.paypal;
  }
}

// Create and export singleton instance
export const paypalHandlerService = new PayPalHandlerService();

// Export the class for testing or custom instances
export { PayPalHandlerService };

// Utility functions
export const initiatePayPalPayment = async (sessionId: string, testId: string): Promise<PaymentResult> => {
  return paypalHandlerService.initiatePayPalPayment(sessionId, testId);
};

export const isPayPalReady = (): boolean => {
  return paypalHandlerService.isPayPalAvailable();
};