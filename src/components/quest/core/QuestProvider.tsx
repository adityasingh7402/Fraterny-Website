import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { supabase } from '../../../integrations/supabase/client';
import axios from 'axios';
import { QuestContext } from './QuestContext';
import { 
  Question, 
  QuestSession, 
  QuestResult, 
  QuestionResponse,
  QuestSessionStatus,
  HonestyTag
} from './types';
import questSections, { getAllQuestions, getQuestionsBySection } from './questions';

interface QuestProviderProps {
  children: React.ReactNode;
  initialSectionId?: string;
}

export function QuestProvider({ children, initialSectionId }: QuestProviderProps) {
  // State
  const [session, setSession] = useState<QuestSession | null>(null);
  const [currentSectionId, setCurrentSectionId] = useState<string>(initialSectionId || questSections[0].id);
  const [allQuestions, setAllQuestions] = useState<Question[]>(getAllQuestions());
  const [sectionQuestions, setSectionQuestions] = useState<Question[]>(
    initialSectionId ? getQuestionsBySection(initialSectionId) : getQuestionsBySection(questSections[0].id)
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  // ✨ NEW STATE - Add these lines after existing useState declarations
  const [allowSkip, setAllowSkip] = useState(true);
  const [visitedQuestions, setVisitedQuestions] = useState<string[]>([]);
  const [currentViewingQuestion, setCurrentViewingQuestion] = useState<string | null>(null);
const [questionViewTimes, setQuestionViewTimes] = useState<Record<string, number>>({});


  // submit quest
  const navigate = useNavigate();
  const auth = useAuth();


  
  // Derived state
  const currentQuestionIndex = session?.currentQuestionIndex || 0;
  const currentQuestion = sectionQuestions[currentQuestionIndex] || null;
  // Helper function to count responses in current section
  const getResponseCountForCurrentSection = () => {
    if (!session?.responses) return 0;
    return sectionQuestions.filter(q => session.responses && session.responses[q.id]).length;
  };
  const progress = sectionQuestions.length > 0 
  ? ((getResponseCountForCurrentSection()) / sectionQuestions.length) * 100 
  : 0;
  
  // Update section questions when current section changes  
  useEffect(() => {
    setSectionQuestions(getQuestionsBySection(currentSectionId));
  }, [currentSectionId]);
    
  // Generate a session ID (temporary - will be from backend)
  const generateSessionId = () => `session_${Date.now()}`;
  

  // ✨ UPDATED - Replace the existing startQuest function with this
  const startQuest = async (sectionId?: string): Promise<QuestSession | null> => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Set section if provided
      if (sectionId) {
        setCurrentSectionId(sectionId);
        setSectionQuestions(getQuestionsBySection(sectionId));
      }
      
      // Create a new session (will be replaced with API call)
      const newSession: QuestSession = {
        id: generateSessionId(),
        userId: auth.user?.id || 'anonymous', // Will be replaced with actual user ID
        startedAt: new Date().toISOString(),
        status: 'in_progress',
        currentQuestionIndex: 0,
        responses: {},
        sectionId: sectionId || currentSectionId,
        // NEW PROPERTIES
        allowSkip: true,
        visitedQuestions: [],
        questionProgress: {}
      };
      
      setSession(newSession);
      setVisitedQuestions([]);
      return newSession;
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-advance logic after response submission
  // const autoAdvance = () => {
  //   if (!session) return;
    
  //   const currentIndex = session.currentQuestionIndex || 0;
  //   const isLastQuestionInSection = currentIndex === sectionQuestions.length - 1;
    
  //   if (isLastQuestionInSection) {
  //     // Try to move to next section
  //     const hasMoreSections = finishSection();
      
  //     // If no more sections, finish quest
  //     if (!hasMoreSections) {
  //       finishQuest();
  //     }
  //   } else {
  //     // Move to next question in current section
  //     nextQuestion();
  //   }
  // };
  
  // ✨ UPDATED - Replace the entire existing submitResponse function with this
  const submitResponse = async (
    questionId: string, 
    response: string, 
    tags?: HonestyTag[]
  ): Promise<void> => {
    if (!session) return;
    
    try {
      setIsSubmitting(true);
      
      // Create the response object
      const questionResponse: QuestionResponse = {
        questionId,
        response,
        tags,
        timestamp: new Date().toISOString(),
        viewStartTime: questionViewTimes[questionId] ? new Date(questionViewTimes[questionId]).toISOString() : new Date().toISOString(),
        totalViewTimeSeconds: session.responses?.[questionId]?.totalViewTimeSeconds || 0
      };
      
      // Update session with the new response
      setSession(prev => {
        if (!prev) return null;
        
        return {
          ...prev,
          responses: {
            ...(prev.responses || {}),
            [questionId]: questionResponse
          },
          // ✨ NEW - Track question progress
          questionProgress: {
            ...(prev.questionProgress || {}),
            [questionId]: 'answered'
          },
          // ✨ NEW - Track visited questions
          visitedQuestions: [
            ...(prev.visitedQuestions || []),
            questionId
          ]
        };
      });
      
      // ✨ REMOVED - Auto-advance logic removed
      // User now controls navigation manually
      
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setIsSubmitting(false);
    }
  };

  // Track when user starts viewing a question
const trackQuestionView = (questionId: string) => {
  if (currentViewingQuestion === questionId) return; // Already tracking
  
  // Stop previous tracking
  stopQuestionTracking();
  
  // Start new tracking
  setCurrentViewingQuestion(questionId);
  setQuestionViewTimes(prev => ({
    ...prev,
    [questionId]: Date.now()
  }));
};

// Stop tracking current question
const stopQuestionTracking = () => {
  if (!currentViewingQuestion) return;
  
  const startTime = questionViewTimes[currentViewingQuestion];
  if (startTime) {
    const timeSpent = Math.round((Date.now() - startTime) / 1000);
    
    // Update session with accumulated time
    setSession(prev => {
      if (!prev || !prev.responses) return prev;
      
      const existingResponse = prev.responses[currentViewingQuestion];
      if (existingResponse) {
        const currentTotal = existingResponse.totalViewTimeSeconds || 0;
        return {
          ...prev,
          responses: {
            ...prev.responses,
            [currentViewingQuestion]: {
              ...existingResponse,
              totalViewTimeSeconds: currentTotal + timeSpent
            }
          }
        };
      }
      return prev;
    });
  }
  
  setCurrentViewingQuestion(null);
};
  
  const nextQuestion = () => {
    if (!session) return;
    
    const currentIndex = session.currentQuestionIndex || 0;
    const currentQuestion = sectionQuestions[currentIndex];
    
    // Don't go past the last question
    if (currentIndex >= sectionQuestions.length - 1) return;
    
    const nextIndex = currentIndex + 1;
    
    setSession(prev => {
      if (!prev) return null;
      
      // Mark current question as visited when moving away
      const updatedVisitedQuestions = currentQuestion && !prev.visitedQuestions?.includes(currentQuestion.id)
        ? [...(prev.visitedQuestions || []), currentQuestion.id]
        : prev.visitedQuestions || [];
      
      return {
        ...prev,
        currentQuestionIndex: nextIndex,
        visitedQuestions: updatedVisitedQuestions
      };
    });
  };

const previousQuestion = () => {
  if (!session) return;
  
  const currentIndex = session.currentQuestionIndex || 0;
  
  // If we're at the first question of current section, go to previous section
  if (currentIndex === 0) {
    const currentSectionIndex = questSections.findIndex(s => s.id === currentSectionId);
    
    // If there's a previous section, go to its last question
    if (currentSectionIndex > 0) {
      const previousSectionId = questSections[currentSectionIndex - 1].id;
      const previousSectionQuestions = getQuestionsBySection(previousSectionId);
      
      // Change to previous section and go to its last question
      setCurrentSectionId(previousSectionId);
      
      setSession(prev => {
        if (!prev) return null;
        
        return {
          ...prev,
          currentQuestionIndex: previousSectionQuestions.length - 1,
          sectionId: previousSectionId
        };
      });
    }
    // If already in first section, do nothing (already at beginning)
  } else {
    // Move to previous question in current section
    setSession(prev => {
      if (!prev) return null;
      
      const prevIndex = currentIndex - 1;
      
      return {
        ...prev,
        currentQuestionIndex: prevIndex
      };
    });
  }
};

  // ✨ NEW FUNCTIONS - Add these after the existing previousQuestion function
  
  // Skip current question
  const skipQuestion = () => {
    if (!session) return;
    
    const currentIndex = session.currentQuestionIndex || 0;
    const currentQuestion = sectionQuestions[currentIndex];
    
    if (currentQuestion) {
      // Mark as skipped in session
      setSession(prev => {
        if (!prev) return null;
        
        return {
          ...prev,
          questionProgress: {
            ...(prev.questionProgress || {}),
            [currentQuestion.id]: 'skipped'
          },
          visitedQuestions: [
            ...(prev.visitedQuestions || []),
            currentQuestion.id
          ]
        };
      });
      
      // Move to next question
      nextQuestion();
    }
  };
  
  // Navigate directly to a specific question
  const goToQuestion = (questionIndex: number) => {
    if (!session) return;
    
    const targetIndex = Math.max(0, Math.min(questionIndex, sectionQuestions.length - 1));
    const currentQuestion = sectionQuestions[session.currentQuestionIndex || 0];
    
    // Mark current question as visited if we're moving away from it
    if (currentQuestion && targetIndex !== (session.currentQuestionIndex || 0)) {
      setSession(prev => {
        if (!prev) return null;
        
        return {
          ...prev,
          currentQuestionIndex: targetIndex,
          visitedQuestions: [
            ...(prev.visitedQuestions || []),
            currentQuestion.id
          ]
        };
      });
    } else {
      setSession(prev => {
        if (!prev) return null;
        
        return {
          ...prev,
          currentQuestionIndex: targetIndex
        };
      });
    }
  };
  
  // Edit existing response (navigate to question and enable edit mode)
  const editResponse = (questionId: string) => {
    const questionIndex = sectionQuestions.findIndex(q => q.id === questionId);
    if (questionIndex >= 0) {
      goToQuestion(questionIndex);
    }
  };
  
  // Updated finishQuest function for QuestProvider.tsx
  // const finishQuest = async (submissionData: any): Promise<QuestResult | null> => {
  //   // if (!session) return null;
  //   console.log(`submission data from finish quest ${submissionData}`);
    
  //   try {
  //     setIsSubmitting(true);
  //     console.log('🚀 Starting quest submission...');
      
  //     // Extract IDs from submission data
  //     const sessionId = submissionData.assessment_metadata.session_id;
  //     const testid = submissionData.user_data.testid;
  //     const userId = submissionData.user_data.user_id;
      
  //     console.log('📊 Extracted IDs:');
  //     console.log('   SessionId:', sessionId);
  //     console.log('   TestId:', testid);
  //     console.log('   UserId:', userId);
      
  //     // Update session status to completed
  //     setSession(prev => {
  //       if (!prev) return null;
        
  //       return {
  //         ...prev,
  //         status: 'completed',
  //         completedAt: new Date().toISOString(),
  //         durationMinutes: prev.startedAt 
  //           ? (Date.now() - new Date(prev.startedAt).getTime()) / 60000 
  //           : undefined
  //       };
  //     });
      
  //     // Submit to backend API
  //     console.log('📤 Submitting to backend API...');
  //     const response = await axios.post("https://api.fraterny.in/api/agent", submissionData, {
  //       headers: {
  //         'Content-Type': 'application/json',  
  //       },
  //       timeout: 420000,
  //     });
      
  //     console.log('✅ API submission successful:', response.data);
      
  //     // Store data in localStorage
  //     console.log('💾 Storing data in localStorage...');
  //     localStorage.setItem('questSessionId', sessionId);
  //     localStorage.setItem('testid', testid);
      

  //     const targetUrl = `/quest-result/result/${userId}/${sessionId}/${testid}`;
  //     console.log('🚀 Navigating to processing page:', targetUrl);
  //     navigate(targetUrl);
      
  //     // Create result object for return (optional - mainly for consistency)
  //     const result: QuestResult = {
  //       sessionId: sessionId,
  //       userId: userId,
  //       analysisData: {
  //         summary: "Quest submitted successfully - processing started.",
  //         sections: []
  //       },
  //       generatedAt: new Date().toISOString()
  //     };
      
  //     return result;
      
  //   } catch (error: any) {
  //     console.error('❌ Quest submission failed:', error.response?.data?.message || error.message);
  //     setError(error instanceof Error ? error : new Error(error.message || 'Submission failed'));
  //     throw error; // Re-throw so QuestCompletion can handle the error state
  //   } finally {
  //     setIsSubmitting(false);
  //   }
  // };

  const finishQuest = async (submissionData: any): Promise<QuestResult | null> => {
  console.log('🚀 finishQuest started with data:', submissionData);
  
  try {
    setIsSubmitting(true);
    console.log('🔄 Setting isSubmitting to true');
    
    // Extract IDs from submission data
    const sessionId = submissionData.assessment_metadata.session_id;
    const testid = submissionData.user_data.testid;
    const userId = submissionData.user_data.user_id;
    
    console.log('📊 Extracted IDs:');
    console.log('   SessionId:', sessionId);
    console.log('   TestId:', testid);
    console.log('   UserId:', userId);
    
    // Validate required IDs
    if (!sessionId || !testid || !userId) {
      throw new Error(`Missing required IDs: sessionId=${sessionId}, testId=${testid}, userId=${userId}`);
    }
    
    // Update session status to completed
    console.log('📝 Updating session status to completed...');
    setSession(prev => {
      if (!prev) {
        console.log('⚠️ No previous session found');
        return null;
      }
      
      const updatedSession = {
        ...prev,
        status: 'completed' as QuestSessionStatus,
        completedAt: new Date().toISOString(),
        durationMinutes: prev.startedAt 
          ? (Date.now() - new Date(prev.startedAt).getTime()) / 60000 
          : undefined
      };
      
      console.log('✅ Session updated:', {
        id: updatedSession.id,
        status: updatedSession.status,
        duration: updatedSession.durationMinutes
      });
      
      return updatedSession;
    });
    
    // API submission with retry logic
    console.log('📤 Starting API submission with retry logic...');
    
    let response;
    let retryCount = 0;
    const maxRetries = 2;
    const retryDelay = 2000; // 2 seconds
    const requestTimeout = 120000; // 2 minutes
    
    console.log(`🔧 Retry configuration: maxRetries=${maxRetries}, delay=${retryDelay}ms, timeout=${requestTimeout}ms`);
    
    while (retryCount <= maxRetries) {
      const attemptNumber = retryCount + 1;
      console.log(`\n🎯 === API ATTEMPT ${attemptNumber}/${maxRetries + 1} ===`);
      console.log(`⏰ Attempt started at: ${new Date().toISOString()}`);
      
      try {
        const startTime = Date.now();
        
        response = await axios.post("https://api.fraterny.in/api/agent", submissionData, {
          headers: {
            'Content-Type': 'application/json',  
          },
          timeout: requestTimeout,
        });
        
        const endTime = Date.now();
        const duration = endTime - startTime;
        
        console.log(`✅ API submission successful!`);
        console.log(`📊 Request took: ${duration}ms`);
        console.log(`📦 Response status: ${response.status}`);
        console.log(`📦 Response data:`, response.data);
        
        break; // Success, exit retry loop
        
      } catch (apiError: any) {
        retryCount++;
        const errorTime = Date.now();
        
        console.log(`\n❌ API ATTEMPT ${attemptNumber} FAILED`);
        console.log(`⏰ Error occurred at: ${new Date(errorTime).toISOString()}`);
        console.log(`🔍 Error message: "${apiError.message}"`);
        console.log(`🔍 Error code: "${apiError.code}"`);
        console.log(`🔍 Error response status: ${apiError.response?.status || 'undefined'}`);
        console.log(`🔍 Error response data:`, apiError.response?.data || 'undefined');
        console.log(`🔍 Full error object:`, {
          name: apiError.name,
          message: apiError.message,
          code: apiError.code,
          status: apiError.response?.status,
          statusText: apiError.response?.statusText,
          headers: apiError.response?.headers
        });
        
        // Determine if this is a timeout-related error
        const isDirectTimeout = apiError.response?.status === 504;
        const isAxiosTimeout = apiError.code === 'ECONNABORTED';
        const isCorsBlockedTimeout = apiError.message === 'Network Error' && apiError.code === 'ERR_NETWORK';
        const isConnectionRefused = apiError.code === 'ERR_CONNECTION_REFUSED';
        const isNetworkError = apiError.message === 'Network Error';
        
        console.log(`\n🔍 ERROR CLASSIFICATION:`);
        console.log(`   Direct 504 timeout: ${isDirectTimeout}`);
        console.log(`   Axios timeout: ${isAxiosTimeout}`);
        console.log(`   CORS-blocked timeout: ${isCorsBlockedTimeout}`);
        console.log(`   Connection refused: ${isConnectionRefused}`);
        console.log(`   Generic network error: ${isNetworkError}`);
        
        const isTimeoutError = isDirectTimeout || isAxiosTimeout || isCorsBlockedTimeout;
        
        console.log(`\n⚖️ DECISION: ${isTimeoutError ? 'TREATING AS TIMEOUT' : 'TREATING AS NON-TIMEOUT ERROR'}`);
        
        if (isTimeoutError) {
          if (retryCount <= maxRetries) {
            console.log(`\n🔄 RETRY LOGIC:`);
            console.log(`   Current attempt: ${retryCount}`);
            console.log(`   Max retries: ${maxRetries}`);
            console.log(`   Will retry: YES`);
            console.log(`   Waiting ${retryDelay}ms before retry...`);
            
            await new Promise(resolve => setTimeout(resolve, retryDelay));
            
            console.log(`🔄 Retry delay completed, starting next attempt...`);
            continue; // Continue to next iteration
            
          } else {
            console.log(`\n⏰ TIMEOUT EXHAUSTED:`);
            console.log(`   All ${maxRetries + 1} attempts failed`);
            console.log(`   Implementing graceful timeout handling...`);
            console.log(`   Backend processing may still continue...`);
            
            // Store data in localStorage
            console.log('💾 Storing data in localStorage...');
            localStorage.setItem('questSessionId', sessionId);
            localStorage.setItem('testid', testid);
            console.log(`💾 Stored: questSessionId=${sessionId}`);
            console.log(`💾 Stored: testid=${testid}`);
            
            // Navigate to processing page instead of result page
            const targetUrl = `/quest-result/result/${userId}/${sessionId}/${testid}`;
            console.log(`🚀 Navigating to processing page: ${targetUrl}`);
            navigate(targetUrl);
            
            // Return success result since we're handling gracefully
            const gracefulResult = {
              sessionId: sessionId,
              userId: userId,
              analysisData: {
                summary: "Quest submitted - processing may take a few minutes.",
                sections: []
              },
              generatedAt: new Date().toISOString()
            };
            
            console.log(`✅ Returning graceful result:`, gracefulResult);
            return gracefulResult;
          }
        } else {
          console.log(`\n🚫 NON-TIMEOUT ERROR:`);
          console.log(`   Error type: ${apiError.name || 'Unknown'}`);
          console.log(`   Will not retry, throwing error immediately`);
          console.log(`   This will propagate to QuestCompletion error handling`);
          
          throw apiError; // Non-timeout error, throw immediately
        }
      }
    }
    
    // If we reach here, API call was successful
    console.log(`\n🎉 === API SUBMISSION COMPLETED SUCCESSFULLY ===`);
    
    // Store data in localStorage
    console.log('💾 Storing successful submission data in localStorage...');
    localStorage.setItem('questSessionId', sessionId);
    localStorage.setItem('testid', testid);
    console.log(`💾 Stored: questSessionId=${sessionId}`);
    console.log(`💾 Stored: testid=${testid}`);
    
    // Navigate to result page on success
    const targetUrl = `/quest-result/result/${userId}/${sessionId}/${testid}`;
    console.log(`🚀 Navigating to result page: ${targetUrl}`);
    navigate(targetUrl);
    
    // Create result object for return
    const result: QuestResult = {
      sessionId: sessionId,
      userId: userId,
      analysisData: {
        summary: "Quest submitted successfully - processing completed.",
        sections: []
      },
      generatedAt: new Date().toISOString()
    };
    
    console.log(`✅ Returning successful result:`, result);
    return result;
    
  } catch (error: any) {
    console.log(`\n💥 === OUTER CATCH BLOCK ===`);
    console.log(`❌ Quest submission failed in outer catch`);
    console.log(`🔍 Error type: ${error.name || 'Unknown'}`);
    console.log(`🔍 Error message: "${error.message}"`);
    console.log(`🔍 Error code: "${error.code || 'undefined'}"`);
    console.log(`🔍 Error response:`, error.response?.data || 'undefined');
    console.log(`🔍 Full error object:`, error);
    
    const errorToSet = error instanceof Error ? error : new Error(error.message || 'Submission failed');
    console.log(`📝 Setting error state:`, errorToSet.message);
    setError(errorToSet);
    
    console.log(`🔄 Re-throwing error for QuestCompletion to handle...`);
    throw error; // Re-throw so QuestCompletion can handle the error state
    
  } finally {
    console.log(`\n🧹 === CLEANUP (FINALLY BLOCK) ===`);
    console.log(`🔄 Setting isSubmitting to false`);
    setIsSubmitting(false);
    console.log(`✅ finishQuest function completed`);
  }
  };
  
  // Reset the quest state
  const resetQuest = () => {
    setSession(null);
    setError(null);
    setCurrentSectionId(initialSectionId || questSections[0].id);
  };
  
  // Get current section data
  const getCurrentSection = () => {
    return questSections.find(s => s.id === currentSectionId) || questSections[0];
  };

const getTotalQuestionsInAssessment = () => {
  return questSections.reduce((total, section) => total + section.questions.length, 0);
};

// Get current global question index (across all sections)
const getCurrentGlobalQuestionIndex = () => {
  const currentSectionIndex = questSections.findIndex(s => s.id === currentSectionId);
  const questionsBefore = questSections
    .slice(0, currentSectionIndex)
    .reduce((total, section) => total + section.questions.length, 0);
  
  return questionsBefore + (session?.currentQuestionIndex || 0);
};

// Check if this is the very last question in entire assessment
const isLastQuestionInEntireAssessment = () => {
  const totalQuestions = getTotalQuestionsInAssessment();
  const currentGlobalIndex = getCurrentGlobalQuestionIndex();
  return currentGlobalIndex === totalQuestions - 1;
};

const finishSection = (): boolean => {
  console.log('🔄 finishSection called');
  console.log('📍 Session exists:', !!session);
  console.log('📍 Current section:', getCurrentSection()?.id);
  
  if (!session || !getCurrentSection()) {
    console.log('❌ No session or current section - returning false');
    return false;
  }
  
  // Check if all questions in current section are answered
  const currentSectionQuestions = getCurrentSection().questions;
  console.log('📊 Questions in current section:', currentSectionQuestions.length);
  console.log('📝 Session responses:', Object.keys(session.responses || {}));
  
  const allQuestionsAnswered = currentSectionQuestions.every(q => {
    const hasResponse = session.responses && session.responses[q.id];
    console.log(`   Question ${q.id}: ${hasResponse ? '✅' : '❌'} answered`);
    return hasResponse;
  });
  
  console.log('✅ All questions answered:', allQuestionsAnswered);
  
  if (!allQuestionsAnswered) {
    console.log('❌ Not all questions answered - returning false');
    // Don't automatically move to next section if current isn't complete
    return false;
  }
  
  // Find next section
  const currentIndex = questSections.findIndex(s => s.id === currentSectionId);
  console.log('📍 Current section index:', currentIndex);
  console.log('📍 Total sections:', questSections.length);
  
  const nextSectionIndex = currentIndex + 1;
  console.log('📍 Next section index:', nextSectionIndex);
  
  if (nextSectionIndex < questSections.length) {
    // Move to next section
    const nextSection = questSections[nextSectionIndex];
    console.log('➡️ Moving to next section:', nextSection.id, nextSection.title);
    changeSection(nextSection.id);
    console.log('✅ Section change completed - returning true');
    return true;
  }
  
  // No more sections - assessment is complete
  console.log('🏁 No more sections - assessment complete - returning false');
  return false;
};

const changeSection = (newSectionId: string) => {
  // console.log('🔀 changeSection called with:', newSectionId);
  
  // Validate that the section exists
  const targetSection = questSections.find(s => s.id === newSectionId);
  // console.log('🎯 Target section found:', !!targetSection, targetSection?.title);
  
  if (!targetSection) {
    console.warn(`❌ Section ${newSectionId} not found`);
    return;
  }

  // If already in the target section, do nothing
  if (currentSectionId === newSectionId) {
    // console.log('⚠️ Already in target section - no change needed');
    return;
  }

  // console.log('📍 Changing from section:', currentSectionId, 'to:', newSectionId);

  // Update current section
  setCurrentSectionId(newSectionId);
  // console.log('✅ Current section ID updated');
  
  // Reset to first question of the new section
  setSession(prev => {
    if (!prev) {
      console.log('❌ No previous session state');
      return null;
    }
    
    // console.log('📝 Updating session state:');
    // console.log('   Previous question index:', prev.currentQuestionIndex);
    // console.log('   Previous section ID:', prev.sectionId);
    // console.log('   New question index: 0');
    // console.log('   New section ID:', newSectionId);
    
    const newState = {
      ...prev,
      currentQuestionIndex: 0, // Always start from first question
      sectionId: newSectionId
    };
    
    // console.log('✅ Session state updated');
    return newState;
  });
  
  // Clear any errors
  setError(null);
  // console.log('🧹 Errors cleared');
  // console.log('🏁 changeSection completed');
};
  
  // Context value
  const value = useMemo(() => ({
    // State
    session,
    currentQuestion,
    questions: sectionQuestions,
    allQuestions,
    isLoading,
    isSubmitting,
    progress,
    error,
    currentSectionId,
    
    // Section data
    sections: questSections,
    currentSection: getCurrentSection(),
    
    // Actions
    startQuest,
    submitResponse,
    nextQuestion,
    previousQuestion,
    changeSection,
    finishSection,
    finishQuest,
    resetQuest,
    skipQuestion,
    goToQuestion,
    editResponse,
    

     getTotalQuestionsInAssessment,
  getCurrentGlobalQuestionIndex,
  isLastQuestionInEntireAssessment,

  trackQuestionView,        // ADD THIS LINE
  stopQuestionTracking,
  }), [
    session,
    currentQuestion,
    sectionQuestions,
    allQuestions,
    isLoading,
    isSubmitting,
    progress,
    error,
    currentSectionId
  ]);
  
  return (
    <QuestContext.Provider value={value}>
      {children}
    </QuestContext.Provider>
  );
}