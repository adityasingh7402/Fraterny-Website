
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

    // Note: Exclusion filter will be applied after data fetch using JavaScript filtering

    // Apply date range filters (last_used)
    if (filters?.dateFrom) {
      query = query.gte('last_used', filters.dateFrom);
    }
    if (filters?.dateTo) {
      query = query.lte('last_used', filters.dateTo);
    }

    // Apply anonymous filter
    if (filters?.isAnonymous !== null && filters?.isAnonymous !== undefined) {
      const anonymousValue = filters.isAnonymous; // Use boolean directly
      console.log(`🔍 Anonymous filter: isAnonymous=${filters.isAnonymous} -> searching for boolean '${anonymousValue}'`);
      query = query.eq('is_anonymous', anonymousValue);
    }

    // Apply gender filter
    if (filters?.gender) {
      query = query.eq('gender', filters.gender);
    }

    // Apply age range filters (calculate age from dob)
    if (filters?.ageFrom !== null && filters?.ageFrom !== undefined) {
      const currentDate = new Date();
      const maxBirthYear = currentDate.getFullYear() - filters.ageFrom;
      const maxBirthDate = `${maxBirthYear}-12-31`;
      query = query.lte('dob', maxBirthDate);
    }
    if (filters?.ageTo !== null && filters?.ageTo !== undefined) {
      const currentDate = new Date();
      const minBirthYear = currentDate.getFullYear() - filters.ageTo;
      const minBirthDate = `${minBirthYear}-01-01`;
      query = query.gte('dob', minBirthDate);
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
    // If exclusion filter is used, we need to fetch more records to account for filtering
    if (filters?.excludeTerm && filters.excludeTerm.trim()) {
      // Fetch all records without pagination when exclude filter is applied
      query = query.order('last_used', { ascending: false, nullsFirst: false });
    } else {
      // Normal pagination when no exclude filter
      query = query
        .range(from, to)
        .order('last_used', { ascending: false, nullsFirst: false });
    }

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

    // Apply exclusion filter using JavaScript (post-query filtering)
    let filteredData = data as UserData[];
    let totalFilteredRecords = count || 0;
    
    if (filters?.excludeTerm && filters.excludeTerm.trim() && filteredData) {
      const excludeTerm = filters.excludeTerm.trim().toLowerCase();
      filteredData = filteredData.filter(user => {
        const userName = (user.user_name || '').toLowerCase();
        const email = (user.email || '').toLowerCase();
        const userId = (user.user_id || '').toLowerCase();
        const mobile = (user.mobile_number || '').toLowerCase();
        
        // Exclude if ANY field contains the exclude term
        return !(userName.includes(excludeTerm) || 
                email.includes(excludeTerm) || 
                userId.includes(excludeTerm) || 
                mobile.includes(excludeTerm));
      });
      
      // When exclude filter is applied, we need to paginate the filtered results
      totalFilteredRecords = filteredData.length;
      const startIndex = (page - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      filteredData = filteredData.slice(startIndex, endIndex);
    }

    // Calculate pagination metadata
    const totalPages = Math.ceil(totalFilteredRecords / pageSize);

    const paginationMeta: PaginationMeta = {
      currentPage: page,
      pageSize,
      totalRecords: totalFilteredRecords,
      totalPages,
    };

    // Calculate filtered statistics from ALL filtered data (not just current page)
    // We need to get all filtered data for accurate statistics, regardless of pagination
    let completeFilteredData: UserData[];
    
    if (filters && (filters.searchTerm || filters.excludeTerm || filters.dateFrom || filters.dateTo || 
        filters.isAnonymous !== null || filters.gender || filters.ageFrom || filters.ageTo)) {
      // If filters are applied, we need to get ALL matching records for accurate statistics
      // Create a new query without pagination to get complete filtered dataset
      let statsQuery = supabase
        .from('user_data')
        .select('*');

      // Apply the same filters as the main query
      if (filters.searchTerm && filters.searchTerm.trim()) {
        const searchTerm = filters.searchTerm.trim();
        statsQuery = statsQuery.or(
          `user_name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%,user_id.ilike.%${searchTerm}%,mobile_number.ilike.%${searchTerm}%`
        );
      }

      if (filters.dateFrom) {
        statsQuery = statsQuery.gte('last_used', filters.dateFrom);
      }
      if (filters.dateTo) {
        statsQuery = statsQuery.lte('last_used', filters.dateTo);
      }

      if (filters.isAnonymous !== null && filters.isAnonymous !== undefined) {
        const anonymousValue = filters.isAnonymous; // Use boolean directly
        statsQuery = statsQuery.eq('is_anonymous', anonymousValue);
      }

      if (filters.gender) {
        statsQuery = statsQuery.eq('gender', filters.gender);
      }

      if (filters.ageFrom !== null && filters.ageFrom !== undefined) {
        const currentDate = new Date();
        const maxBirthYear = currentDate.getFullYear() - filters.ageFrom;
        const maxBirthDate = `${maxBirthYear}-12-31`;
        statsQuery = statsQuery.lte('dob', maxBirthDate);
      }
      if (filters.ageTo !== null && filters.ageTo !== undefined) {
        const currentDate = new Date();
        const minBirthYear = currentDate.getFullYear() - filters.ageTo;
        const minBirthDate = `${minBirthYear}-01-01`;
        statsQuery = statsQuery.gte('dob', minBirthDate);
      }

      statsQuery = statsQuery.order('last_used', { ascending: false, nullsFirst: false });

      const { data: allFilteredData } = await statsQuery;
      completeFilteredData = allFilteredData as UserData[] || [];

      // Apply exclusion filter if needed
      if (filters.excludeTerm && filters.excludeTerm.trim()) {
        const excludeTerm = filters.excludeTerm.trim().toLowerCase();
        completeFilteredData = completeFilteredData.filter(user => {
          const userName = (user.user_name || '').toLowerCase();
          const email = (user.email || '').toLowerCase();
          const userId = (user.user_id || '').toLowerCase();
          const mobile = (user.mobile_number || '').toLowerCase();
          
          return !(userName.includes(excludeTerm) || 
                  email.includes(excludeTerm) || 
                  userId.includes(excludeTerm) || 
                  mobile.includes(excludeTerm));
        });
      }
    } else {
      // No filters applied, use the paginated data (which will be just current page)
      completeFilteredData = data as UserData[];
    }

    // Calculate filtered statistics
    const filteredStats = {
      totalUsers: completeFilteredData.length,
      anonymousUsers: completeFilteredData.filter(user => {
        const anonymousValue = user.is_anonymous;
        return anonymousValue === 'TRUE' || 
               anonymousValue === 'true' || 
               anonymousValue === '1' || 
               anonymousValue === 1 ||
               (typeof anonymousValue === 'boolean' && anonymousValue === true);
      }).length,
      activeUsers: (() => {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        return completeFilteredData.filter(user => 
          user.last_used && new Date(user.last_used) >= thirtyDaysAgo
        ).length;
      })(),
      totalGenerations: completeFilteredData.reduce((sum, user) => 
        sum + (user.total_paid_generation || 0), 0
      )
    };

    return {
      success: true,
      data: {
        users: filteredData || [],
        pagination: paginationMeta,
        // Only include filtered stats if filters are actually applied
        ...(filters && (filters.searchTerm || filters.excludeTerm || filters.dateFrom || filters.dateTo || 
            filters.isAnonymous !== null || filters.gender || filters.ageFrom || filters.ageTo) 
            ? { filteredStats } : {}),
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
 * Delete multiple users by their user_ids
 * 
 * @param userIds - Array of user_ids to delete
 * @returns DeleteUserResponse with success status
 */
export const deleteUsers = async (userIds: string[]): Promise<DeleteUserResponse> => {
  try {
    console.log('🗑️ Starting bulk cascade delete for users:', userIds);
    
    if (userIds.length === 0) {
      return {
        success: false,
        message: null,
        error: 'No users selected for deletion',
      };
    }
    
    // Step 1: Delete related records in summary_question_answer table for all users
    console.log('📝 Deleting question answers for all users...');
    const { error: questionError } = await supabase
      .from('summary_question_answer')
      .delete()
      .in('user_id', userIds);

    if (questionError) {
      console.error('❌ Error deleting question answer records:', questionError);
      return {
        success: false,
        message: null,
        error: `Failed to delete users' question answers: ${questionError.message}`,
      };
    }
    console.log('✅ Deleted question answers for all users');

    // Step 2: Delete related records in summary_generation table for all users
    console.log('📊 Deleting summary generation records for all users...');
    const { error: summaryError } = await supabase
      .from('summary_generation')
      .delete()
      .in('user_id', userIds);

    if (summaryError) {
      console.error('❌ Error deleting summary_generation records:', summaryError);
      return {
        success: false,
        message: null,
        error: `Failed to delete users' summary records: ${summaryError.message}`,
      };
    }
    console.log('✅ Deleted summary generation records for all users');

    // Step 3: Delete related records in transaction_details table for all users
    console.log('💳 Deleting transaction records for all users...');
    const { error: transactionError } = await supabase
      .from('transaction_details')
      .delete()
      .in('user_id', userIds);

    if (transactionError) {
      console.error('❌ Error deleting transaction_details records:', transactionError);
      return {
        success: false,
        message: null,
        error: `Failed to delete users' transaction records: ${transactionError.message}`,
      };
    }
    console.log('✅ Deleted transaction records for all users');

    // Step 4: Finally, delete all the users
    console.log('👥 Deleting user records...');
    const { error } = await supabase
      .from('user_data')
      .delete()
      .in('user_id', userIds);

    if (error) {
      console.error('❌ Error deleting users:', error);
      return {
        success: false,
        message: null,
        error: `Failed to delete users: ${error.message}. Please check foreign key constraints.`,
      };
    }
    
    console.log('✅ Users deleted successfully!');
    console.log('🎉 Bulk cascade delete completed for users:', userIds);

    return {
      success: true,
      message: `${userIds.length} users and all related records deleted successfully`,
      error: null,
    };
  } catch (error: any) {
    console.error('Unexpected error in deleteUsers:', error);
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
 * Fetch users with duplicate detection - returns only primary users from each duplicate group
 */
export const fetchUsersWithDuplicateDetection = async (
  paginationParams: PaginationParams,
  filters?: UserFilters
): Promise<UsersResponse> => {
  try {
    // First, get all duplicate groups
    const duplicateGroups = await detectDuplicateGroups();
    const duplicateGroupsMap = new Map();
    
    // Create a map of primary user IDs for each group
    duplicateGroups.forEach(group => {
      group.users.forEach((user, index) => {
        duplicateGroupsMap.set(user.user_id, {
          isPrimary: index === 0, // First user is primary
          groupKey: group.groupKey,
          duplicateCount: group.users.length
        });
      });
    });

    // Get regular users response
    const response = await fetchUsers(paginationParams, filters);
    
    if (!response.success || !response.data) {
      return response;
    }

    // Filter to show only primary users and add duplicate info
    const usersWithDuplicateInfo = response.data.users.map(user => {
      const duplicateInfo = duplicateGroupsMap.get(user.user_id);
      return {
        ...user,
        isDuplicateGroup: duplicateInfo ? duplicateInfo.duplicateCount > 1 : false,
        duplicateCount: duplicateInfo?.duplicateCount || 1,
        isPrimary: duplicateInfo?.isPrimary ?? true,
        groupKey: duplicateInfo?.groupKey
      };
    }).filter(user => user.isPrimary); // Only show primary users

    return {
      ...response,
      data: {
        ...response.data,
        users: usersWithDuplicateInfo
      }
    };
  } catch (error: any) {
    console.error('Error in fetchUsersWithDuplicateDetection:', error);
    return await fetchUsers(paginationParams, filters); // Fallback to regular fetch
  }
};

/**
 * Detect duplicate user groups based on email and IP address
 */
export const detectDuplicateGroups = async (): Promise<DuplicateGroup[]> => {
  try {
    // Get all users with their IP addresses from summary_generation
    const { data: usersData, error: usersError } = await supabase
      .from('user_data')
      .select('*');

    if (usersError) {
      console.error('Error fetching users for duplicate detection:', usersError);
      return [];
    }

    // Get IP addresses from summary_generation for each user
    const { data: ipData, error: ipError } = await supabase
      .from('summary_generation')
      .select('user_id, ip_address, device_fingerprint')
      .not('ip_address', 'is', null);

    if (ipError) {
      console.error('Error fetching IP data:', ipError);
      return [];
    }

    // Create a map of user_id to IP info
    const userIpMap = new Map();
    ipData?.forEach(record => {
      if (!userIpMap.has(record.user_id)) {
        userIpMap.set(record.user_id, {
          ip_address: record.ip_address,
          device_fingerprint: record.device_fingerprint
        });
      }
    });

    // Group users by email or IP+device fingerprint
    const groups = new Map<string, UserData[]>();
    
    usersData?.forEach(user => {
      let groupKey = '';
      
      // Group by IP address and device fingerprint only
      const ipInfo = userIpMap.get(user.user_id);
      if (ipInfo?.ip_address) {
        groupKey = `ip:${ipInfo.ip_address}:${ipInfo.device_fingerprint || 'unknown'}`;
      } else {
        groupKey = `unique:${user.user_id}`; // Unique user (no IP data)
      }
      
      if (!groups.has(groupKey)) {
        groups.set(groupKey, []);
      }
      groups.get(groupKey)!.push(user);
    });

    // Convert to DuplicateGroup format and filter groups with multiple users
    const duplicateGroups: DuplicateGroup[] = [];
    
    groups.forEach((users, groupKey) => {
      if (users.length > 1) {
        // Sort users to determine primary (registered > anonymous, more paid gens, more recent)
        const sortedUsers = users.sort((a, b) => {
          // Registered users over anonymous (false = registered, true = anonymous)
          if (a.is_anonymous !== b.is_anonymous) {
            return a.is_anonymous === false ? -1 : 1;
          }
          
          // More paid generations
          const aPaidGens = a.total_paid_generation || 0;
          const bPaidGens = b.total_paid_generation || 0;
          if (aPaidGens !== bPaidGens) {
            return bPaidGens - aPaidGens;
          }
          
          // More total generations
          const aTotalGens = a.total_summary_generation || 0;
          const bTotalGens = b.total_summary_generation || 0;
          if (aTotalGens !== bTotalGens) {
            return bTotalGens - aTotalGens;
          }
          
          // More recent activity
          const aLastUsed = a.last_used ? new Date(a.last_used).getTime() : 0;
          const bLastUsed = b.last_used ? new Date(b.last_used).getTime() : 0;
          return bLastUsed - aLastUsed;
        });

        duplicateGroups.push({
          groupKey,
          users: sortedUsers,
          primaryUser: sortedUsers[0],
          duplicateUsers: sortedUsers.slice(1)
        });
      }
    });

    return duplicateGroups;
  } catch (error: any) {
    console.error('Error in detectDuplicateGroups:', error);
    return [];
  }
};

/**
 * Get all users in a specific duplicate group
 */
export const getDuplicateGroupUsers = async (groupKey: string): Promise<DuplicateGroup | null> => {
  try {
    const allGroups = await detectDuplicateGroups();
    return allGroups.find(group => group.groupKey === groupKey) || null;
  } catch (error: any) {
    console.error('Error in getDuplicateGroupUsers:', error);
    return null;
  }
};

/**
 * Merge duplicate users into the primary user
 */
export const mergeDuplicateUsers = async (groupKey: string): Promise<DeleteUserResponse> => {
  try {
    console.log('🔄 Starting merge process for group:', groupKey);
    
    const duplicateGroup = await getDuplicateGroupUsers(groupKey);
    if (!duplicateGroup || duplicateGroup.users.length < 2) {
      return {
        success: false,
        message: null,
        error: 'No duplicate group found or insufficient duplicates'
      };
    }

    const primaryUser = duplicateGroup.primaryUser;
    const duplicateUsers = duplicateGroup.duplicateUsers;
    
    console.log('👑 Primary user:', primaryUser.user_id);
    console.log('🔄 Duplicates to merge:', duplicateUsers.map(u => u.user_id));

    // Step 1: Calculate merged data
    const totalSummaryGeneration = duplicateGroup.users.reduce(
      (sum, user) => sum + (user.total_summary_generation || 0), 0
    );
    const totalPaidGeneration = duplicateGroup.users.reduce(
      (sum, user) => sum + (user.total_paid_generation || 0), 0
    );
    
    // Find the most recent last_used date
    const mostRecentDate = duplicateGroup.users.reduce((latest, user) => {
      if (!user.last_used) return latest;
      const userDate = new Date(user.last_used);
      return !latest || userDate > latest ? userDate : latest;
    }, null as Date | null);

    // Merge profile data (fill missing fields from duplicates)
    const mergedUserData = {
      user_name: primaryUser.user_name || duplicateUsers.find(u => u.user_name && u.user_name !== 'None')?.user_name || primaryUser.user_name,
      email: primaryUser.email || duplicateUsers.find(u => u.email && u.email !== 'None')?.email || primaryUser.email,
      mobile_number: primaryUser.mobile_number || duplicateUsers.find(u => u.mobile_number)?.mobile_number,
      city: primaryUser.city || duplicateUsers.find(u => u.city)?.city,
      gender: primaryUser.gender || duplicateUsers.find(u => u.gender)?.gender,
      dob: primaryUser.dob || duplicateUsers.find(u => u.dob)?.dob,
      total_summary_generation: totalSummaryGeneration,
      total_paid_generation: totalPaidGeneration,
      last_used: mostRecentDate?.toISOString() || primaryUser.last_used
    };

    // Step 2: Update related records to point to primary user
    for (const duplicateUser of duplicateUsers) {
      console.log(`🔄 Updating references for user: ${duplicateUser.user_id}`);
      
      // Update summary_question_answer records (this was missing!)
      const { error: questionAnswerError } = await supabase
        .from('summary_question_answer')
        .update({ user_id: primaryUser.user_id })
        .eq('user_id', duplicateUser.user_id);
      
      if (questionAnswerError) {
        console.error('❌ Error updating summary_question_answer:', questionAnswerError);
        return {
          success: false,
          message: null,
          error: `Failed to update question answer records: ${questionAnswerError.message}`
        };
      }
      
      // Update summary_generation records
      const { error: summaryError } = await supabase
        .from('summary_generation')
        .update({ user_id: primaryUser.user_id })
        .eq('user_id', duplicateUser.user_id);
      
      if (summaryError) {
        console.error('❌ Error updating summary_generation:', summaryError);
        return {
          success: false,
          message: null,
          error: `Failed to update summary records: ${summaryError.message}`
        };
      }

      // Update transaction_details records
      const { error: transactionError } = await supabase
        .from('transaction_details')
        .update({ user_id: primaryUser.user_id })
        .eq('user_id', duplicateUser.user_id);
      
      if (transactionError) {
        console.error('❌ Error updating transaction_details:', transactionError);
        return {
          success: false,
          message: null,
          error: `Failed to update transaction records: ${transactionError.message}`
        };
      }

      // Update user_session_history if it exists
      const { error: sessionError } = await supabase
        .from('user_session_history')
        .update({ user_id: primaryUser.user_id })
        .eq('user_id', duplicateUser.user_id);
      
      if (sessionError && !sessionError.message.includes('does not exist')) {
        console.error('❌ Error updating user_session_history:', sessionError);
        // Don't fail the merge for this, as the table might not exist
      }
    }

    // Step 3: Update the primary user with merged data
    console.log('📝 Updating primary user with merged data');
    const { error: updateError } = await supabase
      .from('user_data')
      .update(mergedUserData)
      .eq('user_id', primaryUser.user_id);
    
    if (updateError) {
      console.error('❌ Error updating primary user:', updateError);
      return {
        success: false,
        message: null,
        error: `Failed to update primary user: ${updateError.message}`
      };
    }

    // Step 4: Delete duplicate user records
    console.log('🗑️ Deleting duplicate user records');
    for (const duplicateUser of duplicateUsers) {
      const { error: deleteError } = await supabase
        .from('user_data')
        .delete()
        .eq('user_id', duplicateUser.user_id);
      
      if (deleteError) {
        console.error('❌ Error deleting duplicate user:', deleteError);
        return {
          success: false,
          message: null,
          error: `Failed to delete duplicate user: ${deleteError.message}`
        };
      }
    }

    console.log('✅ Merge completed successfully!');
    console.log(`📊 Merged ${duplicateUsers.length} duplicate(s) into primary user: ${primaryUser.user_id}`);
    
    return {
      success: true,
      message: `Successfully merged ${duplicateUsers.length} duplicate users. New totals: ${totalSummaryGeneration} total generations, ${totalPaidGeneration} paid generations.`,
      error: null
    };
  } catch (error: any) {
    console.error('❌ Error in mergeDuplicateUsers:', error);
    return {
      success: false,
      message: null,
      error: error?.message || 'An unexpected error occurred during merge'
    };
  }
};

/**
 * Get total unique users count after duplicate detection (across all data)
 */
export const getTotalUniqueUsersCount = async (): Promise<number> => {
  try {
    // Get all duplicate groups
    const duplicateGroups = await detectDuplicateGroups();
    
    // Get all users
    const { data: usersData, error: usersError } = await supabase
      .from('user_data')
      .select('user_id');

    if (usersError) {
      console.error('Error fetching users for unique count:', usersError);
      return 0;
    }

    const totalUsers = usersData?.length || 0;
    
    // Calculate total duplicate users (not counting primary users)
    const totalDuplicateUsers = duplicateGroups.reduce((sum, group) => {
      return sum + group.duplicateUsers.length; // Only count duplicates, not primary
    }, 0);
    
    // Unique users = Total users - Duplicate users
    const uniqueUsersCount = totalUsers - totalDuplicateUsers;
    
    console.log('📊 Unique Users Calculation:', {
      totalUsers,
      totalDuplicateUsers,
      uniqueUsersCount,
      duplicateGroupsCount: duplicateGroups.length
    });
    
    return uniqueUsersCount;
  } catch (error: any) {
    console.error('Error calculating unique users count:', error);
    return 0;
  }
};

/**
 * Merge duplicate users with a custom primary user (manually selected)
 */
export const mergeDuplicateUsersWithCustomPrimary = async (
  groupKey: string, 
  primaryUserId: string
): Promise<DeleteUserResponse> => {
  try {
    console.log('🔄 Starting custom merge process for group:', groupKey, 'with primary:', primaryUserId);
    
    const duplicateGroup = await getDuplicateGroupUsers(groupKey);
    if (!duplicateGroup || duplicateGroup.users.length < 2) {
      return {
        success: false,
        message: null,
        error: 'No duplicate group found or insufficient duplicates'
      };
    }

    // Find the custom primary user
    const customPrimaryUser = duplicateGroup.users.find(u => u.user_id === primaryUserId);
    if (!customPrimaryUser) {
      return {
        success: false,
        message: null,
        error: 'Selected primary user not found in duplicate group'
      };
    }

    // Create new group structure with custom primary
    const customDuplicateUsers = duplicateGroup.users.filter(u => u.user_id !== primaryUserId);
    
    console.log('👑 Custom primary user:', customPrimaryUser.user_id);
    console.log('🔄 Duplicates to merge:', customDuplicateUsers.map(u => u.user_id));

    // Step 1: Calculate merged data
    const totalSummaryGeneration = duplicateGroup.users.reduce(
      (sum, user) => sum + (user.total_summary_generation || 0), 0
    );
    const totalPaidGeneration = duplicateGroup.users.reduce(
      (sum, user) => sum + (user.total_paid_generation || 0), 0
    );
    
    // Find the most recent last_used date
    const mostRecentDate = duplicateGroup.users.reduce((latest, user) => {
      if (!user.last_used) return latest;
      const userDate = new Date(user.last_used);
      return !latest || userDate > latest ? userDate : latest;
    }, null as Date | null);

    // Merge profile data (fill missing fields from duplicates)
    const mergedUserData = {
      user_name: customPrimaryUser.user_name || customDuplicateUsers.find(u => u.user_name && u.user_name !== 'None')?.user_name || customPrimaryUser.user_name,
      email: customPrimaryUser.email || customDuplicateUsers.find(u => u.email && u.email !== 'None')?.email || customPrimaryUser.email,
      mobile_number: customPrimaryUser.mobile_number || customDuplicateUsers.find(u => u.mobile_number)?.mobile_number,
      city: customPrimaryUser.city || customDuplicateUsers.find(u => u.city)?.city,
      gender: customPrimaryUser.gender || customDuplicateUsers.find(u => u.gender)?.gender,
      dob: customPrimaryUser.dob || customDuplicateUsers.find(u => u.dob)?.dob,
      total_summary_generation: totalSummaryGeneration,
      total_paid_generation: totalPaidGeneration,
      last_used: mostRecentDate?.toISOString() || customPrimaryUser.last_used
    };

    // Step 2: Update related records to point to custom primary user
    for (const duplicateUser of customDuplicateUsers) {
      console.log(`🔄 Updating references for user: ${duplicateUser.user_id}`);
      
      // Update summary_question_answer records
      const { error: questionAnswerError } = await supabase
        .from('summary_question_answer')
        .update({ user_id: customPrimaryUser.user_id })
        .eq('user_id', duplicateUser.user_id);
      
      if (questionAnswerError) {
        console.error('❌ Error updating summary_question_answer:', questionAnswerError);
        return {
          success: false,
          message: null,
          error: `Failed to update question answer records: ${questionAnswerError.message}`
        };
      }
      
      // Update summary_generation records
      const { error: summaryError } = await supabase
        .from('summary_generation')
        .update({ user_id: customPrimaryUser.user_id })
        .eq('user_id', duplicateUser.user_id);
      
      if (summaryError) {
        console.error('❌ Error updating summary_generation:', summaryError);
        return {
          success: false,
          message: null,
          error: `Failed to update summary records: ${summaryError.message}`
        };
      }

      // Update transaction_details records
      const { error: transactionError } = await supabase
        .from('transaction_details')
        .update({ user_id: customPrimaryUser.user_id })
        .eq('user_id', duplicateUser.user_id);
      
      if (transactionError) {
        console.error('❌ Error updating transaction_details:', transactionError);
        return {
          success: false,
          message: null,
          error: `Failed to update transaction records: ${transactionError.message}`
        };
      }

      // Update user_session_history if it exists
      const { error: sessionError } = await supabase
        .from('user_session_history')
        .update({ user_id: customPrimaryUser.user_id })
        .eq('user_id', duplicateUser.user_id);
      
      if (sessionError && !sessionError.message.includes('does not exist')) {
        console.error('❌ Error updating user_session_history:', sessionError);
        // Don't fail the merge for this, as the table might not exist
      }
    }

    // Step 3: Update the custom primary user with merged data
    console.log('📝 Updating custom primary user with merged data');
    const { error: updateError } = await supabase
      .from('user_data')
      .update(mergedUserData)
      .eq('user_id', customPrimaryUser.user_id);
    
    if (updateError) {
      console.error('❌ Error updating custom primary user:', updateError);
      return {
        success: false,
        message: null,
        error: `Failed to update primary user: ${updateError.message}`
      };
    }

    // Step 4: Delete duplicate user records
    console.log('🗑️ Deleting duplicate user records');
    for (const duplicateUser of customDuplicateUsers) {
      const { error: deleteError } = await supabase
        .from('user_data')
        .delete()
        .eq('user_id', duplicateUser.user_id);
      
      if (deleteError) {
        console.error('❌ Error deleting duplicate user:', deleteError);
        return {
          success: false,
          message: null,
          error: `Failed to delete duplicate user: ${deleteError.message}`
        };
      }
    }

    console.log('✅ Custom merge completed successfully!');
    console.log(`📊 Merged ${customDuplicateUsers.length} duplicate(s) into custom primary user: ${customPrimaryUser.user_id}`);
    
    return {
      success: true,
      message: `Successfully merged ${customDuplicateUsers.length} duplicate users into selected primary. New totals: ${totalSummaryGeneration} total generations, ${totalPaidGeneration} paid generations.`,
      error: null
    };
  } catch (error: any) {
    console.error('❌ Error in mergeDuplicateUsersWithCustomPrimary:', error);
    return {
      success: false,
      message: null,
      error: error?.message || 'An unexpected error occurred during custom merge'
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
 * // Fetch users with duplicate detection
 * const dedupResult = await fetchUsersWithDuplicateDetection({ page: 1, pageSize: 20 });
 * 
 * // Get duplicate groups
 * const duplicateGroups = await detectDuplicateGroups();
 * 
 * // Merge duplicates
 * const mergeResult = await mergeDuplicateUsers('email:john@example.com');
 * 
 * // Delete user
 * const deleteResult = await deleteUser('user_123');
 * 
 * // Get statistics
 * const stats = await getUserStats();
 */
