
import React from 'react';
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
  if (isLoading) {
    return (
      <div className="text-center py-20">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-navy border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
        <p className="mt-4 text-gray-600">Loading blog posts...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <BlogErrorState 
        message="Failed to load blog posts" 
        onRetry={refetch}
        error={error}
      />
    );
  }
  
  if (!posts || posts.length === 0) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-playfair text-navy mb-4">No matching posts found</h2>
        <p className="text-gray-600">
          {selectedCategory || selectedTag ? 
            'Try changing your filters to see more content.' : 
            "We're working on our first blog posts. Check back soon!"}
        </p>
        {(selectedCategory || selectedTag) && (
          <button 
            onClick={() => {
              setSelectedCategory(null);
              setSelectedTag(null);
            }}
            className="mt-4 px-4 py-2 bg-navy text-white rounded-md hover:bg-opacity-90 transition-colors"
          >
            Clear filters
          </button>
        )}
      </div>
    );
  }
  
  return (
    <div className="space-y-10">
      <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-8">
        {posts.map((post) => (
          <BlogCard key={post.id} post={post} />
        ))}
      </div>
      
      {totalPages > 1 && (
        <Pagination className="my-8">
          <PaginationContent>
            {currentPage > 1 && (
              <PaginationItem>
                <PaginationPrevious 
                  href="#" 
                  onClick={(e) => {
                    e.preventDefault();
                    onPageChange(currentPage - 1);
                  }} 
                />
              </PaginationItem>
            )}
            
            {Array.from({ length: totalPages }).map((_, index) => (
              <PaginationItem key={index}>
                <PaginationLink 
                  href="#" 
                  isActive={currentPage === index + 1}
                  onClick={(e) => {
                    e.preventDefault();
                    onPageChange(index + 1);
                  }}
                >
                  {index + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            
            {currentPage < totalPages && (
              <PaginationItem>
                <PaginationNext 
                  href="#" 
                  onClick={(e) => {
                    e.preventDefault();
                    onPageChange(currentPage + 1);
                  }} 
                />
              </PaginationItem>
            )}
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
};

export default BlogList;
