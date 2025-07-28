import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface RankingOption {
  id: string;
  text: string;
}

interface RankingResponseProps {
  options: string[];
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onResponse: (value: string) => void;
  disabled?: boolean;
  className?: string;
}

/**
 * Ranking component for ordering options by preference
 */
export function RankingResponse({
  options,
  value,
  onChange,
  onResponse,
  disabled = false,
  className = ''
}: RankingResponseProps) {
  // Parse existing response if available
  const parseResponse = (): { rankings: RankingOption[]; explanation: string } => {
    if (!value) {
      return { 
        rankings: options.map((text, index) => ({ id: `option-${index}`, text })),
        explanation: '' 
      };
    }
    
    try {
      return JSON.parse(value);
    } catch (e) {
      return { 
        rankings: options.map((text, index) => ({ id: `option-${index}`, text })),
        explanation: '' 
      };
    }
  };
  
  const [state, setState] = useState(parseResponse());
  const [draggedItem, setDraggedItem] = useState<RankingOption | null>(null);
  
  // Handle drag start
  const handleDragStart = (item: RankingOption) => {
    setDraggedItem(item);
  };
  
  // Handle drag over
  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (!draggedItem) return;
    
    const newRankings = [...state.rankings];
    const draggedIndex = newRankings.findIndex(item => item.id === draggedItem.id);
    
    if (draggedIndex === index) return;
    
    // Reorder the items
    newRankings.splice(draggedIndex, 1);
    newRankings.splice(index, 0, draggedItem);
    
    setState({
      ...state,
      rankings: newRankings
    });
  };
  
  // Handle drag end
  // const handleDragEnd = () => {
  //   setDraggedItem(null);
    
  //   // Update the response value
  //   const responseValue = JSON.stringify(state);
  //   const event = {
  //     target: { value: responseValue }
  //   } as React.ChangeEvent<HTMLTextAreaElement>;
    
  //   onChange(event);
  // };
  // FILE: src/components/quest/responses/RankingResponse.tsx
// UPDATE: handleDragEnd function (around line 70)
const handleDragEnd = () => {
  setDraggedItem(null);
  
  // Update the response value
  const responseValue = JSON.stringify(state);
  const event = {
    target: { value: responseValue }
  } as React.ChangeEvent<HTMLTextAreaElement>;
  
  onChange(event);
  onResponse(responseValue);
};

// UPDATE: handleExplanationChange function (around line 80)
const handleExplanationChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
  const newState = {
    ...state,
    explanation: e.target.value
  };
  
  setState(newState);
  
  // Update the response value
  const responseValue = JSON.stringify(newState);
  
  const event = {
    target: { value: responseValue }
  } as React.ChangeEvent<HTMLTextAreaElement>;
  
  onChange(event);
  
  // AUTO-SAVE: Call onResponse immediately
  // onResponse(responseValue);
};
  
  return (
    <div className={`ranking-response ${className}`}>
      <div className="mb-4">
        <p className="text-[18px] text-[#A1A1AA] font-normal font-['Gilroy-Medium'] mb-3">
          Hold and drag items to rank them in order of importance to you:
        </p>
        
        <div className="space-y-2">
          {state.rankings.map((item, index) => (
            <motion.div
              key={item.id}
              draggable={!disabled}
              onDragStart={() => handleDragStart(item)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragEnd={handleDragEnd}
              className={`
                flex items-center rounded-lg h-14 text-left pl-3 text-xl font-normal font-['Gilroy-Medium'] border
                ${index === 0 ? '' : 'bg-[#FFFFFF]'}
                ${draggedItem?.id === item.id ? 'opacity-50' : 'opacity-100'}
              `}
            >
              <div className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 mr-3">
                <span className="font-['Gilroy-Medium']">{index + 1}</span>
              </div>
              <span>{item.text}</span>
            </motion.div>
          ))}
        </div>
      </div>
      
      <div className="mt-6">
        {/* <label className="block text-[18px] text-[#A1A1AA] font-normal font-['Gilroy-Medium'] mb-2">
          Explain why your top choice is most important to you:
        </label> */}
        <textarea
          value={state.explanation}
          onChange={handleExplanationChange}
          placeholder="Write one sentence explaining why..."
          className="w-full p-3 border border-gray-200 rounded-lg justify-start text-zinc-400 text-xl font-normal font-['Gilroy-Medium'] resize-y"
          disabled={disabled}
        />
      </div>
      
      {/* {!disabled && (
        <motion.button
          type="submit"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="mt-4 px-4 py-2 bg-terracotta text-white rounded-lg hover:bg-terracotta/90 transition-colors"
          disabled={!state.rankings.length || !state.explanation.trim() || disabled}
        >
          Submit
        </motion.button>
      )} */}
    </div>
  );
}

export default RankingResponse;