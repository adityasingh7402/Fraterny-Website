
const VillaLab = () => {
  const activities = [
    { title: "Workshops", image: "/placeholder.svg" },
    { title: "Gourmet Meals", image: "/placeholder.svg" },
    { title: "Group Activities", image: "/placeholder.svg" },
    { title: "Candid Interactions", image: "/placeholder.svg" },
    { title: "Networking", image: "/placeholder.svg" },
    { title: "Evening Sessions", image: "/placeholder.svg" },
    { title: "Brainstorming", image: "/placeholder.svg" },
    { title: "Mentorship", image: "/placeholder.svg" },
    { title: "Social Events", image: "/placeholder.svg" }
  ];

  return (
    <section className="py-12 bg-white"> {/* Reduced from py-24 */}
      <div className="container mx-auto px-6">
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-playfair text-navy mb-2">
          The Villa Lab
        </h2>
        <p className="text-xl text-gray-600 mb-8"> {/* Reduced from mb-12 */}
          Work hard. Bond harder.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-3"> {/* Reduced gaps */}
          {activities.slice(0, window.innerWidth < 768 ? 6 : 9).map((activity, index) => (
            <div 
              key={index}
              className="aspect-square bg-navy rounded-lg overflow-hidden"
            >
              <img
                src={activity.image}
                alt={activity.title}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default VillaLab;
