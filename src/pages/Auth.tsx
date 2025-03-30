
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Phone, RefreshCw, Check, ChevronLeft } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';

const phoneRegex = /^\+?[0-9]{10,15}$/;

const signInSchema = z.object({
  phone: z.string().regex(phoneRegex, 'Enter a valid phone number with country code (e.g., +1XXXXXXXXXX)'),
});

const verifySchema = z.object({
  otp: z.string().min(6, { message: 'OTP must be 6 digits' }).max(6),
});

const registerSchema = z.object({
  firstName: z.string().min(1, { message: 'First name is required' }),
  lastName: z.string().min(1, { message: 'Last name is required' }),
  phone: z.string().regex(phoneRegex, 'Enter a valid phone number with country code (e.g., +1XXXXXXXXXX)'),
});

type SignInFormValues = z.infer<typeof signInSchema>;
type VerifyFormValues = z.infer<typeof verifySchema>;
type RegisterFormValues = z.infer<typeof registerSchema>;

const Auth = () => {
  const { signIn, verifyOTP, signUp, resendOTP } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("login");
  const [otpSent, setOtpSent] = useState(false);
  const [isResendingOtp, setIsResendingOtp] = useState(false);
  const [currentPhone, setCurrentPhone] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);

  const signInForm = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      phone: "",
    },
  });

  const verifyForm = useForm<VerifyFormValues>({
    resolver: zodResolver(verifySchema),
    defaultValues: {
      otp: "",
    },
  });

  const registerForm = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      phone: "",
    },
  });

  const onSignInSubmit = async (data: SignInFormValues) => {
    setIsLoading(true);
    try {
      await signIn(data.phone);
      setCurrentPhone(data.phone);
      setOtpSent(true);
      setIsSignUp(false);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const onVerifySubmit = async (data: VerifyFormValues) => {
    setIsLoading(true);
    try {
      await verifyOTP(currentPhone, data.otp);
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
      const result = await signUp(data.phone, data.firstName, data.lastName);
      if (result.success) {
        setCurrentPhone(data.phone);
        setOtpSent(true);
        setIsSignUp(true);
        registerForm.reset();
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setIsResendingOtp(true);
    try {
      await resendOTP(currentPhone);
    } catch (error) {
      console.error('Failed to resend OTP:', error);
    } finally {
      setIsResendingOtp(false);
    }
  };

  const handleBackToForm = () => {
    setOtpSent(false);
    verifyForm.reset();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-md">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-navy mb-2">Welcome to FRAT</h1>
          <p className="text-gray-500">Sign in to access your account</p>
        </div>

        {otpSent ? (
          <div className="space-y-6">
            <Alert className="bg-blue-50 border-blue-200">
              <Phone className="h-4 w-4 text-blue-600" />
              <AlertTitle className="text-blue-700">Verification Code Sent!</AlertTitle>
              <AlertDescription className="text-blue-600">
                We've sent a verification code to <strong>{currentPhone}</strong>.
                Please enter the 6-digit code below.
              </AlertDescription>
            </Alert>

            <Form {...verifyForm}>
              <form onSubmit={verifyForm.handleSubmit(onVerifySubmit)} className="space-y-6">
                <FormField
                  control={verifyForm.control}
                  name="otp"
                  render={({ field }) => (
                    <FormItem className="space-y-4">
                      <FormLabel>Verification Code</FormLabel>
                      <FormControl>
                        <InputOTP
                          maxLength={6}
                          {...field}
                        >
                          <InputOTPGroup>
                            <InputOTPSlot index={0} />
                            <InputOTPSlot index={1} />
                            <InputOTPSlot index={2} />
                            <InputOTPSlot index={3} />
                            <InputOTPSlot index={4} />
                            <InputOTPSlot index={5} />
                          </InputOTPGroup>
                        </InputOTP>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="space-y-3">
                  <Button 
                    type="submit" 
                    disabled={isLoading} 
                    className="w-full bg-terracotta hover:bg-terracotta/90"
                  >
                    {isLoading ? 'Verifying...' : 'Verify Code'}
                  </Button>
                  
                  <div className="flex justify-between">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={handleBackToForm}
                      className="flex items-center"
                    >
                      <ChevronLeft className="mr-1 h-4 w-4" />
                      Back
                    </Button>
                    
                    <Button 
                      type="button" 
                      variant="ghost" 
                      onClick={handleResendOTP}
                      disabled={isResendingOtp}
                      className="text-terracotta hover:text-terracotta/90"
                    >
                      {isResendingOtp ? (
                        <>
                          <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                          Resending...
                        </>
                      ) : (
                        'Resend Code'
                      )}
                    </Button>
                  </div>
                </div>
              </form>
            </Form>
          </div>
        ) : (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="login">Sign In</TabsTrigger>
              <TabsTrigger value="register">Sign Up</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <Form {...signInForm}>
                <form onSubmit={signInForm.handleSubmit(onSignInSubmit)} className="space-y-6">
                  <FormField
                    control={signInForm.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input 
                            type="tel" 
                            placeholder="Enter with country code (+1XXXXXXXXXX)" 
                            {...field} 
                          />
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
                    {isLoading ? 'Sending code...' : 'Send Verification Code'}
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
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input 
                            type="tel" 
                            placeholder="Enter with country code (+1XXXXXXXXXX)" 
                            {...field} 
                          />
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
