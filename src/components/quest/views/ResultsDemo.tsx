import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { toast } from 'sonner';
import { PaymentService } from '@/services/payments';
import { motion } from 'framer-motion';
import {CircleChevronUp} from 'lucide-react'

export function ResultsDemo() {
  const { sessionId, userId, testid } = useParams<{ 
    sessionId: string; 
    userId: string; 
    testid: string; 
  }>();
  const navigate = useNavigate();
  const { user, signInWithGoogle } = useAuth();
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [signingIn, setSigningIn] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  // Sign in handler
  const handleSignIn = async () => {
    if (signingIn) return;
    
    setSigningIn(true);
    try {
      await signInWithGoogle();
    //   toast.success('Successfully signed in!');
    } catch (error) {
      console.error('Sign-in error:', error);
      toast.error('Sign-in failed. Please try again.');
    } finally {
      toast.success('Successfully signed in!');
      setSigningIn(false);
    }
  };

  // Payment handler
  const handlePayment = async () => {
    if (!user?.id) {
      toast.error('Please sign in first');
      return;
    }
    
    if (!sessionId || !testid) {
      toast.error('Missing session or test ID');
      return;
    }
    
    setPaymentLoading(true);
    try {
      console.log('Starting payment with:', { sessionId, testid, userId: user.id });
      
      const paymentResult = await PaymentService.startPayment(sessionId, testid);
      
      if (paymentResult.success) {
        toast.success('Payment successful! You now have access to the full report.');
      } else {
        toast.error(paymentResult.error || 'Payment failed. Please try again.');
      }
    } catch (error: any) {
      console.error('Payment error:', error);
      toast.error('Payment failed. Please try again.');
    } finally {
      setPaymentLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">

        {/* Sticky Bottom Bar */}
        <div className="fixed bottom-0 left-0 right-0 z-50">
          <motion.div
            initial={{ y: 0 }}
            animate={{ 
              height: isExpanded ? 'auto' : '80px',
              backgroundColor: isExpanded ? '#ffffff' : ''
            }}
            transition={{ 
              duration: 0.3,
              ease: [0.4, 0.0, 0.2, 1]
            }}
            className="relative bg-gray-100 bg-gradient-to-br from-sky-800 to-sky-400 shadow-2xl border-t border-gray-200"
          >
            {/* Collapsed State - Always Visible */}
            <div className="flex items-center justify-between px-2 py-4 h-20">
              <div>
                <h3 className={`font-['Gilroy-Bold'] tracking-tighter text-lg ${isExpanded ? 'text-white' : 'text-white'}`}>
                  {isExpanded ? 'Just few steps away..' : 'Unlock Your Detailed Report'}
                </h3>
                {!isExpanded && (
                  <p className="font-['Gilroy-Bold'] tracking-tighter text-sm text-gray-700">
                    Get more detailed insights with powerful AI models
                  </p>
                )}
              </div>
              
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className={`p-3 rounded-full transition-all duration-300 ${
                  isExpanded 
                    ? '' 
                    : ''
                }`}
              >
                <motion.div
                  animate={{ rotate: isExpanded ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <CircleChevronUp className="w-6 h-6 text-white" />
                </motion.div>
              </button>
            </div>

            {/* Expanded Content */}
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ 
                opacity: isExpanded ? 1 : 0,
                height: isExpanded ? 'auto' : 0
              }}
              transition={{ 
                duration: 0.3,
                ease: [0.4, 0.0, 0.2, 1]
              }}
              className="overflow-hidden"
            >
              <div className="px-2 pb-6 space-y-6 bg-white">
                {/* Divider */}
                <div className="border-t border-gray-200"></div>
                
                {/* Authentication Section */}
                <div className="space-y-1">
                  {!user?.id ? (
                    <>
                      <div className="p-1">
                        <h3 className={`font-['Gilroy-semiBold'] tracking-tight text-sm text-gray-800`}>Please sign in before continuing. We will save your progress and allow you to access your report later.</h3>
                      </div>

                      <button
                        onClick={handleSignIn}
                        disabled={signingIn}
                        className="w-full bg-white text-gray-600 font-['Gilroy-semiBold'] rounded-[36px] border-2"
                      >
                        {signingIn ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            Signing in...
                          </>
                        ) : (
                          <>
                            Sign In with Google
                          </>
                        )}
                      </button>
                    </>
                  ) : (
                    <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-green-800 font-medium text-sm">Successfully signed in</p>
                        <p className="text-green-600 text-xs">{user.email}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Payment Section */}
                <div className="space-y-4">
                  <button
                    onClick={handlePayment}
                    disabled={!user?.id || paymentLoading || !sessionId || !testid}
                    className={`w-full py-4 px-4 rounded-lg transition-all font-medium text-lg ${
                      !user?.id || paymentLoading || !sessionId || !testid
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                        : 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700 shadow-lg hover:shadow-xl transform hover:scale-[1.02]'
                    }`}
                  >
                    {paymentLoading ? (
                      <span className="flex items-center justify-center gap-2">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Processing Payment...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                        Unlock Full Report - $9.99
                      </span>
                    )}
                  </button>

                  {/* Requirements Checklist - Only show if payment disabled */}
                  {/* {(!user?.id || !sessionId || !testid) && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="font-medium text-gray-900 text-sm mb-3">Requirements:</p>
                      <div className="space-y-2 text-sm">
                        <div className={`flex items-center gap-2 ${user?.id ? 'text-green-600' : 'text-red-600'}`}>
                          <div className={`w-4 h-4 rounded-full flex items-center justify-center ${user?.id ? 'bg-green-100' : 'bg-red-100'}`}>
                            {user?.id ? (
                              <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            ) : (
                              <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                              </svg>
                            )}
                          </div>
                          <span>User authenticated</span>
                        </div>
                        <div className={`flex items-center gap-2 ${sessionId ? 'text-green-600' : 'text-red-600'}`}>
                          <div className={`w-4 h-4 rounded-full flex items-center justify-center ${sessionId ? 'bg-green-100' : 'bg-red-100'}`}>
                            {sessionId ? (
                              <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            ) : (
                              <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                              </svg>
                            )}
                          </div>
                          <span>Session ID available</span>
                        </div>
                        <div className={`flex items-center gap-2 ${testid ? 'text-green-600' : 'text-red-600'}`}>
                          <div className={`w-4 h-4 rounded-full flex items-center justify-center ${testid ? 'bg-green-100' : 'bg-red-100'}`}>
                            {testid ? (
                              <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            ) : (
                              <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                              </svg>
                            )}
                          </div>
                          <span>Test ID available</span>
                        </div>
                      </div>
                    </div>
                  )} */}
                </div>
              </div>
            </motion.div>
            </motion.div>
        </div>
      </div>       

    </div>
  );
}

export default ResultsDemo;