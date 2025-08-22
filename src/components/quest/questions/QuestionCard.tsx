import React, { useState, useMemo, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useQuestAnimation } from '../animations/useQuestAnimation';
import { QuestionCardProps } from './types';
import { HonestyTag } from '../core/types';
import { useQuest } from '../core/useQuest';
import { AuthenticityTags } from '../trust-elements/AuthenticityTags';
import { DateResponse } from '../responses/DateResponse';
import { RankingResponse } from '../responses/RankingResponse';
import { getWordValidationStatus, getWordValidationMessage } from '../utils/questValidation';

/**
 * Base question card component
 * Renders a question with appropriate input type and honesty tags
 */
const colorConfigs = [
  { index: 1, bg: 'bg-green-100', text: 'text-lime-700', border: 'border-stone-400' },   // Male
  { index: 1, bg: 'bg-sky-100', text: 'text-sky-800', border: 'border-blue-300' },       // Female
  { index: 1, bg: 'bg-violet-100', text: 'text-purple-900', border: 'border-slate-500' },// Non-binary
  { index: 1, bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-400' },        // Other
  { index: 1, bg: 'bg-gray-100', text: 'text-gray-800', border: 'border-gray-400' }      // Prefer not to say
];

export function QuestionCard({
  question,
  onResponse,
  isActive = true,
  isAnswered = false,
  previousResponse,
  showTags = true,
  className = ''
}: QuestionCardProps) {
  // State for the current response
  
  const [response, setResponse] = useState<string>(previousResponse?.response || '');
  // const [selectedTags, setSelectedTags] = useState<HonestyTag[]>(previousResponse?.tags || []);
  const [showFlexibleOptions, setShowFlexibleOptions] = useState(false);
  const [currentSelection, setCurrentSelection] = useState<string>(previousResponse?.response || '');
  const { trackQuestionView, stopQuestionTracking } = useQuest();
  // Replace your current selectedTags state with this:
  

    // First, create a memoized initial value outside of useState
    const getInitialTags = useMemo(() => {
      if (question?.id) {
        try {
          const savedTags = localStorage.getItem(`quest_tags_${question.id}`);
          if (savedTags) {
            // console.log('📂 Loading from localStorage (memoized):', JSON.parse(savedTags));
            return JSON.parse(savedTags);
          }
        } catch (error) {
          console.error('Failed to load tags from localStorage:', error);
        }
      }
      return previousResponse?.tags || [];
    }, [question?.id, previousResponse?.tags]);

    // Then use simple useState with the memoized value
    const [selectedTags, setSelectedTags] = useState<HonestyTag[]>(getInitialTags);

    useEffect(() => {
  console.log('🔄 Response state changed:', {
    questionId: question?.id,
    questionType: question?.type,
    newResponse: response,
    timestamp: new Date().toISOString()
  });
  // Add this part:
  if (question?.type === 'date_input') {
    console.log('📅 Date response stored:', response);
  }
}, [response, question?.id]);
  

useEffect(() => {
  if (question?.id && isActive) {
    // Track when this question becomes active
    trackQuestionView(question.id);
  }
  
  return () => {
    // Stop tracking when component unmounts
    stopQuestionTracking();
  };
}, [question?.id, isActive]);


  // Animation
  const { ref, controls, variants } = useQuestAnimation({
    variant: 'questionCard',
    triggerOnce: true
  });



  // NEW: Word count configuration for text inputs
  const maxWords = 100;
  const wordWarningThreshold = 90;
  const maxLength = 1000; // Character limit

  const handleTagSelect = (tag: HonestyTag) => {
  setSelectedTags(prev => {
    const newTags = prev.includes(tag) 
      ? prev.filter(t => t !== tag)
      : [...prev, tag];

    if (question?.id) {
      localStorage.setItem(`quest_tags_${question.id}`, JSON.stringify(newTags));
      // console.log('💾 QuestionCard saved tags to localStorage:', {
      //   questionId: question.id,
      //   tags: newTags
      // });
    }
    
    return newTags;
  });
};
  


    const handleSubmit = (submittedResponse: string) => {
    if (!isActive) return;
    // console.log('Submitting response:', submittedResponse);
    console.log('🚀 handleSubmit called with:', submittedResponse);
      
    // Call the onResponse callback with the response and tags (no validation blocking)
    onResponse(submittedResponse, selectedTags);
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    console.log('🎯 handleInputChange received:', e.target.value, 'for question:', question?.type);
  const newValue = e.target.value;
  
  // Allow pasting but truncate if too long
  if (question.type === 'text_input' && maxLength && newValue.length > maxLength) {
    setResponse(newValue.substring(0, maxLength));
    return;
  }
  
  setResponse(newValue);
  console.log('📝 Set response to:', newValue);
  
  // AUTO-SAVE: Call onResponse immediately for auto-save
  // onResponse(newValue, selectedTags);
};
  
  
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (response.trim()) {
      
      handleSubmit(response);
    }
  };
  

  const getTextInputValidation = () => {
    if (question.type !== 'text_input') return null;
    
    const characterCount = response.length;
    const wordValidation = getWordValidationStatus(response, maxWords, wordWarningThreshold);
    const wordMessage = getWordValidationMessage(response, maxWords, wordWarningThreshold);
    
    const isCharacterValid = characterCount <= maxLength;
    const isValid = isCharacterValid && wordValidation.isValid && response.trim().length > 0;
    
    return {
      characterCount,
      wordCount: wordValidation.wordCount,
      isValid,
      wordStatus: wordValidation.status,
      wordMessage,
      isEmpty: characterCount === 0
    };
  };
  
  // Render different input types based on question type
  const renderQuestionInput = () => {
    switch (question.type) {
      case 'multiple_choice':
        return (
          <div className="grid grid-cols-2 gap-1 mb-6">
            {/* {question.options?.map((option, index) => {
              const isSelected = currentSelection === option;
              return (
                <motion.button
                  key={index}
                  onClick={() => {
                    setCurrentSelection(option);
                    handleSubmit(option);
                  }}
                  // whileHover={{ backgroundColor: '#E2EFFF', borderColor: '#84ADDF', color: '#004A7F' }}
                  className={`rounded-lg h-14 text-left pl-3 text-xl font-normal font-['Gilroy-Medium'] border ${index===4 ? 'col-span-2' : ''}`}
                  style={{
                      backgroundColor: isSelected ? (index === 0 ? '#D1F2D1' : (index === 1 ? '#BAE6FD' : (index === 2 ? '#DDD6FE' : (index === 3 ? '#FECACA' : '#E5E7EB')))) : (index === 0 ? '#E8F5E8' : (index === 1 ? '#E0F2FE' : (index === 2 ? '#EDE9FE' : (index === 3 ? '#FEE2E2' : '#F3F4F6')))),
                      borderColor: isSelected ? (index === 0 ? '#65A30D' : (index === 1 ? '#0284C7' : (index === 2 ? '#7C3AED' : (index === 3 ? '#DC2626' : '#6B7280')))) : (index === 0 ? '#9CA3AF' : (index === 1 ? '#93C5FD' : (index === 2 ? '#6B7280' : (index === 3 ? '#F87171' : '#9CA3AF')))),
                      color: index === 0 ? '#2A7F00' : (index === 1 ? '#004A7F' : (index === 2 ? '#50007F' : (index === 3 ? '#A4080B' : '#374151')))
                  }}
                  disabled={!isActive || isAnswered}
                >
                  {option}
                </motion.button>
              );
            })} */}
            {question.options?.map((option, index) => {
          const isSelected = currentSelection === option;
          
          return (
            <motion.button
              key={index}
              onClick={() => {
                setCurrentSelection(option);
                handleSubmit(option);
              }}
              // whileHover={{ 
              //   backgroundColor: index === 0 ? '#D1F2D1' : (index === 1 ? '#FECACA' : (index === 2 ? '#DDD6FE' : (index === 3 ? '#BAE6FD' : '#E5E7EB'))), 
              //   borderColor: index === 0 ? '#65A30D' : (index === 1 ? '#DC2626' : (index === 2 ? '#7C3AED' : (index === 3 ? '#0284C7' : '#6B7280'))), 
              //   color: index === 0 ? '#2A7F00' : (index === 1 ? '#A4080B' : (index === 2 ? '#50007F' : (index === 3 ? '#004A7F' : '#374151')))
              // }}
              className={`rounded-lg h-14 text-left pl-3 text-xl font-normal font-['Gilroy-Medium'] border ${index === 4 ? 'col-span-2' : ''}`}
              style={{
                // Background Color Logic
                backgroundColor: isSelected 
                  ? (index === 0 ? '#E8F5E8' : (index === 1 ? '#FEE2E2' : (index === 2 ? '#EDE9FE' : (index === 3 ? '#E0F2FE' : '#F3F4F6'))))
                  : '#FEFEFE', // Always gray when not selected
                
                // Border Color Logic  
                borderColor: isSelected 
                  ? (index === 0 ? '#65A30D' : (index === 1 ? '#DC2626' : (index === 2 ? '#7C3AED' : (index === 3 ? '#0284C7' : '#9CA3AF'))))
                  : '#B1B1B1', // Always gray when not selected
                
                // Text Color Logic
                color: isSelected 
                  ? (index === 0 ? '#2A7F00' : (index === 1 ? '#A4080B' : (index === 2 ? '#50007F' : (index === 3 ? '#004A7F' : '#374151'))))
                  : '#B1B1B1' // Always dark gray when not selected
              }}
              disabled={!isActive || isAnswered}
            >
              {option}
            </motion.button>
          );
        })}
            </div>
        );
        
      case 'text_input':
          const textValidation = getTextInputValidation();
          return (
            <div className="mb-6">
              <form onSubmit={handleFormSubmit}>
                <div className="relative mb-[-15px]">
                  <textarea
                    value={response}
                    onChange={handleInputChange}
                    placeholder={question.placeholder || "Be as honest as you want to be for the best analysis"}
                    
                    className={`p-3 bg-white rounded-lg border border-zinc-400 resize-y w-full h-52 justify-start text-black text-xl font-normal font-['Gilroy-Medium'] ${
                      textValidation?.wordStatus === 'error' 
                        ? '' 
                        : 'border-gray-200'
                    }`}
                    disabled={!isActive || isAnswered}
                  />
                </div>
                
                {/* Word validation message */}
                {textValidation?.wordMessage && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`mt-2 text-xs ${
                      textValidation.wordStatus === 'warning' ? 'text-amber-600' : 'text-red-600'
                    }`}
                  >
                    {textValidation.wordMessage}
                  </motion.div>
                )}
                
                {/* {question.allowTags && showTags && (isActive || (isAnswered && selectedTags.length > 0)) && (
                  <div className="mt-4 mb-3">
                    <AuthenticityTags 
                      selectedTags={selectedTags}
                      onTagSelect={handleTagSelect}
                      disabled={isAnswered}
                    />
                  </div>
                )} */}

                {question.allowTags && showTags && (
                  <div className="mt-4 mb-3">
                    <p className="font-normal font-['Gilroy-Medium'] text-gray-600 pb-2"> Want to tag your answer? </p>
                    <AuthenticityTags 
                      selectedTags={selectedTags}
                      onTagSelect={handleTagSelect}
                      disabled={isAnswered}
                    />
                  </div>
                )}
                
                {/* {isActive && !isAnswered && (
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`mt-3 px-4 py-2 rounded-lg transition-colors ${
                      textValidation?.isValid
                        ? 'bg-terracotta text-white hover:bg-terracotta/90'
                        : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    }`}
                    disabled={!textValidation?.isValid}
                  >
                    Submit
                  </motion.button>
                )} */}
              </form>
            </div>
          );
        
      case 'scale_rating':
        return (
          <div className="mb-6">
            <div className="flex justify-between mb-2">
              <span className="text-sm text-gray-500">
                {question.minScale || 1}
              </span>
              <span className="text-sm text-gray-500">
                {question.maxScale || 10}
              </span>
            </div>
            <input
              type="range"
              min={question.minScale || 1}
              max={question.maxScale || 10}
              value={response || (question.minScale || 1)}
              onChange={handleInputChange}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-black"
              disabled={!isActive || isAnswered}
            />
            {/* {isActive && !isAnswered && (
              <motion.button
                onClick={() => handleSubmit(response)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="mt-3 px-4 py-2 bg-terracotta text-white rounded-lg hover:bg-terracotta/90 transition-colors"
              >
                Submit
              </motion.button>
            )} */}
          </div>
        );
        
      case 'date_input':
        return (
          <DateResponse
            value={response}
            onChange={handleInputChange}
            // onSubmit={handleSubmit}
            placeholder='Select your date of birth'
            disabled={!isActive || isAnswered}
            className="mb-6"
          />
        );
      
      // case 'ranking':
      //   return (
      //     <RankingResponse
      //       options={question.options || []}
      //       value={response}
      //       onChange={handleInputChange}
      //       onResponse={handleSubmit} 
      //       disabled={!isActive || isAnswered}
      //       className="mb-6"
      //     />
      //   );
      case 'ranking':
        return (
          <RankingResponse
            options={question.options || []}
            value={response}
            onChange={handleInputChange}
            onResponse={handleSubmit} 
            disabled={!isActive || isAnswered}
            className="mb-6"
            // ← ADD these new props:
            selectedTags={selectedTags}
            onTagSelect={handleTagSelect}
            allowTags={question.allowTags}
            showTags={showTags}
          />
        );
      
      default:
      return (
        <div className="mb-6 text-gray-500 italic">
          This question type is not supported yet.
        </div>
      );
    }
  };

  
  return (
    <motion.div
      ref={ref}
      variants={variants}
      initial="hidden"
      animate={controls}
      className={`${className}`}
    >      
      {/* Question Text */}
      <div className="mb-4">
        <div className="justify-start text-neutral-950 text-4xl font-normal font-['Gilroy-Bold']">{question.text}</div>
      </div>
      
      
      {/* Question Input */}
      {renderQuestionInput()}
    </motion.div>
  );
}

export default QuestionCard;