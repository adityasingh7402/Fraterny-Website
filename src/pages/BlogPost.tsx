import { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useReactQueryBlogPosts } from '@/hooks/useReactQueryBlogPosts';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import ResponsiveImage from '../components/ui/ResponsiveImage';
import { ArrowLeft, Calendar, Tag } from 'lucide-react';
import CommentSection from '../components/blog/CommentSection';
import NewsletterSignup from '../components/blog/NewsletterSignup';

const BlogPost = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const { useBlogPost } = useReactQueryBlogPosts();
  const { data: post, isLoading, error } = useBlogPost(id);
  
  useEffect(() => {
    if (error) {
      navigate('/blog');
    }
  }, [error, navigate]);

  const formatContent = (content: string) => {
    return content.split('\n').map((paragraph, index) => (
      <p key={index} className="mb-4">{paragraph}</p>
    ));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <div className="bg-navy w-full h-[69px]"></div>
        <div className="container mx-auto px-6 pt-12 pb-20">
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-navy border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
            <p className="mt-4 text-gray-600">Loading blog post...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navigation />
      
      <div className="bg-navy w-full h-[69px]"></div>
      
      <article className="container mx-auto px-4 sm:px-6 pt-12 pb-10">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm p-8">
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
          
          {post?.image_key && (
            <div className="mb-8 rounded-lg overflow-hidden">
              <ResponsiveImage
                dynamicKey={post.image_key}
                alt={post.title}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="w-full h-auto"
                loading="eager"
                priority={true}
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
            {post && <div dangerouslySetInnerHTML={{ __html: post.content }} />}
          </div>
          
          {id && <CommentSection postId={id} />}
        </div>
      </article>
      
      <div className="container mx-auto px-4 sm:px-6 pb-20">
        <div className="max-w-4xl mx-auto">
          <NewsletterSignup />
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default BlogPost;
