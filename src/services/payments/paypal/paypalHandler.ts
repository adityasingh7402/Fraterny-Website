import { 
  PAYPAL_CONFIG, 
  PAYPAL_ERROR_MESSAGES, 
  getPayPalSDKUrl,
  getPayPalPricingForLocation 
} from './config';
import { paymentAuthService } from '../auth/paymentAuth';
import { sessionManager } from '../auth/sessionManager';
import { googleAnalytics } from '../../analytics/googleAnalytics';
import { paymentApiService } from '../api/paymentApi';
import type { PaymentResult, CreateOrderRequest, CreateOrderResponse, PaymentCompletionRequest } from '../types';

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
    payments?: {
      captures?: Array<{
        id: string;           // 🎯 PayPal's REAL transaction ID
        status: string;
        amount: {
          currency_code: string;
          value: string;
        };
        final_capture?: boolean;
        create_time?: string;
        update_time?: string;
      }>;
    };
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

  // Create PayPal order via unified API (like Razorpay)
  private async createPayPalOrderViaAPI(
    sessionId: string,
    testId: string
  ): Promise<CreateOrderResponse> {
    try {
      console.log('🔄 Creating PayPal order via unified API:', { sessionId, testId });

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

      // Step 2: Get session start time and ensure session data is stored
      const sessionStartTime = sessionManager.getOrCreateSessionStartTime();
      
      // Ensure session data is properly stored for PayPal completion
      if (!sessionManager.getSessionData()) {
        console.log('📦 Creating session data for PayPal order...');
        sessionManager.createSessionData(sessionId, testId, false);
      }

      // Step 3: Get pricing data
      const pricingData = await getPayPalPricingForLocation();
      console.log('💰 PayPal pricing data:', pricingData);

      // Step 4: Prepare order request for unified API
      // Guard: ensure email is present (backend often validates as EmailStr)
      const email = authResult.user.email;
      if (!email || email.trim().length === 0) {
        throw new Error('AUTHENTICATION_REQUIRED');
      }

      const orderRequest: CreateOrderRequest = {
        sessionId,
        testId,
        userId: authResult.user.id,
        fixEmail: email,
        pricingTier: 'regular',
        amount: Math.round(pricingData.numericAmount * 100), // cents
        currency: pricingData.currency,
        gateway: 'paypal',
        sessionStartTime,
        isIndia: false, // PayPal is international
        metadata: {
          userAgent: navigator.userAgent,
          timestamp: new Date().toISOString(),
          authenticationRequired: authResult.needsAuth || false,
          isIndia: false,
          location: 'INTL',
        },
      };

      // Step 5: Call unified create-order API
      console.log('📡 Calling unified create-order API for PayPal...');
      const orderResponse = await paymentApiService.createOrder(orderRequest);

      console.log('✅ PayPal order created via unified API:', orderResponse);
      return orderResponse;

    } catch (error) {
      console.error('❌ Error creating PayPal order via unified API:', error);
      throw error;
    }
  }

  // Initialize PayPal payment flow using unified API
  async initiatePayPalPayment(
    sessionId: string,
    testId: string
  ): Promise<PaymentResult> {
    try {
      console.log('🚀 Initiating PayPal payment via unified API:', { sessionId, testId });

      // Step 1: Create order via unified API
      const orderData = await this.createPayPalOrderViaAPI(sessionId, testId);
      console.log('📦 PayPal order data from unified API:', orderData);

      // Step 2: Ensure PayPal SDK is loaded
      await this.ensurePayPalLoaded();

      // Step 3: Get pricing data for UI display
      const pricingData = await getPayPalPricingForLocation();
      console.log('💰 PayPal pricing data:', pricingData);
      
      // Fallback pricing if location service fails
      if (!pricingData || !pricingData.displayAmount) {
        pricingData.displayAmount; // Match the backend amount
        pricingData.numericAmount;
        pricingData.currency;
      }

      // Step 4: Track payment initiation
      googleAnalytics.trackPaymentInitiated({
        session_id: sessionId,
        test_id: testId,
        user_state: 'logged_in', // Fix: use 'logged_in' instead of 'authenticated'
        payment_amount: orderData.amount,
        pricing_tier: 'regular'
      });

      // Step 5: Create PayPal payment UI with unified API order
      const paymentResult = await this.createPayPalPaymentWithOrder(sessionId, testId, orderData, pricingData);

      return paymentResult;

    } catch (error) {
      console.error('❌ PayPal payment initiation failed:', error);
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

  // Create PayPal payment using unified API order (NEW METHOD)
  private async createPayPalPaymentWithOrder(
    sessionId: string,
    testId: string,
    orderData: CreateOrderResponse,
    pricingData: any
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

        // Check if backend provided approval URL (old PayPal REST SDK flow)
        // if (orderData.approval_url) {
        //   console.log('🔄 Backend using old PayPal flow, redirecting to approval URL');
        //   // Create redirect button instead of PayPal SDK buttons
        //   const redirectButton = document.createElement('button');
        //   redirectButton.textContent = 'Pay with PayPal';
        //   redirectButton.style.cssText = 'background: #0070ba; color: white; padding: 12px 24px; border: none; border-radius: 4px; font-size: 16px; cursor: pointer; width: 100%;';
        //   redirectButton.onclick = () => {
        //     window.location.href = orderData.approval_url;
        //   };
          
        //   const buttonContainer = document.getElementById('paypal-buttons');
        //   if (buttonContainer) {
        //     buttonContainer.appendChild(redirectButton);
        //   }
        //   return;
        // }
        
        // Initialize PayPal buttons with unified API order (new SDK flow)
        const paypalButtons = window.paypal.Buttons({
          style: {
            layout: PAYPAL_CONFIG.LAYOUT,
            color: PAYPAL_CONFIG.COLOR,
            shape: PAYPAL_CONFIG.SHAPE,
            label: PAYPAL_CONFIG.LABEL,
          },
          
          // Create order dynamically (PayPal doesn't accept pre-created order IDs like Razorpay)
          createOrder: (data: any, actions: any) => {
            console.log('🎯 Creating PayPal order dynamically');
            
            googleAnalytics.trackPaymentModalOpened({
              session_id: sessionId,
              order_id: 'paypal_order_creating',
              amount: orderData.amount,
              currency: orderData.currency
            });

            // Create the order using PayPal's actions (this gets us the EC-XXX token)
            return actions.order.create({
              purchase_units: [{
                amount: {
                  currency_code: orderData.currency,
                  value: (orderData.amount / 100).toFixed(2), // Convert from cents to dollars
                },
                description: `Fraterny Assessment Report`,
              }],
              application_context: {
                brand_name: 'Fraterny',
                shipping_preference: 'NO_SHIPPING',
                user_action: 'PAY_NOW',
              },
            });
          },

          // Handle approval and complete via unified API
          onApprove: async (data: any, actions: any) => {
            console.log('✅ PayPal payment approved:', data);
            
            try {
              // Add debug information about session state before processing
              console.log('🔍 Debug info before PayPal completion:', {
                sessionId,
                testId,
                hasSessionData: !!sessionManager.getSessionData(),
                sessionStartTime: sessionManager.getOrCreateSessionStartTime(),
                paypalData: data
              });
              
              // Step 1: Capture the payment (PayPal side)
              const orderDetails: PayPalOrderData = await actions.order.capture();
              console.log('✅ PayPal payment captured:', orderDetails);

              // Step 2: Complete payment via unified API with PayPal approval data
              // Note: data contains payerID, orderID from PayPal approval
              // log every data before calling completePayPalPaymentViaAPI
              console.log('🔍 PayPal approval data:', data);
              console.log('🔍 Order details:', orderDetails);
              console.log('🔍 Order data from unified API:', orderData);
              await this.completePayPalPaymentViaAPI(orderData, orderDetails, sessionId, testId, data);

              // Track successful payment
              googleAnalytics.trackPaymentSuccess({
                session_id: sessionId,
                payment_id: orderDetails.id,
                order_id: orderDetails.id,
                amount: orderData.amount
              });

              this.cleanup();
              
              resolve({
                success: true,
                paymentData: {
                  paypal_order_id: orderDetails.id,
                  amount: pricingData.numericAmount,
                  currency: pricingData.currency,
                  status: orderDetails.status,
                  payer_email: orderDetails.payer?.email_address,
                },
              });

            } catch (captureError) {
              console.error('❌ PayPal capture/completion error:', captureError);
              console.error('🔍 Error details:', {
                errorMessage: captureError instanceof Error ? captureError.message : 'Unknown error',
                sessionId,
                testId,
                hasSessionData: !!sessionManager.getSessionData(),
                sessionState: sessionManager.getPaymentFlowState()
              });
              
              googleAnalytics.trackPaymentFailed({
                session_id: sessionId,
                failure_reason: 'PayPal capture/completion failed',
                error_code: 'PAYPAL_CAPTURE_ERROR',
                amount: orderData.amount
              });

              this.cleanup();
              
              resolve({
                success: false,
                error: captureError instanceof Error && captureError.message.includes('Session data not found') 
                  ? 'Failed to complete PayPal payment. Please contact support.' 
                  : PAYPAL_ERROR_MESSAGES.CAPTURE_FAILED,
              });
            }
          },

          // Handle errors
          onError: (err: any) => {
            console.error('❌ PayPal payment error:', err);
            
            googleAnalytics.trackPaymentFailed({
              session_id: sessionId,
              failure_reason: 'PayPal payment error',
              error_code: err.code || 'PAYPAL_ERROR',
              amount: orderData.amount
            });

            this.cleanup();
            
            resolve({
              success: false,
              error: PAYPAL_ERROR_MESSAGES.PAYMENT_FAILED,
            });
          },

          // Handle cancellation
          onCancel: (data: any) => {
            console.log('⚠️ PayPal payment cancelled:', data);
            
            googleAnalytics.trackPaymentCancelled({
              session_id: sessionId,
              cancel_reason: 'user_cancelled_paypal',
              amount: orderData.amount
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

  // OLD METHOD - Create PayPal payment and handle the flow
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

  // Complete PayPal payment via unified API (NEW METHOD)
  private async completePayPalPaymentViaAPI(
    orderResponse: CreateOrderResponse,
    paypalOrderData: PayPalOrderData,
    sessionId: string,
    testId: string,
    paypalApprovalData?: any // PayPal approval data containing payerID
  ): Promise<void> {
    try {
      console.log('📡 Completing PayPal payment via unified API...');

      // Get session data with fallback mechanism
      let sessionData = sessionManager.getSessionData();
      if (!sessionData) {
        console.warn('⚠️ No session data found, creating fallback session data');
        // Create fallback session data for PayPal completion
        sessionData = {
          sessionStartTime: sessionManager.getOrCreateSessionStartTime(),
          originalSessionId: sessionId,
          testId: testId,
          authenticationRequired: false, // User is already authenticated if we got here
        };
        // Store the fallback session data
        sessionManager.createSessionData(sessionId, testId, false);
      }

      // Calculate timing data
      const authDuration = paymentAuthService.calculateAuthenticationDuration();
      const sessionDuration = sessionManager.getSessionDuration();

      // Get current user info if available
      let userId = sessionData.originalSessionId;
      try {
        const currentUser = await paymentAuthService.getCurrentUser();
        if (currentUser?.id) {
          userId = currentUser.id;
        }
      } catch (error) {
        console.warn('⚠️ Could not get current user, using session ID as fallback');
      }

      // log both orderResponse and paypalOrderData for debugging
      console.log('🔍 Order response from unified API:', orderResponse);
      console.log('🔍 PayPal order data:', paypalOrderData);
      
      // 🎯 CAPTURE PayPal's REAL TRANSACTION ID from the capture response
      const paypalTransactionId = paypalOrderData.purchase_units?.[0]?.payments?.captures?.[0]?.id;
      console.log('🎯 PayPal Transaction ID captured:', paypalTransactionId);
      
      // Use PayPal's transaction ID as the main transaction_id (instead of backend generated)
      const finalTransactionId = paypalTransactionId || orderResponse.transaction_id;
      console.log('✅ Using Transaction ID:', finalTransactionId);

      // Prepare completion data for unified API
      const completionData: PaymentCompletionRequest = {
        userId: userId, // Use current user ID or fallback to session ID
        originalSessionId: sessionId, // Use passed sessionId
        testId: testId, // Use passed testId
        paymentSessionId: orderResponse.paymentSessionId,
        gateway: 'paypal', // 🎯 Specify PayPal gateway
        orderid: paypalOrderData.id, // PayPal order ID for backend capture
        transaction_id: finalTransactionId, // 🎯 Use PayPal's REAL transaction ID
        paymentData: {
          // Map PayPal data to match backend expectations and new validation
          order_id: paypalOrderData.id, // PayPal order ID
          payment_id: paypalOrderData.id, // PayPal order ID  
          paypal_order_id: orderResponse.paypalOrderId, // For backend compatibility
          razorpay_signature: "paypal_no_signature", // Placeholder for signature field
          transaction_id: finalTransactionId, // 🎯 Use PayPal's REAL transaction ID
          amount: orderResponse.amount,
          currency: orderResponse.currency,
          status: 'success',
          payer_id: paypalApprovalData?.payerID || paypalApprovalData?.PayerID || 'unknown'
        },
        metadata: {
          pricingTier: 'regular',
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

      // Send completion data to unified API
      console.log('📡 Sending PayPal completion to unified API:', completionData);
      
      await paymentApiService.completePayment(completionData);
      console.log('✅ PayPal payment completion sent to unified API successfully');

      // Track completion analytics
      googleAnalytics.trackPaymentCompleted({
        session_id: sessionId, // Use passed sessionId
        payment_id: paypalOrderData.id,
        verification_success: true,
        total_duration: sessionDuration
      });

      // Track conversions if applicable
      const urlParams = new URLSearchParams(window.location.search);
      const gclid = urlParams.get('gclid') || sessionStorage.getItem('gclid') || localStorage.getItem('gclid');

      if (gclid) {
        googleAnalytics.trackGoogleAdsConversion({
          session_id: sessionId, // Use passed sessionId
          payment_id: paypalOrderData.id,
          amount: orderResponse.amount / 100, // Convert from cents
          currency: orderResponse.currency
        });
      }

      if (googleAnalytics.isRedditTraffic()) {
        googleAnalytics.trackRedditConversion({
          session_id: sessionId, // Use passed sessionId
          payment_id: paypalOrderData.id,
          amount: orderResponse.amount / 100, // Convert from cents
          currency: orderResponse.currency
        });
      }

      

      console.log('🎉 PayPal payment completion processed successfully via unified API');

    } catch (error) {
      console.error('❌ Error completing PayPal payment via unified API:', error);
      throw error; // Re-throw to handle in caller
    }
  }

  // OLD METHOD - Handle successful PayPal payment
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

      // Prepare completion data for backend (matching backend PaymentCompletionRequest)
      const completionData: PaymentCompletionRequest = {
        userId,
        originalSessionId: sessionData.originalSessionId,
        testId: sessionData.testId,
        paymentSessionId: sessionId,
        gateway: 'paypal', // ✅ Required by backend
        orderid: orderData.id, // ✅ Required by backend for PayPal
        // Note: transactionId not available in this old method
        paymentData: {
          order_id: orderData.id, // ✅ Backend expects this field name
          payment_id: orderData.id, // ✅ Use PayPal order ID
          paypal_order_id: orderData.id, // For backend compatibility
          razorpay_signature: "paypal_no_signature",
          amount: pricingData.numericAmount * 100,
          currency: pricingData.currency,
          status: 'success', // ✅ Backend expects 'success' not 'completed'
        },
        metadata: {
          pricingTier: 'regular',
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

      // Send completion data to unified backend API
      console.log('PayPal payment completion data:', completionData);
      
      // ✅ FIXED: Actually send to backend
      try {
        await paymentApiService.completePayment(completionData);
        console.log('✅ PayPal payment completion sent to backend successfully');
      } catch (backendError) {
        console.error('❌ Failed to send PayPal completion to backend:', backendError);
        // Don't throw here as payment was successful from PayPal's perspective
      }

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

      // Track Meta Pixel conversion if user came from Meta (Facebook/Instagram)
      if (googleAnalytics.isMetaTraffic()) {
        googleAnalytics.trackMetaPixelPurchase({
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
  console.log('🚀 Initiating PayPal payment:', { sessionId, testId });
  return paypalHandlerService.initiatePayPalPayment(sessionId, testId);
};

export const isPayPalReady = (): boolean => {
  return paypalHandlerService.isPayPalAvailable();
};
