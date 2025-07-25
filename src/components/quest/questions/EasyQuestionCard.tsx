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
      className={`${props.className || ''}`}
    />
  );
}

export default EasyQuestionCard;