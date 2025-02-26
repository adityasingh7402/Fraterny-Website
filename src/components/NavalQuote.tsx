
const NavalQuote = () => {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto text-center">
          <blockquote className="mb-8">
            <p className="text-3xl md:text-4xl font-playfair text-navy mb-6">
              "The closer you want to get to me, the better your values have to be."
            </p>
            <footer className="text-lg text-gray-600">
              ~ Naval Ravikant
            </footer>
          </blockquote>
          
          <p className="text-lg md:text-xl text-gray-600 mt-8">
            Exclusivity ensures depth. No crowds, no noise – just your future friends, cofounders.
          </p>
          
          <div className="mt-12 hidden md:block">
            <img 
              src="/placeholder.svg" 
              alt="Community Statistics" 
              className="w-full max-w-2xl mx-auto rounded-lg shadow-lg"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default NavalQuote;
