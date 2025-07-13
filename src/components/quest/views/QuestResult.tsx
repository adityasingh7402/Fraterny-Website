// // -------------------------------------------------------------------------- //
// /**
//  * QuestResult.tsx
//  * Component for displaying psychology assessment results with enhanced parsing
//  * Updated to use cardUtils parseContent function instead of regex parsing
//  */
// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { motion } from 'framer-motion';
// import ReactMarkdown from 'react-markdown';
// import { Download, Share2, Home, AlertTriangle } from 'lucide-react';
// // import axios from 'axios'; // For future backend integration

// // Import card components
// import { MindCard, FindingsCard, QuotesCard } from './questresultcards';
// import FilmsCard from './questresultcards/FilmsCard';
// import SubjectsCard from './questresultcards/SubjectsCard';
// import AstrologyCard from './questresultcards/AstrologyCard';
// import BooksCard from './questresultcards/BooksCard';
// import ActionCard from './questresultcards/ActionCard';

// // Import animation utilities
// import { headerVariants, sectionVariants, buttonVariants } from './questresultcards/utils/animations';

// // Import layout components
// import QuestLayout from '../layout/QuestLayout';

// // Import context
// import { useAuth } from '../../../contexts/AuthContext';

// // Import the enhanced parseContent function from cardUtils
// import { parseContent } from './questresultcards/utils/cardUtils';

// // Import Aurora Background
// import { AuroraBackground } from './questresultcards/utils/aurora-background';

// export interface QuestResultProps {
//   className?: string;
// }

// interface ResultData {
//   session_id: string;
//   user_id?: string;
//   completion_date: string;
//   results: {
//     "section 1"?: string;
//     "Mind Card"?: {
//       personality?: string;
//       attribute: string[];
//       score: string[];
//       insight: string[];
//     };
//     "section 3"?: string;
//   };
// }

// export function QuestResult({ className = '' }: QuestResultProps) {
//   const { sessionId } = useParams<{ sessionId: string }>();
//   const navigate = useNavigate();
//   const auth = useAuth();
  
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [resultData, setResultData] = useState<ResultData | null>(null);
  
//   // Get session ID from URL params or localStorage
//   const currentSessionId = sessionId || localStorage.getItem('questSessionId');
  
//   useEffect(() => {
//     // If no session ID is available, redirect to homepage or error page
//     if (!currentSessionId) {
//       setError('No session ID found. Please complete an assessment first.');
//       return;
//     }
    
//     // Fetch result data from the backend
//     const fetchResultData = async () => {
//       try {
//         setIsLoading(true);
        
//         // For now, use mock data
//         setTimeout(() => {
//           // Enhanced mock result data structure
//           const mockResultData: ResultData = {
//             session_id: currentSessionId,
//             user_id: auth?.user?.id,
//             completion_date: new Date().toISOString(),
//             results: {
//               "section 1": "You carry ambition quietly, working tirelessly but yearning for the playful freedom you missed as a child.",
//               "Mind Card": {
//                 personality: "#Game-Styled Mindcard",
//                 attribute: ["self awareness","collaboration","conflict navigation","risk appetite"],
//                 score: ["65/100","75/100","90/100","85/100"],
//                 insight: [
//                   "Your self-awareness is growing; you know strengths but underplay emotional needs.",
//                   "You collaborate respectfully, valuing others' input while driving your own projects.",
//                   "You resolve conflicts playfully and quickly, maintaining strong familial bonds.",
//                   "You embrace ambitious risks, juggling research, business, and sporting dreams fearlessly."
//                 ]
//               },
//               "section 3": "**5 Most Thought Provoking Findings about You** 😲\\n1. Your childhood's disciplined push shaped an unquenchable ambition that fuels both research and entrepreneurship.\\n2. You harbor a silent altruism: you dream of wealth not for yourself but to uplift underprivileged students.\\n3. Your emotional reserve around anger reveals a gentle core, cautious of hurting others even when constrained.\\n4. Balancing PhD rigor and cricket aspirations, you forge a unique identity bridging science and sport.\\n5. Your rapid learning skill acts as a secret superpower, accelerating your growth in any domain.\\n\\n**5 Philosophical Quotes That Mirror Your Psyche** 🤔\\n\"Ambition is the path, but satisfaction is the journey.\" – reminds you balance drive and joy.\\n\"The mind, once stretched by new ideas, never returns to its original dimensions.\" – reflects your love of learning.\\n\"True generosity is giving without remembering; self-care without hesitation.\" – mirrors your altruistic vision.\\n\"Strength lies in gentleness; power in self-awareness.\" – echoes your quiet but determined nature.\\n\"To dare is to lose one's footing momentarily; not to dare is to lose oneself.\" – captures your bold risk-taking.\\n\\n**5 Films That Hit Closer Than Expected** 🎬\\nThe Theory of Everything – brilliance meets heartache.\\nLagaan – ambition and teamwork under pressure.\\nGood Will Hunting – hidden genius, quiet resilience.\\nChak De! India – passion for sport and pride.\\nThe Social Network – innovation driven by obsession.\\n\\n**3 Subjects You're Mentally Built To Explore Deeper** 📚\\nNeuroeconomics – merging decision, emotion, and risk.\\nSports psychology – decoding focus in athletes.\\nPhilosophy of education – shaping future learners.\\n\\n**Our take on Astrology (We apologize to the cosmos):** 🔮\\nBased on behavioral psychology, your personality aligns more with Virgo's discipline than your Aries flair.\\nActual sun sign: Aries – bold, pioneering, and restless.\\n1. You'll excel in multidisciplinary projects – Likelihood: 82% | Why: Your rapid learning and diverse goals.\\n2. You'll struggle to express anger openly – Likelihood: 76% | Why: You avoid conflict to preserve harmony.\\n3. A philanthropic milestone emerges in two years – Likelihood: 68% | Why: Your altruistic financial goals.\\n4. You'll pivot career paths within five years – Likelihood: 71% | Why: Your blend of science and sport passions.\\n5. Strong mentorship bonds will redefine your confidence – Likelihood: 64% | Why: You seek guidance but rarely ask.\\n\\n**3 Books You'd Love If You Gave Them a Chance** 📖\\nAtomic Habits by James Clear\\nMindset by Carol Dweck\\nFlow by Mihaly Csikszentmihalyi\\n\\n**One Thing You Should Work On (Right Now):** 🎯\\nPractice expressing your needs: voice one honest concern daily for a week."
//             }
//           };
          
//           // Check if the result belongs to the current user
//           if (auth?.user?.id && mockResultData.user_id !== auth?.user?.id) {
//             setError('You are not authorized to view these results.');
//             setIsLoading(false);
//             return;
//           }
          
//           setResultData(mockResultData);
//           setIsLoading(false);
//         }, 1500);
        
//         // COMMENTED OUT: Real implementation for fetching data from backend with axios
//         /*
//         try {
//           // 1. First verify this session belongs to the current user
//           const { data: sessionHistory, error: sessionError } = await supabase
//             .from('user_session_history')
//             .select('*')
//             .eq('session_id', currentSessionId)
//             .eq('user_id', auth?.user?.id)
//             .single();
          
//           if (sessionError || !sessionHistory) {
//             throw new Error('Session not found or not authorized');
//           }
          
//           // 2. Fetch the analysis result from your AI backend using axios
//           const response = await axios.get(`${process.env.REACT_APP_API_URL}/quest-analysis/${currentSessionId}`, {
//             headers: {
//               'Content-Type': 'application/json',
//               'Authorization': `Bearer ${auth?.session?.access_token || ''}`
//             },
//             timeout: 30000 // 30 second timeout
//           });
          
//           const analysisData = response.data;
          
//           // 3. Format the data to match your frontend structure
//           const formattedData: ResultData = {
//             session_id: currentSessionId,
//             user_id: auth?.user?.id,
//             completion_date: sessionHistory.created_at,
//             results: {
//               "section 1": analysisData.core_essence || "Analysis still processing...",
//               "Mind Card": analysisData.mind_card || {
//                 personality: "#Game-Styled Mindcard",
//                 attribute: ["self awareness","collaboration","conflict navigation","risk appetite"],
//                 score: ["50/100","50/100","50/100","50/100"],
//                 insight: [
//                   "Still analyzing...",
//                   "Still analyzing...",
//                   "Still analyzing...",
//                   "Still analyzing..."
//                 ]
//               },
//               "section 3": analysisData.deep_insights || "Analysis still processing..."
//             }
//           };
          
//           setResultData(formattedData);
//           setIsLoading(false);
          
//           // 4. Update the session history to mark as viewed
//           await supabase
//             .from('user_session_history')
//             .update({ is_viewed: true })
//             .eq('session_id', currentSessionId)
//             .eq('user_id', auth?.user?.id);
            
//         } catch (axiosError: any) {
//           if (axiosError.code === 'ECONNABORTED') {
//             throw new Error('Request timeout - analysis may still be processing');
//           } else if (axiosError.response?.status === 404) {
//             throw new Error('Analysis not found - please try again later');
//           } else if (axiosError.response?.status === 401) {
//             throw new Error('Unauthorized access - please log in again');
//           } else {
//             throw new Error(`Network error: ${axiosError.message}`);
//           }
//         }
//         */
        
//       } catch (err) {
//         console.error('Error fetching result data:', err);
//         setError('Failed to fetch your assessment results. Please try again later.');
//         setIsLoading(false);
//       }
//     };
    
//     fetchResultData();
//   }, [currentSessionId, auth?.user?.id]);
  
//   // Handle downloading results as PDF (placeholder)
//   const handleDownloadResults = () => {
//     alert('Download functionality will be implemented based on requirements.');
//   };
  
//   // Handle sharing results (placeholder)
//   const handleShareResults = () => {
//     alert('Share functionality will be implemented based on requirements.');
//   };
  
//   // Handle retry if loading failed
//   const handleRetry = () => {
//     setIsLoading(true);
//     setError(null);
//     window.location.reload();
//   };
  
//   // Return to dashboard/homepage
//   const handleReturnHome = () => {
//     navigate('/');
//   };
  
//   // Loading state
//   if (isLoading) {
//     return (
//       <QuestLayout showHeader={true} showNavigation={false} className={className}>
//         <div className="flex flex-col items-center justify-center py-12 min-h-[60vh]">
//           <motion.div
//             animate={{
//               rotate: 360,
//               scale: [1, 1.1, 1],
//             }}
//             transition={{
//               rotate: { duration: 1.5, repeat: Infinity, ease: "linear" },
//               scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
//             }}
//             className="w-16 h-16 border-4 border-navy border-t-transparent rounded-full mb-6"
//           />
//           <p className="text-gray-600 text-lg">Loading your assessment results...</p>
//           <p className="text-gray-400 text-sm mt-2">Analyzing your psychological profile...</p>
//         </div>
//       </QuestLayout>
//     );
//   }
  
//   // Error state
//   if (error) {
//     return (
//       <QuestLayout showHeader={true} showNavigation={false} className={className}>
//         <div className="flex flex-col items-center justify-center py-12 px-4 text-center min-h-[60vh]">
//           <motion.div
//             initial={{ scale: 0.9, opacity: 0 }}
//             animate={{ scale: 1, opacity: 1 }}
//             className="bg-red-50 text-red-700 p-4 rounded-lg mb-6 inline-flex items-center"
//           >
//             <AlertTriangle className="h-6 w-6 mr-2" />
//             Error
//           </motion.div>
//           <h2 className="text-xl font-semibold text-navy mb-4">Unable to Load Results</h2>
//           <p className="text-gray-600 mb-6 max-w-md">{error}</p>
//           <div className="flex flex-col sm:flex-row gap-4">
//             <button
//               onClick={handleRetry}
//               className="px-6 py-3 bg-navy text-white rounded-lg hover:bg-navy/90 transition-colors"
//             >
//               Try Again
//             </button>
//             <button
//               onClick={handleReturnHome}
//               className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
//             >
//               Return Home
//             </button>
//           </div>
//         </div>
//       </QuestLayout>
//     );
//   }

//   // 🎯 MAIN CHANGE: Use cardUtils parseContent instead of regex parsing
//   console.log('🔄 Using cardUtils parseContent function...');
//   const rawContent = resultData?.results["section 3"] || '';
  
//   // Convert escaped newlines to actual newlines before parsing
//   const processedContent = rawContent.replace(/\\n/g, '\n');
//   console.log('📝 Processed content preview:', processedContent.substring(0, 300) + '...');
  
//   // Use the enhanced parseContent function from cardUtils
//   const parsedContent = parseContent(processedContent);
//   console.log('✅ Content parsed successfully:', parsedContent);
  
//   // Animation variants for staggered reveals
//   const cardVariants = {
//     hidden: { opacity: 0, y: 30, scale: 0.95 },
//     visible: { 
//       opacity: 1, 
//       y: 0, 
//       scale: 1,
//       transition: { duration: 0.6, ease: [0.23, 1, 0.32, 1] }
//     }
//   };

//   // Success state - display results
//   return (
//     <div className="min-h-screen">
//       {/* Hero Section - UNCHANGED */}
//       <section className="pb-12 pt-24 bg-navy text-white">
//         <div className="container mx-auto px-6">
//           <motion.div
//             initial="hidden"
//             animate="visible"
//             variants={{
//               hidden: { opacity: 0 },
//               visible: {
//                 opacity: 1,
//                 transition: {
//                   staggerChildren: 0.2
//                 }
//               }
//             }}
//           >
//             {/* Header section */}
//             <div className="mb-12">
//               <motion.h1 
//                 variants={headerVariants}
//                 className="text-4xl font-playfair text-white mb-4"
//               >
//                 Your Assessment Results
//               </motion.h1>
//               <motion.p 
//                 variants={headerVariants}
//                 className="text-gray-300 text-lg"
//               >
//                 Completed on {new Date(resultData?.completion_date || '').toLocaleDateString('en-US', {
//                   weekday: 'long',
//                   year: 'numeric',
//                   month: 'long',
//                   day: 'numeric'
//                 })}
//               </motion.p>
              
//               {/* Action buttons */}
//               <motion.div 
//                 variants={buttonVariants}
//                 className="flex flex-wrap gap-3 mt-8 justify-start"
//               >
//                 <button
//                   onClick={handleDownloadResults}
//                   className="px-6 py-3 bg-white text-navy rounded-xl hover:bg-gray-100 transition-all duration-300 text-sm flex items-center shadow-lg hover:shadow-xl hover:scale-105"
//                 >
//                   <Download className="h-4 w-4 mr-2" />
//                   Download PDF
//                 </button>
//                 <button
//                   onClick={handleShareResults}
//                   className="px-6 py-3 bg-terracotta text-white rounded-xl hover:bg-terracotta/90 transition-all duration-300 text-sm flex items-center shadow-lg hover:shadow-xl hover:scale-105"
//                 >
//                   <Share2 className="h-4 w-4 mr-2" />
//                   Share Results
//                 </button>
//               </motion.div>
//             </div>
//           </motion.div>
//         </div>
//       </section>
            
//       {/* Content Section - AURORA BACKGROUND ADDED */}
//       <AuroraBackground className="min-h-0">
//         <div className="container mx-auto px-6 py-12">
//           {/* Section 1 - Core Essence */}
//           {resultData?.results["section 1"] && (
//             <motion.div 
//               initial="hidden"
//               animate="visible"
//               variants={cardVariants}
//               transition={{ delay: 0.2 }}
//               className="bg-gradient-to-br from-white to-slate-50 rounded-2xl shadow-xl p-8 mb-8 md:mb-10 lg:mb-12 border border-slate-200/50"
//             >
//               <div className="flex items-center mb-6">
//                 <div className="w-1 h-8 bg-gradient-to-b from-navy to-terracotta rounded-full mr-4" />
//                 <h3 className="text-2xl font-bold text-navy">Your Core Essence</h3>
//               </div>
//               <div className="relative">
//                 <div className="absolute -left-2 -top-2 text-6xl text-terracotta/20 font-serif">"</div>
//                 <p className="text-gray-700 text-xl italic font-light leading-relaxed pl-8">
//                   {resultData.results["section 1"]}
//                 </p>
//                 <div className="absolute -right-2 -bottom-6 text-6xl text-terracotta/20 font-serif">"</div>
//               </div>
//             </motion.div>
//           )}
          
//           {/* MindCard - Center column */}
//           <motion.div 
//             initial="hidden"
//             animate="visible"
//             variants={cardVariants}
//             transition={{ delay: 0.4 }}
//             className="mb-8 md:mb-10 lg:mb-12"
//           >
//             {resultData?.results["Mind Card"] && (
//               <MindCard data={resultData.results["Mind Card"]} />
//             )}
//           </motion.div>
          
//           {/* Findings and Quotes - Two column layout on desktop, stack on mobile */}
//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 mb-8 md:mb-10 lg:mb-12">
//             {/* QuotesCard - Left column */}
//             {parsedContent.quotes.length > 0 && (
//               <motion.div 
//                 initial="hidden"
//                 animate="visible"
//                 variants={cardVariants}
//                 transition={{ delay: 0.6 }}
//                 className="w-full"
//               >
//                 <QuotesCard quotes={parsedContent.quotes} />
//               </motion.div>
//             )}
            
//             {/* FindingsCard - Right column */}
//             {parsedContent.findings.length > 0 && (
//               <motion.div 
//                 initial="hidden"
//                 animate="visible"
//                 variants={cardVariants}
//                 transition={{ delay: 0.8 }}
//                 className="w-full"
//               >
//                 <FindingsCard findings={parsedContent.findings} />
//               </motion.div>
//             )}
//           </div>
          
//           {/* FilmsCard - Full width */}
//           {parsedContent.films.length > 0 && (
//             <motion.div 
//               initial="hidden"
//               animate="visible"
//               variants={cardVariants}
//               transition={{ delay: 1.0 }}
//               className="mb-8 md:mb-10 lg:mb-12"
//             >
//               <FilmsCard films={parsedContent.films} />
//             </motion.div>
//           )}
          
//           {/* Three-column grid for Subjects/Astrology/Books on desktop, responsive on smaller screens */}
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 md:gap-8 mb-8 md:mb-10 lg:mb-12">
//             {/* SubjectsCard */}
//             {parsedContent.subjects.length > 0 && (
//               <motion.div 
//                 initial="hidden"
//                 animate="visible"
//                 variants={cardVariants}
//                 transition={{ delay: 1.2 }}
//                 className="w-full md:col-span-1"
//               >
//                 <SubjectsCard subjects={parsedContent.subjects} />
//               </motion.div>
//             )}
            
//             {/* BooksCard */}
//             {parsedContent.books.length > 0 && (
//               <motion.div 
//                 initial="hidden"
//                 animate="visible"
//                 variants={cardVariants}
//                 transition={{ delay: 1.6 }}
//                 className="w-full md:col-span-2 lg:col-span-1"
//               >
//                 <BooksCard books={parsedContent.books} />
//               </motion.div>
//             )}
//           </div>

//           <div className='container flex w-full justify-center items-center'>  
//           {parsedContent.astrology && (
//             <motion.div 
//               initial="hidden"
//               animate="visible"
//               variants={cardVariants}
//               transition={{ delay: 1.0 }}
//               className="mb-8 md:mb-10 lg:mb-12 w-1/2"
//             >
//               <AstrologyCard astrologyData={parsedContent.astrology}/>
//             </motion.div>
//           )}
//           </div>
          
//             {/* ActionCard - Full width, prominent */}
//             {parsedContent.actionItem && (
//               <motion.div 
//                 initial="hidden"
//                 animate="visible"
//                 variants={cardVariants}
//                 transition={{ delay: 1.8 }}
//                 className="mb-8 md:mb-10 lg:mb-12"
//               >
//                 <ActionCard 
//                   actionText={parsedContent.actionItem}
//                   explanation="Building consistent habits creates lasting positive change and accelerates your personal growth journey."
//                 />
//               </motion.div>
//             )}
          
//           {/* Additional Insights Section (if any remaining content) */}
//           {parsedContent.remainingContent && (
//             <motion.div 
//               initial="hidden"
//               animate="visible"
//               variants={cardVariants}
//               transition={{ delay: 2.0 }}
//               className="bg-gradient-to-br from-white to-slate-50 rounded-2xl shadow-xl p-8 border border-slate-200/50 mb-8 md:mb-10 lg:mb-12"
//             >
//               <div className="flex items-center mb-6">
//                 <div className="w-1 h-8 bg-gradient-to-b from-navy to-terracotta rounded-full mr-4" />
//                 <h3 className="text-2xl font-bold text-navy">Additional Insights</h3>
//               </div>
//               <div className="prose prose-lg max-w-none prose-headings:text-navy prose-strong:text-terracotta prose-p:text-gray-700 prose-li:text-gray-700">
//                 <ReactMarkdown>
//                   {parsedContent.remainingContent}
//                 </ReactMarkdown>
//               </div>
//             </motion.div>
//           )}
          
//           {/* Return home button */}
//           <motion.div 
//             initial="hidden"
//             animate="visible"
//             variants={buttonVariants}
//             transition={{ delay: 2.2 }}
//             className="mt-16 text-center"
//           >
//             <button
//               onClick={handleReturnHome}
//               className="px-8 py-4 bg-gradient-to-r from-navy to-terracotta text-white rounded-xl hover:shadow-xl transition-all duration-300 flex items-center mx-auto hover:scale-105 focus:outline-none focus:ring-2 focus:ring-navy/50"
//             >
//               <Home className="h-5 w-5 mr-2" />
//               Return to Homepage
//             </button>
//           </motion.div>
//         </div>
//       </AuroraBackground>
//     </div>
//   );
// }

// export default QuestResult;


// ---------------------------------------------------------------------------- //
/**
 * QuestResult.tsx
 * Component for displaying psychology assessment results with JSON-based data structure
 * Updated to work directly with structured JSON data instead of parsing text
 */
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { Download, Share2, Home, AlertTriangle } from 'lucide-react'
import { supabase } from '../../../integrations/supabase/client';
// import axios from 'axios'; // For future backend integration

// Import card components
import { MindCard, FindingsCard, QuotesCard } from './questresultcards';
import FilmsCard from './questresultcards/FilmsCard';
import SubjectsCard from './questresultcards/SubjectsCard';
import AstrologyCard from './questresultcards/AstrologyCard';
import BooksCard from './questresultcards/BooksCard';
import ActionCard from './questresultcards/ActionCard';

// Import animation utilities
import { headerVariants, sectionVariants, buttonVariants } from './questresultcards/utils/animations';

// Import layout components
import QuestLayout from '../layout/QuestLayout';

// Import context
import { useAuth } from '../../../contexts/AuthContext';
import axios from 'axios'

export interface QuestResultProps {
  className?: string;
}

// Updated interfaces to match JSON structure
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

interface ResultData {
  session_id: string;
  user_id?: string;
  completion_date: string;
  results: {
    "section 1"?: string;
    "Mind Card"?: {
      personality?: string;
      attribute: string[];
      score: string[];
      insight: string[];
    };
    findings?: string[];
    quotes?: string[];
    films?: Film[];
    subjects?: Subject[];
    astrology?: AstrologyData;
    books?: Book[];
    actionItem?: string;
  };
}

// Utility function to validate and provide defaults for missing data
const validateResultData = (data: any): ResultData => {
  console.log('🔍 Validating result data:', data);
  
  const validated: ResultData = {
    session_id: data.session_id || 'unknown',
    user_id: data.user_id,
    completion_date: data.completion_date || new Date().toISOString(),
    results: {
      "section 1": data.results?.["section 1"] || '',
      "Mind Card": data.results?.["Mind Card"] || {
        personality: "#Game-Styled Mindcard",
        attribute: ["self awareness", "collaboration", "conflict navigation", "risk appetite"],
        score: ["50/100", "50/100", "50/100", "50/100"],
        insight: [
          "Analysis in progress...",
          "Analysis in progress...",
          "Analysis in progress...",
          "Analysis in progress..."
        ]
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

export function QuestResult({ className = '' }: QuestResultProps) {
  const { sessionId } = useParams<{ sessionId: string }>();
  const { testid } = useParams<{ testid: string }>();
  const navigate = useNavigate();
  const auth = useAuth();
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [resultData, setResultData] = useState<ResultData | null>(null);
  
  // Get session ID from URL params or localStorage
  const currentSessionId = sessionId || localStorage.getItem('questSessionId');
  const currenttestid = testid || localStorage.getItem('testid');
  console.log(`current session id ${currentSessionId}`);
  console.log(`current test id ${currenttestid}`);
  
  
  
  useEffect(() => {
    // If no session ID is available, redirect to homepage or error page
    if (!currentSessionId) {
      setError('No session ID found. Please complete an assessment first.');
      return;
    }
    if(!currenttestid){
      setError('No test ID found. Please complete an assessment first.');
      return;
    }
    
    // Fetch result data from the backend
    const fetchResultData = async () => {
      try {
        setIsLoading(true);
        
        // For now, use mock JSON data
        // setTimeout(() => {
        //   // Enhanced mock result data structure in JSON format
        //   const mockResultData = {
        //     session_id: currentSessionId,
        //     user_id: auth?.user?.id,
        //     completion_date: new Date().toISOString(),
        //     results: {
        //       "section 1": "You carry ambition quietly, working tirelessly but yearning for the playful freedom you missed as a child.",
        //       "Mind Card": {
        //         personality: "#Game-Styled Mindcard",
        //         attribute: ["self awareness", "collaboration", "conflict navigation", "risk appetite"],
        //         score: ["65/100", "75/100", "90/100", "85/100"],
        //         insight: [
        //           "Your self-awareness is growing; you know strengths but underplay emotional needs.",
        //           "You collaborate respectfully, valuing others' input while driving your own projects.",
        //           "You resolve conflicts playfully and quickly, maintaining strong familial bonds.",
        //           "You embrace ambitious risks, juggling research, business, and sporting dreams fearlessly."
        //         ]
        //       },
        //       findings: [
        //         "Your childhood's disciplined push shaped an unquenchable ambition that fuels both research and entrepreneurship.",
        //         "You harbor a silent altruism: you dream of wealth not for yourself but to uplift underprivileged students.",
        //         "Your emotional reserve around anger reveals a gentle core, cautious of hurting others even when constrained.",
        //         "Balancing PhD rigor and cricket aspirations, you forge a unique identity bridging science and sport.",
        //         "Your rapid learning skill acts as a secret superpower, accelerating your growth in any domain."
        //       ],
        //       quotes: [
        //         "Ambition is the path, but satisfaction is the journey.",
        //         "The mind, once stretched by new ideas, never returns to its original dimensions.",
        //         "True generosity is giving without remembering; self-care without hesitation.",
        //         "Strength lies in gentleness; power in self-awareness.",
        //         "To dare is to lose one's footing momentarily; not to dare is to lose oneself."
        //       ],
        //       films: [
        //         {
        //           title: "The Theory of Everything",
        //           description: "brilliance meets heartache"
        //         },
        //         {
        //           title: "Lagaan",
        //           description: "ambition and teamwork under pressure"
        //         },
        //         {
        //           title: "Good Will Hunting",
        //           description: "hidden genius, quiet resilience"
        //         },
        //         {
        //           title: "Chak De! India",
        //           description: "passion for sport and pride"
        //         },
        //         {
        //           title: "The Social Network",
        //           description: "innovation driven by obsession"
        //         }
        //       ],
        //       subjects: [
        //         {
        //           title: "Neuroeconomics",
        //           description: "merging decision, emotion, and risk",
        //           matchPercentage: 87
        //         },
        //         {
        //           title: "Sports psychology",
        //           description: "decoding focus in athletes",
        //           matchPercentage: 92
        //         },
        //         {
        //           title: "Philosophy of education",
        //           description: "shaping future learners",
        //           matchPercentage: 81
        //         }
        //       ],
        //       astrology: {
        //         actualSign: "Aries",
        //         behavioralSign: "Virgo",
        //         description: "Based on behavioral psychology, your personality aligns more with Virgo's discipline than your Aries flair.",
        //         predictions: [
        //           {
        //             title: "You'll excel in multidisciplinary projects",
        //             likelihood: 82,
        //             reason: "Your rapid learning and diverse goals"
        //           },
        //           {
        //             title: "You'll struggle to express anger openly",
        //             likelihood: 76,
        //             reason: "You avoid conflict to preserve harmony"
        //           },
        //           {
        //             title: "A philanthropic milestone emerges in two years",
        //             likelihood: 68,
        //             reason: "Your altruistic financial goals"
        //           },
        //           {
        //             title: "You'll pivot career paths within five years",
        //             likelihood: 71,
        //             reason: "Your blend of science and sport passions"
        //           },
        //           {
        //             title: "Strong mentorship bonds will redefine your confidence",
        //             likelihood: 64,
        //             reason: "You seek guidance but rarely ask"
        //           }
        //         ]
        //       },
        //       books: [
        //         {
        //           title: "Atomic Habits",
        //           author: "James Clear"
        //         },
        //         {
        //           title: "Mindset",
        //           author: "Carol Dweck"
        //         },
        //         {
        //           title: "Flow",
        //           author: "Mihaly Csikszentmihalyi"
        //         }
        //       ],
        //       actionItem: "Practice expressing your needs: voice one honest concern daily for a week."
        //     }
        //   };
          
        //   // Validate and set the data
        //   const validatedData = validateResultData(mockResultData);
          
        //   // Check if the result belongs to the current user
        //   if (auth?.user?.id && validatedData.user_id !== auth?.user?.id) {
        //     setError('You are not authorized to view these results.');
        //     setIsLoading(false);
        //     return;
        //   }
          
        //   setResultData(validatedData);
        //   setIsLoading(false);
        // }, 1500);
        
        // COMMENTED OUT: Real implementation for fetching data from backend
        
        try {
          // 1. First verify this session belongs to the current user
          const { data: sessionHistory, error: sessionError } = await supabase
            .from('user_session_history')
            .select('*')
            .eq('session_id', currentSessionId)
            .eq('user_id', auth.user?.id || '')
            .eq('testid', currenttestid)
            .single();
          
          if (sessionError || !sessionHistory) {
            throw new Error('Session not found or not authorized');
          }
          
          // 2. Fetch the analysis result from your AI backend using axios
          const response = await axios.get(`http://35.232.81.77/api/report/${currentSessionId}/${auth.user?.id}/${currenttestid}`, {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${auth?.session?.access_token || ''}`
            },
            timeout: 30000
          });
          if (!response) {
            console.log('Something went wrong');
          } else {
            console.log(`response`, response.data.results);
            
            const analysisData = response.data;
            if (typeof analysisData.results === 'string') {
              analysisData.results = JSON.parse(analysisData.results);
            }
            console.log(`analysis data`, analysisData);
            console.log(`response data`, response);
          }
          
          const analysisData = response.data;
          // 3. Validate and format the data
          const validatedData = validateResultData(analysisData);
          console.log(`validated data ${validatedData}`);
          setResultData(validatedData);
          setIsLoading(false);
          
          // // 4. Update the session history to mark as viewed
          // await supabase
          //   .from('user_session_history')
          //   .update({ is_viewed: true })
          //   .eq('session_id', currentSessionId)
          //   .eq('user_id', auth?.user?.id || '');
            
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
        
        
      } catch (err) {
        console.error('Error fetching result data:', err);
        setError('Failed to fetch your assessment results. Please try again later.');
        setIsLoading(false);
      }
    };
    
    fetchResultData();
  }, [currentSessionId, auth?.user?.id]);
  
  // Handle downloading results as PDF (placeholder)
  const handleDownloadResults = () => {
    alert('Download functionality will be implemented based on requirements.');
  };
  
  // Handle sharing results (placeholder)
  const handleShareResults = () => {
    alert('Share functionality will be implemented based on requirements.');
  };
  
  // Handle retry if loading failed
  const handleRetry = () => {
    setIsLoading(true);
    setError(null);
    window.location.reload();
  };
  
  // Return to dashboard/homepage
  const handleReturnHome = () => {
    navigate('/');
  };
  
  // Loading state
  if (isLoading) {
    return (
      <QuestLayout showHeader={true} showNavigation={false} className={className}>
        <div className="flex flex-col items-center justify-center py-12 min-h-[60vh]">
          <motion.div
            animate={{
              rotate: 360,
              scale: [1, 1.1, 1],
            }}
            transition={{
              rotate: { duration: 1.5, repeat: Infinity, ease: "linear" },
              scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
            }}
            className="w-16 h-16 border-4 border-navy border-t-transparent rounded-full mb-6"
          />
          <p className="text-gray-600 text-lg">Loading your assessment results...</p>
          <p className="text-gray-400 text-sm mt-2">Analyzing your psychological profile...</p>
        </div>
      </QuestLayout>
    );
  }
  
  // Error state
  if (error) {
    return (
      <QuestLayout showHeader={true} showNavigation={false} className={className}>
        <div className="flex flex-col items-center justify-center py-12 px-4 text-center min-h-[60vh]">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-red-50 text-red-700 p-4 rounded-lg mb-6 inline-flex items-center"
          >
            <AlertTriangle className="h-6 w-6 mr-2" />
            Error
          </motion.div>
          <h2 className="text-xl font-semibold text-navy mb-4">Unable to Load Results</h2>
          <p className="text-gray-600 mb-6 max-w-md">{error}</p>
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={handleRetry}
              className="px-6 py-3 bg-navy text-white rounded-lg hover:bg-navy/90 transition-colors"
            >
              Try Again
            </button>
            <button
              onClick={handleReturnHome}
              className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Return Home
            </button>
          </div>
        </div>
      </QuestLayout>
    );
  }

  // 🎯 MAIN CHANGE: Direct access to JSON data - no parsing needed!
  console.log('✅ Using direct JSON data access');
  console.log('📊 Result data:', resultData);
  
  // Extract data directly from JSON structure
  const findings = resultData?.results.findings || [];
  const quotes = resultData?.results.quotes || [];
  const films = resultData?.results.films || [];
  const subjects = resultData?.results.subjects || [];
  const astrology = resultData?.results.astrology || null;
  const books = resultData?.results.books || [];
  const actionItem = resultData?.results.actionItem || '';
  
  console.log('📊 Extracted data:', {
    findings: findings.length,
    quotes: quotes.length,
    films: films.length,
    subjects: subjects.length,
    astrology: astrology ? 'Found' : 'Not found',
    books: books.length,
    actionItem: actionItem ? 'Found' : 'Not found'
  });
  
  // Animation variants for staggered reveals
  const cardVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
    }
  };

  // Success state - display results
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white">
      {/* Hero Section */}
      <section className="pb-12 pt-24 bg-navy text-white">
        <div className="container mx-auto px-6">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.2
                }
              }
            }}
          >
            {/* Header section */}
            <div className="mb-12">
              <motion.h1 
                variants={headerVariants}
                className="text-4xl font-playfair text-white mb-4"
              >
                Your Assessment Results
              </motion.h1>
              <motion.p 
                variants={headerVariants}
                className="text-gray-300 text-lg"
              >
                Completed on {new Date(resultData?.completion_date || '').toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </motion.p>
              
              {/* Action buttons */}
              <motion.div 
                variants={buttonVariants}
                className="flex flex-wrap gap-3 mt-8 justify-start"
              >
                <button
                  onClick={handleDownloadResults}
                  className="px-6 py-3 bg-white text-navy rounded-xl hover:bg-gray-100 transition-all duration-300 text-sm flex items-center shadow-lg hover:shadow-xl hover:scale-105"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download PDF
                </button>
                <button
                  onClick={handleShareResults}
                  className="px-6 py-3 bg-terracotta text-white rounded-xl hover:bg-terracotta/90 transition-all duration-300 text-sm flex items-center shadow-lg hover:shadow-xl hover:scale-105"
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  Share Results
                </button>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>
            
      {/* Content Section */}
      <div className="container mx-auto px-6 py-12">
        {/* Section 1 - Core Essence */}
        {resultData?.results["section 1"] && (
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={cardVariants}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-white to-slate-50 rounded-2xl shadow-xl p-8 mb-8 md:mb-10 lg:mb-12 border border-slate-200/50"
          >
            <div className="flex items-center mb-6">
              <div className="w-1 h-8 bg-gradient-to-b from-navy to-terracotta rounded-full mr-4" />
              <h3 className="text-2xl font-bold text-navy">Your Core Essence</h3>
            </div>
            <div className="relative">
              <div className="absolute -left-2 -top-2 text-6xl text-terracotta/20 font-serif">"</div>
              <p className="text-gray-700 text-xl italic font-light leading-relaxed pl-8">
                {resultData.results["section 1"]}
              </p>
              <div className="absolute -right-2 -bottom-6 text-6xl text-terracotta/20 font-serif">"</div>
            </div>
          </motion.div>
        )}
        
        {/* MindCard - Center column */}
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={cardVariants}
          transition={{ delay: 0.4 }}
          className="mb-8 md:mb-10 lg:mb-12"
        >
          {resultData?.results["Mind Card"] && (
            <MindCard data={resultData.results["Mind Card"]} />
          )}
        </motion.div>
        
        {/* Findings and Quotes - Two column layout on desktop, stack on mobile */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 mb-8 md:mb-10 lg:mb-12">
          {/* QuotesCard - Left column */}
          {quotes.length > 0 && (
            <motion.div 
              initial="hidden"
              animate="visible"
              variants={cardVariants}
              transition={{ delay: 0.6 }}
              className="w-full"
            >
              <QuotesCard quotes={quotes} />
            </motion.div>
          )}
          
          {/* FindingsCard - Right column */}
          {findings.length > 0 && (
            <motion.div 
              initial="hidden"
              animate="visible"
              variants={cardVariants}
              transition={{ delay: 0.8 }}
              className="w-full"
            >
              <FindingsCard findings={findings} />
            </motion.div>
          )}
        </div>
        
        {/* FilmsCard - Full width */}
        {films.length > 0 && (
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={cardVariants}
            transition={{ delay: 1.0 }}
            className="mb-8 md:mb-10 lg:mb-12"
          >
            <FilmsCard films={films} />
          </motion.div>
        )}
        
        {/* Three-column grid for Subjects/Astrology/Books on desktop, responsive on smaller screens */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 md:gap-8 mb-8 md:mb-10 lg:mb-12">
          {/* SubjectsCard */}
          {subjects.length > 0 && (
            <motion.div 
              initial="hidden"
              animate="visible"
              variants={cardVariants}
              transition={{ delay: 1.2 }}
              className="w-full md:col-span-1"
            >
              <SubjectsCard subjects={subjects} />
            </motion.div>
          )}
          
          {/* BooksCard */}
          {books.length > 0 && (
            <motion.div 
              initial="hidden"
              animate="visible"
              variants={cardVariants}
              transition={{ delay: 1.6 }}
              className="w-full md:col-span-2 lg:col-span-1"
            >
              <BooksCard books={books} />
            </motion.div>
          )}
        </div>

        {/* AstrologyCard */}
        <div className='grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-6 md:gap-8 mb-8 md:mb-10 lg:mb-12'> 
          {astrology && (
            <motion.div 
              initial="hidden"
              animate="visible"
              variants={cardVariants}
              transition={{ delay: 1.4 }}
              className="w-full md:col-span-1"
            >
              <AstrologyCard astrologyData={astrology} />
            </motion.div>
          )}
          </div>
        
        {/* ActionCard - Full width, prominent */}
        {actionItem && (
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={cardVariants}
            transition={{ delay: 1.8 }}
            className="mb-8 md:mb-10 lg:mb-12"
          >
            <ActionCard 
              actionText={actionItem}
              explanation="Building consistent habits creates lasting positive change and accelerates your personal growth journey."
            />
          </motion.div>
        )}
        
        {/* Return home button */}
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={buttonVariants}
          transition={{ delay: 2.2 }}
          className="mt-16 text-center"
        >
          <button
            onClick={handleReturnHome}
            className="px-8 py-4 bg-gradient-to-r from-navy to-terracotta text-white rounded-xl hover:shadow-xl transition-all duration-300 flex items-center mx-auto hover:scale-105 focus:outline-none focus:ring-2 focus:ring-navy/50"
          >
            <Home className="h-5 w-5 mr-2" />
            Return to Homepage
          </button>
        </motion.div>
      </div>
    </div>
  );
}

export default QuestResult;