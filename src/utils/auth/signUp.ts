
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

/**
 * Sign up with email and password
 */
export const signUp = async (
  email: string, 
  password: string, 
  firstName?: string, 
  lastName?: string, 
  mobileNumber?: string
): Promise<{success: boolean; error?: string; emailConfirmationSent: boolean}> => {
  try {
    // Get the current domain to use for the redirect URL
    const currentDomain = window.location.origin;
    console.log('Current domain for redirect:', currentDomain);
    
    // Format the phone number properly with country code for E.164 format
    let formattedPhone = null;
    if (mobileNumber && mobileNumber.trim()) {
      formattedPhone = mobileNumber.trim();
      // Ensure it starts with +
      if (!formattedPhone.startsWith('+')) {
        formattedPhone = `+${formattedPhone}`;
      }
      console.log('Formatted phone for Supabase:', formattedPhone);
    }
    
    const signUpData: any = {
      email,
      password,
      options: {
        data: {
          first_name: firstName,
          last_name: lastName,
        },
        emailRedirectTo: `${currentDomain}/auth`
      }
    };

    // Only add phone if it's provided and valid
    if (formattedPhone) {
      // Add phone as a top-level property
      signUpData.phone = formattedPhone;
      
      // Also include phone in user metadata
      signUpData.options.data.phone = formattedPhone;
    }
    
    console.log('Full signup data being sent:', JSON.stringify(signUpData, null, 2));
    
    const { error, data } = await supabase.auth.signUp(signUpData);

    if (error) {
      // Handle specific error for existing user
      if (error.message.includes('User already registered')) {
        toast.error('An account with this email address already exists. Please sign in instead.');
        return { success: false, error: 'User already registered', emailConfirmationSent: false };
      }
      
      // Handle other errors
      toast.error(error.message || 'Error signing up');
      return { success: false, error: error.message, emailConfirmationSent: false };
    }
    
    // Check for autoconfirm (no email verification needed)
    if (data?.user && !data.user.email_confirmed_at) {
      console.log('User created, email confirmation required');
      return { success: true, emailConfirmationSent: true };
    } else {
      // User was auto-confirmed (email confirmation was disabled in Supabase settings)
      console.log('User created and auto-confirmed');
      toast.success('Signed up successfully!');
      return { success: true, emailConfirmationSent: false };
    }
  } catch (error: any) {
    console.error('Error in signUp:', error);
    toast.error(error.message || 'Error signing up');
    return { success: false, error: error.message, emailConfirmationSent: false };
  }
};
