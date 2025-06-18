import { useState, useEffect } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Define admin emails in a separate array for easier management
const ADMIN_EMAILS = ['malhotrayash1900@gmail.com']; 

/**
 * Hook to manage auth state with Supabase - Non-blocking version
 */
export function useAuthState() {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false); // Start as not loading
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Get initial session from cache first (non-blocking)
    const getInitialSessionFromCache = () => {
      try {
        // Check localStorage for cached session
        const cachedSession = localStorage.getItem('supabase.auth.token');
        if (cachedSession) {
          const parsedSession = JSON.parse(cachedSession);
          if (parsedSession?.access_token) {
            // Use cached session immediately
            setSession(parsedSession);
            setUser(parsedSession.user);
            setIsAdmin(parsedSession.user?.email ? ADMIN_EMAILS.includes(parsedSession.user.email) : false);
            return true;
          }
        }
      } catch (error) {
        console.warn('Error reading cached session:', error);
      }
      return false;
    };

    // Try to get session from cache first
    const hasCachedSession = getInitialSessionFromCache();

    // Set up auth state listener for future changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, newSession) => {
      console.log('Auth state change event:', event);
      setSession(newSession);
      setUser(newSession?.user ?? null);
      setIsAdmin(newSession?.user?.email ? ADMIN_EMAILS.includes(newSession.user.email) : false);
    });

    // Only fetch from server if no cached session
    if (!hasCachedSession) {
      // Defer server call to not block initial render
      const fetchSessionTimeout = setTimeout(async () => {
        setIsLoading(true);
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
      }, 200); // Small delay to ensure UI renders first

      return () => {
        clearTimeout(fetchSessionTimeout);
        subscription.unsubscribe();
      };
    }

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
