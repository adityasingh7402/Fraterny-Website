
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useReactQueryBlogPosts } from '@/hooks/useReactQueryBlogPosts';
import { supabase } from '@/integrations/supabase/client';
import PageHeader from './components/PageHeader';
import BlogForm from './components/BlogForm';
import BlogList from './components/BlogList';
import { BlogFormValues, BlogPost } from './types';

type TabType = 'published' | 'draft';

const AdminBlog = () => {
  const [activeTab, setActiveTab] = useState<TabType>('published');
  const [formValues, setFormValues] = useState<BlogFormValues>({
    title: '',
    content: '',
    category: '',
    tags: [],
    published: true,
    image_key: null,
    meta_description: '',
    meta_keywords: [],
    slug: '',
    seo_title: '',
    excerpt: '',
    featured_image_alt: '',
    social_image_key: null,
    reading_time: 0,
  });

  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState<boolean>(false);

  

  // Use React Query hook for fetching all blog posts (including unpublished)
  const fetchAdminBlogPosts = async () => {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data as BlogPost[];
  };

  const { data: blogPosts, isLoading, error, refetch } = useQuery({
    queryKey: ['adminBlogPosts'],
    queryFn: fetchAdminBlogPosts,
  });

  const handleEdit = (post: BlogPost) => {
    setFormValues({
      title: post.title,
      content: post.content,
      category: post.category || '',
      tags: post.tags || [],
      published: post.published,
      image_key: post.image_key || null,
      meta_description: post.meta_description || '',
      meta_keywords: post.meta_keywords || [],
      slug: post.slug || '',
      seo_title: post.seo_title || '',
      excerpt: post.excerpt || '',
      featured_image_alt: post.featured_image_alt || '',
      social_image_key: post.social_image_key || null,
      reading_time: post.reading_time || 0,
    });
    setEditingId(post.id);
    setShowForm(true);
    window.scrollTo(0, 0);
  };

  const handleNewPost = () => {
    setFormValues({
      title: '',
      content: '',
      category: '',
      tags: [],
      published: true,
      image_key: null,
      meta_description: '',
      meta_keywords: [],
      slug: '',
      seo_title: '',
      excerpt: '',
      featured_image_alt: '',
      social_image_key: null,
      reading_time: 0,
    });
    setEditingId(null);
    setShowForm(true);
    window.scrollTo(0, 0);
  };

  // Access the invalidate function to refresh data after changes
  const { invalidateBlogPosts } = useReactQueryBlogPosts();

  const handleFormSuccess = async () => {
    // Refetch admin posts
    await refetch();
    // Invalidate public blog posts to ensure consistent data
    await invalidateBlogPosts();
    setShowForm(false);
  };

  // Filter blog posts based on active tab
  const filteredBlogPosts = blogPosts?.filter(post => 
    activeTab === 'published' ? post.published : !post.published
  ) || [];

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <PageHeader onNewPostClick={handleNewPost} />
        
        {showForm && (
          <BlogForm 
            editingId={editingId}
            formValues={formValues}
            setFormValues={setFormValues}
            setEditingId={setEditingId}
            onSuccess={handleFormSuccess}
          />
        )}

        {/* Tabs */}
        <div className="mb-6 border-b border-gray-200">
          <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            <button
              onClick={() => setActiveTab('published')}
              className={`
                whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                ${
                  activeTab === 'published'
                    ? 'border-navy text-navy'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }
              `}
            >
              Published
              {blogPosts && (
                <span className="ml-2 py-0.5 px-2 rounded-full bg-gray-100 text-gray-900 text-xs">
                  {blogPosts.filter(p => p.published).length}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('draft')}
              className={`
                whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                ${
                  activeTab === 'draft'
                    ? 'border-navy text-navy'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }
              `}
            >
              Drafts
              {blogPosts && (
                <span className="ml-2 py-0.5 px-2 rounded-full bg-gray-100 text-gray-900 text-xs">
                  {blogPosts.filter(p => !p.published).length}
                </span>
              )}
            </button>
          </nav>
        </div>

        <BlogList 
          blogPosts={filteredBlogPosts}
          isLoading={isLoading}
          error={error}
          onEdit={handleEdit}
          refetch={refetch}
          activeTab={activeTab}
        />
      </div>
    </div>
  );
};

export default AdminBlog;