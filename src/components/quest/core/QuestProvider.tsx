import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
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
import { googleAnalytics } from '../../../services/analytics/googleAnalytics';

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


  // Auto-save timer ref
  const autoSaveInterval = useRef<NodeJS.Timeout | null>(null);

  // Auto-save effect - saves session responses every 5 seconds
  useEffect(() => {
    if (session && session.responses && Object.keys(session.responses).length > 0) {
      // Clear existing timer
      if (autoSaveInterval.current) {
        clearInterval(autoSaveInterval.current);
      }
      
      // Start new timer - save every 5 seconds
      autoSaveInterval.current = setInterval(() => {
        // console.log('🔄 Auto-saving session responses...');
        localStorage.setItem('fraterny_quest_session', JSON.stringify(session));
      }, 5000);
    }

    // Cleanup timer when session ends or component unmounts
    return () => {
      if (autoSaveInterval.current) {
        clearInterval(autoSaveInterval.current);
      }
    };
  }, [session?.responses]);


  // Immediate save on page unload/browser close
  // useEffect(() => {
  //   const handleBeforeUnload = () => {
  //     if (session && session.responses && Object.keys(session.responses).length > 0) {
  //       console.log('💾 Browser closing - saving session immediately');
  //       localStorage.setItem('fraterny_quest_session', JSON.stringify(session));
  //     }
  //   };

  //   const handleVisibilityChange = () => {
  //     if (document.hidden && session && session.responses && Object.keys(session.responses).length > 0) {
  //       console.log('📱 App backgrounded - saving session immediately');
  //       localStorage.setItem('fraterny_quest_session', JSON.stringify(session));
  //     }
  //   };

  //   // Add event listeners
  //   window.addEventListener('beforeunload', handleBeforeUnload);
  //   document.addEventListener('visibilitychange', handleVisibilityChange);

  //   // Cleanup
  //   return () => {
  //     window.removeEventListener('beforeunload', handleBeforeUnload);
  //     document.removeEventListener('visibilitychange', handleVisibilityChange);
  //   };
  // }, [session]);

  // Immediate save on page unload/browser close + GA4 abandon tracking
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (session && session.responses && Object.keys(session.responses).length > 0) {
        console.log('💾 Browser closing - saving session immediately');
        localStorage.setItem('fraterny_quest_session', JSON.stringify(session));
        
        // NEW: Track quest abandonment in GA4
        if (session.status === 'in_progress') {
          const userState = auth.user ? 'logged_in' : 'anonymous';
          const startTime = session.startedAt ? new Date(session.startedAt).getTime() : Date.now();
          const sessionDuration = (Date.now() - startTime) / 1000;
          const questionsCompleted = Object.keys(session.responses).length;
          const currentQuestionIndex = session.currentQuestionIndex || 0;
          const currentQuestion = sectionQuestions[currentQuestionIndex];
          
          if (currentQuestion) {
            googleAnalytics.trackQuestAbandon({
              session_id: session.id,
              question_id: currentQuestion.id,
              section_id: currentQuestion.sectionId || currentSectionId,
              user_state: userState,
              question_index: currentQuestionIndex + 1,
              session_duration: sessionDuration,
              abandon_reason: 'browser_close'
            });
          }
        }
      }
    };

    const handleVisibilityChange = () => {
      if (document.hidden && session && session.responses && Object.keys(session.responses).length > 0) {
        console.log('📱 App backgrounded - saving session immediately');
        localStorage.setItem('fraterny_quest_session', JSON.stringify(session));
        
        // NEW: Track quest abandonment in GA4 (for mobile users backgrounding the app)
        if (session.status === 'in_progress') {
          const userState = auth.user ? 'logged_in' : 'anonymous';
          const startTime = session.startedAt ? new Date(session.startedAt).getTime() : Date.now();
          const sessionDuration = (Date.now() - startTime) / 1000;
          const questionsCompleted = Object.keys(session.responses).length;
          const currentQuestionIndex = session.currentQuestionIndex || 0;
          const currentQuestion = sectionQuestions[currentQuestionIndex];
          
          if (currentQuestion) {
            googleAnalytics.trackQuestAbandon({
              session_id: session.id,
              question_id: currentQuestion.id,
              section_id: currentQuestion.sectionId || currentSectionId,
              user_state: userState,
              question_index: currentQuestionIndex + 1,
              session_duration: sessionDuration,
              abandon_reason: 'app_backgrounded'
            });
          }
        }
      }
    };

    // Add event listeners
    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Cleanup
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [session, auth.user, currentSectionId, sectionQuestions]);
  
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

      // Check for saved session first
      const savedSession = localStorage.getItem('fraterny_quest_session');
      if (savedSession) {
        try {
          const parsedSession = JSON.parse(savedSession);
          console.log('🔄 Found saved session, restoring progress...');
          console.log('🔍 DEBUG - Saved session found:', parsedSession);
          console.log('🔍 DEBUG - Session status:', parsedSession.status);
          console.log('🔍 DEBUG - Session responses:', Object.keys(parsedSession.responses || {}));
          // setSession(parsedSession);
          const resumedSession = {
            ...parsedSession,
            status: 'in_progress',
            completedAt: undefined
          };
          setSession(resumedSession);
          console.log('✅ Session restored:', resumedSession);
          // setCurrentSectionId(parsedSession.sectionId || currentSectionId);
          // setSectionQuestions(getQuestionsBySection(parsedSession.sectionId || currentSectionId));
          // return parsedSession;
          setCurrentSectionId(parsedSession.sectionId || currentSectionId);
          setSectionQuestions(getQuestionsBySection(parsedSession.sectionId || currentSectionId));
          setIsLoading(false);
          return resumedSession;
        } catch (error) {
          localStorage.removeItem('fraterny_quest_session');
        }
      }
      
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
      // NEW: Track quest start in GA4
      const userState = auth.user ? 'logged_in' : 'anonymous';
      const isResumedSession = !!savedSession;

      googleAnalytics.trackQuestStart({
        session_id: newSession.id,
        user_state: userState,
        total_questions: allQuestions.length,
        is_resumed_session: isResumedSession
      });
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
      
      // NEW: Track successful question completion in GA4
      const userState = auth.user ? 'logged_in' : 'anonymous';
      const sessionId = session?.id || `temp_${Date.now()}`;

      // Find question details for GA4
      const question = sectionQuestions.find(q => q.id === questionId);
      if (question && question.sectionId) {
        const questionIndex = allQuestions.findIndex(q => q.id === questionId) + 1;
        
        googleAnalytics.trackQuestionComplete({
          session_id: sessionId,
          question_id: questionId,
          section_id: question.sectionId,
          user_state: userState,
          question_index: questionIndex,
          response_length: response?.length || 0,
          time_on_question: questionResponse.totalViewTimeSeconds || 0
        });
      }
      
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

  const finishQuest = async (submissionData: any): Promise<QuestResult | null> => {
  console.log('🚀 Starting quest submission...');
  
  try {
    setIsSubmitting(true);
    
    // Extract required IDs
    const sessionId = submissionData.assessment_metadata.session_id;
    const testid = submissionData.user_data.testid;
    const userId = submissionData.user_data.user_id;
    
    
    const response = await axios.post("https://api.fraterny.in/api/agent", submissionData, {
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 300000
    });
    console.log('📦 Server response received:', response.data);

    // Validate response status
    if (!response.data || response.data.status !== "Submitted") {
      const errorMessage = response.data?.message || 'Submission failed - unexpected response';
      console.error('❌ Submission failed:', errorMessage);
      throw new Error(errorMessage);
    }

    console.log('✅ Submission successful:', response.data);

    setSession(prev => {
      if (!prev) return null;
      return {
        ...prev,
        status: 'completed' as QuestSessionStatus,
        completedAt: new Date().toISOString(),
        durationMinutes: prev.startedAt 
          ? (Date.now() - new Date(prev.startedAt).getTime()) / 60000 
          : undefined
      };
    });
    
    // console.log('✅ Analysis completed successfully!');
    // console.log('📦 Server response:', response.data);
    
    // Store data locally
    localStorage.setItem('questSessionId', sessionId);
    localStorage.setItem('testid', testid);

    // Clear auto-saved session data after successful submission
    localStorage.removeItem('fraterny_quest_session');
    console.log('🧹 Cleared auto-saved session data after successful submission');

    const userState = auth.user ? 'logged_in' : 'anonymous';
    const startTime = session?.startedAt ? new Date(session.startedAt).getTime() : Date.now();
    const totalDuration = (Date.now() - startTime) / 1000; // in seconds
    const questionsCompleted = session?.responses ? Object.keys(session.responses).length : 0;

    googleAnalytics.trackQuestComplete({
      session_id: sessionId,
      user_state: userState,
      total_duration: totalDuration,
      questions_completed: questionsCompleted
    });
    
    // const targetUrl = `/quest-result/processing/${userId}/${sessionId}/${testid}`;
    // navigate(targetUrl);

    const navigationData = {
      targetUrl: `/quest-result/processing/${userId}/${sessionId}/${testid}`,
      userId,
      sessionId,
      testid
    };
    
    // Return result
    // return {
    //   sessionId: sessionId,
    //   userId: userId,
    //   analysisData: {
    //     summary: "Quest analysis completed successfully.",
    //     sections: []
    //   },
    //   generatedAt: new Date().toISOString()
    // };
    return {
      sessionId: sessionId,
      userId: userId,
      navigationData: navigationData,
      analysisData: {
        summary: "Quest analysis completed successfully.",
        sections: []
      },
      generatedAt: new Date().toISOString()
    };
    
  } catch (error: any) {
    console.error('❌ Quest submission failed:', error.message);
    
    // Set error in context for UI to show
    // setError(error instanceof Error ? error : new Error('Submission failed'));
    // If it's a network error, check if submission actually succeeded
    if (error.code === 'NETWORK_ERROR' || 
    error.message.includes('timeout') || 
    error.message.includes('Network Error') ||
    error.code === 'ECONNABORTED') {
  
  // Extract IDs (move this outside try-catch to ensure they're available)
  const sessionId = submissionData.assessment_metadata.session_id;
  const testid = submissionData.user_data.testid;
  const userId = submissionData.user_data.user_id;
  
  try {
    console.log('🔍 Network error detected, checking if submission actually succeeded...');
    const statusResponse = await fetch(`https://api.fraterny.in/api/status/${testid}`);
    const statusData = await statusResponse.json();
    
    if (statusData.status === 'processing' || statusData.status === 'ready') {
      console.log('✅ Submission was actually successful, navigating to processing...');
      
      // Mark session as completed and do all success cleanup
      setSession(prev => {
        if (!prev) return null;
        return {
          ...prev,
          status: 'completed' as QuestSessionStatus,
          completedAt: new Date().toISOString(),
          durationMinutes: prev.startedAt 
            ? (Date.now() - new Date(prev.startedAt).getTime()) / 60000 
            : undefined
        };
      });
      
      localStorage.setItem('questSessionId', sessionId);
      localStorage.setItem('testid', testid);
      localStorage.removeItem('fraterny_quest_session');
      
      const navigationData = {
        targetUrl: `/quest-result/processing/${userId}/${sessionId}/${testid}`,
        userId,
        sessionId,
        testid
      };

      return {
        sessionId: sessionId,
        userId: userId,
        navigationData: navigationData,
        analysisData: {
          summary: "Quest analysis completed successfully.",
          sections: []
        },
        generatedAt: new Date().toISOString()
      };
    }
  } catch (statusError) {
    console.log('Status check also failed, will show retry option');
  }
}
    
    // Re-throw so QuestCompletion can handle it
    throw error;
    
  } finally {
    setIsSubmitting(false);
  }
  };
    
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