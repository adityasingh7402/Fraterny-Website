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
        timestamp: new Date().toISOString()
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
  
  // Finish the quest
  // const finishQuest = async (): Promise<QuestResult | null> => {
  //   if (!session) return null;
    
  //   try {
  //     setIsSubmitting(true);
      
  //     // Update session status
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
      
  //     // Generate a mock result (will be replaced with API call)
  //     const result: QuestResult = {
  //       sessionId: session.id,
  //       userId: session.userId,
  //       analysisData: {
  //         summary: "This is a placeholder for AI-generated analysis results.",
  //         sections: questSections.map(section => ({
  //           sectionId: section.id,
  //           sectionTitle: section.title,
  //           responses: section.questions
  //             .filter(q => session.responses && session.responses[q.id])
  //             .map(q => ({
  //               questionId: q.id,
  //               questionText: q.text,
  //               response: session.responses?.[q.id]?.response || '',
  //               tags: session.responses?.[q.id]?.tags || []
  //             }))
  //         }))
  //       },
  //       generatedAt: new Date().toISOString()
  //     };
      
  //     return result;
  //   } catch (err) {
  //     setError(err instanceof Error ? err : new Error(String(err)));
  //     return null;
  //   } finally {
  //     setIsSubmitting(false);
  //   }
  // };
  // Updated finishQuest function for QuestProvider.tsx
const finishQuest = async (submissionData: any): Promise<QuestResult | null> => {
  // if (!session) return null;
  console.log(`submission data from finish quest ${submissionData}`);
  
  try {
    setIsSubmitting(true);
    console.log('🚀 Starting quest submission...');
    
    // Extract IDs from submission data
    const sessionId = submissionData.assessment_metadata.session_id;
    const testid = submissionData.user_data.testid;
    const userId = submissionData.user_data.user_id;
    
    console.log('📊 Extracted IDs:');
    console.log('   SessionId:', sessionId);
    console.log('   TestId:', testid);
    console.log('   UserId:', userId);
    
    // Update session status to completed
    setSession(prev => {
      if (!prev) return null;
      
      return {
        ...prev,
        status: 'completed',
        completedAt: new Date().toISOString(),
        durationMinutes: prev.startedAt 
          ? (Date.now() - new Date(prev.startedAt).getTime()) / 60000 
          : undefined
      };
    });
    
    // Submit to backend API
    console.log('📤 Submitting to backend API...');
    const response = await axios.post("https://api.fraterny.in/api/agent", submissionData, {
      headers: {
        'Content-Type': 'application/json',  
      },
      timeout: 420000,
    });
    
    console.log('✅ API submission successful:', response.data);
    
    // Store data in localStorage
    console.log('💾 Storing data in localStorage...');
    localStorage.setItem('questSessionId', sessionId);
    localStorage.setItem('testid', testid);
    

    const targetUrl = `/quest-result/result/${userId}/${sessionId}/${testid}`;
    console.log('🚀 Navigating to processing page:', targetUrl);
    navigate(targetUrl);
    
    // Create result object for return (optional - mainly for consistency)
    const result: QuestResult = {
      sessionId: sessionId,
      userId: userId,
      analysisData: {
        summary: "Quest submitted successfully - processing started.",
        sections: []
      },
      generatedAt: new Date().toISOString()
    };
    
    return result;
    
  } catch (error: any) {
    console.error('❌ Quest submission failed:', error.response?.data?.message || error.message);
    setError(error instanceof Error ? error : new Error(error.message || 'Submission failed'));
    throw error; // Re-throw so QuestCompletion can handle the error state
  } finally {
    setIsSubmitting(false);
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
  isLastQuestionInEntireAssessment
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