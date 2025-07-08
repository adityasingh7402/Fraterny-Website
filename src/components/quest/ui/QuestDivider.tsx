import React from 'react';

interface QuestDividerProps {
  text?: string;
  orientation?: 'horizontal' | 'vertical';
  className?: string;
}

/**
 * Quest-specific divider component
 * Provides visual separation with optional text
 */
export function QuestDivider({
  text,
  orientation = 'horizontal',
  className = ''
}: QuestDividerProps) {
  // Render horizontal divider
  if (orientation === 'horizontal') {
    if (text) {
      return (
        <div className={`relative ${className}`}>
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center">
            <span className="bg-white px-4 text-sm text-gray-500">
              {text}
            </span>
          </div>
        </div>
      );
    } else {
      return <hr className={`border-gray-200 ${className}`} />;
    }
  }
  
  // Render vertical divider
  return (
    <div className={`inline-block h-full border-l border-gray-200 ${className}`}>
      {text && (
        <span className="sr-only">{text}</span>
      )}
    </div>
  );
}

export default QuestDivider;