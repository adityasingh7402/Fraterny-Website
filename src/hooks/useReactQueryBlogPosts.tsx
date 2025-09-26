// import { useQuery, useQueryClient } from '@tanstack/react-query';
// import { 
//   fetchBlogPosts, 
//   fetchBlogPostById,
//   fetchBlogCategories,
//   fetchBlogTags,
//   BlogPost, 
//   BlogPostsResponse 
// } from '@/services/blog-posts';

// /**
//  * Custom hook for blog posts using React Query
//  */
// export const useReactQueryBlogPosts = () => {
//   const queryClient = useQueryClient();

//   /**
//    * Fetch blog posts with filtering and pagination
//    */
//   const useBlogPosts = (
//     category: string | null = null,
//     tag: string | null = null,
//     searchQuery: string = '',
//     page: number = 1,
//     pageSize: number = 9
//   ) => {
//     return useQuery({
//       queryKey: ['blogPosts', category, tag, searchQuery, page, pageSize],
//       queryFn: () => fetchBlogPosts(category, tag, searchQuery, page, pageSize),
//       staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
//       gcTime: 10 * 60 * 1000, // Keep in cache for 10 minutes after becoming unused
//     });
//   };

//   /**
//    * Fetch a single blog post by ID
//    */
//   const useBlogPost = (id: string | undefined) => {
//     return useQuery({
//       queryKey: ['blogPost', id],
//       queryFn: () => (id ? fetchBlogPostById(id) : Promise.reject('No post ID provided')),
//       staleTime: 5 * 60 * 1000,
//       gcTime: 10 * 60 * 1000,
//       enabled: !!id, // Only run if we have an ID
//     });
//   };

//   /**
//    * Fetch all unique blog categories
//    */
//   const useBlogCategories = () => {
//     return useQuery({
//       queryKey: ['blogCategories'],
//       queryFn: fetchBlogCategories,
//       staleTime: 10 * 60 * 1000, // Categories change less frequently
//       gcTime: 30 * 60 * 1000,
//     });
//   };

//   /**
//    * Fetch all unique blog tags
//    */
//   const useBlogTags = () => {
//     return useQuery({
//       queryKey: ['blogTags'],
//       queryFn: fetchBlogTags,
//       staleTime: 10 * 60 * 1000, // Tags change less frequently
//       gcTime: 30 * 60 * 1000,
//     });
//   };

//   /**
//    * Prefetch a blog post by ID (useful for navigation)
//    */
//   const prefetchBlogPost = async (id: string) => {
//     await queryClient.prefetchQuery({
//       queryKey: ['blogPost', id],
//       queryFn: () => fetchBlogPostById(id),
//       staleTime: 5 * 60 * 1000,
//     });
//   };

//   /**
//    * Invalidate blog posts cache (useful after updates)
//    */
//   const invalidateBlogPosts = async () => {
//     await queryClient.invalidateQueries({ queryKey: ['blogPosts'] });
//   };

//   return {
//     useBlogPosts,
//     useBlogPost,
//     useBlogCategories,
//     useBlogTags,
//     prefetchBlogPost,
//     invalidateBlogPosts
//   };
// };

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { 
  fetchBlogPosts, 
  fetchBlogPostById,
  fetchBlogCategories,
  fetchBlogTags,
  fetchBlogPostBySlug,
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
    /* console.log('🎣 [DEBUG] useBlogPosts hook called with params:', {
      category,
      tag,
      searchQuery,
      page,
      pageSize
    }); */

    return useQuery({
      queryKey: ['blogPosts', category, tag, searchQuery, page, pageSize],
      queryFn: async () => {
        /* console.log('🚀 [DEBUG] React Query executing fetchBlogPosts...'); */
        try {
          const result = await fetchBlogPosts(category, tag, searchQuery, page, pageSize);
          /* console.log('✅ [DEBUG] React Query fetchBlogPosts success:', result); */
          return result;
        } catch (error) {
          console.error('❌ [DEBUG] React Query fetchBlogPosts error:', error);
          throw error;
        }
      },
      staleTime: 0, // Always consider data stale - FIXED
      gcTime: 5 * 60 * 1000, // Keep in cache for 5 minutes but always refetch
      refetchOnMount: true, // Always refetch when component mounts - FIXED
      refetchOnWindowFocus: false, // Prevent unnecessary refetches
      retry: 3, // Retry failed requests
      retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
    });
  };

  /**
 * Fetch a single blog post by slug
 */
const useBlogPostBySlug = (slug: string | undefined) => {
  return useQuery({
    queryKey: ['blogPost', 'slug', slug],
    queryFn: () => (slug ? fetchBlogPostBySlug(slug) : Promise.reject('No post slug provided')),
    staleTime: 0,
    gcTime: 10 * 60 * 1000,
    refetchOnMount: true,
    enabled: !!slug, // Only run if we have a slug
    retry: 3,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};

  /**
   * Fetch all unique blog categories
   */
  const useBlogCategories = () => {
    /* console.log('🏷️ [DEBUG] useBlogCategories hook called'); */

    return useQuery({
      queryKey: ['blogCategories'],
      queryFn: async () => {
        /* console.log('🚀 [DEBUG] React Query executing fetchBlogCategories...'); */
        try {
          const result = await fetchBlogCategories();
          /* console.log('✅ [DEBUG] React Query fetchBlogCategories success:', result); */
          return result;
        } catch (error) {
          console.error('❌ [DEBUG] React Query fetchBlogCategories error:', error);
          throw error;
        }
      },
      staleTime: 0, // Always consider data stale - FIXED
      gcTime: 10 * 60 * 1000, // Keep in cache for 10 minutes
      refetchOnMount: true, // Always refetch when component mounts - FIXED
      refetchOnWindowFocus: false,
      retry: 3,
      retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
    });
  };

  /**
   * Fetch all unique blog tags
   */
  const useBlogTags = () => {
    /* console.log('🏷️ [DEBUG] useBlogTags hook called'); */

    return useQuery({
      queryKey: ['blogTags'],
      queryFn: async () => {
        /* console.log('🚀 [DEBUG] React Query executing fetchBlogTags...'); */
        try {
          const result = await fetchBlogTags();
          /* console.log('✅ [DEBUG] React Query fetchBlogTags success:', result); */
          return result;
        } catch (error) {
          console.error('❌ [DEBUG] React Query fetchBlogTags error:', error);
          throw error;
        }
      },
      staleTime: 0, // Always consider data stale - FIXED
      gcTime: 10 * 60 * 1000, // Keep in cache for 10 minutes
      refetchOnMount: true, // Always refetch when component mounts - FIXED
      refetchOnWindowFocus: false,
      retry: 3,
      retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
    });
  };

  /**
   * Fetch a single blog post by ID
   */
  const useBlogPost = (id: string | undefined) => {
    /* console.log('📄 [DEBUG] useBlogPost hook called with ID:', id); */

    return useQuery({
      queryKey: ['blogPost', id],
      queryFn: () => (id ? fetchBlogPostById(id) : Promise.reject('No post ID provided')),
      staleTime: 0, // Always consider data stale - FIXED
      gcTime: 10 * 60 * 1000,
      refetchOnMount: true, // Always refetch when component mounts - FIXED
      enabled: !!id, // Only run if we have an ID
      retry: 3,
      retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
    });
  };

  /**
   * Prefetch a blog post by ID (useful for navigation)
   */
  const prefetchBlogPost = async (id: string) => {
    /* console.log('⏭️ [DEBUG] prefetchBlogPost called with ID:', id); */
    await queryClient.prefetchQuery({
      queryKey: ['blogPost', id],
      queryFn: () => fetchBlogPostById(id),
      staleTime: 0,
    });
  };

  /**
   * Invalidate blog posts cache (useful after updates)
   */
  const invalidateBlogPosts = async () => {
    /* console.log('🔄 [DEBUG] invalidateBlogPosts called'); */
    await queryClient.invalidateQueries({ queryKey: ['blogPosts'] });
    await queryClient.invalidateQueries({ queryKey: ['blogCategories'] });
    await queryClient.invalidateQueries({ queryKey: ['blogTags'] });
  };

  /**
   * Refetch all blog data manually
   */
  const refetchAllBlogData = async () => {
    /* console.log('🔄 [DEBUG] refetchAllBlogData called'); */
    await queryClient.refetchQueries({ queryKey: ['blogPosts'] });
    await queryClient.refetchQueries({ queryKey: ['blogCategories'] });
    await queryClient.refetchQueries({ queryKey: ['blogTags'] });
  };

  return {
    useBlogPosts,
    useBlogPost,
    useBlogCategories,
    useBlogTags,
    prefetchBlogPost,
    invalidateBlogPosts,
    refetchAllBlogData,
    useBlogPostBySlug,
  };
};

// Add default export
export default useReactQueryBlogPosts;
