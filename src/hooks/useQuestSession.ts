// ===================================
// QUEST SESSION MANAGEMENT HOOK
// Core hook for managing quest session lifecycle
// ===================================

import { useState, useCallback, useRef, useEffect } from 'react';
import { questDb } from '@/services/quest/questDatabase';
import { useAuth } from '@/contexts/AuthContext';
import type { 
  QuestSession, 
  QuestResponse, 
  SessionState,
  QuestError,
  SaveQuestResponseRequest,
  SessionStatus
} from '@/types/quest';
import type { AIPayload } from '@/types/aiPayload';

export function useQuestSession() {
  const { user } = useAuth();
  const [sessionState, setSessionState] = useState<SessionState>({
    session: null,
    responses: [],
    currentResponse: null,
    isLoading: false,
    error: null
  });

  // Track session timing
  const sessionStartTime = useRef<number | null>(null);
  const questionStartTime = useRef<number | null>(null);
  const autoSaveInterval = useRef<NodeJS.Timeout | null>(null);

  // Clear any intervals on unmount
  useEffect(() => {
    return () => {
      if (autoSaveInterval.current) {
        clearInterval(autoSaveInterval.current);
      }
    };
  }, []);

  /**
   * Start a new quest session
   */
  const startSession = useCallback(async (totalQuestions: number): Promise<QuestSession | null> => {
    if (!user) {
      setSessionState(prev => ({
        ...prev,
        error: { code: 'AUTH_ERROR', message: 'User not authenticated' }
      }));
      return null;
    }

    setSessionState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const result = await questDb.createQuestSession({
        user_id: user.id,
        total_questions: totalQuestions
      });

      if (!result.success) {
        setSessionState(prev => ({
          ...prev,
          isLoading: false,
          error: result.error || { code: 'DATABASE_ERROR', message: 'Failed to create session' }
        }));
        return null;
      }

      const session = result.data!;
      
      // Start timing
      sessionStartTime.current = Date.now();
      questionStartTime.current = Date.now();

      // Set up auto-save interval (every 30 seconds)
      autoSaveInterval.current = setInterval(() => {
        updateSessionProgress();
      }, 5000);

      setSessionState(prev => ({
        ...prev,
        session,
        responses: [],
        currentResponse: null,
        isLoading: false,
        error: null
      }));

      console.log('Quest session started:', session.id);
      return session;
    } catch (error) {
      console.error('Error starting quest session:', error);
      setSessionState(prev => ({
        ...prev,
        isLoading: false,
        error: { code: 'DATABASE_ERROR', message: 'Unexpected error starting session', details: error }
      }));
      return null;
    }
  }, [user]);

  /**
   * Save a quest response
   */
  const saveResponse = useCallback(async (response: Partial<QuestResponse>): Promise<boolean> => {
    if (!sessionState.session || !user) {
      setSessionState(prev => ({
        ...prev,
        error: { code: 'SESSION_NOT_FOUND', message: 'No active session or user not authenticated' }
      }));
      return false;
    }

    if (!response.question_text || !response.response_text || response.question_index === undefined) {
      setSessionState(prev => ({
        ...prev,
        error: { code: 'VALIDATION_ERROR', message: 'Invalid response data' }
      }));
      return false;
    }

    try {
      // Calculate response time
      const responseTime = questionStartTime.current 
        ? Math.round((Date.now() - questionStartTime.current) / 1000)
        : undefined;

      const saveRequest: SaveQuestResponseRequest = {
        session_id: sessionState.session.id,
        question_index: response.question_index,
        question_text: response.question_text,
        question_difficulty: response.question_difficulty || 'medium',
        response_text: response.response_text,
        response_type: response.response_type || 'text_input',
        self_awareness_tags: response.self_awareness_tags || [],
        response_time_seconds: responseTime
      };

      const result = await questDb.saveQuestResponse(saveRequest);

      if (!result.success) {
        setSessionState(prev => ({
          ...prev,
          error: result.error || { code: 'DATABASE_ERROR', message: 'Failed to save response' }
        }));
        return false;
      }

      // Update local state
      const completeResponse: QuestResponse = {
        question_index: response.question_index,
        question_text: response.question_text,
        question_difficulty: response.question_difficulty || 'medium',
        response_text: response.response_text,
        response_type: response.response_type || 'text_input',
        self_awareness_tags: response.self_awareness_tags || [],
        response_time_seconds: responseTime
      };

      setSessionState(prev => ({
        ...prev,
        responses: [...prev.responses.filter(r => r.question_index !== response.question_index), completeResponse],
        currentResponse: null,
        error: null
      }));

      // Update session progress
      await updateSessionProgress();

      // Reset question timer for next question
      questionStartTime.current = Date.now();

      console.log('Response saved for question:', response.question_index);
      return true;
    } catch (error) {
      console.error('Error saving response:', error);
      setSessionState(prev => ({
        ...prev,
        error: { code: 'DATABASE_ERROR', message: 'Unexpected error saving response', details: error }
      }));
      return false;
    }
  }, [sessionState.session, user]);

  /**
   * Update session progress
   */
  const updateSessionProgress = useCallback(async (): Promise<void> => {
    if (!sessionState.session) return;

    try {
      const questionsAnswered = sessionState.responses.length;
      const progressPercentage = Math.round((questionsAnswered / sessionState.session.total_questions) * 100);

      await questDb.updateQuestSession({
        session_id: sessionState.session.id,
        questions_answered: questionsAnswered,
        progress_percentage: progressPercentage,
        current_question_index: questionsAnswered,
        session_status: questionsAnswered === sessionState.session.total_questions ? 'completed' : 'in_progress'
      });

      // Update local session state
      setSessionState(prev => ({
        ...prev,
        session: prev.session ? {
          ...prev.session,
          questions_answered: questionsAnswered,
          progress_percentage: progressPercentage,
          current_question_index: questionsAnswered,
          session_status: questionsAnswered === prev.session.total_questions ? 'completed' : 'in_progress'
        } : null
      }));
    } catch (error) {
      console.error('Error updating session progress:', error);
    }
  }, [sessionState.session, sessionState.responses]);

  /**
   * Complete the quest session
   */
  const completeSession = useCallback(async (): Promise<AIPayload | null> => {
    if (!sessionState.session || !user) {
      setSessionState(prev => ({
        ...prev,
        error: { code: 'SESSION_NOT_FOUND', message: 'No active session or user not authenticated' }
      }));
      return null;
    }

    setSessionState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      // Calculate total duration
      const durationMinutes = sessionStartTime.current 
        ? Math.round((Date.now() - sessionStartTime.current) / 60000 * 10) / 10
        : 0;

      // Complete the session in database
      const result = await questDb.completeQuestSession(
        sessionState.session.id,
        user.id,
        durationMinutes
      );

      if (!result.success) {
        setSessionState(prev => ({
          ...prev,
          isLoading: false,
          error: result.error || { code: 'DATABASE_ERROR', message: 'Failed to complete session' }
        }));
        return null;
      }

      // Generate AI payload
      const aiPayloadResult = await questDb.generateAIPayload(sessionState.session.id, user.id);

      if (!aiPayloadResult.success) {
        setSessionState(prev => ({
          ...prev,
          isLoading: false,
          error: aiPayloadResult.error || { code: 'DATABASE_ERROR', message: 'Failed to generate AI payload' }
        }));
        return null;
      }

      // Clear auto-save interval
      if (autoSaveInterval.current) {
        clearInterval(autoSaveInterval.current);
        autoSaveInterval.current = null;
      }

      // Update session state
      setSessionState(prev => ({
        ...prev,
        session: prev.session ? {
          ...prev.session,
          session_status: 'completed',
          progress_percentage: 100,
          total_duration_minutes: durationMinutes,
          completed_at: new Date().toISOString()
        } : null,
        isLoading: false,
        error: null
      }));

      console.log('Quest session completed:', sessionState.session.id);
      console.log('AI payload generated, duration:', durationMinutes, 'minutes');

      return aiPayloadResult.data!;
    } catch (error) {
      console.error('Error completing quest session:', error);
      setSessionState(prev => ({
        ...prev,
        isLoading: false,
        error: { code: 'DATABASE_ERROR', message: 'Unexpected error completing session', details: error }
      }));
      return null;
    }
  }, [sessionState.session, user]);

  /**
   * Abandon the current session
   */
  const abandonSession = useCallback(async (): Promise<void> => {
    if (!sessionState.session) return;

    try {
      await questDb.updateQuestSession({
        session_id: sessionState.session.id,
        session_status: 'abandoned'
      });

      // Clear auto-save interval
      if (autoSaveInterval.current) {
        clearInterval(autoSaveInterval.current);
        autoSaveInterval.current = null;
      }

      setSessionState({
        session: null,
        responses: [],
        currentResponse: null,
        isLoading: false,
        error: null
      });

      console.log('Quest session abandoned:', sessionState.session.id);
    } catch (error) {
      console.error('Error abandoning session:', error);
    }
  }, [sessionState.session]);

  /**
   * Set current response (for temporary storage before saving)
   */
  const setCurrentResponse = useCallback((response: Partial<QuestResponse> | null): void => {
    setSessionState(prev => ({
      ...prev,
      currentResponse: response
    }));
  }, []);

  /**
   * Clear any errors
   */
  const clearError = useCallback((): void => {
    setSessionState(prev => ({
      ...prev,
      error: null
    }));
  }, []);

  /**
   * Get session duration in minutes
   */
  const getSessionDuration = useCallback((): number => {
    return sessionStartTime.current 
      ? Math.round((Date.now() - sessionStartTime.current) / 60000 * 10) / 10
      : 0;
  }, []);

  return {
    // State
    session: sessionState.session,
    responses: sessionState.responses,
    currentResponse: sessionState.currentResponse,
    isLoading: sessionState.isLoading,
    error: sessionState.error,
    
    // Actions
    startSession,
    saveResponse,
    completeSession,
    abandonSession,
    setCurrentResponse,
    clearError,
    
    // Utilities
    getSessionDuration,
    
    // Computed values
    isSessionActive: !!sessionState.session && sessionState.session.session_status !== 'completed' && sessionState.session.session_status !== 'abandoned',
    progressPercentage: sessionState.session?.progress_percentage || 0,
    questionsAnswered: sessionState.responses.length,
    totalQuestions: sessionState.session?.total_questions || 0
  };
}