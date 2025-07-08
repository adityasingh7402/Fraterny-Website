import React from 'react';
import { motion } from 'framer-motion';
import { HonestyTag } from '../core/types';
import { useQuestAnimation } from '../animations/useQuestAnimation';

interface AuthenticityTagsProps {
  selectedTags: HonestyTag[];
  onTagSelect: (tag: HonestyTag) => void;
  disabled?: boolean;
  className?: string;
}

/**
 * Authenticity tag selection component
 * Allows users to tag their responses with honesty indicators
 */
export function AuthenticityTags({
  selectedTags,
  onTagSelect,
  disabled = false,
  className = ''
}: AuthenticityTagsProps) {
  // Animation
  const { ref, controls, variants } = useQuestAnimation({
    variant: 'tag',
    triggerOnce: true
  });
  
  // All available tags with their colors
  const tags: { label: HonestyTag; color: string }[] = [
    { 
      label: 'Honest', 
      color: 'bg-green-100 text-green-700 border-green-200' 
    },
    { 
      label: 'Sarcastic', 
      color: 'bg-orange-100 text-orange-700 border-orange-200' 
    },
    { 
      label: 'Unsure', 
      color: 'bg-blue-100 text-blue-700 border-blue-200' 
    },
    { 
      label: 'Avoiding', 
      color: 'bg-gray-100 text-gray-700 border-gray-200' 
    }
  ];
  
  return (
    <motion.div 
      ref={ref}
      variants={variants}
      initial="hidden"
      animate={controls}
      className={`authenticity-tags flex flex-wrap gap-2 ${className}`}
    >
      {tags.map(tag => (
        <motion.button
          key={tag.label}
          onClick={() => !disabled && onTagSelect(tag.label)}
          whileHover={!disabled ? { scale: 1.05 } : undefined}
          whileTap={!disabled ? { scale: 0.95 } : undefined}
          className={`
            px-3 py-1 rounded-full text-xs border transition-all
            ${selectedTags.includes(tag.label)
              ? `${tag.color} shadow-sm`
              : 'bg-gray-50 text-gray-600 border-gray-200 hover:border-gray-300'
            }
            ${disabled ? 'cursor-default opacity-80' : ''}
          `}
          disabled={disabled}
        >
          {tag.label}
        </motion.button>
      ))}
    </motion.div>
  );
}

export default AuthenticityTags;