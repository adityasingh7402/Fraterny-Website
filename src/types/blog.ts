import { z } from "zod";

// Blog post ID validation schema
export const blogPostIdSchema = z.string().refine(
  (id) => /^[a-zA-Z0-9-_]+$/.test(id),
  {
    message: "Invalid blog post ID format. Only alphanumeric characters, hyphens, and underscores are allowed.",
  }
);

// Type for blog post ID
export type BlogPostId = z.infer<typeof blogPostIdSchema>;

// Blog post validation schema
export const blogPostSchema = z.object({
  id: blogPostIdSchema,
  title: z.string().min(1),
  content: z.string().min(1),
  excerpt: z.string().min(1),
  slug: z.string().min(1),
  author: z.string().min(1),
  published_at: z.string().datetime(),
  featured_image: z.string().url().optional(),
  tags: z.array(z.string()).optional(),
  category: z.string().optional(),
  status: z.enum(["draft", "published"]),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

// Type for blog post
export type BlogPost = z.infer<typeof blogPostSchema>;

// Blog post list validation schema
export const blogPostListSchema = z.array(blogPostSchema);

// Type for blog post list
export type BlogPostList = z.infer<typeof blogPostListSchema>;

// Blog post error type
export type BlogPostError = {
  code: "NOT_FOUND" | "INVALID_ID" | "SERVER_ERROR" | "VALIDATION_ERROR";
  message: string;
  details?: unknown;
};

// Blog post response type
export type BlogPostResponse = {
  data: BlogPost | null;
  error: BlogPostError | null;
};

// Blog post list response type
export type BlogPostListResponse = {
  data: BlogPostList | null;
  error: BlogPostError | null;
}; 