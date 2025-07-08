import React, { useState, useEffect, useMemo } from 'react';
import { QuestContext } from './QuestContext';
import { 
  Question, 
  QuestSession, 
  QuestResult, 
  QuestionResponse,
  QuestSessionStatus
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
  
  // Derived state
  const currentQuestionIndex = session?.currentQuestionIndex || 0;
  const currentQuestion = sectionQuestions[currentQuestionIndex] || null;
  const progress = sectionQuestions.length > 0 
    ? ((currentQuestionIndex) / sectionQuestions.length) * 100 
    : 0;
  
  // Update section questions when current section changes  
  useEffect(() => {
    setSectionQuestions(getQuestionsBySection(currentSectionId));
  }, [currentSectionId]);
    
  // Generate a session ID (temporary - will be from backend)
  const generateSessionId = () => `session_${Date.now()}`;
  
  // Start a new quest session
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
        userId: 'current-user', // Will be replaced with actual user ID
        startedAt: new Date().toISOString(),
        status: 'in_progress',
        currentQuestionIndex: 0,
        responses: {},
        sectionId: sectionId || currentSectionId
      };
      
      setSession(newSession);
      return newSession;
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
      return null;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Submit a response to the current question
  const submitResponse = async (
    questionId: string, 
    response: string, 
    tags?: string[]
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
          }
        };
      });
      
      // In a real implementation, this would be an API call to save the response
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Move to the next question
  const nextQuestion = () => {
    if (!session) return;
    
    setSession(prev => {
      if (!prev) return null;
      
      const nextIndex = Math.min(
        (prev.currentQuestionIndex || 0) + 1, 
        sectionQuestions.length - 1
      );
      
      // If this is the last question in the section and there are more sections
      if (nextIndex === sectionQuestions.length - 1) {
        const currentSectionIndex = questSections.findIndex(s => s.id === currentSectionId);
        if (currentSectionIndex < questSections.length - 1) {
          // We'll handle section transitions in the UI layer
        }
      }
      
      return {
        ...prev,
        currentQuestionIndex: nextIndex
      };
    });
  };
  
  // Move to the previous question
  const previousQuestion = () => {
    if (!session) return;
    
    setSession(prev => {
      if (!prev) return null;
      
      const prevIndex = Math.max((prev.currentQuestionIndex || 0) - 1, 0);
      
      return {
        ...prev,
        currentQuestionIndex: prevIndex
      };
    });
  };
  
  // Change to a specific section
  const changeSection = (sectionId: string) => {
    setCurrentSectionId(sectionId);
    
    // Reset question index when changing sections
    setSession(prev => {
      if (!prev) return null;
      
      return {
        ...prev,
        currentQuestionIndex: 0,
        sectionId
      };
    });
  };
  
  // Finish the current section
  const finishSection = () => {
    const currentSectionIndex = questSections.findIndex(s => s.id === currentSectionId);
    
    // If there are more sections, move to the next one
    if (currentSectionIndex < questSections.length - 1) {
      const nextSectionId = questSections[currentSectionIndex + 1].id;
      changeSection(nextSectionId);
      return true;
    }
    
    // If this is the last section, return false
    return false;
  };
  
  // Finish the quest
  const finishQuest = async (): Promise<QuestResult | null> => {
    if (!session) return null;
    
    try {
      setIsSubmitting(true);
      
      // Update session status
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
      
      // Generate a mock result (will be replaced with API call)
      const result: QuestResult = {
        sessionId: session.id,
        userId: session.userId,
        analysisData: {
          summary: "This is a placeholder for AI-generated analysis results.",
          sections: questSections.map(section => ({
            sectionId: section.id,
            sectionTitle: section.title,
            responses: section.questions
              .filter(q => session.responses && session.responses[q.id])
              .map(q => ({
                questionId: q.id,
                questionText: q.text,
                response: session.responses?.[q.id]?.response || '',
                tags: session.responses?.[q.id]?.tags || []
              }))
          }))
        },
        generatedAt: new Date().toISOString()
      };
      
      return result;
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
      return null;
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
    resetQuest
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