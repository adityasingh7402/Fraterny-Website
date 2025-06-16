import React from 'react';
import { Tag, Filter, Search } from 'lucide-react';
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
  if (categories.length === 0 && tags.length === 0) {
    return null;
  }
  
  return (
    <div className="mb-8 bg-white rounded-lg p-6 shadow-sm">
      {/* Search Section */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Search className="h-5 w-5 text-navy" />
          <h2 className="text-xl font-semibold text-navy">Search Posts</h2>
        </div>
        <Input
          type="search"
          placeholder="Search blog posts..."
          onChange={(e) => onSearch(e.target.value)}
          className="max-w-md"
        />
      </div>

      {/* Categories Section */}
      {categories.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="h-5 w-5 text-navy" />
            <h2 className="text-xl font-semibold text-navy">Filter by Category</h2>
          </div>
          
          <div className="flex flex-wrap gap-3">
            <button 
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                !selectedCategory 
                  ? 'bg-navy text-white shadow-md' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              onClick={() => onSelectCategory(null)}
            >
              All Categories
            </button>
            {categories.map(category => (
              <button 
                key={category} 
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedCategory === category 
                    ? 'bg-navy text-white shadow-md' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                onClick={() => onSelectCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      )}
      
      {/* Tags Section */}
      {tags.length > 0 && (
        <div className="pt-4 border-t border-gray-200">
          <div className="flex items-center gap-2 mb-4">
            <Tag className="h-5 w-5 text-terracotta" />
            <h2 className="text-xl font-semibold text-navy">Filter by Tags</h2>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <button 
              className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                !selectedTag 
                  ? 'bg-terracotta text-white shadow-md' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              onClick={() => onSelectTag(null)}
            >
              All Tags
            </button>
            {tags.map(tag => (
              <button 
                key={tag} 
                className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                  selectedTag === tag 
                    ? 'bg-terracotta text-white shadow-md' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                onClick={() => onSelectTag(tag)}
              >
                <Tag size={14} className="mr-1.5" />
                {tag}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogFilter;
