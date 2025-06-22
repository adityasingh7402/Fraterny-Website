// import { Send, UserCheck, Users } from 'lucide-react';
// import { Link } from 'react-router-dom';
// const HowItWorks = () => {
//   // CUSTOMIZATION: Process Steps
//   // Modify this array to change the steps in the process
//   // Each step has: title, description, and an icon (from Lucide React)
//   const steps = [{
//     title: "Apply",
//     description: "Submit your profile",
//     icon: Send
//   }, {
//     title: "Screen",
//     description: "A brief conversation with a counselor",
//     icon: UserCheck
//   }, {
//     title: "Join",
//     description: "Welcome to the community",
//     icon: Users
//   }];
//   return <section className="bg-white mb-20 py-[38px] px-0">
//       <div className="container mx-auto px-6 py-0 my-0">
//         {/* CUSTOMIZATION: Section Title */}
//         <h2 className="text-4xl md:text-5xl lg:text-6xl font-playfair text-navy mb-16">How to Get an Invite?</h2>

//         <div className="max-w-5xl mx-auto">
//           <div className="grid md:grid-cols-3 gap-12 lg:gap-16 my-0 mx-0 px-[4px] rounded-none py-[23px]">
//             {steps.map((Step, index) => <div key={index} className="text-center">
//                 <div className="mb-8 inline-flex items-center justify-center w-20 h-20 rounded-full bg-navy text-white">
//                   <Step.icon size={32} />
//                 </div>
//                 <h3 className="text-2xl font-medium text-navy mb-3">{Step.title}</h3>
//                 <p className="text-lg text-gray-600">{Step.description}</p>
//               </div>)}
//           </div>
          
//           {/* CUSTOMIZATION: Call-to-Action Button 
//            // Links to the /process page for more detailed information
//            */}
//           <div className="flex justify-center mt-16">
//             <Link to="/process" className="px-6 py-3 bg-navy text-white rounded-lg transition-all duration-300 hover:bg-terracotta hover:scale-105 hover:shadow-lg">
//               Know More
//             </Link>
//           </div>
//         </div>
//       </div>
//     </section>;
// };
// export default HowItWorks;

import { Send, UserCheck, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, useAnimation, useInView } from 'framer-motion';
import { useRef, useEffect } from 'react';
import { lazy } from 'react';
import HeroSection from '../components/home/HeroSection';
// const VillaLabSection = lazy(() => import('../components/home/VillaLabSection'));
// const OurValuesSection = lazy(() => import('../components/home/OurValuesSection'));
// const HowItWorksSection = lazy(() => import('../components/home/HowItWorksSection'));

const HowItWorksSection = () => {
  // CUSTOMIZATION: Process Steps
  // Modify this array to change the steps in the process
  // Each step has: title, description, and an icon (from Lucide React)
  const steps = [
    {
      title: "Apply",
      description: "Submit your profile",
      icon: Send
    },
    {
      title: "Screen",
      description: "A brief conversation with a counselor",
      icon: UserCheck
    },
    {
      title: "Join",
      description: "Welcome to the community",
      icon: Users
    }
  ];

  // Animation variants
  const parentVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.18,
      },
    },
  };
  const cardVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
  };

  // In-view animation control using framer-motion's useInView
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.25 });
  const controls = useAnimation();

  useEffect(() => {
    if (isInView) {
      controls.start('visible');
    }
  }, [isInView, controls]);

  return (
    <section className="bg-white mb-20 py-[38px] px-0" ref={ref}>
      <div className="container mx-auto px-6 py-0 my-0">
        {/* FIXED: Added text-center sm:text-left for consistent section title alignment */}
        <h2 className="text-center text-4xl md:text-5xl lg:text-6xl font-playfair text-navy mb-10">
          How to Get an Invite?
        </h2>

        <div className="max-w-5xl mx-auto">
          <motion.div
            className="grid md:grid-cols-3 gap-12 lg:gap-16 my-0 mx-0 px-[4px] rounded-none py-[23px]"
            variants={parentVariants}
            initial="hidden"
            animate={controls}
          >
            {steps.map((Step, index) => (
              <motion.div
                key={index}
                className="text-center"
                variants={cardVariants}
              >
                <div className="mb-8 inline-flex items-center justify-center w-20 h-20 rounded-full bg-navy text-white">
                  <Step.icon size={32} />
                </div>
                <h3 className="text-2xl font-medium text-navy mb-3">{Step.title}</h3>
                <p className="text-lg text-gray-600">{Step.description}</p>
              </motion.div>
            ))}
          </motion.div>
          
          {/* CUSTOMIZATION: Call-to-Action Button 
           // Links to the /process page for more detailed information
           */}
          <div className="flex justify-center mt-16">
            <Link 
              to="/process" 
              className="px-6 py-3 bg-navy text-white rounded-lg transition-all duration-300 hover:bg-terracotta hover:scale-105 hover:shadow-lg"
            >
              Know More
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;