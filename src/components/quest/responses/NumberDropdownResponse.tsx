import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { NumberDropdownProps } from './types';
import { ChevronDown, Check } from 'lucide-react';

/**
 * Number dropdown response component
 * Allows selection from a predefined list of numbers
 */
export function NumberDropdownResponse({
  question,
  onResponse,
  isActive = true,
  isAnswered = false,
  previousResponse = '',
  placeholder = 'Select an option',
  className = ''
}: NumberDropdownProps) {
  const [selectedValue, setSelectedValue] = useState<string>(previousResponse);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Update selected value when previousResponse changes
  useEffect(() => {
    if (previousResponse) {
      setSelectedValue(previousResponse);
    }
  }, [previousResponse]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSelect = (option: string) => {
    if (!isActive || isAnswered) return;
    
    setSelectedValue(option);
    setIsOpen(false);
    
    // Auto-submit when value is selected
    if (option) {
      onResponse(option);
    }
  };

  const toggleDropdown = () => {
    if (!isActive || isAnswered) return;
    setIsOpen(!isOpen);
  };

return (
    <div className={`number-dropdown-response relative ${className}`} ref={dropdownRef}>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        onClick={toggleDropdown}
        className={`
          w-full p-4 pr-12 border rounded-lg transition-all text-lg cursor-pointer
          ${!isActive || isAnswered ? 'bg-gray-50 opacity-90 cursor-not-allowed' : 'bg-white'}
          ${selectedValue ? 'border-black text-black' : 'border-gray-200 text-gray-400'}
          focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent
        `}
      >
        {selectedValue || placeholder}
      </motion.div>
      
      {/* Custom Arrow Icon */}
      <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
        <ChevronDown 
          className={`w-5 h-5 transition-all duration-200 ${
            selectedValue ? 'text-black' : 'text-gray-400'
          } ${isOpen ? 'rotate-180' : ''}`}
        />
      </div>

      {/* Custom Dropdown Options - Same style as VillaApplicationForm */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg font-['Gilroy-regular'] max-h-60 overflow-auto"
          >
            <div className="p-1">
              {question.options?.map((option, index) => (
                <div
                  key={index}
                  onClick={() => handleSelect(option)}
                  className="relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none hover:bg-gray-100 focus:bg-gray-100 data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                >
                  <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                    {selectedValue === option && (
                      <Check className="h-4 w-4" />
                    )}
                  </span>
                  <span className="font-['Gilroy-regular']">{option}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

}

export default NumberDropdownResponse;