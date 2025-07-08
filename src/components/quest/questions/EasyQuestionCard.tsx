import React from 'react';
import { motion } from 'framer-motion';
import { QuestionCard } from './QuestionCard';
import { DifficultyQuestionCardProps } from './types';

/**
 * Easy difficulty question card
 * Styled with terracotta accents for easy questions
 */
export function EasyQuestionCard(props: DifficultyQuestionCardProps) {
  return (
    <QuestionCard
      {...props}
      className={`border-l-4 border-l-terracotta bg-gradient-to-r from-terracotta/5 to-transparent ${props.className || ''}`}
    />
  );
}

export default EasyQuestionCard;