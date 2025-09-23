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
      key={props.question.id} // Force re-mount when question changes
      className={`${props.className || ''}`}
    />
  );
}

export default HardQuestionCard;