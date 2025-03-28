
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
  signUp: (email: string, password: string, firstName?: string, lastName?: string) => Promise<void>;
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

  // Initialize Supabase auth and set up listener
  useEffect(() => {
    const initialize = async () => {
      setIsLoading(true);

      // Set up auth state listener FIRST
      const { data: { subscription } } = supabase.auth.onAuthStateChange((event, newSession) => {
        setSession(newSession);
        setUser(newSession?.user ?? null);
        
        // Check if this is an admin user
        if (newSession?.user?.email) {
          // Check if user email is in the admin emails list
          setIsAdmin(ADMIN_EMAILS.includes(newSession.user.email));
        } else {
          setIsAdmin(false);
        }
      });

      // THEN check for existing session
      const { data: { session: initialSession } } = await supabase.auth.getSession();
      setSession(initialSession);
      setUser(initialSession?.user ?? null);
      
      // Check initial admin status
      if (initialSession?.user?.email) {
        setIsAdmin(ADMIN_EMAILS.includes(initialSession.user.email));
      }

      setIsLoading(false);
      return () => subscription.unsubscribe();
    };

    initialize();
  }, []);

  // Sign in function
  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      
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
  const signUp = async (email: string, password: string, firstName?: string, lastName?: string) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName
          }
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
