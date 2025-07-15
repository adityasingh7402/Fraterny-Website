import { createContext, useContext } from 'react';
import { QuestContextValue, QuestionSection } from './types';
import questSections from './questions';
import { HonestyTag } from './types';

// Default empty section
const emptySection: QuestionSection = {
  id: '',
  title: '',
  description: '',
  questions: []
};

// Default value for the context
const defaultContextValue: QuestContextValue = {
  // State
  session: null,
  currentQuestion: null,
  questions: [],
  isLoading: false,
  isSubmitting: false,
  progress: 0,
  error: null,
  
  // Section data
  sections: questSections,
  currentSection: emptySection,
  currentSectionId: '',
  allQuestions: [],
  
  // Actions
  startQuest: async () => null,
  submitResponse: async (questionId: string, response: string, tags?: HonestyTag[]) => Promise.resolve(),
  nextQuestion: () => {},
  previousQuestion: () => {},
  changeSection: () => {},
  finishSection: () => false,
  finishQuest: async () => null,
  resetQuest: () => {},
};

// Create the context
export const QuestContext = createContext<QuestContextValue>(defaultContextValue);

// Custom hook to use the quest context
export function useQuestContext() {
  const context = useContext(QuestContext);
  
  if (context === undefined) {
    throw new Error('useQuestContext must be used within a QuestProvider');
  }
  
  return context;
}