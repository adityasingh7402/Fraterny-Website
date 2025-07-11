



/**
 * QuestResult.tsx
 * Component for displaying psychology assessment results
 */
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { Download, Share2, Home, AlertTriangle } from 'lucide-react';

// Import card components
import { MindCard, FindingsCard, QuotesCard, parseContent } from './questresultcards';

// Import animation utilities
import { headerVariants, sectionVariants, buttonVariants } from './questresultcards/utils/animations';

// Import layout components
import QuestLayout from '../layout/QuestLayout';

// Import context
import { useAuth } from '../../../contexts/AuthContext';
import { supabase } from '../../../integrations/supabase/client';

export interface QuestResultProps {
  className?: string;
}

export function QuestResult({ className = '' }: QuestResultProps) {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  const auth = useAuth();
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [resultData, setResultData] = useState<any>(null);
  
  // Get session ID from URL params or localStorage
  const currentSessionId = sessionId || localStorage.getItem('questSessionId');
  
  useEffect(() => {
    // If no session ID is available, redirect to homepage or error page
    if (!currentSessionId) {
      setError('No session ID found. Please complete an assessment first.');
      return;
    }
    
    // Fetch result data from the backend
    const fetchResultData = async () => {
      try {
        setIsLoading(true);
        
        // For now, use mock data
        setTimeout(() => {
          // Mock result data structure
          const mockResultData = {
            session_id: currentSessionId,
            user_id: auth?.user?.id,
            completion_date: new Date().toISOString(),
            results: {
              "section 1": "You carry ambition quietly, working tirelessly but yearning for the playful freedom you missed as a child.",
              "Mind Card": {
                "personlity": "#Game-Styled Mindcard",
                "attribute": ["self awareness","collaboration","conflict navigation","risk appetite"],
                "score": ["65/100","75/100","90/100","85/100"],
                "insight": [
                  "Your self-awareness is growing; you know strengths but underplay emotional needs.",
                  "You collaborate respectfully, valuing others' input while driving your own projects.",
                  "You resolve conflicts playfully and quickly, maintaining strong familial bonds.",
                  "You embrace ambitious risks, juggling research, business, and sporting dreams fearlessly."
                ]
              },
              "section 3": "**5 Most Thought Provoking Findings about You** 😲\n\n1. Your childhood's disciplined push shaped an unquenchable ambition that fuels both research and entrepreneurship.\n2. You harbor a silent altruism: you dream of wealth not for yourself but to uplift underprivileged students.\n3. Your emotional reserve around anger reveals a gentle core, cautious of hurting others even when constrained.\n4. Balancing PhD rigor and cricket aspirations, you forge a unique identity bridging science and sport.\n5. Your rapid learning skill acts as a secret superpower, accelerating your growth in any domain.\n\n**5 Philosophical Quotes That Mirror Your Psyche** 🤔\n\n- \"Ambition is the path, but satisfaction is the journey.\" – reminds you balance drive and joy.\n- \"The mind, once stretched by new ideas, never returns to its original dimensions.\" – reflects your love of learning.\n- \"True generosity is giving without remembering; self-care without hesitation.\" – mirrors your altruistic vision.\n- \"Strength lies in gentleness; power in self-awareness.\" – echoes your quiet but determined nature.\n- \"To dare is to lose one's footing momentarily; not to dare is to lose oneself.\" – captures your bold risk-taking."
            }
          };
          
          // Check if the result belongs to the current user
          if (auth?.user?.id && mockResultData.user_id !== auth?.user?.id) {
            setError('You are not authorized to view these results.');
            setIsLoading(false);
            return;
          }
          
          setResultData(mockResultData);
          setIsLoading(false);
        }, 1500);
        
        // COMMENTED OUT: Real implementation for fetching data from backend
        /*
        // 1. First verify this session belongs to the current user
        const { data: sessionHistory, error: sessionError } = await supabase
          .from('user_session_history')
          .select('*')
          .eq('session_id', currentSessionId)
          .eq('user_id', auth?.user?.id)
          .single();
        
        if (sessionError || !sessionHistory) {
          throw new Error('Session not found or not authorized');
        }
        
        // 2. Fetch the analysis result from your AI backend
        const response = await fetch(`${process.env.REACT_APP_API_URL}/quest-analysis/${currentSessionId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${auth.session?.access_token || ''}`
          },
        });
        
        if (!response.ok) {
          throw new Error(`Error fetching results: ${response.status}`);
        }
        
        const analysisData = await response.json();
        
        // 3. Format the data to match your frontend structure
        const formattedData = {
          session_id: currentSessionId,
          user_id: auth?.user?.id,
          completion_date: sessionHistory.created_at,
          results: {
            "section 1": analysisData.core_essence || "Analysis still processing...",
            "Mind Card": analysisData.mind_card || {
              "personlity": "#Game-Styled Mindcard",
              "attribute": ["self awareness","collaboration","conflict navigation","risk appetite"],
              "score": ["50/100","50/100","50/100","50/100"],
              "insight": [
                "Still analyzing...",
                "Still analyzing...",
                "Still analyzing...",
                "Still analyzing..."
              ]
            },
            "section 3": analysisData.deep_insights || "Analysis still processing..."
          }
        };
        
        setResultData(formattedData);
        setIsLoading(false);
        
        // 4. Update the session history to mark as viewed
        await supabase
          .from('user_session_history')
          .update({ is_viewed: true })
          .eq('session_id', currentSessionId)
          .eq('user_id', auth?.user?.id);
        */
        
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
  
  // Parse content to extract findings and quotes
  const { findings, quotes, remainingContent } = parseContent(resultData.results["section 3"]);
  
  // Success state - display results
  return (
    // <QuestLayout showHeader={true} showNavigation={false} className={className}>
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
                  Completed on {new Date(resultData.completion_date).toLocaleDateString('en-US', {
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
          {resultData.results["section 1"] && (
            <motion.div 
              initial="hidden"
              animate="visible"
              variants={sectionVariants}
              className="bg-gradient-to-br from-white to-slate-50 rounded-2xl shadow-xl p-8 mb-12 border border-slate-200/50"
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
          <div className="mb-12">
            {resultData.results["Mind Card"] && (
              <MindCard data={resultData.results["Mind Card"]} />
            )}
          </div>
          
          {/* Findings and Quotes - Two column layout on desktop, stack on mobile */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {/* QuotesCard - Left column */}
            {quotes.length > 0 && (
              <div className="w-full">
                <QuotesCard quotes={quotes} />
              </div>
            )}
            
            {/* FindingsCard - Right column */}
            {findings.length > 0 && (
              <div className="w-full">
                <FindingsCard findings={findings} />
              </div>
            )}
          </div>
          
          {/* Additional Insights Section (if any remaining content) */}
          {remainingContent && (
            <motion.div 
              initial="hidden"
              animate="visible"
              variants={sectionVariants}
              className="bg-gradient-to-br from-white to-slate-50 rounded-2xl shadow-xl p-8 border border-slate-200/50 mb-12"
            >
              <div className="flex items-center mb-6">
                <div className="w-1 h-8 bg-gradient-to-b from-navy to-terracotta rounded-full mr-4" />
                <h3 className="text-2xl font-bold text-navy">Additional Insights</h3>
              </div>
              <div className="prose prose-lg max-w-none prose-headings:text-navy prose-strong:text-terracotta prose-p:text-gray-700 prose-li:text-gray-700">
                <ReactMarkdown>
                  {remainingContent}
                </ReactMarkdown>
              </div>
            </motion.div>
          )}
          
          {/* Return home button */}
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={buttonVariants}
            className="mt-16 text-center"
          >
            <button
              onClick={handleReturnHome}
              className="px-8 py-4 bg-gradient-to-r from-navy to-terracotta text-white rounded-xl hover:shadow-xl transition-all duration-300 flex items-center mx-auto hover:scale-105"
            >
              <Home className="h-5 w-5 mr-2" />
              Return to Homepage
            </button>
          </motion.div>
        </div>
      </div>
    // </QuestLayout>
  );
}

export default QuestResult;