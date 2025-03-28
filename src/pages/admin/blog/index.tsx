
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import PageHeader from './components/PageHeader';
import BlogForm from './components/BlogForm';
import BlogList from './components/BlogList';
import { BlogPost, BlogFormValues } from './types';

const AdminBlog = () => {
  const [formValues, setFormValues] = useState<BlogFormValues>({
    title: '',
    content: '',
    category: '',
    tags: [],
    published: true
  });

  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState<boolean>(false);

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

  const handleEdit = (post: BlogPost) => {
    setFormValues({
      title: post.title,
      content: post.content,
      category: post.category || '',
      tags: post.tags || [],
      published: post.published
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
      published: true
    });
    setEditingId(null);
    setShowForm(true);
    window.scrollTo(0, 0);
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
            onSuccess={() => {
              refetch();
              setShowForm(false);
            }}
          />
        )}

        <BlogList 
          blogPosts={blogPosts}
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
