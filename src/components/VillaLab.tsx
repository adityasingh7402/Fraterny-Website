
const VillaLab = () => {
  const activities = [
    { title: "Workshop", image: "/placeholder.svg" },
    { title: "Meals", image: "/placeholder.svg" },
    { title: "Activities", image: "/placeholder.svg" },
    { title: "Networking", image: "/placeholder.svg" }
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

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {activities.map((activity, index) => (
            <div 
              key={index}
              className="aspect-square bg-navy text-white rounded-lg overflow-hidden relative group"
            >
              <img
                src={activity.image}
                alt={activity.title}
                className="w-full h-full object-cover opacity-50 group-hover:opacity-30 transition-opacity"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <h3 className="text-xl font-medium">{activity.title}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default VillaLab;
