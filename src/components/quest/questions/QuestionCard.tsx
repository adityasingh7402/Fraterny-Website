// import React, { useState } from 'react';
// import { motion } from 'framer-motion';
// import { useQuestAnimation } from '../animations/useQuestAnimation';
// import { QuestionCardProps } from './types';
// import { HonestyTag } from '../core/types';
// import { PrivacyIndicator } from '../trust-elements/PrivacyIndicator';
// import { AuthenticityTags } from '../trust-elements/AuthenticityTags';
// import { DateResponse } from '../responses/DateResponse';
// import { RankingResponse } from '../responses/RankingResponse';

// /**
//  * Base question card component
//  * Renders a question with appropriate input type and honesty tags
//  */
// export function QuestionCard({
//   question,
//   onResponse,
//   isActive = true,
//   isAnswered = false,
//   previousResponse,
//   showTags = true,
//   className = ''
// }: QuestionCardProps) {
//   // State for the current response
//   const [response, setResponse] = useState<string>(previousResponse?.response || '');
//   const [selectedTags, setSelectedTags] = useState<HonestyTag[]>(previousResponse?.tags || []);
//   const [showFlexibleOptions, setShowFlexibleOptions] = useState(false);
  
//   // Animation
//   const { ref, controls, variants } = useQuestAnimation({
//     variant: 'questionCard',
//     triggerOnce: true
//   });
  
//   // Handle tag selection
//   const handleTagSelect = (tag: HonestyTag) => {
//     setSelectedTags(prev => {
//       // If tag is already selected, remove it
//       if (prev.includes(tag)) {
//         return prev.filter(t => t !== tag);
//       }
//       // Otherwise, add it
//       return [...prev, tag];
//     });
//   };
  
//   // Handle flexible response toggle
//   const handleFlexibleResponseToggle = () => {
//     setShowFlexibleOptions(!showFlexibleOptions);
//   };
  
//   // Flexible response options
//   const flexibleResponses = [
//     "I don't know",
//     "I'm not sure but...",
//     "I don't want to answer this question"
//   ];
  
//   // Handle response submission
//   const handleSubmit = (submittedResponse: string) => {
//     if (!isActive) return;
    
//     // Call the onResponse callback with the response and tags
//     onResponse(submittedResponse, selectedTags);
//   };
  
//   // Handle text input change
//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//     setResponse(e.target.value);
//   };
  
//   // Handle form submission
//   const handleFormSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (response.trim()) {
//       handleSubmit(response);
//     }
//   };
  
//   // Render different input types based on question type
//   const renderQuestionInput = () => {
//     switch (question.type) {
//       case 'multiple_choice':
//         return (
//           <div className="space-y-3 mb-6">
//             {question.options?.map((option: any, index: any) => (
//               <motion.button
//                 key={index}
//                 onClick={() => handleSubmit(option)}
//                 whileHover={{ scale: 1.02, backgroundColor: 'rgba(224, 122, 95, 0.03)' }}
//                 whileTap={{ scale: 0.98 }}
//                 className={`w-full p-3 text-left border rounded-lg transition-all ${
//                   previousResponse?.response === option
//                     ? 'border-terracotta bg-terracotta/5'
//                     : 'border-gray-200 hover:border-terracotta/50'
//                 }`}
//                 disabled={!isActive || isAnswered}
//               >
//                 {option}
//               </motion.button>
//             ))}
//           </div>
//         );
        
//       case 'text_input':
//         return (
//           <form onSubmit={handleFormSubmit} className="mb-6">
//             <textarea
//               value={response}
//               onChange={handleInputChange}
//               placeholder="Be as honest as you want to be for the best analysis"
//               className="w-full p-3 border border-gray-200 rounded-lg focus:border-terracotta focus:ring-1 focus:ring-terracotta/20 transition-all min-h-[100px] resize-y"
//               disabled={!isActive || isAnswered}
//             />
//             {isActive && !isAnswered && (
//               <motion.button
//                 type="submit"
//                 whileHover={{ scale: 1.02 }}
//                 whileTap={{ scale: 0.98 }}
//                 className="mt-3 px-4 py-2 bg-terracotta text-white rounded-lg hover:bg-terracotta/90 transition-colors"
//                 disabled={!response.trim()}
//               >
//                 Submit
//               </motion.button>
//             )}
//           </form>
//         );
        
//       case 'scale_rating':
//         return (
//           <div className="mb-6">
//             <div className="flex justify-between mb-2">
//               <span className="text-sm text-gray-500">
//                 {question.minScale || 1}
//               </span>
//               <span className="text-sm text-gray-500">
//                 {question.maxScale || 10}
//               </span>
//             </div>
//             <input
//               type="range"
//               min={question.minScale || 1}
//               max={question.maxScale || 10}
//               value={response || (question.minScale || 1)}
//               onChange={handleInputChange}
//               className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-terracotta"
//               disabled={!isActive || isAnswered}
//             />
//             {isActive && !isAnswered && (
//               <motion.button
//                 onClick={() => handleSubmit(response)}
//                 whileHover={{ scale: 1.02 }}
//                 whileTap={{ scale: 0.98 }}
//                 className="mt-3 px-4 py-2 bg-terracotta text-white rounded-lg hover:bg-terracotta/90 transition-colors"
//               >
//                 Submit
//               </motion.button>
//             )}
//           </div>
//         );
        
//       case 'date_input':
//         return (
//           <DateResponse
//             value={response}
//             onChange={handleInputChange}
//             onSubmit={handleSubmit}
//             disabled={!isActive || isAnswered}
//             className="mb-6"
//           />
//         );
      
//       case 'ranking':
//         return (
//           <RankingResponse
//             options={question.options || []}
//             value={response}
//             onChange={handleInputChange}
//             onSubmit={handleSubmit}
//             disabled={!isActive || isAnswered}
//             className="mb-6"
//           />
//         );
      
//         default:
//         return (
//           <div className="mb-6 text-gray-500 italic">
//             This question type is not supported yet.
//           </div>
//         );
//     }
//   };
  
//   return (
//     <motion.div
//       ref={ref}
//       variants={variants}
//       initial="hidden"
//       animate={controls}
//       className={`question-card bg-white rounded-lg shadow-sm border border-gray-200 p-6 ${className}`}
//     >
//       {/* Privacy Reassurance */}
//       {/* <PrivacyIndicator className="mb-4" /> */}
      
      
//       {/* Question Text */}
//       <div className="mb-6">
//         <h3 className="text-xl text-navy mb-3">{question.text}</h3>
//         {/* <p className="text-sm text-gray-600 italic">
//           Text like you text a friend. Be as honest as you want to be.
//         </p> */}
//       </div>
      
//       {/* Question Input */}
//       {renderQuestionInput()}
      
//       {/* Flexible Response Options */}
//       {question.type === 'text_input' && isActive && !isAnswered && (
//         <div className="mb-6">
//           <button
//             onClick={handleFlexibleResponseToggle}
//             className="text-sm text-gray-500 hover:text-terracotta transition-colors"
//           >
//             {showFlexibleOptions ? 'Hide options' : 'Not sure? Click for options'}
//           </button>
          
//           {showFlexibleOptions && (
//             <motion.div
//               initial={{ height: 0, opacity: 0 }}
//               animate={{ 
//                 height: 'auto', 
//                 opacity: 1,
//                 transition: { duration: 0.3 }
//               }}
//               className="mt-3 space-y-2 overflow-hidden"
//             >
//               {flexibleResponses.map((flexResponse, index) => (
//                 <motion.button
//                   key={index}
//                   onClick={() => handleSubmit(flexResponse)}
//                   whileHover={{
//                     scale: 1.01,
//                     backgroundColor: 'rgba(156, 163, 175, 0.1)'
//                   }}
//                   className="block w-full p-2 text-left text-sm text-gray-600 border border-gray-100 rounded hover:border-gray-300 transition-all"
//                 >
//                   {flexResponse}
//                 </motion.button>
//               ))}
//             </motion.div>
//           )}
//         </div>
//       )}
      
//       {/* Self-Awareness Tags */}
//       {showTags && (isActive || (isAnswered && selectedTags.length > 0)) && (
//         <div className="border-t border-gray-100 pt-4">
//           <p className="text-xs text-gray-500 mb-3">
//             How would you describe your response? (Optional)
//           </p>
//           <AuthenticityTags 
//             selectedTags={selectedTags}
//             onTagSelect={handleTagSelect}
//             disabled={isAnswered}
//           />
//         </div>
//       )}
      
//       {/* Non-judgmental Encouragement */}
//       {/* <div className="mt-4 text-xs text-center text-gray-400 italic">
//         There are no right or wrong answers. We're here to understand you better.
//       </div> */}

//       <div className="mt-2 flex justify-end">
//         <PrivacyIndicator className="" />
//       </div>
//     </motion.div>
//   );
// }

// export default QuestionCard;

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuestAnimation } from '../animations/useQuestAnimation';
import { QuestionCardProps } from './types';
import { HonestyTag } from '../core/types';
import { PrivacyIndicator } from '../trust-elements/PrivacyIndicator';
import { AuthenticityTags } from '../trust-elements/AuthenticityTags';
import { DateResponse } from '../responses/DateResponse';
import { RankingResponse } from '../responses/RankingResponse';
import { getWordValidationStatus, getWordValidationMessage } from '../utils/questValidation';

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
  
  // NEW: Word count configuration for text inputs
  const maxWords = 100;
  const wordWarningThreshold = 90;
  const maxLength = 1000; // Character limit
  
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


    const handleSubmit = (submittedResponse: string) => {
    if (!isActive) return;
    
    // Call the onResponse callback with the response and tags (no validation blocking)
    onResponse(submittedResponse, selectedTags);
  };
  
  // Handle response submission
  // const handleSubmit = (submittedResponse: string) => {
  //   if (!isActive) return;
    
  //   // NEW: For text inputs, check word count validation
  //   if (question.type === 'text_input') {
  //     const wordValidation = getWordValidationStatus(submittedResponse, maxWords, wordWarningThreshold);
  //     if (!wordValidation.isValid) {
  //       return; // Prevent submission if over word limit
  //     }
  //   }
    
  //   // Call the onResponse callback with the response and tags
  //   onResponse(submittedResponse, selectedTags);
  // };
  
  // const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
  //   const newValue = e.target.value;
    
  //   // Allow pasting but truncate if too long
  //   if (question.type === 'text_input' && maxLength && newValue.length > maxLength) {
  //     setResponse(newValue.substring(0, maxLength));
  //     return;
  //   }
    
  //   setResponse(newValue);
  // };
  
  // Handle form submission
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
  const newValue = e.target.value;
  
  // Allow pasting but truncate if too long
  if (question.type === 'text_input' && maxLength && newValue.length > maxLength) {
    setResponse(newValue.substring(0, maxLength));
    return;
  }
  
  setResponse(newValue);
  
  // AUTO-SAVE: Call onResponse immediately for auto-save
  // onResponse(newValue, selectedTags);
};
  
  
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (response.trim()) {
      
      handleSubmit(response);
    }
  };
  
  // NEW: Calculate validation status for text inputs
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
        // NEW: Enhanced text input with word counting
        // const textValidation = getTextInputValidation();
        
        // return (
        //   <div className="mb-6">
        //     <form onSubmit={handleFormSubmit}>
        //       <div className="relative">
        //         <textarea
        //           value={response}
        //           onChange={handleInputChange}
        //           placeholder="Be as honest as you want to be for the best analysis"
        //           className={`w-full p-3 border rounded-lg focus:ring-1 transition-all min-h-[100px] resize-y focus:outline-none ${
        //             textValidation?.wordStatus === 'error' 
        //               ? 'border-red-300 focus:border-red-400 focus:ring-red-200' 
        //               : 'border-gray-200 focus:border-terracotta focus:ring-terracotta/20'
        //           }`}
        //           disabled={!isActive || isAnswered}
        //         />
                
        //         {/* NEW: Counter display */}
        //         {/* {textValidation && !textValidation.isEmpty && (
        //           <div className="absolute bottom-2 right-3 text-xs space-y-1 text-right">
                    
        //             <div className={`${
        //               textValidation.characterCount <= maxLength ? 'text-gray-400' : 'text-red-500'
        //             }`}>
        //               {textValidation.characterCount}/{maxLength}
        //             </div>
                    
                  
        //             <div className={`${
        //               textValidation.wordStatus === 'valid' ? 'text-gray-400' :
        //               textValidation.wordStatus === 'warning' ? 'text-amber-500' :
        //               'text-red-500'
        //             }`}>
        //               {textValidation.wordCount}/{maxWords} words
        //             </div>
        //           </div>
        //         )} */}
        //       </div>
              
        //       {/* NEW: Word validation message */}
        //       {textValidation?.wordMessage && (
        //         <motion.div
        //           initial={{ opacity: 0, y: -5 }}
        //           animate={{ opacity: 1, y: 0 }}
        //           className={`mt-2 text-xs ${
        //             textValidation.wordStatus === 'warning' ? 'text-amber-600' : 'text-red-600'
        //           }`}
        //         >
        //           {textValidation.wordMessage}
        //         </motion.div>
        //       )}
              
        //       {isActive && !isAnswered && (
        //         <motion.button
        //           type="submit"
        //           whileHover={{ scale: 1.02 }}
        //           whileTap={{ scale: 0.98 }}
        //           className={`mt-3 px-4 py-2 rounded-lg transition-colors ${
        //             textValidation?.isValid
        //               ? 'bg-terracotta text-white hover:bg-terracotta/90'
        //               : 'bg-gray-200 text-gray-500 cursor-not-allowed'
        //           }`}
        //           disabled={!textValidation?.isValid}
        //         >
        //           Submit
        //         </motion.button>
        //       )}
        //     </form>
        //   </div>
        // );
          const textValidation = getTextInputValidation();
          
  
          return (
            <div className="mb-6">
              <form onSubmit={handleFormSubmit}>
                <div className="relative">
                  <textarea
                    value={response}
                    onChange={handleInputChange}
                    placeholder={question.placeholder || "Be as honest as you want to be for the best analysis"}
                    
                    className={`p-3 bg-white rounded-lg border border-zinc-400 resize-y w-full h-52 justify-start text-zinc-400 text-xl font-normal font-['Gilroy-Medium'] ${
                      textValidation?.wordStatus === 'error' 
                        ? 'border-red-300 focus:border-red-400 focus:ring-red-200' 
                        : 'border-gray-200 focus:border-terracotta focus:ring-terracotta/20'
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
                
                {question.allowTags && showTags && (isActive || (isAnswered && selectedTags.length > 0)) && (
                  <div className="mt-4 mb-3">
                    <AuthenticityTags 
                      selectedTags={selectedTags}
                      onTagSelect={handleTagSelect}
                      disabled={isAnswered}
                    />
                    {/* <p className="text-xs text-black mt-2">
                      How would you describe your response?
                    </p> */}
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
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-terracotta"
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

      
      
      {/* Flexible Response Options */}
      {/* {question.type === 'text_input' && isActive && !isAnswered && (
        <div className="mb-6">
          <button
            onClick={handleFlexibleResponseToggle}
            className="text-sm text-gray-900 hover:text-terracotta transition-colors"
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
      )} */}
      
      {/* Self-Awareness Tags */}
      {/* {showTags && (isActive || (isAnswered && selectedTags.length > 0)) && (
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
      )} */}

      {/* <div className="mt-2 flex justify-end">
        <PrivacyIndicator className="" />
      </div> */}
    </motion.div>
  );
}

export default QuestionCard;