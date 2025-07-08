import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface DateResponseProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (value: string) => void;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
}

/**
 * Date picker component for birth date selection
 */
export function DateResponse({
  value,
  onChange,
  onSubmit,
  disabled = false,
  placeholder = 'Select your date of birth',
  className = ''
}: DateResponseProps) {
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value) {
      onSubmit(value);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className={`date-response ${className}`}>
      <div className="relative">
        <input
          type="date"
          value={value}
          onChange={onChange}
          className="w-full p-3 border border-gray-200 rounded-lg focus:border-terracotta focus:ring-1 focus:ring-terracotta/20 transition-all"
          max={new Date().toISOString().split('T')[0]} // Set max date to today
          disabled={disabled}
          required
        />
        <div className="mt-2 text-xs text-gray-500">
          Please select your date of birth
        </div>
      </div>
      
      {!disabled && (
        <motion.button
          type="submit"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="mt-4 px-4 py-2 bg-terracotta text-white rounded-lg hover:bg-terracotta/90 transition-colors"
          disabled={!value || disabled}
        >
          Submit
        </motion.button>
      )}
    </form>
  );
}

export default DateResponse;