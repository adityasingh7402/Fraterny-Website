
const NavalQuote = () => {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl mb-8 font-medium">Why 20?</h2>
          
          <blockquote className="mb-12">
            <p className="text-2xl md:text-3xl font-playfair text-navy mb-6">
              "The closer you want to get to me, the better your values have to be."
            </p>
            <footer className="text-lg text-gray-600">
              ~ Naval Ravikant
            </footer>
          </blockquote>
          
          <p className="text-lg md:text-xl text-gray-600 mb-12">
            Exclusivity ensures depth. No crowds, no noise – just your future co-founders.
          </p>
          
          <div className="bg-gray-50 rounded-lg p-8 text-center md:text-left">
            <div className="text-5xl md:text-6xl font-bold text-navy mb-4">92%</div>
            <p className="text-lg text-gray-600">
              of participants say they found lifelong collaborators
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NavalQuote;
