import { PricingTier } from '../types';
import { PRICING_CONFIG } from '../razorpay/config';

// Dynamic pricing service class
class DynamicPricingService {
  private readonly earlyBirdDurationMs: number;

  constructor() {
    this.earlyBirdDurationMs = PRICING_CONFIG.EARLY_BIRD.DURATION_MINUTES * 60 * 1000;
  }

  // Calculate current pricing based on session start time
  calculatePricing(sessionStartTime: string): PricingTier {
    const startTime = new Date(sessionStartTime);
    const currentTime = new Date();
    
    // Validate the session start time
    if (isNaN(startTime.getTime())) {
      throw new Error('Invalid session start time provided');
    }

    // Calculate elapsed time
    const elapsedMs = currentTime.getTime() - startTime.getTime();
    
    // If still within early bird period
    if (elapsedMs <= this.earlyBirdDurationMs) {
      const remainingMs = this.earlyBirdDurationMs - elapsedMs;
      const remainingMinutes = Math.ceil(remainingMs / (60 * 1000));
      
      return {
        name: 'early',
        amount: PRICING_CONFIG.EARLY_BIRD.AMOUNT,
        description: PRICING_CONFIG.EARLY_BIRD.DESCRIPTION,
        validUntil: new Date(startTime.getTime() + this.earlyBirdDurationMs),
        timeRemaining: remainingMinutes,
      };
    }
    
    // Regular pricing after early bird period
    return {
      name: 'regular',
      amount: PRICING_CONFIG.REGULAR.AMOUNT,
      description: PRICING_CONFIG.REGULAR.DESCRIPTION,
    };
  }

  // Get pricing for a specific tier (useful for backend consistency)
  getPricingForTier(tier: 'early' | 'regular'): { amount: number; description: string } {
    if (tier === 'early') {
      return {
        amount: PRICING_CONFIG.EARLY_BIRD.AMOUNT,
        description: PRICING_CONFIG.EARLY_BIRD.DESCRIPTION,
      };
    }
    
    return {
      amount: PRICING_CONFIG.REGULAR.AMOUNT,
      description: PRICING_CONFIG.REGULAR.DESCRIPTION,
    };
  }

  // Check if a session is still eligible for early bird pricing
  isEarlyBirdEligible(sessionStartTime: string): boolean {
    const startTime = new Date(sessionStartTime);
    const currentTime = new Date();
    
    if (isNaN(startTime.getTime())) {
      return false;
    }

    const elapsedMs = currentTime.getTime() - startTime.getTime();
    return elapsedMs <= this.earlyBirdDurationMs;
  }

  // Get time remaining for early bird pricing
  getEarlyBirdTimeRemaining(sessionStartTime: string): number {
    const startTime = new Date(sessionStartTime);
    const currentTime = new Date();
    
    if (isNaN(startTime.getTime())) {
      return 0;
    }

    const elapsedMs = currentTime.getTime() - startTime.getTime();
    
    if (elapsedMs >= this.earlyBirdDurationMs) {
      return 0;
    }
    
    const remainingMs = this.earlyBirdDurationMs - elapsedMs;
    return Math.ceil(remainingMs / (60 * 1000)); // Return in minutes
  }

  // Get formatted time remaining string
  getFormattedTimeRemaining(sessionStartTime: string): string {
    const remainingMinutes = this.getEarlyBirdTimeRemaining(sessionStartTime);
    
    if (remainingMinutes <= 0) {
      return 'Early bird pricing has expired';
    }
    
    if (remainingMinutes === 1) {
      return '1 minute remaining';
    }
    
    return `${remainingMinutes} minutes remaining`;
  }

  // Calculate savings compared to regular pricing
  getEarlyBirdSavings(): number {
    return PRICING_CONFIG.REGULAR.AMOUNT - PRICING_CONFIG.EARLY_BIRD.AMOUNT;
  }

  // Get formatted savings amount
  getFormattedSavings(): string {
    const savings = this.getEarlyBirdSavings();
    return `₹${(savings / 100).toFixed(0)}`;
  }

  // Get pricing summary for display
  getPricingSummary(sessionStartTime: string): {
    currentTier: PricingTier;
    isEarlyBird: boolean;
    savings?: string;
    urgencyMessage?: string;
  } {
    const currentTier = this.calculatePricing(sessionStartTime);
    const isEarlyBird = currentTier.name === 'early';
    
    const summary = {
      currentTier,
      isEarlyBird,
    } as any;

    if (isEarlyBird) {
      summary.savings = this.getFormattedSavings();
      summary.urgencyMessage = this.getFormattedTimeRemaining(sessionStartTime);
    }

    return summary;
  }

  // Validate pricing transition (useful for payment processing)
  validatePricingTransition(
    originalTier: 'early' | 'regular',
    currentSessionTime: string
  ): { isValid: boolean; currentTier: 'early' | 'regular'; message?: string } {
    const currentPricing = this.calculatePricing(currentSessionTime);
    
    // If originally early bird but now regular, that's valid transition
    if (originalTier === 'early' && currentPricing.name === 'regular') {
      return {
        isValid: true,
        currentTier: 'regular',
        message: 'Pricing has changed to regular rate due to time elapsed',
      };
    }
    
    // If originally regular, should still be regular
    if (originalTier === 'regular' && currentPricing.name === 'regular') {
      return {
        isValid: true,
        currentTier: 'regular',
      };
    }
    
    // If originally regular but calculated as early (shouldn't happen)
    if (originalTier === 'regular' && currentPricing.name === 'early') {
      return {
        isValid: false,
        currentTier: 'regular',
        message: 'Invalid pricing transition detected',
      };
    }
    
    // If originally early and still early
    if (originalTier === 'early' && currentPricing.name === 'early') {
      return {
        isValid: true,
        currentTier: 'early',
      };
    }
    
    return {
      isValid: false,
      currentTier: currentPricing.name,
      message: 'Unexpected pricing state',
    };
  }
}

// Create and export singleton instance
export const dynamicPricingService = new DynamicPricingService();

// Export the class for testing or custom instances
export { DynamicPricingService };

// Utility functions for direct use
export const getCurrentPricing = (sessionStartTime: string): PricingTier => {
  return dynamicPricingService.calculatePricing(sessionStartTime);
};

export const isEarlyBirdEligible = (sessionStartTime: string): boolean => {
  return dynamicPricingService.isEarlyBirdEligible(sessionStartTime);
};

export const getTimeRemaining = (sessionStartTime: string): number => {
  return dynamicPricingService.getEarlyBirdTimeRemaining(sessionStartTime);
};

export const getPricingSummary = (sessionStartTime: string) => {
  return dynamicPricingService.getPricingSummary(sessionStartTime);
};