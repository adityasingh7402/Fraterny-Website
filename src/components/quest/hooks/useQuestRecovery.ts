import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { getDeviceIdentifier } from '../../../utils/deviceFingerprint';
import { useAuth } from '../../../contexts/AuthContext';

interface RecoveredSession {
  session_id: string;
  test_id: string;
  user_id: string;
  completion_date: string;
  completion_percentage: number;
}

interface RecoveryState {
  isChecking: boolean;
  hasError: boolean;
  errorMessage: string | null;
  sessions: RecoveredSession[];
  recoveryMethod: 'primary' | 'fallback' | null;
  deviceInfo: any;
}

export function useQuestRecovery() {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [state, setState] = useState<RecoveryState>({
    isChecking: false,
    hasError: false,
    errorMessage: null,
    sessions: [],
    recoveryMethod: null,
    deviceInfo: null
  });

  // Primary recovery method - check localStorage
  const checkPrimaryRecovery = async (): Promise<boolean> => {
    try {
      console.log('🔍 Primary Recovery: Checking localStorage...');
      
      const sessionId = localStorage.getItem('questSessionId');
      const testId = localStorage.getItem('testid');
      
      if (sessionId && testId) {
        console.log('✅ Primary Recovery: Found sessionId and testId');
        
        // Verify the session is still valid by checking API
        try {
          const response = await axios.get(`https://api.fraterny.in/api/status/${testId}`);
          
          if (response.data && (response.data.status === 'ready' || response.data.status === 'processing')) {
            console.log('✅ Primary Recovery: Session is valid, navigating...');
            const userId = user?.id || 'anonymous';
            
            setState(prev => ({ ...prev, recoveryMethod: 'primary' }));
            
            // Navigate based on status
            if (response.data.status === 'ready') {
              navigate(`/quest-result/result/${userId}/${sessionId}/${testId}`, { replace: true });
            } else {
              navigate(`/quest-result/processing/${userId}/${sessionId}/${testId}`, { replace: true });
            }
            return true;
          } else {
            console.log('⚠️ Primary Recovery: Session exists but not valid, clearing localStorage');
            localStorage.removeItem('questSessionId');
            localStorage.removeItem('testid');
            return false;
          }
        } catch (apiError) {
          console.log('⚠️ Primary Recovery: API verification failed, but session exists');
          // If API fails but we have session data, still try to navigate
          const userId = user?.id || 'anonymous';
          navigate(`/quest-result/result/${userId}/${sessionId}/${testId}`, { replace: true });
          return true;
        }
      }
      
      console.log('❌ Primary Recovery: No valid session found in localStorage');
      return false;
      
    } catch (error) {
      console.error('❌ Primary Recovery: Failed with error:', error);
      return false;
    }
  };

  // Fallback recovery method - device fingerprinting
  const checkFallbackRecovery = async (): Promise<RecoveredSession[]> => {
    try {
      console.log('🔍 Fallback Recovery: Starting device fingerprinting...');
      
      setState(prev => ({ 
        ...prev, 
        isChecking: true, 
        hasError: false, 
        errorMessage: null,
        recoveryMethod: 'fallback'
      }));

      // Get device identifier
      const identifier = await getDeviceIdentifier();
      console.log('📱 Fallback Recovery: Got device identifier');
      
      setState(prev => ({ ...prev, deviceInfo: identifier }));

      // Call recovery API
      const response = await axios.post('https://api.fraterny.in/api/quest/recover', {
        ip: identifier.ip,
        deviceHash: identifier.deviceHash,
        userId: user?.id
      });

      console.log('📊 Fallback Recovery: API response:', response.data);

      if (response.data && response.data.sessions && response.data.sessions.length > 0) {
        console.log('✅ Fallback Recovery: Found sessions:', response.data.sessions.length);
        
        const sessions = response.data.sessions;
        setState(prev => ({ ...prev, sessions, isChecking: false }));
        
        return sessions;
      } else {
        console.log('❌ Fallback Recovery: No sessions found');
        setState(prev => ({ 
          ...prev, 
          isChecking: false,
          hasError: true,
          errorMessage: 'No previous assessments found for this device'
        }));
        return [];
      }

    } catch (error: any) {
      console.error('❌ Fallback Recovery: Failed with error:', error);
      setState(prev => ({ 
        ...prev, 
        isChecking: false,
        hasError: true,
        errorMessage: 'Unable to recover previous assessments. Please try taking the assessment again.'
      }));
      return [];
    }
  };

  // Main recovery function that tries both methods
  const attemptRecovery = async (): Promise<'primary_success' | 'fallback_multiple' | 'failed'> => {
    console.log('🚀 Quest Recovery: Starting comprehensive recovery...');
    
    // Try primary method first
    const primarySuccess = await checkPrimaryRecovery();
    if (primarySuccess) {
      return 'primary_success';
    }

    // Primary failed, try fallback method
    const fallbackSessions = await checkFallbackRecovery();
    
    if (fallbackSessions.length >= 1) {
      // Always show selection UI when sessions are found (even for 1 session)
      // This gives users the choice to view results OR start new assessment
      console.log(`🎯 Fallback Recovery: ${fallbackSessions.length} session(s) found, showing selection UI`);
      return 'fallback_multiple';
    }

    // Both methods failed
    console.log('❌ Recovery: Both primary and fallback methods failed');
    return 'failed';
  };

  // Function to select a specific session from multiple options
  const selectSession = (session: RecoveredSession) => {
    console.log('👆 User selected session:', session.session_id);
    
    // Store in localStorage for future primary recovery
    localStorage.setItem('questSessionId', session.session_id);
    localStorage.setItem('testid', session.test_id);
    
    // Navigate to result page
    navigate(`/quest-result/result/${session.user_id}/${session.session_id}/${session.test_id}`);
  };

  // Reset recovery state
  const resetRecovery = () => {
    setState({
      isChecking: false,
      hasError: false,
      errorMessage: null,
      sessions: [],
      recoveryMethod: null,
      deviceInfo: null
    });
  };

  return {
    ...state,
    attemptRecovery,
    selectSession,
    resetRecovery,
    // Individual methods for advanced usage
    checkPrimaryRecovery,
    checkFallbackRecovery
  };
}
