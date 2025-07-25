import React from 'react';
import { motion } from 'framer-motion';

interface QuestionCardSkeletonProps {
  difficulty?: 'easy' | 'medium' | 'hard';
  className?: string;
}

/**
 * Loading skeleton for question cards
 * Maintains the same visual structure while loading
 */
export function QuestionCardSkeleton({
  difficulty = 'medium',
  className = ''
}: QuestionCardSkeletonProps) {
  // Get border color based on difficulty
  const getBorderColor = (): string => {
    switch (difficulty) {
      case 'easy': return 'border-l-red';
      case 'medium': return 'border-l-navy';
      case 'hard': return 'border-l-gold';
      default: return 'border-l-navy';
    }
  };
  
  const borderColor = getBorderColor();
  
  // Shimmer animation
  const shimmer = {
    hidden: {
      backgroundPosition: '200% 0',
    },
    animate: {
      backgroundPosition: '-200% 0',
      transition: {
        repeat: Infinity,
        duration: 1.5,
        ease: 'linear',
      },
    },
  };
  
  return (
    <div className={`
      
      ${className}
    `}>
      {/* Privacy indicator */}
      <div className="flex items-center gap-2 mb-4">
        <motion.div
          variants={shimmer}
          initial="hidden"
          animate="animate"
          className="w-2 h-2 rounded-full bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:400%_100%]"
        />
        <motion.div
          variants={shimmer}
          initial="hidden"
          animate="animate"
          className="h-4 w-36 rounded bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:400%_100%]"
        />
      </div>
      
      {/* Question text */}
      <div className="mb-6">
        <motion.div
          variants={shimmer}
          initial="hidden"
          animate="animate"
          className="h-7 w-full rounded bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:400%_100%] mb-3"
        />
        <motion.div
          variants={shimmer}
          initial="hidden"
          animate="animate"
          className="h-7 w-3/4 rounded bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:400%_100%] mb-3"
        />
        <motion.div
          variants={shimmer}
          initial="hidden"
          animate="animate"
          className="h-5 w-1/2 rounded bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:400%_100%]"
        />
      </div>
      
      {/* Response options */}
      <div className="space-y-3 mb-6">
        {[1, 2, 3].map((i) => (
          <motion.div
            key={i}
            variants={shimmer}
            initial="hidden"
            animate="animate"
            className="h-12 w-full rounded-lg bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:400%_100%]"
          />
        ))}
      </div>
      
      {/* Tags */}
      <div className="border-t border-gray-100 pt-4">
        <motion.div
          variants={shimmer}
          initial="hidden"
          animate="animate"
          className="h-4 w-40 rounded bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:400%_100%] mb-3"
        />
        <div className="flex flex-wrap gap-2">
          {[1, 2, 3, 4].map((i) => (
            <motion.div
              key={i}
              variants={shimmer}
              initial="hidden"
              animate="animate"
              className="h-6 w-16 rounded-full bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:400%_100%]"
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default QuestionCardSkeleton;