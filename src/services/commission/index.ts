import { supabase } from '@/integrations/supabase/client';

/**
 * Fetch current USD to INR exchange rate from database
 */
export async function getExchangeRate(): Promise<number> {
  try {
    const { data, error } = await supabase
      .from('additional')
      .select('usdinr')
      .single();

    if (error) {
      console.error('❌ Error fetching exchange rate:', error);
      // Fallback rate if DB fetch fails
      return 83.50;
    }

    const rate = parseFloat(data.usdinr);
    console.log('💱 Exchange rate fetched:', `1 USD = ${rate} INR`);
    return rate;
  } catch (error) {
    console.error('❌ Failed to fetch exchange rate:', error);
    return 83.50; // Fallback rate
  }
}

/**
 * Get commission rate for an affiliate
 */
export async function getCommissionRate(affiliateCode: string): Promise<number> {
  try {
    const { data, error } = await supabase
      .from('influencers')
      .select('commission_rate')
      .eq('affiliate_code', affiliateCode)
      .single();

    if (error) {
      console.error('❌ Error fetching commission rate:', error);
      return 30.00; // Default 30%
    }

    console.log(`💰 Commission rate for ${affiliateCode}:`, `${data.commission_rate}%`);
    return parseFloat(data.commission_rate.toString());
  } catch (error) {
    console.error('❌ Failed to fetch commission rate:', error);
    return 30.00; // Default 30%
  }
}

/**
 * Convert INR to USD
 */
export function convertINRtoUSD(amountInPaise: number, exchangeRate: number): number {
  // Convert paise to rupees: 100 paise = 1 rupee
  const amountInRupees = amountInPaise / 100;
  
  // Convert rupees to USD: amountInRupees / exchangeRate
  const amountInUSD = amountInRupees / exchangeRate;
  
  return amountInUSD;
}

/**
 * Round to 2 decimal places (standard rounding)
 */
export function roundToTwoDecimals(num: number): number {
  return Math.round(num * 100) / 100;
}

/**
 * Calculate commission in USD
 */
export interface CommissionResult {
  amountInUSD: number;        // Payment amount in USD (2 decimals)
  commissionInUSD: number;    // Commission amount in USD (2 decimals)
  commissionRate: number;     // Commission rate percentage
  currency: 'INR' | 'USD';    // Original currency
  exchangeRate?: number;      // Exchange rate used (if INR)
}

export async function calculateCommission(
  amount: number,                    // Amount in smallest unit (paise for INR, cents for USD)
  currency: 'INR' | 'USD',
  affiliateCode: string
): Promise<CommissionResult> {
  try {
    // Fetch commission rate
    const commissionRatePercent = await getCommissionRate(affiliateCode);
    const commissionRate = commissionRatePercent / 100; // Convert to decimal (30% -> 0.30)

    let amountInUSD: number;
    let exchangeRate: number | undefined;

    if (currency === 'INR') {
      // India payment - convert to USD
      exchangeRate = await getExchangeRate();
      amountInUSD = convertINRtoUSD(amount, exchangeRate);
      
      console.log('💱 INR Conversion:', {
        amountInPaise: amount,
        amountInRupees: amount / 100,
        exchangeRate,
        amountInUSD: amountInUSD
      });
    } else {
      // International payment - already in USD cents
      amountInUSD = amount / 100; // Convert cents to dollars
      
      console.log('💵 USD Payment:', {
        amountInCents: amount,
        amountInUSD: amountInUSD
      });
    }

    // Calculate commission
    const commissionInUSD = amountInUSD * commissionRate;

    // Round to 2 decimals
    const roundedAmount = roundToTwoDecimals(amountInUSD);
    const roundedCommission = roundToTwoDecimals(commissionInUSD);

    console.log('💰 Commission Calculation:', {
      amountInUSD: roundedAmount,
      commissionRate: `${commissionRatePercent}%`,
      commissionInUSD: roundedCommission
    });

    return {
      amountInUSD: roundedAmount,
      commissionInUSD: roundedCommission,
      commissionRate: commissionRatePercent,
      currency,
      exchangeRate
    };
  } catch (error) {
    console.error('❌ Failed to calculate commission:', error);
    throw error;
  }
}
