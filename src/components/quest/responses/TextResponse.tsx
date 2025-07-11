// import React, { useState, useEffect, useRef } from 'react';
// import { motion } from 'framer-motion';
// import { TextResponseProps } from './types';

// /**
//  * Text input response component
//  * Allows free-form text input for open-ended questions
//  */
// export function TextResponse({
//   question,
//   onResponse,
//   isActive = true,
//   isAnswered = false,
//   previousResponse = '',
//   placeholder = 'Text like you text a friend. Be as honest as you want to be.',
//   minLength = 0,
//   maxLength = 1000,
//   showCharacterCount = true,
//   autoFocus = true,
//   className = ''
// }: TextResponseProps) {
//   // Response state
//   const [response, setResponse] = useState<string>(previousResponse);
//   const [isFocused, setIsFocused] = useState<boolean>(false);
  
//   // Ref for the textarea
//   const textareaRef = useRef<HTMLTextAreaElement>(null);
  
//   // Focus the textarea on mount if autoFocus is true
//   useEffect(() => {
//     if (autoFocus && textareaRef.current && isActive && !isAnswered) {
//       textareaRef.current.focus();
//     }
//   }, [autoFocus, isActive, isAnswered]);
  
//   // Handle text change
//   const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
//     if (!isActive || isAnswered) return;
    
//     const newValue = e.target.value;
//     if (maxLength && newValue.length > maxLength) return;
    
//     setResponse(newValue);
//   };
  
//   // Handle submission
//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
    
//     if (!isActive || isAnswered || !response.trim() || (minLength > 0 && response.length < minLength)) {
//       return;
//     }
    
//     onResponse(response);
//   };
  
//   // Calculate character count and validity
//   const characterCount = response.length;
//   const isValid = characterCount >= minLength && characterCount <= maxLength;
//   const isEmpty = characterCount === 0;
  
//   return (
//     <form onSubmit={handleSubmit} className={`text-response ${className}`}>
//       <div className="relative">
//         <motion.textarea
//           ref={textareaRef}
//           value={response}
//           onChange={handleChange}
//           onFocus={() => setIsFocused(true)}
//           onBlur={() => setIsFocused(false)}
//           placeholder={placeholder}
//           disabled={!isActive || isAnswered}
//           initial={{ opacity: 0, y: 10 }}
//           animate={{ opacity: 1, y: 0 }}
//           className={`
//             w-full p-4 border rounded-lg transition-all resize-y min-h-[120px]
//             ${isFocused ? 'border-terracotta ring-1 ring-terracotta/20' : 'border-gray-200'}
//             ${!isActive || isAnswered ? 'bg-gray-50 opacity-90 cursor-default' : ''}
//             focus:outline-none
//           `}
//         />
        
//         {/* Character count */}
//         {showCharacterCount && (
//           <div className={`
//             absolute bottom-2 right-3 text-xs transition-opacity
//             ${isEmpty ? 'opacity-0' : 'opacity-100'}
//             ${isValid ? 'text-gray-400' : 'text-red-500'}
//           `}>
//             {characterCount}/{maxLength}
//           </div>
//         )}
//       </div>
      
//       {/* Submission button */}
//       {isActive && !isAnswered && (
//         <motion.button
//           type="submit"
//           disabled={!isValid || isEmpty}
//           initial={{ opacity: 0, y: 10 }}
//           animate={{ opacity: 1, y: 0 }}
//           whileHover={{ scale: 1.02 }}
//           whileTap={{ scale: 0.98 }}
//           className={`
//             mt-3 px-4 py-2 rounded-lg transition-all
//             ${isValid && !isEmpty 
//               ? 'bg-terracotta text-white hover:bg-terracotta/90' 
//               : 'bg-gray-200 text-gray-500 cursor-not-allowed'
//             }
//           `}
//         >
//           Submit
//         </motion.button>
//       )}
//     </form>
//   );
// }

// export default TextResponse;


import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { TextResponseProps } from './types';
import { getWordValidationStatus, getWordValidationMessage } from '../utils/questValidation';

/**
 * Text input response component
 * Allows free-form text input for open-ended questions
 */
export function TextResponse({
  question,
  onResponse,
  isActive = true,
  isAnswered = false,
  previousResponse = '',
  placeholder = 'Text like you text a friend. Be as honest as you want to be.',
  minLength = 0,
  maxLength = 1000,
  showCharacterCount = true,
  autoFocus = true,
  className = '',
  // NEW: Word count props
  maxWords = 100,
  showWordCount = true,
  wordWarningThreshold = 90
}: TextResponseProps) {
  // Response state
  const [response, setResponse] = useState<string>(previousResponse);
  const [isFocused, setIsFocused] = useState<boolean>(false);
  
  // Ref for the textarea
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  // Focus the textarea on mount if autoFocus is true
  useEffect(() => {
    if (autoFocus && textareaRef.current && isActive && !isAnswered) {
      textareaRef.current.focus();
    }
  }, [autoFocus, isActive, isAnswered]);
  
  // Handle text change
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (!isActive || isAnswered) return;
    
    const newValue = e.target.value;
    if (maxLength && newValue.length > maxLength) return;
    
    setResponse(newValue);
  };
  
  // Handle submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isActive || isAnswered || !response.trim() || (minLength > 0 && response.length < minLength)) {
      return;
    }
    
    // NEW: Check word count validation
    const wordValidation = getWordValidationStatus(response, maxWords, wordWarningThreshold);
    if (!wordValidation.isValid) {
      return; // Prevent submission if over word limit
    }
    
    onResponse(response);
  };
  
  // Calculate character count and validity
  const characterCount = response.length;
  const isCharacterValid = characterCount >= minLength && characterCount <= maxLength;
  const isEmpty = characterCount === 0;
  
  // NEW: Word count validation
  const wordValidation = getWordValidationStatus(response, maxWords, wordWarningThreshold);
  const wordMessage = getWordValidationMessage(response, maxWords, wordWarningThreshold);
  
  // Overall validity (both character and word limits)
  const isValid = isCharacterValid && wordValidation.isValid;
  
  return (
    <form onSubmit={handleSubmit} className={`text-response ${className}`}>
      <div className="relative">
        <motion.textarea
          ref={textareaRef}
          value={response}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          disabled={!isActive || isAnswered}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`
            w-full p-4 border rounded-lg transition-all resize-y min-h-[120px]
            ${isFocused ? 'border-terracotta ring-1 ring-terracotta/20' : 'border-gray-200'}
            ${!isActive || isAnswered ? 'bg-gray-50 opacity-90 cursor-default' : ''}
            ${wordValidation.status === 'error' ? 'border-red-300 ring-1 ring-red-200' : ''}
            focus:outline-none
          `}
        />
        
        {/* NEW: Enhanced counter display */}
        {(showCharacterCount || showWordCount) && !isEmpty && (
          <div className="absolute bottom-2 right-3 text-xs space-y-1">
            {/* Character count */}
            {showCharacterCount && (
              <div className={`transition-opacity ${
                isCharacterValid ? 'text-gray-400' : 'text-red-500'
              }`}>
                {characterCount}/{maxLength}
              </div>
            )}
            
            {/* Word count */}
            {showWordCount && (
              <div className={`transition-opacity ${
                wordValidation.status === 'valid' ? 'text-gray-400' :
                wordValidation.status === 'warning' ? 'text-amber-500' :
                'text-red-500'
              }`}>
                {wordValidation.wordCount}/{maxWords} words
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* NEW: Word validation message */}
      {wordMessage && (
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className={`mt-2 text-xs ${
            wordValidation.status === 'warning' ? 'text-amber-600' : 'text-red-600'
          }`}
        >
          {wordMessage}
        </motion.div>
      )}
      
      {/* Submission button */}
      {isActive && !isAnswered && (
        <motion.button
          type="submit"
          disabled={!isValid || isEmpty}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`
            mt-3 px-4 py-2 rounded-lg transition-all
            ${isValid && !isEmpty 
              ? 'bg-terracotta text-white hover:bg-terracotta/90' 
              : 'bg-gray-200 text-gray-500 cursor-not-allowed'
            }
          `}
        >
          Submit
        </motion.button>
      )}
    </form>
  );
}

export default TextResponse;