
// import React from 'react';
// import { Link } from 'react-router-dom';
// import ResponsiveImage from '../ui/ResponsiveImage';

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

// interface BlogCardProps {
//   post: BlogPost;
// }

// const BlogCard: React.FC<BlogCardProps> = ({ post }) => {
//   return (
//     <Link 
//       to={`/blog/${post.id}`}
//       className="group bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow flex flex-col h-full"
//     >
//       <div className="relative w-full aspect-[16/9] overflow-hidden">
//         {/* Background overlay */}
//         <div className="absolute inset-0 bg-navy bg-opacity-50 z-10"></div>

//         {/* Post image */}
//         {post.image_key ? (
//           <ResponsiveImage
//             dynamicKey={post.image_key}
//             alt={post.title}
//             className="w-full h-full object-cover transition-transform group-hover:scale-105"
//             loading="lazy"
//           />
//         ) : (
//           <div className="w-full h-full bg-gradient-to-b from-navy to-terracotta opacity-40"></div>
//         )}

//         {/* Overlay content positioned at the bottom */}
//         <div className="absolute bottom-0 left-0 right-0 z-20 p-6 bg-gradient-to-t from-black/80 to-transparent">
//           {post.category && (
//             <span className="inline-block px-2 py-1 bg-navy bg-opacity-80 text-white text-xs font-medium rounded mb-2">
//               {post.category}
//             </span>
//           )}
//           <h2 className="text-xl font-playfair font-bold text-white mb-2 line-clamp-2">
//             {post.title}
//           </h2>
//           <div className="flex justify-between items-center">
//             <p className="text-sm text-gray-200">
//               {new Date(post.created_at).toLocaleDateString('en-US', {
//                 year: 'numeric',
//                 month: 'long',
//                 day: 'numeric'
//               })}
//             </p>
//             <span className="text-terracotta font-medium group-hover:underline">Read more →</span>
//           </div>
//         </div>
//       </div>
//     </Link>
//   );
// };

// export default BlogCard;


// import React from 'react';
// import { Link } from 'react-router-dom';
// import ResponsiveImage from '../ui/ResponsiveImage';

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

// interface BlogCardProps {
//   post: BlogPost;
// }

// const BlogCard: React.FC<BlogCardProps> = ({ post }) => {
//   // Add debug logging
//   console.log('🎨 [DEBUG] BlogCard rendering for:', post.id, post.title);
//   console.log('🖼️ [DEBUG] BlogCard image_key:', post.image_key);
//   console.log('📏 [DEBUG] BlogCard post data:', {
//     id: post.id,
//     title: post.title?.slice(0, 30),
//     category: post.category,
//     created_at: post.created_at,
//     has_image: !!post.image_key
//   });

//   return (
//     <div 
//       className="group bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col h-full border-4 border-red-500"
//       style={{ minHeight: '400px' }}
//     >
//       {/* Debug info at top */}
//       <div className="bg-blue-500 text-white text-xs p-2">
//         Card ID: {post.id.slice(0, 8)}... | Title: {post.title.slice(0, 20)}...
//       </div>
//       <Link 
//         to={`/blog/${post.id}`}
//         className="block"
//       >
//         <div className="relative w-full aspect-[16/9] overflow-hidden">
//           {/* Background overlay */}
//           <div className="absolute inset-0 bg-navy bg-opacity-50 z-10"></div>

//           {/* Post image with fallback */}
//           {post.image_key ? (
//             <div className="w-full h-full bg-gray-200">
//               <ResponsiveImage
//                 dynamicKey={post.image_key}
//                 alt={post.title}
//                 className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-300"
//                 loading="lazy"
//               />
//               {/* Debug overlay to see if container exists */}
//               <div className="absolute top-2 left-2 z-30 bg-red-500 text-white text-xs px-2 py-1 rounded">
//                 IMG: {post.image_key?.slice(0, 10)}...
//               </div>
//             </div>
//           ) : (
//             <div className="w-full h-full bg-gradient-to-b from-navy to-terracotta">
//               {/* Debug overlay for no image */}
//               <div className="absolute top-2 left-2 z-30 bg-yellow-500 text-black text-xs px-2 py-1 rounded">
//                 NO IMAGE
//               </div>
//             </div>
//           )}

//           {/* Content overlay positioned at the bottom */}
//           <div className="absolute bottom-0 left-0 right-0 z-20 p-6 bg-gradient-to-t from-black/80 to-transparent">
//             {/* Category badge */}
//             {post.category && (
//               <span className="inline-block px-2 py-1 bg-navy bg-opacity-80 text-white text-xs font-medium rounded mb-2">
//                 {post.category}
//               </span>
//             )}
            
//             {/* Title with debug background */}
//             <h2 className="text-xl font-playfair font-bold text-white mb-2 line-clamp-2 bg-purple-900/50 p-1 rounded">
//               {post.title}
//             </h2>
            
//             {/* Footer content */}
//             <div className="flex justify-between items-center">
//               <p className="text-sm text-gray-200">
//                 {new Date(post.created_at).toLocaleDateString('en-US', {
//                   year: 'numeric',
//                   month: 'long',
//                   day: 'numeric'
//                 })}
//               </p>
              
//               <span className="text-terracotta font-medium group-hover:underline transition-all duration-200">
//                 Read more →
//               </span>
//             </div>
//           </div>
//         </div>
//       </Link>
//     </div>
//   );
// };

// export default BlogCard;

import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import ResponsiveImage from '../ui/ResponsiveImage';

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

interface BlogCardProps {
  post: BlogPost;
  index?: number; // Add index for stagger calculations
}

const BlogCard: React.FC<BlogCardProps> = ({ post, index = 0 }) => {
  // Calculate staggered delays for internal elements
  const baseDelay = index * 0.2; // Base delay based on card position
  
  // Internal content animation variants
  const contentVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: (i: number) => ({
      y: 0,
      opacity: 1,
      transition: {
        delay: baseDelay + (i * 0.1), // Stagger internal elements
        duration: 0.5,
        ease: "easeOut"
      }
    })
  };

  const imageVariants = {
    hidden: { scale: 1.1, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        delay: baseDelay + 0.1,
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };
  return (
    <motion.div 
      className="group bg-white rounded-lg overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 flex flex-col h-full"
      whileHover={{ 
        scale: 1.02,
        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)"
      }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      initial={{ rotateY: -5, opacity: 0 }}
      animate={{ 
        rotateY: 0, 
        opacity: 1,
        transition: {
          delay: baseDelay,
          duration: 0.6,
          ease: "easeOut"
        }
      }}
      style={{ transformStyle: "preserve-3d" }}
    >
      <Link 
        to={`/blog/${post.id}`}
        className="block h-full"
      >
        <div className="relative w-full aspect-[16/9] overflow-hidden">
          {/* Animated background overlay */}
          <motion.div 
            className="absolute inset-0 bg-navy z-10 group-hover:bg-opacity-30 transition-opacity duration-500"
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: 0.5,
              transition: {
                delay: baseDelay + 0.2,
                duration: 0.6
              }
            }}
          ></motion.div>

          {/* Post image with entrance animation */}
          {post.image_key ? (
            <motion.div 
              className="w-full h-full bg-gray-200"
              variants={imageVariants}
              initial="hidden"
              animate="visible"
            >
              <ResponsiveImage
                dynamicKey={post.image_key}
                alt={post.title}
                className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-700"
                loading="lazy"
              />
            </motion.div>
          ) : (
            <motion.div 
              className="w-full h-full bg-gradient-to-b from-navy to-terracotta"
              variants={imageVariants}
              initial="hidden"
              animate="visible"
            >
            </motion.div>
          )}

          {/* Content overlay with staggered animations */}
          <motion.div 
            className="absolute bottom-0 left-0 right-0 z-20 p-6 bg-gradient-to-t from-black/90 to-transparent"
            initial={{ y: 40, opacity: 0 }}
            animate={{ 
              y: 0, 
              opacity: 1,
              transition: {
                delay: baseDelay + 0.4,
                duration: 0.7,
                ease: "easeOut"
              }
            }}
          >
            {/* Category badge with stagger */}
            {post.category && (
              <motion.span 
                className="inline-block px-3 py-1 bg-navy bg-opacity-90 text-white text-xs font-medium rounded-full mb-3 backdrop-blur-sm"
                variants={contentVariants}
                custom={0}
                initial="hidden"
                animate="visible"
                whileHover={{ 
                  scale: 1.1,
                  backgroundColor: "rgba(10, 26, 47, 1)",
                  transition: { duration: 0.2 }
                }}
              >
                {post.category}
              </motion.span>
            )}
            
            {/* Title with stagger */}
            <motion.h2 
              className="text-xl font-playfair font-bold text-white mb-3 line-clamp-2"
              variants={contentVariants}
              custom={1}
              initial="hidden"
              animate="visible"
              whileHover={{
                scale: 1.02,
                transition: { duration: 0.2 }
              }}
            >
              {post.title}
            </motion.h2>
            
            {/* Footer content with stagger */}
            <motion.div 
              className="flex justify-between items-center"
              variants={contentVariants}
              custom={2}
              initial="hidden"
              animate="visible"
            >
              <motion.p 
                className="text-sm text-gray-200"
                whileHover={{ 
                  color: "#ffffff",
                  transition: { duration: 0.2 }
                }}
              >
                {new Date(post.created_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </motion.p>
              
              <motion.span 
                className="text-terracotta font-medium group-hover:underline transition-all duration-200 flex items-center"
                whileHover={{ 
                  x: 8,
                  scale: 1.05,
                  color: "#e07a5f",
                  transition: { 
                    type: "spring", 
                    stiffness: 400, 
                    damping: 25 
                  }
                }}
              >
                Read more 
                <motion.span
                  className="ml-1"
                  animate={{ x: [0, 3, 0] }}
                  transition={{ 
                    repeat: Infinity, 
                    duration: 2, 
                    ease: "easeInOut",
                    delay: baseDelay + 1
                  }}
                >
                  →
                </motion.span>
              </motion.span>
            </motion.div>
          </motion.div>
        </div>
      </Link>
    </motion.div>
  );
};

export default BlogCard;