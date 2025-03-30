
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

/**
 * Sign out the current user
 */
export const signOut = async (): Promise<void> => {
  try {
    const { error } = await supabase.auth.signOut({
      scope: 'global' // Sign out from all devices
    });
    
    if (error) throw error;
    
    toast.success('Signed out successfully');
  } catch (error: any) {
    toast.error(error.message || 'Error signing out');
    throw error;
  }
};
