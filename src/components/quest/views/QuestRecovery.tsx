import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
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

/**
 * Fallback recovery page - Used when sessionId is not in localStorage
 * This is SECONDARY to the normal flow
 */
export function QuestRecovery() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [sessions, setSessions] = useState<RecoveredSession[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [deviceInfo, setDeviceInfo] = useState<any>(null);

  useEffect(() => {
    // First, check if we have sessionId in localStorage (primary method)
    const sessionId = localStorage.getItem('questSessionId');
    const testId = localStorage.getItem('testid');
    
    if (sessionId && testId) {
      // Primary method works - redirect to result page
      const userId = user?.id || 'anonymous';
      navigate(`/quest-result/result/${userId}/${sessionId}/${testId}`, { replace: true });
      return;
    }

    // Primary method failed - use fallback recovery
    recoverSessions();
  }, [user, navigate]);

  const recoverSessions = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Get device identifier
      const identifier = await getDeviceIdentifier();
      setDeviceInfo(identifier);

      // Call API to find sessions with this IP + device fingerprint
      const response = await axios.post('https://api.fraterny.in/api/quest/recover', {
        ip: identifier.ip,
        deviceHash: identifier.deviceHash,
        userId: user?.id // Include if user is logged in
      });

      if (response.data && response.data.sessions) {
        setSessions(response.data.sessions);
        
        // If only one session found, redirect automatically
        if (response.data.sessions.length === 1) {
          const session = response.data.sessions[0];
          navigate(`/quest-result/result/${session.user_id}/${session.session_id}/${session.test_id}`, { replace: true });
        }
      } else {
        setError('No previous assessments found for this device');
      }
    } catch (err: any) {
      console.error('Recovery failed:', err);
      setError('Unable to recover previous assessments. Please try taking the assessment again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSessionSelect = (session: RecoveredSession) => {
    // Store recovered session in localStorage for future use
    localStorage.setItem('questSessionId', session.session_id);
    localStorage.setItem('testid', session.test_id);
    
    // Navigate to result page
    navigate(`/quest-result/result/${session.user_id}/${session.session_id}/${session.test_id}`);
  };

  const handleStartNew = () => {
    navigate('/quest');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#004A7F] ">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white text-3xl">Looking for your previous assessments...</p>
        </div>
      </div>
    );
  }

  if (error && sessions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#004A7F]">
        <div className="max-w-md w-full mx-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl p-6 shadow-xl"
          >
            <h2 className="text-2xl font-['Gilroy-Bold'] text-gray-900 mb-4">
              No Previous Assessments Found
            </h2>
            <p className="text-gray-600 font-['Gilroy-Regular'] mb-6">
              {error}
            </p>
            <div className="space-y-3">
              <button
                onClick={handleStartNew}
                className="w-full px-4 py-3 bg-gradient-to-br from-sky-800 to-sky-400 text-white rounded-lg font-['Gilroy-Bold'] hover:opacity-90 transition-opacity"
              >
                Start New Assessment
              </button>
              <button
                onClick={() => window.history.back()}
                className="w-full px-4 py-3 border border-gray-300 text-gray-700 rounded-lg font-['Gilroy-Regular'] hover:bg-gray-50 transition-colors"
              >
                Go Back
              </button>
            </div>
            {deviceInfo && (
              <div className="mt-4 p-3 bg-gray-50 rounded text-xs text-gray-500">
                Device ID: {deviceInfo.deviceHash.substring(0, 8)}...
              </div>
            )}
          </motion.div>
        </div>
      </div>
    );
  }

  // Multiple sessions found - let user choose
  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-800 to-sky-400 py-12">
      <div className="max-w-2xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl p-6 shadow-xl"
        >
          <h2 className="text-3xl font-['Gilroy-Bold'] text-gray-900 mb-2">
            Multiple Assessments Found
          </h2>
          <p className="text-gray-600 font-['Gilroy-Regular'] mb-6">
            We found {sessions.length} assessments from this device. Select the one you want to view:
          </p>

          <div className="space-y-3 mb-6">
            {sessions.map((session, index) => (
              <motion.div
                key={session.session_id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => handleSessionSelect(session)}
                className="p-4 border border-gray-200 rounded-lg hover:border-sky-400 hover:shadow-md transition-all cursor-pointer group"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-['Gilroy-semiBold'] text-lg text-gray-900 group-hover:text-sky-600 transition-colors">
                      Assessment #{sessions.length - index}
                    </p>
                    <p className="text-sm text-gray-600 font-['Gilroy-Regular']">
                      Completed: {new Date(session.completion_date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                    <p className="text-sm text-gray-500 font-['Gilroy-Regular']">
                      Progress: {session.completion_percentage}%
                    </p>
                  </div>
                  <div className="text-sky-600 group-hover:translate-x-1 transition-transform">
                    →
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="border-t pt-4">
            <button
              onClick={handleStartNew}
              className="w-full px-4 py-3 border border-gray-300 text-gray-700 rounded-lg font-['Gilroy-Regular'] hover:bg-gray-50 transition-colors"
            >
              Start New Assessment Instead
            </button>
          </div>

          {deviceInfo && (
            <div className="mt-4 p-3 bg-gray-50 rounded text-xs text-gray-500">
              Device fingerprint: {deviceInfo.deviceHash.substring(0, 12)}... | IP: {deviceInfo.ip}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}