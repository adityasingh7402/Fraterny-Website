
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Eye, EyeOff, Mail, RefreshCw, AlertTriangle } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/integrations/supabase/client';

const loginSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
});

const registerSchema = z.object({
  firstName: z.string().min(1, { message: 'First name is required' }),
  lastName: z.string().min(1, { message: 'Last name is required' }),
  email: z.string().email({ message: 'Please enter a valid email address' }),
  mobileNumber: z.string()
    .min(10, { message: 'Mobile number must be at least 10 digits' })
    .regex(/^[0-9+\s()-]+$/, { message: 'Please enter a valid phone number' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
  confirmPassword: z.string().min(6, { message: 'Please confirm your password' }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type LoginFormValues = z.infer<typeof loginSchema>;
type RegisterFormValues = z.infer<typeof registerSchema>;

const Auth = () => {
  const { signIn, signUp, resendVerificationEmail } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("login");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [verificationEmailSent, setVerificationEmailSent] = useState(false);
  const [verificationEmail, setVerificationEmail] = useState("");
  const [isProcessingToken, setIsProcessingToken] = useState(false);
  const [isResendingEmail, setIsResendingEmail] = useState(false);
  const [verificationError, setVerificationError] = useState(false);

  useEffect(() => {
    const handleEmailConfirmation = async () => {
      const hashParams = new URLSearchParams(location.hash.substring(1));
      const accessToken = hashParams.get('access_token');
      const refreshToken = hashParams.get('refresh_token');
      const type = hashParams.get('type');

      if (accessToken && (type === 'signup' || type === 'recovery')) {
        setIsProcessingToken(true);
        try {
          console.log("Processing verification token from URL");
          const { data, error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken || '',
          });

          if (error) {
            console.error('Error during email confirmation:', error);
            throw error;
          }
          
          if (data && data.session) {
            window.history.replaceState(null, '', window.location.pathname);
            navigate('/');
          }
        } catch (error) {
          console.error('Error during email confirmation:', error);
        } finally {
          setIsProcessingToken(false);
        }
      }
    };

    handleEmailConfirmation();
  }, [location, navigate]);

  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const registerForm = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      mobileNumber: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onLoginSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    try {
      await signIn(data.email, data.password);
      navigate('/');
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const onRegisterSubmit = async (data: RegisterFormValues) => {
    setIsLoading(true);
    try {
      const result = await signUp(
        data.email, 
        data.password, 
        data.firstName, 
        data.lastName, 
        data.mobileNumber
      );
      
      if (result.success) {
        if (result.emailConfirmationSent) {
          setVerificationEmailSent(true);
          setVerificationEmail(data.email);
        } else {
          // User was auto-confirmed (email confirmation disabled in Supabase)
          setActiveTab('login');
          loginForm.setValue('email', data.email);
        }
        registerForm.reset();
      } else if (result.error === 'User already registered') {
        setActiveTab('login');
        loginForm.setValue('email', data.email);
      } else {
        // If we received an error related to sending the verification email
        if (result.error?.includes('send') || result.error?.includes('email') || result.error?.includes('SMTP')) {
          setVerificationEmailSent(true);
          setVerificationEmail(data.email);
          setVerificationError(true);
          registerForm.reset();
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendVerificationEmail = async () => {
    setIsResendingEmail(true);
    try {
      const result = await resendVerificationEmail(verificationEmail);
      if (result.success) {
        setVerificationError(false);
      }
    } catch (error) {
      console.error('Failed to resend verification email:', error);
    } finally {
      setIsResendingEmail(false);
    }
  };

  if (isProcessingToken) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-md text-center">
          <div className="flex flex-col items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-navy mb-4"></div>
            <h2 className="text-2xl font-bold text-navy">Verifying your email...</h2>
            <p className="text-gray-500 mt-2">Please wait while we complete the verification process.</p>
          </div>
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
          <div className="space-y-6">
            {verificationError ? (
              <Alert className="bg-amber-50 border-amber-200">
                <AlertTriangle className="h-4 w-4 text-amber-600" />
                <AlertTitle className="text-amber-700">Email Delivery Issue</AlertTitle>
                <AlertDescription className="text-amber-600">
                  Your account was created, but there was a problem sending the verification email to <strong>{verificationEmail}</strong>.
                  You can try to resend the email or contact support if the problem persists.
                </AlertDescription>
              </Alert>
            ) : (
              <Alert className="bg-green-50 border-green-200">
                <Mail className="h-4 w-4 text-green-600" />
                <AlertTitle className="text-green-700">Verification Email Sent!</AlertTitle>
                <AlertDescription className="text-green-600">
                  We've sent a confirmation link to <strong>{verificationEmail}</strong>.
                  Please check your inbox and spam folder, then click the verification link to complete your registration.
                </AlertDescription>
              </Alert>
            )}
            <div className="flex flex-col items-center space-y-4 py-4">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-100">
                <Mail className="h-6 w-6 text-navy" />
              </div>
              <p className="text-center text-sm text-gray-500">
                Waiting for email verification... Once you verify your email, you'll be able to sign in.
              </p>
            </div>
            <div className="space-y-3">
              <Button 
                type="button" 
                onClick={handleResendVerificationEmail}
                disabled={isResendingEmail}
                className="w-full bg-terracotta hover:bg-terracotta/90"
              >
                {isResendingEmail ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Resending...
                  </>
                ) : (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Resend Verification Email
                  </>
                )}
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setVerificationEmailSent(false)}
                className="w-full"
              >
                Back to Sign In
              </Button>
            </div>
          </div>
        ) : (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="login">Sign In</TabsTrigger>
              <TabsTrigger value="register">Sign Up</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <Form {...loginForm}>
                <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-6">
                  <FormField
                    control={loginForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="Email address" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={loginForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input 
                              type={showPassword ? "text" : "password"} 
                              placeholder="Password" 
                              {...field} 
                            />
                            <button 
                              type="button"
                              className="absolute inset-y-0 right-0 flex items-center pr-3"
                              onClick={() => setShowPassword(!showPassword)}
                            >
                              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button 
                    type="submit" 
                    disabled={isLoading} 
                    className="w-full bg-terracotta hover:bg-terracotta/90"
                  >
                    {isLoading ? 'Signing in...' : 'Sign In'}
                  </Button>
                </form>
              </Form>
            </TabsContent>

            <TabsContent value="register">
              <Form {...registerForm}>
                <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={registerForm.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>First Name</FormLabel>
                          <FormControl>
                            <Input placeholder="First name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={registerForm.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Last Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Last name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={registerForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="Email address" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={registerForm.control}
                    name="mobileNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mobile Number</FormLabel>
                        <FormControl>
                          <Input placeholder="Mobile number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={registerForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input 
                              type={showPassword ? "text" : "password"} 
                              placeholder="Password" 
                              {...field} 
                            />
                            <button 
                              type="button"
                              className="absolute inset-y-0 right-0 flex items-center pr-3"
                              onClick={() => setShowPassword(!showPassword)}
                            >
                              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={registerForm.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm Password</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input 
                              type={showConfirmPassword ? "text" : "password"} 
                              placeholder="Confirm password" 
                              {...field} 
                            />
                            <button 
                              type="button"
                              className="absolute inset-y-0 right-0 flex items-center pr-3"
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            >
                              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button 
                    type="submit" 
                    disabled={isLoading} 
                    className="w-full bg-terracotta hover:bg-terracotta/90"
                  >
                    {isLoading ? 'Signing up...' : 'Sign Up'}
                  </Button>
                </form>
              </Form>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
};

export default Auth;
