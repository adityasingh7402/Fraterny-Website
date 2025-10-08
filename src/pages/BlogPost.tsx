import { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useReactQueryBlogPosts } from '@/hooks/useReactQueryBlogPosts';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import ResponsiveImage from '../components/ui/ResponsiveImage';
import { ArrowLeft, Calendar, Tag } from 'lucide-react';
import CommentSection from '../components/blog/CommentSection';
import NewsletterSignup from '../components/blog/NewsletterSignup';
import { setMeta, clearDynamicMetaTags } from '@/utils/seo';
import { generateImageStructuredData, insertStructuredData } from '@/utils/seo/index';
import {getImageDataForSEO} from '@/services/images/services/seoService';
import DOMPurify from 'dompurify'
import parse from 'html-react-parser';
import '../App.css';  // Add this with your other imports


const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  
  const { useBlogPostBySlug } = useReactQueryBlogPosts();
  const { data: post, isLoading, error } = useBlogPostBySlug(slug);


  // SEO Meta Tags
    // useEffect(() => {
    //   if (post) {
    //     const canonical = `${window.location.origin}/blog/${post.slug}`;
    //     const metaDescription = post.meta_description || post.excerpt || `${post.content.replace(/<[^>]*>/g, '').substring(0, 150)}...`;
    //     const seoTitle = post.seo_title || post.title;
        
    //     setMeta({
    //       title: `${seoTitle}`,
    //       description: metaDescription,
    //       canonical: canonical,
    //       robots: "index, follow"
    //     });
        
    //     // Set Open Graph meta tags
    //     const setOpenGraphMeta = () => {
    //       // OG Title
    //       let ogTitle = document.querySelector('meta[property="og:title"]') as HTMLMetaElement;
    //       if (!ogTitle) {
    //         ogTitle = document.createElement('meta');
    //         ogTitle.setAttribute('property', 'og:title');
    //         document.head.appendChild(ogTitle);
    //       }
    //       ogTitle.content = seoTitle;
          
    //       // OG Description  
    //       let ogDesc = document.querySelector('meta[property="og:description"]') as HTMLMetaElement;
    //       if (!ogDesc) {
    //         ogDesc = document.createElement('meta');
    //         ogDesc.setAttribute('property', 'og:description');
    //         document.head.appendChild(ogDesc);
    //       }
    //       ogDesc.content = metaDescription;
          
    //       // OG URL
    //       let ogUrl = document.querySelector('meta[property="og:url"]') as HTMLMetaElement;
    //       if (!ogUrl) {
    //         ogUrl = document.createElement('meta');
    //         ogUrl.setAttribute('property', 'og:url');
    //         document.head.appendChild(ogUrl);
    //       }
    //       ogUrl.content = canonical;
    //     };
        
    //     setOpenGraphMeta();

    //     // Set meta keywords
    //     if (post.meta_keywords && post.meta_keywords.length > 0) {
    //       let metaKeywords = document.querySelector('meta[name="keywords"]') as HTMLMetaElement;
    //       if (!metaKeywords) {
    //         metaKeywords = document.createElement('meta');
    //         metaKeywords.name = 'keywords';
    //         document.head.appendChild(metaKeywords);
    //       }
    //       metaKeywords.content = post.meta_keywords.join(', ');
    //     }
    //   }
    // }, [post, slug]);
  
    // SEO Meta Tags - Enhanced with cleanup and proper timing
    useEffect(() => {
  console.log('🔍 SEO useEffect triggered, post:', !!post, 'slug:', slug);
  
  if (!post) {
    console.log('❌ No post data, returning early');
    return;
  }

  console.log('✅ Post data found:', post.title);
  console.log('🧹 About to clear dynamic meta tags');

  const canonical = `${window.location.origin}/blog/${post.slug}`;
  const metaDescription = post.meta_description || post.excerpt || `${post.content.replace(/<[^>]*>/g, '').substring(0, 150)}...`;
  const seoTitle = post.seo_title || post.title;
  const ogImage = post.image_key ? `${window.location.origin}/api/images/${post.image_key}` : undefined;

  console.log('📝 SEO data prepared:', { seoTitle, ogImage });

  // Clear any existing dynamic meta tags first
  clearDynamicMetaTags();
  console.log('🧹 Dynamic meta tags cleared');

  // Set all meta tags including Open Graph
  setMeta({
    title: seoTitle,
    description: metaDescription,
    canonical: canonical,
    robots: "index, follow",
    ogTitle: seoTitle,
    ogDescription: metaDescription,
    ogImage: ogImage,
    ogUrl: canonical
  });
  
  console.log('🏷️ Meta tags set via setMeta');

      // Set meta keywords if available
      if (post.meta_keywords && post.meta_keywords.length > 0) {
        let metaKeywords = document.querySelector('meta[name="keywords"]') as HTMLMetaElement;
        if (!metaKeywords) {
          metaKeywords = document.createElement('meta');
          metaKeywords.name = 'keywords';
          document.head.appendChild(metaKeywords);
        }
        metaKeywords.content = post.meta_keywords.join(', ');
      }

      // Add structured data (JSON-LD)
        const structuredData: any = {
          "@context": "https://schema.org",
          "@type": "Article",
          "headline": seoTitle,
          "description": metaDescription,
          "datePublished": post.created_at,
          "dateModified": post.updated_at,
          "author": {
            "@type": "Organization",
            "name": "Fraterny"
          },
          "publisher": {
            "@type": "Organization", 
            "name": "Fraterny"
          },
          "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": canonical
          },
          "url": canonical,
          "articleSection": post.category,
          "keywords": post.meta_keywords?.join(", ") || ""
        };

  // Add image to structured data if available
  if (post.image_key) {
    structuredData.image = {
      "@type": "ImageObject",
      "url": `${window.location.origin}/api/images/${post.image_key}`,
      "description": post.featured_image_alt || post.title
    };
  }

    // Add structured data script
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(structuredData);
    document.head.appendChild(script);

      // Cleanup function to clear meta tags when component unmounts or post changes
      return () => {
        clearDynamicMetaTags();
      };
      console.log('🎯 SEO useEffect completed successfully');

    }, [post, slug]);


    // Structured Data (JSON-LD)
    // useEffect(() => {
    //   if (post) {
    //     const structuredData: any = {
    //       "@context": "https://schema.org",
    //       "@type": "Article",
    //       "headline": post.seo_title || post.title,
    //       "description": post.meta_description || post.excerpt,
    //       "datePublished": post.created_at,
    //       "dateModified": post.updated_at,
    //       "author": {
    //         "@type": "Organization",
    //         "name": "Fraterny"
    //       },
    //       "publisher": {
    //         "@type": "Organization", 
    //         "name": "Fraterny"
    //       },
    //       "mainEntityOfPage": {
    //         "@type": "WebPage",
    //         "@id": `${window.location.origin}/blog/${post.slug}`
    //       },
    //       "url": `${window.location.origin}/blog/${post.slug}`,
    //       "articleSection": post.category,
    //       "keywords": post.meta_keywords?.join(", ") || ""
    //     };
  
    //     // Add image if available
    //     // if (post.image_key) {
    //     //   structuredData.image = {
    //     //     "@type": "ImageObject",
    //     //     "url": `${window.location.origin}/api/images/${post.image_key}`,
    //     //     "description": post.featured_image_alt || post.title
    //     //   };
    //     // }

    //     // Add image with enhanced SEO data if available
    //     if (post.image_key) {
    //       // This will be enhanced with our SEO service
    //       structuredData.image = {
    //         "@type": "ImageObject",
    //         "url": `${window.location.origin}/api/images/${post.image_key}`,
    //         "description": post.featured_image_alt || post.title
    //         // SEO metadata will be added automatically by our ResponsiveImage component
    //       };
    //     }
  
    //     // Remove existing structured data
    //     const existingScript = document.querySelector('script[type="application/ld+json"]');
    //     if (existingScript) {
    //       existingScript.remove();
    //     }
  
    //     // Add new structured data
    //     const script = document.createElement('script');
    //     script.type = 'application/ld+json';
    //     script.textContent = JSON.stringify(structuredData);
    //     document.head.appendChild(script);
    //   }
  
    //   // Cleanup on unmount
    //   return () => {
    //     const script = document.querySelector('script[type="application/ld+json"]');
    //     if (script) {
    //       script.remove();
    //     }
    //   };
    // }, [post, slug]);

    // Enhanced image SEO data
    // Enhanced image SEO data - Now integrated and non-conflicting
    useEffect(() => {
      const enhanceImageSEO = async () => {
        if (post?.image_key) {
          try {
            const imageData = await getImageDataForSEO(post.image_key);
            if (imageData && imageData.seo) {
              // Only add image-specific structured data (separate from article schema)
              const imageStructuredData = generateImageStructuredData(
                `${window.location.origin}/api/images/${post.image_key}`,
                {
                  alt_text: imageData.alt_text,
                  description: imageData.description,
                  width: imageData.width,
                  height: imageData.height,
                  seo: imageData.seo
                }
              );
              
              insertStructuredData(imageStructuredData, 'blog-image-schema');
              
              // Add only image alt text to Open Graph (non-conflicting)
              if (imageData.alt_text) {
                let ogImageAlt = document.querySelector('meta[property="og:image:alt"]') as HTMLMetaElement;
                if (!ogImageAlt) {
                  ogImageAlt = document.createElement('meta');
                  ogImageAlt.setAttribute('property', 'og:image:alt');
                  document.head.appendChild(ogImageAlt);
                }
                ogImageAlt.content = imageData.alt_text;
              }
            }
          } catch (error) {
            console.error('Error enhancing image SEO:', error);
          }
        }
      };

      // Only run after the main SEO data is set
      if (post) {
        enhanceImageSEO();
      }
    }, [post?.image_key, post?.slug]); // Added post.slug to ensure it runs after main SEO
  
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

  const sanitizeContent = (htmlContent: string): string => {
  // Step 1: Remove data-start and data-end attributes
  let cleaned = htmlContent.replace(/\s*data-start="[^"]*"/g, '');
  cleaned = cleaned.replace(/\s*data-end="[^"]*"/g, '');
  
  // Step 2: Decode HTML entities
  const textarea = document.createElement('textarea');
  textarea.innerHTML = cleaned;
  cleaned = textarea.value;
  
  // Step 3: Sanitize with DOMPurify
  const sanitized = DOMPurify.sanitize(cleaned, {
    ALLOWED_TAGS: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'br', 'strong', 'em', 'u', 'ul', 'ol', 'li', 'a', 'blockquote', 'code', 'pre', 'hr', 'span', 'div'],
    ALLOWED_ATTR: ['href', 'target', 'rel', 'class']
  });
  
  console.log('Sanitized content:', sanitized);
  
  return sanitized;
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
                seoEnhanced={true}
                showCaption={true}
                includeSchema={true}
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
          
          <div className="max-w-none text-gray-700">
            {/* {post && <div dangerouslySetInnerHTML={{ __html: sanitizeContent(post.content) }} />} */}
            {post && parse(sanitizeContent(post.content))}
          </div>
          
          {post?.id && <CommentSection postId={post.id} />}
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
