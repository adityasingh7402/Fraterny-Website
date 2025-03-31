
import { useState } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import ResponsiveImage from '@/components/ui/ResponsiveImage';
import { useReactQueryBlogPosts } from '@/hooks/useReactQueryBlogPosts';
import { BlogPost } from '@/services/blog-posts';

interface BlogListProps {
  blogPosts: BlogPost[] | null;
  isLoading: boolean;
  error: Error | unknown | null;
  onEdit: (post: BlogPost) => void;
  refetch: () => void;
}

const BlogList = ({ blogPosts, isLoading, error, onEdit, refetch }: BlogListProps) => {
  const { invalidateBlogPosts } = useReactQueryBlogPosts();

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this blog post?')) return;

    try {
      const { error } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      // Invalidate both admin and public blog posts queries
      await refetch();
      await invalidateBlogPosts();
      
      toast.success('Blog post deleted successfully');
    } catch (error) {
      console.error('Error deleting blog post:', error);
      toast.error('Failed to delete blog post');
    }
  };

  // Status labels for blog posts
  const getStatusLabel = (post: BlogPost) => {
    if (!post.published) return <span className="px-2 py-1 bg-gray-200 text-gray-700 text-xs rounded">Draft</span>;
    return <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">Published</span>;
  };

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-medium text-navy">Blog Posts</h2>
      </div>

      <div className="divide-y divide-gray-200">
        {isLoading ? (
          <div className="p-6 text-center">Loading blog posts...</div>
        ) : error ? (
          <div className="p-6 text-center text-red-600">Failed to load blog posts</div>
        ) : blogPosts?.length === 0 ? (
          <div className="p-6 text-center text-gray-500">No blog posts yet</div>
        ) : (
          blogPosts?.map((post) => (
            <div key={post.id} className="p-6">
              <div className="flex gap-4">
                {/* Blog image thumbnail with responsive handling */}
                {post.image_key ? (
                  <div className="flex-shrink-0 w-24 h-24 rounded overflow-hidden bg-gray-100">
                    <ResponsiveImage
                      dynamicKey={post.image_key}
                      alt={post.title}
                      size="small"
                      className="w-full h-full object-cover"
                      src="" // Provide empty string as src since we're using dynamicKey
                    />
                  </div>
                ) : (
                  <div className="flex-shrink-0 w-24 h-24 rounded bg-gray-100 flex items-center justify-center text-gray-400">
                    No image
                  </div>
                )}
                
                <div className="flex-grow">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">{post.title}</h3>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {post.category && (
                          <span className="px-2 py-1 bg-navy bg-opacity-10 text-navy text-xs rounded">
                            {post.category}
                          </span>
                        )}
                        {getStatusLabel(post)}
                        <span className="text-sm text-gray-500">
                          {new Date(post.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      {post.tags && post.tags.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1">
                          {post.tags.map(tag => (
                            <span key={tag} className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded">
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="flex space-x-3">
                      <button
                        onClick={() => onEdit(post)}
                        className="text-navy hover:underline"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(post.id)}
                        className="text-red-600 hover:underline"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                  <p className="mt-2 text-gray-700 line-clamp-2">{post.content.substring(0, 150)}...</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default BlogList;
