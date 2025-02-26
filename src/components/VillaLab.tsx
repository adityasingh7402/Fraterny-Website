
const VillaLab = () => {
  const images = [
    { url: "/placeholder.svg", alt: "Workshop Session" },
    { url: "/placeholder.svg", alt: "Gourmet Meal" },
    { url: "/placeholder.svg", alt: "Group Interaction" },
    { url: "/placeholder.svg", alt: "Collaboration Space" },
    { url: "/placeholder.svg", alt: "Evening Discussion" },
    { url: "/placeholder.svg", alt: "Team Building" },
    { url: "/placeholder.svg", alt: "Brainstorming" },
    { url: "/placeholder.svg", alt: "Networking Event" },
    { url: "/placeholder.svg", alt: "Community Gathering" },
  ];

  return (
    <section className="py-24 bg-gray-50">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl md:text-5xl font-playfair text-navy text-center mb-4">
          The Villa Lab
        </h2>
        <p className="text-xl text-center text-terracotta mb-12 font-medium">
          Work hard. Bond harder.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {images.slice(0, window.innerWidth >= 768 ? 9 : 6).map((image, index) => (
            <div 
              key={index}
              className="aspect-square overflow-hidden rounded-lg shadow-lg transition-transform hover:scale-105"
            >
              <img
                src={image.url}
                alt={image.alt}
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
