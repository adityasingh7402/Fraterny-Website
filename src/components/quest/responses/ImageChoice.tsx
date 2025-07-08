import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ImageChoiceProps } from './types';

/**
 * Image choice component
 * Displays a grid of images for visual selection
 */
export function ImageChoice({
  question,
  images,
  onResponse,
  isActive = true,
  isAnswered = false,
  previousResponse,
  columns = 2,
  className = ''
}: ImageChoiceProps) {
  // Selected image state
  const [selectedImage, setSelectedImage] = useState<string | undefined>(previousResponse);
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1
      }
    }
  };
  
  const imageVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1 },
    hover: { scale: 1.03, y: -5 },
    tap: { scale: 0.98 },
    selected: { 
      scale: 1.05, 
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      borderColor: 'rgba(224, 122, 95, 0.8)'
    }
  };
  
  // Handle image selection
  const handleImageSelect = (value: string) => {
    if (!isActive || isAnswered) return;
    
    setSelectedImage(value);
    onResponse(value);
  };
  
  // Determine grid layout class
  const getGridClass = (): string => {
    switch (columns) {
      case 4: return 'grid-cols-2 sm:grid-cols-4';
      case 3: return 'grid-cols-1 sm:grid-cols-3';
      case 2:
      default: return 'grid-cols-1 sm:grid-cols-2';
    }
  };
  
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={`image-choice ${className}`}
    >
      <motion.div className={`grid ${getGridClass()} gap-4`}>
        {images.map((image, index) => {
          const isSelected = image.value === selectedImage;
          
          return (
            <motion.div
              key={index}
              variants={imageVariants}
              whileHover={isActive && !isAnswered ? "hover" : undefined}
              whileTap={isActive && !isAnswered ? "tap" : undefined}
              animate={isSelected ? "selected" : "visible"}
              onClick={() => handleImageSelect(image.value)}
              className={`
                relative overflow-hidden rounded-lg border-2 cursor-pointer transition-all
                ${isSelected 
                  ? 'border-terracotta shadow-md' 
                  : 'border-transparent hover:border-gray-200 shadow'
                }
                ${!isActive || isAnswered ? 'opacity-80 cursor-default' : ''}
              `}
            >
              {/* Image */}
              <img 
                src={image.src} 
                alt={image.alt}
                className="w-full h-auto object-cover aspect-square"
              />
              
              {/* Caption/label */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                <div className="text-white text-sm font-medium">
                  {image.alt}
                </div>
              </div>
              
              {/* Selection indicator */}
              {isSelected && (
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="absolute top-2 right-2 w-6 h-6 bg-terracotta rounded-full flex items-center justify-center shadow-md"
                >
                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </motion.div>
      
      {/* Submit button - only needed if we want explicit submission after selection */}
      {/* {isActive && !isAnswered && selectedImage && (
        <motion.button
          onClick={() => onResponse(selectedImage)}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="mt-6 px-4 py-2 bg-terracotta text-white rounded-lg hover:bg-terracotta/90 transition-colors mx-auto block"
        >
          Confirm Selection
        </motion.button>
      )} */}
    </motion.div>
  );
}

export default ImageChoice;