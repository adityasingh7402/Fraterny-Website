import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

//Entire Process to display during processing
const psychologicalFacts = [
  "Processing your answers securely...",
  "Cleaning and organising your responses...",
  "Calibrating weights so no single answer dominates...",
  "Balancing literal text with implied meaning...",
  "Reviewing the quality and depth of your responses...",
  "Quantifying uncertainty where answers are ambiguous...",
  "Searching the knowldege database for in-depth analysis...",
  "Analysing the emotional tone of the answers...",
  "Mapping shifts in mood across topics...",
  "Measuring emphasis vs understatement in phrasing...",
  "Detecting recurring themes and motifs...",
  "Looking for quiet signals you might underplay...",
  "Understanding your thought patterns based on answer combinations...",
  "Estimating confidence vs hesitation in wording...",
  "Measuring intensity behind key statements...",
  "Testing multiple interpretations for each signal...",
  "Weighing contradictions vs consistencies...",
  "Connecting answers to reveal pattern clusters...",
  "Creating a detailed summary of your personality and internal drivers...",
  "Locating edge cases that make you unique...",
  "Compressing complex patterns into takeaways...",
  "Generating your share-ready summary tiles...",
  
];

const PsychologicalFactsCards = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => prev + 1);
    }, 5000); // 5 seconds for less percieved time

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (currentIndex === psychologicalFacts.length) {
      // Reset to 0 after the transition completes
      const timeout = setTimeout(() => {
        setCurrentIndex(0);
      }, 1000); // Wait for the 1s transition to complete
      
      return () => clearTimeout(timeout);
    }
  }, [currentIndex]);

  return (
    <div className="relative overflow-hidden w-full">
      <div 
        className="flex transition-transform duration-1000 ease-in-out"
        style={{
          transform: `translateX(calc(-${currentIndex * 100}% - ${currentIndex * 16}px))`
        }}
      >
        {[...psychologicalFacts].map((fact, index) => (
          <div
            key={index}
            className="w-full h-auto relative bg-gradient-to-br from-blue-600 via-blue-500 to-blue-700 rounded-xl border-2 border-blue-400 overflow-hidden flex-shrink-0 mr-4"
          >
            <div className="flex items-center justify-center h-full p-1">
              <p className="text-white text-2xl font-normal font-['Gilroy-Regular'] text-center leading-snug">
                {fact}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};


export interface QuestProcessingProps {
  className?: string;
  gifSrc?: string; // Optional prop to customize the GIF source
}

export function QuestProcessing({ className = '', gifSrc = '/analysis1.gif' }: QuestProcessingProps) {
  const [factIndex, setFactIndex] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isTimedOut, setIsTimedOut] = useState(false);
  
  // New states for result polling
  const [isPolling, setIsPolling] = useState(false);
  const [pollCount, setPollCount] = useState(0);
  const [resultStatus, setResultStatus] = useState<'processing' | 'ready' | 'error'>('processing');

  const { userId, sessionId, testId } = useParams<{
      userId: string;
      sessionId: string;
      testId: string;
    }>();
    const navigate = useNavigate();

    // const handleRetrySubmission = async () => {
    //   try {
    //     const backupData = localStorage.getItem('fraterny_quest_session');
    //     if (!backupData) {
    //       console.error('No backup data found for retry');
    //       navigate('/quest');
    //       return;
    //     }
        
    //     console.log('🔄 Retrying submission with cached data');
        
    //     // Resubmit the data using the same API call
    //     const response = await axios.post("https://api.fraterny.in/api/agent", JSON.parse(backupData), {
    //       headers: { 'Content-Type': 'application/json' },
    //     });
        
    //     if (response.data.status === "Submitted") {
    //       // Stay on the same processing page and restart polling
    //       setResultStatus('processing');
    //       setIsPolling(true);
    //       setPollCount(0);
    //     }
        
    //   } catch (error) {
    //     console.error('Failed to retry submission:', error);
    //     navigate('/quest');
    //   }
    // };

    // Polling useEffect - add this after the existing factInterval useEffect
    
    
    // useEffect(() => {
    //   if (!sessionId || !userId || !testId) {
    //     // setResultStatus('error');
    //     return;
    //   }
    //   // Reset states when starting polling
    //   setPollCount(0);
    //   setResultStatus('processing');
    //   setIsPolling(true);
    //   let isActive = true;
      
    //   // const startPolling = async () => {
    //   // setIsPolling(true);
      
    //   // const pollForResults = async () => {
    //   //   try {
    //   //     // Replace with your actual polling endpoint
    //   //     const response = await fetch(`https://api.fraterny.in/api/status/${testId}`);
    //   //     const data = await response.json();
          
    //   //     if (data.status === 'ready') {
    //   //       setResultStatus('ready');
    //   //       setIsPolling(false);

    //   //       // Clear session data now that processing is complete
    //   //       localStorage.removeItem('fraterny_quest_session');
    //   //       console.log('🧹 Cleared session data after successful processing');
            
    //   //       // Auto-navigation after 2 seconds
    //   //       setTimeout(() => {
    //   //         navigate(`/quest-result/result/${userId}/${sessionId}/${testId}`);
    //   //       }, 2000);
            
    //   //       return true; // Results ready
            
    //   //     } else if (data.status === 'error') {
    //   //       setResultStatus('error');
    //   //       setIsPolling(false);
    //   //       return true; // Done (with error)
    //   //     }
          
    //   //     // If status is 'processing', continue polling
    //   //     return false; // Still processing
          
    //   //   } catch (error) {
    //   //     console.error('Polling error:', error);
    //   //     setPollCount(prev => prev + 1);
          
    //   //     // If we've polled for 2 minutes (8 attempts), stop and show error
    //   //     if (pollCount >= 8) {
    //   //       setResultStatus('error');
    //   //       setIsPolling(false);
    //   //       return true; // Done (with error)
    //   //     }
          
    //   //     return false; // Continue polling despite error
    //   //   }
    //   // };
    //   //   console.log('⏱️ Waiting 15 seconds for backend processing to start...');
    //   //   await new Promise(resolve => setTimeout(resolve, 5000));

    //   //   console.log('🔍 Checking status after initial delay...');
    //   //   const isComplete = await pollForResults();
        
    //   //   if (!isComplete && resultStatus === 'processing') {
    //   //     console.log('📡 Results not ready, starting polling every 15 seconds...');
          
    //   //     const interval = setInterval(async () => {
    //   //       if (pollCount < 12 && resultStatus === 'processing') {
    //   //         setPollCount(prev => prev + 1);
    //   //         const shouldStop = await pollForResults();
              
    //   //         if (shouldStop) {
    //   //           clearInterval(interval);
    //   //         }
    //   //       } else {
    //   //         clearInterval(interval);
    //   //         if (pollCount >= 12 && resultStatus === 'processing') {
    //   //           setResultStatus('error');
    //   //           setIsPolling(false);
    //   //         }
    //   //       }
    //   //     }, 15000); // 15 seconds

    //   //     return () => clearInterval(interval);
    //   //   } else {
    //   //     console.log('✅ Status check complete, no polling needed');
    //   //   }
    //   // };
      
    //   const startPolling = async () => {
    //     if (!isActive) return;
    //     try {
    //       // Initial delay before first poll (5 seconds to allow backend processing to start)
    //       console.log('⏱️ Waiting 5 seconds for backend processing to initialize...');
    //       await new Promise(resolve => setTimeout(resolve, 5000));
    //       setIsPolling(true);
    //       console.log('🚀 Starting polling for analysis results...');
          
    //       const pollForResults = async (): Promise<boolean> => {
    //         try {
    //           console.log(`📡 Polling attempt ${pollCount + 1}/16 for testId: ${testId}`);
              
    //           const response = await axios.get(`https://api.fraterny.in/api/status/${testId}`, {
    //                 headers: {
    //                   'Content-Type': 'application/json',
    //                 },
    //               });

    //           if (!response.data) {
    //             throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    //           }

    //           const data = await response.data;
    //           console.log('📊 Polling response:', data);
              
    //           if (data.status === 'ready') {
    //             console.log('✅ Analysis ready! Preparing navigation...');
    //             setResultStatus('ready');
    //             setIsPolling(false);

    //             // Clear session data now that processing is complete
    //             localStorage.removeItem('fraterny_quest_session');
    //             console.log('🧹 Cleared session data after successful processing');
                
    //             // Auto-navigation after 2 seconds
    //             setTimeout(() => {
    //               const targetUrl = `/quest-result/result/${userId}/${sessionId}/${testId}`;
    //               console.log('🧭 Navigating to results:', targetUrl);
    //               navigate(targetUrl);
    //             }, 2000);
                
    //             return true; // Polling complete - success
                
    //           } else if (data.status === 'error' || data.status === 'failed') {
    //             console.error('❌ Analysis failed on server side');
    //             setResultStatus('error');
    //             setIsPolling(false);
    //             return true; // Polling complete - error
                
    //           } else if (data.status === 'processing') {
    //             console.log('⏳ Still processing, will continue polling...');
    //             return false; // Continue polling
                
    //           } else {
    //             console.warn('⚠️ Unknown status:', data.status, 'treating as still processing');
    //             return false; // Continue polling for unknown status
    //           }
              
    //         } catch (error: any) {
    //           console.error('❌ Polling request failed:', error);
              
    //           // Handle different types of errors
    //           if (error.name === 'AbortError') {
    //             console.error('🕐 Polling request timed out');
    //           } else if (error.message?.includes('NetworkError') || error.message?.includes('fetch')) {
    //             console.error('🌐 Network error during polling');
    //           } else {
    //             console.error('🔧 Unknown polling error:', error.message);
    //           }
              
    //           // Increment poll count on error
    //           setPollCount(prev => prev + 1);
              
    //           // If we've reached max attempts (16 attempts = 4 minutes), stop polling
    //           if (pollCount >= 15) { // 15 because we increment after this check
    //             console.error('⏰ Max polling attempts reached (4 minutes), stopping...');
    //             setResultStatus('error');
    //             setIsPolling(false);
    //             return true; // Stop polling - timeout
    //           }
              
    //           return false; // Continue polling despite error
    //         }
    //       };

    //       // Initial delay before first poll (5 seconds to allow backend processing to start)
    //       console.log('⏱️ Waiting 5 seconds for backend processing to initialize...');
    //       await new Promise(resolve => setTimeout(resolve, 5000));

    //       console.log('🔍 Starting initial status check...');
    //       const initialComplete = await pollForResults();
          
    //       // If not complete after initial check, start interval polling
    //       if (!initialComplete && resultStatus === 'processing') {
    //         console.log('📡 Results not ready, starting interval polling every 15 seconds...');
            
    //         const pollInterval = setInterval(async () => {
    //           // Double-check we should still be polling
    //           if (resultStatus !== 'processing' || !isPolling) {
    //             console.log('🛑 Stopping polling - status changed or polling disabled');
    //             clearInterval(pollInterval);
    //             return;
    //           }
              
    //           // Check if we've hit the limit (16 total attempts = ~4 minutes)
    //           if (pollCount >= 15) {
    //             console.error('⏰ Polling timeout reached, stopping interval');
    //             clearInterval(pollInterval);
    //             setResultStatus('error');
    //             setIsPolling(false);
    //             return;
    //           }
              
    //           setPollCount(prev => prev + 1);
    //           const shouldStop = await pollForResults();
              
    //           if (shouldStop) {
    //             console.log('🏁 Polling completed, clearing interval');
    //             clearInterval(pollInterval);
    //           }
              
    //         }, 15000); // Poll every 15 seconds

    //         // Cleanup function
    //         return () => {
    //           console.log('🧹 Cleaning up polling interval');
    //           clearInterval(pollInterval);
    //         };
            
    //       } else {
    //         console.log('✅ Initial status check completed, no interval polling needed');
    //       }
          
    //     } catch (error: any) {
    //       console.error('❌ Critical error in polling initialization:', error);
    //       setResultStatus('error');
    //       setIsPolling(false);
    //     }
    //   };
      
      
      
    //   startPolling();
    // }, [testId]);


    // Simplified polling useEffect
    
    
    useEffect(() => {
      if (!sessionId || !userId || !testId) {
        setResultStatus('error');
        return;
      }

      let pollInterval: NodeJS.Timeout;
      let isActive = true;

      const pollForResults = async (): Promise<boolean> => {
        try {
          console.log(`📡 Checking status for testId: ${testId}`);
          
          const response = await axios.get(`https://api.fraterny.in/api/status/${testId}`, {
            headers: { 'Content-Type': 'application/json' },
          });

          const data = response.data;
          console.log('📊 Polling response:', data);
          
          // Three simple conditions:
          
          if (data.status === 'ready') {
            console.log('✅ Analysis complete! Navigating to results...');
            setResultStatus('ready');
            setIsPolling(false);
            localStorage.removeItem('fraterny_quest_session');
            
            setTimeout(() => {
              if (isActive) {
                navigate(`/quest-result/result/${userId}/${sessionId}/${testId}`);
              }
            }, 2000);
            
            return true; // Stop polling
          }
          
          if (data.status === 'error') {
            console.log('❌ Analysis failed on server');
            setResultStatus('error');
            setIsPolling(false);
            return true; // Stop polling
          }
          
          if (data.status === 'processing') {
            console.log('⏳ Still processing, continuing to poll...');
            return false; // Continue polling
          }
          
          // Unknown status - treat as still processing
          console.warn('⚠️ Unknown status:', data.status, 'continuing to poll...');
          return false; // Continue polling
          
        } catch (error) {
          console.error('❌ Polling request failed:', error);
          setPollCount(prev => prev + 1);
          
          // Stop after 16 failed attempts (4 minutes)
          if (pollCount >= 2) {
            console.error('⏰ Max polling attempts reached');
            setResultStatus('error');
            setIsPolling(false);
            return true; // Stop polling
          }
          
          return false; // Continue polling despite error
        }
      };

      const startPolling = async () => {
        if (!isActive) return;
        
        console.log('🚀 Starting simplified polling...');
        setIsPolling(true);
        setResultStatus('processing');
        setPollCount(0);

        // Wait 5 seconds before first poll
        await new Promise(resolve => setTimeout(resolve, 5000));
        
        if (!isActive) return;

        // First poll
        const shouldStop = await pollForResults();
        
        if (!shouldStop && isActive) {
          // Start interval polling every 15 seconds
          pollInterval = setInterval(async () => {
            if (!isActive) {
              clearInterval(pollInterval);
              return;
            }
            
            setPollCount(prev => prev + 1);
            const stop = await pollForResults();
            
            if (stop) {
              clearInterval(pollInterval);
            }
          }, 15000);
        }
      };

      startPolling();

      // Cleanup
      return () => {
        isActive = false;
        setIsPolling(false);
        if (pollInterval) {
          clearInterval(pollInterval);
        }
      };

    }, [testId]);

    useEffect(() => {
      const factInterval = setInterval(() => {
        setFactIndex(prevIndex => (prevIndex + 1) % psychologicalFacts.length);
      }, 8000);

      return () => clearInterval(factInterval);
    }, []);

    // Error state - show submit again option
    if (resultStatus === 'error') {
      return (
        <div className='h-screen max-h-screen relative overflow-hidden flex items-center justify-center'>
          <div className="text-center px-4">
            <h2 className="text-2xl font-['Gilroy-Bold'] text-black mb-4">
              Something went wrong
            </h2>
            <p className="text-lg text-gray-700 mb-6">
              Analysis took longer than expected. Please check again to see if your result is ready.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-['Gilroy-Bold'] hover:bg-blue-700 transition-colors"
            >
              Check Again
            </button>
          </div>
        </div>
      );
    }

    // Results ready state
    if (resultStatus === 'ready') {
      return (
        <div className='min-h-screen bg-[#004A7F] max-h-screen relative overflow-hidden flex items-center justify-center'>
          <div className="text-center px-4">
            <h2 className="text-4xl font-['Gilroy-Bold'] text-white mb-4">
              Your Results are Ready!
            </h2>
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
            </div>
          </div>
        </div>
      );
    }


    return (
      <div className='h-screen max-h-screen relative overflow-hidden'>
        {/* GIF Background */}
        <div>
          <img 
            src={gifSrc}
            className="absolute -top-36 w-full h-full object-cover z-0"
            alt="Processing animation background"
          />
        </div>
        
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0" />
        {/* Card-by-Card Sliding Facts */}
        <div className="absolute bottom-36 w-full px-4">
          <PsychologicalFactsCards />
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute bottom-20 flex justify-center items-center w-full"
        >
          {/* Processing Message */}
          <p 
            className="text-black text-2xl font-['Gilroy-Bold'] tracking-tighter px-2 mt-80 pb-4"
          >
            Generating in 1-2 minutes...
          </p>
        </motion.div>
      </div> 
    );
    }

export default QuestProcessing;