
import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import { Session, AuthError, User, AuthResponse } from '@supabase/supabase-js';
import { toast } from 'sonner';

interface AuthState {
  session: Session | null;
  user: User | null;
  isLoading: boolean;
  isAdmin: boolean;
  phoneNumber: string | null;
  signIn: (phone: string) => Promise<{ success: boolean, error: AuthError | null }>;
  verifyOtp: (phone: string, token: string) => Promise<{ success: boolean, error: AuthError | null }>;
  signOut: () => Promise<void>;
  updateAuthData: (session: Session | null) => void;
}

const AuthContext = createContext<AuthState | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState<string | null>(null);
  const navigate = useNavigate();

  // Check if the user has admin privileges
  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!user) {
        setIsAdmin(false);
        return;
      }

      try {
        const { data, error } = await supabase.rpc('get_current_user_role');
        if (error) {
          console.error("Error checking admin status:", error);
          setIsAdmin(false);
          return;
        }

        if (data && data.is_admin) {
          setIsAdmin(true);
        }
      } catch (error) {
        console.error("Error checking admin status:", error);
        setIsAdmin(false);
      }
    };

    checkAdminStatus();
  }, [user]);

  // Set up auth state listener
  useEffect(() => {
    setIsLoading(true);

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          setSession(currentSession);
          setUser(currentSession?.user ?? null);
          setPhoneNumber(currentSession?.user?.phone ?? null);
        } else if (event === 'SIGNED_OUT') {
          setSession(null);
          setUser(null);
          setPhoneNumber(null);
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      setPhoneNumber(currentSession?.user?.phone ?? null);
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Sign in with phone number (request OTP)
  const signIn = async (phone: string): Promise<{ success: boolean, error: AuthError | null }> => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signInWithOtp({
        phone,
      });

      if (error) {
        toast.error('Error sending verification code', {
          description: error.message,
        });
        return { success: false, error };
      }

      // Store the phone number in state
      setPhoneNumber(phone);
      toast.success('Verification code sent', {
        description: 'Please check your phone for the verification code',
      });
      return { success: true, error: null };
    } catch (err) {
      toast.error('Unexpected error', {
        description: 'Failed to send verification code',
      });
      return { success: false, error: err as AuthError };
    } finally {
      setIsLoading(false);
    }
  };

  // Verify OTP and complete sign in
  const verifyOtp = async (phone: string, token: string): Promise<{ success: boolean, error: AuthError | null }> => {
    try {
      setIsLoading(true);
      const { data, error }: AuthResponse = await supabase.auth.verifyOtp({
        phone,
        token,
        type: 'sms',
      });

      if (error) {
        toast.error('Verification failed', {
          description: error.message,
        });
        return { success: false, error };
      }

      // Authentication successful
      setSession(data.session);
      setUser(data.user);
      setPhoneNumber(phone);
      
      toast.success('Verification successful', {
        description: 'You are now signed in',
      });
      navigate('/');
      return { success: true, error: null };
    } catch (err) {
      toast.error('Verification failed', {
        description: 'An unexpected error occurred',
      });
      return { success: false, error: err as AuthError };
    } finally {
      setIsLoading(false);
    }
  };

  // Sign out
  const signOut = async () => {
    setIsLoading(true);
    try {
      await supabase.auth.signOut();
      setSession(null);
      setUser(null);
      setPhoneNumber(null);
      navigate('/auth');
    } catch (error) {
      console.error('Error signing out:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Update auth data manually
  const updateAuthData = (newSession: Session | null) => {
    setSession(newSession);
    setUser(newSession?.user ?? null);
    setPhoneNumber(newSession?.user?.phone ?? null);
  };

  const value = {
    session,
    user,
    isLoading,
    isAdmin,
    phoneNumber,
    signIn,
    verifyOtp,
    signOut,
    updateAuthData,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
