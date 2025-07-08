import React from 'react';
import { motion } from 'framer-motion';
import { QuestionCard } from './QuestionCard';
import { DifficultyQuestionCardProps } from './types';

/**
 * Hard difficulty question card
 * Styled with gold accents for challenging questions
 */
export function HardQuestionCard(props: DifficultyQuestionCardProps) {
  return (
    <QuestionCard
      {...props}
      className={`border-l-4 border-l-gold bg-gradient-to-r from-gold/5 to-transparent ${props.className || ''}`}
    />
  );
}

export default HardQuestionCard;