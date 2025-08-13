import { PricingTier } from '../types';
import { PRICING_CONFIG } from '../razorpay/config';

// Currency formatting utilities
export const formatCurrency = (amountInPaise: number, showDecimals: boolean = false): string => {
  const rupees = amountInPaise / 100;
  
  if (showDecimals) {
    return `₹${rupees.toFixed(2)}`;
  }
  
  return `₹${Math.round(rupees).toLocaleString('en-IN')}`;
};

// Convert rupees to paise
export const rupeesToPaise = (rupees: number): number => {
  return Math.round(rupees * 100);
};

// Convert paise to rupees
export const paiseToRupees = (paise: number): number => {
  return paise / 100;
};

// Calculate discount percentage
export const calculateDiscountPercentage = (originalPrice: number, discountedPrice: number): number => {
  if (originalPrice <= 0) return 0;
  
  const discount = originalPrice - discountedPrice;
  return Math.round((discount / originalPrice) * 100);
};

// Get early bird discount percentage
export const getEarlyBirdDiscountPercentage = (): number => {
  return calculateDiscountPercentage(
    PRICING_CONFIG.REGULAR.AMOUNT,
    PRICING_CONFIG.EARLY_BIRD.AMOUNT
  );
};

// Format discount percentage for display
export const formatDiscountPercentage = (): string => {
  const percentage = getEarlyBirdDiscountPercentage();
  return `${percentage}% OFF`;
};

// Calculate savings amount
export const calculateSavings = (originalPrice: number, discountedPrice: number): number => {
  return Math.max(0, originalPrice - discountedPrice);
};

// Get early bird savings in paise
export const getEarlyBirdSavingsInPaise = (): number => {
  return calculateSavings(
    PRICING_CONFIG.REGULAR.AMOUNT,
    PRICING_CONFIG.EARLY_BIRD.AMOUNT
  );
};

// Format savings for display
export const formatSavings = (savingsInPaise: number): string => {
  return `Save ${formatCurrency(savingsInPaise)}`;
};

// Get pricing display information
export const getPricingDisplayInfo = (tier: PricingTier) => {
  const isEarlyBird = tier.name === 'early';
  
  const displayInfo = {
    amount: formatCurrency(tier.amount),
    description: tier.description,
    isEarlyBird,
    originalAmount: null as string | null,
    savings: null as string | null,
    discountPercentage: null as string | null,
  };

  if (isEarlyBird) {
    displayInfo.originalAmount = formatCurrency(PRICING_CONFIG.REGULAR.AMOUNT);
    displayInfo.savings = formatSavings(getEarlyBirdSavingsInPaise());
    displayInfo.discountPercentage = formatDiscountPercentage();
  }

  return displayInfo;
};

// Time formatting utilities
export const formatTimeRemaining = (minutes: number): string => {
  if (minutes <= 0) {
    return 'Expired';
  }

  if (minutes < 60) {
    return `${minutes}m`;
  }

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (remainingMinutes === 0) {
    return `${hours}h`;
  }

  return `${hours}h ${remainingMinutes}m`;
};

// Detailed time formatting
export const formatDetailedTimeRemaining = (minutes: number): string => {
  if (minutes <= 0) {
    return 'Early bird pricing has expired';
  }

  if (minutes === 1) {
    return '1 minute remaining for early bird pricing';
  }

  if (minutes < 60) {
    return `${minutes} minutes remaining for early bird pricing`;
  }

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (remainingMinutes === 0) {
    const hourText = hours === 1 ? 'hour' : 'hours';
    return `${hours} ${hourText} remaining for early bird pricing`;
  }

  const hourText = hours === 1 ? 'hour' : 'hours';
  const minuteText = remainingMinutes === 1 ? 'minute' : 'minutes';
  return `${hours} ${hourText} and ${remainingMinutes} ${minuteText} remaining for early bird pricing`;
};

// Urgency level based on time remaining
export const getUrgencyLevel = (minutes: number): 'low' | 'medium' | 'high' | 'expired' => {
  if (minutes <= 0) return 'expired';
  if (minutes <= 5) return 'high';
  if (minutes <= 15) return 'medium';
  return 'low';
};

// Get urgency message
export const getUrgencyMessage = (minutes: number): string => {
  const urgency = getUrgencyLevel(minutes);
  
  switch (urgency) {
    case 'expired':
      return 'Early bird pricing has expired';
    case 'high':
      return '⚡ Hurry! Only a few minutes left';
    case 'medium':
      return '⏰ Limited time remaining';
    case 'low':
      return '🎯 Early bird pricing available';
    default:
      return '';
  }
};

// CSS class for urgency styling
export const getUrgencyClass = (minutes: number): string => {
  const urgency = getUrgencyLevel(minutes);
  
  switch (urgency) {
    case 'expired':
      return 'text-gray-500';
    case 'high':
      return 'text-red-600 animate-pulse';
    case 'medium':
      return 'text-orange-600';
    case 'low':
      return 'text-green-600';
    default:
      return 'text-gray-600';
  }
};

// Pricing comparison data
export const getPricingComparison = () => {
  const earlyBirdAmount = PRICING_CONFIG.EARLY_BIRD.AMOUNT;
  const regularAmount = PRICING_CONFIG.REGULAR.AMOUNT;
  const savings = getEarlyBirdSavingsInPaise();
  const discountPercentage = getEarlyBirdDiscountPercentage();

  return {
    earlyBird: {
      amount: earlyBirdAmount,
      formatted: formatCurrency(earlyBirdAmount),
      description: PRICING_CONFIG.EARLY_BIRD.DESCRIPTION,
    },
    regular: {
      amount: regularAmount,
      formatted: formatCurrency(regularAmount),
      description: PRICING_CONFIG.REGULAR.DESCRIPTION,
    },
    savings: {
      amount: savings,
      formatted: formatCurrency(savings),
      percentage: discountPercentage,
      percentageFormatted: `${discountPercentage}%`,
    },
  };
};

// Validate amount against pricing tiers
export const validatePricingAmount = (amount: number): {
  isValid: boolean;
  tier?: 'early' | 'regular';
  error?: string;
} => {
  if (amount === PRICING_CONFIG.EARLY_BIRD.AMOUNT) {
    return { isValid: true, tier: 'early' };
  }
  
  if (amount === PRICING_CONFIG.REGULAR.AMOUNT) {
    return { isValid: true, tier: 'regular' };
  }
  
  return {
    isValid: false,
    error: `Invalid amount. Expected ${formatCurrency(PRICING_CONFIG.EARLY_BIRD.AMOUNT)} or ${formatCurrency(PRICING_CONFIG.REGULAR.AMOUNT)}`,
  };
};

// Get payment button text based on pricing
export const getPaymentButtonText = (tier: PricingTier): string => {
  const formattedAmount = formatCurrency(tier.amount);
  
  if (tier.name === 'early') {
    return `Pay ${formattedAmount} (Early Bird)`;
  }
  
  return `Pay ${formattedAmount}`;
};

// Get pricing badge text
export const getPricingBadgeText = (tier: PricingTier): string | null => {
  if (tier.name === 'early') {
    const percentage = getEarlyBirdDiscountPercentage();
    return `${percentage}% OFF`;
  }
  
  return null;
};

// Helper to get all pricing configuration
export const getAllPricingInfo = () => {
  return {
    config: PRICING_CONFIG,
    comparison: getPricingComparison(),
    discountPercentage: getEarlyBirdDiscountPercentage(),
    savings: getEarlyBirdSavingsInPaise(),
  };
};