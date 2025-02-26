
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
    <section className="py-24 bg-white">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-playfair text-navy mb-2">
          The Villa Lab
        </h2>
        <p className="text-xl text-gray-600 mb-12">
          Work hard. Bond harder.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {activities.slice(0, window.innerWidth < 768 ? 6 : 9).map((activity, index) => (
            <div 
              key={index}
              className="aspect-square bg-navy text-white rounded-lg overflow-hidden relative group"
            >
              <img
                src={activity.image}
                alt={activity.title}
                className="w-full h-full object-cover opacity-50 group-hover:opacity-30 transition-opacity"
              />
              <div className="absolute inset-0 flex items-center justify-center p-4 text-center">
                <h3 className="text-lg md:text-xl font-medium">{activity.title}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default VillaLab;
