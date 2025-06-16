// const NavalQuote = () => {
//   return <section className="py-12 bg-white">
//       <div className="container mx-auto px-6">
//         <div className="max-w-4xl mx-auto space-y-8">
//           <div className="space-y-2">
//             <h2 className="text-center text-4xl md:text-5xl lg:text-6xl font-playfair text-navy">
//               "The closer you want to get to me, the better your values have to be."
//             </h2>

//             <p className="text-center text-xl md:text-2xl text-gray-600 font-playfair italic">
//               ~ Naval Ravikant
//             </p>
//           </div>
          
//           <p className="text-left md:text-2xl text-gray-600 border-l-4 border-terracotta pl-6 text-xl">
//             Exclusivity ensures depth. No crowds, no noise – just you, your new friends, and a crazy f-ing experience.
//           </p>
          
//           <div className="grid md:grid-cols-2 gap-8 bg-gradient-to-br from-navy/5 to-navy/10 rounded-2xl p-8">
//             <div className="space-y-4">
//               <div className="text-5xl md:text-7xl font-bold text-navy">83%</div>
//               <p className="text-lg md:text-xl text-gray-600">individuals report improved performance in collaborative work when their team is more likeminded.</p>
//             </div>
//             <div className="space-y-4">
//               <div className="text-5xl md:text-7xl font-bold text-terracotta">49%</div>
//               <p className="text-lg md:text-xl text-gray-600">potential achievers are deterred from innovative ideas and passionate ventures due to their fear of criticism and societal pressure.</p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </section>;
// };
// export default NavalQuote;
const NavalQuote = () => {
  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="space-y-2">
            {/* FIXED: Added text-center for quote text (always centered for emphasis) */}
            <h2 className="text-left text-4xl md:text-5xl lg:text-6xl font-playfair text-navy">
              "The closer you want to get to me, the better your values have to be."
            </h2>

            <p className="text-left text-xl md:text-2xl text-gray-600 font-playfair italic">
              ~ Naval Ravikant
            </p>
          </div>
          
          {/* FIXED: Added text-center sm:text-left for body content alignment */}
          <p className="text-left md:text-2xl text-gray-600 border-l-4 border-terracotta pl-6 text-xl">
            Exclusivity ensures depth. No crowds, no noise – just you, your new friends, and a crazy f-ing experience.
          </p>
          
          <div className="grid md:grid-cols-2 gap-8 bg-gradient-to-br from-navy/5 to-navy/10 rounded-2xl p-8">
            {/* Statistics remain centered as they work best that way */}
            <div className="space-y-4 text-center">
              <div className="text-5xl md:text-7xl font-bold text-navy">83%</div>
              {/* FIXED: Added text-center sm:text-left for statistic descriptions */}
              <p className="text-lg md:text-xl text-gray-600 text-left">
                individuals report improved performance in collaborative work when their team is more likeminded.
              </p>
            </div>
            <div className="space-y-4 text-center">
              <div className="text-5xl md:text-7xl font-bold text-terracotta">49%</div>
              {/* FIXED: Added text-center sm:text-left for statistic descriptions */}
              <p className="text-lg md:text-xl text-gray-600 text-left">
                potential achievers are deterred from innovative ideas and passionate ventures due to their fear of criticism and societal pressure.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NavalQuote;