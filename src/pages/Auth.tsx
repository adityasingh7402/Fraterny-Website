// import { useState } from 'react';
// import { useAuth } from '@/contexts/AuthContext';
// import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
// import { LoginForm } from '@/components/auth/LoginForm';
// import { RegisterForm } from '@/components/auth/RegisterForm';
// import { VerificationMessage } from '@/components/auth/VerificationMessage';
// import { ProcessingState } from '@/components/auth/ProcessingState';
// import Footer from '@/components/Footer';
// import Navigation from '@/components/Navigation';

// const Auth = () => {
//   const { isLoading, authReady, error, retryVerification, resendVerificationEmail } = useAuth();
//   const [activeTab, setActiveTab] = useState<string>("login");
//   const [verificationEmailSent, setVerificationEmailSent] = useState(false);
//   const [verificationEmail, setVerificationEmail] = useState("");
//   const [verificationError, setVerificationError] = useState(false);

//   const handleRegistrationSuccess = (
//     email: string, 
//     needsEmailVerification: boolean, 
//     hasError: boolean = false
//   ) => {
//     if (needsEmailVerification) {
//       setVerificationEmailSent(true);
//       setVerificationEmail(email);
//       setVerificationError(hasError);
//     } else {
//       setActiveTab('login');
//     }
//   };

//   if (isLoading || !authReady) {
//     return <ProcessingState />;
//   }

//   if (error) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
//         <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-md text-center">
//           <h1 className="text-3xl font-bold text-navy mb-2">Authentication Error</h1>
//           <p className="text-red-600 mb-4">{error}</p>
//           <button
//             className="px-6 py-2 bg-terracotta text-white rounded-lg hover:bg-opacity-90 transition-all text-base font-medium"
//             onClick={retryVerification}
//           >
//             Retry Verification
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-200 flex flex-col">
//       {/* Navigation on top of the gray background */}
//       <Navigation />
      
//       {/* Content centered with proper padding */}
//       <div className="flex-grow flex items-center justify-center px-4 py-24 sm:px-6 lg:px-8">
//         <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-md">
//           <div className="text-center">
//             <h1 className="text-3xl font-bold text-navy mb-2">Welcome to FRAT</h1>
//             <p className="text-gray-500">Sign in to access your account</p>
//           </div>

//           {verificationEmailSent ? (
//             <VerificationMessage 
//               email={verificationEmail}
//               hasError={verificationError}
//               onBackToSignIn={() => setVerificationEmailSent(false)}
//             />
//           ) : (
//             <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
//               <TabsList className="grid w-full grid-cols-2 mb-8">
//                 <TabsTrigger value="login">Sign In</TabsTrigger>
//                 <TabsTrigger value="register">Sign Up</TabsTrigger>
//               </TabsList>

//               <TabsContent value="login">
//                 <LoginForm />
//               </TabsContent>

//               <TabsContent value="register">
//                 <RegisterForm onRegistrationSuccess={handleRegistrationSuccess} />
//               </TabsContent>
//             </Tabs>
//           )}
//         </div>
//       </div>
      
//       <Footer />
//     </div>
//   );
// };

// export default Auth;



import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Target, TrendingUp, Users } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { LoginForm } from '@/components/auth/LoginForm';
import { RegisterForm } from '@/components/auth/RegisterForm';
import { VerificationMessage } from '@/components/auth/VerificationMessage';
import { ProcessingState } from '@/components/auth/ProcessingState';
import Footer from '@/components/Footer';
import Navigation from '@/components/Navigation';
import { useNavigate, useLocation } from 'react-router-dom';

const BrandPanel = () => {
  const features = [
    {
      icon: <Target className="w-6 h-6" />,
      title: "Discover Your Path",
      description: "Personalized assessments to guide your journey"
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: "Track Your Growth",
      description: "Monitor progress and celebrate milestones"
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Join a Community",
      description: "Connect with like-minded individuals"
    }
  ];

  return (
    <div className="h-full flex flex-col justify-center p-8 md:p-12 text-white relative overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-700 to-blue-900" />
      
      {/* Decorative Circles */}
      <div className="absolute top-10 right-10 w-32 h-32 bg-white/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-10 w-40 h-40 bg-white/5 rounded-full blur-3xl" />
      
      {/* Content */}
      <div className="relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center gap-2 mb-6">
            <Sparkles className="w-8 h-8" />
            <h1 className="text-4xl font-['Gilroy-Bold']">FRAT</h1>
          </div>
          
          <h2 className="text-2xl md:text-3xl font-['Gilroy-Bold'] mb-4">
            Discover Your True Potential
          </h2>
          
          <p className="text-base md:text-lg font-['Gilroy-SemiBold'] text-white/90 mb-12">
            Unlock insights about yourself and embark on a transformative journey of self-discovery.
          </p>
        </motion.div>

        <div className="space-y-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
              className="flex items-start gap-4"
            >
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0 backdrop-blur-sm">
                {feature.icon}
              </div>
              <div>
                <h3 className="font-['Gilroy-Bold'] text-base md:text-lg mb-1">{feature.title}</h3>
                <p className="text-white/80 font-['Gilroy-regular'] text-sm">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

const Auth = () => {
  const { isLoading, authReady, error, retryVerification } = useAuth();
  const [activeView, setActiveView] = useState<'login' | 'register'>('login');
  const [verificationEmailSent, setVerificationEmailSent] = useState(false);
  const [verificationEmail, setVerificationEmail] = useState("");
  const [verificationError, setVerificationError] = useState(false);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const fromQuery = queryParams.get('from');
  const fromState = location.state?.from?.pathname;
  const from = fromState || fromQuery || '/';

  // Store the intended destination for Google OAuth
  useEffect(() => {
  console.log('🔍 Auth page - from path:', from);
    if (from !== '/') {
      sessionStorage.setItem('auth_redirect_from', from);
      console.log('✅ Stored in sessionStorage:', sessionStorage.getItem('auth_redirect_from'));
    }
  }, [from]);

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
      setActiveView('login');
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
  
  const isLogin = activeView === 'login';
  
  // Smoother panel animation variants with spring physics
  const panelVariants = {
    left: { 
      x: '0%',
      transition: {
        type: "spring",
        stiffness: 80,
        damping: 20,
        mass: 1
      }
    },
    right: { 
      x: '100%',
      transition: {
        type: "spring",
        stiffness: 80,
        damping: 20,
        mass: 1
      }
    }
  };
  
  // Form content variants with smoother transitions
  const formVariants = {
    hidden: { 
      opacity: 0, 
      y: 15,
      transition: { duration: 0.2 }
    },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.5,
        delay: 0.3,
        ease: [0.4, 0, 0.2, 1]
      }
    },
    exit: { 
      opacity: 0, 
      y: -15,
      transition: { 
        duration: 0.2,
        ease: [0.4, 0, 1, 1]
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-200 flex flex-col">
      {/* Fixed Navigation */}
      <Navigation />

      {/* Main Content Area - Centered */}
      <div className="flex-grow flex items-center justify-center px-4 py-24 sm:px-6 lg:px-8">
        <div className="w-full max-w-6xl bg-white rounded-2xl shadow-xl overflow-hidden" style={{ height: '800px' }}>
          <div className="h-full relative">
            {/* Mobile View - Stacked */}
            <div className="md:hidden h-full overflow-y-auto">
              {verificationEmailSent ? (
                <div className="p-8">
                  <VerificationMessage 
                    email={verificationEmail}
                    hasError={verificationError}
                    onBackToSignIn={() => setVerificationEmailSent(false)}
                  />
                </div>
              ) : (
                <>
                  <div className="bg-gradient-to-br from-cyan-500 via-sky-500 to-blue-600 p-6 text-white">
                    <div className="flex items-center gap-2 mb-3">
                      <Sparkles className="w-6 h-6" />
                      <h1 className="text-2xl font-['Gilroy-Bold']">FRAT</h1>
                    </div>
                    <h2 className="text-xl font-['Gilroy-Bold'] mb-2">Discover Your True Potential</h2>
                    <p className="text-sm font-['Gilroy-SemiBold'] text-white/90">
                      Unlock insights about yourself and embark on a transformative journey.
                    </p>
                  </div>
                  
                  <div className="p-8">
                    <div className="text-center mb-6">
                      <h2 className="text-2xl font-['Gilroy-Bold'] text-gray-900 mb-2">
                        {isLogin ? 'Welcome Back' : 'Create Account'}
                      </h2>
                      <p className="text-gray-600 font-['Gilroy-SemiBold'] text-sm">
                        {isLogin 
                          ? 'Sign in to continue your journey' 
                          : 'Join us and start your transformation'}
                      </p>
                    </div>

                    {isLogin ? (
                      // <LoginForm />
                      <LoginForm redirectTo={from} />
                    ) : (
                      // <RegisterForm onRegistrationSuccess={handleRegistrationSuccess} />
                      <RegisterForm onRegistrationSuccess={handleRegistrationSuccess} />
                    )}

                    <div className="mt-6 text-center">
                      <button
                        onClick={() => setActiveView(isLogin ? 'register' : 'login')}
                        className="text-sm font-['Gilroy-SemiBold'] text-gray-600 hover:text-cyan-600 transition-colors"
                      >
                        {isLogin ? (
                          <>
                            Don't have an account?{' '}
                            <span className="font-['Gilroy-Bold'] text-cyan-600">Sign up</span>
                          </>
                        ) : (
                          <>
                            Already have an account?{' '}
                            <span className="font-['Gilroy-Bold'] text-cyan-600">Sign in</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Desktop View - Split Panel with Animation */}
            <div className="hidden md:flex h-full relative">
              {/* Brand Panel - Animated */}
              <motion.div
                className="absolute inset-y-0 w-1/2 h-full"
                initial={false}
                animate={isLogin ? 'left' : 'right'}
                variants={panelVariants}
              >
                <BrandPanel />
              </motion.div>

              {/* Form Panel - Animated */}
              <motion.div
                className="absolute inset-y-0 w-1/2 h-full bg-white"
                initial={false}
                animate={isLogin ? 'right' : 'left'}
                variants={panelVariants}
              >
                <div className="h-full flex items-center justify-center p-8 overflow-y-auto">
                  <div className="w-full max-w-md">
                    {verificationEmailSent ? (
                      <VerificationMessage 
                        email={verificationEmail}
                        hasError={verificationError}
                        onBackToSignIn={() => setVerificationEmailSent(false)}
                      />
                    ) : (
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={activeView}
                          variants={formVariants}
                          initial="hidden"
                          animate="visible"
                          exit="exit"
                        >
                          {/* Form Header */}
                          <div className="text-center mb-8">
                            <h2 className="text-3xl font-['Gilroy-Bold'] text-gray-900 mb-2">
                              {isLogin ? 'Welcome Back' : 'Create Account'}
                            </h2>
                            <p className="text-gray-600 font-['Gilroy-SemiBold']">
                              {isLogin 
                                ? 'Sign in to continue your journey' 
                                : 'Join us and start your transformation'}
                            </p>
                          </div>

                          {/* Form Content */}
                          {isLogin ? (
                            <LoginForm redirectTo={from} />
                          ) : (
                            <RegisterForm onRegistrationSuccess={handleRegistrationSuccess} />
                          )}

                          {/* Toggle Link */}
                          <div className="mt-6 text-center">
                            <button
                              onClick={() => setActiveView(isLogin ? 'register' : 'login')}
                              className="text-sm font-['Gilroy-SemiBold'] text-gray-600 hover:text-cyan-600 transition-colors"
                            >
                              {isLogin ? (
                                <>
                                  Don't have an account?{' '}
                                  <span className="font-['Gilroy-Bold'] text-cyan-600">Sign up</span>
                                </>
                              ) : (
                                <>
                                  Already have an account?{' '}
                                  <span className="font-['Gilroy-Bold'] text-cyan-600">Sign in</span>
                                </>
                              )}
                            </button>
                          </div>
                        </motion.div>
                      </AnimatePresence>
                    )}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Fixed Footer */}
      <Footer />
    </div>
  );
};

export default Auth;