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
  const tags: { label: HonestyTag; color: string; class: string }[] = [
    { 
      label: 'Honest', 
      color: 'bg-green-100 text-lime-700 border-stone-400',
      class: 'px-0 w-20'
    },
    { 
      label: 'Sarcastic', 
      color: 'bg-sky-100 text-sky-800 border-blue-300',
      class: 'px-0 w-24'
    },
    { 
      label: 'Unsure', 
      color: 'bg-violet-100 text-purple-900 border-slate-500',
      class : 'px-0 w-20'
    },
    { 
      label: 'Avoiding', 
      color: 'bg-red-100 text-red-800 border-red-400',
      class: 'px-2 w-24'
    }
  ];
  
  return (
    <motion.div 
      ref={ref}
      variants={variants}
      initial="hidden"
      animate={controls}
      className={` flex flex-wrap gap-2 ${className}`}
    >
      {tags.map(tag => (
        <motion.button
          key={tag.label}
          onClick={() => !disabled && onTagSelect(tag.label)}
          whileHover={!disabled ? { scale: 1.05 } : undefined}
          whileTap={!disabled ? { scale: 0.95 } : undefined}
          className={`
            w-20 h-7 rounded-2xl border text-lg font-normal font-['Gilroy-Medium'] tracking-[-1px] ${tag.color} ${tag.class}
            ${selectedTags.includes(tag.label)
              ? `${tag.color} shadow-sm`
              : ''
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