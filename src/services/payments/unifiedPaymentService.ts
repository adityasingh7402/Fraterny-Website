import { PaymentService as RazorpayPaymentService } from './index';
import { paypalHandlerService } from './paypal/paypalHandler';
import { getPayPalPricingForLocation } from './paypal/config';
import { getUserLocationFlag, getPriceForLocation } from './razorpay/config';
import type { PaymentResult } from './types';

// Payment gateway options
export type PaymentGateway = 'razorpay' | 'paypal';

// Unified pricing data interface
export interface UnifiedPricingData {
  razorpay: {
    main: string;
    original: string;
    currency: string;
    symbol: string;
    amount: number;
    isIndia: boolean;
  };
  paypal: {
    displayAmount: string;
    displayOriginal: string;
    currency: string;
    amount: string;
    numericAmount: number;
    isIndia: boolean;
  };
}

// Unified payment service class
class UnifiedPaymentService {
  
  // Get pricing for both gateways
  async getBothGatewayPricing(): Promise<UnifiedPricingData> {
    try {
      console.log('🔄 Loading pricing for both payment gateways...');
      
      // Get pricing for both gateways in parallel
      const [razorpayPricing, paypalPricing] = await Promise.all([
        getPriceForLocation(),
        getPayPalPricingForLocation()
      ]);

      console.log('💰 Razorpay pricing:', razorpayPricing);
      console.log('💰 PayPal pricing:', paypalPricing);

      return {
        razorpay: razorpayPricing,
        paypal: paypalPricing
      };

    } catch (error) {
      console.error('❌ Error loading gateway pricing:', error);
      
      // Fallback pricing
      return {
        razorpay: {
          main: '₹950',
          original: '₹1200',
          currency: 'INR',
          symbol: '₹',
          amount: 950,
          isIndia: true
        },
        paypal: {
          displayAmount: '$20',
          displayOriginal: '$25',
          currency: 'USD',
          amount: '20.00',
          numericAmount: 20,
          isIndia: false
        }
      };
    }
  }

  // Process payment based on selected gateway
  async processPayment(
    gateway: PaymentGateway,
    sessionId: string,
    testId: string
  ): Promise<PaymentResult> {
    try {
      console.log(`🚀 Processing payment via ${gateway}:`, { sessionId, testId });

      switch (gateway) {
        case 'razorpay':
          console.log('📱 Starting Razorpay payment...');
          return await RazorpayPaymentService.startPayment(sessionId, testId);
          
        case 'paypal':
          console.log('🌐 Starting PayPal payment...');
          return await paypalHandlerService.initiatePayPalPayment(sessionId, testId);
          
        default:
          throw new Error(`Unsupported payment gateway: ${gateway}`);
      }

    } catch (error) {
      console.error(`❌ Payment failed for ${gateway}:`, error);
      
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Payment processing failed'
      };
    }
  }

  // Check gateway availability
  async checkGatewayAvailability(): Promise<{
    razorpay: { available: boolean; reason?: string };
    paypal: { available: boolean; reason?: string };
  }> {
    try {
      const isIndia = await getUserLocationFlag();
      
      // Razorpay is available in India and internationally
      const razorpayAvailable = {
        available: true,
        reason: undefined
      };

      // PayPal is available internationally but also works in India
      const paypalAvailable = {
        available: true,
        reason: undefined
      };

      console.log('🔍 Gateway availability check:', {
        isIndia,
        razorpay: razorpayAvailable,
        paypal: paypalAvailable
      });

      return {
        razorpay: razorpayAvailable,
        paypal: paypalAvailable
      };

    } catch (error) {
      console.error('❌ Error checking gateway availability:', error);
      
      // Default to both available on error
      return {
        razorpay: { available: true },
        paypal: { available: true }
      };
    }
  }

  // Get recommended gateway based on location
  async getRecommendedGateway(): Promise<{
    primary: PaymentGateway;
    secondary: PaymentGateway;
    reason: string;
  }> {
    try {
      const isIndia = await getUserLocationFlag();
      
      if (isIndia) {
        return {
          primary: 'razorpay',
          secondary: 'paypal',
          reason: 'Razorpay is optimized for Indian users with support for UPI, cards, and net banking'
        };
      } else {
        return {
          primary: 'paypal',
          secondary: 'razorpay',
          reason: 'PayPal is widely accepted internationally with local currency support'
        };
      }
      
    } catch (error) {
      console.error('❌ Error determining recommended gateway:', error);
      
      // Default recommendation
      return {
        primary: 'razorpay',
        secondary: 'paypal',
        reason: 'Razorpay supports multiple payment methods'
      };
    }
  }

  // Get gateway display information
  getGatewayDisplayInfo(gateway: PaymentGateway): {
    name: string;
    description: string;
    icon: string;
    supportedMethods: string[];
  } {
    switch (gateway) {
      case 'razorpay':
        return {
          name: 'Razorpay',
          description: 'Cards, UPI, Net Banking, Wallets',
          icon: '💳',
          supportedMethods: ['Credit Card', 'Debit Card', 'UPI', 'Net Banking', 'Wallets']
        };
        
      case 'paypal':
        return {
          name: 'PayPal',
          description: 'PayPal Balance, Cards via PayPal',
          icon: '🌐',
          supportedMethods: ['PayPal Balance', 'Credit Card', 'Debit Card', 'Bank Account']
        };
        
      default:
        return {
          name: 'Unknown',
          description: 'Payment gateway',
          icon: '💰',
          supportedMethods: []
        };
    }
  }

  // Validate payment parameters
  validatePaymentParameters(
    gateway: PaymentGateway,
    sessionId: string,
    testId: string
  ): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Basic validation
    if (!sessionId || sessionId.trim().length === 0) {
      errors.push('Session ID is required');
    }

    if (!testId || testId.trim().length === 0) {
      errors.push('Test ID is required');
    }

    if (!gateway || !['razorpay', 'paypal'].includes(gateway)) {
      errors.push('Valid payment gateway must be specified');
    }

    // Gateway-specific validation
    if (gateway === 'razorpay') {
      // Add Razorpay specific validation if needed
    } else if (gateway === 'paypal') {
      // Add PayPal specific validation if needed
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Get payment summary for display
  async getPaymentSummary(gateway: PaymentGateway): Promise<{
    gateway: PaymentGateway;
    gatewayInfo: {
      name: string;
      description: string;
      icon: string;
      supportedMethods: string[];
    };
    pricing: UnifiedPricingData[PaymentGateway];
    features: string[];
  }> {
    const pricingData = await this.getBothGatewayPricing();
    const gatewayInfo = this.getGatewayDisplayInfo(gateway);
    
    const features = gateway === 'razorpay' 
      ? ['Instant refunds', 'Multiple payment options', 'Indian bank support', 'UPI payments']
      : ['Global acceptance', 'Buyer protection', 'No card details stored', 'PayPal balance'];

    return {
      gateway,
      gatewayInfo,
      pricing: pricingData[gateway],
      features
    };
  }
}

// Create and export singleton instance
export const unifiedPaymentService = new UnifiedPaymentService();

// Export the class
export { UnifiedPaymentService };

// Convenience functions
export const processPaymentWithGateway = async (
  gateway: PaymentGateway,
  sessionId: string,
  testId: string
): Promise<PaymentResult> => {
  return unifiedPaymentService.processPayment(gateway, sessionId, testId);
};

export const getBothGatewayPricing = async (): Promise<UnifiedPricingData> => {
  return unifiedPaymentService.getBothGatewayPricing();
};

export const getRecommendedGateway = async () => {
  return unifiedPaymentService.getRecommendedGateway();
};

export const checkGatewayAvailability = async () => {
  return unifiedPaymentService.checkGatewayAvailability();
};