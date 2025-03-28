
import React from 'react';
import BlogCard, { BlogPost } from './BlogCard';

interface BlogListProps {
  posts: BlogPost[] | null | undefined;
  isLoading: boolean;
  error: unknown;
  selectedCategory: string | null;
  selectedTag: string | null;
  setSelectedCategory: (category: string | null) => void;
  setSelectedTag: (tag: string | null) => void;
}

const BlogList: React.FC<BlogListProps> = ({ 
  posts, 
  isLoading, 
  error, 
  selectedCategory, 
  selectedTag, 
  setSelectedCategory, 
  setSelectedTag 
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
      <div className="text-center py-20">
        <p className="text-red-600">Failed to load blog posts</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-navy text-white rounded-md hover:bg-opacity-90"
        >
          Retry
        </button>
      </div>
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
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
      {posts.map((post) => (
        <BlogCard key={post.id} post={post} />
      ))}
    </div>
  );
};

export default BlogList;
