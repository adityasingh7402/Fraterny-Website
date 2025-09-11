import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, X, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface RecentSession {
  session_id: string;
  test_id: string;
  user_id: string;
  completion_time: string;
  minutes_ago: number;
}

// Mock data for demo purposes
const mockRecentSessions: RecentSession[] = [
  {
    session_id: "sess_12345",
    test_id: "test_001",
    user_id: "user_abc123",
    completion_time: "2025-09-11T14:30:00Z",
    minutes_ago: 25
  },
  {
    session_id: "sess_67890",
    test_id: "test_002", 
    user_id: "user_def456",
    completion_time: "2025-09-11T12:45:00Z",
    minutes_ago: 130
  },
  {
    session_id: "sess_11111",
    test_id: "test_003",
    user_id: "user_ghi789",
    completion_time: "2025-09-11T11:15:00Z",
    minutes_ago: 220
  }
];

interface RecentAssessmentCheckDemoProps {
  onContinue?: () => void;
  onSelectSession?: (session: RecentSession) => void;
  showDemo?: boolean;
}

function RecentAssessmentCheckDemo({ 
  onContinue = () => console.log('Continue clicked'),
  onSelectSession = (session) => console.log('Selected session:', session),
  showDemo = true 
}: RecentAssessmentCheckDemoProps) {
  const [showPopup, setShowPopup] = useState(false);
  const [recentSessions, setRecentSessions] = useState<RecentSession[]>([]);
  const [isChecking, setIsChecking] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Simulate API call delay
    setTimeout(() => {
      if (showDemo) {
        setRecentSessions(mockRecentSessions);
        setShowPopup(true);
      }
      setIsChecking(false);
    }, 1000);
  }, [showDemo]);

  const handleSelectSession = (session: RecentSession) => {
    console.log('Navigating to result page for session:', session.session_id);
    onSelectSession(session);
  };

  const handleStartNew = () => {
    setShowPopup(false);
    onContinue();
    navigate('/assessment'); // Navigate to start new assessment
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

  if (isChecking) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 border-2 border-sky-600 border-t-transparent rounded-full animate-spin"></div>
            <span className="font-['Gilroy-Regular'] text-gray-700">Checking for recent assessments...</span>
          </div>
        </div>
      </div>
    );
  }

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

// Demo App Component
export default function App() {
  const [showDemo, setShowDemo] = useState(false);
  const [demoType, setDemoType] = useState<'single' | 'multiple'>('multiple');

  const handleShowDemo = (type: 'single' | 'multiple') => {
    setDemoType(type);
    setShowDemo(true);
  };

  const handleCloseDemo = () => {
    setShowDemo(false);
  };

  const singleSessionDemo = [mockRecentSessions[0]];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      {/* Demo Controls */}
      <div className="bg-white p-8 rounded-2xl shadow-xl mb-8 max-w-md w-full">
        <h1 className="text-3xl font-['Gilroy-Bold'] text-gray-900 mb-2 text-center">
          Recent Assessment
        </h1>
        <p className="text-gray-600 font-['Gilroy-Regular'] text-center mb-6">
          We have found your recent assessments. You can choose to view your previous results.
        </p>
        
        <div className="space-y-3 items-center justify-center flex flex-col">
          <button
            onClick={() => handleShowDemo('multiple')}
            className="px-4 py-2 text-xl font-normal font-['Gilroy-Bold'] tracking-[-1px] bg-gradient-to-br from-sky-800 to-sky-400 text-white rounded-lg hover:opacity-90 transition-colors"
          >
            Demo with Multiple Sessions (3)
          </button>
          
          <button
            onClick={() => handleShowDemo('single')}
            className="px-4 py-2 text-xl font-normal font-['Gilroy-Bold'] tracking-[-1px] bg-gradient-to-br from-sky-800 to-sky-400 text-white rounded-lg hover:opacity-90 transition-colors"
          >
            Demo with Single Session
          </button>
        </div>
      </div>

      {/* Demo Component */}
      {showDemo && (
        <RecentAssessmentCheckDemo
          showDemo={showDemo}
          onContinue={() => {
            console.log('Starting new assessment...');
            handleCloseDemo();
          }}
          onSelectSession={(session) => {
            console.log('Would navigate to:', `/quest-result/result/${session.user_id}/${session.session_id}/${session.test_id}`);
            handleCloseDemo();
          }}
        />
      )}
    </div>
  );
}