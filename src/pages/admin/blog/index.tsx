
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useReactQueryBlogPosts } from '@/hooks/useReactQueryBlogPosts';
import { supabase } from '@/integrations/supabase/client';
import PageHeader from './components/PageHeader';
import BlogForm from './components/BlogForm';
import BlogList from './components/BlogList';
import { BlogFormValues, BlogPost } from './types';

const AdminBlog = () => {
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

        <BlogList 
          blogPosts={blogPosts || null}
          isLoading={isLoading}
          error={error}
          onEdit={handleEdit}
          refetch={refetch}
        />
      </div>
    </div>
  );
};

export default AdminBlog;