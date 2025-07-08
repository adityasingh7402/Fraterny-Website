import { useState, useEffect } from 'react';
import { useQuest } from '../core/useQuest';

interface UseQuestProgressOptions {
  showMilestones?: boolean;
  milestones?: number[];
}

/**
 * Hook for tracking and visualizing quest progress
 */
export function useQuestProgress(options: UseQuestProgressOptions = {}) {
  const {
    showMilestones = true,
    milestones = [25, 50, 75, 100]
  } = options;
  
  const { session, questions, currentSectionId, sections } = useQuest();
  
  // Progress state
  const [progress, setProgress] = useState<number>(0);
  const [currentMilestone, setCurrentMilestone] = useState<number | null>(null);
  const [sectionsCompleted, setSectionsCompleted] = useState<string[]>([]);
  
  // Calculate progress
  useEffect(() => {
    if (session && questions.length > 0) {
      // Calculate progress percentage
      const responseCount = session.responses ? Object.keys(session.responses).length : 0;
      const progressPercentage = Math.min(100, Math.round((responseCount / questions.length) * 100));
      setProgress(progressPercentage);
      
      // Check for milestones
      if (showMilestones) {
        const reachedMilestone = milestones.find(m => progressPercentage >= m && m > (currentMilestone || 0));
        if (reachedMilestone) {
          setCurrentMilestone(reachedMilestone);
        }
      }
      
      // Track completed sections
      const sectionQuestions = sections.map(section => {
        return {
          sectionId: section.id,
          questions: questions.filter(q => q.sectionId === section.id)
        };
      });
      
      const completedSections = sectionQuestions
        .filter(section => {
          // A section is complete if all its questions have been answered
          return section.questions.every(q => session.responses && session.responses[q.id]);
        })
        .map(section => section.sectionId);
      
      setSectionsCompleted(completedSections);
    }
  }, [session, questions, showMilestones, milestones, currentMilestone, sections]);
  
  // Check if current section is complete
  const isCurrentSectionComplete = (): boolean => {
    return sectionsCompleted.includes(currentSectionId);
  };
  
  // Get next incomplete section
  const getNextIncompleteSection = (): string | null => {
    const sectionIndex = sections.findIndex(s => s.id === currentSectionId);
    const nextSections = sections.slice(sectionIndex + 1);
    
    for (const section of nextSections) {
      if (!sectionsCompleted.includes(section.id)) {
        return section.id;
      }
    }
    
    return null;
  };
  
  return {
    progress,
    currentMilestone,
    sectionsCompleted,
    totalSections: sections.length,
    currentSectionProgress: isCurrentSectionComplete() ? 100 : 0, // Simplified for now
    isCurrentSectionComplete,
    getNextIncompleteSection,
    isComplete: progress === 100
  };
}

export default useQuestProgress;