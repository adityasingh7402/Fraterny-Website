import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MultipleChoiceProps } from './types';
import { useChoiceAnimation } from '../animations/useChoiceAnimation';

/**
 * Multiple choice selection component
 * Displays a list of options for selection
 */
export function MultipleChoice({
  question,
  options,
  onResponse,
  isActive = true,
  isAnswered = false,
  previousResponse,
  layout = 'grid',
  className = ''
}: MultipleChoiceProps) {
  // Selected option state
  const [selectedOption, setSelectedOption] = useState<string | undefined>(previousResponse);
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1
      }
    }
  };
  
  const optionVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };
  
  // Handle option selection
  const handleOptionSelect = (option: string) => {
     console.log('handleOptionSelect called with:', option); // DEBUG
  console.log('isActive:', isActive, 'isAnswered:', isAnswered); // DEBUG
    if (!isActive || isAnswered) return;
    console.log('Setting selectedOption to:', option); // DEBUG
    
    setSelectedOption(option);
    onResponse(option);
  };
  
  // Determine grid layout class
  const getLayoutClass = (): string => {
    switch (layout) {
      case 'grid':
        return 'grid grid-cols-2 sm:grid-cols-2 gap-3';
      case 'vertical':
      default:
        return 'grid grid-cols-2 sm:grid-cols-2 gap-3';
    }
  };
  
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={`multiple-choice ${getLayoutClass()} ${className}`}
    >
      {options.map((option, index) => {
        const isSelected = option === selectedOption;
      console.log('Option:', option);
    console.log('selectedOption:', selectedOption);
    console.log('previousResponse:', previousResponse);
    console.log('isSelected:', isSelected);
    console.log('---');
        
        // Use the choice animation hook
        const { 
          controls, 
          handleHover, 
          handleHoverEnd, 
          handleTap,
          handleSelect,
          handleDeselect
        } = useChoiceAnimation(isSelected);
        
        // Set selected state on initial render if we have a previous response
        useEffect(() => {
          if (isSelected) {
            handleSelect();
          }
        }, []);
        
        return (
          <motion.button
            key={index}
            variants={optionVariants}
            animate={controls}
            onClick={() => handleOptionSelect(option)}
            onHoverStart={handleHover}
            onHoverEnd={handleHoverEnd}
            onTap={handleTap}
            disabled={!isActive || isAnswered}
            className={`
              w-full p-3 text-left border rounded-lg transition-all
              ${isSelected 
                ? 'bg-[#E2EFFF] border-[#84ADDF] text-[#004A7F]' 
                : ''
              }
              ${!isActive || isAnswered ? 'opacity-80 cursor-default' : 'cursor-pointer'}
            `}
          >
            {option}
          </motion.button>
        );
      })}
    </motion.div>
  );
}

export default MultipleChoice;