// import React from 'react'

// const Testimonials = () => {
//   return (
//     <div className='p-4 mt-5 flex flex-col gap-4'>
//         <h1 className='font-bold text-black'
//         style={{ fontFamily: 'Gilroy-Medium', fontSize: '40px', fontWeight: 400 }}
//         >Testimonial</h1>
//         <div>
//             <div className='p-2 rounded-2xl flex flex-col gap-4 h-[350px] w-[362px]'
//             style={{ background: 'rgba(226, 239, 255, 1)',
//                 border: '2px solid rgba(132, 173, 223, 1)',
//              }}>
//                 <div><span className='gap-0 text-blue-600'
//                 style={{ fontFamily: 'Gilroy-MediumItalic', fontSize: '80px', fontWeight: 400 }}></span></div>
//                 <p className='p-4'
//                 style={{ fontFamily: 'Gilroy-Regular', fontSize: '28px', fontWeight: 400, color: '#0A0A0A' }}>
//                     I did it twice just for the questions. Too hard hitting.
//                     I never thought about myself so deeply before.
//                 </p>
//                 <div className='mt-3 items-center flex justify-between'>
//                     <p className=' text-gray-400' style={{ fontFamily: 'Gilroy-Regular', fontSize: '16px', fontWeight: 400 }}>Posted <br/> anounymously</p>
//                     <h1 className='text-[#004A7F] font-bold' style={{ fontFamily: 'Gilroy-Bold', fontSize: '48px', fontWeight: 400 }}>Deep</h1>
//                 </div>
//             </div>
//         </div>
//     </div>
//   )
// }

// export default Testimonials


import React, { useState } from 'react';
import { motion } from 'framer-motion';
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
    text: "I did it twice just for the questions. Too hard hitting. I never thought about myself so deeply before.",
    tag: "Deep",
    color: "blue"
  },
  {
    id: 2,
    text: "This test revealed patterns I never noticed. The insights were incredibly accurate and eye-opening.",
    tag: "Accurate",
    color: "purple"
  },
  {
    id: 3,
    text: "Finally, a test that goes beyond surface-level questions. The results helped me understand my true motivations.",
    tag: "Insightful",
    color: "green"
  },
  {
    id: 4,
    text: "I was skeptical at first, but the analysis was spot-on. It's like having a personal psychologist.",
    tag: "Spot-on",
    color: "orange"
  },
  {
    id: 5,
    text: "The questions made me think in ways I never had before. Truly transformative experience.",
    tag: "Transformative",
    color: "red"
  }
];

const getColorClasses = (color: string) => {
  const colorMap = {
    blue: { bg: 'bg-blue-200', border: 'border-blue-500', text: 'text-blue-700' },
    purple: { bg: 'bg-purple-200', border: 'border-purple-500', text: 'text-purple-700' },
    green: { bg: 'bg-green-200', border: 'border-green-500', text: 'text-green-700' },
    orange: { bg: 'bg-orange-200', border: 'border-orange-500', text: 'text-orange-700' },
    red: { bg: 'bg-red-200', border: 'border-red-500', text: 'text-red-700' }
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

  const currentTestimonial = testimonials[currentIndex];
  const colorClasses = getColorClasses(currentTestimonial.color);

  return (
    <div className='p-4 mt-5 flex flex-col gap-4'>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 
          className='font-bold text-black text-[40px]'
          style={{ fontFamily: 'Gilroy-Medium' }}
        >
          Testimonials.
        </h1>
        
        {/* Navigation Arrows */}
        {/* <div className="flex gap-2">
          <button
            onClick={prevTestimonial}
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
          >
            <ChevronLeft size={16} className="text-gray-600" />
          </button>
          <button
            onClick={nextTestimonial}
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
          >
            <ChevronRight size={16} className="text-gray-600" />
          </button>
        </div> */}
      </div>

      {/* Testimonial Card with Animation */}
      <div className="relative overflow-hidden">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.3 }}
          className={`p-4 rounded-md border ${colorClasses.border} ${colorClasses.bg} flex flex-col gap-4`}
        >
          {/* Quote Icon */}
          <div>
            <span className='text-6xl text-gray-400 font-serif leading-none'>"</span>
          </div>
          
          {/* Testimonial Text */}
          <p 
            className='text-[28px] leading-relaxed'
            style={{ fontFamily: 'Gilroy-Regular' }}
          >
            {currentTestimonial.text}
          </p>
          
          {/* Footer */}
          <div className='mt-3 items-center flex justify-between'>
            <p 
              className='text-xs text-gray-400 leading-tight'
              style={{ fontFamily: 'Gilroy-Regular' }}
            >
              Posted <br/> anonymously
            </p>
            <h1 
              className={`text-2xl ${colorClasses.text} font-bold`}
              style={{ fontFamily: 'Gilroy-Bold' }}
            >
              {currentTestimonial.tag}
            </h1>
          </div>
        </motion.div>
      </div>

      {/* Dots Indicator */}
      {/* <div className="flex justify-center gap-2 mt-2">
        {testimonials.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 rounded-full transition-colors ${
              index === currentIndex ? 'bg-gray-800' : 'bg-gray-300'
            }`}
          />
        ))}
      </div> */}
    </div>
  );
};

export default Testimonials;