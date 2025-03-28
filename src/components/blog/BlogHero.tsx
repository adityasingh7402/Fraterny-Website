
import React from 'react';

interface BlogHeroProps {
  totalPosts?: number;
}

const BlogHero: React.FC<BlogHeroProps> = ({ totalPosts }) => {
  return (
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
            {totalPosts !== undefined && (
              <span className="ml-2 text-lg text-terracotta">({totalPosts} posts)</span>
            )}
          </p>
        </div>
      </div>
    </section>
  );
};

export default BlogHero;
