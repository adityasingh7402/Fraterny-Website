
// // import React from 'react';
// // import ResponsiveImage from '../ui/ResponsiveImage';

// // const HeroSection = () => {
// //   return (
// //     <section className="pt-32 pb-16 bg-navy text-white relative">
// //       {/* Optimized background hero image with responsive sizes - using dynamicKey */}
// //       <div className="absolute inset-0 bg-cover bg-center bg-no-repeat">
// //         <ResponsiveImage 
// //           alt="Luxury villa experience setting"
// //           className="h-full w-full object-cover"
// //           loading="eager"
// //           dynamicKey="experience-hero"
// //         />
// //       </div>
      
// //       {/* Gradient Overlay */}
// //       <div 
// //         className="absolute inset-0"
// //         style={{
// //           background: `linear-gradient(to right, 
// //             rgba(10, 26, 47, 0.95) 0%,
// //             rgba(10, 26, 47, 0.8) 50%,
// //             rgba(10, 26, 47, 0.6) 100%
// //           )`
// //         }}
// //       />

// //       <div className="container mx-auto px-6 relative z-10">
// //         <div className="max-w-3xl">
// //           {/* CUSTOMIZATION: Hero Section Headline */}
// //           <h1 className="text-center sm:text-left text-4xl md:text-5xl lg:text-6xl font-playfair mb-6">
// //             Condensing lifelong memories, lessons, and friendships in a week.
// //           </h1>

// //           <p className="text-center sm:text-left text-xl md:text-2xl mb-8 text-gray-300">
// //             20 people. 7 days. 1 life-changing experience
// //           </p>
          
// //           {/* CUSTOMIZATION: Hero Section CTA Link */}
// //           <a 
// //             href="https://docs.google.com/forms/d/1TTHQN3gG2ZtC26xlh0lU8HeiMc3qDJhfoU2tOh9qLQM/edit"
// //             target="_blank"
// //             rel="noopener noreferrer"
// //             className="text-sm italic underline text-terracotta hover:text-opacity-80 transition-colors"
// //           >
// //             See if you fit →
// //           </a>
// //         </div>
// //       </div>
// //     </section>
// //   );
// // };

// // export default HeroSection;

// import React from 'react';
// import ResponsiveImage from '../ui/ResponsiveImage';

// const HeroSection = () => {
//   return (
//     <section className="pt-32 pb-16 bg-navy text-white relative">
//       {/* Optimized background hero image with responsive sizes - using dynamicKey */}
//       <div className="absolute inset-0 bg-cover bg-center bg-no-repeat">
//         <ResponsiveImage 
//           alt="Luxury villa experience setting"
//           className="h-full w-full object-cover"
//           loading="eager"
//           dynamicKey="experience-hero"
//         />
//       </div>
      
//       {/* Gradient Overlay */}
//       <div 
//         className="absolute inset-0"
//         style={{
//           background: `linear-gradient(to right, 
//             rgba(10, 26, 47, 0.95) 0%,
//             rgba(10, 26, 47, 0.8) 50%,
//             rgba(10, 26, 47, 0.6) 100%
//           )`
//         }}
//       />

//       <div className="container mx-auto px-6 relative z-10">
//         <div className="max-w-3xl">
//           {/* FIXED: Added text-center sm:text-left for consistent mobile-first alignment */}
//           <h1 className="text-left text-4xl md:text-5xl lg:text-6xl font-playfair mb-6">
//             Condensing lifelong memories, lessons, and friendships in a week.
//           </h1>

//           <p className="text-left text-xl md:text-2xl mb-8 text-gray-300">
//             20 people. 7 days. 1 life-changing experience
//           </p>
          
//           {/* FIXED: Added text-center sm:text-left for CTA link alignment */}
//           <div className="text-center sm:text-left">
//             <a 
//               href="https://docs.google.com/forms/d/1TTHQN3gG2ZtC26xlh0lU8HeiMc3qDJhfoU2tOh9qLQM/edit"
//               target="_blank"
//               rel="noopener noreferrer"
//               className="text-sm italic underline text-terracotta hover:text-opacity-80 transition-colors"
//             >
//               See if you fit →
//             </a>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default HeroSection;

import React from 'react';
import ResponsiveImage from '../ui/ResponsiveImage';

const HeroSection = () => {
  return (
    <section className="pt-32 pb-16 bg-navy text-white relative">
      {/* Optimized background hero image with responsive sizes - using dynamicKey */}
      <div className="absolute inset-0 bg-cover bg-center bg-no-repeat">
        <ResponsiveImage 
          alt="Luxury villa experience setting"
          className="h-full w-full object-cover"
          loading="eager"
          dynamicKey="experience-hero"
        />
      </div>
      
      {/* Gradient Overlay */}
      <div 
        className="absolute inset-0"
        style={{
          background: `linear-gradient(to right, 
            rgba(10, 26, 47, 0.95) 0%,
            rgba(10, 26, 47, 0.8) 50%,
            rgba(10, 26, 47, 0.6) 100%
          )`
        }}
      />

      {/* Hero Content - Clean and simple */}
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-3xl">
          <h1 className="text-left text-4xl md:text-5xl lg:text-6xl font-playfair mb-6">
            Condensing lifelong memories, lessons, and friendships in a week.
          </h1>

          <p className="text-left text-xl md:text-2xl mb-8 text-gray-300">
            20 people. 7 days. 1 life-changing experience
          </p>
          
          <div className="text-center sm:text-left">
            <a 
              href="https://docs.google.com/forms/d/1TTHQN3gG2ZtC26xlh0lU8HeiMc3qDJhfoU2tOh9qLQM/edit"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm italic underline text-terracotta hover:text-opacity-80 transition-colors"
            >
              See if you fit →
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;