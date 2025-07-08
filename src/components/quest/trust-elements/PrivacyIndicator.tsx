import React from 'react';
import { motion } from 'framer-motion';
import { privacyPulseVariants } from '../animations/variants';

interface PrivacyIndicatorProps {
  className?: string;
}

/**
 * Privacy indicator component
 * Provides visual reassurance about data security
 */
export function PrivacyIndicator({ className = '' }: PrivacyIndicatorProps) {
  return (
    <motion.div
      className={`privacy-indicator flex items-center gap-2 text-xs text-gray-500 ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5 }}
    >
      <motion.div
        className="w-2 h-2 bg-green-400 rounded-full"
        variants={privacyPulseVariants}
        initial="hidden"
        animate="visible"
      />
      <span>Your data is safe and secure</span>
      <motion.div
        className="ml-2 text-gray-400"
        animate={{ opacity: [0.3, 0.7, 0.3] }}
        transition={{ duration: 3, repeat: Infinity }}
      >
        🔒
      </motion.div>
    </motion.div>
  );
}

export default PrivacyIndicator;