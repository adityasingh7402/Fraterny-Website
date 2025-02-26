
const Hero = () => {
  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-white">
      <div className="container px-6 py-32 mx-auto text-center">
        <div className="animate-fade-down">
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-8">
            Transform Your Vision
            <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-gray-800 to-gray-600">
              Into Reality
            </span>
          </h1>
        </div>
        
        <div className="animate-fade-up delay-100">
          <p className="max-w-2xl mx-auto text-lg md:text-xl text-gray-600 mb-12">
            We create beautiful, functional websites that help businesses grow and succeed in the digital world.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-3 rounded-lg bg-gray-900 text-white hover:bg-gray-800 transition-all">
              Get Started
            </button>
            <button className="px-8 py-3 rounded-lg border border-gray-300 hover:border-gray-400 transition-all">
              Learn More
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
