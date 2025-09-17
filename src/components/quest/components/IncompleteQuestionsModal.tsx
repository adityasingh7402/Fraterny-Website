import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, X } from 'lucide-react';

interface IncompleteQuestionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGoToIncomplete: () => void;
  incompleteCount: number;
  sectionName?: string;
}

/**
 * Modal that appears when user tries to finish quest with incomplete questions
 * Provides option to navigate to first incomplete question
 */
export function IncompleteQuestionsModal({
  isOpen,
  onClose,
  onGoToIncomplete,
  incompleteCount,
  sectionName
}: IncompleteQuestionsModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={onClose}
          />
          
          {/* Modal Content */}
          <motion.div
            className="relative bg-white rounded-2xl shadow-xl border border-gray-200 w-full max-w-md mx-4 overflow-hidden"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            {/* Header */}
            <div className="px-6 py-6 border-b border-gray-100">
              <div className="flex items-center space-x-3">
                  <h3 className="text-xl font-bold text-gray-900 font-['Gilroy-Bold']">
                    Assessment Incomplete
                  </h3>
              </div>
            </div>

            {/* Content */}
            <div className="px-6 pb-6">
              <div className="space-y-4">
                <p className="text-gray-700 text-xl font-['Gilroy-Regular']">
                  You have <span className="font-bold text-amber-600 font-['Gilroy-Bold']">{incompleteCount}</span> unanswered questions.
                </p>
                
                <div className="text-gray-600 text-xl leading-6 font-['Gilroy-Regular'] mb-4">
                  To get the most accurate analysis, please answer all questions before submitting your assessment.
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="px-6 py-4 bg-gray-50">
              <div className="flex justify-start space-x-3">
                <button
                  onClick={onClose}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-xl font-normal font-['Gilroy-Regular'] tracking-[-2px]"
                >
                  Close
                </button>
                
                <button
                  onClick={onGoToIncomplete}
                  className="px-4 py-2 text-xl font-normal font-['Gilroy-Bold'] tracking-[-1px] bg-gradient-to-br from-sky-800 to-sky-400 text-white rounded-lg hover:opacity-90 transition-colors"
                >
                  Go to Question
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default IncompleteQuestionsModal;