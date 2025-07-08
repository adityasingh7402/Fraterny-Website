import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface QuestInputFieldProps {
  label?: string;
  type?: 'text' | 'email' | 'password' | 'number' | 'tel';
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  helperText?: string;
  disabled?: boolean;
  required?: boolean;
  autoFocus?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  name?: string;
  className?: string;
}

/**
 * Quest-specific input field component
 * Styled consistently with the assessment design system
 */
export function QuestInputField({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  helperText,
  disabled = false,
  required = false,
  autoFocus = false,
  icon,
  iconPosition = 'left',
  name,
  className = ''
}: QuestInputFieldProps) {
  // State for input focus
  const [isFocused, setIsFocused] = useState(false);
  
  // Handle focus change
  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);
  
  // Handle value change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };
  
  return (
    <div className={`quest-input-field ${className}`}>
      {/* Label */}
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          {required && <span className="text-terracotta ml-1">*</span>}
        </label>
      )}
      
      {/* Input container */}
      <div className="relative">
        {/* Icon (left position) */}
        {icon && iconPosition === 'left' && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
            {icon}
          </div>
        )}
        
        {/* Input field */}
        <motion.input
          type={type}
          name={name}
          value={value}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          disabled={disabled}
          autoFocus={autoFocus}
          required={required}
          animate={{
            boxShadow: error 
              ? '0 0 0 2px rgba(239, 68, 68, 0.2)' 
              : isFocused 
                ? '0 0 0 2px rgba(224, 122, 95, 0.2)' 
                : 'none',
            borderColor: error 
              ? 'rgb(239, 68, 68)' 
              : isFocused 
                ? 'rgb(224, 122, 95)' 
                : value 
                  ? 'rgb(209, 213, 219)' 
                  : 'rgb(209, 213, 219)'
          }}
          transition={{ duration: 0.2 }}
          className={`
            block w-full rounded-lg border p-2.5 outline-none transition-colors
            ${error ? 'border-red-500' : 'border-gray-300'}
            ${disabled ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : 'bg-white'}
            ${icon && iconPosition === 'left' ? 'pl-10' : ''}
            ${icon && iconPosition === 'right' ? 'pr-10' : ''}
          `}
        />
        
        {/* Icon (right position) */}
        {icon && iconPosition === 'right' && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
            {icon}
          </div>
        )}
      </div>
      
      {/* Error message or helper text */}
      {(error || helperText) && (
        <div className={`mt-1 text-sm ${error ? 'text-red-500' : 'text-gray-500'}`}>
          {error || helperText}
        </div>
      )}
    </div>
  );
}

export default QuestInputField;