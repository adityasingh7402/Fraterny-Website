
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LoginForm } from '@/components/auth/LoginForm';
import { RegisterForm } from '@/components/auth/RegisterForm';
import { VerificationMessage } from '@/components/auth/VerificationMessage';
import { ProcessingState } from '@/components/auth/ProcessingState';
import { supabase } from '@/integrations/supabase/client';

const Auth = () => {
  const { resendVerificationEmail } = useAuth();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<string>("login");
  const [verificationEmailSent, setVerificationEmailSent] = useState(false);
  const [verificationEmail, setVerificationEmail] = useState("");
  const [isProcessingToken, setIsProcessingToken] = useState(false);
  const [verificationError, setVerificationError] = useState(false);

  useEffect(() => {
    const handleEmailConfirmation = async () => {
      // Check for verification token in URL hash
      const hashParams = new URLSearchParams(location.hash.substring(1));
      const accessToken = hashParams.get('access_token');
      const refreshToken = hashParams.get('refresh_token');
      const type = hashParams.get('type');

      if (accessToken && (type === 'signup' || type === 'recovery')) {
        setIsProcessingToken(true);
        try {
          console.log("Processing verification token from URL", { type, accessToken: accessToken.substring(0, 10) + '...' });
          const { data, error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken || '',
          });

          if (error) {
            console.error('Error during email confirmation:', error);
            throw error;
          }
          
          if (data && data.session) {
            console.log("Successfully verified email and set session");
            // Clear the hash to avoid repeated processing
            window.history.replaceState(null, '', window.location.pathname);
          }
        } catch (error) {
          console.error('Error during email confirmation:', error);
        } finally {
          setIsProcessingToken(false);
        }
      }
    };

    handleEmailConfirmation();
  }, [location]);

  const handleRegistrationSuccess = (
    email: string, 
    needsEmailVerification: boolean, 
    hasError: boolean = false
  ) => {
    if (needsEmailVerification) {
      setVerificationEmailSent(true);
      setVerificationEmail(email);
      setVerificationError(hasError);
    } else {
      // User was auto-confirmed or already exists
      setActiveTab('login');
    }
  };

  if (isProcessingToken) {
    return <ProcessingState />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-md">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-navy mb-2">Welcome to FRAT</h1>
          <p className="text-gray-500">Sign in to access your account</p>
        </div>

        {verificationEmailSent ? (
          <VerificationMessage 
            email={verificationEmail}
            hasError={verificationError}
            onBackToSignIn={() => setVerificationEmailSent(false)}
          />
        ) : (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="login">Sign In</TabsTrigger>
              <TabsTrigger value="register">Sign Up</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <LoginForm />
            </TabsContent>

            <TabsContent value="register">
              <RegisterForm onRegistrationSuccess={handleRegistrationSuccess} />
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
};

export default Auth;
