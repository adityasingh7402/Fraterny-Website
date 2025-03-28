
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import BlogHero from '../components/blog/BlogHero';
import BlogFilter from '../components/blog/BlogFilter';
import BlogList from '../components/blog/BlogList';
import { BlogPost } from '../components/blog/BlogCard';

const Blog = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  // Fetch published blog posts
  const { data: blogPosts, isLoading, error } = useQuery({
    queryKey: ['publicBlogPosts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('published', true)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as BlogPost[];
    }
  });

  // Extract all unique categories and tags from blog posts
  const categories = blogPosts ? [...new Set(blogPosts.filter(post => post.category).map(post => post.category))] : [];
  
  const allTags = blogPosts ? 
    blogPosts.reduce((acc, post) => {
      if (post.tags && post.tags.length > 0) {
        return [...acc, ...post.tags];
      }
      return acc;
    }, [] as string[]) : [];
  
  const uniqueTags = [...new Set(allTags)];

  // Filter blog posts based on selected category and tag
  const filteredPosts = blogPosts?.filter(post => {
    const matchesCategory = !selectedCategory || post.category === selectedCategory;
    const matchesTag = !selectedTag || (post.tags && post.tags.includes(selectedTag));
    return matchesCategory && matchesTag;
  });

  return (
    <div className="min-h-screen">
      <Navigation />
      
      <BlogHero />
      
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          {/* Filter controls */}
          <BlogFilter 
            categories={categories}
            uniqueTags={uniqueTags}
            selectedCategory={selectedCategory}
            selectedTag={selectedTag}
            setSelectedCategory={setSelectedCategory}
            setSelectedTag={setSelectedTag}
          />
          
          <BlogList 
            posts={filteredPosts}
            isLoading={isLoading}
            error={error}
            selectedCategory={selectedCategory}
            selectedTag={selectedTag}
            setSelectedCategory={setSelectedCategory}
            setSelectedTag={setSelectedTag}
          />
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Blog;
