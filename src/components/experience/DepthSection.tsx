import React from 'react';
import { Code, Brain, BookOpen, FileCheck, Users, Heart, ChefHat, Users2 } from 'lucide-react';

const depthFeatures = [
  { icon: <Code className="w-6 h-6" />, title: "Ingrained House Code", description: "Crafted house rules to boost engagement, clarity of thought and productivity" },
  { icon: <Brain className="w-6 h-6" />, title: "Startup Simulations", description: "Building a startup from ground up in a team environment" },
  { icon: <BookOpen className="w-6 h-6" />, title: "Learning Experience", description: "Business Knowledge is not even a unique proposition, its a given" },
  { icon: <FileCheck className="w-6 h-6" />, title: "Curated frameworks & templates", description: "Carefully crafted Frameworks for personal and career growth" },
  { icon: <Users className="w-6 h-6" />, title: "Group Think", description: "Collaborative thinking and team activities to broaden your perspective" },
  { icon: <Heart className="w-6 h-6" />, title: "Lifelong memories", description: "Feel amazing while on the grind" },
  { icon: <ChefHat className="w-6 h-6" />, title: "Great Food, Good Coffee and more", description: "Caffeine is the secret of my energy" },
  { icon: <Users2 className="w-6 h-6" />, title: "Post Program Community", description: "Fraterny is not a one week experience, it is a constantly growing ecosystem." },
  { icon: <Brain className="w-6 h-6" />, title: "Soft Skills", description: "Critical Thinking, Effective Communication and Empathy. Everyone has principles, no one offers practice" },
];

const DepthSection = () => {
  return (
    <section className="relative">
      {/* Mobile layout (overlay) */}
      <div className="md:hidden py-16 relative z-10">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-playfair text-white mb-12 text-center">
            Designed for Depth
          </h2>
          
          <div className="grid grid-cols-1 gap-6">
            {depthFeatures.map((feature, index) => (
              <div 
                key={index} 
                className="flex flex-col items-center text-center p-6 rounded-xl bg-white/90 backdrop-blur-md hover:bg-white/95 transition-colors shadow-lg"
              >
                <div className="bg-terracotta bg-opacity-10 p-4 rounded-full mb-4">
                  <div className="text-terracotta">{feature.icon}</div>
                </div>
                <h3 className="font-medium text-navy text-lg mb-3">{feature.title}</h3>
                <p className="text-gray-700">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Desktop layout (unchanged) */}
      <div className="hidden md:block py-16 bg-white">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-playfair text-navy mb-12 text-center">
            Designed for Depth
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {depthFeatures.map((feature, index) => (
              <div 
                key={index} 
                className="flex flex-col items-center text-center p-6 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                <div className="bg-terracotta bg-opacity-10 p-4 rounded-full mb-4">
                  <div className="text-terracotta">{feature.icon}</div>
                </div>
                <h3 className="font-medium text-navy text-lg mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default DepthSection;
