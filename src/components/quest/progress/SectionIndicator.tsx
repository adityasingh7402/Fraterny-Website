import React from 'react';
import { motion } from 'framer-motion';
import { useQuest } from '../core/useQuest';

interface SectionIndicatorProps {
  showLabels?: boolean;
  showCount?: boolean;
  variant?: 'pills' | 'circles' | 'numbers' | 'dots';
  interactive?: boolean;
  onSectionClick?: (sectionId: string) => void;
  className?: string;
}

/**
 * Section indicator component
 * Displays the current section and navigation between sections
 */
export function SectionIndicator({
  showLabels = true,
  showCount = true,
  variant = 'pills',
  interactive = false,
  onSectionClick,
  className = ''
}: SectionIndicatorProps) {
  // Get section data from quest context
  const { sections, currentSectionId, changeSection } = useQuest();
  
  // Handle section click if interactive
  const handleSectionClick = (sectionId: string) => {
    if (!interactive) return;
    
    if (onSectionClick) {
      onSectionClick(sectionId);
    } else {
      changeSection(sectionId);
    }
  };
  
  // Helper to determine if section is active
  const isSectionActive = (sectionId: string): boolean => {
    return sectionId === currentSectionId;
  };
  
  // Helper to determine if section is before current
  const isSectionBefore = (index: number): boolean => {
    const currentIndex = sections.findIndex(s => s.id === currentSectionId);
    return index < currentIndex;
  };
  
  // Render variant-specific indicators
  const renderIndicators = () => {
    switch (variant) {
      case 'circles':
        return (
          <div className="flex items-center justify-center space-x-2">
            {sections.map((section, index) => {
              const isActive = isSectionActive(section.id);
              const isBefore = isSectionBefore(index);
              
              return (
                <motion.div
                  key={section.id}
                  onClick={() => handleSectionClick(section.id)}
                  className={`
                    relative rounded-full transition-all
                    ${isActive 
                      ? 'w-4 h-4 bg-terracotta' 
                      : isBefore 
                        ? 'w-3 h-3 bg-terracotta/50' 
                        : 'w-3 h-3 bg-gray-200'
                    }
                    ${interactive && !isActive ? 'cursor-pointer hover:scale-110' : ''}
                  `}
                  whileHover={interactive && !isActive ? { scale: 1.1 } : undefined}
                >
                  {showLabels && isActive && (
                    <motion.div 
                      className="absolute top-6 left-1/2 transform -translate-x-1/2 whitespace-nowrap"
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <span className="text-xs font-medium text-gray-600">
                        {section.title}
                      </span>
                    </motion.div>
                  )}
                </motion.div>
              );
            })}
          </div>
        );
        
      case 'numbers':
        return (
          <div className="flex items-center justify-center space-x-3">
            {sections.map((section, index) => {
              const isActive = isSectionActive(section.id);
              const isBefore = isSectionBefore(index);
              
              return (
                <motion.div
                  key={section.id}
                  onClick={() => handleSectionClick(section.id)}
                  className={`
                    flex items-center justify-center w-7 h-7 rounded-full text-sm transition-all
                    ${isActive 
                      ? 'bg-terracotta text-white font-medium' 
                      : isBefore 
                        ? 'bg-terracotta/20 text-terracotta' 
                        : 'bg-gray-100 text-gray-500'
                    }
                    ${interactive && !isActive ? 'cursor-pointer hover:scale-110' : ''}
                  `}
                  whileHover={interactive && !isActive ? { scale: 1.1 } : undefined}
                >
                  {index + 1}
                  
                  {showLabels && isActive && (
                    <motion.div 
                      className="absolute top-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap"
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <span className="text-xs font-medium text-gray-600">
                        {section.title}
                      </span>
                    </motion.div>
                  )}
                </motion.div>
              );
            })}
          </div>
        );
        
      case 'dots':
        return (
          <div className="flex items-center justify-center space-x-1">
            {sections.map((section, index) => {
              const isActive = isSectionActive(section.id);
              const isBefore = isSectionBefore(index);
              
              return (
                <div key={section.id} className="relative">
                  <motion.div
                    onClick={() => handleSectionClick(section.id)}
                    className={`
                      w-2 h-2 rounded-full transition-all
                      ${isActive 
                        ? 'bg-terracotta' 
                        : isBefore 
                          ? 'bg-terracotta/50' 
                          : 'bg-gray-200'
                      }
                      ${interactive && !isActive ? 'cursor-pointer hover:scale-150' : ''}
                    `}
                    whileHover={interactive && !isActive ? { scale: 1.5 } : undefined}
                  />
                  
                  {showLabels && isActive && (
                    <motion.div 
                      className="absolute top-4 left-1/2 transform -translate-x-1/2 whitespace-nowrap"
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <span className="text-xs font-medium text-gray-600">
                        {section.title}
                      </span>
                    </motion.div>
                  )}
                </div>
              );
            })}
          </div>
        );
        
      case 'pills':
      default:
        return (
          <div className="flex items-center justify-center space-x-2">
            {sections.map((section, index) => {
              const isActive = isSectionActive(section.id);
              const isBefore = isSectionBefore(index);
              
              return (
                <motion.div
                  key={section.id}
                  onClick={() => handleSectionClick(section.id)}
                  className={`
                    px-3 py-1 rounded-full text-xs font-medium transition-all
                    ${isActive 
                      ? 'bg-terracotta text-white' 
                      : isBefore 
                        ? 'bg-terracotta/10 text-terracotta' 
                        : 'bg-gray-100 text-gray-500'
                    }
                    ${interactive && !isActive ? 'cursor-pointer hover:scale-105' : ''}
                  `}
                  whileHover={interactive && !isActive ? { scale: 1.05 } : undefined}
                >
                  {showLabels ? section.title : `Section ${index + 1}`}
                </motion.div>
              );
            })}
          </div>
        );
    }
  };
  
  return (
    <div className={`section-indicator ${className}`}>
      {renderIndicators()}
      
      {/* Section count if enabled */}
      {showCount && (
        <div className="text-xs text-gray-500 text-center mt-3">
          Section {sections.findIndex(s => s.id === currentSectionId) + 1} of {sections.length}
        </div>
      )}
    </div>
  );
}

export default SectionIndicator;