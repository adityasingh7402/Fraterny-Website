
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Session, User } from '@supabase/supabase-js';
import { toast } from 'sonner';

// Define admin emails in a separate array for easier management
const ADMIN_EMAILS = ['admin@example.com', 'malhotrayash1900@gmail.com']; 

type AuthContextType = {
  user: User | null;
  session: Session | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, firstName?: string, lastName?: string, mobileNumber?: string) => Promise<void>;
  signOut: () => Promise<void>;
  isLoading: boolean;
  isAdmin: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  
  // Get navigate and location safely
  let navigate;
  let location;
  
  try {
    navigate = useNavigate();
    location = useLocation();
  } catch (e) {
    // We're outside a router context, which can happen during initialization
    console.warn('AuthProvider initialized outside router context');
  }

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

  // Handle email verification link
  useEffect(() => {
    if (!location) return;

    const handleVerificationRedirect = async () => {
      try {
        // Check for verification link parameters in the URL
        const hashParams = new URLSearchParams(location.hash.substring(1));
        const accessToken = hashParams.get('access_token');
        const refreshToken = hashParams.get('refresh_token');
        const type = hashParams.get('type');

        if (accessToken && (type === 'signup' || type === 'recovery' || type === 'invite')) {
          console.log(`Processing ${type} verification from URL hash`);
          
          // Set the session with the tokens from the URL
          const { data, error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken || '',
          });

          if (error) {
            console.error('Error setting session from URL:', error);
            toast.error('Failed to verify email. Please try signing in.');
            navigate('/auth');
            return;
          }

          if (data?.session) {
            setSession(data.session);
            setUser(data.session.user);

            // Set admin status if applicable
            if (data.session.user?.email) {
              setIsAdmin(ADMIN_EMAILS.includes(data.session.user.email));
            }

            // Clear the hash to avoid repeated processing
            window.history.replaceState(null, '', window.location.pathname);
            
            toast.success('Email verified successfully!');
            navigate('/');
          }
        }
      } catch (error) {
        console.error('Error handling verification redirect:', error);
      }
    };

    handleVerificationRedirect();
  }, [location, navigate]);

  // Initialize Supabase auth and set up listener
  useEffect(() => {
    const initialize = async () => {
      setIsLoading(true);

      // Set up auth state listener FIRST
      const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, newSession) => {
        // Don't update state immediately for sign-in events until we validate the session
        if (event !== 'SIGNED_IN') {
          setSession(newSession);
          setUser(newSession?.user ?? null);
          
          // Check if this is an admin user
          if (newSession?.user?.email) {
            // Check if user email is in the admin emails list
            setIsAdmin(ADMIN_EMAILS.includes(newSession.user.email));
          } else {
            setIsAdmin(false);
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
        await signOut();
      }

      setIsLoading(false);
      return () => subscription.unsubscribe();
    };

    initialize();
  }, []);

  // Sign in function
  const signIn = async (email: string, password: string) => {
    try {
      const { error, data } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      
      // Validate the new session
      const isValid = await validateSession(data.session);
      if (!isValid) {
        throw new Error('Invalid session. User may have been deleted.');
      }
      
      // Set user and session state
      setUser(data.session?.user ?? null);
      setSession(data.session);
      
      // Set admin status
      if (data.session?.user?.email) {
        setIsAdmin(ADMIN_EMAILS.includes(data.session.user.email));
      }
      
      // Use navigate only if we're in a router context and not on the home page already
      if (navigate && location?.pathname === '/auth') {
        navigate('/');
      }
      
      toast.success('Signed in successfully');
    } catch (error: any) {
      toast.error(error.message || 'Error signing in');
      throw error;
    }
  };

  // Sign up function
  const signUp = async (email: string, password: string, firstName?: string, lastName?: string, mobileNumber?: string) => {
    try {
      // Get the current domain to use for the redirect URL
      const currentDomain = window.location.origin;
      
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
            mobile_number: mobileNumber
          },
          emailRedirectTo: `${currentDomain}/auth`
        }
      });
      if (error) throw error;
      toast.success('Signed up successfully! Check your email for verification.');
    } catch (error: any) {
      toast.error(error.message || 'Error signing up');
      throw error;
    }
  };

  // Sign out function
  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      // Reset user and session state
      setUser(null);
      setSession(null);
      setIsAdmin(false);
      
      // Navigate to auth page after sign out if navigate is available
      if (navigate) {
        navigate('/auth');
      }
      toast.success('Signed out successfully');
    } catch (error: any) {
      toast.error(error.message || 'Error signing out');
      throw error;
    }
  };

  const value = {
    user,
    session,
    signIn,
    signUp,
    signOut,
    isLoading,
    isAdmin
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
