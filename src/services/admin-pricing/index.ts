import { supabase } from '@/integrations/supabase/client';

export interface DynamicPricingData {
  id: string;
  razorpay_india_price_paise: number;
  razorpay_india_display_price_paise: number;
  razorpay_international_price_cents: number;
  razorpay_international_display_price_cents: number;
  paypal_india_price_cents: number;
  paypal_india_display_price_cents: number;
  paypal_international_price_cents: number;
  paypal_international_display_price_cents: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  updated_by: string | null;
  notes: string | null;
}

export interface PricingUpdateData {
  razorpay_india_price_paise: number;
  razorpay_india_display_price_paise: number;
  razorpay_international_price_cents: number;
  razorpay_international_display_price_cents: number;
  paypal_india_price_cents: number;
  paypal_india_display_price_cents: number;
  paypal_international_price_cents: number;
  paypal_international_display_price_cents: number;
  updated_by: string;
  notes?: string;
}

// Fetch current active pricing configuration
export const fetchActivePricing = async (): Promise<{
  success: boolean;
  data?: DynamicPricingData;
  error?: string;
}> => {
  try {
    console.log('🔄 Fetching active pricing configuration...');

    const { data, error } = await supabase
      .from('dynamic_pricing')
      .select('*')
      .eq('is_active', true)
      .order('updated_at', { ascending: false })
      .limit(1)
      .single();

    if (error) {
      console.error('❌ Error fetching active pricing:', error);
      return {
        success: false,
        error: error.message || 'Failed to fetch pricing configuration'
      };
    }

    if (!data) {
      console.error('❌ No active pricing configuration found');
      return {
        success: false,
        error: 'No active pricing configuration found'
      };
    }

    console.log('✅ Active pricing fetched successfully');
    return {
      success: true,
      data: data as DynamicPricingData
    };

  } catch (error: any) {
    console.error('❌ Exception fetching pricing:', error);
    return {
      success: false,
      error: error.message || 'Failed to fetch pricing configuration'
    };
  }
};

// Update pricing configuration
export const updatePricing = async (updateData: PricingUpdateData): Promise<{
  success: boolean;
  data?: DynamicPricingData;
  error?: string;
}> => {
  try {
    console.log('🔄 Updating pricing configuration...', updateData);

    // First, deactivate all existing configurations
    const { error: deactivateError } = await supabase
      .from('dynamic_pricing')
      .update({ is_active: false })
      .eq('is_active', true);

    if (deactivateError) {
      console.error('❌ Error deactivating old pricing:', deactivateError);
      return {
        success: false,
        error: 'Failed to deactivate existing pricing'
      };
    }

    // Insert new active configuration
    const { data, error } = await supabase
      .from('dynamic_pricing')
      .insert({
        ...updateData,
        is_active: true,
        updated_at: new Date().toISOString()
      })
      .select('*')
      .single();

    if (error) {
      console.error('❌ Error inserting new pricing:', error);
      return {
        success: false,
        error: error.message || 'Failed to update pricing configuration'
      };
    }

    console.log('✅ Pricing updated successfully');
    return {
      success: true,
      data: data as DynamicPricingData
    };

  } catch (error: any) {
    console.error('❌ Exception updating pricing:', error);
    return {
      success: false,
      error: error.message || 'Failed to update pricing configuration'
    };
  }
};

// Fetch all pricing configurations (for history/admin view)
export const fetchAllPricingHistory = async (): Promise<{
  success: boolean;
  data?: DynamicPricingData[];
  error?: string;
}> => {
  try {
    console.log('🔄 Fetching pricing history...');

    const { data, error } = await supabase
      .from('dynamic_pricing')
      .select('*')
      .order('updated_at', { ascending: false });

    if (error) {
      console.error('❌ Error fetching pricing history:', error);
      return {
        success: false,
        error: error.message || 'Failed to fetch pricing history'
      };
    }

    console.log('✅ Pricing history fetched successfully');
    return {
      success: true,
      data: data as DynamicPricingData[]
    };

  } catch (error: any) {
    console.error('❌ Exception fetching pricing history:', error);
    return {
      success: false,
      error: error.message || 'Failed to fetch pricing history'
    };
  }
};

// Activate a historical pricing row by ID
export const activatePricingById = async (
  id: string,
  options?: { updated_by?: string; notes?: string }
): Promise<{
  success: boolean;
  data?: DynamicPricingData;
  error?: string;
}> => {
  try {
    // Deactivate any currently active row
    const { error: deactivateError } = await supabase
      .from('dynamic_pricing')
      .update({ is_active: false })
      .eq('is_active', true);

    if (deactivateError) {
      return { success: false, error: deactivateError.message || 'Failed to deactivate current active pricing' };
    }

    // Activate the selected row
    const { data, error } = await supabase
      .from('dynamic_pricing')
      .update({
        is_active: true,
        updated_at: new Date().toISOString(),
        ...(options?.updated_by ? { updated_by: options.updated_by } : {}),
        ...(options?.notes ? { notes: options.notes } : {}),
      })
      .eq('id', id)
      .select('*')
      .single();

    if (error) {
      return { success: false, error: error.message || 'Failed to activate pricing' };
    }

    return { success: true, data: data as DynamicPricingData };
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to activate pricing' };
  }
};

// Get pricing for frontend display (environment vs database)
export const getPricingForDisplay = async (): Promise<{
  success: boolean;
  data?: {
    razorpay: {
      india: { price: number; displayPrice: number };
      international: { price: number; displayPrice: number };
    };
    paypal: {
      india: { price: number; displayPrice: number };
      international: { price: number; displayPrice: number };
    };
  };
  error?: string;
  source: 'environment' | 'database';
}> => {
  try {
    const priceStatus = import.meta.env.VITE_DYNAMIC_PRICE_STATUS;
    console.log('🔍 Price status:', priceStatus);

    if (priceStatus === 'development') {
      // Use environment variables
      console.log('📝 Using environment pricing (development mode)');
      
      const envPricing = {
        razorpay: {
          india: {
            price: Number(import.meta.env.VITE_INDIA_PRICE_PAISE) || 20000,
            displayPrice: Number(import.meta.env.VITE_INDIA_ORIGINAL_PRICE_PAISE) || 120000,
          },
          international: {
            price: Number(import.meta.env.VITE_INTERNATIONAL_PRICE_CENTS) || 1000,
            displayPrice: Number(import.meta.env.VITE_INTERNATIONAL_ORIGINAL_PRICE_CENTS) || 2500,
          }
        },
        paypal: {
          india: {
            price: Number(import.meta.env.VITE_PAYPAL_INDIA_PRICE_CENTS) || 500,
            displayPrice: Number(import.meta.env.VITE_PAYPAL_INDIA_ORIGINAL_PRICE_CENTS) || 200,
          },
          international: {
            price: Number(import.meta.env.VITE_PAYPAL_INTERNATIONAL_PRICE_CENTS) || 1000,
            displayPrice: Number(import.meta.env.VITE_PAYPAL_INTERNATIONAL_ORIGINAL_PRICE_CENTS) || 2500,
          }
        }
      };

      return {
        success: true,
        data: envPricing,
        source: 'environment'
      };
    } else {
      // Use database pricing
      console.log('🗄️ Using database pricing (live mode)');
      
      const result = await fetchActivePricing();
      if (!result.success || !result.data) {
        return {
          success: false,
          error: result.error || 'Failed to fetch database pricing',
          source: 'database'
        };
      }

      const dbPricing = {
        razorpay: {
          india: {
            price: result.data.razorpay_india_price_paise,
            displayPrice: result.data.razorpay_india_display_price_paise,
          },
          international: {
            price: result.data.razorpay_international_price_cents,
            displayPrice: result.data.razorpay_international_display_price_cents,
          }
        },
        paypal: {
          india: {
            price: result.data.paypal_india_price_cents,
            displayPrice: result.data.paypal_india_display_price_cents,
          },
          international: {
            price: result.data.paypal_international_price_cents,
            displayPrice: result.data.paypal_international_display_price_cents,
          }
        }
      };

      return {
        success: true,
        data: dbPricing,
        source: 'database'
      };
    }

  } catch (error: any) {
    console.error('❌ Exception getting pricing for display:', error);
    return {
      success: false,
      error: error.message || 'Failed to get pricing configuration',
      source: 'environment'
    };
  }
};