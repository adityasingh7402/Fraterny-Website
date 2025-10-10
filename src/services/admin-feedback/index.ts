// Export all types
export * from './types';
import { supabase } from '@/integrations/supabase/client';
import {
  FeedbackFilters,
  PaginationParams,
  FeedbackResponse,
  FeedbackStatsResponse,
  EnrichedFeedback,
  PaginationMeta,
  FeedbackStats,
} from './types';

/**
 * Fetch feedback statistics
 */
export const fetchFeedbackStats = async (): Promise<FeedbackStatsResponse> => {
  try {
    // Get total feedback count and average rating
    const { data: totalData, error: totalError } = await supabase
      .from('summary_overall_feedback')
      .select('id, rating', { count: 'exact' });

    if (totalError) {
      console.error('Error fetching total feedback stats:', totalError);
      return {
        success: false,
        data: null,
        error: totalError.message,
      };
    }

    const totalFeedbacks = totalData?.length || 0;
    
    // Calculate average rating and distribution
    const ratings = totalData?.map(f => parseInt(f.rating || '0')).filter(r => r > 0) || [];
    const averageRating = ratings.length > 0 
      ? parseFloat((ratings.reduce((sum, r) => sum + r, 0) / ratings.length).toFixed(1))
      : 0;

    const ratingDistribution = {
      rating1: ratings.filter(r => r === 1).length,
      rating2: ratings.filter(r => r === 2).length,
      rating3: ratings.filter(r => r === 3).length,
      rating4: ratings.filter(r => r === 4).length,
      rating5: ratings.filter(r => r === 5).length,
    };

    // Get count with and without test IDs
    const { count: withTestIdCount } = await supabase
      .from('summary_overall_feedback')
      .select('id', { count: 'exact' })
      .not('testid', 'is', null);

    const feedbacksWithTestId = withTestIdCount || 0;
    const feedbacksWithoutTestId = totalFeedbacks - feedbacksWithTestId;

    // Get recent feedback count (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const { count: recentCount } = await supabase
      .from('summary_overall_feedback')
      .select('id', { count: 'exact' })
      .gte('created_at', sevenDaysAgo.toISOString());

    const recentFeedbacks = recentCount || 0;

    const stats: FeedbackStats = {
      totalFeedbacks,
      averageRating,
      ratingDistribution,
      feedbacksWithTestId,
      feedbacksWithoutTestId,
      recentFeedbacks,
    };

    return {
      success: true,
      data: stats,
      error: null,
    };
  } catch (error: any) {
    console.error('Unexpected error in fetchFeedbackStats:', error);
    return {
      success: false,
      data: null,
      error: error?.message || 'An unexpected error occurred',
    };
  }
};

/**
 * Fetch feedback details with filtering and pagination
 * 
 * @param paginationParams - Page and pageSize
 * @param filters - Optional filters (search, date range, rating, etc.)
 * @returns FeedbackResponse with feedbacks and pagination metadata
 */
export const fetchFeedbacks = async (
  paginationParams: PaginationParams,
  filters?: FeedbackFilters
): Promise<FeedbackResponse> => {
  try {
    const { page, pageSize } = paginationParams;
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    // Build the base query with joins
    let query = supabase
      .from('summary_overall_feedback')
      .select(
        `
        *,
        user_data (*),
        summary_generation (
          testid,
          quest_pdf,
          payment_status,
          paid_generation_time,
          quest_status,
          status,
          qualityscore,
          starting_time,
          completion_time
        )
        `,
        { count: 'exact' }
      );

    // Apply search filter (global search across multiple fields)
    if (filters?.searchTerm && filters.searchTerm.trim()) {
      const searchTerm = filters.searchTerm.trim();
      query = query.or(
        `user_id.ilike.%${searchTerm}%,testid.ilike.%${searchTerm}%,feedback.ilike.%${searchTerm}%`
      );
    }

    // Apply date range filters
    if (filters?.dateFrom) {
      query = query.gte('date_time', filters.dateFrom);
    }
    if (filters?.dateTo) {
      query = query.lte('date_time', filters.dateTo);
    }

    // Apply rating filter (exact match)
    if (filters?.rating) {
      query = query.eq('rating', filters.rating);
    }

    // Apply rating range filters
    if (filters?.minRating !== null && filters?.minRating !== undefined) {
      query = query.gte('rating', filters.minRating.toString());
    }
    if (filters?.maxRating !== null && filters?.maxRating !== undefined) {
      query = query.lte('rating', filters.maxRating.toString());
    }

    // Apply test ID presence filter
    if (filters?.hasTestId !== null && filters?.hasTestId !== undefined) {
      if (filters.hasTestId) {
        query = query.not('testid', 'is', null);
      } else {
        query = query.is('testid', null);
      }
    }

    // Apply pagination and ordering
    query = query
      .range(from, to)
      .order('created_at', { ascending: false });

    // Execute query
    const { data, error, count } = await query;

    if (error) {
      console.error('Error fetching feedback details:', error);
      return {
        success: false,
        data: null,
        error: error.message,
      };
    }

    // Calculate pagination metadata
    const totalRecords = count || 0;
    const totalPages = Math.ceil(totalRecords / pageSize);
    
    // Ensure we return exactly the requested page size or less (for last page)
    const feedbacks = data ? data.slice(0, pageSize) : [];

    const paginationMeta: PaginationMeta = {
      currentPage: page,
      pageSize,
      totalRecords,
      totalPages,
    };

    return {
      success: true,
      data: {
        feedbacks: (feedbacks as EnrichedFeedback[]) || [],
        pagination: paginationMeta,
      },
      error: null,
    };
  } catch (error: any) {
    console.error('Unexpected error in fetchFeedbacks:', error);
    return {
      success: false,
      data: null,
      error: error?.message || 'An unexpected error occurred',
    };
  }
};

/**
 * Delete feedback by ID
 */
export const deleteFeedback = async (feedbackId: number): Promise<{ success: boolean; error?: string }> => {
  try {
    const { error } = await supabase
      .from('summary_overall_feedback')
      .delete()
      .eq('id', feedbackId);

    if (error) {
      console.error('Error deleting feedback:', error);
      return {
        success: false,
        error: error.message,
      };
    }

    return {
      success: true,
    };
  } catch (error: any) {
    console.error('Unexpected error in deleteFeedback:', error);
    return {
      success: false,
      error: error?.message || 'An unexpected error occurred',
    };
  }
};

/**
 * Get feedback by ID with full details
 */
export const getFeedbackById = async (feedbackId: number): Promise<{
  success: boolean;
  data: EnrichedFeedback | null;
  error?: string;
}> => {
  try {
    const { data, error } = await supabase
      .from('summary_overall_feedback')
      .select(
        `
        *,
        user_data (*),
        summary_generation (
          testid,
          quest_pdf,
          payment_status,
          paid_generation_time,
          quest_status,
          status,
          qualityscore,
          starting_time,
          completion_time
        )
        `
      )
      .eq('id', feedbackId)
      .single();

    if (error) {
      console.error('Error fetching feedback by ID:', error);
      return {
        success: false,
        data: null,
        error: error.message,
      };
    }

    return {
      success: true,
      data: data as EnrichedFeedback,
    };
  } catch (error: any) {
    console.error('Unexpected error in getFeedbackById:', error);
    return {
      success: false,
      data: null,
      error: error?.message || 'An unexpected error occurred',
    };
  }
};

/**
 * Example Usage:
 * 
 * // Get feedback stats
 * const stats = await fetchFeedbackStats();
 * 
 * // Fetch feedbacks with filters
 * const result = await fetchFeedbacks(
 *   { page: 1, pageSize: 20 },
 *   {
 *     searchTerm: 'excellent',
 *     dateFrom: '2025-01-01',
 *     dateTo: '2025-01-31',
 *     rating: '5',
 *     hasTestId: true
 *   }
 * );
 * 
 * // Delete feedback
 * const deleteResult = await deleteFeedback(123);
 * 
 * // Get single feedback
 * const feedback = await getFeedbackById(123);
 */