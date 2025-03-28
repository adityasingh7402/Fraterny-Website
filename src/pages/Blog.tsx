
import { useState, useEffect, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { showError } from '@/utils/errorHandler';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import BlogCard, { BlogPost } from '@/components/blog/BlogCard';
import BlogHero from '@/components/blog/BlogHero';
import BlogFilter from '@/components/blog/BlogFilter';
import BlogList from '@/components/blog/BlogList';
import NewsletterSignup from '../components/blog/NewsletterSignup';

// Fetch blog posts from Supabase
const fetchBlogPosts = async (
  category: string | null,
  tag: string | null,
  searchQuery: string,
  page: number,
  pageSize: number
): Promise<{ posts: BlogPost[]; total: number }> => {
  // First, get the total count with a separate query
  let countQuery = supabase
    .from('blog_posts')
    .select('id', { count: 'exact' })
    .eq('published', true);
  
  if (category) {
    countQuery = countQuery.eq('category', category);
  }
  if (tag) {
    countQuery = countQuery.contains('tags', [tag]);
  }
  if (searchQuery) {
    countQuery = countQuery.ilike('title', `%${searchQuery}%`);
  }
  
  const { count, error: countError } = await countQuery;
  
  if (countError) {
    throw countError;
  }
  
  // Then get the actual data
  let dataQuery = supabase
    .from('blog_posts')
    .select('*')
    .eq('published', true);
  
  if (category) {
    dataQuery = dataQuery.eq('category', category);
  }
  if (tag) {
    dataQuery = dataQuery.contains('tags', [tag]);
  }
  if (searchQuery) {
    dataQuery = dataQuery.ilike('title', `%${searchQuery}%`);
  }
  
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;
  
  dataQuery = dataQuery.range(from, to).order('created_at', { ascending: false });
  
  const { data, error } = await dataQuery;
  
  if (error) {
    throw error;
  }
  
  return { 
    posts: data as BlogPost[], 
    total: count || 0 
  };
};

const BlogPage = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 9; // Number of posts per page
  
  const { 
    data, 
    isLoading, 
    error, 
    refetch 
  } = useQuery({
    queryKey: ['blogPosts', selectedCategory, selectedTag, searchQuery, currentPage, pageSize],
    queryFn: () => fetchBlogPosts(selectedCategory, selectedTag, searchQuery, currentPage, pageSize),
    onError: (err) => {
      console.error('Error fetching blog posts:', err);
    }
  });
  
  const posts = data?.posts;
  const totalPosts = data?.total || 0;
  const totalPages = Math.ceil(totalPosts / pageSize);
  
  // Extract unique categories and tags for filtering
  const uniqueCategories = useCallback(() => {
    if (!posts) return [];
    const categories = new Set<string>();
    posts.forEach(post => post.category && categories.add(post.category));
    return Array.from(categories);
  }, [posts]);
  
  const uniqueTags = useCallback(() => {
    if (!posts) return [];
    const tags = new Set<string>();
    posts.forEach(post => post.tags?.forEach(tag => tags.add(tag)));
    return Array.from(tags);
  }, [posts]);
  
  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, selectedTag, searchQuery]);

  return (
    <div className="min-h-screen">
      <Navigation />
      
      <BlogHero />
      
      <div className="container mx-auto px-4 py-12">
        {/* Blog filter section */}
        <BlogFilter
          categories={uniqueCategories()}
          tags={uniqueTags()}
          selectedCategory={selectedCategory}
          selectedTag={selectedTag}
          onSelectCategory={setSelectedCategory}
          onSelectTag={setSelectedTag}
          onSearch={setSearchQuery}
        />
        
        {/* Blog listing */}
        <BlogList
          posts={posts}
          isLoading={isLoading}
          error={error}
          selectedCategory={selectedCategory}
          selectedTag={selectedTag}
          setSelectedCategory={setSelectedCategory}
          setSelectedTag={setSelectedTag}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          refetch={refetch}
        />
        
        {/* Add Newsletter Section */}
        <div className="mt-16">
          <NewsletterSignup />
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default BlogPage;
