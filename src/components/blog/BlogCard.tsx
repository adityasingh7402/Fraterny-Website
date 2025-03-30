
import React from 'react';
import { Link } from 'react-router-dom';
import ResponsiveImage from '../ui/ResponsiveImage';

export type BlogPost = {
  id: string;
  title: string;
  content: string;
  published: boolean;
  category: string | null;
  tags: string[] | null;
  created_at: string;
  updated_at: string;
  image_key?: string | null; // Optional image key for the blog post thumbnail
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
      {/* Conditionally show image if image_key is available */}
      {post.image_key && (
        <div className="w-full aspect-[16/9] overflow-hidden">
          <ResponsiveImage
            dynamicKey={post.image_key}
            alt={post.title}
            size="medium" // Use medium size for better performance
            className="w-full h-full object-cover transition-transform hover:scale-105"
            loading="lazy"
          />
        </div>
      )}
      
      <div className="p-6 flex-grow">
        {post.category && (
          <span className="inline-block px-2 py-1 bg-navy bg-opacity-10 text-navy text-xs rounded mb-2">
            {post.category}
          </span>
        )}
        <h2 className="text-xl font-playfair font-bold text-navy mb-2 line-clamp-2">{post.title}</h2>
        <p className="text-sm text-gray-500 mb-3">
          {new Date(post.created_at).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </p>
        <p className="text-gray-600 line-clamp-3">{post.content.substring(0, 160)}...</p>
      </div>
      <div className="px-6 pb-4">
        <span className="text-terracotta font-medium hover:underline">Read more →</span>
      </div>
    </Link>
  );
};

export default BlogCard;
