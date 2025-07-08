import { useState } from 'react';
import { motion, useAnimation } from 'framer-motion';

interface UseFlexibleResponseOptions {
  defaultOptions?: string[];
  defaultExpanded?: boolean;
}

/**
 * Hook for managing flexible response options like "I don't know"
 */
export function useFlexibleResponse(options: UseFlexibleResponseOptions = {}) {
  const {
    defaultOptions = [
      "I don't know",
      "I'm not sure but...",
      "I don't want to answer this question"
    ],
    defaultExpanded = false
  } = options;
  
  // State
  const [isExpanded, setIsExpanded] = useState<boolean>(defaultExpanded);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  
  // Animation controls
  const controls = useAnimation();
  
  // Toggle expanded state
  const toggleExpanded = async () => {
    setIsExpanded(!isExpanded);
    
    // Animate expansion/collapse
    await controls.start({
      height: isExpanded ? 0 : 'auto',
      opacity: isExpanded ? 0 : 1,
      transition: {
        height: {
          type: 'spring',
          stiffness: 100,
          damping: 30
        },
        opacity: {
          duration: 0.2,
          delay: isExpanded ? 0 : 0.1
        }
      }
    });
  };
  
  // Select an option
  const selectOption = (option: string) => {
    setSelectedOption(option);
    // Auto-collapse after selection
    if (isExpanded) {
      toggleExpanded();
    }
    return option;
  };
  
  // Animation variants
  const containerVariants = {
    collapsed: { 
      height: 0, 
      opacity: 0,
      transition: {
        height: { duration: 0.3 },
        opacity: { duration: 0.2 }
      }
    },
    expanded: { 
      height: 'auto', 
      opacity: 1,
      transition: {
        height: { duration: 0.3 },
        opacity: { duration: 0.2, delay: 0.1 }
      }
    }
  };
  
  return {
    isExpanded,
    toggleExpanded,
    selectOption,
    selectedOption,
    defaultOptions,
    controls,
    containerVariants
  };
}

export default useFlexibleResponse;