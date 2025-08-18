// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { useAuth } from '../../../contexts/AuthContext';
// import { toast } from 'sonner';
// import { motion } from 'framer-motion';
// import {CircleChevronUp} from 'lucide-react'
// import { 
//   PaymentService,
//   getCurrentPricing,
//   getPricingDisplayInfo,
//   formatTimeRemaining,
//   getUrgencyLevel 
// } from '@/services/payments';

// export function ResultsDemo() {
//   const { sessionId, userId, testid } = useParams<{ 
//     sessionId: string; 
//     userId: string; 
//     testid: string; 
//   }>();
//   const navigate = useNavigate();
//   const { user, signInWithGoogle } = useAuth();
//   const [paymentLoading, setPaymentLoading] = useState(false);
//   const [signingIn, setSigningIn] = useState(false);
//   const [isExpanded, setIsExpanded] = useState(false);
//   const [pricingData, setPricingData] = useState({
//   amount: '₹999',
//   timeRemaining: 0, // minutes
//   isEarlyBird: true,
//   urgencyLevel: 'low'
// });

//     useEffect(() => {
//   const updatePricing = () => {
//     const pricing = PaymentService.getCurrentPricing();
    
//     // Debug logs to see what's happening
//     // console.log('Pricing update:', {
//     //   amount: pricing.amount,
//     //   timeRemaining: pricing.timeRemaining,
//     //   name: pricing.name,
//     //   isEarlyBird: pricing.name === 'early'
//     // });
    
//     setPricingData({
//       amount: `₹${Math.round(pricing.amount / 100)}`,
//       timeRemaining: pricing.timeRemaining || 0,
//       isEarlyBird: pricing.name === 'early',
//       urgencyLevel: getUrgencyLevel(pricing.timeRemaining || 0)
//     });
//   };
  
//   updatePricing();
//   const interval = setInterval(updatePricing, 30000); // Every second for testing
//   return () => clearInterval(interval);
// }, []);

//   // Sign in handler
//   const handleSignIn = async () => {
//     if (signingIn) return;
    
//     setSigningIn(true);
//     try {
//       await signInWithGoogle();
//     //   toast.success('Successfully signed in!');
//     } catch (error) {
//       console.error('Sign-in error:', error);
//       toast.error('Sign-in failed. Please try again.');
//     } finally {
//       toast.success('Successfully signed in!');
//       setSigningIn(false);
//     }
//   };

//   // Payment handler
//   const handlePayment = async () => {
//     if (!user?.id) {
//       toast.error('Please sign in first');
//       return;
//     }
    
//     if (!sessionId || !testid) {
//       toast.error('Missing session or test ID');
//       return;
//     }
    
//     setPaymentLoading(true);
//     try {
//       console.log('Starting payment with:', { sessionId, testid, userId: user.id });
      
//       const paymentResult = await PaymentService.startPayment(sessionId, testid);
      
//       if (paymentResult.success) {
//         toast.success('Payment successful! You now have access to the full report.');
//       } else {
//         toast.error(paymentResult.error || 'Payment failed. Please try again.');
//       }
//     } catch (error: any) {
//       console.error('Payment error:', error);
//       toast.error('Payment failed. Please try again.');
//     } finally {
//       setPaymentLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 p-6">
//       <div className="max-w-4xl mx-auto">

//         {/* Sticky Bottom Bar */}
//         <div className="fixed bottom-0 left-0 right-0 z-50">
//           <motion.div
//             initial={{ y: 0 }}
//             animate={{ 
//               height: isExpanded ? 'auto' : '80px',
//               backgroundColor: isExpanded ? '#ffffff' : ''
//             }}
//             transition={{ 
//               duration: 0.3,
//               ease: [0.4, 0.0, 0.2, 1]
//             }}
//             className="relative bg-gray-100 bg-gradient-to-br from-sky-800 to-sky-400 shadow-2xl border-t border-gray-200"
//           >
//             {/* Collapsed State - Always Visible */}
//             <div className="flex items-center justify-between px-2 py-4 h-20">
//               <div>
//                 <h3 className={`font-['Gilroy-Bold'] tracking-tighter text-xl ${isExpanded ? 'text-white' : 'text-white'}`}>
//                   {isExpanded ? 'Just few steps away..' : 'Unlock Your Detailed Report'}
//                 </h3>
//                 {!isExpanded && (
//                   <>
//                   <p className="font-['Gilroy-Bold'] tracking-tighter text-sm text-gray-700">
//                     Get more detailed insights with powerful AI models
//                   </p>
//                   <p className="font-['Gilroy-semiBold'] tracking-tighter text-lg text-white">
//                     {pricingData.isEarlyBird && pricingData.timeRemaining > 0 ? (
//                       <span>
//                         {pricingData.timeRemaining} m left 
//                         <span className="line-through text-gray-300 pl-5 text-sm">₹1499</span> 
//                         <span className="font-bold text-green-300 text-sm"> {pricingData.amount}</span>
//                       </span>
//                     ) : (
//                       `Regular pricing: ${pricingData.amount}`
//                     )}
//                   </p>
//                   </>
                  
//                 )}
//               </div>
              
//               <button
//                 onClick={() => setIsExpanded(!isExpanded)}
//                 className={`p-3 rounded-full transition-all duration-300 ${
//                   isExpanded 
//                     ? '' 
//                     : ''
//                 }`}
//               >
//                 <motion.div
//                   animate={{ rotate: isExpanded ? 180 : 0 }}
//                   transition={{ duration: 0.3 }}
//                 >
//                   <CircleChevronUp className="w-6 h-6 text-white" />
//                 </motion.div>
//               </button>
//             </div>

//             {/* Expanded Content */}
//             <motion.div
//               initial={{ opacity: 0, height: 0 }}
//               animate={{ 
//                 opacity: isExpanded ? 1 : 0,
//                 height: isExpanded ? 'auto' : 0
//               }}
//               transition={{ 
//                 duration: 0.3,
//                 ease: [0.4, 0.0, 0.2, 1]
//               }}
//               className="overflow-hidden"
//             >
//               <div className="px-2 pb-6 space-y-6 bg-white">
//                 {/* Divider */}
//                 <div className="border-t border-gray-200"></div>
                
//                 {/* Authentication Section */}
//                 <div className="space-y-1">
//                   {!user?.id ? (
//                     <>
//                       <div className="p-1">
//                         <h3 className={`font-['Gilroy-semiBold'] tracking-tight text-sm text-gray-800`}>Please sign in before continuing. We will save your progress and allow you to access your report later.</h3>
//                       </div>

//                       <button
//                         onClick={handleSignIn}
//                         disabled={signingIn}
//                         className="w-full bg-white text-gray-600 font-['Gilroy-semiBold'] rounded-[36px] border-2"
//                       >
//                         {signingIn ? (
//                           <>
//                             <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
//                             Signing in...
//                           </>
//                         ) : (
//                           <>
//                             Sign In with Google
//                           </>
//                         )}
//                       </button>
//                     </>
//                   ) : (
//                     <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
//                       <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
//                         <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
//                         </svg>
//                       </div>
//                       <div>
//                         <p className="text-green-800 font-medium text-sm">Successfully signed in</p>
//                         <p className="text-green-600 text-xs">{user.email}</p>
//                       </div>
//                     </div>
//                   )}
//                 </div>

//                 {/* Payment Section */}
//                 <div className="space-y-4">
//                   <button
//                     onClick={handlePayment}
//                     disabled={!user?.id || paymentLoading || !sessionId || !testid}
//                     className={`w-full py-4 px-4 rounded-lg transition-all font-medium text-lg ${
//                       !user?.id || paymentLoading || !sessionId || !testid
//                         ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
//                         : 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700 shadow-lg hover:shadow-xl transform hover:scale-[1.02]'
//                     }`}
//                   >
//                     {paymentLoading ? (
//                       <span className="flex items-center justify-center gap-2">
//                         <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
//                         Processing Payment...
//                       </span>
//                     ) : (
//                       <span className="flex items-center justify-center gap-2">
//                         <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
//                         </svg>
//                         Unlock Full Report - $9.99
//                       </span>
//                     )}
//                   </button>

//                   {/* Requirements Checklist - Only show if payment disabled */}
//                   {/* {(!user?.id || !sessionId || !testid) && (
//                     <div className="bg-gray-50 p-4 rounded-lg">
//                       <p className="font-medium text-gray-900 text-sm mb-3">Requirements:</p>
//                       <div className="space-y-2 text-sm">
//                         <div className={`flex items-center gap-2 ${user?.id ? 'text-green-600' : 'text-red-600'}`}>
//                           <div className={`w-4 h-4 rounded-full flex items-center justify-center ${user?.id ? 'bg-green-100' : 'bg-red-100'}`}>
//                             {user?.id ? (
//                               <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20">
//                                 <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
//                               </svg>
//                             ) : (
//                               <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20">
//                                 <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
//                               </svg>
//                             )}
//                           </div>
//                           <span>User authenticated</span>
//                         </div>
//                         <div className={`flex items-center gap-2 ${sessionId ? 'text-green-600' : 'text-red-600'}`}>
//                           <div className={`w-4 h-4 rounded-full flex items-center justify-center ${sessionId ? 'bg-green-100' : 'bg-red-100'}`}>
//                             {sessionId ? (
//                               <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20">
//                                 <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
//                               </svg>
//                             ) : (
//                               <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20">
//                                 <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
//                               </svg>
//                             )}
//                           </div>
//                           <span>Session ID available</span>
//                         </div>
//                         <div className={`flex items-center gap-2 ${testid ? 'text-green-600' : 'text-red-600'}`}>
//                           <div className={`w-4 h-4 rounded-full flex items-center justify-center ${testid ? 'bg-green-100' : 'bg-red-100'}`}>
//                             {testid ? (
//                               <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20">
//                                 <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
//                               </svg>
//                             ) : (
//                               <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20">
//                                 <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
//                               </svg>
//                             )}
//                           </div>
//                           <span>Test ID available</span>
//                         </div>
//                       </div>
//                     </div>
//                   )} */}
//                 </div>
//               </div>
//             </motion.div>
//             </motion.div>
//         </div>
//       </div>       

//     </div>
//   );
// }

// export default ResultsDemo;

















// ------------------------------------------------------------------------
'use client';

import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Share2, 
  ThumbsUp, 
  ThumbsDown, 
  Clock, 
  Quote, 
  Film, 
  Sparkles, 
  X, 
  SendHorizontal,
  Lock, 
  ShieldCheck,
  Download,
  Home,
  AlertTriangle,
  Eye,
  Users,
  Shield,
  Zap,
  BookOpen,
  Star,
  Moon
} from "lucide-react";
import imgicon from '../../../../public/message.png'
import logo from '../../../../public/Vector.svg';
import axios from 'axios';
import { section } from "@/components/quest-landing/styles";

// =====================================================================
// Quest Result Fullscreen - TypeScript Next.js Implementation
// Combines mobile-first fullscreen design with robust data handling
// =====================================================================

// TypeScript Interfaces
interface Film {
  title: string;
  description: string;
}

interface Subject {
  title: string;
  description: string;
  matchPercentage: number;
}

interface AstrologyData {
  actualSign: string;
  behavioralSign: string;
  description: string;
  predictions: Array<{
    title: string;
    likelihood: number;
    reason: string;
  }>;
}

interface Book {
  title: string;
  author: string;
}

interface Quote {
  text: string;
  author: string;
}

interface MindCardData {
  name?: string;
  personality?: string;
  description?: string;
  attributes: string[];
  scores: string[];
  insights: string[];
}

interface ResultData {
  session_id: string;
  user_id?: string;
  completion_date: string;
  results: {
    "section 1"?: string;
    "Mind Card"?: MindCardData;
    findings?: string[];
    quotes?: Quote[];
    films?: Film[];
    subjects?: Subject[];
    astrology?: AstrologyData;
    books?: Book[];
    actionItem?: string;
  };
}

interface User {
  id: string;
  email: string;
  name?: string;
}

// Design Tokens
const tokens = {
  textDark: "#0A0A0A",
  textLight: "#FFFFFF",
  muted: "#6B7280",
  border: "#E6EAF2",
  accent: "#0C45F0",
  accent2: "#41D9FF",
  accent3: "#48B9D8",
  soft: "#F7F9FC",
};

const CTA_HEIGHT = 60;

// Motion Configuration
const EASE_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1];
const DUR_SM = 0.18;
const DUR_MD = 0.32;

const sectionVariants = {
  hidden: { opacity: 0, y: 12 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: DUR_MD, ease: EASE_OUT, staggerChildren: 0.06 },
  },
};

// Mock Data
const MOCK_RESULT_DATA: ResultData = {
  session_id: "mock-session-123",
  user_id: "mock-user-456",
  completion_date: new Date().toISOString(),
  results: {
    "section 1": "You project calm intensity—ambitious, observant, and guarded until conviction clicks into motion.",
    "Mind Card": {
      name: "The Architect",
      personality: "#Strategic-Minded Individual",
      description: "A methodical thinker who builds systems and seeks elegant solutions.",
      attributes: ["self awareness", "collaboration", "conflict navigation", "risk appetite"],
      scores: ["82/100", "76/100", "71/100", "65/100"],
      insights: [
        "High self-reflection and emotional intelligence",
        "Prefers small, high-trust team environments", 
        "Approaches conflict with diplomatic solutions",
        "Calculated risk-taker with thorough analysis"
      ]
    },
    findings: [
      "You hoard unfinished ideas until urgency forces elegant execution.",
      "You listen to patterns first, people second—useful, but sometimes misread as cold.",
      "You avoid small talk not from arrogance, but from conservation of focus.",
      "You under-share wins; your excellence is discoverable, not broadcast.",
      "You feel safest when plans are modular—Plan B is always pre-built."
    ],
    quotes: [
      { text: "What we dwell on is who we become.", author: "Oprah Winfrey" },
      { text: "He who has a why can bear almost any how.", author: "Nietzsche" },
      { text: "You must build your life as a work of art.", author: "Simone de Beauvoir" },
      { text: "The obstacle is the way.", author: "Marcus Aurelius" },
      { text: "Live the questions now.", author: "R.M. Rilke" }
    ],
    films: [
      { title: "Arrival", description: "Language rewires how you choose." },
      { title: "Whiplash", description: "Obsession versus self-regard." },
      { title: "Her", description: "Intimacy with ideas, distance with people." },
      { title: "Good Will Hunting", description: "Unused potential, chosen family." },
      { title: "The Social Network", description: "Precision without tenderness costs." }
    ],
    subjects: [
      { title: "Game theory for everyday negotiations", description: "Strategic thinking in daily interactions", matchPercentage: 85 },
      { title: "Cognitive load management", description: "Optimizing mental bandwidth", matchPercentage: 78 },
      { title: "Systems design thinking", description: "Building scalable frameworks", matchPercentage: 82 }
    ],
    astrology: {
      actualSign: "Gemini",
      behavioralSign: "Virgo",
      description: "You behave more like a Virgo than your actual sign. Why: Discipline + methodical prep + discomfort with spectacle. You optimize silently, then ship.",
      predictions: [
        { title: "Career pivot within 18 months", likelihood: 72, reason: "Mastery drive + boredom with maintenance cycles." },
        { title: "You'll be seen as 'aloof' before 'deep'", likelihood: 68, reason: "Low social broadcast + high internal dialogues." },
        { title: "You'll lead a lean team of 3-6", likelihood: 63, reason: "Preference for high-trust, high-autonomy pods." },
        { title: "You'll publish a framework or guide", likelihood: 59, reason: "Pattern memory + urge to compress chaos." },
        { title: "Sleep becomes a non-negotiable ritual", likelihood: 54, reason: "Performance dependency discovered via dips." }
      ]
    },
    books: [
      { title: "Range", author: "David Epstein" },
      { title: "Deep Work", author: "Cal Newport" },
      { title: "Man's Search for Meaning", author: "Viktor Frankl" }
    ],
    actionItem: "Ship one imperfect artifact daily for 14 days. Log it and write a one-line reflection."
  }
};

//payment CTA
// Add this component before the main QuestResultFullscreen component
interface UpsellSheetProps {
  open: boolean;
  onClose: () => void;
  onPayment: () => void;
  paymentLoading: boolean;
}

const UpsellSheet: React.FC<UpsellSheetProps> = ({ open, onClose, onPayment, paymentLoading }) => {
  const [trial, setTrial] = useState(true);
  return (
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-[70]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <div className="absolute inset-0 bg-black/35" onClick={onClose} />
          <motion.div
            className="absolute inset-x-0 bottom-0 mx-auto w-full max-w-[390px] rounded-t-[28px] bg-white"
            style={{ boxShadow: "0 -12px 32px rgba(0,0,0,0.15)", border: `1px solid ${tokens.border}` }}
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 260, damping: 28 }}
          >
            <div className="relative px-4 pt-4">
              <button aria-label="Close" onClick={onClose} className="absolute left-2 top-2 rounded-full p-2">
                <X className="h-5 w-5" color={tokens.textDark} />
              </button>
              <div className="pb-2 pt-6 text-[26px] font-[700] leading-8" style={{ color: tokens.textDark }}>
                Enjoy premium features from now
              </div>
              <div className="mb-3 text-[14px]" style={{ color: tokens.muted }}>Everything in Free, plus:</div>
              <ul className="grid gap-2 pb-3">
                {["Unlimited AI credits", "5 GB storage", "Unlimited project history", "Calendar integration & syncing", "Guest sharing and links"].map((t, i) => (
                  <li key={i} className="flex items-center gap-2 text-[14px]">
                    <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ background: i === 0 ? "#FF3B6B" : tokens.accent }} />
                    <span className={i === 0 ? "font-[700]" : ""} style={{ color: tokens.textDark }}>
                      {i === 0 ? <><span style={{ color: "#FF3B6B" }}>Unlimited AI credits</span></> : t}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="px-4">
              <motion.div
                className="relative rounded-2xl p-4 text-white"
                style={{ background: "linear-gradient(135deg, rgba(12,69,240,1) 0%, rgba(65,217,255,1) 45%, rgba(72,185,216,1) 100%)" }}
                animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              >
                <div className="text-[12px] opacity-95">Annual plan</div>
                <div className="mt-1 flex items-baseline gap-2">
                  <span className="text-[14px] line-through opacity-85">$100.99</span>
                  <span className="text-[20px] font-[700]">→ $39.99 / year</span>
                </div>
              </motion.div>
              <div className="mt-3 flex items-center justify-between rounded-xl bg-[#F2F5FA] px-3 py-3" style={{ border: `1px solid ${tokens.border}` }}>
                <div className="text-[14px]" style={{ color: tokens.textDark }}>7-day free trial</div>
                <button aria-label="toggle trial" onClick={() => setTrial((t) => !t)} className="relative h-6 w-11 rounded-full" style={{ background: trial ? tokens.accent : "#D1D5DB", boxShadow: "0 10px 30px rgba(12,69,240,0.06)" }}>
                  <span className="absolute top-1 left-1 h-4 w-4 rounded-full bg-white transition-transform" style={{ transform: `translateX(${trial ? 20 : 0}px)` }} />
                </button>
              </div>
            </div>
            <div className="sticky bottom-0 mt-5 border-t" style={{ borderColor: tokens.border }}>
              <div className="px-4 py-3">
                <button 
                  onClick={onPayment}
                  disabled={paymentLoading}
                  className="w-full rounded-xl px-4 py-3 text-[16px] font-[600] text-white disabled:opacity-50" 
                  style={{ background: tokens.textDark }}
                >
                  {paymentLoading ? 'Processing...' : 'Continue'}
                </button>
                <div className="pt-2 text-center text-[12px]" style={{ color: tokens.muted }}>
                  No commitments. Cancel anytime.
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

interface StickyCTAProps {
  onOpen: () => void;
}

const StickyCTA: React.FC<StickyCTAProps> = ({ onOpen }) => {
  const [seconds, setSeconds] = useState(30 * 60);
  useEffect(() => {
    const t = setInterval(() => setSeconds((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50"
      style={{
        background: "rgba(255,255,255,0.92)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        borderTop: `1px solid ${tokens.border}`,
        boxShadow: "0 -6px 18px rgba(10,10,10,0.06)",
        height: CTA_HEIGHT,
      }}
    >
      <div className="mx-auto flex h-full max-w-[390px] items-center justify-between px-3" style={{ color: tokens.textDark }}>
        <div className="flex flex-col">
          <div className="flex items-baseline gap-2">
            <span className="text-[20px] font-[800]">₹950</span>
            <span className="text-[12px] line-through" style={{ color: tokens.muted }}>₹1200</span>
          </div>
          <div className="mt-1 flex items-center gap-1 text-[12px]" aria-live="polite" style={{ color: tokens.muted }}>
            <Clock className="h-4 w-4" color={tokens.accent} />
            <span>Ends in {formatTime(seconds)}</span>
          </div>
        </div>

        <motion.button
          onClick={onOpen}
          whileTap={{ scale: 0.98 }}
          className="flex items-center justify-center rounded-full px-6 py-2.5 min-w-[180px] text-[14px] font-[700] text-white"
          style={{
            background: `linear-gradient(135deg, ${tokens.accent} 0%, ${tokens.accent2} 60%, ${tokens.accent3} 100%)`,
            boxShadow: "0 10px 20px rgba(12,69,240,0.20)",
          }}
          aria-label="Unlock full PDF report"
        >
          Unlock Full PDF Report
        </motion.button>
      </div>

      <div className="absolute left-0 right-0 bottom-0 h-[2px]" style={{ background: `linear-gradient(90deg, ${tokens.accent} 0%, ${tokens.accent2} 50%, ${tokens.accent3} 100%)` }} />
    </div>
  );
};

// Utility Functions
const formatTime = (s: number): string => {
  const m = Math.floor(s / 60).toString().padStart(2, "0");
  const r = (s % 60).toString().padStart(2, "0");
  return `${m}:${r}`;
};

const validateResultData = (data: any): ResultData => {
  console.log('🔍 Validating result data:', data);
  
  const validated: ResultData = {
    session_id: data.session_id || 'unknown',
    user_id: data.user_id,
    completion_date: data.completion_date || new Date().toISOString(),
    results: {
      "section 1": data.results?.["section 1"] || '',
      "Mind Card": data.results?.["Mind Card"] || {
        name: "User",
        personality: "#Game-Styled Mindcard", 
        description: "Loading analysis...",
        attributes: ["self awareness", "collaboration", "conflict navigation", "risk appetite"],
        scores: ["50/100", "50/100", "50/100", "50/100"],
        insights: ["Analysis in progress...", "Analysis in progress...", "Analysis in progress...", "Analysis in progress..."]
      },
      findings: data.results?.findings || [],
      quotes: data.results?.quotes || [],
      films: data.results?.films || [],
      subjects: data.results?.subjects || [],
      astrology: data.results?.astrology || null,
      books: data.results?.books || [],
      actionItem: data.results?.actionItem || ''
    }
  };
  
  console.log('✅ Validated result data:', validated);
  return validated;
};

async function shareText(title: string, text: string): Promise<boolean> {
  try {
    if (navigator.share) {
      await navigator.share({ title, text });
      return true;
    }
  } catch {}
  try {
    await navigator.clipboard.writeText(`${title}\n\n${text}`);
    return true;
  } catch {
    return false;
  }
}

// Section Themes
const sectionTheme = (key: string) => {
  switch (key) {
    case "emotional":
      return {
        bg: `radial-gradient(1200px 600px at 60% 80%, rgba(255,255,255,.25), transparent 60%), linear-gradient(160deg, #0b4ef6 0%, #2d73ff 45%, #69c7ff 100%)`,
        text: tokens.textLight,
      };
    case "mind":
      return {
        bg: `linear-gradient(180deg, rgba(72,185,216,0.9) 0%, rgba(65,217,255,0.85) 40%, rgba(12,69,240,0.9) 100%)`,
        text: tokens.textLight,
      };
    case "findings":
      return {
        bg: `linear-gradient(135deg, rgba(12,69,240,1) 0%, rgba(65,217,255,0.85) 55%, rgba(255,255,255,0.2) 100%)`,
        text: tokens.textLight,
      };
    case "quotes":
      return {
        bg: `linear-gradient(180deg, #FFFFFF 0%, #F7F9FC 60%, rgba(65,217,255,0.25) 100%)`,
        text: tokens.textDark,
      };
    case "films":
      return {
        bg: `radial-gradient(120% 100% at 50% 100%, rgba(12,69,240,1) 0%, rgba(12,69,240,0.9) 35%, rgba(65,217,255,0.6) 100%)`,
        text: tokens.textLight,
      };
    case "subjects":
      return { bg: `linear-gradient(180deg, #FFFFFF 0%, #F7F9FC 100%)`, text: tokens.textDark };
    case "astrology":
      return {
        bg: `radial-gradient(90% 80% at 50% 60%, rgba(12,69,240,0.95) 0%, rgba(12,69,240,0.9) 45%, rgba(65,217,255,0.6) 100%)`,
        text: tokens.textLight,
      };
    case "books":
      return { bg: `linear-gradient(180deg, #FFFFFF 0%, #F7F9FC 100%)`, text: tokens.textDark };
    case "work":
      return { bg: `linear-gradient(135deg, rgba(12,69,240,1) 0%, rgba(72,185,216,0.95) 100%)`, text: tokens.textLight };
    default:
      return { bg: `#FFFFFF`, text: tokens.textDark };
  }
};

// Components
interface OrbProps {
  onTip: () => void;
}

const Orb: React.FC<OrbProps> = ({ onTip }) => (
  <motion.button
    aria-label="Quest orb"
    onClick={onTip}
    whileTap={{ scale: 0.96 }}
    className="fixed bottom-24 right-4 z-[60] h-14 w-14 rounded-full"
    style={{
      border: `1px solid ${tokens.border}`,
      boxShadow: "0 10px 30px rgba(12,69,240,0.20)",
      background:
        "radial-gradient(60% 60% at 50% 45%, #0C45F0 0%, #41D9FF 40%, #48B9D8 75%, rgba(72,185,216,0.15) 100%)",
      filter: "saturate(1.06)",
    }}
    animate={{ scale: [1, 0.965, 1], rotate: [0, 1.2, 0] }}
    transition={{ duration: 3.6, repeat: Infinity, ease: "easeInOut" }}
  />
);

interface SectionActionsProps {
  title: string;
  share: string;
  textColor: string;
   inputClassName?: string;
    buttonClassName?: string; 
    sessionId?: string;
  testId?: string;
  sectionId?: string;
  onToast?: (msg: string) => void;
}

const SectionActions: React.FC<SectionActionsProps> = ({ title, share, textColor, onToast, inputClassName, buttonClassName, sessionId, testId, sectionId }) => {
  const [reacted, setReacted] = useState<"up" | "down" | null>(null);
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [shared, setShared] = useState(false);

  const sendFeedback = async () => {
  console.log("sendFeedback called with:", { sessionId, testId, sectionId });
  // if (!sessionId || !testId || !sectionId) return;
  
  try {
    console.log("Sending feedback:", { sessionId, testId, reacted, feedback, sectionId });
    await axios.post('/api/feedback', {
      sessionId,
      testId,
      like: reacted === "up" ? "yes" : "no",
      dislike: reacted === "down" ? "yes" : "no", 
      feedback,
      sectionId: sectionId
    });
    onToast && onToast("Feedback sent ✓");
  } catch (error) {
    onToast && onToast("Failed to send feedback");
  }
};

  const onShare = async () => {
    const ok = await shareText(title, share);
    if (ok) {
      setShared(true);
      setTimeout(() => setShared(false), 900);
      onToast && onToast("Shared ✓");
    }
  };

  return (
    <div className="pointer-events-auto">
      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {/* <button
            onClick={() => setReacted("up")}
            className="flex items-center gap-1 rounded-full px-3 py-1 text-[12px]"
            style={{ background: "rgba(255,255,255,0.25)", color: textColor }}
          >
            <ThumbsUp className="h-4 w-4" />
          </button>
          <button
            onClick={() => setReacted("down")}
            className="flex items-center gap-1 rounded-full px-3 py-1 text-[12px]"
            style={{ background: "rgba(255,255,255,0.25)", color: textColor }}
          >
            <ThumbsDown className="h-4 w-4" />
          </button> */}

          <div className="flex items-center gap-2">
          <motion.button
            onClick={() => setReacted(reacted === "up" ? null : "up")}
            className="flex items-center gap-1 rounded-full px-3 py-1 text-[12px] relative overflow-hidden"
            style={{ background: "rgba(255,255,255,0.25)", color: textColor }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {/* Background fill animation */}
            <motion.div
              className="absolute inset-0"
              initial={{ scale: 0, opacity: 0 }}
              animate={{
                scale: reacted === "up" ? 1 : 0,
                opacity: reacted === "up" ? 0.3 : 0,
              }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 20,
              }}
              style={{ borderRadius: "inherit" }}
            />
            
            {/* Icon with animation */}
            <motion.div
              animate={{
                rotate: reacted === "up" ? [0, -10, 10, 0] : 0,
                scale: reacted === "up" ? [1, 1.2, 1] : 1,
              }}
              transition={{
                duration: 0.5,
                ease: "easeOut"
              }}
            >
              <ThumbsUp 
                className="h-4 w-4 relative z-10" 
                fill={reacted === "up" ? "currentColor" : "none"}
                style={{
                  transition: "fill 0.3s ease"
                }}
              />
            </motion.div>
            
            {/* Ripple effect */}
            {reacted === "up" && (
              <motion.div
                className="absolute inset-0 border-2 border-green-400 rounded-full"
                initial={{ scale: 0.8, opacity: 0.8 }}
                animate={{ scale: 2, opacity: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              />
            )}
          </motion.button>

          <motion.button
            onClick={() => setReacted(reacted === "down" ? null : "down")}
            className="flex items-center gap-1 rounded-full px-3 py-1 text-[12px] relative overflow-hidden"
            style={{ background: "rgba(255,255,255,0.25)", color: textColor }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {/* Background fill animation */}
            <motion.div
              className="absolute inset-0"
              initial={{ scale: 0, opacity: 0 }}
              animate={{
                scale: reacted === "down" ? 1 : 0,
                opacity: reacted === "down" ? 0.3 : 0,
              }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 20,
              }}
              style={{ borderRadius: "inherit" }}
            />
            
            {/* Icon with animation */}
            <motion.div
              animate={{
                rotate: reacted === "down" ? [0, 10, -10, 0] : 0,
                scale: reacted === "down" ? [1, 1.2, 1] : 1,
              }}
              transition={{
                duration: 0.5,
                ease: "easeOut"
              }}
            >
              <ThumbsDown 
                className="h-4 w-4 relative z-10" 
                fill={reacted === "down" ? "currentColor" : "none"}
                style={{
                  transition: "fill 0.3s ease"
                }}
              />
            </motion.div>
            
            {/* Ripple effect */}
            {reacted === "down" && (
              <motion.div
                className="absolute inset-0 border-2 border-red-400 rounded-full"
                initial={{ scale: 0.8, opacity: 0.8 }}
                animate={{ scale: 2, opacity: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              />
            )}
          </motion.button>
          <button
          onClick={onShare}
          className="rounded-full px-3 active:scale-95 font-['Gilroy-Regular'] tracking-tighter"
          style={{ background: "rgba(255,255,255,0.25)", color: textColor }}
          aria-label="Share"
        >
          Share
        </button>
        </div>
        </div>
        {/* <button
          onClick={onShare}
          className="rounded-full p-2 active:scale-95"
          style={{ background: "rgba(255,255,255,0.25)", color: textColor }}
          aria-label="Share"
        >
          <Share2 className="h-5 w-5" />
        </button> */}
      </div>

      <AnimatePresence initial={false}>
        {feedbackOpen && (
          <motion.form
           onSubmit={(e) => {
              e.preventDefault();
              sendFeedback();
              setFeedback("");
              setFeedbackOpen(false);
            }}
            className="mt-2 flex items-center gap-2"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
          >
            <input
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Tell us something specific…"
              className={`w-full rounded-xl px-3 py-2 text-[14px] outline-none placeholder:italic placeholder:font-['Gilroy-Regular'] ${inputClassName || 'text-[#e2e8f0] placeholder:text-[#e2e8f0] bg-white/25'}`}
            />
            <button
              type="submit"
              className={`rounded-xl px-3 py-2 text-[13px] font-[600] ${buttonClassName || 'bg-white/25 text-white'}`}
            >
              <img src={imgicon} alt="Send" className="h-5 w-5" />
            </button>
          </motion.form>
        )}
      </AnimatePresence>

      <div className="mt-2 text-[12px] underline opacity-90">
        <button onClick={() => setFeedbackOpen((s) => !s)} style={{ color: textColor }}>
          {feedbackOpen ? "Close" : "Add a thought…"}
        </button>
      </div>

      <AnimatePresence>
        {shared && (
          <motion.div
            className="pointer-events-none absolute right-3 top-3 rounded-lg px-2 py-1 text-[12px]"
            style={{ background: "#0A0A0A", color: "#fff" }}
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
          >
            Shared ✓
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

interface SectionFrameProps {
  id: string;
  title: string;
  sub?: string;
  shareText: string;
  themeKey: string;
  customClass?: string;
  inputClassName?: string;
   buttonClassName?: string; 
   sessionId?: string;    // Add this
  testId?: string;       // Add this
  children: React.ReactNode;
  onToast?: (msg: string) => void;
}

const SectionFrame: React.FC<SectionFrameProps> = ({ id, title, sub, shareText, themeKey, customClass, inputClassName, buttonClassName, children, onToast, sessionId, testId }) => {
  const theme = sectionTheme(themeKey);
  const text = theme.text;
  return (
    <section
      id={id}
      className={`snap-start relative ${customClass}`}
      style={{
        minHeight: `calc(100vh - ${CTA_HEIGHT}px)`,
        background: theme.bg,
        color: text,
      }}
    >
      {text === tokens.textLight && (
        <div className="absolute inset-0 pointer-events-none" style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.08), rgba(0,0,0,0.12))" }} />
      )}
      <div className="mx-auto relative z-[1] flex h-full max-w-[390px] flex-col px-4 py-6">
        <div className="mb-1 text-[14px] opacity-85 font-['Gilroy-Regular']">{sub || ""}</div>
        <div className="mb-4 text-4xl font-[800] leading-8 font-['Gilroy-Bold'] tracking-tighter">
          {title}
        </div>
        <motion.div className="flex-1 overflow-hidden" variants={sectionVariants} initial="hidden" whileInView="show" viewport={{ amount: 0.25 }}>
          {children}
        </motion.div>
        <SectionActions title={title} share={shareText} textColor={text} onToast={onToast} inputClassName={inputClassName} buttonClassName={buttonClassName} sessionId={sessionId} testId={testId} sectionId={id} />
      </div>
    </section>
  );
};

interface StatBarProps {
  label: string;
  value: number;
  light?: boolean;
}

const StatBar: React.FC<StatBarProps> = ({ label, value, light }) => (
  <div className="mb-3">
    <div className="mb-1 flex items-center justify-between text-[12px]" style={{ opacity: 0.95 }}>
      <span>{label}</span>
      <span>{value}</span>
    </div>
    <div className="h-2 w-full rounded-full" style={{ background: light ? "rgba(255,255,255,0.25)" : "#EEF2F7" }}>
      <motion.div
        className="h-2 rounded-full"
        style={{ background: tokens.accent2, width: `${value}%` }}
        initial={{ width: 0 }}
        whileInView={{ width: `${value}%` }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      />
    </div>
  </div>
);

interface CirclePercentProps {
  percent: number;
}

const CirclePercent: React.FC<CirclePercentProps> = ({ percent }) => {
  const r = 20;
  const c = 2 * Math.PI * r;
  const dash = (percent / 100) * c;
  return (
    <svg width={64} height={64} viewBox="0 0 48 48" className="shrink-0">
      <circle cx={24} cy={24} r={r} stroke="rgba(255,255,255,0.25)" strokeWidth={4} fill="none" />
      <motion.circle
        cx={24}
        cy={24}
        r={r}
        stroke={tokens.accent2}
        strokeWidth={4}
        strokeLinecap="round"
        fill="none"
        initial={{ strokeDasharray: `0 ${c}` }}
        whileInView={{ strokeDasharray: `${dash} ${c - dash}` }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        style={{ filter: "drop-shadow(0 0 6px rgba(65,217,255,0.6))" }}
      />
      <text x="50%" y="52%" textAnchor="middle" fontSize="10" fill="#fff">
        {Math.round(percent)}%
      </text>
    </svg>
  );
};

interface AuthBannerProps {
  onSignIn: () => void;
  onPayment: () => void;
  user: User | null;
  paymentLoading: boolean;
  activeIndex?: number;
}

// const AuthBanner: React.FC<AuthBannerProps> = ({ onSignIn, onPayment, user, paymentLoading }) => (
//   <div className={`fixed top-0 left-0 right-0 z-[60] px-4 transition-all duration-300 py-2`} style={{ backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', background: 'rgba(255,255,255,0.15)' }}>
//   <div className="max-w-md flex items-center justify-between">
//     <img src={logo} alt="Logo" className="w-20 h-14" />
//     {!user ? (
//       <>
//         <button
//           onClick={onSignIn}
//           className="font-['Gilroy-Regular'] tracking-tight bg-white/20 text-black px-4 py-2 rounded-lg border border-black shadow-md"
//         >
//           Save
//         </button>
//       </>
//     ) : (
//       <>
//         <span className="text-green-600 font-medium">✓ Signed in</span>
//         <button
//           onClick={onPayment}
//           disabled={paymentLoading}
//           className="bg-green-600/90 backdrop-blur-sm text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 border border-green-500/20"
//         >
//           {paymentLoading ? 'Processing...' : 'Get Premium'}
//         </button>
//       </>
//     )}
//   </div>
// </div>

// );

// Main Component
const AuthBanner: React.FC<AuthBannerProps> = ({ onSignIn, onPayment, user, paymentLoading, activeIndex = 0 }) => {
  // Function to get glass background based on section
  const getGlassBackground = (index: number) => {
    const sectionKeys = ["emotional", "mind", "findings", "quotes", "films", "subjects", "astrology", "books", "work"];
    const currentSection = sectionKeys[index];
    
    // Light sections get white tint, dark sections get subtle dark tint
    if (currentSection === "quotes" || currentSection === "subjects" || currentSection === "books") {
      return 'rgba(255,255,255,0.15)'; // White tint for light sections
    } else {
      return 'rgba(255,255,255,0.1)'; // Slightly less white for dark sections
    }
  };

  return (
    <div 
      className={`fixed top-0 left-0 right-0 z-[60] px-4 transition-all duration-300 py-0`} 
      style={{ 
        backdropFilter: 'blur(16px)', 
        WebkitBackdropFilter: 'blur(16px)', 
        background: getGlassBackground(activeIndex) 
      }}
    >
      <div className="max-w-md flex items-center justify-between">
        <img src={logo} alt="Logo" className="w-20 h-14" />
        {!user ? (
          <>
            <button
              onClick={onSignIn}
              className="font-['Gilroy-Regular'] tracking-tight bg-white/20 text-black px-4 py-2 rounded-lg border border-black shadow-md"
            >
              Save
            </button>
          </>
        ) : (
          <>
            <span className="text-green-600 font-medium">✓ Signed in</span>
            <button
              onClick={onPayment}
              disabled={paymentLoading}
              className="bg-green-600/90 backdrop-blur-sm text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 border border-green-500/20"
            >
              {paymentLoading ? 'Processing...' : 'Get Premium'}
            </button>
          </>
        )}
      </div>
    </div>
  );
};


interface QuestResultFullscreenProps {
  sessionId?: string;
  testId?: string;
  className?: string;
}

const QuestResultFullscreen: React.FC<QuestResultFullscreenProps> = ({ 
  sessionId, 
  testId, 
  className = '' 
}) => {
  const [tip, setTip] = useState<string | null>(null);
  const [resultData] = useState<ResultData>(MOCK_RESULT_DATA);
  const [mockUser, setMockUser] = useState<User | null>(null);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [showMeta, setShowMeta] = useState(false);
  const [upsellOpen, setUpsellOpen] = useState(false);
  
  const containerRef = useRef<HTMLDivElement | null>(null);
  const toastTimerRef = useRef<number | null>(null);
  const metaTimerRef = useRef<number | null>(null);

  const sectionIds = ["emotional", "mind", "findings", "quotes", "films", "subjects", "astrology", "books", "work"];

  const onToast = (msg: string) => {
    setToast(msg);
    if (toastTimerRef.current) window.clearTimeout(toastTimerRef.current);
    toastTimerRef.current = window.setTimeout(() => setToast(null), 1200);
  };

  useEffect(() => {
    if (!tip) return;
    const t = setTimeout(() => setTip(null), 2000);
    return () => clearTimeout(t);
  }, [tip]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    
    const handler = () => {
      const rect = el.getBoundingClientRect();
      let best = 0;
      let bestDist = Infinity;
      
      sectionIds.forEach((id, i) => {
        const s = document.getElementById(id);
        if (!s) return;
        const r = s.getBoundingClientRect();
        const dist = Math.abs(r.top - rect.top);
        if (dist < bestDist) { 
          bestDist = dist; 
          best = i; 
        }
      });
      
      setActiveIndex(best);
      setShowMeta(true);
      
      if (metaTimerRef.current) window.clearTimeout(metaTimerRef.current);
      metaTimerRef.current = window.setTimeout(() => setShowMeta(false), 1500);
    };
    
    el.addEventListener('scroll', handler, { passive: true });
    handler();
    
    return () => {
      el.removeEventListener('scroll', handler);
      if (metaTimerRef.current) window.clearTimeout(metaTimerRef.current);
      if (toastTimerRef.current) window.clearTimeout(toastTimerRef.current);
    };
  }, [sectionIds]);

  // Mock API handlers (commented real implementation)
  const handleSignIn = async () => {
    /*
    try {
      await signInWithGoogle();
      onToast('Successfully signed in!');
    } catch (error) {
      onToast('Sign-in failed. Please try again.');
    }
    */
    
    // Mock implementation
    setMockUser({ id: 'mock-123', email: 'user@example.com', name: 'Mock User' });
    onToast('Mock sign-in successful!');
  };

  const handlePayment = async () => {
    /*
    if (!user?.id) {
      onToast('Please sign in first');
      return;
    }
    
    setPaymentLoading(true);
    try {
      const paymentResult = await PaymentService.startPayment(sessionId!, testId!);
      if (paymentResult.success) {
        onToast('Payment successful!');
      } else {
        onToast(paymentResult.error || 'Payment failed.');
      }
    } catch (error) {
      onToast('Payment failed. Please try again.');
    } finally {
      setPaymentLoading(false);
    }
    */
    
    // Mock implementation
    if (!mockUser) {
      onToast('Please sign in first');
      return;
    }
    
    setPaymentLoading(true);
    setTimeout(() => {
      setPaymentLoading(false);
      onToast('Mock payment successful!');
    }, 2000);
  };

  // Extract data from mock result
  const mindCard = resultData.results["Mind Card"];
  const findings = resultData.results.findings || [];
  const quotes = resultData.results.quotes || [];
  const films = resultData.results.films || [];
  const subjects = resultData.results.subjects || [];
  const astrology = resultData.results.astrology;
  const books = resultData.results.books || [];
  const actionItem = resultData.results.actionItem || '';

  // Convert mind card data to stats format
  const mindStats = mindCard?.attributes.map((attr, index) => {
    const scoreText = mindCard.scores[index] || "0/100";
    const scoreValue = parseInt(scoreText.split('/')[0]);
    return {
      label: attr.charAt(0).toUpperCase() + attr.slice(1),
      value: scoreValue
    };
  }) || [];

  return (
    <div className={`min-h-screen w-full bg-white text-gray-900 ${className}`}>
      {/* Auth Banner */}
      <AuthBanner 
        onSignIn={handleSignIn}
        onPayment={handlePayment}
        user={mockUser}
        paymentLoading={paymentLoading}
        activeIndex={activeIndex}
      />

      {/* Main Content */}
      <div
        className="mx-auto max-w-[390px] overflow-y-auto"
        ref={containerRef}
        style={{ 
          scrollSnapType: "y mandatory", 
          height: `calc(100vh - ${CTA_HEIGHT}px`,
        }}
      >
        {/* Intro helper bubble */}
        {/* <div className="pointer-events-none absolute left-20 top-5 z-40 rounded-2xl bg-white px-3 py-2 text-[12px] leading-4" style={{ border: `1px solid ${tokens.border}`, boxShadow: "0 10px 30px rgba(12,69,240,0.06)" }}>
          Here's what I've learned about you…
        </div> */}

        {/* Emotional Mirror Section */}
        {/* <SectionFrame 
          id="emotional" 
          title="Emotional Mirror" 
          sub="Your mind, in one sentence." 
          shareText={resultData.results["section 1"] || ""} 
          themeKey="emotional" 
          onToast={onToast}
        >
          <div className="flex h-full flex-col items-center justify-center text-left tracking-tight">
            <div className="rounded-3xl px-4 py-3 text-[18px] leading-7" style={{ background: "rgba(255,255,255,0.15)" }}>
              {resultData.results["section 1"]}
            </div>
          </div>
        </SectionFrame> */}

        <SectionFrame 
          id="emotional" 
          title="" 
          sub="" 
          shareText={resultData.results["section 1"] || ""} 
          themeKey="emotional" 
          onToast={onToast}
          sessionId={sessionId}
         testId={testId}
        >
          <div className="relative w-full max-w-[480px] mx-auto pt-4">
            <motion.h1 className="mb-5 text-left">
              <span className="block text-sm uppercase tracking-[0.3em] text-white/70 mb-1">Analysis Complete</span>
              <span className="block text-5xl font-['Gilroy-Bold'] tracking-tighter bg-gradient-to-r from-white via-blue-100 to-blue-200 bg-clip-text text-transparent">
                Let's explore Your Mind
              </span>
              <span className="block mt-1 w-20 h-1 bg-white/50 rounded-full"></span>
            </motion.h1>

            <motion.div className="rounded-[28px] bg-white/10 backdrop-blur-xl ring-1 ring-white/20 p-6 text-white">
              <p className="text-sm text-white/80 font-['Gilroy-Regular']">Your mind, in one sentence.</p>
              <h2 className="mt-1 text-[44px] leading-[0.95] font-['Gilroy-Bold'] tracking-tighter">Emotional<br />Mirror</h2>

              <div className="mt-2 rounded-3xl font-['Gilroy-Regular'] bg-white text-slate-900 p-2 shadow-[0_10px_30px_rgba(0,0,0,.12)]">
                <p className="text-xl leading-tight p-2">{resultData.results["section 1"]}</p>
              </div>
            </motion.div>
          </div>
        </SectionFrame>

        {/* Mind Card Section */}
        <SectionFrame 
          id="mind" 
          title="Your Mind Card" 
          sub="Archetype & stats" 
          shareText={`${mindCard?.name || 'Mind Card'}; ${mindStats.map(s => `${s.label} ${s.value}`).join(', ')}.`}
          themeKey="mind" 
          onToast={onToast}
          customClass="pt-16"
          sessionId={sessionId}
          testId={testId}
        >
          <div className="grid grid-rows-[auto_1fr] gap-4">
            {mindCard && (
              <>
                <div className="text-center">
                  <div className="text-xl font-bold text-cyan-300 mb-2 font-['Gilroy-Bold'] tracking-tighter">{mindCard.name}</div>
                  <div className="text-sm text-white/80 font-['Gilroy-semiBold'] ">{mindCard.description}</div>
                </div>
                <div className="space-y-3 pr-3">
                  {mindStats.map((stat, i) => (
                    <motion.div key={stat.label} initial={{ opacity: 0, y: 6 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04, duration: DUR_SM, ease: EASE_OUT }}>
                      <StatBar label={stat.label} value={stat.value} light />
                    </motion.div>
                  ))}
                </div>
              </>
            )}
          </div>
        </SectionFrame>

        {/* Findings Section */}
        <SectionFrame 
          id="findings" 
          title="5 Unique Findings About You" 
          sub="Thought Provoking Insights" 
          shareText={findings.join("\n")} 
          themeKey="findings" 
          onToast={onToast}
          customClass="pt-16"
          sessionId={sessionId}
          testId={testId}
        >
          <div className="-mx-4 h-full overflow-x-auto px-4">
            <div className="flex flex-col h-full snap-x items-center gap-3 max-h-60 overflow-y-auto">
              {findings.map((finding, i) => (
                <div key={i} className="snap-center rounded-2xl p-4 text-[15px] leading-6 font-['Gilroy-Regular']" style={{ minWidth: 280, background: "rgba(255,255,255,0.18)" }}>
                  {finding}
                </div>
              ))}
            </div>
          </div>
        </SectionFrame>

        {/* Quotes Section */}
        <SectionFrame 
          id="quotes" 
          title="Philosophical Quotes That Mirrors Your Psyche" 
          sub="Save the ones that hit" 
          shareText={quotes.map((q) => `"${q.text}" — ${q.author}`).join("\n")} 
          themeKey="quotes" 
           inputClassName="placeholder:text-gray-700 bg-gray-100/30 text-gray-800 border border-gray-300"
          buttonClassName="bg-blue-600 text-white hover:bg-blue-700 border border-blue-600" 
          onToast={onToast}
          customClass="pt-20 pb-24"
          sessionId={sessionId}
          testId={testId}
        >
          <ul className="grid content-center gap-3 max-h-60 overflow-y-auto">
            {quotes.map((quote, i) => (
              <li key={i} className="rounded-2xl bg-white p-3" style={{ border: `1px solid ${tokens.border}` }}>
                <div className="flex items-start gap-2">
                  <Quote className="mt-0.5 h-4 w-4" color={tokens.accent} />
                  <div>
                    <div className="text-[14px] leading-5">"{quote.text}"</div>
                    <div className="text-[12px]" style={{ color: tokens.muted }}>— {quote.author}</div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </SectionFrame>

        {/* Films Section */}
        <SectionFrame 
          id="films" 
          title="Films That Will Hit Closer Than Expected" 
          sub="Weekend cues" 
          shareText={films.map((f) => `${f.title} — ${f.description}`).join("\n")} 
          themeKey="films" 
          onToast={onToast}
          customClass="pt-16 pb-16"
          sessionId={sessionId}
          testId={testId}
        >
          <ul className="grid content-center gap-3 max-h-60 overflow-y-auto">
            {films.map((film, i) => (
              <li key={i} className="rounded-2xl bg-white/10 p-3">
                <div className="flex items-start gap-2">
                  <Film className="mt-0.5 h-4 w-4" />
                  <div>
                    <div className="font-[600]">{film.title}</div>
                    <div className="text-[13px] opacity-90">{film.description}</div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </SectionFrame>

        {/* Subjects Section */}
        <SectionFrame 
          id="subjects" 
          title="Subjects You Are Mentally Built to Explore Deeper" 
          sub="Deepen the edges" 
          shareText={subjects.map(s => `${s.title}: ${s.description}`).join("; ")} 
          themeKey="subjects" 
           inputClassName="placeholder:text-gray-700 bg-gray-100/30 text-gray-800 border border-gray-300"
          buttonClassName="bg-blue-600 text-white hover:bg-blue-700 border border-blue-600" 
          onToast={onToast}
          customClass="pt-20"
          sessionId={sessionId}
          testId={testId}
        >
          <div className="grid h-full content-center gap-3">
            {subjects.map((subject, i) => (
              <div key={i} className="rounded-2xl bg-white p-3 text-[15px]" style={{ border: `1px solid ${tokens.border}` }}>
                <div className="font-semibold text-gray-900">{subject.title}</div>
                <div className="text-sm text-gray-600 mt-1">{subject.description}</div>
                <div className="text-xs text-blue-600 mt-2">{subject.matchPercentage}% match</div>
              </div>
            ))}
          </div>
        </SectionFrame>

        {/* Astrology Section */}
        {astrology && (
          <SectionFrame 
            id="astrology" 
            title="Our Take on Astrology" 
            sub="Apologies to the cosmos" 
            shareText={astrology.description} 
            themeKey="astrology" 
            onToast={onToast}
            customClass="pt-12 pb-8"
            sessionId={sessionId}
            testId={testId}
          >
            <div className="flex h-full flex-col justify-center gap-4">
              <div className="text-center">
                <Sparkles className="h-5 w-6 mx-auto mb-1" />
                <div className="text-[16px] font-['Gilroy-Bold']">
                  You behave more like a <span className="underline">{astrology.behavioralSign}</span> than your actual sign ({astrology.actualSign}).
                </div>
                <div className="max-w-[320px] mx-auto opacity-90 text-sm font-['Gilroy-Regular'] leading-[1]">
                  {astrology.description}
                </div>
              </div>
              
              {/* Predictions Grid */}
              <div className="grid grid-cols-1 gap-3 max-h-60 overflow-y-auto">
                {astrology.predictions.slice(0, 3).map((prediction, i) => (
                  <div key={i} className="rounded-2xl bg-white/10 p-3 flex items-center gap-3">
                    <CirclePercent percent={prediction.likelihood} />
                    <div className="text-[13px] leading-5">
                      <div className="font-[600]">{prediction.title}</div>
                      <div className="opacity-90">Why: {prediction.reason}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </SectionFrame>
        )}

        {/* Books Section */}
        <SectionFrame 
          id="books" 
          title="Books You'd Love If You Give Them a Chance" 
          sub="3 high-yield picks" 
          shareText={books.map((b) => `${b.title} — ${b.author}`).join("\n")}
          inputClassName="placeholder:text-gray-700 bg-gray-100/30 text-gray-800 border border-gray-300"
          buttonClassName="bg-blue-600 text-white hover:bg-blue-700 border border-blue-600" 
          themeKey="books" 
          onToast={onToast}
          customClass="pt-24"
          sessionId={sessionId}
          testId={testId}
        >
          <div className="grid h-full grid-cols-3 content-center gap-3">
            {books.map((book, i) => (
              <div key={i} className="flex flex-col items-center gap-2">
                <div className="h-24 w-16 rounded-lg flex items-center justify-center" style={{ background: i % 2 ? tokens.accent : tokens.accent2, boxShadow: "0 8px 20px rgba(12,69,240,0.22)" }}>
                  <BookOpen className="h-6 w-6 text-white" />
                </div>
                <div className="text-center text-[12px] leading-4" style={{ color: tokens.textDark }}>
                  <div className="font-[700]">{book.title}</div>
                  <div style={{ color: tokens.muted }}>{book.author}</div>
                </div>
              </div>
            ))}
          </div>
        </SectionFrame>

        {/* Action Item Section */}
        <SectionFrame 
          id="work" 
          title="One Thing To Work On" 
          sub="Start today; 60-minute cap" 
          shareText={actionItem} 
          themeKey="work" 
          onToast={onToast}
          customClass="pt-28"
          sessionId={sessionId}
          testId={testId}
        >
          <div className="flex h-full flex-col items-center justify-center text-center">
            <div className="rounded-2xl bg-white/10 p-4 text-[16px] leading-6">
              <div className="font-[800] mb-2">{actionItem}</div>
              <div className="opacity-95 text-sm">Max 60 minutes • Public or private but logged • 1-line reflection afterward.</div>
            </div>
          </div>
        </SectionFrame>
      </div>

      {/* Progress Rail */}
      <div className="fixed right-2 top-1/2 z-[55] -translate-y-1/2 flex flex-col items-center gap-2">
        {sectionIds.map((id, i) => (
          <button
            key={id}
            aria-label={`Jump to ${id}`}
            onClick={() => containerRef.current?.querySelector(`#${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
            className="transition-all"
            style={{ 
              width: 6, 
              height: i === activeIndex ? 20 : 6, 
              borderRadius: 9999, 
              background: i === activeIndex ? tokens.accent : 'rgba(10,10,10,0.25)' 
            }}
          />
        ))}
      </div>

      {/* Meta Counter */}
      {/* <AnimatePresence>
        {showMeta && (
          <motion.div
            className="fixed left-3 z-[55] rounded-full px-2 py-1 text-[11px]"
            style={{ bottom: CTA_HEIGHT + 8, background: 'rgba(0,0,0,0.6)', color: '#fff' }}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
          >
            {activeIndex + 1} / {sectionIds.length}
          </motion.div>
        )}
      </AnimatePresence> */}

      {/* Toast Notifications */}
      <AnimatePresence>
        {toast && (
          <motion.div
            className="fixed left-1/2 z-[70] -translate-x-1/2 rounded-2xl px-3 py-2 text-[12px]"
            style={{ bottom: CTA_HEIGHT + 16, background: '#0A0A0A', color: '#fff', boxShadow: '0 10px 30px rgba(12,69,240,.12)' }}
            initial={{ opacity: 0, scale: 0.98, y: 6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: 6 }}
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Orb Component */}
      {/* <Orb onTip={() => setTip("Tap share on any section → native share or copy.")} /> */}



      {/* Sticky CTA + Upsell */}
      <StickyCTA onOpen={() => setUpsellOpen(true)} />
      <UpsellSheet 
        open={upsellOpen} 
        onClose={() => setUpsellOpen(false)}
        onPayment={handlePayment}
        paymentLoading={paymentLoading}
      />

      {/* Tip Tooltip */}
      <AnimatePresence>
        {tip && (
          <motion.div
            className="fixed bottom-20 right-20 z-[65] rounded-2xl bg-black/80 px-3 py-2 text-[12px] text-white max-w-48"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            {tip}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom CTA Space */}
      <div style={{ height: CTA_HEIGHT }} />

      {/* Commented Axios Implementation */}
      {/*
      // Real API implementation (commented out)
      useEffect(() => {
        const fetchResultData = async () => {
          try {
            setIsLoading(true);
            const userId = auth.user?.id || 'anonymous';
            const response = await axios.get(
              `https://api.fraterny.in/api/report/${currentSessionId}/${userId}/${currenttestid}`, 
              {
                headers: { 'Content-Type': 'application/json' },
                timeout: 30000
              }
            );
            
            const analysisData = response.data;
            if (typeof analysisData.results === 'string') {
              analysisData.results = JSON.parse(analysisData.results);
            }
            
            const validatedData = validateResultData(analysisData);
            setResultData(validatedData);
            setIsLoading(false);
          } catch (axiosError: any) {
            if (axiosError.code === 'ECONNABORTED') {
              throw new Error('Request timeout - analysis may still be processing');
            } else if (axiosError.response?.status === 404) {
              throw new Error('Analysis not found - please try again later');
            } else if (axiosError.response?.status === 401) {
              throw new Error('Unauthorized access - please log in again');
            } else {
              throw new Error(`Network error: ${axiosError.message}`);
            }
          }
        };
        
        if (currentSessionId && currenttestid) {
          fetchResultData();
        }
      }, [currentSessionId, currenttestid, auth?.user?.id]);
      */}
    </div>
  );
};

export default QuestResultFullscreen;