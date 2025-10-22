// Export all types
export * from './types';
import { supabase } from '@/integrations/supabase/client';
import {
  InfluencerFilters,
  PaginationParams,
  InfluencersResponse,
  InfluencerResponse,
  DeleteInfluencerResponse,
  InfluencerStats,
  InfluencerData,
  PaginationMeta,
  CreateInfluencerInput,
  UpdateInfluencerInput,
} from './types';

/**
 * Fetch influencers with filtering and pagination
 */
export const fetchInfluencers = async (
  paginationParams: PaginationParams,
  filters?: InfluencerFilters
): Promise<InfluencersResponse> => {
  try {
    const { page, pageSize } = paginationParams;
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    // Build the base query
    let query = supabase
      .from('influencers')
      .select('*', { count: 'exact' });

    // Apply search filter
    if (filters?.searchTerm && filters.searchTerm.trim()) {
      const searchTerm = filters.searchTerm.trim();
      query = query.or(
        `name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%,affiliate_code.ilike.%${searchTerm}%,phone.ilike.%${searchTerm}%`
      );
    }

    // Apply status filter
    if (filters?.status) {
      query = query.eq('status', filters.status);
    }

    // Apply earnings range filters
    if (filters?.minEarnings !== null && filters?.minEarnings !== undefined) {
      query = query.gte('total_earnings', filters.minEarnings);
    }
    if (filters?.maxEarnings !== null && filters?.maxEarnings !== undefined) {
      query = query.lte('total_earnings', filters.maxEarnings);
    }

    // Apply conversion rate filters
    if (filters?.minConversionRate !== null && filters?.minConversionRate !== undefined) {
      query = query.gte('conversion_rate', filters.minConversionRate);
    }
    if (filters?.maxConversionRate !== null && filters?.maxConversionRate !== undefined) {
      query = query.lte('conversion_rate', filters.maxConversionRate);
    }

    // Apply date range filters
    if (filters?.dateFrom) {
      query = query.gte('created_at', filters.dateFrom);
    }
    if (filters?.dateTo) {
      query = query.lte('created_at', filters.dateTo);
    }

    // Apply pagination and ordering
    query = query
      .range(from, to)
      .order('created_at', { ascending: false });

    // Execute query
    const { data, error, count } = await query;

    if (error) {
      console.error('Error fetching influencers:', error);
      return {
        success: false,
        data: null,
        error: error.message,
      };
    }

    // Fetch live stats for each influencer from tracking_events
    const influencersWithStats = await Promise.all(
      (data || []).map(async (influencer: any) => {
        const { data: trackingData } = await supabase
          .from('tracking_events')
          .select('event_type')
          .eq('affiliate_code', influencer.affiliate_code);

        const liveClicks = trackingData?.filter(e => e.event_type === 'click').length || 0;
        const liveSignups = trackingData?.filter(e => e.event_type === 'signup').length || 0;
        const liveQuestionnaires = trackingData?.filter(e => e.event_type === 'questionnaire_completed').length || 0;
        const livePurchases = trackingData?.filter(e => e.event_type === 'pdf_purchased').length || 0;

        return {
          ...influencer,
          total_clicks: liveClicks,
          total_signups: liveSignups,
          total_questionnaires: liveQuestionnaires,
          total_purchases: livePurchases,
        };
      })
    );

    // Calculate pagination metadata
    const totalPages = Math.ceil((count || 0) / pageSize);

    const paginationMeta: PaginationMeta = {
      currentPage: page,
      pageSize,
      totalRecords: count || 0,
      totalPages,
    };

    return {
      success: true,
      data: {
        influencers: influencersWithStats as InfluencerData[],
        pagination: paginationMeta,
      },
      error: null,
    };
  } catch (error: any) {
    console.error('Unexpected error in fetchInfluencers:', error);
    return {
      success: false,
      data: null,
      error: error?.message || 'An unexpected error occurred',
    };
  }
};

/**
 * Get influencer statistics for dashboard cards
 */
export const getInfluencerStats = async (): Promise<InfluencerStats> => {
  try {
    // Fetch influencer count
    const { data: influencersData, error: influencersError } = await supabase
      .from('influencers')
      .select('status');

    if (influencersError) {
      console.error('Error fetching influencers:', influencersError);
    }

    const totalInfluencers = influencersData?.length || 0;
    const activeInfluencers = influencersData?.filter(inf => inf.status === 'active').length || 0;
    
    // Fetch ALL tracking events
    const { data: eventsData, error: eventsError } = await supabase
      .from('tracking_events')
      .select('event_type, revenue, commission_earned');
    
    if (eventsError) {
      console.error('Error fetching tracking events:', eventsError);
    }

    // Count events by type
    const totalClicks = eventsData?.filter(e => e.event_type === 'click').length || 0;
    const totalSignups = eventsData?.filter(e => e.event_type === 'signup').length || 0;
    const totalQuestionnaires = eventsData?.filter(e => e.event_type === 'questionnaire_completed').length || 0;
    const totalPurchases = eventsData?.filter(e => e.event_type === 'pdf_purchased').length || 0;
    
    // Calculate totals
    const totalRevenue = eventsData?.reduce((sum, event) => sum + (event.revenue || 0), 0) || 0;
    const totalCommissions = eventsData?.reduce((sum, event) => sum + (event.commission_earned || 0), 0) || 0;
    
    // Calculate average conversion rate
    const averageConversionRate = totalClicks > 0 
      ? (totalPurchases / totalClicks) * 100 
      : 0;

    return {
      totalInfluencers,
      activeInfluencers,
      totalRevenue,
      totalCommissions,
      totalClicks,
      totalSignups,
      totalQuestionnaires,
      totalPurchases,
      averageConversionRate: Number(averageConversionRate.toFixed(2)),
    };
  } catch (error) {
    console.error('Unexpected error in getInfluencerStats:', error);
    return {
      totalInfluencers: 0,
      activeInfluencers: 0,
      totalRevenue: 0,
      totalCommissions: 0,
      totalClicks: 0,
      totalSignups: 0,
      totalQuestionnaires: 0,
      totalPurchases: 0,
      averageConversionRate: 0,
    };
  }
};

/**
 * Create a new influencer
 */
export const createInfluencer = async (input: CreateInfluencerInput): Promise<InfluencerResponse> => {
  try {
    console.log('Creating influencer:', input.name);

    // Check if affiliate code already exists
    const { data: existingCode } = await supabase
      .from('influencers')
      .select('id')
      .eq('affiliate_code', input.affiliate_code)
      .maybeSingle();

    if (existingCode) {
      return {
        success: false,
        data: null,
        error: 'Affiliate code already exists',
      };
    }

    // Check if email already exists
    const { data: existingEmail } = await supabase
      .from('influencers')
      .select('id')
      .eq('email', input.email)
      .maybeSingle();

    if (existingEmail) {
      return {
        success: false,
        data: null,
        error: 'Email already exists',
      };
    }

    // Create the influencer
    const { data, error } = await supabase
      .from('influencers')
      .insert({
        name: input.name,
        email: input.email,
        phone: input.phone || null,
        profile_image: input.profile_image || null,
        bio: input.bio || null,
        social_links: input.social_links || null,
        affiliate_code: input.affiliate_code,
        commission_rate: input.commission_rate,
        payment_info: input.payment_info || null,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating influencer:', error);
      return {
        success: false,
        data: null,
        error: error.message,
      };
    }

    console.log('Influencer created successfully:', data.id);
    return {
      success: true,
      data: data as InfluencerData,
      error: null,
    };
  } catch (error: any) {
    console.error('Unexpected error in createInfluencer:', error);
    return {
      success: false,
      data: null,
      error: error?.message || 'An unexpected error occurred',
    };
  }
};

/**
 * Update an existing influencer
 */
export const updateInfluencer = async (
  influencerId: string,
  input: UpdateInfluencerInput
): Promise<InfluencerResponse> => {
  try {
    console.log('Updating influencer:', influencerId);

    // Build update object with only provided fields
    const updateData: any = { updated_at: new Date().toISOString() };
    
    if (input.name !== undefined) updateData.name = input.name;
    if (input.email !== undefined) updateData.email = input.email;
    if (input.phone !== undefined) updateData.phone = input.phone;
    if (input.profile_image !== undefined) updateData.profile_image = input.profile_image;
    if (input.bio !== undefined) updateData.bio = input.bio;
    if (input.social_links !== undefined) updateData.social_links = input.social_links;
    if (input.commission_rate !== undefined) updateData.commission_rate = input.commission_rate;
    if (input.status !== undefined) updateData.status = input.status;
    if (input.payment_info !== undefined) updateData.payment_info = input.payment_info;

    const { data, error } = await supabase
      .from('influencers')
      .update(updateData)
      .eq('id', influencerId)
      .select()
      .single();

    if (error) {
      console.error('Error updating influencer:', error);
      return {
        success: false,
        data: null,
        error: error.message,
      };
    }

    console.log('Influencer updated successfully');
    return {
      success: true,
      data: data as InfluencerData,
      error: null,
    };
  } catch (error: any) {
    console.error('Unexpected error in updateInfluencer:', error);
    return {
      success: false,
      data: null,
      error: error?.message || 'An unexpected error occurred',
    };
  }
};

/**
 * Delete an influencer and all related tracking events
 */
export const deleteInfluencer = async (influencerId: string): Promise<DeleteInfluencerResponse> => {
  try {
    console.log('Starting cascade delete for influencer:', influencerId);

    // Step 1: Delete related tracking events
    console.log('Deleting tracking events...');
    const { data: influencerData } = await supabase
      .from('influencers')
      .select('affiliate_code')
      .eq('id', influencerId)
      .single();

    if (influencerData) {
      const { error: eventsError } = await supabase
        .from('tracking_events')
        .delete()
        .eq('affiliate_code', influencerData.affiliate_code);

      if (eventsError) {
        console.error('Error deleting tracking events:', eventsError);
        return {
          success: false,
          message: null,
          error: `Failed to delete tracking events: ${eventsError.message}`,
        };
      }
      console.log('Deleted tracking events');
    }

    // Step 2: Delete related payouts
    console.log('Deleting payout records...');
    const { error: payoutsError } = await supabase
      .from('influencer_payouts')
      .delete()
      .eq('influencer_id', influencerId);

    if (payoutsError) {
      console.error('Error deleting payouts:', payoutsError);
      return {
        success: false,
        message: null,
        error: `Failed to delete payout records: ${payoutsError.message}`,
      };
    }
    console.log('Deleted payout records');

    // Step 3: Delete the influencer
    console.log('Deleting influencer record...');
    const { error } = await supabase
      .from('influencers')
      .delete()
      .eq('id', influencerId);

    if (error) {
      console.error('Error deleting influencer:', error);
      return {
        success: false,
        message: null,
        error: `Failed to delete influencer: ${error.message}`,
      };
    }

    console.log('Influencer deleted successfully!');
    return {
      success: true,
      message: 'Influencer and all related records deleted successfully',
      error: null,
    };
  } catch (error: any) {
    console.error('Unexpected error in deleteInfluencer:', error);
    return {
      success: false,
      message: null,
      error: error?.message || 'An unexpected error occurred',
    };
  }
};

/**
 * Get a single influencer by ID
 */
export const getInfluencerById = async (influencerId: string): Promise<InfluencerResponse> => {
  try {
    const { data, error } = await supabase
      .from('influencers')
      .select('*')
      .eq('id', influencerId)
      .single();

    if (error) {
      console.error('Error fetching influencer:', error);
      return {
        success: false,
        data: null,
        error: error.message,
      };
    }

    return {
      success: true,
      data: data as InfluencerData,
      error: null,
    };
  } catch (error: any) {
    console.error('Unexpected error in getInfluencerById:', error);
    return {
      success: false,
      data: null,
      error: error?.message || 'An unexpected error occurred',
    };
  }
};

/**
 * Generate a unique affiliate code
 */
export const generateAffiliateCode = (name: string): string => {
  // Remove spaces and special characters, take first 4 letters, add year
  const cleanName = name.replace(/[^a-zA-Z]/g, '').toUpperCase();
  const namePart = cleanName.substring(0, 4).padEnd(4, 'X');
  const year = new Date().getFullYear();
  const random = Math.floor(Math.random() * 100).toString().padStart(2, '0');
  return `${namePart}${year}${random}`;
};

/**
 * Update influencer metrics (called by backend when events occur)
 */
export const updateInfluencerMetrics = async (affiliateCode: string): Promise<void> => {
  try {
    // This function would be called by your backend to update cached metrics
    // For now, it's a placeholder - you'll update metrics via backend triggers or cron jobs
    console.log('Updating metrics for:', affiliateCode);
  } catch (error) {
    console.error('Error updating influencer metrics:', error);
  }
};

// ==================== PAYOUT FUNCTIONS ====================

/**
 * Fetch all payouts for a specific influencer
 */
export const getInfluencerPayouts = async (influencerId: string): Promise<{
  success: boolean;
  data: any[] | null;
  error: string | null;
}> => {
  try {
    const { data, error } = await supabase
      .from('influencer_payouts')
      .select('*')
      .eq('influencer_id', influencerId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching payouts:', error);
      return { success: false, data: null, error: error.message };
    }

    return { success: true, data, error: null };
  } catch (error: any) {
    console.error('Unexpected error fetching payouts:', error);
    return { success: false, data: null, error: error?.message || 'An unexpected error occurred' };
  }
};

/**
 * Create a new payout for an influencer
 */
export const createPayout = async (input: {
  influencer_id: string;
  amount: number;
  payout_method: 'bank_transfer' | 'upi' | 'paypal';
  transaction_id?: string;
  notes?: string;
  processed_by?: string;
}): Promise<{
  success: boolean;
  data: any | null;
  error: string | null;
}> => {
  try {
    const { data, error } = await supabase
      .from('influencer_payouts')
      .insert({
        influencer_id: input.influencer_id,
        amount: input.amount,
        payout_method: input.payout_method,
        transaction_id: input.transaction_id || null,
        status: 'pending',
        notes: input.notes || null,
        processed_by: input.processed_by || null,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating payout:', error);
      return { success: false, data: null, error: error.message };
    }

    return { success: true, data, error: null };
  } catch (error: any) {
    console.error('Unexpected error creating payout:', error);
    return { success: false, data: null, error: error?.message || 'An unexpected error occurred' };
  }
};

/**
 * Update payout status (pending → completed/failed)
 */
export const updatePayoutStatus = async (input: {
  payout_id: string;
  status: 'completed' | 'failed';
  transaction_id?: string;
  notes?: string;
}): Promise<{
  success: boolean;
  data: any | null;
  error: string | null;
}> => {
  try {
    const updateData: any = {
      status: input.status,
      payout_date: new Date().toISOString(),
    };

    if (input.transaction_id) updateData.transaction_id = input.transaction_id;
    if (input.notes) updateData.notes = input.notes; // Notes is already a stringified JSON array from frontend

    const { data, error } = await supabase
      .from('influencer_payouts')
      .update(updateData)
      .eq('id', input.payout_id)
      .select()
      .single();

    if (error) {
      console.error('Error updating payout status:', error);
      return { success: false, data: null, error: error.message };
    }

    // If completed, update influencer's total_paid and remaining_balance
    if (input.status === 'completed' && data) {
      try {
        // First, get current influencer data
        const { data: influencerData, error: fetchError } = await supabase
          .from('influencers')
          .select('total_paid, remaining_balance')
          .eq('id', data.influencer_id)
          .single();

        if (fetchError) {
          console.warn('Could not fetch current influencer data:', fetchError);
        } else {
          // Update the influencer's totals
          const newTotalPaid = (influencerData.total_paid || 0) + data.amount;
          const newRemainingBalance = Math.max(0, (influencerData.remaining_balance || 0) - data.amount);

          const { error: updateError } = await supabase
            .from('influencers')
            .update({
              total_paid: newTotalPaid,
              remaining_balance: newRemainingBalance,
              updated_at: new Date().toISOString()
            })
            .eq('id', data.influencer_id);

          if (updateError) {
            console.warn('Could not update influencer totals:', updateError);
          } else {
            console.log(`Updated influencer ${data.influencer_id}: total_paid=${newTotalPaid}, remaining_balance=${newRemainingBalance}`);
          }
        }
      } catch (updateError: any) {
        console.warn('Error updating influencer totals:', updateError);
        // Don't fail the whole operation if this fails
      }
    }

    return { success: true, data, error: null };
  } catch (error: any) {
    console.error('Unexpected error updating payout status:', error);
    return { success: false, data: null, error: error?.message || 'An unexpected error occurred' };
  }
};
