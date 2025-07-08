import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ScaleSliderProps } from './types';

/**
 * Scale slider component
 * Provides a slider for rating scale questions
 */
export function ScaleSlider({
  question,
  onResponse,
  isActive = true,
  isAnswered = false,
  previousResponse,
  min = 1,
  max = 10,
  step = 1,
  labels = {},
  showLabels = true,
  showValue = true,
  className = ''
}: ScaleSliderProps) {
  // Parse previous response to number if exists
  const initialValue = previousResponse 
    ? parseInt(previousResponse, 10) 
    : Math.floor((min + max) / 2);
  
  // Current value state
  const [value, setValue] = useState<number>(initialValue);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  
  // Handle slider change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isActive || isAnswered) return;
    
    setValue(parseInt(e.target.value, 10));
  };
  
  // Handle slider interaction states
  const handleDragStart = () => setIsDragging(true);
  const handleDragEnd = () => {
    setIsDragging(false);
    
    // Submit value when sliding ends
    if (isActive && !isAnswered) {
      onResponse(value.toString());
    }
  };
  
  // Calculate the percentage for the fill
  const percentage = ((value - min) / (max - min)) * 100;
  
  // Get color based on value position
  const getValueColor = (): string => {
    const normalizedValue = (value - min) / (max - min); // 0 to 1
    
    if (normalizedValue < 0.33) return 'text-terracotta';
    if (normalizedValue < 0.66) return 'text-navy';
    return 'text-gold';
  };
  
  return (
    <div className={`scale-slider ${className}`}>
      {/* Current value display */}
      {showValue && (
        <motion.div 
          className="text-center mb-4"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <motion.span 
            className={`text-4xl font-medium ${getValueColor()}`}
            key={value}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 15 }}
          >
            {value}
          </motion.span>
          {labels[value] && (
            <motion.p 
              className="text-sm text-gray-500 mt-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              {labels[value]}
            </motion.p>
          )}
        </motion.div>
      )}
      
      {/* Slider track */}
      <div className="relative h-2 mb-6">
        <div className="absolute inset-0 bg-gray-200 rounded-full"></div>
        <motion.div 
          className="absolute top-0 bottom-0 left-0 bg-gradient-to-r from-terracotta via-navy to-gold rounded-full"
          style={{ width: `${percentage}%` }}
          animate={{ width: `${percentage}%` }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        />
      </div>
      
      {/* Input slider */}
      <div className="relative">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={handleChange}
          onMouseDown={handleDragStart}
          onMouseUp={handleDragEnd}
          onTouchStart={handleDragStart}
          onTouchEnd={handleDragEnd}
          disabled={!isActive || isAnswered}
          className={`
            w-full h-2 appearance-none bg-transparent cursor-pointer
            ${!isActive || isAnswered ? 'opacity-70 cursor-default' : ''}
          `}
          style={{ 
            // Hide default appearance
            WebkitAppearance: 'none',
            // Transparent background
            background: 'transparent',
          }}
        />
        
        {/* Custom thumb */}
        <motion.div 
          className={`
            absolute top-0 w-6 h-6 rounded-full bg-white border-2 
            ${isDragging ? 'shadow-md' : 'shadow'}
            ${getValueColor().replace('text-', 'border-')}
          `}
          style={{ 
            left: `calc(${percentage}% - 12px)`,
            marginTop: '-10px' 
          }}
          animate={{ 
            scale: isDragging ? 1.2 : 1,
            boxShadow: isDragging 
              ? '0 4px 8px rgba(0,0,0,0.15)' 
              : '0 2px 4px rgba(0,0,0,0.1)'
          }}
        />
      </div>
      
      {/* Labels */}
      {showLabels && (
        <div className="flex justify-between mt-2 px-1">
          <span className="text-xs text-gray-500">{min}</span>
          {Object.entries(labels)
            .filter(([value]) => parseInt(value, 10) !== min && parseInt(value, 10) !== max)
            .map(([value, label]) => (
              <span 
                key={value} 
                className="text-xs text-gray-500"
                style={{ 
                  position: 'absolute', 
                  left: `calc(${((parseInt(value, 10) - min) / (max - min)) * 100}% - 8px)` 
                }}
              >
                |
              </span>
            ))}
          <span className="text-xs text-gray-500">{max}</span>
        </div>
      )}
      
      {/* Submit button */}
      {isActive && !isAnswered && (
        <motion.button
          onClick={() => onResponse(value.toString())}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="mt-6 px-4 py-2 bg-terracotta text-white rounded-lg hover:bg-terracotta/90 transition-colors mx-auto block"
        >
          Submit
        </motion.button>
      )}
    </div>
  );
}

export default ScaleSlider;