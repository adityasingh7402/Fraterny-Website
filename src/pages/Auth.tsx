
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Label } from "@/components/ui/label";
import { Loader2, Phone } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// Schema for phone authentication
const phoneSchema = z.object({
  phone: z
    .string()
    .min(10, { message: "Phone number must be at least 10 digits" })
    .refine((val) => /^\+?[0-9]+$/.test(val), {
      message: "Please enter a valid phone number",
    }),
});

// Schema for OTP verification
const otpSchema = z.object({
  otp: z
    .string()
    .min(6, { message: "Verification code must be at least 6 digits" })
    .refine((val) => /^[0-9]+$/.test(val), {
      message: "Verification code must contain only numbers",
    }),
});

// Form values types
type PhoneFormValues = z.infer<typeof phoneSchema>;
type OtpFormValues = z.infer<typeof otpSchema>;

const Auth = () => {
  const { user, signIn, verifyOtp, isLoading } = useAuth();
  const [otpSent, setOtpSent] = useState(false);
  const [currentPhone, setCurrentPhone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  // Form for phone number input
  const phoneForm = useForm<PhoneFormValues>({
    resolver: zodResolver(phoneSchema),
    defaultValues: {
      phone: "",
    },
  });

  // Form for OTP verification
  const otpForm = useForm<OtpFormValues>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otp: "",
    },
  });

  // If user is already authenticated, redirect to home
  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  // Handle phone number submission
  const onPhoneSubmit = async (values: PhoneFormValues) => {
    setIsSubmitting(true);
    
    // Format phone number to ensure it has a country code
    let formattedPhone = values.phone;
    if (!formattedPhone.startsWith("+")) {
      // Add India country code if not present
      formattedPhone = `+91${formattedPhone}`;
    }
    
    try {
      // Store user metadata before sending OTP
      const metadataResponse = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/store-user-metadata`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          phone: formattedPhone,
          metadata: {
            signup_date: new Date().toISOString(),
            last_signin_attempt: new Date().toISOString(),
          }
        }),
      });
      
      if (!metadataResponse.ok) {
        const errorData = await metadataResponse.json();
        console.error('Failed to store user metadata:', errorData);
      }
      
      // Send OTP via Supabase Auth
      const { success } = await signIn(formattedPhone);
      
      if (success) {
        setOtpSent(true);
        setCurrentPhone(formattedPhone);
      }
    } catch (error) {
      console.error("Error during phone authentication:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle OTP verification
  const onOtpSubmit = async (values: OtpFormValues) => {
    setIsSubmitting(true);
    try {
      await verifyOtp(currentPhone, values.otp);
    } catch (error) {
      console.error("Error during OTP verification:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-navy">
            Welcome to Fraterny
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {otpSent ? "Enter the verification code sent to your phone" : "Enter your phone number to sign in or register"}
          </p>
        </div>

        <Card className="w-full mt-6">
          <CardHeader>
            <CardTitle className="text-xl font-medium text-navy">
              {otpSent ? "Verify OTP" : "Phone Authentication"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!otpSent ? (
              <Form {...phoneForm}>
                <form onSubmit={phoneForm.handleSubmit(onPhoneSubmit)} className="space-y-6">
                  <FormField
                    control={phoneForm.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <div className="flex items-center border rounded-md focus-within:ring-2 focus-within:ring-terracotta focus-within:border-terracotta overflow-hidden">
                            <div className="bg-gray-50 px-3 py-2.5 border-r">
                              <Phone size={18} className="text-gray-500" />
                            </div>
                            <Input
                              {...field}
                              placeholder="+91 (India) or 10-digit number"
                              className="border-0 focus-visible:ring-0"
                              type="tel"
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    className="w-full bg-terracotta hover:bg-terracotta-dark"
                    disabled={isSubmitting || isLoading}
                  >
                    {isSubmitting || isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Sending Code...
                      </>
                    ) : (
                      "Send Verification Code"
                    )}
                  </Button>
                </form>
              </Form>
            ) : (
              <>
                <Alert className="mb-6 bg-blue-50 border-blue-200">
                  <AlertTitle className="text-blue-800">Verification code sent!</AlertTitle>
                  <AlertDescription className="text-blue-700">
                    We've sent a verification code to {currentPhone}
                  </AlertDescription>
                </Alert>

                <Form {...otpForm}>
                  <form onSubmit={otpForm.handleSubmit(onOtpSubmit)} className="space-y-6">
                    <FormField
                      control={otpForm.control}
                      name="otp"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Verification Code</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="Enter 6-digit code"
                              type="text"
                              inputMode="numeric"
                              maxLength={6}
                              className="text-center text-lg tracking-widest"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="space-y-4">
                      <Button
                        type="submit"
                        className="w-full bg-terracotta hover:bg-terracotta-dark"
                        disabled={isSubmitting || isLoading}
                      >
                        {isSubmitting || isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Verifying...
                          </>
                        ) : (
                          "Verify & Sign In"
                        )}
                      </Button>

                      <Button
                        type="button"
                        variant="ghost"
                        className="w-full text-navy"
                        onClick={() => {
                          setOtpSent(false);
                          setCurrentPhone("");
                        }}
                        disabled={isSubmitting || isLoading}
                      >
                        Change Phone Number
                      </Button>
                    </div>
                  </form>
                </Form>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Auth;
