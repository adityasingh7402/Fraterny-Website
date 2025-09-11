import React, { useState } from 'react';
import { QuestProvider } from '../../components/quest/core/QuestProvider';
import { QuestIntro } from '../../components/quest/views/QuestIntro';
import { QuestAssessment } from '../../components/quest/views/QuestAssessment';
import { QuestCompletion } from '../../components/quest/views/QuestCompletion';
import { QuestLoading } from '../../components/quest/views/QuestLoading';
import { QuestError } from '../../components/quest/views/QuestError';
import { useQuestSession, useQuestAnalytics } from '../../components/quest/hooks';
import { RecentAssessmentCheck } from '../../components/quest/views/RecentAssessmentCheck';

enum QuestState {
  INTRO = 'intro',
  ASSESSMENT = 'assessment',
  // COMPLETION = 'completion',
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
  const [showRecentCheck, setShowRecentCheck] = useState(false);
  // const [questState, setQuestState] = useState(QuestState.LANDING);

  
  // Handler functions for state transitions
  // const handleStartAssessment = () => {
  //   setQuestState(QuestState.LOADING);
    
  //   // Simulate loading for demo purposes
  //   setTimeout(() => {
  //     setQuestState(QuestState.ASSESSMENT);
  //   }, 1500);
  // };

  const handleStartAssessment = () => {
    setQuestState(QuestState.LOADING);
    setShowRecentCheck(true); // Show recent check
    
    setTimeout(() => {
      setQuestState(QuestState.ASSESSMENT);
    }, 1500);
  };

  
  // const handleCompleteAssessment = () => {
  //   setQuestState(QuestState.COMPLETION);
  // };
  
  const handleRestartAssessment = () => {
    setQuestState(QuestState.INTRO);
  };
  
  const handleError = (error: Error) => {
    setError(error);
    setQuestState(QuestState.ERROR);
  };
  
  return (
    <QuestProvider>
      <div className="max-h-screen">
        {/* Render different views based on state */}
        {questState === QuestState.INTRO && (
          <QuestIntro onStart={handleStartAssessment} />
        )}
        
        {questState === QuestState.LOADING && (
          <QuestLoading message="Preparing your assessment..." />
        )}
        
        {questState === QuestState.ASSESSMENT && (
          // <QuestAssessment onComplete={handleCompleteAssessment} />
          <QuestAssessment />
        )}
        
        {/* Add RecentAssessmentCheck component */}
        {showRecentCheck && questState === QuestState.ASSESSMENT && (
          <RecentAssessmentCheck
            onContinue={() => setShowRecentCheck(false)}
            onSelectSession={(session) => {
              // Handle session selection
              console.log('User selected previous session:', session);
            }}
          />
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