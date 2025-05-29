import { useState, useEffect } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Define admin emails in a separate array for easier management
const ADMIN_EMAILS = ['malhotrayash1900@gmail.com']; 

/**
 * Hook to manage auth state with Supabase
 */
export function useAuthState() {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Get initial session first
    const getInitialSession = async () => {
      try {
        const { data: { session: initialSession } } = await supabase.auth.getSession();
        if (initialSession) {
          setSession(initialSession);
          setUser(initialSession.user);
          setIsAdmin(initialSession.user?.email ? ADMIN_EMAILS.includes(initialSession.user.email) : false);
        }
      } catch (error) {
        console.error('Error getting initial session:', error);
      } finally {
        setIsLoading(false);
      }
    };

    // Set up auth state listener for future changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, newSession) => {
      console.log('Auth state change event:', event);
      setSession(newSession);
      setUser(newSession?.user ?? null);
      setIsAdmin(newSession?.user?.email ? ADMIN_EMAILS.includes(newSession.user.email) : false);
    });

    // Get initial session
    getInitialSession();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return {
    user,
    session,
    isLoading,
    isAdmin
  };
}
