// import React, { useState } from 'react';
// import { QuestProvider } from '../../components/quest/core/QuestProvider';
// import { QuestIntro } from '../../components/quest/views/QuestIntro';
// import { QuestAssessment } from '../../components/quest/views/QuestAssessment';
// import { QuestCompletion } from '../../components/quest/views/QuestCompletion';
// import { QuestLoading } from '../../components/quest/views/QuestLoading';
// import { QuestError } from '../../components/quest/views/QuestError';
// import { useQuestSession, useQuestAnalytics } from '../../components/quest/hooks';

// enum QuestState {
//   INTRO = 'intro',
//   ASSESSMENT = 'assessment',
//   // COMPLETION = 'completion',
//   LOADING = 'loading',
//   ERROR = 'error'
// }

// /**
//  * Main Quest page component
//  * Integrates all quest components into a complete assessment experience
//  */
// export function QuestPage() {
//   // State for the current view
//   const [questState, setQuestState] = useState<QuestState>(QuestState.INTRO);
//   const [error, setError] = useState<Error | null>(null);
//   // const [showRecentCheck, setShowRecentCheck] = useState(false);
//   // const [questState, setQuestState] = useState(QuestState.LANDING);

  
//   // Handler functions for state transitions
//   // const handleStartAssessment = () => {
//   //   setQuestState(QuestState.LOADING);
    
//   //   // Simulate loading for demo purposes
//   //   setTimeout(() => {
//   //     setQuestState(QuestState.ASSESSMENT);
//   //   }, 1500);
//   // };

//   const handleStartAssessment = () => {
//     setQuestState(QuestState.LOADING);
//     // setShowRecentCheck(true); // Show recent check
    
//     setTimeout(() => {
//       setQuestState(QuestState.ASSESSMENT);
//     }, 1500);
//   };

  
//   // const handleCompleteAssessment = () => {
//   //   setQuestState(QuestState.COMPLETION);
//   // };
  
//   const handleRestartAssessment = () => {
//     setQuestState(QuestState.INTRO);
//   };
  
//   const handleError = (error: Error) => {
//     setError(error);
//     setQuestState(QuestState.ERROR);
//   };
  
//   return (
//     <QuestProvider>
//       <div className="max-h-screen">
//         {/* Render different views based on state */}
//         {questState === QuestState.INTRO && (
//           <QuestIntro onStart={handleStartAssessment} />
//         )}
        
//         {questState === QuestState.LOADING && (
//           <QuestLoading message="Preparing your assessment..." />
//         )}
        
//         {questState === QuestState.ASSESSMENT && (
//           // <QuestAssessment onComplete={handleCompleteAssessment} />
//           <QuestAssessment />
//         )}
        
//         {questState === QuestState.ERROR && (
//           <QuestError 
//             error={error ?? undefined} 
//             onRetry={() => setQuestState(QuestState.INTRO)} 
//           />
//         )}
//       </div>
//     </QuestProvider>
//   );
// }

// export default QuestPage;



// ---------------------------------------------------------------

import React, { useState, useEffect } from 'react';
import { QuestProvider } from '../../components/quest/core/QuestProvider';
import { QuestIntro } from '../../components/quest/views/QuestIntro';
import { QuestAssessment } from '../../components/quest/views/QuestAssessment';
import { QuestCompletion } from '../../components/quest/views/QuestCompletion';
import { QuestLoading } from '../../components/quest/views/QuestLoading';
import { QuestError } from '../../components/quest/views/QuestError';
import { useQuestSession, useQuestAnalytics } from '../../components/quest/hooks';
import { useQuestRecovery } from '../../components/quest/hooks/useQuestRecovery';
import { QuestRecoveryUI } from '../../components/quest/views/QuestRecoveryUI';

enum QuestState {
  RECOVERY = 'recovery',
  INTRO = 'intro',
  ASSESSMENT = 'assessment',
  // COMPLETION = 'completion',
  LOADING = 'loading',
  ERROR = 'error'
}

/**
 * Main Quest page component
 * Integrates all quest components into a complete assessment experience
 * Now includes comprehensive recovery system (primary + fallback)
 */
export function QuestPage() {
  // State for the current view
  const [questState, setQuestState] = useState<QuestState>(QuestState.RECOVERY);
  const [error, setError] = useState<Error | null>(null);
  
  // Recovery hook
  const recovery = useQuestRecovery();
  
  // Auto-attempt recovery when component mounts
  useEffect(() => {
    const doRecovery = async () => {
      console.log('🚀 QuestPage: Starting auto-recovery...');
      
      try {
        const result = await recovery.attemptRecovery();
        console.log('📊 QuestPage: Recovery result:', result);
        
        switch (result) {
          case 'primary_success':
            // Successfully recovered and navigated - component will unmount
            console.log('✅ QuestPage: Primary recovery successful, navigation in progress');
            break;
            
          case 'fallback_multiple':
            // Sessions found - show selection UI (even for single session)
            console.log('🎯 QuestPage: Sessions found, showing selection UI');
            setQuestState(QuestState.RECOVERY);
            break;
            
          case 'failed':
            // No recovery possible - proceed to intro
            console.log('❌ QuestPage: Recovery failed, proceeding to intro');
            setQuestState(QuestState.INTRO);
            break;
        }
      } catch (err) {
        console.error('❌ QuestPage: Recovery error:', err);
        setQuestState(QuestState.INTRO);
      }
    };
    
    doRecovery();
  }, []);

  
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
    // setShowRecentCheck(true); // Show recent check
    
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
  
  // Recovery handlers
  const handleStartNewFromRecovery = () => {
    console.log('👤 User chose to start new assessment from recovery');
    recovery.resetRecovery();
    setQuestState(QuestState.INTRO);
  };
  
  const handleRetryRecovery = async () => {
    console.log('🔄 User requested recovery retry');
    recovery.resetRecovery();
    setQuestState(QuestState.RECOVERY);
    
    try {
      const result = await recovery.attemptRecovery();
      
      switch (result) {
        case 'primary_success':
          // Navigation handled by recovery hook
          break;
        case 'fallback_multiple':
          // Sessions found - stay in recovery state to show selection
          break;
        case 'failed':
          setQuestState(QuestState.INTRO);
          break;
      }
    } catch (err) {
      console.error('Recovery retry failed:', err);
      setQuestState(QuestState.INTRO);
    }
  };
  
  return (
    <QuestProvider>
      <div className="max-h-screen">
        {/* Recovery State - Primary entry point */}
        {questState === QuestState.RECOVERY && (
          <QuestRecoveryUI
            isChecking={recovery.isChecking}
            hasError={recovery.hasError}
            errorMessage={recovery.errorMessage}
            sessions={recovery.sessions}
            recoveryMethod={recovery.recoveryMethod}
            deviceInfo={recovery.deviceInfo}
            onSelectSession={recovery.selectSession}
            onStartNew={handleStartNewFromRecovery}
            onRetry={handleRetryRecovery}
          />
        )}
        
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