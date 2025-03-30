
import { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import ResponsiveImage from '../components/ui/ResponsiveImage';
import { ArrowLeft, Calendar, Tag } from 'lucide-react';
import CommentSection from '../components/blog/CommentSection';
import NewsletterSignup from '../components/blog/NewsletterSignup';

// Blog post type
type BlogPost = {
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

const BlogPost = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  // Fetch the specific blog post
  const { data: post, isLoading, error } = useQuery({
    queryKey: ['blogPost', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('id', id)
        .eq('published', true)
        .single();
      
      if (error) throw error;
      return data as BlogPost;
    },
  });

  // Redirect to the blog page if the post doesn't exist or isn't published
  useEffect(() => {
    if (error) {
      navigate('/blog');
    }
  }, [error, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <div className="container mx-auto px-6 pt-40 pb-20">
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-navy border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
            <p className="mt-4 text-gray-600">Loading blog post...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Format the blog content with proper line breaks
  const formatContent = (content: string) => {
    return content.split('\n').map((paragraph, index) => (
      <p key={index} className="mb-4">{paragraph}</p>
    ));
  };

  return (
    <div className="min-h-screen">
      <Navigation />
      
      <article className="container mx-auto px-6 pt-40 pb-10">
        <div className="max-w-3xl mx-auto">
          <Link to="/blog" className="inline-flex items-center text-navy hover:text-terracotta mb-8">
            <ArrowLeft size={16} className="mr-2" />
            Back to all posts
          </Link>
          
          {post?.category && (
            <div className="mb-4">
              <span className="inline-block px-3 py-1 bg-navy bg-opacity-10 text-navy text-sm rounded">
                {post.category}
              </span>
            </div>
          )}
          
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-playfair font-bold text-navy mb-6">
            {post?.title}
          </h1>
          
          <div className="mb-8 flex items-center text-gray-500">
            <Calendar size={16} className="mr-2" />
            {new Date(post?.created_at || '').toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </div>
          
          {/* Featured image with enhanced responsive handling */}
          {post?.image_key && (
            <div className="mb-8 rounded-lg overflow-hidden">
              <ResponsiveImage
                dynamicKey={post.image_key}
                alt={post.title}
                size="large"
                className="w-full h-auto"
                loading="eager"
                priority="high"
                fallbackSrc="/placeholder.svg"
              />
            </div>
          )}
          
          {post?.tags && post.tags.length > 0 && (
            <div className="mb-8 flex flex-wrap gap-2">
              {post.tags.map(tag => (
                <span key={tag} className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-700">
                  <Tag size={14} className="mr-1 text-terracotta" />
                  {tag}
                </span>
              ))}
            </div>
          )}
          
          <div className="prose prose-lg max-w-none text-gray-700">
            {post && formatContent(post.content)}
          </div>
          
          {/* Add Comment Section */}
          {id && <CommentSection postId={id} />}
        </div>
      </article>
      
      {/* Add Newsletter Section */}
      <div className="container mx-auto px-6 pb-20">
        <div className="max-w-3xl mx-auto">
          <NewsletterSignup />
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default BlogPost;
