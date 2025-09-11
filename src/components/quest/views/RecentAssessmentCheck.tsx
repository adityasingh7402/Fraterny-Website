import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Clock, X, ChevronRight } from 'lucide-react';

interface RecentSession {
  session_id: string;
  test_id: string;
  user_id: string;
  completion_time: string;
  minutes_ago: number;
}

interface RecentAssessmentCheckProps {
  onContinue: () => void;
  onSelectSession?: (session: RecentSession) => void;
}

export function RecentAssessmentCheck({ onContinue, onSelectSession }: RecentAssessmentCheckProps) {
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState(false);
  const [recentSessions, setRecentSessions] = useState<RecentSession[]>([]);
  const [isChecking, setIsChecking] = useState(true);
  const [userIP, setUserIP] = useState<string>('');

  useEffect(() => {
    console.log('🔍 RecentAssessmentCheck: Component mounted, starting check...');
    checkRecentAssessments();
  }, []);

  const checkRecentAssessments = async () => {
    console.log('🚀 RecentAssessmentCheck: Starting recent assessment check...');
    try {
      // Get user's IP address
      const ipResponse = await fetch('https://api.ipify.org?format=json');
      const ipData = await ipResponse.json();
      const ip = ipData.ip;
      setUserIP(ip);
      console.log('📍 RecentAssessmentCheck: Got user IP:', ip);

      // Check for recent assessments (within 3 hours)
      const response = await axios.post('https://api.fraterny.in/api/quest/check-recent', {
        ip: ip,
        hoursLimit: 3
      });

      console.log('📊 RecentAssessmentCheck: API response received:', response.data);
      

      if (response.data.success && response.data.sessions && response.data.sessions.length > 0) {
        console.log('✅ RecentAssessmentCheck: Found recent sessions:', response.data.sessions.length);
        setRecentSessions(response.data.sessions);
        setShowPopup(true);
        console.log('🎯 RecentAssessmentCheck: Popup should now be visible');
      } else {
        console.log('❌ RecentAssessmentCheck: No recent sessions found');
      }
    } catch (error) {
      console.log('⚠️ RecentAssessmentCheck: Check failed or no recent assessments:', error);
    } finally {
       console.log('🏁 RecentAssessmentCheck: Check completed, isChecking set to false');
      setIsChecking(false);
    }
  };

  const handleSelectSession = (session: RecentSession) => {
    // Store in localStorage for primary method to work
    localStorage.setItem('questSessionId', session.session_id);
    localStorage.setItem('testid', session.test_id);
    
    // Navigate to result page
    navigate(`/quest-result/result/${session.user_id}/${session.session_id}/${session.test_id}`);
    
    if (onSelectSession) {
      onSelectSession(session);
    }
  };

  const handleStartNew = () => {
    setShowPopup(false);
    onContinue();
    navigate('/assessment'); 
  };

  const formatTimeAgo = (minutes: number): string => {
    if (minutes < 60) {
      return `${Math.round(minutes)} minutes ago`;
    }
    const hours = Math.floor(minutes / 60);
    const mins = Math.round(minutes % 60);
    if (hours === 1) {
      return mins > 0 ? `1 hour ${mins} minutes ago` : '1 hour ago';
    }
    return mins > 0 ? `${hours} hours ${mins} minutes ago` : `${hours} hours ago`;
  };

  return (
    <AnimatePresence>
        {showPopup && (
        <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            <motion.div
            className="bg-white rounded-2xl max-w-md w-full shadow-2xl"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            >
            {/* Header */}
            <div className="p-6 border-b border-gray-100">
                <div className="flex items-start justify-between">
                <div>
                    <h2 className="text-4xl font-['Gilroy-Bold'] text-gray-900">
                    Your Assessments
                    </h2>
                </div>
                <button
                    onClick={handleStartNew}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                    <X className="w-5 h-5 text-gray-500" />
                </button>
                </div>
            </div>

            {/* Sessions List */}
            <div className="p-6 max-h-80 overflow-y-auto">
                <div className="space-y-3">
                {recentSessions.map((session, index) => (
                    <motion.div
                    key={session.session_id}
                    onClick={() => handleSelectSession(session)}
                    className="group p-4 bg-gradient-to-r from-sky-50 to-blue-50 rounded-xl hover:from-sky-100 hover:to-blue-100 transition-all cursor-pointer border border-sky-200 hover:border-sky-300"
                    >
                    <div className="flex items-center justify-between">
                        <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                            <Clock className="w-4 h-4 text-sky-600" />
                            <span className="text-sm text-black font-['Gilroy-Black']">
                            {formatTimeAgo(session.minutes_ago)}
                            </span>
                        </div>
                        <p className="text-xs text-gray-600 mt-1">
                            Completed at {new Date(session.completion_time).toLocaleTimeString('en-US', {
                            hour: '2-digit',
                            minute: '2-digit'
                            })}
                        </p>
                        </div>
                        <ChevronRight className="w-5 h-5 text-sky-600 group-hover:translate-x-1 transition-transform" />
                    </div>
                    </motion.div>
                ))}
                </div>

                {/* Info Box */}
                {/* <div className="mt-4 p-3 bg-amber-50 rounded-lg border border-amber-200">
                <p className="text-xs text-amber-800">
                    <span className="font-semibold">Tip:</span> You can view your previous results without retaking the assessment
                </p>
                </div> */}
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-gray-100 bg-gray-50 rounded-b-2xl">
                <div className="flex gap-3">
                <button
                    onClick={handleStartNew}
                    className="w-full px-4 py-2 text-xl font-normal font-['Gilroy-Bold'] tracking-[-1px] bg-gradient-to-br from-sky-800 to-sky-400 text-white rounded-lg hover:opacity-90 transition-colors"
                >
                    Start New Assessment
                </button>
                </div>
            </div>
            </motion.div>
        </motion.div>
        )}
    </AnimatePresence>
  );
}

// Hook to use in any component
export function useRecentAssessmentCheck() {
  const [hasRecent, setHasRecent] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const [sessions, setSessions] = useState<RecentSession[]>([]);

  const check = async () => {
    try {
      const ipResponse = await fetch('https://api.ipify.org?format=json');
      const ipData = await ipResponse.json();
      
      const response = await axios.post('https://api.fraterny.in/api/quest/check-recent', {
        ip: ipData.ip,
        hoursLimit: 3
      });

      if (response.data.success && response.data.sessions?.length > 0) {
        setSessions(response.data.sessions);
        setHasRecent(true);
      }
    } catch (error) {
      console.log('Check failed:', error);
    } finally {
      setIsChecking(false);
    }
  };

  useEffect(() => {
    check();
  }, []);

  return { hasRecent, isChecking, sessions, recheck: check };
}
