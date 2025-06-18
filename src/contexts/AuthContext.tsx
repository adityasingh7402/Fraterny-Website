import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useNavigate, useLocation, NavigateFunction, Location } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuthState } from '@/hooks/use-auth-state';
import { signIn as authSignIn, signUp as authSignUp, signOut as authSignOut, resendVerificationEmail as authResendVerificationEmail } from '@/utils/auth';
import { AuthContextType } from '@/types/auth';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { user: initialUser, session: initialSession, isLoading: initialLoading, isAdmin: initialIsAdmin } = useAuthState();
  const [authState, setAuthState] = useState({
    ready: true, // Start as ready to not block initial render
    loading: false, // Start as not loading to not block initial render
    user: initialUser,
    session: initialSession,
    isAdmin: initialIsAdmin,
    error: null as string | null,
  });
  
  // Get navigate and location safely
  let navigate: NavigateFunction | undefined;
  let location: Location | undefined;
  
  try {
    navigate = useNavigate();
    location = useLocation();
  } catch (e) {
    // We're outside a router context, which can happen during initialization
    console.warn('AuthProvider initialized outside router context');
  }

  // Centralized verification logic - now non-blocking
  const handleVerificationRedirect = useCallback(async () => {
    if (!location) return;
    
    // Don't set loading to true immediately to avoid blocking UI
    try {
      const hashParams = new URLSearchParams(location.hash.substring(1));
      const accessToken = hashParams.get('access_token');
      const refreshToken = hashParams.get('refresh_token');
      const type = hashParams.get('type');

      if (accessToken && (type === 'signup' || type === 'recovery' || type === 'invite')) {
        const { data, error } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken || '',
        });
        if (error) {
          setAuthState(s => ({ ...s, error: 'Failed to verify email. Please try again.' }));
          return;
        }
        if (data?.session) {
          window.history.replaceState(null, '', window.location.pathname);
          // Refresh user
          const { data: refreshData } = await supabase.auth.getUser();
          setAuthState(s => ({
            ...s,
            user: refreshData?.user || null,
            session: data.session,
            isAdmin: refreshData?.user?.email ? ['malhotrayash1900@gmail.com'].includes(refreshData.user.email) : false,
            ready: true,
            loading: false,
            error: null,
          }));
          return;
        }
      }
      // No token in URL, just mark as ready
      setAuthState(s => ({ ...s, ready: true, loading: false, error: null }));
    } catch (error) {
      setAuthState(s => ({ ...s, error: 'Error handling verification. Please try again.' }));
    }
  }, [location]);

  // Run verification in background after initial render
  useEffect(() => {
    // Use setTimeout to defer auth initialization to not block initial render
    const authInitTimeout = setTimeout(() => {
      handleVerificationRedirect();
    }, 100); // Small delay to ensure UI renders first

    return () => clearTimeout(authInitTimeout);
  }, [handleVerificationRedirect]);

  // Update auth state when initial loading completes - non-blocking
  useEffect(() => {
    if (!initialLoading) {
      setAuthState(s => ({ 
        ...s, 
        ready: true, 
        loading: false, 
        user: initialUser, 
        session: initialSession, 
        isAdmin: initialIsAdmin 
      }));
    }
  }, [initialLoading, initialUser, initialSession, initialIsAdmin]);

  // Retry function for verification
  const retryVerification = useCallback(() => {
    handleVerificationRedirect();
  }, [handleVerificationRedirect]);

  // Auth actions
  const signIn = async (email: string, password: string) => {
    await authSignIn(email, password);
    if (navigate && location?.pathname === '/auth') {
      navigate('/');
    }
    const { data } = await supabase.auth.getUser();
    setAuthState(s => ({ ...s, user: data?.user || null, isAdmin: data?.user?.email ? ['malhotrayash1900@gmail.com'].includes(data.user.email) : false }));
  };
  const signUp = authSignUp;
  const signOut = async () => {
    await authSignOut();
    if (navigate) {
      navigate('/auth');
    }
    setAuthState(s => ({ ...s, user: null, session: null, isAdmin: false }));
  };
  const resendVerificationEmail = authResendVerificationEmail;

  const value: AuthContextType = {
    user: authState.user,
    session: authState.session,
    isLoading: authState.loading,
    isAdmin: authState.isAdmin,
    signIn,
    signUp,
    signOut,
    resendVerificationEmail,
    authReady: authState.ready,
    error: authState.error,
    retryVerification,
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
