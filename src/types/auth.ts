
import { User, Session } from '@supabase/supabase-js';

export interface UserProfile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  created_at: string;
  updated_at: string;
}

export type AuthContextType = {
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  isProfileLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, firstName?: string, lastName?: string, mobileNumber?: string) => Promise<{success: boolean; error?: string; emailConfirmationSent: boolean}>;
  signOut: () => Promise<void>;
  updateProfile: (updates: { first_name?: string; last_name?: string; phone?: string }) => Promise<{success: boolean; error?: string}>;
  isLoading: boolean;
  isAdmin: boolean;
  resendVerificationEmail: (email: string) => Promise<{success: boolean; error?: string}>;
};
