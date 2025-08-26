
import { supabase } from '@/integrations/supabase/client';
import { Session, User } from '@supabase/supabase-js';
import { toast } from 'sonner';

/**
 * Sign in with email and password
 */
export const signIn = async (email: string, password: string): Promise<{user: User | null, session: Session | null}> => {
  try {
    const { error, data } = await supabase.auth.signInWithPassword({ 
      email, 
      password
    });
    
    if (error) throw error;
    
    toast.success('Signed in successfully');
    return { 
      user: data.session?.user ?? null, 
      session: data.session 
    };
  } catch (error: any) {
    toast.error(error.message || 'Error signing in');
    throw error;
  }
};

export const signInWithGoogle = async () => {
  const currentUrl = window.location.href;
  const currentOrigin = window.location.origin;
  
  // If current URL contains 'quest' or 'quest-result', redirect back to the same page
  // Otherwise, redirect to the origin
  const redirectUrl = currentUrl.includes('quest') || currentUrl.includes('quest-result') ? currentUrl : currentOrigin;

  console.log('Current URL:', currentUrl);
  console.log('Using redirect URL:', redirectUrl);
  const cleanUrl = window.location.origin + window.location.pathname;

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: cleanUrl
    }
  });

  if (error) {
    console.error('Error signing in with Google:', error);
    throw error;
  }
  
  return data;
};
