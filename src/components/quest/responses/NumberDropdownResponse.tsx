import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { NumberDropdownProps } from './types';
import { ChevronDown } from 'lucide-react';

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

  // Update selected value when previousResponse changes
  useEffect(() => {
    if (previousResponse) {
      setSelectedValue(previousResponse);
    }
  }, [previousResponse]);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (!isActive || isAnswered) return;
    
    const newValue = e.target.value;
    setSelectedValue(newValue);
    
    // Auto-submit when value is selected
    if (newValue) {
      onResponse(newValue);
    }
  };

//   return (
//     <div className={`number-dropdown-response ${className}`}>
//       <motion.select
//         value={selectedValue}
//         onChange={handleChange}
//         disabled={!isActive || isAnswered}
//         className={`
//           w-full p-4 border rounded-lg transition-all text-left pl-3 text-xl font-normal font-['Gilroy-Medium']
//           ${!isActive || isAnswered ? 'bg-gray-50 opacity-90 cursor-not-allowed' : 'bg-white cursor-pointer'}
//           ${selectedValue ? 'border-black' : 'border-gray-200'}
//         `}
//       >
//         <option value="" disabled>
//           {placeholder}
//         </option>
//         {question.options?.map((option, index) => (
//           <option key={index} value={option}>
//             {option}
//           </option>
//         ))}
//       </motion.select>
//     </div>
//   );

return (
  <div className={`number-dropdown-response relative ${className}`}>
    <motion.select
      value={selectedValue}
      onChange={handleChange}
      disabled={!isActive || isAnswered}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`
        w-full p-4 pr-12 border rounded-lg transition-all text-lg appearance-none
        ${!isActive || isAnswered ? 'bg-gray-50 opacity-90 cursor-not-allowed' : 'bg-white cursor-pointer'}
        ${selectedValue ? 'border-black' : 'border-gray-200'}
        focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent
      `}
      style={{ WebkitAppearance: 'none', MozAppearance: 'none' }}
    >
      <option value="" disabled>
        {placeholder}
      </option>
      {question.options?.map((option, index) => (
        <option key={index} value={option}>
          {option}
        </option>
      ))}
    </motion.select>
    
    {/* Custom Arrow Icon */}
    <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
      <ChevronDown 
        className={`w-5 h-5 transition-colors ${
          selectedValue ? 'text-black' : 'text-gray-400'
        }`}
      />
    </div>
  </div>
);

}

export default NumberDropdownResponse;