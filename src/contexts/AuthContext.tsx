import React, { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuthState } from '@/hooks/use-auth-state';
import { signIn as authSignIn, signUp as authSignUp, signOut as authSignOut, resendVerificationEmail as authResendVerificationEmail } from '@/utils/auth';
import { AuthContextType } from '@/types/auth';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { user, session, isLoading, isAdmin } = useAuthState();
  const [authReady, setAuthReady] = useState(false);
  
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

  // Handle email verification link and ensure auth state is properly reflected
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
            // Clear the hash to avoid repeated processing
            window.history.replaceState(null, '', window.location.pathname);
            
            toast.success('Email verified successfully!');
            navigate('/');
            
            // Force a refresh of the auth state to ensure UI reflects new state
            const { data: refreshData } = await supabase.auth.getUser();
            if (refreshData?.user) {
              console.log('Auth state refreshed after verification');
              setAuthReady(true);
            }
          }
        } else {
          // No token in URL, we can set auth as ready
          setAuthReady(true);
        }
      } catch (error) {
        console.error('Error handling verification redirect:', error);
        setAuthReady(true); // Set auth ready even on error
      }
    };

    handleVerificationRedirect();
  }, [location, navigate]);

  // Ensure auth is marked as ready once we have a definitive user state
  useEffect(() => {
    if (!isLoading) {
      setAuthReady(true);
    }
  }, [isLoading, user]);

  // Sign in function wrapper
  const signIn = async (email: string, password: string) => {
    const result = await authSignIn(email, password);
    
    // Use navigate only if we're in a router context and not on the home page already
    if (navigate && location?.pathname === '/auth') {
      navigate('/');
    }
    
    // Force refresh auth state
    const { data } = await supabase.auth.getUser();
    if (data?.user) {
      console.log('Auth state refreshed after sign in');
    }
  };

  // Sign up function wrapper
  const signUp = authSignUp;

  // Sign out function wrapper
  const signOut = async () => {
    await authSignOut();
    
    // Navigate to auth page after sign out if navigate is available
    if (navigate) {
      navigate('/auth');
    }
  };

  // Resend verification email wrapper
  const resendVerificationEmail = authResendVerificationEmail;

  const value = {
    user,
    session,
    signIn,
    signUp,
    signOut,
    isLoading,
    isAdmin,
    resendVerificationEmail,
    authReady
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
