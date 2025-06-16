import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LoginForm } from '@/components/auth/LoginForm';
import { RegisterForm } from '@/components/auth/RegisterForm';
import { VerificationMessage } from '@/components/auth/VerificationMessage';
import { ProcessingState } from '@/components/auth/ProcessingState';

const Auth = () => {
  const { isLoading, authReady, error, retryVerification, resendVerificationEmail } = useAuth();
  const [activeTab, setActiveTab] = useState<string>("login");
  const [verificationEmailSent, setVerificationEmailSent] = useState(false);
  const [verificationEmail, setVerificationEmail] = useState("");
  const [verificationError, setVerificationError] = useState(false);

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
      setActiveTab('login');
    }
  };

  if (isLoading || !authReady) {
    return <ProcessingState />;
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-md text-center">
          <h1 className="text-3xl font-bold text-navy mb-2">Authentication Error</h1>
          <p className="text-red-600 mb-4">{error}</p>
          <button
            className="px-6 py-2 bg-terracotta text-white rounded-lg hover:bg-opacity-90 transition-all text-base font-medium"
            onClick={retryVerification}
          >
            Retry Verification
          </button>
        </div>
      </div>
    );
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
