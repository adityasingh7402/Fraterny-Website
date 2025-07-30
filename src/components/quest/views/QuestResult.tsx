// ---------------------------------------------------------------------------- //
/**
 * QuestResult.tsx
 * Component for displaying psychology assessment results with JSON-based data structure
 * Updated to work directly with structured JSON data instead of parsing text
 */
import React, { useState, useEffect, useRef } from 'react';
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
      name?: string;
      personality?: string;
      attributes: string[];
      scores: string[];
      insights: string[];
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
        name: "User",
        personality: "#Game-Styled Mindcard", 
        description: "Loading analysis...",
        attributes: ["self awareness", "collaboration", "conflict navigation", "risk appetite"],  // ← Changed
        scores: ["50/100", "50/100", "50/100", "50/100"],                                      // ← Changed
        insights: ["Analysis in progress...", "Analysis in progress...", "Analysis in progress...", "Analysis in progress..."]  // ← Changed
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
  const hasInitialized = useRef(false);
  
  // Get session ID from URL params or localStorage
  const currentSessionId = sessionId || localStorage.getItem('questSessionId');
  const currenttestid = testid || localStorage.getItem('testid');
  console.log(`current session id ${currentSessionId}`);
  console.log(`current test id ${currenttestid}`);
  
  
  
  useEffect(() => {
    // Prevent double execution in React Strict Mode
    if (hasInitialized.current) {
      console.log('❌ Already initialized - skipping API call');
      return;
    }

    hasInitialized.current = true;
    console.log('✅ First execution - proceeding with API call');
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
        
        try {
          // if (auth.user?.id) {
          //   const { data: sessionHistory, error: sessionError } = await supabase
          //     .from('user_session_history')
          //     .select('*')
          //     .eq('session_id', currentSessionId)
          //     .eq('user_id', auth.user.id)
          //     .eq('testid', currenttestid)
          //     .single();

          //   if (sessionError || !sessionHistory) {
          //     console.warn('Session not found in database, but continuing for authenticated user');
          //     // Don't throw error - continue with API call
          //   }
          // } else {
          //   console.log('Anonymous user - skipping session history verification');
          // }
          
          // 2. Fetch the analysis result from your AI backend using axios
          const userId = auth.user?.id || 'anonymous';
          const response = await axios.get(`https://api.fraterny.in/api/report/${currentSessionId}/${userId}/${currenttestid}`, {
            headers: {
              'Content-Type': 'application/json',
            },
            timeout: 30000
          });
          if (!response) {
            console.log('Something went wrong');
          } else {
            // console.log(`response:`, response.data.results);
            
            const analysisData = response.data;
            if (typeof analysisData.results === 'string') {
              analysisData.results = JSON.parse(analysisData.results);
            }
            // console.log(`analysis data`, analysisData);
            // console.log(`response data`, response);
          }
          
          const analysisData = response.data;
          // 3. Validate and format the data
          const validatedData = validateResultData(analysisData);
          // console.log(`validated data ${validatedData}`);
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
  // if (isLoading) {
  //   return (
  //     <QuestLayout showHeader={true} showNavigation={false} className={className}>
  //       <div className="flex flex-col items-center justify-center py-12 min-h-[60vh]">
  //         <motion.div
  //           animate={{
  //             rotate: 360,
  //             scale: [1, 1.1, 1],
  //           }}
  //           transition={{
  //             rotate: { duration: 1.5, repeat: Infinity, ease: "linear" },
  //             scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
  //           }}
  //           className="w-16 h-16 border-4 border-navy border-t-transparent rounded-full mb-6"
  //         />
  //         <p className="text-gray-600 text-lg font-['Gilroy-Bold']">Your assessment result is finally ready.</p>
  //       </div>
  //     </QuestLayout>
  //   );
  // }
  
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