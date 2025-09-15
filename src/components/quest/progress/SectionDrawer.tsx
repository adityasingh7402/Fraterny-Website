// // src/components/quest/navigation/SectionDrawer.tsx
// import React from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import { useQuest } from '../core/useQuest';

// interface SectionDrawerProps {
//   isOpen: boolean;
//   onClose: () => void;
//   onSectionSelect: (sectionId: string) => void;
// }

// /**
//  * Section navigation drawer component
//  * Displays all available sections for quick navigation
//  */
// export function SectionDrawer({
//   isOpen,
//   onClose,
//   onSectionSelect
// }: SectionDrawerProps) {
//   const { sections, currentSectionId } = useQuest();

//   // Handle section selection
//   const handleSectionClick = (sectionId: string) => {
//     onSectionSelect(sectionId);
//     onClose(); // Auto-close drawer after selection
//   };

//   // Handle backdrop click to close drawer
//   const handleBackdropClick = (e: React.MouseEvent) => {
//     if (e.target === e.currentTarget) {
//       onClose();
//     }
//   };

//   return (
//     <AnimatePresence>
//       {isOpen && (
//         <motion.div
//           className="fixed inset-0 z-50 flex items-start justify-center pt-20"
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           exit={{ opacity: 0 }}
//           transition={{ duration: 0.2 }}
//           onClick={handleBackdropClick}
//         >
//           {/* Backdrop */}
//           <div className="absolute inset-0 bg-black bg-opacity-30" />
          
//           {/* Drawer Content */}
//           <motion.div
//             className="relative bg-white rounded-lg shadow-xl border border-gray-200 w-full max-w-md mx-4"
//             initial={{ opacity: 0, y: -20, scale: 0.95 }}
//             animate={{ opacity: 1, y: 0, scale: 1 }}
//             exit={{ opacity: 0, y: -20, scale: 0.95 }}
//             transition={{ duration: 0.2, ease: "easeOut" }}
//           >
//             {/* Header */}
//             <div className="px-6 py-4 border-b border-gray-100">
//               <h3 className="text-lg font-semibold text-gray-900">
//                 Choose Section
//               </h3>
//               <p className="text-sm text-gray-500 mt-1">
//                 Navigate to any section of the assessment
//               </p>
//             </div>
            
//             {/* Section List */}
//             <div className="py-2">
//               {sections.map((section, index) => {
//                 const isCurrentSection = section.id === currentSectionId;
                
//                 return (
//                   <button
//                     key={section.id}
//                     onClick={() => handleSectionClick(section.id)}
//                     className={`
//                       w-full px-6 py-3 text-left hover:bg-gray-50 transition-colors duration-150
//                       flex items-center justify-between group
//                       ${isCurrentSection ? 'bg-sky-50 border-r-4 border-sky-600' : ''}
//                     `}
//                   >
//                     <div className="flex items-center space-x-3">
//                       {/* Section Number */}
//                       <div className={`
//                         w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
//                         ${isCurrentSection 
//                           ? 'bg-sky-600 text-white' 
//                           : 'bg-gray-100 text-gray-600 group-hover:bg-gray-200'
//                         }
//                       `}>
//                         {index + 1}
//                       </div>
                      
//                       {/* Section Title */}
//                       <span className={`
//                         font-medium
//                         ${isCurrentSection 
//                           ? 'text-sky-800' 
//                           : 'text-gray-700 group-hover:text-gray-900'
//                         }
//                       `}>
//                         {section.title}
//                       </span>
//                     </div>
                    
//                     {/* Current Section Indicator */}
//                     {isCurrentSection && (
//                       <div className="text-sky-600 text-sm font-medium">
//                         Current
//                       </div>
//                     )}
//                   </button>
//                 );
//               })}
//             </div>
//           </motion.div>
//         </motion.div>
//       )}
//     </AnimatePresence>
//   );
// }

// export default SectionDrawer;



// src/components/quest/navigation/SectionDrawer.tsx
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuest } from '../core/useQuest';

interface SectionDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSectionSelect: (sectionId: string) => void;
}

/**
 * Section navigation drawer component
 * Displays all available sections for quick navigation
 */
export function SectionDrawer({
  isOpen,
  onClose,
  onSectionSelect
}: SectionDrawerProps) {
  const { sections, currentSectionId, session, allQuestions, hasAttemptedFinishWithIncomplete } = useQuest();
  
  // Helper function to check if a section has incomplete questions
  const sectionHasIncompleteQuestions = (sectionId: string): boolean => {
    if (!session?.responses || !allQuestions) return false;
    
    const sectionQuestions = allQuestions.filter(q => q.sectionId === sectionId);
    return sectionQuestions.some(q => !session.responses || !session.responses[q.id]);
  };

  // Handle section selection
  const handleSectionClick = (sectionId: string) => {
    onSectionSelect(sectionId);
    onClose(); // Auto-close drawer after selection
  };

  // Handle backdrop click to close drawer
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Color mapping for sections based on Figma design
  const getSectionColor = (index: number): string => {
    const colors = [
      'text-sky-800',    // Section 1
      'text-red-800',    // Section 2  
      'text-purple-900', // Section 3
      'text-lime-700',   // Section 4
      'text-blue-950'    // Section 5
    ];
    return colors[index] || 'text-sky-800'; // Fallback to sky-800
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="absolute top-full left-0 z-50 w-32 mt-1"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
        >
          {/* Dropdown Container */}
          <div className="w-28 bg-white rounded-[10px] border-[1.50px] border-neutral-400 py-2 shadow-lg">
            {sections.map((section, index) => (
              <div key={section.id}>
                <button
                  onClick={() => handleSectionClick(section.id)}
                  className="w-full px-4 py-2 text-center hover:bg-gray-50 transition-colors duration-150"
                >
                  <div className={`text-xl font-normal font-['Gilroy-Bold'] tracking-[-1.5px] ${
                    (hasAttemptedFinishWithIncomplete && sectionHasIncompleteQuestions(section.id)) ? 'text-red-600' : getSectionColor(index)
                  }`}>
                    {section.title}
                  </div>
                </button>
                
                {/* Separator line (except for last item) */}
                {index < sections.length - 1 && (
                  <div className="w-full h-0 outline outline-[0.50px] outline-offset-[-0.25px] outline-neutral-400" />
                )}
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default SectionDrawer;