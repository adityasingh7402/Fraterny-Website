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
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-100 transition-colors z-10"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>

            {/* Header */}
            <div className="px-6 py-6 border-b border-gray-100">
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <AlertCircle className="w-8 h-8 text-amber-500" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 font-['Gilroy-Bold']">
                    Assessment Incomplete
                  </h3>
                  <p className="text-sm text-gray-600 font-['Gilroy-Regular'] mt-1">
                    Please complete all questions before finishing
                  </p>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="px-6 py-6">
              <div className="space-y-4">
                <p className="text-gray-700 font-['Gilroy-Regular']">
                  You have <span className="font-bold text-amber-600">{incompleteCount}</span> unanswered questions
                  {sectionName && (
                    <>
                      {' '}in the "<span className="font-semibold">{sectionName}</span>" section
                    </>
                  )}.
                </p>
                
                <p className="text-sm text-gray-600 font-['Gilroy-Regular']">
                  To get the most accurate analysis, please answer all questions before submitting your assessment.
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="px-6 py-4 bg-gray-50 flex space-x-3">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-['Gilroy-Medium']"
              >
                Continue Editing
              </button>
              
              <button
                onClick={onGoToIncomplete}
                className="flex-1 px-4 py-2 text-sm font-medium text-white bg-sky-600 border border-transparent rounded-lg hover:bg-sky-700 transition-colors font-['Gilroy-Medium']"
              >
                Go to Question
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default IncompleteQuestionsModal;