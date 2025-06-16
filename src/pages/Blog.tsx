import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useReactQueryBlogPosts } from '@/hooks/useReactQueryBlogPosts';
import { showError } from '@/utils/errorHandler';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import BlogHero from '@/components/blog/BlogHero';
import BlogFilter from '@/components/blog/BlogFilter';
import BlogList from '@/components/blog/BlogList';
import NewsletterSignup from '../components/blog/NewsletterSignup';

const BlogPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Initialize state from URL parameters
  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    searchParams.get('category')
  );
  const [selectedTag, setSelectedTag] = useState<string | null>(
    searchParams.get('tag')
  );
  const [searchQuery, setSearchQuery] = useState<string>(
    searchParams.get('search') || ''
  );
  const [currentPage, setCurrentPage] = useState<number>(
    parseInt(searchParams.get('page') || '1', 10)
  );
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

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    
    if (selectedCategory) {
      params.set('category', selectedCategory);
    }
    if (selectedTag) {
      params.set('tag', selectedTag);
    }
    if (searchQuery) {
      params.set('search', searchQuery);
    }
    if (currentPage > 1) {
      params.set('page', currentPage.toString());
    }
    
    setSearchParams(params, { replace: true });
  }, [selectedCategory, selectedTag, searchQuery, currentPage, setSearchParams]);
  
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
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <BlogHero />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
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
          
          {/* Newsletter Section with visual connection */}
          <div className="relative mt-12">
            <div className="absolute inset-0 flex items-center" aria-hidden="true">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="bg-gray-50 px-4 text-sm text-gray-500">Stay Updated</span>
            </div>
          </div>
          
          <div className="mt-8">
            <NewsletterSignup />
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default BlogPage;
