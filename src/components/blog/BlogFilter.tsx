
import React from 'react';
import { Tag } from 'lucide-react';

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
  if (categories.length === 0 && tags.length === 0) {
    return null;
  }
  
  return (
    <div className="mb-10">
      {categories.length > 0 && (
        <div className="flex flex-wrap items-center gap-4 mb-6">
          <h2 className="text-lg font-medium text-navy">Filter by:</h2>
          
          <div className="flex flex-wrap gap-2">
            <button 
              className={`px-3 py-1 rounded-full text-sm ${!selectedCategory ? 'bg-navy text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
              onClick={() => onSelectCategory(null)}
            >
              All Categories
            </button>
            {categories.map(category => (
              <button 
                key={category} 
                className={`px-3 py-1 rounded-full text-sm ${selectedCategory === category ? 'bg-navy text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                onClick={() => onSelectCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      )}
      
      {tags.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-gray-700">Tags:</span>
          <button 
            className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${!selectedTag ? 'bg-terracotta text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
            onClick={() => onSelectTag(null)}
          >
            All
          </button>
          {tags.map(tag => (
            <button 
              key={tag} 
              className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${selectedTag === tag ? 'bg-terracotta text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
              onClick={() => onSelectTag(tag)}
            >
              <Tag size={12} className="mr-1" />
              {tag}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default BlogFilter;
