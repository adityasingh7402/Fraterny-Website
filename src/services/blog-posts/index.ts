
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
  try {
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
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    throw error;
  }
};

/**
 * Fetches a single blog post by ID
 */
export const fetchBlogPostById = async (id: string): Promise<BlogPost> => {
  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('id', id)
      .eq('published', true)
      .single();
    
    if (error) throw error;
    return data as BlogPost;
  } catch (error) {
    console.error(`Error fetching blog post with ID ${id}:`, error);
    throw error;
  }
};

/**
 * Fetches all unique categories from published blog posts
 */
export const fetchBlogCategories = async (): Promise<string[]> => {
  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('category')
      .eq('published', true)
      .not('category', 'is', null);
    
    if (error) throw error;
    
    // Extract unique categories
    const categories = new Set<string>();
    data.forEach(item => {
      if (item.category) categories.add(item.category);
    });
    
    return Array.from(categories);
  } catch (error) {
    console.error('Error fetching blog categories:', error);
    throw error;
  }
};

/**
 * Fetches all unique tags from published blog posts
 */
export const fetchBlogTags = async (): Promise<string[]> => {
  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('tags')
      .eq('published', true)
      .not('tags', 'is', null);
    
    if (error) throw error;
    
    // Extract unique tags
    const tags = new Set<string>();
    data.forEach(item => {
      if (item.tags) {
        item.tags.forEach(tag => tags.add(tag));
      }
    });
    
    return Array.from(tags);
  } catch (error) {
    console.error('Error fetching blog tags:', error);
    throw error;
  }
};
