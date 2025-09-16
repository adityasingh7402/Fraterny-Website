// src/components/quest/progress/ProgressBar.tsx
import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { useProgressAnimation } from '../animations/useProgressAnimation';
import { useQuest } from '../core/useQuest';
import { SectionDrawer } from './SectionDrawer';
import { HonestyTag } from '../core/types';

interface ProgressBarProps {
  currentValue: number;
  totalValue: number;
  showLabel?: boolean;
  showMilestones?: boolean;
  animated?: boolean;
  className?: string;
}

/**
 * Progress bar component for tracking quest completion
 * Features animated progress and milestone indicators based on questions in the current section
 */
export function ProgressBar({
  currentValue,
  totalValue,
  showLabel = true,
  showMilestones = true,
  animated = true,
  className = ''
}: ProgressBarProps) {
  // Drawer state
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Handle clicks outside the dropdown to close it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDrawerOpen(false);
      }
    };

    if (isDrawerOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDrawerOpen]);

  // Get sections from the quest context
  const { sections, currentSectionId, currentQuestion, session, changeSection, allQuestions, submitResponse, hasAttemptedFinishWithIncomplete } = useQuest();
  
  // Helper function to check if a section has incomplete questions
  const sectionHasIncompleteQuestions = (sectionId: string): boolean => {
    if (!session?.responses || !allQuestions) return false;
    
    const sectionQuestions = allQuestions.filter(q => q.sectionId === sectionId);
    return sectionQuestions.some(q => !session.responses || !session.responses[q.id]);
  };
  
  // Find current section
  const currentSection = sections.find(section => section.id === currentSectionId);
  
  // Count of questions in the current section
  const questionsInSection = currentSection?.questions.length || 0;

  // Add these NEW functions:
const getTotalQuestionsCount = () => {
  return allQuestions?.length || 0;
};

// const getTotalCompletedQuestions = () => {
//   if (!session?.responses || !allQuestions) return 0;
//   return allQuestions.filter(q => session.responses && session.responses[q.id]).length;
// };

// const totalProgressPercentage = getTotalQuestionsCount() > 0 
//   ? (getTotalCompletedQuestions() / getTotalQuestionsCount()) * 100 
//   : 0;
  
  // Index of current question within the section
  const getQuestionIndexInSection = () => {
    if (!currentSection || !currentQuestion) return 0;
    
    return currentSection.questions.findIndex(q => q.id === currentQuestion.id);
  };

  const getCurrentGlobalQuestionIndex = () => {
  if (!currentQuestion || !sections) return 0;
  
  let globalIndex = 0;
  
  // Add questions from previous sections
  for (const section of sections) {
    if (section.id === currentSectionId) {
      // Found current section, add current question index within this section
      globalIndex += getQuestionIndexInSection();
      break;
    }
    // Add all questions from this section
    globalIndex += section.questions.length;
  }
  
  return globalIndex;
};

const totalProgressPercentage = getTotalQuestionsCount() > 0 
  ? ((getCurrentGlobalQuestionIndex() + 1) / getTotalQuestionsCount()) * 100 
  : 0;
  

  const questionIndexInSection = getQuestionIndexInSection();
  
  
  
  // // Generate milestones based on the number of questions in the current section
  // const generateMilestones = (): number[] => {
  //   if (!currentSection || questionsInSection === 0) {
  //     return [20, 40, 60, 80, 100]; // Fallback
  //   }
    
  //   // Create one milestone for each question
  //   return Array.from({ length: questionsInSection }, (_, index) => 
  //     (index / (questionsInSection - 1)) * 100
  //   );
  // };
  
  // const milestones = generateMilestones();
  
  // Use progress animation hook
  const { 
    progressControls, 
  } = useProgressAnimation(getCurrentGlobalQuestionIndex(), getTotalQuestionsCount(), {
    animated,
    // milestones
  });

  // Get section color by index
const getSectionColor = (sectionIndex: number): string => {
  const colors = ['#004A7F', '#CA7D7D', '#84ADDF', '#96C486', '#CECECE'];
  return colors[sectionIndex] || '#004A7F';
};

// Calculate how many sections are completed
const getCompletedSectionsCount = () => {
  const currentSectionIndex = sections.findIndex(s => s.id === currentSectionId);
  return currentSectionIndex;
};

// Calculate progress within current section
const getCurrentSectionProgress = () => {
  if (!currentSection) return 0;
  const questionsInCurrentSection = currentSection.questions.length;
  const answeredInCurrentSection = questionIndexInSection;
  return (answeredInCurrentSection / questionsInCurrentSection) * 100;
};
  
  // Determine progress bar color based on percentage
  // const getProgressColor = (): string => {
  //   return 'bg-gradient-to-br from-sky-800 to-sky-400'; // Always blue color
  // };

  const getProgressColor = (): string => {
  switch(currentSectionId) {
    case 'section_1': return '#004A7F';
    case 'section_2': return '#CA7D7D'; 
    case 'section_3': return '#84ADDF';
    case 'section_4': return '#96C486';
    case 'section_5': return '#CECECE';
    default: return '#004A7F';
  }
};
  
  const progressColor = getProgressColor();
  // console.log('🎨 Progress Color:', progressColor);

  // Handle drawer toggle
  const handleDrawerToggle = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  // Handle section selection from drawer
  // const handleSectionSelect = (sectionId: string) => {
  //   changeSection(sectionId);
  //   setIsDrawerOpen(false); // Close drawer after selection
  // };

  const handleSectionSelect = (sectionId: string) => {

    const getAnonymousModeFromDOM = (): boolean => {
  const toggleButton = document.querySelector('[data-anonymous-mode]');
  return toggleButton?.getAttribute('data-anonymous-mode') === 'true';
};

  // Save current response before changing section
  if (currentQuestion) {
    const getSelectedTagsFromQuestionCard = (): HonestyTag[] => {
      try {
        const saved = localStorage.getItem(`quest_tags_${currentQuestion.id}`);
        if (saved) {
          const tags = JSON.parse(saved);
          return tags;
        }
      } catch (error) {
        console.error('Failed to load tags from localStorage:', error);
      }
      
      const tagButtons = document.querySelectorAll('[data-tag-selected="true"]');
      const selectedTags: HonestyTag[] = [];
      
      tagButtons.forEach(button => {
        const tagValue = button.getAttribute('data-tag-value') as HonestyTag;
        if (tagValue) {
          selectedTags.push(tagValue);
        }
      });
      
      return selectedTags;
    };

    if (currentQuestion.type === 'text_input') {
  const currentTextarea = document.querySelector('textarea');
  if (currentTextarea && currentTextarea.value) {
    const selectedTags = getSelectedTagsFromQuestionCard();
    
    // Determine field name based on question type
    const getFieldName = () => {
      if (currentQuestion.id === 'q1_1') return 'name';
      if (currentQuestion.id === 'q1_2') return 'email';
      if (currentQuestion.id === 'q1_3') return 'age';
      if (currentQuestion.id === 'q1_5') return 'details';
      return 'details'; // fallback
    };
    
    const fieldName = getFieldName();
    
    if (currentQuestion.allowAnonymous) {
      // All anonymous-enabled questions (name, email, location)
      const isAnonymousMode = getAnonymousModeFromDOM();
      
      if (isAnonymousMode) {
        const anonymousResponse = JSON.stringify({
          isAnonymous: true,
          selectedCity: "",
          [fieldName]: currentQuestion.enableCityAutocomplete ? currentTextarea.value : ""
        });
        submitResponse(currentQuestion.id, anonymousResponse, selectedTags);
      } else if (currentQuestion.enableCityAutocomplete) {
        // Location question with city
        const cityInput = document.querySelector('input[placeholder*="Start typing"]') as HTMLInputElement;
        const selectedCity = cityInput?.value || '';
        
        const combinedResponse = JSON.stringify({
          selectedCity: selectedCity,
          [fieldName]: currentTextarea.value,
          isAnonymous: false
        });
        submitResponse(currentQuestion.id, combinedResponse, selectedTags);
      } else {
        // Name/email questions without city
        const textOnlyResponse = JSON.stringify({
          selectedCity: "",
          [fieldName]: currentTextarea.value,
          isAnonymous: false
        });
        submitResponse(currentQuestion.id, textOnlyResponse, selectedTags);
      }
    } else if (currentQuestion.enableCityAutocomplete) {
      // Regular city autocomplete without anonymous mode
      const cityInput = document.querySelector('input[placeholder*="Start typing"]') as HTMLInputElement;
      const selectedCity = cityInput?.value || '';
      
      if (selectedCity) {
        const combinedResponse = JSON.stringify({
          selectedCity: selectedCity,
          details: currentTextarea.value
        });
        submitResponse(currentQuestion.id, combinedResponse, selectedTags);
      } else {
        submitResponse(currentQuestion.id, currentTextarea.value, selectedTags);
      }
    } else {
      // Regular text questions without any special features
      submitResponse(currentQuestion.id, currentTextarea.value, selectedTags);
    }
  }
}
    else if (currentQuestion.type === 'multiple_choice') {
      const selectedRadio = document.querySelector(`input[name="question-${currentQuestion.id}"]:checked`) as HTMLInputElement;
      if (selectedRadio) {
        const selectedTags = getSelectedTagsFromQuestionCard();
        submitResponse(currentQuestion.id, selectedRadio.value, selectedTags);
      }
    }
    else if (currentQuestion.type === 'date_input') {
      const currentDateInput = document.querySelector('input[placeholder*="date of birth"]') as HTMLInputElement ||
                              document.querySelector('.MuiInputBase-input') as HTMLInputElement ||
                              document.querySelector('input[type="date"]') as HTMLInputElement;
      if (currentDateInput && currentDateInput.value) {
        const selectedTags = getSelectedTagsFromQuestionCard();
        submitResponse(currentQuestion.id, currentDateInput.value, selectedTags);
      }
    }
  }
  
  // After saving, change section
  changeSection(sectionId);
  setIsDrawerOpen(false);
};
  
  return (
    <>
      <div className='flex flex-col items-center gap-2'>
        <div className={`w-full ${className}`}>  
          {/* Progress bar */}
          {/* <div className="w-full h-2">
            <motion.div
              className={` h-full`}
              animate={progressControls}
              initial={{ width: '0%' }}
              style={{ width: `${totalProgressPercentage}%`, backgroundColor: progressColor }}
            />
          </div> */}
          <div className="w-full h-2 flex items-center">
            {sections.map((section, index) => {
              const isCompleted = index < getCompletedSectionsCount();
              const isCurrent = index === getCompletedSectionsCount();
              const segmentWidth = 100 / sections.length;
              
              let fillWidth = 0;
              if (isCompleted) {
                fillWidth = 100;
              } else if (isCurrent) {
                fillWidth = getCurrentSectionProgress();
              }
              
              return (
                <React.Fragment key={section.id}>
                  <div style={{ width: `${segmentWidth}%` }} className="h-full">
                    <motion.div
                      className="h-full"
                      style={{ 
                        width: `${fillWidth}%`,
                        backgroundColor: getSectionColor(index)
                      }}
                      animate={{ width: `${fillWidth}%` }}
                      initial={{ width: '0%' }}
                    />
                  </div>
                  
                  {/* Add separator after each segment except the last one */}
                  {/* {index < sections.length - 1 && (
                    <div className="w-2.5 h-2.5 bg-zinc-300" />
                  )} */}
                  {index < getCompletedSectionsCount() && (
                    <div className="w-2.5 h-2.5 bg-zinc-300" />
                  )}
                </React.Fragment>
              );
            })}
          </div>
          
          {/* Milestone indicators */}
          {/* {showMilestones && (
            <div className="relative h-0 p-2">
              {milestones.map((milestone, index) => {
                const isActive = getCompletedResponsesInSection() > index;
                
                return (
                  <motion.div
                    key={index}
                    className={`w-9 h-9 bg-zinc-300 rounded-full absolute top-[-20px] left-[-5px] ${
                      isActive ? progressColor : 'bg-gray-200'
                    }`}
                    style={{ left: `${milestone}%`, marginLeft: '-20px' }}
                    animate={index === questionIndexInSection ? celebrationControls : undefined}
                  />
                );
              })}
            </div>
          )} */}
        </div>

        <div className="w-full px-6">
          {showLabel && (
            <div className="mb-2 text-sm flex justify-between items-center">
              {/* Section Selector Button with Dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={handleDrawerToggle}
                  className="w-28 min-w-28 h-10 bg-white rounded-[50px] border-[1.50px] border-neutral-400 items-center flex justify-center px-4 hover:bg-gray-50 transition-colors duration-200 group"
                >
                  <div className={`text-center justify-start text-xl font-normal font-['Gilroy-Bold'] tracking-[-1.5px] mr-2 ${
                    (hasAttemptedFinishWithIncomplete && sectionHasIncompleteQuestions(currentSectionId)) ? 'text-red-600' : 'text-sky-800'
                  }`}>
                    {currentSection?.title || 'Section'}
                  </div>
                  <ChevronDown 
                    className={`w-4 h-4 text-sky-800 transition-transform duration-200 ${
                      isDrawerOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                
                {/* Section Drawer */}
                <SectionDrawer
                  isOpen={isDrawerOpen}
                  onClose={() => setIsDrawerOpen(false)}
                  onSectionSelect={handleSectionSelect}
                />
              </div>
              
              {/* Question Counter */}
              <div className={`text-xl font-normal font-['Gilroy-Regular'] ${
                (hasAttemptedFinishWithIncomplete && sectionHasIncompleteQuestions(currentSectionId)) ? 'text-red-600' : 'text-neutral-500'
              }`}>
                {questionIndexInSection + 1} / {questionsInSection}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default ProgressBar;