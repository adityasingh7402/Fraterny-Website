const NavalQuote = () => {
  return <section className="py-12 bg-white">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="space-y-2">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-playfair text-navy">
              "The closer you want to get to me, the better your values have to be."
            </h2>
            <p className="text-xl md:text-2xl text-gray-600 font-playfair italic">
              ~ Naval Ravikant
            </p>
          </div>
          
          <p className="text-xl md:text-2xl text-gray-600 border-l-4 border-terracotta pl-6">
            Exclusivity ensures depth. No crowds, no noise – just your future friends, cofounders.
          </p>
          
          <div className="grid md:grid-cols-2 gap-8 bg-gradient-to-br from-navy/5 to-navy/10 rounded-2xl p-8">
            <div className="space-y-4">
              <div className="text-5xl md:text-7xl font-bold text-navy">73%</div>
              <p className="text-lg md:text-xl text-gray-600">
                report improved performance in collaborative work
              </p>
            </div>
            <div className="space-y-4">
              <div className="text-5xl md:text-7xl font-bold text-terracotta">individuals report improved performance in collaborative work</div>
              <p className="text-lg md:text-xl text-gray-600">
                potential achievers are deterred from starting a venture due to inability to take action caused by fear of failure
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>;
};
export default NavalQuote;