// /src/components/quest-landing/sections/FaqSection.tsx

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X } from 'lucide-react';

interface FaqSectionProps {
  className?: string;
}

interface FaqItem {
  question: string;
  answer: string;
}

const faqs: FaqItem[] = [
  {
    question: "Who is Quest?",
    answer: "I am the key that unlocks the door to your subconscious mind.\n\nI perform in-depth psychoanalysis, semantic analysis and multidimensional reasoning on your responses to my questions about your demographics, background, aspirations, habits and self-image, to dig deeper into your true self."
  },
  {
    question: "Who is this test for?",
    answer: "This test is designed for anyone seeking deeper self-understanding and personal growth. Whether you're a professional looking to enhance your leadership skills or someone on a journey of self-discovery."
  },
  {
    question: "Is this test free?",
    answer: "The basic assessment is free and provides valuable insights. We also offer premium packages with more detailed analysis and personalized recommendations."
  },
  {
    question: "How to maximize my benefit from this test?",
    answer: "Be honest and thoughtful in your responses. Take your time with each question and answer authentically. The more genuine your responses, the more accurate and valuable your results will be."
  },
  {
    question: "Is this a personality test?",
    answer: "This goes beyond traditional personality tests. It's a comprehensive psychological analysis that examines your motivations, patterns, and subconscious drivers using advanced AI reasoning."
  },
  {
    question: "Is my personal information secure?",
    answer: "Yes, we take privacy seriously. All your data is encrypted and stored securely. We never share your personal information with third parties without your explicit consent."
  }
];

const FaqSection: React.FC<FaqSectionProps> = ({ 
  className = '' 
}) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0); // First item open by default

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section 
      className={`w-full min-h-screen px-6 py-12 ${className}`}
      style={{ backgroundColor: '#004A7F' }}
    >
      {/* FAQ Title */}
      <div className="mb-12">
        <h2 
          className="text-white mb-8"
          style={{
            fontFamily: 'Gilroy-Medium',
            fontWeight: 400,
            fontSize: '40px',
            lineHeight: '100%',
            letterSpacing: '0%'
          }}
        >
          FAQs
        </h2>
      </div>

      {/* FAQ Items */}
      <div className="space-y-0">
        {faqs.map((faq, index) => (
          <div key={index} className="border-b border-white/20">
            {/* Question */}
            <button
              onClick={() => toggleFaq(index)}
              className="w-full py-6 flex items-center justify-between text-left hover:bg-white/5 transition-colors duration-200"
            >
              <h3 
                className="text-white pr-4"
                style={{
                  fontFamily: 'Gilroy-Regular',
                  fontWeight: 400,
                  fontSize: '28px',
                  lineHeight: '100%',
                  letterSpacing: '0%'
                }}
              >
                {faq.question}
              </h3>
              
              {/* Expand/Collapse Icon */}
              <motion.div
                animate={{ rotate: openIndex === index ? 45 : 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="flex-shrink-0 w-8 h-8 flex items-center justify-center"
              >
                {openIndex === index ? (
                  <X size={24} className="text-white" />
                ) : (
                  <Plus size={24} className="text-white" />
                )}
              </motion.div>
            </button>

            {/* Answer */}
            <AnimatePresence>
              {openIndex === index && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <div className="pb-6 pr-12">
                    <p 
                      className="text-white whitespace-pre-line"
                      style={{
                        fontFamily: 'Gilroy-Regular',
                        fontWeight: 400,
                        fontSize: '20px',
                        lineHeight: '130%',
                        letterSpacing: '0%'
                      }}
                    >
                      {faq.answer}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FaqSection;