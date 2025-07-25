import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
import { useEffect } from 'react';

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
    text: "free result was too crazy… specially the quotes section.",
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
    blue: { bg: 'bg-blue-200', border: 'border-blue-300', text: 'text-blue-700' },
    purple: { bg: 'bg-purple-200', border: 'border-purple-300', text: 'text-purple-700' },
    green: { bg: 'bg-green-200', border: 'border-green-300', text: 'text-green-700' },
    orange: { bg: 'bg-orange-200', border: 'border-orange-300', text: 'text-orange-700' },
    red: { bg: 'bg-red-200', border: 'border-red-300', text: 'text-red-700' }
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

  useEffect(() => {
  const interval = setInterval(() => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  }, 4000); // change duration if needed

  return () => clearInterval(interval); // cleanup
}, []);

  return (
    <div className='p-4 mt-5 flex flex-col gap-4'>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="justify-start text-neutral-950 text-4xl font-normal font-['Gilroy-Medium']">Testimonials.</div>
      </div>

    <div className='relative overflow-hidden'>
      {/* <div 
        className="flex transition-transform duration-500 ease-in-out"
        style={{ 
          transform: `translateX(-${currentIndex * 100}%)`,
          width: `${testimonials.length * 100}%`
        }}
      >
        {testimonials.map((testimonial) => (
          <div key={testimonial.id} className="w-full h-96 relative bg-sky-100 rounded-xl outline outline-2 outline-offset-[-2px] outline-blue-300 overflow-hidden mb-4">
            <div className='flex flex-col'>
            <p className="pl-5 pt-2 text-sky-800 text-7xl font-normal font-['Gilroy-MediumItalic']">"</p>
            <div className="justify-center text-left pl-5 text-neutral-950 text-3xl font-normal font-['Gilroy-Regular'] absolute top-[15%]">{testimonial.text}</div>
            </div>
            <div className='flex justify-between px-5 pt-12 pb-12 xs:pb-8 sm:pb-10 md:pb-12 lg:pb-12 xl:pb-12'>
              <div className="text-start text-neutral-500 text-base font-normal font-['Gilroy-Regular'] absolute bottom-10">posted<br/>anonymously</div>
              <div className="text-end text-sky-800 text-5xl font-bold font-['Gilroy-Bold'] tracking-[-5px] absolute bottom-10 right-5">{testimonial.tag}</div>
            </div>
          </div>
        ))}
      </div> */}
      <motion.div
        key={currentTestimonial.id}
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -100 }}
        transition={{ duration: 0.6 }}
        className={`w-full h-auto relative ${colorClasses.bg} rounded-xl border-2 ${colorClasses.border} overflow-hidden mb-4 pb-40`}
      >
        <p className={`pl-5 pt-2 ${colorClasses.text} text-7xl font-normal font-['Gilroy-MediumItalic']`}>“</p>


        <div className="justify-center text-left pl-5 text-neutral-950 text-3xl font-normal font-['Gilroy-Regular'] absolute top-[15%]">
          {currentTestimonial.text}
        </div>

        <div className='flex justify-between px-5 pt-12 pb-12 xs:pb-8 sm:pb-10 md:pb-12 lg:pb-12 xl:pb-12'>
          <div className="text-start text-neutral-500 text-base font-normal font-['Gilroy-Regular'] absolute bottom-10">
            posted<br/>anonymously
          </div>
          <div className={`text-end ${colorClasses.text} text-5xl font-bold font-['Gilroy-Bold'] tracking-[-5px] absolute bottom-10 right-5`}>
            {currentTestimonial.tag}
          </div>
        </div>
      </motion.div>

    </div>

</div>
  );
};

export default Testimonials;