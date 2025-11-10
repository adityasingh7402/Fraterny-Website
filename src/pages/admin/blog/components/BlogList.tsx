
import { useState } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import ResponsiveImage from '@/components/ui/ResponsiveImage';
import { useReactQueryBlogPosts } from '@/hooks/useReactQueryBlogPosts';
import { BlogPost } from '@/services/blog-posts';
import { removeExistingImage } from '@/services/images/utils/cleanupUtils';
import { WebsiteImage } from '@/services/images/types';

interface BlogListProps {
  blogPosts: BlogPost[] | null;
  isLoading: boolean;
  error: Error | unknown | null;
  onEdit: (post: BlogPost) => void;
  refetch: () => void;
  activeTab?: 'published' | 'draft';
}

const BlogList = ({ blogPosts, isLoading, error, onEdit, refetch, activeTab }: BlogListProps) => {
  const { invalidateBlogPosts } = useReactQueryBlogPosts();

  const handlePublish = async (id: string) => {
    if (!confirm('Publish this blog post?')) return;

    try {
      const { error } = await supabase
        .from('blog_posts')
        .update({ published: true, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;
      
      // Refresh data
      await refetch();
      await invalidateBlogPosts();
      
      toast.success('Blog post published successfully');
    } catch (error) {
      console.error('Error publishing blog post:', error);
      toast.error('Failed to publish blog post');
    }
  };

  const handleUnpublish = async (id: string) => {
    if (!confirm('Move this blog post to drafts?')) return;

    try {
      const { error } = await supabase
        .from('blog_posts')
        .update({ published: false, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;
      
      // Refresh data
      await refetch();
      await invalidateBlogPosts();
      
      toast.success('Blog post moved to drafts');
    } catch (error) {
      console.error('Error unpublishing blog post:', error);
      toast.error('Failed to move blog post to drafts');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this blog post?')) return;

    try {
      // First, get the blog post to check if it has an associated image
      const { data: blogPost, error: fetchError } = await supabase
        .from('blog_posts')
        .select('id, image_key')
        .eq('id', id)
        .single();

      if (fetchError) {
        console.error('Error fetching blog post:', fetchError);
        throw fetchError;
      }

      // If the blog post has an associated image, delete it from storage first
      if (blogPost?.image_key) {
        console.log(`🖼️ Blog post has image_key: ${blogPost.image_key}`);
        
        try {
          // Get the image record from website_images table
          const { data: imageRecord, error: imageError } = await supabase
            .from('website_images')
            .select('*')
            .eq('key', blogPost.image_key)
            .single();

          if (imageError) {
            console.warn('Image record not found, proceeding with blog post deletion:', imageError);
          } else if (imageRecord) {
            console.log(`🗑️ Deleting associated image: ${imageRecord.key}`);
            
            // Use the existing cleanup utility to remove the image
            await removeExistingImage(imageRecord as WebsiteImage);
            console.log('✅ Image deleted successfully');
          }
        } catch (imageDeleteError) {
          console.error('Error deleting associated image:', imageDeleteError);
          toast.error('Warning: Failed to delete associated image, but proceeding with blog post deletion');
        }
      }

      // Now delete the blog post
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

  // Helper function to parse PostgreSQL array strings
const parsePostgresArray = (value: any): string[] => {
  if (Array.isArray(value)) return value;
  if (!value) return [];
  if (typeof value === 'string') {
    // Remove curly braces and parse
    const cleaned = value.replace(/^\{|\}$/g, '');
    if (!cleaned) return [];
    // Split by comma, handle quoted strings
    return cleaned.match(/(?:[^,"]+|"[^"]*")+/g)?.map(s => s.replace(/^"|"$/g, '').trim()) || [];
  }
  return [];
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

          (() => {
    console.log('🔍 [DEBUG] All blog posts:', blogPosts);
    // map over blogPosts array to log each post
    blogPosts?.forEach((post) => {
      console.log('🔍 [DEBUG] Post tags:', {
        parsedTags: parsePostgresArray(post.tags)
});
    });
    return null;
  })(),
          
          blogPosts?.map((post) => (
            <div key={post.id} className="p-6">
              <div className="flex gap-4">
                {/* Blog image thumbnail with responsive handling */}
                {post.image_key ? (
                  <div className="flex-shrink-0 w-24 h-24 rounded overflow-hidden bg-gray-100">
                    <ResponsiveImage
                      dynamicKey={post.image_key}
                      alt={post.title}
                      sizes="small"
                      className="w-full h-full object-cover"
                      // src="" // Provide empty string as src since we're using dynamicKey
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
                      {post.tags && parsePostgresArray(post.tags).length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1">
                          {parsePostgresArray(post.tags).map(tag => (
                            <span key={tag} className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded">
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="flex space-x-3">
                      {!post.published && (
                        <button
                          onClick={() => handlePublish(post.id)}
                          className="text-green-600 hover:underline font-medium"
                        >
                          Publish
                        </button>
                      )}
                      {post.published && (
                        <button
                          onClick={() => handleUnpublish(post.id)}
                          className="text-orange-600 hover:underline"
                        >
                          Unpublish
                        </button>
                      )}
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
