
import React from 'react';
import { Link } from 'react-router-dom';

export type BlogPost = {
  id: string;
  title: string;
  content: string;
  published: boolean;
  category: string | null;
  tags: string[] | null;
  created_at: string;
  updated_at: string;
};

interface BlogCardProps {
  post: BlogPost;
}

const BlogCard: React.FC<BlogCardProps> = ({ post }) => {
  return (
    <Link 
      to={`/blog/${post.id}`}
      className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow flex flex-col h-full"
    >
      <div className="p-6 flex-grow">
        {post.category && (
          <span className="inline-block px-2 py-1 bg-navy bg-opacity-10 text-navy text-xs rounded mb-2">
            {post.category}
          </span>
        )}
        <h2 className="text-xl font-medium text-navy mb-2 line-clamp-2">{post.title}</h2>
        <p className="text-sm text-gray-500 mb-3">
          {new Date(post.created_at).toLocaleDateString()}
        </p>
        <p className="text-gray-600 line-clamp-3">{post.content.substring(0, 160)}...</p>
        
        {post.tags && post.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1">
            {post.tags.slice(0, 3).map(tag => (
              <span key={tag} className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded">
                {tag}
              </span>
            ))}
            {post.tags.length > 3 && (
              <span className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded">
                +{post.tags.length - 3} more
              </span>
            )}
          </div>
        )}
      </div>
      <div className="px-6 pb-4 text-terracotta font-medium">Read more →</div>
    </Link>
  );
};

export default BlogCard;
