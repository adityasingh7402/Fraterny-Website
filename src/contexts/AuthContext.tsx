
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Session, User } from '@supabase/supabase-js';
import { toast } from 'sonner';
import { showError, showSuccess } from '@/utils/errorHandler';

// Define admin phone numbers in a separate array for easier management
const ADMIN_PHONES = ['+1234567890']; 

type AuthContextType = {
  user: User | null;
  session: Session | null;
  signIn: (phone: string) => Promise<void>;
  verifyOTP: (phone: string, token: string) => Promise<void>;
  signUp: (phone: string, firstName?: string, lastName?: string) => Promise<{success: boolean; error?: string}>;
  signOut: () => Promise<void>;
  isLoading: boolean;
  isAdmin: boolean;
  resendOTP: (phone: string) => Promise<{success: boolean; error?: string}>;
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
          if (newSession?.user?.phone) {
            // Check if user phone is in the admin phones list
            setIsAdmin(ADMIN_PHONES.includes(newSession.user.phone));
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
        if (initialSession.user?.phone) {
          setIsAdmin(ADMIN_PHONES.includes(initialSession.user.phone));
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

  // Sign in with phone number (Step 1)
  const signIn = async (phone: string) => {
    try {
      const { error } = await supabase.auth.signInWithOtp({
        phone: phone,
      });
      
      if (error) throw error;
      
      showSuccess('Verification code sent! Please check your phone.');
    } catch (error: any) {
      showError(error, 'Error sending verification code');
      throw error;
    }
  };

  // Verify OTP (Step 2)
  const verifyOTP = async (phone: string, token: string) => {
    try {
      const { data, error } = await supabase.auth.verifyOtp({
        phone: phone,
        token: token,
        type: 'sms',
      });
      
      if (error) throw error;
      
      // Set user and session state
      setUser(data.user);
      setSession(data.session);
      
      // Set admin status
      if (data.user?.phone) {
        setIsAdmin(ADMIN_PHONES.includes(data.user.phone));
      }
      
      // Use navigate only if we're in a router context
      if (navigate && location?.pathname === '/auth') {
        navigate('/');
      }
      
      showSuccess('Signed in successfully');
    } catch (error: any) {
      showError(error, 'Error verifying code');
      throw error;
    }
  };

  // Resend OTP
  const resendOTP = async (phone: string) => {
    try {
      const { error } = await supabase.auth.signInWithOtp({
        phone: phone,
      });
      
      if (error) {
        showError(error, 'Failed to resend verification code');
        return { success: false, error: error.message };
      }
      
      showSuccess('Verification code sent!');
      return { success: true };
    } catch (error: any) {
      showError(error, 'Failed to resend verification code');
      return { success: false, error: error.message };
    }
  };

  // Sign up with phone number (directly uses sign in with OTP)
  const signUp = async (phone: string, firstName?: string, lastName?: string) => {
    try {
      // First, store metadata for this phone number
      const { error: metadataError } = await supabase.functions.invoke('store-user-metadata', {
        body: {
          phone,
          metadata: {
            first_name: firstName,
            last_name: lastName
          }
        }
      });
      
      if (metadataError) {
        console.error('Error storing user metadata:', metadataError);
      }
      
      // Then send the OTP
      const { error } = await supabase.auth.signInWithOtp({
        phone: phone,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName
          }
        }
      });
      
      if (error) {
        showError(error, 'Error sending verification code');
        return { success: false, error: error.message };
      }
      
      showSuccess('Verification code sent! Please check your phone.');
      return { success: true };
    } catch (error: any) {
      showError(error, 'Error during sign up');
      return { success: false, error: error.message };
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
      showSuccess('Signed out successfully');
    } catch (error: any) {
      showError(error, 'Error signing out');
      throw error;
    }
  };

  const value = {
    user,
    session,
    signIn,
    verifyOTP,
    signUp,
    signOut,
    isLoading,
    isAdmin,
    resendOTP
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
