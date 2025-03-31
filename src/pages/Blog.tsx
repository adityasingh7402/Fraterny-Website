
import { useState, useEffect } from 'react';
import { useReactQueryBlogPosts } from '@/hooks/useReactQueryBlogPosts';
import { showError } from '@/utils/errorHandler';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import BlogHero from '@/components/blog/BlogHero';
import BlogFilter from '@/components/blog/BlogFilter';
import BlogList from '@/components/blog/BlogList';
import NewsletterSignup from '../components/blog/NewsletterSignup';

const BlogPage = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 9; // Number of posts per page

  // Use our React Query hook
  const { useBlogPosts, useBlogCategories, useBlogTags } = useReactQueryBlogPosts();
  
  // Fetch blog posts with react query
  const { 
    data, 
    isLoading, 
    error 
  } = useBlogPosts(
    selectedCategory, 
    selectedTag, 
    searchQuery, 
    currentPage, 
    pageSize
  );

  // Get categories and tags
  const { data: categoriesData } = useBlogCategories();
  const { data: tagsData } = useBlogTags();
  
  const posts = data?.posts;
  const totalPosts = data?.total || 0;
  const totalPages = Math.ceil(totalPosts / pageSize);
  
  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, selectedTag, searchQuery]);

  // Show error notifications
  useEffect(() => {
    if (error) {
      console.error('Error fetching blog posts:', error);
      showError('Failed to load blog posts. Please try again later.');
    }
  }, [error]);

  return (
    <div className="min-h-screen">
      <Navigation />
      
      <BlogHero />
      
      <div className="container mx-auto px-4 py-12">
        {/* Blog filter section */}
        <BlogFilter
          categories={categoriesData || []}
          tags={tagsData || []}
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
