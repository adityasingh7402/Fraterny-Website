// import React from 'react';
// import { Tag, Filter, Search } from 'lucide-react';
// import { Input } from '@/components/ui/input';

// interface BlogFilterProps {
//   categories: string[];
//   tags: string[];
//   selectedCategory: string | null;
//   selectedTag: string | null;
//   onSelectCategory: (category: string | null) => void;
//   onSelectTag: (tag: string | null) => void;
//   onSearch: (query: string) => void;
// }

// const BlogFilter: React.FC<BlogFilterProps> = ({
//   categories,
//   tags,
//   selectedCategory,
//   selectedTag,
//   onSelectCategory,
//   onSelectTag,
//   onSearch
// }) => {
//   if (categories.length === 0 && tags.length === 0) {
//     return null;
//   }
  
//   return (
//     <div className="mb-8 bg-white rounded-lg p-6 shadow-sm">
//       {/* Search Section */}
//       <div className="mb-6">
//         <div className="flex items-center gap-2 mb-4">
//           <Search className="h-5 w-5 text-navy" />
//           <h2 className="text-xl font-semibold text-navy">Search Posts</h2>
//         </div>
//         <Input
//           type="search"
//           placeholder="Search blog posts..."
//           onChange={(e) => onSearch(e.target.value)}
//           className="max-w-md"
//         />
//       </div>

//       {/* Categories Section */}
//       {categories.length > 0 && (
//         <div className="mb-6">
//           <div className="flex items-center gap-2 mb-4">
//             <Filter className="h-5 w-5 text-navy" />
//             <h2 className="text-xl font-semibold text-navy">Filter by Category</h2>
//           </div>
          
//           <div className="flex flex-wrap gap-3">
//             <button 
//               className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
//                 !selectedCategory 
//                   ? 'bg-navy text-white shadow-md' 
//                   : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
//               }`}
//               onClick={() => onSelectCategory(null)}
//             >
//               All Categories
//             </button>
//             {categories.map(category => (
//               <button 
//                 key={category} 
//                 className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
//                   selectedCategory === category 
//                     ? 'bg-navy text-white shadow-md' 
//                     : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
//                 }`}
//                 onClick={() => onSelectCategory(category)}
//               >
//                 {category}
//               </button>
//             ))}
//           </div>
//         </div>
//       )}
      
//       {/* Tags Section */}
//       {tags.length > 0 && (
//         <div className="pt-4 border-t border-gray-200">
//           <div className="flex items-center gap-2 mb-4">
//             <Tag className="h-5 w-5 text-terracotta" />
//             <h2 className="text-xl font-semibold text-navy">Filter by Tags</h2>
//           </div>
          
//           <div className="flex flex-wrap gap-2">
//             <button 
//               className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
//                 !selectedTag 
//                   ? 'bg-terracotta text-white shadow-md' 
//                   : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
//               }`}
//               onClick={() => onSelectTag(null)}
//             >
//               All Tags
//             </button>
//             {tags.map(tag => (
//               <button 
//                 key={tag} 
//                 className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
//                   selectedTag === tag 
//                     ? 'bg-terracotta text-white shadow-md' 
//                     : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
//                 }`}
//                 onClick={() => onSelectTag(tag)}
//               >
//                 <Tag size={14} className="mr-1.5" />
//                 {tag}
//               </button>
//             ))}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default BlogFilter;


// import React from 'react';
// import { motion } from 'framer-motion';
// import { Tag, Filter, Search } from 'lucide-react';
// import { Input } from '@/components/ui/input';
// import { useSectionRevealAnimation } from '../home/useSectionRevealAnimation';

// interface BlogFilterProps {
//   categories: string[];
//   tags: string[];
//   selectedCategory: string | null;
//   selectedTag: string | null;
//   onSelectCategory: (category: string | null) => void;
//   onSelectTag: (tag: string | null) => void;
//   onSearch: (query: string) => void;
// }

// const BlogFilter: React.FC<BlogFilterProps> = ({
//   categories,
//   tags,
//   selectedCategory,
//   selectedTag,
//   onSelectCategory,
//   onSelectTag,
//   onSearch
// }) => {
//   // Early return if no filters available - PREVENTS ANIMATION CONFLICTS
//   if (categories.length === 0 && tags.length === 0) {
//     return (
//       <div className="mb-8 bg-white rounded-lg p-6 shadow-sm">
//         {/* Search Section Only */}
//         <div className="mb-6">
//           <div className="flex items-center gap-2 mb-4">
//             <Search className="h-5 w-5 text-navy" />
//             <h2 className="text-xl font-semibold text-navy">Search Posts</h2>
//           </div>
//           <Input
//             type="search"
//             placeholder="Search blog posts..."
//             onChange={(e) => onSearch(e.target.value)}
//             className="max-w-md"
//           />
//         </div>
        
//         {/* Show message when no categories/tags */}
//         <div className="text-center py-8 text-gray-500">
//           <p>No categories or tags available yet.</p>
//         </div>
//       </div>
//     );
//   }

//   // Single animation hook to avoid React internal errors
//   const filterAnimation = useSectionRevealAnimation({
//     variant: 'fade-up',
//     once: false,
//     threshold: { desktop: 0.3, mobile: 0.2 },
//     duration: 0.6,
//     staggerChildren: 0.2,
//     delayChildren: 0.1
//   });

//   // Button animation variants
//   const buttonVariants = {
//     hidden: { 
//       opacity: 0,
//       scale: 0.9,
//       y: 20
//     },
//     visible: { 
//       opacity: 1,
//       scale: 1,
//       y: 0,
//       transition: {
//         type: "spring",
//         stiffness: 150,
//         damping: 15
//       }
//     },
//     hover: {
//       scale: 1.05,
//       y: -2,
//       transition: {
//         type: "spring",
//         stiffness: 400,
//         damping: 25
//       }
//     },
//     tap: {
//       scale: 0.98
//     }
//   };

//   // Icon animation variants
//   const iconVariants = {
//     hidden: { 
//       scale: 0,
//       rotate: -90,
//       opacity: 0
//     },
//     visible: { 
//       scale: 1,
//       rotate: 0,
//       opacity: 1,
//       transition: {
//         type: "spring",
//         stiffness: 200,
//         damping: 15,
//         delay: 0.1
//       }
//     }
//   };

//   return (
//     <motion.div 
//       className="mb-8 bg-white rounded-lg p-6 shadow-sm"
//       ref={filterAnimation.ref}
//       variants={filterAnimation.parentVariants}
//       initial="hidden"
//       animate={filterAnimation.controls}
//     >
//       {/* Search Section */}
//       <motion.div 
//         className="mb-6"
//         variants={filterAnimation.childVariants}
//       >
//         <motion.div 
//           className="flex items-center gap-2 mb-4"
//           variants={filterAnimation.childVariants}
//         >
//           <motion.div
//             variants={iconVariants}
//             initial="hidden"
//             animate={filterAnimation.isInView ? "visible" : "hidden"}
//           >
//             <Search className="h-5 w-5 text-navy" />
//           </motion.div>
//           <motion.h2 
//             className="text-xl font-semibold text-navy"
//             variants={filterAnimation.childVariants}
//           >
//             Search Posts
//           </motion.h2>
//         </motion.div>
        
//         <motion.div
//           variants={filterAnimation.childVariants}
//           whileFocus={{ scale: 1.02 }}
//           transition={{ type: "spring", stiffness: 300, damping: 25 }}
//         >
//           <Input
//             type="search"
//             placeholder="Search blog posts..."
//             onChange={(e) => onSearch(e.target.value)}
//             className="max-w-md transition-all duration-300 focus:shadow-md"
//           />
//         </motion.div>
//       </motion.div>

//       {/* Categories Section */}
//       {categories.length > 0 && (
//         <motion.div 
//           className="mb-6"
//           variants={filterAnimation.childVariants}
//         >
//           <motion.div 
//             className="flex items-center gap-2 mb-4"
//             variants={filterAnimation.childVariants}
//           >
//             <motion.div
//               variants={iconVariants}
//               initial="hidden"
//               animate={filterAnimation.isInView ? "visible" : "hidden"}
//             >
//               <Filter className="h-5 w-5 text-navy" />
//             </motion.div>
//             <motion.h2 
//               className="text-xl font-semibold text-navy"
//               variants={filterAnimation.childVariants}
//             >
//               Filter by Category
//             </motion.h2>
//           </motion.div>
          
//           <motion.div 
//             className="flex flex-wrap gap-3"
//             variants={filterAnimation.childVariants}
//           >
//             {/* All Categories Button */}
//             <motion.button 
//               className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
//                 !selectedCategory 
//                   ? 'bg-navy text-white shadow-md' 
//                   : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
//               }`}
//               onClick={() => onSelectCategory(null)}
//               variants={buttonVariants}
//               whileHover="hover"
//               whileTap="tap"
//               initial="hidden"
//               animate={filterAnimation.isInView ? "visible" : "hidden"}
//             >
//               All Categories
//             </motion.button>
            
//             {/* Category Buttons */}
//             {categories.map((category, index) => (
//               <motion.button 
//                 key={category} 
//                 className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
//                   selectedCategory === category 
//                     ? 'bg-navy text-white shadow-md' 
//                     : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
//                 }`}
//                 onClick={() => onSelectCategory(category)}
//                 variants={buttonVariants}
//                 whileHover="hover"
//                 whileTap="tap"
//                 initial="hidden"
//                 animate={filterAnimation.isInView ? "visible" : "hidden"}
//                 transition={{ delay: 0.1 * (index + 1) }}
//               >
//                 {category}
//               </motion.button>
//             ))}
//           </motion.div>
//         </motion.div>
//       )}
      
//       {/* Tags Section */}
//       {tags.length > 0 && (
//         <motion.div 
//           className="pt-4 border-t border-gray-200"
//           variants={filterAnimation.childVariants}
//         >
//           <motion.div 
//             className="flex items-center gap-2 mb-4"
//             variants={filterAnimation.childVariants}
//           >
//             <motion.div
//               variants={iconVariants}
//               initial="hidden"
//               animate={filterAnimation.isInView ? "visible" : "hidden"}
//             >
//               <Tag className="h-5 w-5 text-terracotta" />
//             </motion.div>
//             <motion.h2 
//               className="text-xl font-semibold text-navy"
//               variants={filterAnimation.childVariants}
//             >
//               Filter by Tags
//             </motion.h2>
//           </motion.div>
          
//           <motion.div 
//             className="flex flex-wrap gap-2"
//             variants={filterAnimation.childVariants}
//           >
//             {/* All Tags Button */}
//             <motion.button 
//               className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
//                 !selectedTag 
//                   ? 'bg-terracotta text-white shadow-md' 
//                   : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
//               }`}
//               onClick={() => onSelectTag(null)}
//               variants={buttonVariants}
//               whileHover="hover"
//               whileTap="tap"
//               initial="hidden"
//               animate={filterAnimation.isInView ? "visible" : "hidden"}
//             >
//               All Tags
//             </motion.button>
            
//             {/* Tag Buttons */}
//             {tags.map((tag, index) => (
//               <motion.button 
//                 key={tag} 
//                 className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
//                   selectedTag === tag 
//                     ? 'bg-terracotta text-white shadow-md' 
//                     : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
//                 }`}
//                 onClick={() => onSelectTag(tag)}
//                 variants={buttonVariants}
//                 whileHover="hover"
//                 whileTap="tap"
//                 initial="hidden"
//                 animate={filterAnimation.isInView ? "visible" : "hidden"}
//                 transition={{ delay: 0.05 * (index + 1) }}
//               >
//                 <Tag size={14} className="mr-1.5" />
//                 {tag}
//               </motion.button>
//             ))}
//           </motion.div>
//         </motion.div>
//       )}
//     </motion.div>
//   );
// };

// export default BlogFilter;

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Tag, Filter, Search, ChevronDown } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface BlogFilterProps {
  categories: string[];
  tags: string[];
  selectedCategory: string | null;
  selectedTag: string | null;
  onSelectCategory: (category: string | null) => void;
  onSelectTag: (tag: string | null) => void;
  onSearch: (query: string) => void;
}

const BlogFilter: React.FC<BlogFilterProps> = ({
  categories,
  tags,
  selectedCategory,
  selectedTag,
  onSelectCategory,
  onSelectTag,
  onSearch
}) => {
  const [isTagDropdownOpen, setIsTagDropdownOpen] = useState(false);

  // Simple left-to-right slide animation
  const slideFromLeft = {
    hidden: { 
      opacity: 0, 
      x: -50 
    },
    visible: (delay: number) => ({
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.6,
        delay: delay * 0.1,
        ease: "easeOut"
      }
    })
  };

  // Early return if no filters available
  if (categories.length === 0 && tags.length === 0) {
    return (
      <motion.div 
        className="mb-8 bg-white rounded-lg p-6 shadow-sm"
        variants={slideFromLeft}
        custom={0}
        initial="hidden"
        animate="visible"
      >
        {/* Search Section Only */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Search className="h-5 w-5 text-navy" />
            <h2 className="text-xl font-semibold text-navy" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 400 }}>Search Posts</h2>
          </div>
          <Input
            type="search"
            placeholder="Search blog posts..."
            onChange={(e) => onSearch(e.target.value)}
            className="max-w-md"
          />
        </div>
        
        {/* Show message when no categories/tags */}
        <div className="text-center py-8 text-gray-500">
          <p>No categories or tags available yet.</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      className="mb-8 bg-white rounded-lg p-6 shadow-sm"
      variants={slideFromLeft}
      custom={0}
      initial="hidden"
      animate="visible"
    >
      {/* Search Section */}
      <motion.div 
        className="mb-6"
        variants={slideFromLeft}
        custom={1}
        initial="hidden"
        animate="visible"
      >
        <div className="flex items-center gap-2 mb-4">
          <Search className="h-5 w-5 text-navy" />
          <h2 className="text-xl font-semibold text-navy" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 400 }}>Search Posts</h2>
        </div>
        <Input
          type="search"
          placeholder="Search blog posts..."
          onChange={(e) => onSearch(e.target.value)}
          className="max-w-md"
        />
      </motion.div>

      {/* Categories Section */}
      {categories.length > 0 && (
        <motion.div 
          className="mb-6"
          variants={slideFromLeft}
          custom={2}
          initial="hidden"
          animate="visible"
        >
          <div className="flex items-center gap-2 mb-4">
            <Filter className="h-5 w-5 text-navy" />
            <h2 className="text-xl font-semibold text-navy" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 400 }}>Filter by Category</h2>
          </div>
          
          <div className="flex flex-wrap gap-3">
            {/* All Categories Button */}
            <motion.button 
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
                !selectedCategory 
                  ? 'bg-navy text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              onClick={() => onSelectCategory(null)}
              variants={slideFromLeft}
              custom={3}
              initial="hidden"
              animate="visible"
              style={{ fontFamily: 'Inter, sans-serif', fontWeight: 400 }}
            >
              All Categories
            </motion.button>
            
            {/* Category Buttons */}
            {categories.map((category, index) => (
              <motion.button 
                key={category} 
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
                  selectedCategory === category 
                    ? 'bg-navy text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                onClick={() => onSelectCategory(category)}
                variants={slideFromLeft}
                custom={4 + index}
                initial="hidden"
                animate="visible"
                style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}
              >
                {category}
              </motion.button>
            ))}
          </div>
        </motion.div>
      )}
      
      {/* Tags Section */}
      {tags.length > 0 && (
        <motion.div 
          className="pt-4 border-t border-gray-200"
          variants={slideFromLeft}
          custom={4 + categories.length}
          initial="hidden"
          animate="visible"
        >
          <div className="flex items-center gap-2 mb-4">
            <Tag className="h-5 w-5 text-black" />
            <h2 className="text-xl font-semibold text-navy" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 400 }}>Filter by Tags</h2>
          </div>
          
          {/* Desktop View - Button Grid */}
          <div className="hidden md:flex flex-wrap gap-2">
            {/* All Tags Button */}
            <motion.button 
              className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium transition-colors duration-200 ${
                !selectedTag 
                  ? 'bg-black text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              onClick={() => onSelectTag(null)}
              variants={slideFromLeft}
              custom={5 + categories.length}
              initial="hidden"
              animate="visible"
            >
               Tags
            </motion.button>
            
            {/* Tag Buttons */}
            {tags.map((tag, index) => (
              <motion.button 
                key={tag} 
                className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium transition-colors duration-200 ${
                  selectedTag === tag 
                    ? 'bg-black text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                onClick={() => onSelectTag(tag)}
                variants={slideFromLeft}
                custom={6 + categories.length + index}
                initial="hidden"
                animate="visible"
              >
                <Tag size={14} className="mr-1.5" />
                {tag}
              </motion.button>
            ))}
          </div>

          {/* Mobile View - Dropdown */}
          <motion.div 
            className="md:hidden relative"
            variants={slideFromLeft}
            custom={5 + categories.length}
            initial="hidden"
            animate="visible"
          >
            {/* Dropdown Button */}
            <button
              className="w-full flex items-center justify-between px-4 py-3 bg-gray-100 rounded-lg text-left transition-colors duration-200 hover:bg-gray-200"
              onClick={() => setIsTagDropdownOpen(!isTagDropdownOpen)}
            >
              <div className="flex items-center gap-2">
                <Tag size={16} className="text-black" />
                <span className="text-sm font-medium text-gray-700">
                  {selectedTag || 'All Tags'}
                </span>
              </div>
              <ChevronDown 
                size={16} 
                className={`text-gray-500 transition-transform duration-200 ${
                  isTagDropdownOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {/* Dropdown Menu */}
            {isTagDropdownOpen && (
              <motion.div 
                className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {/* All Tags Option */}
                <button
                  className={`w-full flex items-center gap-2 px-4 py-3 text-left text-sm transition-colors duration-200 ${
                    !selectedTag 
                      ? 'bg-black text-white' 
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                  onClick={() => {
                    onSelectTag(null);
                    setIsTagDropdownOpen(false);
                  }}
                >
                  <Tag size={14} />
                   Tags
                </button>

                {/* Tag Options */}
                {tags.map((tag) => (
                  <button
                    key={tag}
                    className={`w-full flex items-center gap-2 px-4 py-3 font-semibold text-left text-sm transition-colors duration-200 ${
                      selectedTag === tag 
                        ? 'bg-black text-white' 
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                    onClick={() => {
                      onSelectTag(tag);
                      setIsTagDropdownOpen(false);
                    }}
                  >
                    <Tag size={14} />
                    {tag}
                  </button>
                ))}
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default BlogFilter;