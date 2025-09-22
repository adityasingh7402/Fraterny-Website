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
import { googleAnalytics } from '../../../services/analytics/googleAnalytics';
import { useAuth } from '../../../contexts/AuthContext';
import { CityAutocomplete } from '../responses/CityAutocomplete';
import { useQuestionTiming } from '../hooks/useQuestionTiming';
import { X, Info  } from 'lucide-react';

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
  
  //const [response, setResponse] = useState<string>(previousResponse?.response || '');
  // const [selectedTags, setSelectedTags] = useState<HonestyTag[]>(previousResponse?.tags || []);
  const [showFlexibleOptions, setShowFlexibleOptions] = useState(false);
  const [currentSelection, setCurrentSelection] = useState<string>(previousResponse?.response || '');
  const { trackQuestionView, stopQuestionTracking, session, allQuestions, sections } = useQuest();
  const [showInfo, setShowInfo] = useState(false);

   useQuestionTiming(question.id);
  const { user } = useAuth(); // Add this line
  //const [selectedCity, setSelectedCity] = useState<string>('');

// Parse previous response to separate city and text OR handle ranking data
const [response, setResponse] = useState<string>(() => {
  if (previousResponse?.response) {
    // For ranking questions, pass the full JSON response
    if (question.type === 'ranking') {
      console.log('🔄 Restoring ranking response:', previousResponse.response);
      return previousResponse.response;
    }
    
    // For text questions with city data
    try {
      // Try to parse as JSON with proper field mapping
      const parsed = JSON.parse(previousResponse.response);
      console.log('🔄 Restoring parsed response:', parsed);
      
      
      // Determine field name based on question type
      let fieldValue = '';
      if (question.id === 'q1_1') {
        fieldValue = parsed.name || '';
      } else if (question.id === 'q1_2') {
        fieldValue = parsed.email || '';
      } else if (question.id === 'q1_3') {        
        fieldValue = String(parsed) ?? '';
      } else if (question.id === 'q1_5') {
        fieldValue = parsed.details || '';
      } else {
        fieldValue = parsed.details || '';
      }
      
      return fieldValue;
    } catch {
      return previousResponse.response;
    }
  }
  return '';
});

  const [isAnonymousMode, setIsAnonymousMode] = useState<boolean>(() => {
  if (previousResponse?.response) {
    try {
      // Try to parse as JSON to check anonymous state
      const parsed = JSON.parse(previousResponse.response);
      if (parsed.hasOwnProperty('isAnonymous')) {
        return parsed.isAnonymous;
      }
      // FALLBACK: If no isAnonymous field but selectedCity exists, user chose to share
      if (parsed.selectedCity) {
        return false; // Not anonymous
      }
    } catch {
      // If not JSON, check if there's any response content
      if (previousResponse.response.trim()) {
        return false; // User provided some answer, so not anonymous
      }
    }
  }
  // DEFAULT CHANGED: start in non-anonymous mode
  return false;
});


  const [selectedCity, setSelectedCity] = useState<string>(() => {
    if (previousResponse?.response) {
      try {
        // Try to parse as JSON to get city
        const parsed = JSON.parse(previousResponse.response);
        return parsed.selectedCity || '';
      } catch {
        // If not JSON, no previous city selected
        return '';
      }
    }
    return '';
  });
  // Remember previous text when switching to anonymous
const [previousText, setPreviousText] = useState<string>('');

  // Handle data when switching anonymous mode
useEffect(() => {
  if (isAnonymousMode) {
    // For name/email questions: save and clear text
    if (response && !question.enableCityAutocomplete) {
      setPreviousText(response);
      setResponse('');
      console.log('🧹 Saved and cleared text due to anonymous mode toggle (name/email)');
    }
    // For location questions: clear city but keep details text
    if (selectedCity) {
      setSelectedCity('');
      console.log('🧹 Cleared city data due to anonymous mode toggle');
    }
    
    // AUTO-SAVE: Immediately save anonymous response when toggling to anonymous
    if (question.allowAnonymous) {
      const getFieldName = () => {
        if (question.id === 'q1_1') return 'name';
        if (question.id === 'q1_2') return 'email';
        if (question.id === 'q1_3') return 'age';
        if (question.id === 'q1_5') return 'details';
        return 'details';
      };
      
      const fieldName = getFieldName();
      const fieldValue = question.enableCityAutocomplete ? response : ""; // Keep details for location, clear for name/email
      console.log('🚀 Auto-saving due to anonymous mode toggle:', fieldValue);
      
      
      const anonymousResponse = JSON.stringify({
        isAnonymous: true,
        selectedCity: "",
        [fieldName]: fieldValue
      });
      
      console.log('🔄 Auto-saving anonymous response:', anonymousResponse);
      onResponse(anonymousResponse, selectedTags);
    }
  } else {
    // Restore previous text when switching back to share mode
    if (previousText && !question.enableCityAutocomplete) {
      setResponse(previousText);
      console.log('🔄 Restored previous text when switching to share mode');
    }
  }
}, [isAnonymousMode]);
  

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
  if (question?.type === 'date_input') {
    console.log('📅 Date response stored:', response);
  }
}, [response, question?.id]);

useEffect(() => {
    if (question?.id && isActive) {
      // Existing internal tracking
      trackQuestionView(question.id);
      
      // NEW: GA4 tracking
      const userState = user ? 'logged_in' : 'anonymous';
      const sessionId = session?.id || `temp_${Date.now()}`;
      
      // Calculate question indices safely
      const questionIndex = allQuestions?.findIndex(q => q.id === question.id) + 1 || 1;
      const sectionQuestions = sections?.find(s => s.id === question.sectionId)?.questions || [];
      const sectionQuestionIndex = sectionQuestions.findIndex(q => q.id === question.id) + 1 || 1;
      
      // Only track if we have required data
      if (question.sectionId && question.sectionId.trim() !== '') {
        googleAnalytics.trackQuestionView({
          session_id: sessionId,
          question_id: question.id,
          section_id: question.sectionId,
          user_state: userState,
          question_index: questionIndex,
          section_question_index: sectionQuestionIndex
        });
      }
    }
  }, [question?.id, isActive, session?.id, user, allQuestions, sections]);


// Clear city data when switching to anonymous mode
useEffect(() => {
  if (isAnonymousMode && selectedCity) {
    setSelectedCity('');
  }
}, [isAnonymousMode]);


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

//   const handleSubmit = (submittedResponse: string) => {
//   if (!isActive) return;
//   console.log('🚀 handleSubmit called with:', submittedResponse);
  
//   // Combine city and text response for location questions
//   // let finalResponse = submittedResponse;
//   // if (question.enableCityAutocomplete && selectedCity) {
//   //   finalResponse = JSON.stringify({
//   //     selectedCity: selectedCity,
//   //     details: submittedResponse
//   //   });
//   //   console.log('📦 SAVING city+text as:', finalResponse);
//   // } else {
//   //   console.log('📝 SAVING text only as:', finalResponse);
//   // }

//   // Combine city and text response for location questions
// let finalResponse = submittedResponse;
// if (question.allowAnonymous) {
//   if (isAnonymousMode) {
//     finalResponse = JSON.stringify({
//       isAnonymous: true,
//       selectedCity: "",
//       details: submittedResponse || 'User chose to remain anonymous'
//     });
//     console.log('📦 SAVING anonymous response as:', finalResponse);
//   } else if (question.enableCityAutocomplete && selectedCity) {
//     finalResponse = JSON.stringify({
//       selectedCity: selectedCity,
//       details: submittedResponse,
//       isAnonymous: false
//     });
//     console.log('📦 SAVING city+text as:', finalResponse);
//   } else {
//     finalResponse = JSON.stringify({
//       details: submittedResponse,
//       isAnonymous: false
//     });
//     console.log('📦 SAVING text-only (not anonymous) as:', finalResponse);
//   }
// } else if (question.enableCityAutocomplete && selectedCity) {
//   finalResponse = JSON.stringify({
//     selectedCity: selectedCity,
//     details: submittedResponse
//   });
//   console.log('📦 SAVING city+text as:', finalResponse);
// } else {
//   console.log('📝 SAVING text only as:', finalResponse);
// }
  
//   // Call the onResponse callback with the response and tags
//   onResponse(finalResponse, selectedTags);
// };
  
//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//     // console.log('🎯 handleInputChange received:', e.target.value, 'for question:', question?.type);
//   const newValue = e.target.value;
  
//   // Allow pasting but truncate if too long
//   if (question.type === 'text_input' && maxLength && newValue.length > maxLength) {
//     setResponse(newValue.substring(0, maxLength));
//     return;
//   }
  
//   setResponse(newValue);
//   // console.log('📝 Set response to:', newValue);
  
//   // AUTO-SAVE: Call onResponse immediately for auto-save
//   // onResponse(newValue, selectedTags);
// };
  
const handleSubmit = (submittedResponse: string) => {
  if (!isActive) return;
  console.log('🚀 handleSubmit called with:', submittedResponse);
  
  // Determine field name based on question type
  const getFieldName = () => {
    if (question.id === 'q1_1') return 'name';
    if (question.id === 'q1_2') return 'email';
    if (question.id === 'q1_3') return 'age';
    if (question.id === 'q1_5') return 'details';
    return 'details'; // fallback
  };
  
  const fieldName = getFieldName();
  
  // Handle different question types with anonymous support
  let finalResponse = submittedResponse;
  
  if (question.allowAnonymous) {
    if (isAnonymousMode) {
      // Save as anonymous response
      finalResponse = JSON.stringify({
        isAnonymous: true,
        selectedCity: "",
        [fieldName]: ""
      });
      console.log('📦 SAVING anonymous response as:', finalResponse);
    } else if (question.enableCityAutocomplete && selectedCity) {
      // Location question with city
      finalResponse = JSON.stringify({
        selectedCity: selectedCity,
        [fieldName]: submittedResponse,
        isAnonymous: false
      });
      console.log('📦 SAVING city+text as:', finalResponse);
    } else {
      // Name/email questions
      finalResponse = JSON.stringify({
        selectedCity: "",
        [fieldName]: submittedResponse,
        isAnonymous: false
      });
      console.log('📦 SAVING name/email response as:', finalResponse);
    }
  } else if (question.enableCityAutocomplete && selectedCity) {
    // Regular city autocomplete without anonymous mode
    finalResponse = JSON.stringify({
      selectedCity: selectedCity,
      [fieldName]: submittedResponse
    });
    console.log('📦 SAVING city+text as:', finalResponse);
  } else {
    // Regular questions without anonymous mode
    console.log('📝 SAVING text only as:', finalResponse);
  }
  
  // Call the onResponse callback with the response and tags
  onResponse(finalResponse, selectedTags);
};

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
  const newValue = e.target.value;
  
  if (question.type === 'text_input' && maxLength && newValue.length > maxLength) {
    setResponse(newValue.substring(0, maxLength));
    return;
  }
  
  setResponse(newValue);
};


  const handleFormSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  // console.log('📋 Form submitted!');
  // console.log('📋 response (text):', response);
  // console.log('📋 selectedCity at submit:', selectedCity);
  
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
            {question.options?.map((option, index) => {
          const isSelected = currentSelection === option;
          
          return (
            <motion.button
              key={index}
              onClick={() => {
                setCurrentSelection(option);
                handleSubmit(option);
              }}
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

              {question.enableCityAutocomplete && question.allowAnonymous && (
                <div className="mb-4">
                  {/* <label>Primary City</label> */}
                  <div className="relative">
                    <CityAutocomplete
                      onCitySelect={(city) => {
                        console.log('🏙️ City selected:', city);
                        setSelectedCity(city);
                      }}
                      placeholder="Start typing..."
                      selectedCity={selectedCity}
                      isAnonymousMode={isAnonymousMode}
                      //onToggleAnonymous={() => setIsAnonymousMode(!isAnonymousMode)}
                    />
                    <motion.div 
                      className="absolute bottom-3 right-3 flex items-center gap-2"
                    >
                      <motion.button
                        type="button"
                        onClick={() => setIsAnonymousMode(!isAnonymousMode)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                          isAnonymousMode ? 'bg-gray-950' : 'bg-gray-300'
                        }`}
                        data-anonymous-mode={isAnonymousMode}
                        animate={{ backgroundColor: isAnonymousMode ? '#374151' : '#D1D5DB' }}
                        transition={{ duration: 0.2 }}
                      >
                        <motion.span
                          className="inline-block h-4 w-4 transform rounded-full bg-white shadow"
                          animate={{ x: isAnonymousMode ? 22 : 2 }}
                          transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        />
                      </motion.button>
                    </motion.div>
                  </div>
                </div>
              )}

              <form onSubmit={handleFormSubmit}>
                <div className="relative mb-[-15px]">
                  <textarea
                    value={response}
                    onChange={handleInputChange}
                    placeholder={
                      question.allowAnonymous && !question.enableCityAutocomplete
                        ? (isAnonymousMode ? "Anonymous mode" : question.placeholder)
                        : (question.placeholder || "Be as honest as you want to be for the best analysis")
                    }
                    className={`p-3 bg-white rounded-lg border border-zinc-400 resize-y w-full h-52 justify-start text-black text-xl font-normal font-['Gilroy-Medium'] ${
                      textValidation?.wordStatus === 'error' 
                        ? '' 
                        : 'border-gray-200'
                    }`}
                    disabled={!isActive || isAnswered || (question.allowAnonymous && !question.enableCityAutocomplete && isAnonymousMode)}
                  />

                  {question.allowAnonymous && !question.enableCityAutocomplete && (
                    <motion.div 
                      className="absolute bottom-3 right-3 flex items-center gap-2"
                    >
                      <motion.button
                        type="button"
                        onClick={() => setIsAnonymousMode(!isAnonymousMode)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                          isAnonymousMode ? 'bg-blue-500' : 'bg-gray-300'
                        }`}
                        data-anonymous-mode={isAnonymousMode}
                        animate={{ backgroundColor: isAnonymousMode ? '#374151' : '#D1D5DB' }}
                        transition={{ duration: 0.2 }}
                      >
                        <motion.span
                          className="inline-block h-4 w-4 transform rounded-full bg-white shadow"
                          animate={{ x: isAnonymousMode ? 22 : 2 }}
                          transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        />
                      </motion.button>
                      {/* <span className="text-xs text-gray-600">
                        {isAnonymousMode ? 'Anonymous' : 'Share'}
                      </span> */}
                    </motion.div>
                  )}
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
        <div className="justify-start text-neutral-950 text-2xl font-normal font-['Gilroy-Bold']">
          {question.text}
          {question.isInfo && (
          <Info className="inline w-4 h-4 ml-2 text-black cursor-pointer" 
            onClick={() => setShowInfo(true)} />
          )}
        </div>
      </div>
      
      
      {/* Question Input */}
      {renderQuestionInput()}

      
  
      {/* Info Modal */}
      {showInfo && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowInfo(false)} // Add this - closes on backdrop click
        >
          <div 
            className="bg-white rounded-lg max-w-sm w-full p-6 relative"
            onClick={(e) => e.stopPropagation()} // Add this - prevents closing when clicking inside modal
          >
            {/* Close Button */}
            <button 
              onClick={() => setShowInfo(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
            
            {/* Content */}
            <div className="">
              {/* <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Question Purpose
              </h3> */}
              <p className="text-gray-600 text-sm leading-relaxed">
                {question.infoText || "This question helps us better understand your personality and provide more accurate insights."}
              </p>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}

export default QuestionCard;