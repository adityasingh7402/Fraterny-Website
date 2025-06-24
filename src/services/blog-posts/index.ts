// import { supabase } from '@/integrations/supabase/client';

// export type BlogPost = {
//   id: string;
//   title: string;
//   content: string;
//   published: boolean;
//   category: string | null;
//   tags: string[] | null;
//   created_at: string;
//   updated_at: string;
//   image_key: string | null;
// };

// export type BlogPostsResponse = {
//   posts: BlogPost[];
//   total: number;
// };

// /**
//  * Fetches blog posts with pagination, filtering, and search
//  */
// export const fetchBlogPosts = async (
//   category: string | null = null,
//   tag: string | null = null,
//   searchQuery: string = '',
//   page: number = 1,
//   pageSize: number = 9
// ): Promise<BlogPostsResponse> => {
//   try {
//     // First, get the total count with a separate query
//     let countQuery = supabase
//       .from('blog_posts')
//       .select('id', { count: 'exact' })
//       .eq('published', true);
    
//     if (category) {
//       countQuery = countQuery.eq('category', category);
//     }
//     if (tag) {
//       countQuery = countQuery.contains('tags', [tag]);
//     }
//     if (searchQuery) {
//       countQuery = countQuery.ilike('title', `%${searchQuery}%`);
//     }
    
//     const { count, error: countError } = await countQuery;
    
//     if (countError) {
//       throw countError;
//     }
    
//     // Then get the actual data
//     let dataQuery = supabase
//       .from('blog_posts')
//       .select('*')
//       .eq('published', true);
    
//     if (category) {
//       dataQuery = dataQuery.eq('category', category);
//     }
//     if (tag) {
//       dataQuery = dataQuery.contains('tags', [tag]);
//     }
//     if (searchQuery) {
//       dataQuery = dataQuery.ilike('title', `%${searchQuery}%`);
//     }
    
//     const from = (page - 1) * pageSize;
//     const to = from + pageSize - 1;
    
//     dataQuery = dataQuery.range(from, to).order('created_at', { ascending: false });
    
//     const { data, error } = await dataQuery;
    
//     if (error) {
//       throw error;
//     }
    
//     return { 
//       posts: data as BlogPost[], 
//       total: count || 0 
//     };
//   } catch (error) {
//     console.error('Error fetching blog posts:', error);
//     throw error;
//   }
// };

// /**
//  * Fetches a single blog post by ID
//  */
// export const fetchBlogPostById = async (id: string): Promise<BlogPost> => {
//   try {
//     const { data, error } = await supabase
//       .from('blog_posts')
//       .select('*')
//       .eq('id', id)
//       .eq('published', true)
//       .single();
    
//     if (error) throw error;
//     return data as BlogPost;
//   } catch (error) {
//     console.error(`Error fetching blog post with ID ${id}:`, error);
//     throw error;
//   }
// };

// /**
//  * Fetches all unique categories from published blog posts
//  */
// export const fetchBlogCategories = async (): Promise<string[]> => {
//   try {
//     const { data, error } = await supabase
//       .from('blog_posts')
//       .select('category')
//       .eq('published', true)
//       .not('category', 'is', null);
    
//     if (error) throw error;
    
//     // Extract unique categories
//     const categories = new Set<string>();
//     data.forEach(item => {
//       if (item.category) categories.add(item.category);
//     });
    
//     return Array.from(categories);
//   } catch (error) {
//     console.error('Error fetching blog categories:', error);
//     throw error;
//   }
// };

// /**
//  * Fetches all unique tags from published blog posts
//  */
// export const fetchBlogTags = async (): Promise<string[]> => {
//   try {
//     const { data, error } = await supabase
//       .from('blog_posts')
//       .select('tags')
//       .eq('published', true)
//       .not('tags', 'is', null);
    
//     if (error) throw error;
    
//     // Extract unique tags
//     const tags = new Set<string>();
//     data.forEach(item => {
//       if (item.tags) {
//         item.tags.forEach(tag => tags.add(tag));
//       }
//     });
    
//     return Array.from(tags);
//   } catch (error) {
//     console.error('Error fetching blog tags:', error);
//     throw error;
//   }
// };


import { supabase } from '@/integrations/supabase/client';

export type BlogPost = {
  id: string;
  title: string;
  content: string;
  published: boolean;
  category: string | null;
  tags: string[] | null;
  created_at: string;
  updated_at: string;
  image_key: string | null;
};

export type BlogPostsResponse = {
  posts: BlogPost[];
  total: number;
};

/**
 * Fetches blog posts with pagination, filtering, and search
 */
export const fetchBlogPosts = async (
  category: string | null = null,
  tag: string | null = null,
  searchQuery: string = '',
  page: number = 1,
  pageSize: number = 9
): Promise<BlogPostsResponse> => {
  /* console.log('🔍 [DEBUG] fetchBlogPosts called with params:', {
    category,
    tag,
    searchQuery,
    page,
    pageSize
  }); */

  try {
    // First, get the total count with a separate query
    // console.log('📊 [DEBUG] Building count query...');
    let countQuery = supabase
      .from('blog_posts')
      .select('id', { count: 'exact' })
      .eq('published', true);
    
    if (category) {
      // console.log('🏷️ [DEBUG] Adding category filter:', category);
      countQuery = countQuery.eq('category', category);
    }
    if (tag) {
      // console.log('🏷️ [DEBUG] Adding tag filter:', tag);
      countQuery = countQuery.contains('tags', [tag]);
    }
    if (searchQuery) {
      // console.log('🔍 [DEBUG] Adding search filter:', searchQuery);
      countQuery = countQuery.ilike('title', `%${searchQuery}%`);
    }
    
    // console.log('⏳ [DEBUG] Executing count query...');
    const { count, error: countError } = await countQuery;
    
    // console.log('📊 [DEBUG] Count query result:', { count, countError });
    
    if (countError) {
      console.error('❌ [ERROR] Count query failed:', countError);
      throw countError;
    }
    
    // Then get the actual data
    // console.log('📄 [DEBUG] Building data query...');
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
    
    // console.log('📊 [DEBUG] Pagination params:', { from, to, page, pageSize });
    
    dataQuery = dataQuery.range(from, to).order('created_at', { ascending: false });
    
    // console.log('⏳ [DEBUG] Executing data query...');
    const { data, error } = await dataQuery;
    
    /* console.log('📄 [DEBUG] Data query result:', {
      data: data?.length,
      error
    }); */
    
    if (error) {
      console.error('❌ [ERROR] Data query failed:', error);
      throw error;
    }
    
    const result = { 
      posts: data as BlogPost[], 
      total: count || 0 
    };

    /* console.log('✅ [DEBUG] fetchBlogPosts success:', {
      postsCount: result.posts.length,
      total: result.total
    }); */

    return result;

  } catch (error) {
    console.error('❌ [ERROR] Error fetching blog posts:', error);
    throw error;
  }
};

/**
 * Fetches all unique categories from published blog posts
 */
export const fetchBlogCategories = async (): Promise<string[]> => {
  // console.log('🏷️ [DEBUG] fetchBlogCategories called');
  try {
    // console.log('⏳ [DEBUG] Executing categories query...');
    const { data, error } = await supabase
      .from('blog_posts')
      .select('category')
      .eq('published', true)
      .not('category', 'is', null);

    /* console.log('📊 [DEBUG] Categories query result:', {
      data: data?.length,
      error
    }); */
    
    if (error) {
      console.error('❌ [ERROR] Error fetching blog categories:', error);
      throw error;
    }
    
    // Extract unique categories
    const categories = new Set<string>();
    data.forEach(item => {
      if (item.category) categories.add(item.category);
    });
    
    const result = Array.from(categories);
    // console.log('✅ [DEBUG] fetchBlogCategories success:', result);
    return result;

  } catch (error) {
    console.error('❌ [ERROR] Error fetching blog categories:', error);
    throw error;
  }
};

/**
 * Fetches all unique tags from published blog posts
 */
export const fetchBlogTags = async (): Promise<string[]> => {
  // console.log('🏷️ [DEBUG] fetchBlogTags called');
  try {
    // console.log('⏳ [DEBUG] Executing tags query...');
    const { data, error } = await supabase
      .from('blog_posts')
      .select('tags')
      .eq('published', true)
      .not('tags', 'is', null);
    
    /* console.log('📊 [DEBUG] Tags query result:', {
      data: data?.length,
      error
    }); */

    if (error) {
      console.error('❌ [ERROR] Error fetching blog tags:', error);
      throw error;
    }
    
    // Extract unique tags
    const tags = new Set<string>();
    data.forEach(item => {
      if (item.tags) {
        item.tags.forEach(tag => tags.add(tag));
      }
    });
    
    const result = Array.from(tags);
    // console.log('✅ [DEBUG] fetchBlogTags success:', result);
    return result;
  } catch (error) {
    console.error('❌ [ERROR] Error fetching blog tags:', error);
    throw error;
  }
};

/**
 * Fetches a single blog post by ID
 */
export const fetchBlogPostById = async (id: string): Promise<BlogPost> => {
  // console.log('📄 [DEBUG] fetchBlogPostById called with ID:', id);
  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('id', id)
      .eq('published', true)
      .single();
    
    // console.log('📊 [DEBUG] Single post query result:', { data, error });

    if (error) {
      console.error(`❌ [ERROR] Error fetching post ${id}:`, error);
      throw error;
    }
    
    // console.log('✅ [DEBUG] fetchBlogPostById success');
    return data as BlogPost;
  } catch (error) {
    console.error(`❌ [ERROR] Error fetching post with ID ${id}:`, error);
    throw error;
  }
};