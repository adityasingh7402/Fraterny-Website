
import { lazy, Suspense } from 'react';
import { Calendar, Users, BookOpen, Coffee, Brain, Heart, Code, FileCheck, ChefHat, Users2 } from 'lucide-react';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';

// Lazy load components that are below the fold
const TribeSection = lazy(() => import('../components/experience/TribeSection'));
const DepthSection = lazy(() => import('../components/experience/DepthSection'));

const Experience = () => {
  const timelineEvents = [
    { time: "11:30 AM", title: "Brainstorming Breakfasts", description: "Start your day with engaging discussions" },
    { time: "1:00 PM", title: "Team Activity Afternoons", description: "Collaborative sessions and workshops" },
    { time: "6:00 PM", title: "Simulation Sunsets", description: "Apply learnings in practical scenarios" },
    { time: "12:00 AM", title: "Midnight Momentum", description: "Deep conversations and connections" },
  ];

  const experienceImages = [
    {
      url: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&q=80&w=2000",
      alt: "Serene lakeside retreat surrounded by lush forest"
    },
    {
      url: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&q=80&w=2000",
      alt: "Misty mountain peak at sunrise"
    },
    {
      url: "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&q=80&w=2000",
      alt: "Rolling ocean waves meeting the shore"
    },
    {
      url: "https://images.unsplash.com/photo-1482881497185-d4a9ddbe4151?auto=format&q=80&w=2000",
      alt: "Golden desert dunes at sunset"
    },
    {
      url: "https://images.unsplash.com/photo-1501854140801-50d01698950b?auto=format&q=80&w=2000",
      alt: "Aerial view of verdant mountain landscape"
    },
    {
      url: "https://images.unsplash.com/photo-1487958449943-2429e8be8625?auto=format&q=80&w=2000",
      alt: "Modern architectural marvel in white"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-navy text-white relative">
        {/* Background Image - Optimized with loading priority */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ 
            backgroundImage: `url('https://images.unsplash.com/photo-1439337153520-7082a56a81f4?auto=format&q=80&w=2400')`,
          }}
        >
          <img 
            src="https://images.unsplash.com/photo-1439337153520-7082a56a81f4?auto=format&q=80&w=2400"
            alt="Luxury villa exterior"
            className="hidden"
            fetchPriority="high"
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

        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-playfair mb-6">
              Condensing lifelong memories, lessons, and friendships in a week.
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-300">
              20 people. 7 days. 1 life-changing experience
            </p>
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
      </section>

      {/* Timeline Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-playfair text-navy mb-4">A Day in the Villa</h2>
          <p className="text-lg text-gray-600 mb-12 max-w-3xl">
            We create the perfect conditions for you to have the most insightful conversations, amazing memories and take action towards your goals
          </p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {timelineEvents.map((event, index) => (
              <div key={index} className="bg-gray-50 p-6 rounded-lg">
                <div className="text-terracotta font-mono mb-2">{event.time}</div>
                <h3 className="font-medium text-navy mb-2">{event.title}</h3>
                <p className="text-gray-600 text-sm">{event.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Experience Images Section */}
      <section className="w-full">
        <div className="grid grid-cols-1 md:grid-cols-2">
          {experienceImages.map((image, index) => (
            <div key={index} className="aspect-[4/3] w-full">
              <img 
                src={image.url} 
                alt={image.alt}
                className="w-full h-full object-cover"
                loading={index < 2 ? "eager" : "lazy"}
                decoding="async"
              />
            </div>
          ))}
        </div>
      </section>

      {/* Lazy loaded sections */}
      <Suspense fallback={<div className="h-48 flex items-center justify-center">Loading...</div>}>
        <TribeSection />
        <DepthSection />
      </Suspense>

      <Footer />
    </div>
  );
};

export default Experience;
