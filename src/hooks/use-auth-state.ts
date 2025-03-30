
import { useState, useEffect } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Define admin emails in a separate array for easier management
const ADMIN_EMAILS = ['admin@example.com', 'malhotrayash1900@gmail.com']; 

/**
 * Hook to manage auth state with Supabase
 */
export function useAuthState() {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  // Initialize Supabase auth and set up listener
  useEffect(() => {
    // Set up auth state listener FIRST to catch all auth events
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, newSession) => {
      console.log('Auth state change event:', event);
      setSession(newSession);
      setUser(newSession?.user ?? null);
      
      // Check if this is an admin user
      if (newSession?.user?.email) {
        setIsAdmin(ADMIN_EMAILS.includes(newSession.user.email));
      } else {
        setIsAdmin(false);
      }
    });

    // THEN check for existing session
    const getInitialSession = async () => {
      try {
        setIsLoading(true);
        const { data: { session: initialSession } } = await supabase.auth.getSession();
        
        if (initialSession) {
          setSession(initialSession);
          setUser(initialSession.user);
          
          // Check initial admin status
          if (initialSession.user?.email) {
            setIsAdmin(ADMIN_EMAILS.includes(initialSession.user.email));
          }
        }
      } catch (error) {
        console.error('Error getting initial session:', error);
      } finally {
        setIsLoading(false);
      }
    };

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
