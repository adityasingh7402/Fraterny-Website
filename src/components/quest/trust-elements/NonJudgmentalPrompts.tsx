import React from 'react';
import { motion } from 'framer-motion';
import { NonJudgmentalPromptsProps } from './types';

/**
 * Non-judgmental prompts component
 * Provides encouraging and non-judgmental messaging
 */
export function NonJudgmentalPrompts({
  type = 'encouragement',
  variant = 'standard',
  className = ''
}: NonJudgmentalPromptsProps) {
  // Get prompt message based on type
  const getMessage = (): string => {
    switch (type) {
      case 'encouragement':
        return 'There are no right or wrong answers. We are here to understand you better.';
      case 'reminder':
        return 'Text like you text a friend. Be as honest as you want to be.';
      case 'reassurance':
        return 'Your answers help us understand your unique perspective.';
      default:
        return 'There are no right or wrong answers. We are here to understand you better.';
    }
  };
  
  // Get detailed message for the standard and detailed variants
  const getDetailedMessage = (): string => {
    switch (type) {
      case 'encouragement':
        return 'Every response helps create a more accurate understanding of your personality.';
      case 'reminder':
        return 'The more authentic your responses, the more meaningful your results will be.';
      case 'reassurance':
        return 'Your unique perspective is valuable and helps us provide personalized insights.';
      default:
        return '';
    }
  };
  
  // Render different variants
  switch (variant) {
    case 'detailed':
      return (
        <motion.div
          className={`p-4 bg-gray-50 rounded-lg border border-gray-100 ${className}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="font-medium text-navy mb-1">{getMessage()}</div>
          <div className="text-sm text-gray-600">{getDetailedMessage()}</div>
        </motion.div>
      );
      
    case 'minimal':
      return (
        <motion.div
          className={`text-xs text-center text-gray-400 italic ${className}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {getMessage()}
        </motion.div>
      );
      
    case 'standard':
    default:
      return (
        <motion.div
          className={`text-sm text-gray-600 italic ${className}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {getMessage()}
        </motion.div>
      );
  }
}

export default NonJudgmentalPrompts;