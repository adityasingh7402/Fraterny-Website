import React, { useState } from 'react';
import { QuestProvider } from '../../components/quest/core/QuestProvider';
import { QuestIntro } from '../../components/quest/views/QuestIntro';
import { QuestAssessment } from '../../components/quest/views/QuestAssessment';
import { QuestCompletion } from '../../components/quest/views/QuestCompletion';
import { QuestLoading } from '../../components/quest/views/QuestLoading';
import { QuestError } from '../../components/quest/views/QuestError';
import { useQuestSession, useQuestAnalytics } from '../../components/quest/hooks';

enum QuestState {
  INTRO = 'intro',
  ASSESSMENT = 'assessment',
  COMPLETION = 'completion',
  LOADING = 'loading',
  ERROR = 'error'
}

/**
 * Main Quest page component
 * Integrates all quest components into a complete assessment experience
 */
export function QuestPage() {
  // State for the current view
  const [questState, setQuestState] = useState<QuestState>(QuestState.INTRO);
  const [error, setError] = useState<Error | null>(null);
  
  // Handler functions for state transitions
  const handleStartAssessment = () => {
    setQuestState(QuestState.LOADING);
    
    // Simulate loading for demo purposes
    setTimeout(() => {
      setQuestState(QuestState.ASSESSMENT);
    }, 1500);
  };
  
  const handleCompleteAssessment = () => {
    setQuestState(QuestState.COMPLETION);
  };
  
  const handleRestartAssessment = () => {
    setQuestState(QuestState.INTRO);
  };
  
  const handleError = (error: Error) => {
    setError(error);
    setQuestState(QuestState.ERROR);
  };
  
  return (
    <QuestProvider>
      <div className="quest-page min-h-screen bg-gray-200">
        {/* Render different views based on state */}
        {questState === QuestState.INTRO && (
          <QuestIntro onStart={handleStartAssessment} />
        )}
        
        {questState === QuestState.LOADING && (
          <QuestLoading message="Preparing your assessment..." />
        )}
        
        {questState === QuestState.ASSESSMENT && (
          <QuestAssessment onComplete={handleCompleteAssessment} />
        )}
        
        {questState === QuestState.COMPLETION && (
          <QuestCompletion onRestart={handleRestartAssessment} />
        )}
        
        {questState === QuestState.ERROR && (
          <QuestError 
            error={error ?? undefined} 
            onRetry={() => setQuestState(QuestState.INTRO)} 
          />
        )}
      </div>
    </QuestProvider>
  );
}

export default QuestPage;