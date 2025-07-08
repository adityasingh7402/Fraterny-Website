import { useState, useEffect } from 'react';
import { useQuest } from '../core/useQuest';
import { 
  saveSessionToStorage, 
  loadSessionFromStorage,
  saveResponseToStorage
} from '../utils/questStorage';
import { QuestSession, Question } from '../core/types';
import { HonestyTag } from '../core/types';

interface UseQuestSessionOptions {
  autoSave?: boolean;
  loadSavedSession?: boolean;
}

/**
 * Hook for managing quest session state and persistence
 */
export function useQuestSession(options: UseQuestSessionOptions = {}) {
  const { 
    autoSave = true,
    loadSavedSession = true
  } = options;
  
  const { 
    session, 
    startQuest, 
    submitResponse,
    resetQuest
  } = useQuest();
  
  // Load saved session on mount
  useEffect(() => {
    if (loadSavedSession) {
      const savedSession = loadSessionFromStorage();
      if (savedSession && !session) {
        // Start a new quest with the saved session data
        startQuest();
      }
    }
  }, [loadSavedSession]);
  
  // Auto-save session on changes
  useEffect(() => {
    if (autoSave && session) {
      saveSessionToStorage(session);
    }
  }, [session, autoSave]);
  
  // Enhanced submit response with local storage
  const handleSubmitResponse = async (
    questionId: string,
    response: string,
    tags?: string[]
  ) => {
    // Save to context state
    await submitResponse(questionId, response, tags);
    
    // Also save to local storage
    if (autoSave) {
      saveResponseToStorage(questionId, response, tags as HonestyTag[] | undefined);
    }
  };
  
  // Clear saved session and reset
  const clearSession = () => {
    localStorage.removeItem('fraterny_quest_session');
    localStorage.removeItem('fraterny_quest_responses');
    resetQuest();
  };
  
  return {
    session,
    startQuest,
    submitResponse: handleSubmitResponse,
    resetQuest,
    clearSession,
    hasSavedSession: loadSavedSession && loadSessionFromStorage() !== null
  };
}

export default useQuestSession;