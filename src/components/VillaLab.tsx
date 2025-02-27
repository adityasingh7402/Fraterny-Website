
import { ArrowRight } from 'lucide-react';
import { useMemo } from 'react';

const VillaLab = () => {
  // Memoize the activities array to prevent recreation on each render
  const activities = useMemo(() => [
    { 
      title: "Workshops", 
      image: "https://images.unsplash.com/photo-1439337153520-7082a56a81f4?auto=format&q=75&w=800" 
    },
    { 
      title: "Gourmet Meals", 
      image: "https://images.unsplash.com/photo-1721322800607-8c38375eef04?auto=format&q=75&w=800" 
    },
    { 
      title: "Group Activities", 
      image: "https://images.unsplash.com/photo-1482938289607-e9573fc25ebb?auto=format&q=75&w=800" 
    },
    { 
      title: "Candid Interactions", 
      image: "https://images.unsplash.com/photo-1472396961693-142e6e269027?auto=format&q=75&w=800" 
    },
    { 
      title: "Networking", 
      image: "https://images.unsplash.com/photo-1721322800607-8c38375eef04?auto=format&q=75&w=800" 
    },
    { 
      title: "Evening Sessions", 
      image: "https://images.unsplash.com/photo-1615729947596-a598e5de0ab3?auto=format&q=75&w=800" 
    },
    { 
      title: "Brainstorming", 
      image: "https://images.unsplash.com/photo-1439337153520-7082a56a81f4?auto=format&q=75&w=800" 
    },
    { 
      title: "Mentorship", 
      image: "https://images.unsplash.com/photo-1501854140801-50d01698950b?auto=format&q=75&w=800" 
    },
    { 
      title: "Social Events", 
      image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&q=75&w=800" 
    }
  ], []);

  // Get the window width only on client-side
  const displayCount = typeof window !== 'undefined' && window.innerWidth < 768 ? 6 : 9;

  return (
    <section className="py-16 sm:py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="mb-8 sm:mb-12">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-playfair text-navy mb-3 sm:mb-4">
            The Villa Lab
          </h2>
          <p className="text-lg sm:text-xl text-gray-600">
            Work hard. Bond harder.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 sm:gap-3 md:gap-4">
          {activities.slice(0, displayCount).map((activity, index) => (
            <div 
              key={index}
              className="aspect-square bg-navy rounded-lg overflow-hidden relative group"
            >
              <img
                src={activity.image}
                alt={activity.title}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                loading={index < 4 ? "eager" : "lazy"}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                <span className="text-white p-4 font-medium">{activity.title}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 sm:mt-12 text-right">
          <a 
            href="https://www.instagram.com/join.fraterny/?hl=en" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="inline-flex items-center text-navy hover:text-terracotta transition-colors group"
          >
            <span className="mr-2">see more</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </a>
        </div>
      </div>
    </section>
  );
};

export default VillaLab;
