
import React from 'react';
import { Code, Brain, BookOpen, FileCheck, Users, Heart, ChefHat, Users2 } from 'lucide-react';
import { useIsMobile } from '../../hooks/use-mobile';
import ResponsiveImage from '../ui/ResponsiveImage';

const depthFeatures = [
  { 
    icon: <Code className="w-6 h-6" />, 
    title: "Ingrained House Code", 
    description: "Crafted house rules to boost engagement, clarity of thought and productivity",
    dynamicKey: "depth-house-code",
    imageSrc: {
      mobile: "/images/depth/house-code-mobile.webp",
      desktop: "/images/depth/house-code-desktop.webp"
    },
    imageAlt: "Entrepreneurs discussing house rules in a premium workspace"
  },
  { 
    icon: <Brain className="w-6 h-6" />, 
    title: "Startup Simulations", 
    description: "Building a startup from ground up in a team environment",
    dynamicKey: "depth-startup",
    imageSrc: {
      mobile: "/images/depth/startup-mobile.webp", 
      desktop: "/images/depth/startup-desktop.webp"
    },
    imageAlt: "Team engaging in startup simulation exercises"
  },
  { 
    icon: <BookOpen className="w-6 h-6" />, 
    title: "Learning Experience", 
    description: "Business Knowledge is not even a unique proposition, its a given",
    dynamicKey: "depth-learning",
    imageSrc: {
      mobile: "/images/depth/learning-mobile.webp",
      desktop: "/images/depth/learning-desktop.webp"
    },
    imageAlt: "Knowledge sharing session among entrepreneurs"
  },
  { 
    icon: <FileCheck className="w-6 h-6" />, 
    title: "Curated frameworks & templates", 
    description: "Carefully crafted Frameworks for personal and career growth",
    dynamicKey: "depth-frameworks",
    imageSrc: {
      mobile: "/images/depth/frameworks-mobile.webp",
      desktop: "/images/depth/frameworks-desktop.webp"
    },
    imageAlt: "Organized workspace with growth framework materials"
  },
  { 
    icon: <Users className="w-6 h-6" />, 
    title: "Group Think", 
    description: "Collaborative thinking and team activities to broaden your perspective",
    dynamicKey: "depth-group-think",
    imageSrc: {
      mobile: "/images/depth/group-think-mobile.webp",
      desktop: "/images/depth/group-think-desktop.webp"
    },
    imageAlt: "Collaborative brainstorming session in progress"
  },
  { 
    icon: <Heart className="w-6 h-6" />, 
    title: "Lifelong memories", 
    description: "Feel amazing while on the grind",
    dynamicKey: "depth-memories",
    imageSrc: {
      mobile: "/images/depth/memories-mobile.webp",
      desktop: "/images/depth/memories-desktop.webp"
    },
    imageAlt: "Participants sharing meaningful moments together"
  },
  { 
    icon: <ChefHat className="w-6 h-6" />, 
    title: "Great Food, Good Coffee and more", 
    description: "Caffeine is the secret of my energy",
    dynamicKey: "depth-food",
    imageSrc: {
      mobile: "/images/depth/food-mobile.webp",
      desktop: "/images/depth/food-desktop.webp"
    },
    imageAlt: "Premium dining experience with gourmet food"
  },
  { 
    icon: <Users2 className="w-6 h-6" />, 
    title: "Post Program Community", 
    description: "Fraterny is not a one week experience, it is a constantly growing ecosystem.",
    dynamicKey: "depth-community",
    imageSrc: {
      mobile: "/images/depth/community-mobile.webp",
      desktop: "/images/depth/community-desktop.webp"
    },
    imageAlt: "Alumni networking and continued community building"
  },
  { 
    icon: <Brain className="w-6 h-6" />, 
    title: "Soft Skills", 
    description: "Critical Thinking, Effective Communication and Empathy. Everyone has principles, no one offers practice",
    dynamicKey: "depth-soft-skills",
    imageSrc: {
      mobile: "/images/depth/soft-skills-mobile.webp",
      desktop: "/images/depth/soft-skills-desktop.webp"
    },
    imageAlt: "Soft skills workshop in an elegant setting"
  },
];

const DepthSection = () => {
  const isMobile = useIsMobile();
  
  return (
    <section className={`${isMobile ? 'pt-6 pb-16' : 'py-16'} bg-white`}>
      <div className="container mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-playfair text-navy mb-12 text-center">
          Designed for Depth
        </h2>
        
        {isMobile ? (
          <div className="space-y-6">
            {depthFeatures.map((feature, index) => (
              <React.Fragment key={index}>
                <div 
                  className="flex flex-col items-center text-center p-6 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  <div className="bg-terracotta bg-opacity-10 p-4 rounded-full mb-4">
                    <div className="text-terracotta">{feature.icon}</div>
                  </div>
                  <h3 className="font-medium text-navy text-lg mb-3">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
                
                <div className="aspect-[16/9] w-full overflow-hidden rounded-xl shadow-md">
                  <ResponsiveImage 
                    dynamicKey={feature.dynamicKey}
                    alt={feature.imageAlt}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
              </React.Fragment>
            ))}
          </div>
        ) : (
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
        )}
      </div>
    </section>
  );
};

export default DepthSection;
