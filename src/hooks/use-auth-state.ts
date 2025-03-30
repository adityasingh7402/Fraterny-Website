
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

  // Validate if the current session is still valid by checking if the user still exists
  const validateSession = async (currentSession: Session | null) => {
    if (!currentSession) return false;
    
    try {
      // Try to get user data to see if the user still exists
      const { data, error } = await supabase.auth.getUser(currentSession.access_token);
      
      if (error || !data.user) {
        console.warn('Session invalid or user was deleted:', error?.message);
        // Force sign out if user doesn't exist anymore
        await supabase.auth.signOut();
        toast.error('Your session is no longer valid. Please sign in again.');
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Error validating session:', error);
      return false;
    }
  };

  // Initialize Supabase auth and set up listener
  useEffect(() => {
    const initialize = async () => {
      setIsLoading(true);

      // Set up auth state listener FIRST to catch all auth events
      const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, newSession) => {
        console.log('Auth state change event:', event);
        
        // Update state immediately for all events to ensure UI reflects changes
        setSession(newSession);
        setUser(newSession?.user ?? null);
        
        // Check if this is an admin user
        if (newSession?.user?.email) {
          // Check if user email is in the admin emails list
          setIsAdmin(ADMIN_EMAILS.includes(newSession.user.email));
        } else {
          setIsAdmin(false);
        }
        
        // Special handling for SIGNED_IN events to ensure UI updates
        if (event === 'SIGNED_IN') {
          console.log('User signed in, updating auth state');
          // Force refresh user data to ensure we have the latest
          const { data: userData } = await supabase.auth.getUser();
          if (userData?.user) {
            setUser(userData.user);
            if (userData.user.email) {
              setIsAdmin(ADMIN_EMAILS.includes(userData.user.email));
            }
          }
        }
      });

      // THEN check for existing session
      const { data: { session: initialSession } } = await supabase.auth.getSession();
      
      // Validate if the session is still valid (user exists)
      const isValid = await validateSession(initialSession);
      
      if (isValid && initialSession) {
        setSession(initialSession);
        setUser(initialSession.user);
        
        // Check initial admin status
        if (initialSession.user?.email) {
          setIsAdmin(ADMIN_EMAILS.includes(initialSession.user.email));
        }
      } else if (initialSession) {
        // Session was found but invalid (user might have been deleted)
        await supabase.auth.signOut();
      }

      setIsLoading(false);
      return () => subscription.unsubscribe();
    };

    initialize();
  }, []);

  return {
    user,
    session,
    isLoading,
    isAdmin
  };
}
