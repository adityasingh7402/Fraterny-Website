
import { supabase } from '@/integrations/supabase/client';
import { showError, showSuccess } from '@/utils/errorHandler';

/**
 * Resend verification email
 */
export const resendVerificationEmail = async (email: string): Promise<{success: boolean; error?: string}> => {
  try {
    // Get the current domain to use for the redirect URL
    const currentDomain = window.location.origin;
    
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email,
      options: {
        emailRedirectTo: `${currentDomain}/auth`
      }
    });
    
    if (error) {
      console.error('Error resending verification email:', error);
      showError(error, 'Failed to resend verification email');
      return { success: false, error: error.message };
    }
    
    showSuccess('Verification email sent! Please check your inbox and spam folder.');
    return { success: true };
  } catch (error: any) {
    console.error('Error in resendVerificationEmail:', error);
    showError(error, 'Failed to resend verification email');
    return { success: false, error: error.message };
  }
};
