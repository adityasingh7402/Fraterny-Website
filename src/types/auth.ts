import { User, Session } from '@supabase/supabase-js';

export type AuthContextType = {
  user: User | null;
  session: Session | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, firstName?: string, lastName?: string, mobileNumber?: string) => Promise<{success: boolean; error?: string; emailConfirmationSent: boolean}>;
  signOut: () => Promise<void>;
  isLoading: boolean;
  isAdmin: boolean;
  authReady: boolean;
  resendVerificationEmail: (email: string) => Promise<{success: boolean; error?: string}>;
  error?: string | null;
  retryVerification?: () => void;
};
