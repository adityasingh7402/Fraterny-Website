
// Export all types
export * from './types';
import { supabase } from '@/integrations/supabase/client';
import {
  SummaryFilters,
  PaginationParams,
  SummariesResponse,
  DeleteSummaryResponse,
  SummaryStats,
  SummaryGeneration,
  PaginationMeta,
} from './types';

/**
 * Fetch summary generations with filtering and pagination
 * 
 * @param paginationParams - Page and pageSize
 * @param filters - Optional filters (search, date range, status, etc.)
 * @returns SummariesResponse with summaries and pagination metadata
 */
export const fetchSummaries = async (
  paginationParams: PaginationParams,
  filters?: SummaryFilters
): Promise<SummariesResponse> => {
  try {
    const { page, pageSize } = paginationParams;
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    // Build the base query with user_data join
    let query = supabase
      .from('summary_generation')
      .select(`
        *,
        user_data (
          user_name,
          email,
          mobile_number,
          city,
          gender,
          dob
        )
      `, { count: 'exact' });

    // Apply search filter (global search across multiple fields)
    if (filters?.searchTerm && filters.searchTerm.trim()) {
      const searchTerm = filters.searchTerm.trim();
      query = query.or(
        `testid.ilike.%${searchTerm}%,user_id.ilike.%${searchTerm}%,session_id.ilike.%${searchTerm}%,ip_address.ilike.%${searchTerm}%`
      );
    }

    // Apply date range filters (starting_time)
    if (filters?.dateFrom) {
      query = query.gte('starting_time', filters.dateFrom);
    }
    if (filters?.dateTo) {
      query = query.lte('starting_time', filters.dateTo);
    }

    // Apply payment status filter
    if (filters?.paymentStatus) {
      query = query.eq('payment_status', filters.paymentStatus);
    }

    // Apply quest status filter
    if (filters?.questStatus) {
      query = query.eq('quest_status', filters.questStatus);
    }

    // Apply status filter
    if (filters?.status) {
      query = query.eq('status', filters.status);
    }

    // Apply device type filter
    if (filters?.deviceType) {
      query = query.eq('device_type', filters.deviceType);
    }

    // Apply quest PDF filter
    if (filters?.hasQuestPdf !== null && filters?.hasQuestPdf !== undefined) {
      if (filters.hasQuestPdf) {
        query = query.not('quest_pdf', 'is', null);
      } else {
        query = query.is('quest_pdf', null);
      }
    }

    // Apply quality score range filters
    if (filters?.minQualityScore !== null && filters?.minQualityScore !== undefined) {
      query = query.gte('qualityscore', filters.minQualityScore.toString());
    }
    if (filters?.maxQualityScore !== null && filters?.maxQualityScore !== undefined) {
      query = query.lte('qualityscore', filters.maxQualityScore.toString());
    }

    // Apply pagination and ordering
    query = query
      .range(from, to)
      .order('starting_time', { ascending: false, nullsFirst: false });

    // Execute query
    const { data, error, count } = await query;

    if (error) {
      console.error('Error fetching summaries:', error);
      return {
        success: false,
        data: null,
        error: error.message,
      };
    }

    // Calculate pagination metadata
    const totalRecords = count || 0;
    const totalPages = Math.ceil(totalRecords / pageSize);

    const paginationMeta: PaginationMeta = {
      currentPage: page,
      pageSize,
      totalRecords,
      totalPages,
    };

    return {
      success: true,
      data: {
        summaries: (data as SummaryGeneration[]) || [],
        pagination: paginationMeta,
      },
      error: null,
    };
  } catch (error: any) {
    console.error('Unexpected error in fetchSummaries:', error);
    return {
      success: false,
      data: null,
      error: error?.message || 'An unexpected error occurred',
    };
  }
};

/**
 * Delete a summary by ID
 * 
 * @param summaryId - The ID of the summary to delete
 * @returns DeleteSummaryResponse with success status
 */
export const deleteSummary = async (summaryId: number): Promise<DeleteSummaryResponse> => {
  try {
    console.log('🗑️ Starting cascade delete for summary:', summaryId);
    
    // First, get the testid to delete related records
    const { data: summaryData, error: fetchError } = await supabase
      .from('summary_generation')
      .select('testid')
      .eq('id', summaryId)
      .single();

    if (fetchError) {
      console.error('❌ Error fetching summary:', fetchError);
      return {
        success: false,
        message: null,
        error: `Failed to fetch summary: ${fetchError.message}`,
      };
    }

    // Step 1: Delete related records in summary_question_answer table
    if (summaryData?.testid) {
      console.log('📝 Deleting related question answers for testid:', summaryData.testid);
      const { error: questionError } = await supabase
        .from('summary_question_answer')
        .delete()
        .eq('testid', summaryData.testid);

      if (questionError) {
        console.error('❌ Error deleting question answers:', questionError);
        return {
          success: false,
          message: null,
          error: `Failed to delete related question answers: ${questionError.message}`,
        };
      }
      console.log('✅ Deleted related question answers');
    }

    // Step 2: Delete the summary
    console.log('📊 Deleting summary record...');
    const { error } = await supabase
      .from('summary_generation')
      .delete()
      .eq('id', summaryId);

    if (error) {
      console.error('❌ Error deleting summary:', error);
      return {
        success: false,
        message: null,
        error: `Failed to delete summary: ${error.message}`,
      };
    }

    console.log('✅ Summary deleted successfully!');
    console.log('🎉 Cascade delete completed for summary:', summaryId);

    return {
      success: true,
      message: 'Summary and all related records deleted successfully',
      error: null,
    };
  } catch (error: any) {
    console.error('Unexpected error in deleteSummary:', error);
    return {
      success: false,
      message: null,
      error: error?.message || 'An unexpected error occurred',
    };
  }
};

/**
 * Get summary statistics for dashboard cards
 * 
 * @returns SummaryStats with aggregated statistics
 */
export const getSummaryStats = async (): Promise<SummaryStats> => {
  try {
    // Fetch all summaries to calculate statistics
    const { data, error } = await supabase
      .from('summary_generation')
      .select('payment_status, status, qualityscore');

    if (error) {
      console.error('Error fetching summary stats:', error);
      return {
        totalSummaries: 0,
        paidSummaries: 0,
        completedSummaries: 0,
        averageQualityScore: 0,
      };
    }

    const totalSummaries = data?.length || 0;
    const paidSummaries = data?.filter(s => s.payment_status === 'completed').length || 0;
    const completedSummaries = data?.filter(s => s.status === 'completed').length || 0;
    
    // Calculate average quality score
    const qualityScores = data
      ?.map(s => parseFloat(s.qualityscore || '0'))
      .filter(score => !isNaN(score) && score > 0) || [];
    
    const averageQualityScore = qualityScores.length > 0
      ? Math.round(qualityScores.reduce((sum, score) => sum + score, 0) / qualityScores.length)
      : 0;

    return {
      totalSummaries,
      paidSummaries,
      completedSummaries,
      averageQualityScore,
    };
  } catch (error) {
    console.error('Unexpected error in getSummaryStats:', error);
    return {
      totalSummaries: 0,
      paidSummaries: 0,
      completedSummaries: 0,
      averageQualityScore: 0,
    };
  }
};

/**
 * Example Usage:
 * 
 * // Fetch summaries
 * const result = await fetchSummaries(
 *   { page: 1, pageSize: 20 },
 *   {
 *     searchTerm: 'test_456',
 *     dateFrom: '2025-01-01',
 *     dateTo: '2025-01-31',
 *     paymentStatus: 'completed',
 *     minQualityScore: 70
 *   }
 * );
 * 
 * // Delete summary
 * const deleteResult = await deleteSummary(123);
 * 
 * // Get statistics
 * const stats = await getSummaryStats();
 */
