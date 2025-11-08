import { supabase } from '@/integrations/supabase/client';
import { AuthUsersResponse } from './types';

/**
 * Fetch all auth users via Supabase Edge Function
 * This function calls the get-auth-users edge function which uses admin API
 */
export const fetchAuthUsers = async (): Promise<AuthUsersResponse> => {
  try {
    const { data, error } = await supabase.functions.invoke('get-auth-users', {
      method: 'POST',
    });

    if (error) {
      console.error('Error invoking get-auth-users function:', error);
      return {
        success: false,
        error: error.message || 'Failed to fetch auth users',
      };
    }

    if (!data.success) {
      return {
        success: false,
        error: data.error || 'Failed to fetch auth users',
      };
    }

    return {
      success: true,
      users: data.users || [],
      total: data.total || 0,
    };
  } catch (err: any) {
    console.error('Error fetching auth users:', err);
    return {
      success: false,
      error: err.message || 'An unexpected error occurred',
    };
  }
};

export * from './types';
