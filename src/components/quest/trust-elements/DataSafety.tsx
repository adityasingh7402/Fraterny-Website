import React from 'react';
import { motion } from 'framer-motion';
import { DataSafetyProps } from './types';
import { PrivacyPulse } from '../effects/PrivacyPulse';

/**
 * Data safety component
 * Provides reassurance about data privacy and security
 */
export function DataSafety({
  variant = 'inline',
  icon = true,
  className = ''
}: DataSafetyProps) {
  // Render different variants
  switch (variant) {
    case 'badge':
      return (
        <motion.div
          className={`
            inline-flex items-center gap-2 px-3 py-1 
            bg-green-50 text-green-700 text-xs font-medium 
            rounded-full border border-green-100
            ${className}
          `}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {icon && <PrivacyPulse color="green" size="small" showIcon={false} />}
          Secure & Private
        </motion.div>
      );
      
    case 'banner':
      return (
        <motion.div
          className={`
            flex items-center gap-3 p-3 
            bg-green-50 text-green-700 text-sm
            rounded-lg border border-green-100
            ${className}
          `}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {icon && (
            <div className="flex-shrink-0">
              <PrivacyPulse color="green" size="medium" showIcon={true} />
            </div>
          )}
          <div>
            <div className="font-medium">Your data is safe with us</div>
            <div className="text-green-600 text-xs mt-1">
              Your responses are securely stored and never shared with third parties.
            </div>
          </div>
        </motion.div>
      );
      
    case 'inline':
    default:
      return (
        <motion.div
          className={`flex items-center gap-2 text-xs text-gray-500 ${className}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {icon && <PrivacyPulse color="green" size="small" showIcon={false} />}
          <span>Your data is safe and secure</span>
        </motion.div>
      );
  }
}

export default DataSafety;