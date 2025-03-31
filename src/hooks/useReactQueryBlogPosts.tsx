
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { 
  fetchBlogPosts, 
  fetchBlogPostById,
  fetchBlogCategories,
  fetchBlogTags,
  BlogPost, 
  BlogPostsResponse 
} from '@/services/blog-posts';

/**
 * Custom hook for blog posts using React Query
 */
export const useReactQueryBlogPosts = () => {
  const queryClient = useQueryClient();

  /**
   * Fetch blog posts with filtering and pagination
   */
  const useBlogPosts = (
    category: string | null = null,
    tag: string | null = null,
    searchQuery: string = '',
    page: number = 1,
    pageSize: number = 9
  ) => {
    return useQuery({
      queryKey: ['blogPosts', category, tag, searchQuery, page, pageSize],
      queryFn: () => fetchBlogPosts(category, tag, searchQuery, page, pageSize),
      staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
      gcTime: 10 * 60 * 1000, // Keep in cache for 10 minutes after becoming unused
    });
  };

  /**
   * Fetch a single blog post by ID
   */
  const useBlogPost = (id: string | undefined) => {
    return useQuery({
      queryKey: ['blogPost', id],
      queryFn: () => (id ? fetchBlogPostById(id) : Promise.reject('No post ID provided')),
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
      enabled: !!id, // Only run if we have an ID
    });
  };

  /**
   * Fetch all unique blog categories
   */
  const useBlogCategories = () => {
    return useQuery({
      queryKey: ['blogCategories'],
      queryFn: fetchBlogCategories,
      staleTime: 10 * 60 * 1000, // Categories change less frequently
      gcTime: 30 * 60 * 1000,
    });
  };

  /**
   * Fetch all unique blog tags
   */
  const useBlogTags = () => {
    return useQuery({
      queryKey: ['blogTags'],
      queryFn: fetchBlogTags,
      staleTime: 10 * 60 * 1000, // Tags change less frequently
      gcTime: 30 * 60 * 1000,
    });
  };

  /**
   * Prefetch a blog post by ID (useful for navigation)
   */
  const prefetchBlogPost = async (id: string) => {
    await queryClient.prefetchQuery({
      queryKey: ['blogPost', id],
      queryFn: () => fetchBlogPostById(id),
      staleTime: 5 * 60 * 1000,
    });
  };

  /**
   * Invalidate blog posts cache (useful after updates)
   */
  const invalidateBlogPosts = async () => {
    await queryClient.invalidateQueries({ queryKey: ['blogPosts'] });
  };

  return {
    useBlogPosts,
    useBlogPost,
    useBlogCategories,
    useBlogTags,
    prefetchBlogPost,
    invalidateBlogPosts
  };
};
