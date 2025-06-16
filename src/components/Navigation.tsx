
// import { useState, useMemo } from 'react';
// import { Menu, X } from 'lucide-react';
// import { useAuth } from '@/contexts/AuthContext';
// import Logo from './navigation/Logo';
// import DesktopNavigation from './navigation/DesktopNavigation';
// import MobileMenu from './navigation/MobileMenu';
// import { useScrollEffect } from './navigation/useScrollEffect';

// const Navigation = () => {
//   const { signOut, user, authReady } = useAuth();
//   const { isScrolled, isPastHero } = useScrollEffect();
//   const [isMenuOpen, setIsMenuOpen] = useState(false);

//   const navLinks = [
//     { name: 'The Experience', href: '/experience' },
//     { name: 'Process', href: '/process' },
//     { name: 'Pricing', href: '/pricing' },
//     { name: 'Blog', href: '/blog' },
//     { name: 'FAQ', href: '/faq' },
//   ];

//   const iconColor = useMemo(() => isScrolled ? '#0A1A2F' : '#FFFFFF', [isScrolled]);

//   const navClasses = useMemo(() => `fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out ${
//     isScrolled ? 'glass shadow-lg py-2' : 'py-4'
//   }`, [isScrolled]);

//   const toggleMenu = () => {
//     setIsMenuOpen(prev => !prev);
//   };

//   const handleSignOut = async () => {
//     try {
//       await signOut();
//       setIsMenuOpen(false);
//     } catch (error) {
//       console.error('Error signing out:', error);
//     }
//   };

//   // Only render once auth state is determined to prevent flash of incorrect UI
//   if (!authReady) {
//     return (
//       <nav className={navClasses}>
//         <div className="container mx-auto px-4 sm:px-6">
//           <div className="flex items-center justify-between">
//             <Logo isPastHero={isPastHero} />
//             <div className="w-10 h-10"></div> {/* Empty placeholder for loading state */}
//           </div>
//         </div>
//       </nav>
//     );
//   }

//   return (
//     <nav className={navClasses}>
//       <div className="container mx-auto px-4 sm:px-6">
//         <div className="flex items-center justify-between">
//           <Logo isPastHero={isPastHero} />
          
//           <DesktopNavigation 
//             isScrolled={isScrolled} 
//             navLinks={navLinks} 
//             user={user}
//             onSignOut={handleSignOut}
//           />

//           <button
//             className={`lg:hidden ${isScrolled ? 'text-navy' : 'text-white'}`}
//             onClick={toggleMenu}
//             aria-label="Toggle menu"
//             aria-expanded={isMenuOpen}
//           >
//             {isMenuOpen ? <X size={24} color={iconColor} /> : <Menu size={24} color={iconColor} />}
//           </button>
//         </div>

//         <MobileMenu 
//           isOpen={isMenuOpen}
//           isScrolled={isScrolled}
//           toggleMenu={toggleMenu}
//           navLinks={navLinks}
//           user={user}
//           onSignOut={handleSignOut}
//         />
//       </div>
//     </nav>
//   );
// };

// export default Navigation;













import { useState, useMemo } from 'react';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import Logo from './navigation/Logo';
import DesktopNavigation from './navigation/DesktopNavigation';
import MobileMenu from './navigation/MobileMenu';
import { useScrollEffect } from './navigation/useScrollEffect';

const Navigation = () => {
  const { signOut, user, authReady } = useAuth();
  const { isScrolled, isPastHero } = useScrollEffect();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { name: 'The Experience', href: '/experience' },
    { name: 'Process', href: '/process' },
    { name: 'Pricing', href: '/pricing' },
    { name: 'Blog', href: '/blog' },
    { name: 'FAQ', href: '/faq' },
  ];

  const iconColor = useMemo(() => isScrolled ? '#0A1A2F' : '#FFFFFF', [isScrolled]);

  const navClasses = useMemo(() => `fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out ${
    isScrolled ? 'glass shadow-lg py-2' : 'py-4'
  }`, [isScrolled]);

  const toggleMenu = () => {
    setIsMenuOpen(prev => !prev);
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      setIsMenuOpen(false);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  // Animation variants
  const navVariants = {
    hidden: { y: -100, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 20,
        delay: 0.2
      }
    }
  };

  const logoVariants = {
    hidden: { x: -50, opacity: 0 },
    visible: { 
      x: 0, 
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 20,
        delay: 0.4
      }
    }
  };

  const navItemsVariants = {
    hidden: { y: -20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 20,
        delay: 0.6
      }
    }
  };

  // Only render once auth state is determined to prevent flash of incorrect UI
  if (!authReady) {
    return (
      <motion.nav 
        className={navClasses}
        initial="hidden"
        animate="visible"
        variants={navVariants}
      >
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between">
            <motion.div variants={logoVariants}>
              <Logo isPastHero={isPastHero} />
            </motion.div>
            <div className="w-10 h-10"></div> {/* Empty placeholder for loading state */}
          </div>
        </div>
      </motion.nav>
    );
  }

  return (
    <motion.nav 
      className={navClasses}
      initial="hidden"
      animate="visible"
      variants={navVariants}
    >
      <div className="px-4 sm:px-6">
        <div className="flex items-center justify-between">
          <motion.div variants={logoVariants}>
            <Logo isPastHero={isPastHero} />
          </motion.div>
          
          <motion.div variants={navItemsVariants}>
            <DesktopNavigation 
              isScrolled={isScrolled} 
              navLinks={navLinks} 
              user={user}
              onSignOut={handleSignOut}
            />
          </motion.div>

          <motion.button
            variants={navItemsVariants}
            className={`lg:hidden ${isScrolled ? 'text-navy' : 'text-white'}`}
            onClick={toggleMenu}
            aria-label="Toggle menu"
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? <X size={24} color={iconColor} /> : <Menu size={24} color={iconColor} />}
          </motion.button>
        </div>

        <AnimatePresence>
          {isMenuOpen && (
            <MobileMenu 
              isOpen={isMenuOpen}
              isScrolled={isScrolled}
              toggleMenu={toggleMenu}
              navLinks={navLinks}
              user={user}
              onSignOut={handleSignOut}
            />
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
};

export default Navigation;
