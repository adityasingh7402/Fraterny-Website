import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuestAnimation } from '../animations/useQuestAnimation';
import { QuestionCardProps } from './types';
import { HonestyTag } from '../core/types';
import { PrivacyIndicator } from '../trust-elements/PrivacyIndicator';
import { AuthenticityTags } from '../trust-elements/AuthenticityTags';
import { DateResponse } from '../responses/DateResponse';
import { RankingResponse } from '../responses/RankingResponse';

/**
 * Base question card component
 * Renders a question with appropriate input type and honesty tags
 */
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
  const [selectedTags, setSelectedTags] = useState<HonestyTag[]>(previousResponse?.tags || []);
  const [showFlexibleOptions, setShowFlexibleOptions] = useState(false);
  
  // Animation
  const { ref, controls, variants } = useQuestAnimation({
    variant: 'questionCard',
    triggerOnce: true
  });
  
  // Handle tag selection
  const handleTagSelect = (tag: HonestyTag) => {
    setSelectedTags(prev => {
      // If tag is already selected, remove it
      if (prev.includes(tag)) {
        return prev.filter(t => t !== tag);
      }
      // Otherwise, add it
      return [...prev, tag];
    });
  };
  
  // Handle flexible response toggle
  const handleFlexibleResponseToggle = () => {
    setShowFlexibleOptions(!showFlexibleOptions);
  };
  
  // Flexible response options
  const flexibleResponses = [
    "I don't know",
    "I'm not sure but...",
    "I don't want to answer this question"
  ];
  
  // Handle response submission
  const handleSubmit = (submittedResponse: string) => {
    if (!isActive) return;
    
    // Call the onResponse callback with the response and tags
    onResponse(submittedResponse, selectedTags);
  };
  
  // Handle text input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setResponse(e.target.value);
  };
  
  // Handle form submission
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (response.trim()) {
      handleSubmit(response);
    }
  };
  
  // Render different input types based on question type
  const renderQuestionInput = () => {
    switch (question.type) {
      case 'multiple_choice':
        return (
          <div className="space-y-3 mb-6">
            {question.options?.map((option: any, index: any) => (
              <motion.button
                key={index}
                onClick={() => handleSubmit(option)}
                whileHover={{ scale: 1.02, backgroundColor: 'rgba(224, 122, 95, 0.03)' }}
                whileTap={{ scale: 0.98 }}
                className={`w-full p-3 text-left border rounded-lg transition-all ${
                  previousResponse?.response === option
                    ? 'border-terracotta bg-terracotta/5'
                    : 'border-gray-200 hover:border-terracotta/50'
                }`}
                disabled={!isActive || isAnswered}
              >
                {option}
              </motion.button>
            ))}
          </div>
        );
        
      case 'text_input':
        return (
          <form onSubmit={handleFormSubmit} className="mb-6">
            <textarea
              value={response}
              onChange={handleInputChange}
              placeholder="Text like you text a friend. Be as honest as you want to be."
              className="w-full p-3 border border-gray-200 rounded-lg focus:border-terracotta focus:ring-1 focus:ring-terracotta/20 transition-all min-h-[100px] resize-y"
              disabled={!isActive || isAnswered}
            />
            {isActive && !isAnswered && (
              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="mt-3 px-4 py-2 bg-terracotta text-white rounded-lg hover:bg-terracotta/90 transition-colors"
                disabled={!response.trim()}
              >
                Submit
              </motion.button>
            )}
          </form>
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
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-terracotta"
              disabled={!isActive || isAnswered}
            />
            {isActive && !isAnswered && (
              <motion.button
                onClick={() => handleSubmit(response)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="mt-3 px-4 py-2 bg-terracotta text-white rounded-lg hover:bg-terracotta/90 transition-colors"
              >
                Submit
              </motion.button>
            )}
          </div>
        );
        
      case 'date_input':
        return (
          <DateResponse
            value={response}
            onChange={handleInputChange}
            onSubmit={handleSubmit}
            disabled={!isActive || isAnswered}
            className="mb-6"
          />
        );
      
      case 'ranking':
        return (
          <RankingResponse
            options={question.options || []}
            value={response}
            onChange={handleInputChange}
            onSubmit={handleSubmit}
            disabled={!isActive || isAnswered}
            className="mb-6"
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
      className={`question-card bg-white rounded-lg shadow-sm border border-gray-200 p-6 ${className}`}
    >
      {/* Privacy Reassurance */}
      {/* <PrivacyIndicator className="mb-4" /> */}
      
      
      {/* Question Text */}
      <div className="mb-6">
        <h3 className="text-xl text-navy mb-3">{question.text}</h3>
        {/* <p className="text-sm text-gray-600 italic">
          Text like you text a friend. Be as honest as you want to be.
        </p> */}
      </div>
      
      {/* Question Input */}
      {renderQuestionInput()}
      
      {/* Flexible Response Options */}
      {question.type === 'text_input' && isActive && !isAnswered && (
        <div className="mb-6">
          <button
            onClick={handleFlexibleResponseToggle}
            className="text-sm text-gray-500 hover:text-terracotta transition-colors"
          >
            {showFlexibleOptions ? 'Hide options' : 'Not sure? Click for options'}
          </button>
          
          {showFlexibleOptions && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ 
                height: 'auto', 
                opacity: 1,
                transition: { duration: 0.3 }
              }}
              className="mt-3 space-y-2 overflow-hidden"
            >
              {flexibleResponses.map((flexResponse, index) => (
                <motion.button
                  key={index}
                  onClick={() => handleSubmit(flexResponse)}
                  whileHover={{
                    scale: 1.01,
                    backgroundColor: 'rgba(156, 163, 175, 0.1)'
                  }}
                  className="block w-full p-2 text-left text-sm text-gray-600 border border-gray-100 rounded hover:border-gray-300 transition-all"
                >
                  {flexResponse}
                </motion.button>
              ))}
            </motion.div>
          )}
        </div>
      )}
      
      {/* Self-Awareness Tags */}
      {showTags && (isActive || (isAnswered && selectedTags.length > 0)) && (
        <div className="border-t border-gray-100 pt-4">
          <p className="text-xs text-gray-500 mb-3">
            How would you describe your response? (Optional)
          </p>
          <AuthenticityTags 
            selectedTags={selectedTags}
            onTagSelect={handleTagSelect}
            disabled={isAnswered}
          />
        </div>
      )}
      
      {/* Non-judgmental Encouragement */}
      {/* <div className="mt-4 text-xs text-center text-gray-400 italic">
        There are no right or wrong answers. We're here to understand you better.
      </div> */}

      <div className="mt-2 flex justify-end">
        <PrivacyIndicator className="" />
      </div>
    </motion.div>
  );
}

export default QuestionCard;