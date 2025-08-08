
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
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/auth`
    }
  });
  
  if (error) {
    console.error('Error signing in with Google:', error);
    throw error;
  }
  
  return data;
};
