// ============================================================================
// Admin Feedback Service Layer
// ============================================================================

import { supabase } from '../../integrations/supabase/client';
import type {
  SummaryFeedback,
  FeedbackFilters,
  PaginationConfig,
  FetchFeedbackResponse,
  DeleteFeedbackResponse,
} from './types';

/**
 * Fetch feedback with filters and pagination
 * Includes user data and summary generation data
 */
export const fetchFeedback = async (
  filters: FeedbackFilters,
  pagination: PaginationConfig
): Promise<FetchFeedbackResponse> => {
  try {
    const { page, itemsPerPage } = pagination;
    const from = (page - 1) * itemsPerPage;
    const to = from + itemsPerPage - 1;

    console.log('🔍 Fetching feedback with filters:', filters, 'pagination:', pagination);

    // Build the base query - temporarily without join to test RLS
    let query = supabase
      .from('summary_overall_feedback')
      .select('*', { count: 'exact' });
    
    console.log('🔐 Testing query without joins first...');

    // Apply search filter (searches in user_id, testid, and feedback text)
    if (filters.search && filters.search.trim()) {
      const searchTerm = filters.search.trim();
      query = query.or(
        `user_id.ilike.%${searchTerm}%,testid.ilike.%${searchTerm}%,feedback.ilike.%${searchTerm}%`
      );
    }

    // Apply rating filter
    if (filters.rating) {
      query = query.eq('rating', filters.rating);
    }

    // Apply date range filter
    if (filters.dateFrom) {
      query = query.gte('date_time', filters.dateFrom);
    }
    if (filters.dateTo) {
      query = query.lte('date_time', filters.dateTo);
    }

    // Apply pagination and ordering
    query = query
      .range(from, to)
      .order('created_at', { ascending: false, nullsFirst: false });

    // Execute query
    const { data, error, count } = await query;

    console.log('📊 Query executed. Error:', error, 'Data length:', data?.length, 'Count:', count);

    if (error) {
      console.error('❌ Error fetching feedback:', error);
      console.error('❌ Error details:', JSON.stringify(error, null, 2));
      return {
        success: false,
        data: null,
        total: 0,
        error: `Failed to fetch feedback: ${error.message}`,
      };
    }

    console.log('✅ Feedback fetched successfully!', data?.length, 'records, total:', count);
    console.log('📝 First record:', data && data.length > 0 ? data[0] : 'No data');

    return {
      success: true,
      data: (data as SummaryFeedback[]) || [],
      total: count || 0,
      error: null,
    };
  } catch (error: any) {
    console.error('Unexpected error in fetchFeedback:', error);
    return {
      success: false,
      data: null,
      total: 0,
      error: error?.message || 'An unexpected error occurred',
    };
  }
};

/**
 * Delete a feedback record by ID
 */
export const deleteFeedback = async (feedbackId: number): Promise<DeleteFeedbackResponse> => {
  try {
    console.log('🗑️ Deleting feedback:', feedbackId);

    // Delete the feedback record
    const { error } = await supabase
      .from('summary_overall_feedback')
      .delete()
      .eq('id', feedbackId);

    if (error) {
      console.error('❌ Error deleting feedback:', error);
      return {
        success: false,
        message: null,
        error: `Failed to delete feedback: ${error.message}`,
      };
    }

    console.log('✅ Feedback deleted successfully!');

    return {
      success: true,
      message: 'Feedback deleted successfully',
      error: null,
    };
  } catch (error: any) {
    console.error('Unexpected error in deleteFeedback:', error);
    return {
      success: false,
      message: null,
      error: error?.message || 'An unexpected error occurred',
    };
  }
};

/**
 * Get feedback statistics
 */
export const getFeedbackStats = async (): Promise<{
  totalFeedback: number;
  averageRating: number;
  ratingDistribution: Record<string, number>;
}> => {
  try {
    // Fetch all feedback
    const { data, error } = await supabase
      .from('summary_overall_feedback')
      .select('rating');

    if (error) {
      console.error('❌ Error fetching feedback stats:', error);
      return {
        totalFeedback: 0,
        averageRating: 0,
        ratingDistribution: {},
      };
    }

    const totalFeedback = data?.length || 0;
    const ratings = data?.map((f) => parseFloat(f.rating || '0')).filter((r) => !isNaN(r)) || [];
    const averageRating = ratings.length > 0 
      ? ratings.reduce((sum, r) => sum + r, 0) / ratings.length 
      : 0;

    const ratingDistribution: Record<string, number> = {
      '1': 0,
      '2': 0,
      '3': 0,
      '4': 0,
      '5': 0,
    };

    data?.forEach((f) => {
      if (f.rating && ratingDistribution[f.rating] !== undefined) {
        ratingDistribution[f.rating]++;
      }
    });

    return {
      totalFeedback,
      averageRating: Math.round(averageRating * 10) / 10,
      ratingDistribution,
    };
  } catch (error) {
    console.error('Unexpected error in getFeedbackStats:', error);
    return {
      totalFeedback: 0,
      averageRating: 0,
      ratingDistribution: {},
    };
  }
};
