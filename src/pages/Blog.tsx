
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import BlogHero from '../components/blog/BlogHero';
import BlogFilter from '../components/blog/BlogFilter';
import BlogList from '../components/blog/BlogList';
import { BlogPost } from '../components/blog/BlogCard';
import { showError } from '@/utils/errorHandler';

// Number of posts to display per page
const POSTS_PER_PAGE = 9;

const Blog = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPosts, setTotalPosts] = useState(0);

  // Fetch published blog posts with pagination
  const { data: blogPosts, isLoading, error, refetch } = useQuery({
    queryKey: ['publicBlogPosts', currentPage, selectedCategory, selectedTag],
    queryFn: async () => {
      // Start with a base query for published posts
      let query = supabase
        .from('blog_posts')
        .select('*', { count: 'exact' })
        .eq('published', true);
      
      // Apply category filter if selected
      if (selectedCategory) {
        query = query.eq('category', selectedCategory);
      }
      
      // Apply tag filter if selected
      if (selectedTag) {
        query = query.contains('tags', [selectedTag]);
      }
      
      // First get the count
      const { count } = await query;
      setTotalPosts(count || 0);
      
      // Then get the paginated data
      const { data, error } = await query
        .order('created_at', { ascending: false })
        .range((currentPage - 1) * POSTS_PER_PAGE, currentPage * POSTS_PER_PAGE - 1);
      
      if (error) throw error;
      return data as BlogPost[];
    },
    onError: (error) => {
      showError(error, 'Failed to load blog posts', {
        title: 'Blog Error',
        silent: false
      });
    }
  });

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, selectedTag]);

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

  // Calculate total pages
  const totalPages = Math.ceil(totalPosts / POSTS_PER_PAGE);

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top when changing pages
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen">
      <Navigation />
      
      <BlogHero totalPosts={totalPosts} />
      
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
            posts={blogPosts}
            isLoading={isLoading}
            error={error}
            selectedCategory={selectedCategory}
            selectedTag={selectedTag}
            setSelectedCategory={setSelectedCategory}
            setSelectedTag={setSelectedTag}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            refetch={() => refetch()}
          />
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Blog;
