import { supabase } from '@/integrations/supabase/client';
import {
  InfluencerProfile,
  DashboardStats,
  TrackingEvent,
  RecentActivity,
  ConversionFunnel,
  PerformanceData,
  DateRange,
  DashboardResponse,
} from './types';

export * from './types';
export * from './updateProfile';

/**
 * Get influencer profile by email (used for authentication check)
 */
export const getInfluencerByEmail = async (
  email: string
): Promise<DashboardResponse<InfluencerProfile>> => {
  try {
    const { data, error } = await supabase
      .from('influencers')
      .select('*')
      .eq('email', email)
      .eq('status', 'active') // Only allow active influencers
      .maybeSingle();

    if (error) {
      console.error('Error fetching influencer by email:', error);
      return {
        success: false,
        data: null,
        error: error.message,
      };
    }

    if (!data) {
      return {
        success: false,
        data: null,
        error: 'Influencer not found or inactive',
      };
    }

    return {
      success: true,
      data: data as InfluencerProfile,
      error: null,
    };
  } catch (error: any) {
    console.error('Unexpected error in getInfluencerByEmail:', error);
    return {
      success: false,
      data: null,
      error: error?.message || 'An unexpected error occurred',
    };
  }
};

/**
 * Get dashboard statistics for an influencer
 */
export const getDashboardStats = async (
  affiliateCode: string
): Promise<DashboardResponse<DashboardStats>> => {
  try {
    // Get all tracking events for this affiliate
    const { data: trackingData, error: trackingError } = await supabase
      .from('tracking_events')
      .select('event_type, commission_earned')
      .eq('affiliate_code', affiliateCode);

    if (trackingError) {
      return {
        success: false,
        data: null,
        error: trackingError.message,
      };
    }

    // Count events by type
    const totalClicks = trackingData?.filter(e => e.event_type === 'click').length || 0;
    const totalSignups = trackingData?.filter(e => e.event_type === 'signup').length || 0;
    const totalQuestionnaires = trackingData?.filter(e => e.event_type === 'questionnaire_completed').length || 0;
    const totalPurchases = trackingData?.filter(e => e.event_type === 'pdf_purchased').length || 0;
    
    // Calculate total earnings from commission_earned
    const totalEarnings = trackingData
      ?.filter(e => e.event_type === 'pdf_purchased')
      .reduce((sum, e) => sum + (e.commission_earned || 0), 0) || 0;

    // Calculate conversion rates
    const clickToSignup = totalClicks > 0 
      ? (totalSignups / totalClicks) * 100 
      : 0;
    
    const signupToPurchase = totalSignups > 0 
      ? (totalPurchases / totalSignups) * 100 
      : 0;

    const overallConversion = totalClicks > 0
      ? (totalPurchases / totalClicks) * 100
      : 0;

    const stats: DashboardStats = {
      totalClicks,
      totalSignups,
      totalPurchases,
      totalEarnings: Number(totalEarnings.toFixed(2)),
      conversionRate: Number(overallConversion.toFixed(2)),
      clickToSignup: Number(clickToSignup.toFixed(2)),
      signupToPurchase: Number(signupToPurchase.toFixed(2)),
    };

    return {
      success: true,
      data: stats,
      error: null,
    };
  } catch (error: any) {
    console.error('Unexpected error in getDashboardStats:', error);
    return {
      success: false,
      data: null,
      error: error?.message || 'An unexpected error occurred',
    };
  }
};

/**
 * Get recent tracking events for an influencer
 */
export const getRecentActivity = async (
  affiliateCode: string,
  limit: number = 10
): Promise<DashboardResponse<RecentActivity[]>> => {
  try {
    const { data, error } = await supabase
      .from('tracking_events')
      .select('*')
      .eq('affiliate_code', affiliateCode)
      .order('timestamp', { ascending: false })
      .limit(limit);

    if (error) {
      return {
        success: false,
        data: null,
        error: error.message,
      };
    }

    // Transform tracking events to recent activity
    const activities: RecentActivity[] = (data || []).map((event: TrackingEvent) => {
      let description = '';
      let earnings = undefined;

      switch (event.event_type) {
        case 'click':
          description = 'User clicked your affiliate link';
          break;
        case 'signup':
          description = 'User signed up via your link';
          break;
        case 'questionnaire_completed':
          description = 'User completed the questionnaire';
          break;
        case 'pdf_purchased':
          description = `PDF purchased - ₹${event.commission_earned.toFixed(2)} commission earned`;
          earnings = event.commission_earned;
          break;
      }

      return {
        id: event.id,
        type: event.event_type,
        description,
        timestamp: event.timestamp,
        earnings,
      };
    });

    return {
      success: true,
      data: activities,
      error: null,
    };
  } catch (error: any) {
    console.error('Unexpected error in getRecentActivity:', error);
    return {
      success: false,
      data: null,
      error: error?.message || 'An unexpected error occurred',
    };
  }
};

/**
 * Get conversion funnel data for an influencer
 */
export const getConversionFunnel = async (
  affiliateCode: string
): Promise<DashboardResponse<ConversionFunnel>> => {
  try {
    // Get counts for each event type
    const { data, error } = await supabase
      .from('tracking_events')
      .select('event_type')
      .eq('affiliate_code', affiliateCode);

    if (error) {
      return {
        success: false,
        data: null,
        error: error.message,
      };
    }

    const events = data || [];
    const clicks = events.filter(e => e.event_type === 'click').length;
    const signups = events.filter(e => e.event_type === 'signup').length;
    const questionnaires = events.filter(e => e.event_type === 'questionnaire_completed').length;
    const purchases = events.filter(e => e.event_type === 'pdf_purchased').length;

    // Calculate conversion rates
    const clickToSignupRate = clicks > 0 ? (signups / clicks) * 100 : 0;
    const signupToQuestionnaireRate = signups > 0 ? (questionnaires / signups) * 100 : 0;
    const questionnaireToPurchaseRate = questionnaires > 0 ? (purchases / questionnaires) * 100 : 0;
    const overallConversionRate = clicks > 0 ? (purchases / clicks) * 100 : 0;

    const funnel: ConversionFunnel = {
      clicks,
      signups,
      questionnairesCompleted: questionnaires,
      purchases,
      clickToSignupRate: Number(clickToSignupRate.toFixed(2)),
      signupToQuestionnaireRate: Number(signupToQuestionnaireRate.toFixed(2)),
      questionnaireToPurchaseRate: Number(questionnaireToPurchaseRate.toFixed(2)),
      overallConversionRate: Number(overallConversionRate.toFixed(2)),
    };

    return {
      success: true,
      data: funnel,
      error: null,
    };
  } catch (error: any) {
    console.error('Unexpected error in getConversionFunnel:', error);
    return {
      success: false,
      data: null,
      error: error?.message || 'An unexpected error occurred',
    };
  }
};

/**
 * Get performance data over time for charts
 */
export const getPerformanceData = async (
  affiliateCode: string,
  dateRange?: DateRange
): Promise<DashboardResponse<PerformanceData[]>> => {
  try {
    let query = supabase
      .from('tracking_events')
      .select('event_type, timestamp')
      .eq('affiliate_code', affiliateCode)
      .order('timestamp', { ascending: true });

    // Apply date range filter if provided
    if (dateRange) {
      query = query
        .gte('timestamp', dateRange.startDate)
        .lte('timestamp', dateRange.endDate);
    }

    const { data, error } = await query;

    if (error) {
      return {
        success: false,
        data: null,
        error: error.message,
      };
    }

    // Group events by date
    const groupedData: { [date: string]: { clicks: number; signups: number; purchases: number } } = {};

    (data || []).forEach((event: TrackingEvent) => {
      const date = new Date(event.timestamp).toISOString().split('T')[0];
      
      if (!groupedData[date]) {
        groupedData[date] = { clicks: 0, signups: 0, purchases: 0 };
      }

      switch (event.event_type) {
        case 'click':
          groupedData[date].clicks++;
          break;
        case 'signup':
          groupedData[date].signups++;
          break;
        case 'pdf_purchased':
          groupedData[date].purchases++;
          break;
      }
    });

    // Convert to array format for charts
    const performanceData: PerformanceData[] = Object.entries(groupedData)
      .map(([date, counts]) => ({
        date,
        ...counts,
      }))
      .sort((a, b) => a.date.localeCompare(b.date));

    return {
      success: true,
      data: performanceData,
      error: null,
    };
  } catch (error: any) {
    console.error('Unexpected error in getPerformanceData:', error);
    return {
      success: false,
      data: null,
      error: error?.message || 'An unexpected error occurred',
    };
  }
};

/**
 * Generate affiliate link for the influencer
 */
export const generateAffiliateLink = (affiliateCode: string): string => {
  const baseUrl = window.location.origin;
  return `${baseUrl}/quest?ref=${affiliateCode}`;
};
