import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Wifi, Smartphone, AlertCircle } from 'lucide-react';

interface RecoveredSession {
  session_id: string;
  test_id: string;
  user_id: string;
  completion_date: string;
  completion_percentage: number;
}

interface QuestRecoveryUIProps {
  isChecking: boolean;
  hasError: boolean;
  errorMessage: string | null;
  sessions: RecoveredSession[];
  recoveryMethod: 'primary' | 'fallback' | null;
  deviceInfo: any;
  onSelectSession: (session: RecoveredSession) => void;
  onStartNew: () => void;
  onRetry?: () => void;
}

export function QuestRecoveryUI({
  isChecking,
  hasError,
  errorMessage,
  sessions,
  recoveryMethod,
  deviceInfo,
  onSelectSession,
  onStartNew,
  onRetry
}: QuestRecoveryUIProps) {

  // Loading state during recovery
  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-800 to-sky-400">
        <div className="text-center px-4">
          <motion.div
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 mx-auto mb-6"
          >
            {recoveryMethod === 'primary' ? (
              <div className="w-16 h-16 rounded-full border-4 border-white border-t-transparent" />
            ) : (
              <Wifi className="w-16 h-16 text-white" />
            )}
          </motion.div>
          
          <h2 className="text-3xl font-['Gilroy-Bold'] text-white mb-4">
            {recoveryMethod === 'primary' 
              ? 'Checking your progress...' 
              : 'Searching for your assessments...'}
          </h2>
          
          <p className="text-white/80 text-lg font-['Gilroy-Regular']">
            {recoveryMethod === 'primary' 
              ? 'Looking for your saved progress'
              : 'Using device fingerprinting to find your previous assessments'}
          </p>

          {recoveryMethod === 'fallback' && (
            <div className="mt-6 flex items-center justify-center gap-2 text-white/60 text-sm">
              <Smartphone className="w-4 h-4" />
              <span>Analyzing device characteristics...</span>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Error state
  if (hasError && sessions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-800 to-sky-400">
        <div className="max-w-md w-full mx-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl p-6 shadow-xl"
          >
            <div className="text-center">
              <AlertCircle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
              <h2 className="text-2xl font-['Gilroy-Bold'] text-gray-900 mb-4">
                No Previous Assessments Found
              </h2>
              <p className="text-gray-600 font-['Gilroy-Regular'] mb-6">
                {errorMessage}
              </p>
            </div>
            
            <div className="space-y-3">
              <button
                onClick={onStartNew}
                className="w-full px-4 py-3 bg-gradient-to-br from-sky-800 to-sky-400 text-white rounded-lg font-['Gilroy-Bold'] hover:opacity-90 transition-opacity"
              >
                Start New Assessment
              </button>
              
              {onRetry && (
                <button
                  onClick={onRetry}
                  className="w-full px-4 py-3 border border-gray-300 text-gray-700 rounded-lg font-['Gilroy-Regular'] hover:bg-gray-50 transition-colors"
                >
                  Try Again
                </button>
              )}
            </div>

            {deviceInfo && (
              <div className="mt-4 p-3 bg-gray-50 rounded text-xs text-gray-500">
                <div className="flex items-center gap-2 mb-1">
                  <Smartphone className="w-3 h-3" />
                  <span className="font-medium">Device Info</span>
                </div>
                <div>ID: {deviceInfo.deviceHash?.substring(0, 12)}...</div>
                <div>IP: {deviceInfo.ip}</div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    );
  }

  // Multiple sessions found - user selection
  if (sessions.length > 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-800 to-sky-400 py-12">
        <div className="max-w-2xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl p-6 shadow-xl"
          >
            <div className="text-center mb-6">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-6 h-6 text-green-600" />
              </div>
              <h2 className="text-3xl font-['Gilroy-Bold'] text-gray-900 mb-2">
                Found Your Assessments!
              </h2>
              <p className="text-gray-600 font-['Gilroy-Regular']">
                We found {sessions.length} previous assessment{sessions.length > 1 ? 's' : ''} from this device. 
                Select the one you want to view:
              </p>
            </div>

            <div className="space-y-3 mb-6">
              {sessions.map((session, index) => (
                <motion.div
                  key={session.session_id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => onSelectSession(session)}
                  className="p-4 border border-gray-200 rounded-lg hover:border-sky-400 hover:shadow-md transition-all cursor-pointer group"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full" />
                        <p className="font-['Gilroy-semiBold'] text-lg text-gray-900 group-hover:text-sky-600 transition-colors">
                          Assessment #{sessions.length - index}
                        </p>
                      </div>
                      <p className="text-sm text-gray-600 font-['Gilroy-Regular'] mb-1">
                        Completed: {new Date(session.completion_date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                      <div className="flex items-center gap-2">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-green-500 h-2 rounded-full transition-all"
                            style={{ width: `${session.completion_percentage}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-500 min-w-[45px]">
                          {session.completion_percentage}%
                        </span>
                      </div>
                    </div>
                    <div className="text-sky-600 group-hover:translate-x-1 transition-transform ml-4">
                      →
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="border-t pt-4 space-y-3">
              <button
                onClick={onStartNew}
                className="w-full px-4 py-3 bg-gradient-to-br from-sky-800 to-sky-400 text-white rounded-lg font-['Gilroy-Bold'] hover:opacity-90 transition-opacity"
              >
                Start New Assessment Instead
              </button>
            </div>

            {/* Recovery method indicator */}
            <div className="mt-4 p-3 bg-gray-50 rounded text-xs text-gray-500">
              <div className="flex items-center gap-2 mb-2">
                <Wifi className="w-3 h-3" />
                <span className="font-medium">
                  Recovered via {recoveryMethod === 'primary' ? 'Saved Progress' : 'Device Fingerprinting'}
                </span>
              </div>
              {deviceInfo && (
                <div className="space-y-1">
                  <div>Device ID: {deviceInfo.deviceHash?.substring(0, 12)}...</div>
                  <div>IP: {deviceInfo.ip}</div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return null;
}
