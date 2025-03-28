
import { useState } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { PlusCircle, X } from 'lucide-react';

// Blog post type
type BlogPost = {
  id: string;
  title: string;
  content: string;
  published: boolean;
  category: string | null;
  tags: string[] | null;
  created_at: string;
  updated_at: string;
};

// Available categories
const CATEGORIES = [
  'News',
  'Announcement',
  'Guide',
  'Review',
  'Feature',
  'Interview',
  'Case Study'
];

const AdminBlog = () => {
  const [formValues, setFormValues] = useState({
    title: '',
    content: '',
    category: '',
    tags: [] as string[],
    published: true
  });

  const [tagInput, setTagInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Fetch blog posts
  const { data: blogPosts, isLoading, error, refetch } = useQuery({
    queryKey: ['blogPosts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as BlogPost[];
    }
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormValues(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleAddTag = () => {
    if (tagInput && !formValues.tags.includes(tagInput)) {
      setFormValues(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput]
      }));
      setTagInput('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setFormValues(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }));
  };

  const handleEdit = (post: BlogPost) => {
    setFormValues({
      title: post.title,
      content: post.content,
      category: post.category || '',
      tags: post.tags || [],
      published: post.published
    });
    setEditingId(post.id);
    window.scrollTo(0, 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (editingId) {
        // Update existing post
        const { error } = await supabase
          .from('blog_posts')
          .update({
            title: formValues.title,
            content: formValues.content,
            category: formValues.category || null,
            tags: formValues.tags.length > 0 ? formValues.tags : null,
            published: formValues.published,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingId);

        if (error) throw error;
        toast.success('Blog post updated successfully');
      } else {
        // Create new post
        const { error } = await supabase
          .from('blog_posts')
          .insert({
            title: formValues.title,
            content: formValues.content,
            category: formValues.category || null,
            tags: formValues.tags.length > 0 ? formValues.tags : null,
            published: formValues.published
          });

        if (error) throw error;
        toast.success('Blog post created successfully');
      }

      // Reset form and refresh data
      setFormValues({ title: '', content: '', category: '', tags: [], published: true });
      setEditingId(null);
      refetch();
    } catch (error) {
      console.error('Error saving blog post:', error);
      toast.error('Failed to save blog post');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this blog post?')) return;

    try {
      const { error } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Blog post deleted successfully');
      refetch();
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
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-playfair text-navy">Blog Management</h1>
          <a 
            href="/admin/dashboard" 
            className="text-navy underline"
          >
            Back to Dashboard
          </a>
        </div>
        
        <div className="bg-white shadow rounded-lg overflow-hidden mb-8">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-medium text-navy">
              {editingId ? 'Edit Blog Post' : 'Create New Blog Post'}
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formValues.title}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-navy focus:border-navy"
                required
              />
            </div>

            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                id="category"
                name="category"
                value={formValues.category}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-navy focus:border-navy"
              >
                <option value="">Select a category</option>
                {CATEGORIES.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-1">
                Tags
              </label>
              <div className="flex items-center">
                <input
                  type="text"
                  id="tagInput"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  className="flex-1 border border-gray-300 rounded-md shadow-sm p-2 focus:ring-navy focus:border-navy"
                  placeholder="Add a tag and press Enter or Add"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddTag();
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="ml-2 px-4 py-2 bg-navy text-white rounded-md hover:bg-opacity-90 transition-colors"
                >
                  Add
                </button>
              </div>
              {formValues.tags.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {formValues.tags.map(tag => (
                    <span 
                      key={tag} 
                      className="inline-flex items-center px-2 py-1 rounded-full text-sm bg-terracotta bg-opacity-20 text-terracotta"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="ml-1 text-terracotta hover:text-red-600"
                      >
                        <X size={14} />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
                Content
              </label>
              <textarea
                id="content"
                name="content"
                value={formValues.content}
                onChange={handleChange}
                rows={8}
                className="w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-navy focus:border-navy"
                required
              />
              <p className="text-sm text-gray-500 mt-1">
                Markdown formatting is supported
              </p>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="published"
                name="published"
                checked={formValues.published}
                onChange={handleChange}
                className="h-4 w-4 text-navy focus:ring-navy border-gray-300 rounded"
              />
              <label htmlFor="published" className="ml-2 block text-sm text-gray-700">
                Publish immediately
              </label>
            </div>

            <div className="flex items-center justify-end space-x-4">
              {editingId && (
                <button
                  type="button"
                  onClick={() => {
                    setFormValues({ title: '', content: '', category: '', tags: [], published: true });
                    setEditingId(null);
                  }}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              )}
              <button
                type="submit"
                className="px-4 py-2 bg-navy text-white rounded-md hover:bg-opacity-90 transition-colors"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Saving...' : (editingId ? 'Update Post' : 'Create Post')}
              </button>
            </div>
          </form>
        </div>

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
                        onClick={() => handleEdit(post)}
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
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminBlog;
