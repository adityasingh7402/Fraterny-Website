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
        <div className="justify-start text-neutral-950 text-4xl font-normal font-['Gilroy-Medium']">Testimonials.</div>
      </div>


    <div className='relative overflow-hidden'>
        <div className="w-full h-96 relative bg-sky-100 rounded-xl outline outline-2 outline-offset-[-2px] outline-blue-300 overflow-hidden">
        <div className="justify-start pl-5 pt-2 text-sky-800 text-7xl font-normal font-['Gilroy-MediumItalic']">“</div>
        <div className="justify-center text-left pl-5 text-neutral-950 text-3xl font-normal font-['Gilroy-Regular']">I did it twice just for the questions. Too hard hitting. I neverthought about myself so deeply before this.</div>
        <div className='flex justify-between px-5 pt-12'>
        <div className="text-start text-neutral-500 text-base font-normal font-['Gilroy-Regular']">posted<br/>anonymously</div>
        <div className="text-end text-sky-800 text-5xl font-normal font-['Gilroy-Bold']">Deep</div>
        </div>
        
    </div>


</div>


    </div>
  );
};

export default Testimonials;