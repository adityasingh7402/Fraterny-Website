
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
  image_key: string | null;
};

interface BlogCardProps {
  post: BlogPost;
}

const BlogCard: React.FC<BlogCardProps> = ({ post }) => {
  return (
    <Link 
      to={`/blog/${post.id}`}
      className="group bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow flex flex-col h-full"
    >
      <div className="relative w-full aspect-[16/9] overflow-hidden">
        {/* Background overlay */}
        <div className="absolute inset-0 bg-navy bg-opacity-50 z-10"></div>

        {/* Post image */}
        {post.image_key ? (
          <ResponsiveImage
            dynamicKey={post.image_key}
            alt={post.title}
            size="medium"
            className="w-full h-full object-cover transition-transform group-hover:scale-105"
            loading="lazy"
            fallbackSrc="/placeholder.svg"
            src="" // Empty string as src since we're using dynamicKey
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-b from-navy to-terracotta opacity-40"></div>
        )}

        {/* Overlay content positioned at the bottom */}
        <div className="absolute bottom-0 left-0 right-0 z-20 p-6 bg-gradient-to-t from-black/80 to-transparent">
          {post.category && (
            <span className="inline-block px-2 py-1 bg-navy bg-opacity-80 text-white text-xs font-medium rounded mb-2">
              {post.category}
            </span>
          )}
          <h2 className="text-xl font-playfair font-bold text-white mb-2 line-clamp-2">
            {post.title}
          </h2>
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-200">
              {new Date(post.created_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
            <span className="text-terracotta font-medium group-hover:underline">Read more →</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default BlogCard;
