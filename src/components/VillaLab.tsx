
const VillaLab = () => {
  const activities = [
    { 
      title: "Workshops", 
      image: "https://images.unsplash.com/photo-1439337153520-7082a56a81f4" // Modern glass roof interior
    },
    { 
      title: "Gourmet Meals", 
      image: "https://images.unsplash.com/photo-1721322800607-8c38375eef04" // Luxury living room
    },
    { 
      title: "Group Activities", 
      image: "https://images.unsplash.com/photo-1482938289607-e9573fc25ebb" // River between mountains
    },
    { 
      title: "Candid Interactions", 
      image: "https://images.unsplash.com/photo-1472396961693-142e6e269027" // Scenic mountain view
    },
    { 
      title: "Networking", 
      image: "https://images.unsplash.com/photo-1721322800607-8c38375eef04" // Luxury living room
    },
    { 
      title: "Evening Sessions", 
      image: "https://images.unsplash.com/photo-1615729947596-a598e5de0ab3" // Green mountains
    },
    { 
      title: "Brainstorming", 
      image: "https://images.unsplash.com/photo-1439337153520-7082a56a81f4" // Modern glass roof interior
    },
    { 
      title: "Mentorship", 
      image: "https://images.unsplash.com/photo-1501854140801-50d01698950b" // Bird's eye mountain view
    },
    { 
      title: "Social Events", 
      image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb" // Serene lake view
    }
  ];

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-playfair text-navy mb-2">
          The Villa Lab
        </h2>
        <p className="text-xl text-gray-600 mb-8">
          Work hard. Bond harder.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-3">
          {activities.slice(0, window.innerWidth < 768 ? 6 : 9).map((activity, index) => (
            <div 
              key={index}
              className="aspect-square bg-navy rounded-lg overflow-hidden relative group"
            >
              <img
                src={activity.image}
                alt={activity.title}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                <span className="text-white p-4 font-medium">{activity.title}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default VillaLab;
