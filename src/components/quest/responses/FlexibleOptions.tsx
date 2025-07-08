import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FlexibleOptionsProps } from './types';

/**
 * Flexible options component
 * Provides "I don't know" and similar flexible response options
 */
export function FlexibleOptions({
  question,
  onResponse,
  isActive = true,
  isAnswered = false,
  options = [
    "I don't know",
    "I'm not sure but...",
    "I don't want to answer this question"
  ],
  showByDefault = false,
  triggerText = "Not sure? Click for options",
  hideTriggerText = "Hide options",
  className = ''
}: FlexibleOptionsProps) {
  // Show/hide state
  const [isExpanded, setIsExpanded] = useState<boolean>(showByDefault);
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: { 
      opacity: 1, 
      height: 'auto',
      transition: {
        height: {
          type: 'spring',
          stiffness: 100,
          damping: 30
        },
        opacity: {
          duration: 0.2,
          delay: 0.1
        }
      }
    }
  };
  
  const optionVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 20
      }
    },
    hover: {
      scale: 1.01,
      backgroundColor: 'rgba(156, 163, 175, 0.1)'
    },
    tap: { scale: 0.99 }
  };
  
  // Toggle expanded state
  const toggleExpanded = () => {
    if (!isActive || isAnswered) return;
    setIsExpanded(!isExpanded);
  };
  
  // Handle option selection
  const handleOptionSelect = (option: string) => {
    if (!isActive || isAnswered) return;
    onResponse(option);
  };
  
  return (
    <div className={`flexible-options ${className}`}>
      {/* Toggle button */}
      <motion.button
        onClick={toggleExpanded}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        disabled={!isActive || isAnswered}
        className={`
          text-sm transition-colors
          ${isActive && !isAnswered 
            ? 'text-gray-500 hover:text-terracotta' 
            : 'text-gray-400 cursor-default'
          }
        `}
      >
        {isExpanded ? hideTriggerText : triggerText}
      </motion.button>
      
      {/* Options container */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate={isExpanded ? "visible" : "hidden"}
        className="overflow-hidden"
      >
        <div className="mt-3 space-y-2">
          {options.map((option, index) => (
            <motion.button
              key={index}
              variants={optionVariants}
              whileHover={isActive && !isAnswered ? "hover" : undefined}
              whileTap={isActive && !isAnswered ? "tap" : undefined}
              onClick={() => handleOptionSelect(option)}
              disabled={!isActive || isAnswered}
              className={`
                block w-full p-2 text-left text-sm border rounded transition-all
                ${isActive && !isAnswered 
                  ? 'text-gray-600 border-gray-100 hover:border-gray-300' 
                  : 'text-gray-500 border-gray-100 opacity-80 cursor-default'
                }
              `}
            >
              {option}
            </motion.button>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

export default FlexibleOptions;