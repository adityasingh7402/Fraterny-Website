
// Export all types
export * from './types';
import { supabase } from '@/integrations/supabase/client';
import {
  UserFilters,
  PaginationParams,
  UsersResponse,
  DeleteUserResponse,
  UserStats,
  UserData,
  PaginationMeta,
} from './types';

/**
 * Fetch users with filtering and pagination
 * 
 * @param paginationParams - Page and pageSize
 * @param filters - Optional filters (search, date range, city, gender, etc.)
 * @returns UsersResponse with users and pagination metadata
 */
export const fetchUsers = async (
  paginationParams: PaginationParams,
  filters?: UserFilters
): Promise<UsersResponse> => {
  try {
    const { page, pageSize } = paginationParams;
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    // Build the base query
    let query = supabase
      .from('user_data')
      .select('*', { count: 'exact' });

    // Apply search filter (global search across multiple fields)
    if (filters?.searchTerm && filters.searchTerm.trim()) {
      const searchTerm = filters.searchTerm.trim();
      query = query.or(
        `user_name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%,user_id.ilike.%${searchTerm}%,mobile_number.ilike.%${searchTerm}%`
      );
    }

    // Apply date range filters (last_used)
    if (filters?.dateFrom) {
      query = query.gte('last_used', filters.dateFrom);
    }
    if (filters?.dateTo) {
      query = query.lte('last_used', filters.dateTo);
    }

    // Apply anonymous filter
    if (filters?.isAnonymous !== null && filters?.isAnonymous !== undefined) {
      const anonymousValue = filters.isAnonymous ? 'TRUE' : 'FALSE';
      query = query.eq('is_anonymous', anonymousValue);
    }

    // Apply city filter
    if (filters?.city) {
      query = query.eq('city', filters.city);
    }

    // Apply gender filter
    if (filters?.gender) {
      query = query.eq('gender', filters.gender);
    }

    // Apply summary generation range filters
    if (filters?.minSummaryGeneration !== null && filters?.minSummaryGeneration !== undefined) {
      query = query.gte('total_summary_generation', filters.minSummaryGeneration);
    }
    if (filters?.maxSummaryGeneration !== null && filters?.maxSummaryGeneration !== undefined) {
      query = query.lte('total_summary_generation', filters.maxSummaryGeneration);
    }

    // Apply paid generation range filters
    if (filters?.minPaidGeneration !== null && filters?.minPaidGeneration !== undefined) {
      query = query.gte('total_paid_generation', filters.minPaidGeneration);
    }
    if (filters?.maxPaidGeneration !== null && filters?.maxPaidGeneration !== undefined) {
      query = query.lte('total_paid_generation', filters.maxPaidGeneration);
    }

    // Apply pagination and ordering
    query = query
      .range(from, to)
      .order('last_used', { ascending: false, nullsFirst: false });

    // Execute query
    const { data, error, count } = await query;

    if (error) {
      console.error('Error fetching users:', error);
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
        users: (data as UserData[]) || [],
        pagination: paginationMeta,
      },
      error: null,
    };
  } catch (error: any) {
    console.error('Unexpected error in fetchUsers:', error);
    return {
      success: false,
      data: null,
      error: error?.message || 'An unexpected error occurred',
    };
  }
};

/**
 * Delete a user by user_id
 * 
 * @param userId - The user_id to delete
 * @returns DeleteUserResponse with success status
 */
export const deleteUser = async (userId: string): Promise<DeleteUserResponse> => {
  try {
    console.log('🗑️ Starting cascade delete for user:', userId);
    
    // Step 1: Delete related records in summary_question_answer table
    console.log('📝 Deleting question answers...');
    const { error: questionError, count: questionCount } = await supabase
      .from('summary_question_answer')
      .delete()
      .eq('user_id', userId);

    if (questionError) {
      console.error('❌ Error deleting question answer records:', questionError);
      return {
        success: false,
        message: null,
        error: `Failed to delete user's question answers: ${questionError.message}`,
      };
    }
    console.log('✅ Deleted question answers');

    // Step 2: Delete related records in summary_generation table (if any)
    console.log('📊 Deleting summary generation records...');
    const { error: summaryError } = await supabase
      .from('summary_generation')
      .delete()
      .eq('user_id', userId);

    if (summaryError) {
      console.error('❌ Error deleting summary_generation records:', summaryError);
      return {
        success: false,
        message: null,
        error: `Failed to delete user's summary records: ${summaryError.message}`,
      };
    }
    console.log('✅ Deleted summary generation records');

    // Step 3: Delete related records in transaction_details table (if any)
    console.log('💳 Deleting transaction records...');
    const { error: transactionError } = await supabase
      .from('transaction_details')
      .delete()
      .eq('user_id', userId);

    if (transactionError) {
      console.error('❌ Error deleting transaction_details records:', transactionError);
      return {
        success: false,
        message: null,
        error: `Failed to delete user's transaction records: ${transactionError.message}`,
      };
    }
    console.log('✅ Deleted transaction records');

    // Step 4: Finally, delete the user
    console.log('👤 Deleting user record...');
    const { error } = await supabase
      .from('user_data')
      .delete()
      .eq('user_id', userId);

    if (error) {
      console.error('❌ Error deleting user:', error);
      return {
        success: false,
        message: null,
        error: `Failed to delete user: ${error.message}. Please check foreign key constraints.`,
      };
    }
    
    console.log('✅ User deleted successfully!');
    console.log('🎉 Cascade delete completed for user:', userId);

    return {
      success: true,
      message: 'User and all related records deleted successfully',
      error: null,
    };
  } catch (error: any) {
    console.error('Unexpected error in deleteUser:', error);
    return {
      success: false,
      message: null,
      error: error?.message || 'An unexpected error occurred',
    };
  }
};

/**
 * Get user statistics for dashboard cards
 * 
 * @returns UserStats with aggregated statistics
 */
export const getUserStats = async (): Promise<UserStats> => {
  try {
    // Fetch all users to calculate statistics
    const { data, error } = await supabase
      .from('user_data')
      .select('is_anonymous, last_used, total_summary_generation, total_paid_generation');

    if (error) {
      console.error('Error fetching user stats:', error);
      return {
        totalUsers: 0,
        anonymousUsers: 0,
        activeUsers: 0,
        totalGenerations: 0,
      };
    }

    const totalUsers = data?.length || 0;
    // Count anonymous users - check for various possible values
    const anonymousUsers = data?.filter(user => {
      const anonymousValue = user.is_anonymous;
      return anonymousValue === 'TRUE' || 
             anonymousValue === 'true' || 
             anonymousValue === '1' || 
             anonymousValue === 1 ||
             (typeof anonymousValue === 'boolean' && anonymousValue === true);
    }).length || 0;
    
    console.log('📊 User Stats Debug:', {
      totalUsers,
      anonymousUsers,
      sampleUsers: data?.slice(0, 3).map(u => ({
        is_anonymous: u.is_anonymous,
        type: typeof u.is_anonymous
      }))
    });
    
    // Active users: users who have used the system in the last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const activeUsers = data?.filter(user => 
      user.last_used && new Date(user.last_used) >= thirtyDaysAgo
    ).length || 0;

    // Total generations (sum of all paid generations)
    const totalGenerations = data?.reduce((sum, user) => 
      sum + (user.total_paid_generation || 0), 0
    ) || 0;

    return {
      totalUsers,
      anonymousUsers,
      activeUsers,
      totalGenerations,
    };
  } catch (error) {
    console.error('Unexpected error in getUserStats:', error);
    return {
      totalUsers: 0,
      anonymousUsers: 0,
      activeUsers: 0,
      totalGenerations: 0,
    };
  }
};

/**
 * Example Usage:
 * 
 * // Fetch users
 * const result = await fetchUsers(
 *   { page: 1, pageSize: 20 },
 *   {
 *     searchTerm: 'john@example.com',
 *     dateFrom: '2025-01-01',
 *     dateTo: '2025-01-31',
 *     isAnonymous: false,
 *     city: 'Mumbai',
 *     gender: 'Male',
 *     minPaidGeneration: 1
 *   }
 * );
 * 
 * // Delete user
 * const deleteResult = await deleteUser('user_123');
 * 
 * // Get statistics
 * const stats = await getUserStats();
 */
