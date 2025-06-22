import { User } from '@supabase/supabase-js';
import MobileNavigationLink from './MobileNavigationLink';
import { useAuth } from '@/contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

interface MobileMenuProps {
  isOpen: boolean;
  isScrolled: boolean;
  toggleMenu: () => void;
  navLinks: { name: string; href: string }[];
  user: User | null;
  onSignOut: () => Promise<void>;
}

const containerVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 80,
      damping: 18,
      staggerChildren: 0.07,
      delayChildren: 0.08,
    },
  },
  exit: { opacity: 0, y: 10, transition: { duration: 0.18 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.22, ease: 'easeOut' } },
};

const MobileMenu = ({ isOpen, isScrolled, toggleMenu, navLinks, user, onSignOut }: MobileMenuProps) => {
  const { isAdmin } = useAuth();
  
  const adminLinks = [
    { name: 'Dashboard', href: '/admin' },
    { name: 'Analytics', href: '/admin/analytics' },
    { name: 'Blog Management', href: '/admin/blog' },
    { name: 'Image Management', href: '/admin/images' },
    { name: 'Newsletter', href: '/admin/newsletter' },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="lg:hidden fixed inset-x-0 top-0 z-40 flex justify-center items-start min-h-screen">
          {/* Glass background always visible, not animated */}
          <div 
            className={`max-w-xs w-[88vw] mx-auto mt-8 rounded-3xl p-6 shadow-2xl backdrop-blur-lg flex flex-col gap-0 relative ${
              isScrolled 
                ? 'border border-navy/15 bg-navy/85' 
                : 'border border-white/25 bg-white/8'
            }`}
            style={{
              background: isScrolled 
                ? 'rgba(10, 26, 47, 0.85)'    // ✅ Lighter - was 0.95
                : 'rgba(255,255,255,0.08)',
              boxShadow: isScrolled
                ? '0 8px 40px 0 rgba(10, 26, 47, 0.2)'  // ✅ Lighter shadow - was 0.3
                : '0 8px 40px 0 rgba(0,0,0,0.18)',
              border: isScrolled
                ? '1px solid rgba(10, 26, 47, 0.15)'    // ✅ Lighter border - was 0.2
                : '1px solid rgba(255,255,255,0.25)',
            }}
          >
            {/* Close (X) Button */}
            <button
              onClick={toggleMenu}
              aria-label="Close menu"
              className="absolute top-4 right-4 z-20 w-10 h-10 flex items-center justify-center rounded-full bg-white/70 hover:bg-white/90 text-2xl text-navy shadow focus:outline-none focus:ring-2 focus:ring-terracotta transition-all"
              style={{ backdropFilter: 'blur(4px)' }}
              type="button"
            >
              &#10005;
            </button>
            {/* Animated content */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              role="menu"
              aria-label="Mobile navigation menu"
            >
              {/* Section 1: Main nav links */}
              <div className="flex flex-col gap-1">
                {navLinks.map((link, idx) => (
                  <MobileNavigationLink
                    key={link.name}
                    href={link.href}
                    isScrolled={isScrolled}
                    onClick={toggleMenu}
                    custom={idx}
                    variants={itemVariants}
                  >
                    {link.name}
                  </MobileNavigationLink>
                ))}
              </div>
              {/* Divider */}
              <div className="my-4 border-t border-white/10" />
              {/* Section 2: Auth/Admin */}
              <div className="flex flex-col gap-1">
                {user ? (
                  <>
                    {isAdmin && (
                      <div className="flex flex-col gap-1">
                        {adminLinks.map((link, idx) => (
                          <MobileNavigationLink
                            key={link.name}
                            href={link.href}
                            isScrolled={isScrolled}
                            onClick={toggleMenu}
                            custom={navLinks.length + idx}
                            variants={itemVariants}
                          >
                            {link.name}
                          </MobileNavigationLink>
                        ))}
                      </div>
                    )}
                    <motion.button
                      onClick={() => {
                        onSignOut();
                        toggleMenu();
                      }}
                      className="block w-full text-left text-lg font-medium tracking-wide py-4 min-h-[44px] text-red-400 hover:text-red-300 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 focus:ring-offset-transparent rounded-2xl active:scale-98"
                      variants={itemVariants}
                      whileTap={{ scale: 0.98 }}
                    >
                      Sign Out
                    </motion.button>
                  </>
                ) : (
                  <MobileNavigationLink
                    href="/auth"
                    isScrolled={isScrolled}
                    onClick={toggleMenu}
                    custom={navLinks.length}
                    variants={itemVariants}
                  >
                    Sign In
                  </MobileNavigationLink>
                )}
              </div>
              {/* Divider */}
              <div className="my-4 border-t border-white/10" />
              {/* Section 3: CTA */}
              <div className="flex flex-col gap-1">
                <MobileNavigationLink
                  href="https://docs.google.com/forms/d/1TTHQN3gG2ZtC26xlh0lU8HeiMc3qDJhfoU2tOh9qLQM/edit"
                  isScrolled={isScrolled}
                  onClick={toggleMenu}
                  external={true}
                  isCTA
                  custom={999}
                  variants={itemVariants}
                >
                  Apply Now
                </MobileNavigationLink>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default MobileMenu;
