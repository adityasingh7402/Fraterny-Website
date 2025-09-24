import React from 'react';
import { motion } from 'framer-motion';
import BlogCard, { BlogPost } from './BlogCard';
import BlogErrorState from './BlogErrorState';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';

interface BlogListProps {
  posts: BlogPost[] | null | undefined;
  isLoading: boolean;
  error: unknown;
  selectedCategory: string | null;
  selectedTag: string | null;
  setSelectedCategory: (category: string | null) => void;
  setSelectedTag: (tag: string | null) => void;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  refetch?: () => void;
}

const BlogList: React.FC<BlogListProps> = ({ 
  posts, 
  isLoading, 
  error, 
  selectedCategory, 
  selectedTag, 
  setSelectedCategory, 
  setSelectedTag,
  currentPage,
  totalPages,
  onPageChange,
  refetch
}) => {
  // Animation variants for the grid container
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.8,
        staggerChildren: 0.2, // Increased delay between cards
        delayChildren: 0.2,   // Initial delay before first card
        ease: "easeOut"
      }
    }
  };

  // Enhanced animation variants for individual cards
  const cardVariants = {
    hidden: { 
      opacity: 0,
      y: 60,        // Start further down
      scale: 0.8,   // Start smaller
      rotateX: 10   // Slight 3D tilt effect
    },
    visible: { 
      opacity: 1,
      y: 0,
      scale: 1,
      rotateX: 0,
      transition: {
        type: "spring",
        stiffness: 120,
        damping: 20,
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94] // Custom cubic-bezier
      }
    }
  };

  // Loading animation variants
  const loadingVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  // Empty state animation variants
  const emptyStateVariants = {
    hidden: { 
      opacity: 0,
      y: 40,
      scale: 0.9
    },
    visible: { 
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
        staggerChildren: 0.2
      }
    }
  };

  // Loading State
  if (isLoading) {
    return (
      <motion.div 
        className="text-center py-20"
        initial="hidden"
        animate="visible"
      >
        <motion.div 
          className="inline-block h-8 w-8 rounded-full border-4 border-solid border-navy border-r-transparent"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
        <motion.p 
          className="mt-4 text-gray-600"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          Loading blog posts...
        </motion.p>
      </motion.div>
    );
  }
  
  // Error State
  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <BlogErrorState 
          message="Failed to load blog posts" 
          onRetry={refetch}
          error={error}
        />
      </motion.div>
    );
  }
  
  // Empty State
  if (posts !== undefined && posts !== null && posts.length === 0) {
    return (
      <motion.div 
        className="text-center py-20"
        initial="hidden"
        animate="visible"
      >
        <motion.h2 
          className="text-2xl font-playfair text-navy mb-4"
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0 }
          }}
        >
          No matching posts found
        </motion.h2>
        
        <motion.p 
          className="text-gray-600 mb-6"
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0 }
          }}
        >
          {selectedCategory || selectedTag ? 
            'Try changing your filters to see more content.' : 
            "We're working on our first blog posts. Check back soon!"}
        </motion.p>
        
        {(selectedCategory || selectedTag) && (
          <motion.button 
            onClick={() => {
              setSelectedCategory(null);
              setSelectedTag(null);
            }}
            className="px-6 py-3 bg-navy text-white rounded-lg hover:bg-opacity-90 transition-colors"
            variants={{
              hidden: { opacity: 0, scale: 0.9 },
              visible: { opacity: 1, scale: 1 }
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            Clear filters
          </motion.button>
        )}
      </motion.div>
    );
  }

  // Blog Posts Grid
  return (
    <div className="space-y-10">
      {/* Blog Cards Grid with Simple Animations */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 gap-8"
        // variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {posts && posts.map((post, index) => (
          <motion.div
            key={post.id}
            custom={index} // Pass index for advanced animations
            whileHover={{ 
              y: -12,
              transition: { 
                type: "spring", 
                stiffness: 400, 
                damping: 25,
                duration: 0.3
              }
            }}
            whileTap={{ 
              scale: 0.97,
              transition: { duration: 0.1 }
            }}
            // Add subtle entrance animation with custom delay
            initial="hidden"
            animate="visible"
            style={{
              transformStyle: "preserve-3d", // Enable 3D transforms
            }}
          >
            <BlogCard post={post} />
          </motion.div>
        ))}
      </motion.div>
      
      {/* Pagination with Simple Animation */}
      {totalPages > 1 && (
        <motion.div
          className="my-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <Pagination>
            <PaginationContent>
              {/* Previous Button */}
              {currentPage > 1 && (
                <PaginationItem>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <PaginationPrevious 
                      href="#" 
                      onClick={(e) => {
                        e.preventDefault();
                        onPageChange(currentPage - 1);
                      }} 
                      className="transition-colors duration-200"
                    />
                  </motion.div>
                </PaginationItem>
              )}
              
              {/* Page Numbers */}
              {Array.from({ length: totalPages }).map((_, index) => (
                <PaginationItem key={index}>
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + (index * 0.05) }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <PaginationLink 
                      href="#" 
                      isActive={currentPage === index + 1}
                      onClick={(e) => {
                        e.preventDefault();
                        onPageChange(index + 1);
                      }}
                      className="transition-all duration-200"
                    >
                      {index + 1}
                    </PaginationLink>
                  </motion.div>
                </PaginationItem>
              ))}
              
              {/* Next Button */}
              {currentPage < totalPages && (
                <PaginationItem>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <PaginationNext 
                      href="#" 
                      onClick={(e) => {
                        e.preventDefault();
                        onPageChange(currentPage + 1);
                      }} 
                      className="transition-colors duration-200"
                    />
                  </motion.div>
                </PaginationItem>
              )}
            </PaginationContent>
          </Pagination>
        </motion.div>
      )}
    </div>
  );
};

export default BlogList;