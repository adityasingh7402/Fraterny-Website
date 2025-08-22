// import React, { useState } from 'react';
// import { motion } from 'framer-motion';
// import { ChevronLeft, ChevronRight } from 'lucide-react';
// import { AnimatePresence } from 'framer-motion';
// import { useEffect } from 'react';

// interface Testimonial {
//   id: number;
//   text: string;
//   tag: string;
//   color: string;
// }

// const testimonials: Testimonial[] = [
//   {
//     id: 1,
//     text: "I did it twice just for the questions. too hard hitting. I never thought about myself so deeply before this",
//     tag: "Deep",
//     color: "blue"
//   },
//   {
//     id: 2,
//     text: "Free result was too crazy… specially the quotes section.",
//     tag: "Unreal",
//     color: "purple"
//   },
//   {
//     id: 3,
//     text: "Astrology section made me question everything I was doing",
//     tag: "Mind",
//     color: "green"
//   },
//   {
//     id: 4,
//     text: "The premium report felt like someone wrote a research report on me. I have never felt so seen",
//     tag: "Brain-map",
//     color: "orange"
//   },
//   {
//     id: 5,
//     text: "Made me realize what I should be actually working on.",
//     tag: "Actionable",
//     color: "red"
//   }
// ];

// const getColorClasses = (color: string) => {
//   const colorMap = {
//     blue: { bg: 'bg-[#E2EFFF]', border: 'border-[#84ADDF]', text: 'text-[#004A7F]' },
//     purple: { bg: 'bg-[#E9EAFF]', border: 'border-[#696CB8]', text: 'text-[#50007F]' },
//     green: { bg: 'bg-[#E6FFDE]', border: 'border-[#96C486]', text: 'text-[#2A7F00]' },
//     orange: { bg: 'bg-[#FFECFF]', border: 'border-[#C381C3]', text: 'text-[#7F006A]' },
//     red: { bg: 'bg-[#FFE2E2]', border: 'border-[#CA7D7D]', text: 'text-[#A4090B]' }
//   };
//   return colorMap[color as keyof typeof colorMap] || colorMap.blue;
// };

// const Testimonials = () => {
//   const [currentIndex, setCurrentIndex] = useState(0);

//   const nextTestimonial = () => {
//     setCurrentIndex((prev) => (prev + 1) % testimonials.length);
//   };

//   const prevTestimonial = () => {
//     setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
//   };

//   const currentTestimonial = testimonials[currentIndex];
//   const colorClasses = getColorClasses(currentTestimonial.color);

//   useEffect(() => {
//   const interval = setInterval(() => {
//     setCurrentIndex((prev) => (prev + 1) % testimonials.length);
//   }, 4000); // change duration if needed

//   return () => clearInterval(interval); // cleanup
// }, []);

//   return (
//     <div className='p-4 mt-5 flex flex-col gap-4'>
//       {/* Header */}
//       <div className="flex items-center justify-between">
//         <div className="justify-start text-neutral-950 text-4xl font-normal font-['Gilroy-Medium']">Testimonials.</div>
//       </div>

//     <div className='relative overflow-hidden'>
//       <div
//         key={currentTestimonial.id}
//         // initial={{ opacity: 0, x: 100 }}
//         // animate={{ opacity: 1, x: 0 }}
//         // exit={{ opacity: 0, x: -100 }}
//         // transition={{ duration: 0.6 }}
//         className={`w-full h-96 relative ${colorClasses.bg} rounded-xl border-2 ${colorClasses.border} overflow-hidden`}
//       >
//         <p className={`pl-5 pt-2 ${colorClasses.text} text-7xl font-normal font-['Gilroy-MediumItalic']`}>“</p>


//         <div className=" justify-start text-neutral-950 text-3xl font-normal font-['Gilroy-Regular'] pl-5 pr-4">
//           {currentTestimonial.text}
//         </div>

//         <div className=' flex justify-between pl-5 pr-1 pt-2'>
//           {/* <div className="justify-start text-neutral-500 text-sm font-normal font-['Gilroy-Regular']">
//             posted<br/>anonymously
//           </div> */}
//           {/* <div>

//           </div> */}
//           <div className='pr-4 pt-5'>
//             <div className={`${colorClasses.text} justify-end items-end text-5xl font-normal font-['Gilroy-Bold'] tracking-tighter`}>
//               {currentTestimonial.tag}
//             </div>
//             <div className="flex justify-start text-neutral-500 text-sm font-normal font-['Gilroy-Regular']">
//               posted anonymously
//             </div>
//           </div>
//         </div>
//       </div>

//     </div>

// </div>
//   );
// };

// export default Testimonials;


import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Testimonial {
  id: number;
  text: string;
  tag: string;
  color: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    text: "I did it twice just for the questions. too hard hitting. I never thought about myself so deeply before this",
    tag: "Deep",
    color: "blue"
  },
  {
    id: 2,
    text: "Free result was too crazy… specially the quotes section.",
    tag: "Unreal",
    color: "purple"
  },
  {
    id: 3,
    text: "Astrology section made me question everything I was doing",
    tag: "Mind",
    color: "green"
  },
  {
    id: 4,
    text: "The premium report felt like someone wrote a research report on me. I have never felt so seen",
    tag: "Brain-map",
    color: "orange"
  },
  {
    id: 5,
    text: "Made me realize what I should be actually working on.",
    tag: "Actionable",
    color: "red"
  }
];

const getColorClasses = (color: string) => {
  const colorMap = {
    blue: { bg: 'bg-[#E2EFFF]', border: 'border-[#84ADDF]', text: 'text-[#004A7F]' },
    purple: { bg: 'bg-[#E9EAFF]', border: 'border-[#696CB8]', text: 'text-[#50007F]' },
    green: { bg: 'bg-[#E6FFDE]', border: 'border-[#96C486]', text: 'text-[#2A7F00]' },
    orange: { bg: 'bg-[#FFECFF]', border: 'border-[#C381C3]', text: 'text-[#7F006A]' },
    red: { bg: 'bg-[#FFE2E2]', border: 'border-[#CA7D7D]', text: 'text-[#A4090B]' }
  };
  return colorMap[color as keyof typeof colorMap] || colorMap.blue;
};

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  useEffect(() => {
  const interval = setInterval(() => {
    setCurrentIndex((prev) => prev + 1);
  }, 4000);

  return () => clearInterval(interval);
}, []);


useEffect(() => {
  if (currentIndex === testimonials.length) {
    // Reset to 0 after the transition completes
    const timeout = setTimeout(() => {
      setCurrentIndex(0);
    }, 1000); // Wait for the 1s transition to complete
    
    return () => clearTimeout(timeout);
  }
}, [currentIndex]);



  return (
    <div className='p-4 mt-5 flex flex-col gap-4'>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="justify-start text-neutral-950 text-4xl font-normal font-['Gilroy-Medium']">Testimonials.</div>
      </div>

      <div className='relative overflow-hidden'>
        <div 
          className="flex transition-transform duration-1000 ease-in-out"
          style={{
            transform: `translateX(calc(-${currentIndex * 100}% - ${currentIndex * 16}px))`,
            transition: currentIndex === 0 && currentIndex !== testimonials.length ? 'none' : 'transform 1s ease-in-out'
          }}
          >
          {[...testimonials, ...testimonials].map((testimonial, index) => {
            const colorClasses = getColorClasses(testimonial.color);
            
            return (
              <div
                key={`${testimonial.id}-${index}`}
                className={`w-full mr-4 h-96 relative ${colorClasses.bg} rounded-xl border-2 ${colorClasses.border} overflow-hidden flex-shrink-0`}
              >
                <p className={`pl-5 pt-2 ${colorClasses.text} text-7xl font-normal font-['Gilroy-MediumItalic']`}>"</p>

                <div className=" justify-start text-neutral-950 text-3xl font-normal font-['Gilroy-Regular'] pl-5 pr-4">
                  {testimonial.text}
                </div>

                <div className=' flex justify-between pl-5 pr-1 pt-2'>
                  <div className='pr-4 pt-5'>
                    <div className={`${colorClasses.text} justify-end items-end text-5xl font-normal font-['Gilroy-Bold'] tracking-tighter`}>
                      {testimonial.tag}
                    </div>
                    <div className="flex justify-start text-neutral-500 text-sm font-normal font-['Gilroy-Regular']">
                      posted anonymously
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Testimonials;