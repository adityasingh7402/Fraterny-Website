
import { useState } from 'react';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Link } from 'react-router-dom';
import { Tag } from 'lucide-react';

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
};

const Blog = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  // Fetch published blog posts
  const { data: blogPosts, isLoading, error } = useQuery({
    queryKey: ['publicBlogPosts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('published', true)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as BlogPost[];
    }
  });

  // Extract all unique categories and tags from blog posts
  const categories = blogPosts ? [...new Set(blogPosts.filter(post => post.category).map(post => post.category))] : [];
  
  const allTags = blogPosts ? 
    blogPosts.reduce((acc, post) => {
      if (post.tags && post.tags.length > 0) {
        return [...acc, ...post.tags];
      }
      return acc;
    }, [] as string[]) : [];
  
  const uniqueTags = [...new Set(allTags)];

  // Filter blog posts based on selected category and tag
  const filteredPosts = blogPosts?.filter(post => {
    const matchesCategory = !selectedCategory || post.category === selectedCategory;
    const matchesTag = !selectedTag || (post.tags && post.tags.includes(selectedTag));
    return matchesCategory && matchesTag;
  });

  return (
    <div className="min-h-screen">
      <Navigation />
      
      <section className="pt-32 pb-16 bg-navy text-white relative">
        {/* Background with gradient overlay */}
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
             style={{ backgroundImage: "url('https://images.unsplash.com/photo-1560177112-fbfd5fde9566?auto=format&fit=crop&w=1920&q=80')" }}>
        </div>
        
        {/* Gradient overlay */}
        <div className="absolute inset-0" 
             style={{
               background: `linear-gradient(to right, 
                 rgba(10, 26, 47, 0.95) 0%,
                 rgba(10, 26, 47, 0.8) 50%,
                 rgba(10, 26, 47, 0.6) 100%
               )`
             }}>
        </div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-playfair mb-6">
              Our Blog
            </h1>
            <p className="text-xl md:text-2xl text-gray-300">
              Insights, stories, and perspectives from our community
            </p>
          </div>
        </div>
      </section>
      
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          {/* Filter controls */}
          {(categories.length > 0 || uniqueTags.length > 0) && (
            <div className="mb-10">
              <div className="flex flex-wrap items-center gap-4 mb-6">
                <h2 className="text-lg font-medium text-navy">Filter by:</h2>
                
                {categories.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    <button 
                      className={`px-3 py-1 rounded-full text-sm ${!selectedCategory ? 'bg-navy text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                      onClick={() => setSelectedCategory(null)}
                    >
                      All Categories
                    </button>
                    {categories.map(category => (
                      <button 
                        key={category} 
                        className={`px-3 py-1 rounded-full text-sm ${selectedCategory === category ? 'bg-navy text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                        onClick={() => setSelectedCategory(category)}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              
              {uniqueTags.length > 0 && (
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm text-gray-700">Tags:</span>
                  <button 
                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${!selectedTag ? 'bg-terracotta text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                    onClick={() => setSelectedTag(null)}
                  >
                    All
                  </button>
                  {uniqueTags.map(tag => (
                    <button 
                      key={tag} 
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${selectedTag === tag ? 'bg-terracotta text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                      onClick={() => setSelectedTag(tag)}
                    >
                      <Tag size={12} className="mr-1" />
                      {tag}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
          
          {isLoading ? (
            <div className="text-center py-20">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-navy border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
              <p className="mt-4 text-gray-600">Loading blog posts...</p>
            </div>
          ) : error ? (
            <div className="text-center py-20">
              <p className="text-red-600">Failed to load blog posts</p>
              <button 
                onClick={() => window.location.reload()}
                className="mt-4 px-4 py-2 bg-navy text-white rounded-md hover:bg-opacity-90"
              >
                Retry
              </button>
            </div>
          ) : filteredPosts?.length === 0 ? (
            <div className="text-center py-20">
              <h2 className="text-2xl font-playfair text-navy mb-4">No matching posts found</h2>
              <p className="text-gray-600">
                {selectedCategory || selectedTag ? 
                  'Try changing your filters to see more content.' : 
                  'We're working on our first blog posts. Check back soon!'}
              </p>
              {(selectedCategory || selectedTag) && (
                <button 
                  onClick={() => {
                    setSelectedCategory(null);
                    setSelectedTag(null);
                  }}
                  className="mt-4 px-4 py-2 bg-navy text-white rounded-md hover:bg-opacity-90 transition-colors"
                >
                  Clear filters
                </button>
              )}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts?.map((post) => (
                <Link 
                  key={post.id} 
                  to={`/blog/${post.id}`}
                  className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow flex flex-col h-full"
                >
                  <div className="p-6 flex-grow">
                    {post.category && (
                      <span className="inline-block px-2 py-1 bg-navy bg-opacity-10 text-navy text-xs rounded mb-2">
                        {post.category}
                      </span>
                    )}
                    <h2 className="text-xl font-medium text-navy mb-2 line-clamp-2">{post.title}</h2>
                    <p className="text-sm text-gray-500 mb-3">
                      {new Date(post.created_at).toLocaleDateString()}
                    </p>
                    <p className="text-gray-600 line-clamp-3">{post.content.substring(0, 160)}...</p>
                    
                    {post.tags && post.tags.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-1">
                        {post.tags.slice(0, 3).map(tag => (
                          <span key={tag} className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded">
                            {tag}
                          </span>
                        ))}
                        {post.tags.length > 3 && (
                          <span className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded">
                            +{post.tags.length - 3} more
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="px-6 pb-4 text-terracotta font-medium">Read more →</div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Blog;
