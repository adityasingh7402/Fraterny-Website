// import React, { useState } from 'react';
// import { motion } from 'framer-motion';
// import { 
//   Menu, 
//   X, 
//   Camera, 
//   Calendar, 
//   MapPin, 
//   Mail, 
//   Bell,
//   Settings,
//   ChevronDown,
//   Award,
//   TrendingUp
// } from 'lucide-react';
// import { useSectionRevealAnimation } from '../home/useSectionRevealAnimation';
// import { profileMotionVariants, getMotionVariants } from '../../lib/motion/variants';
// import { getSectionDisplayName, type ProfileSection } from './ProfileLayout';

// interface ProfileHeaderProps {
//   currentSection: ProfileSection;
//   onMobileMenuToggle: () => void;
//   isMobileMenuOpen: boolean;
//   className?: string;
// }

// // Mock user data - replace with actual user context/API
// const mockUser = {
//   name: 'Indranil Maiti',
//   email: 'indranilmaiti1@gmail.com',
//   avatar: null, // Will show initials when null
//   joinDate: '2024-01-15',
//   location: 'Tamluk, West Bengal, India',
//   questsCompleted: 12,
//   currentStreak: 7,
//   engagementScore: 85,
//   subscription: 'Premium'
// };

// export default function ProfileHeader({ 
//   currentSection, 
//   onMobileMenuToggle, 
//   isMobileMenuOpen,
//   className = '' 
// }: ProfileHeaderProps) {
//   const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
//   const [showNotifications, setShowNotifications] = useState(false);

//   // Animation setup
//   const {
//     parentVariants,
//     childVariants,
//     isMobile
//   } = useSectionRevealAnimation({
//     variant: 'fade-down',
//     once: true,
//     amount: 0.1,
//     staggerChildren: 0.1
//   });

//   const motionVariants = getMotionVariants(isMobile);

//   // Get user initials for avatar fallback
//   const getUserInitials = (name: string) => {
//     return name
//       .split(' ')
//       .map(word => word.charAt(0))
//       .join('')
//       .toUpperCase()
//       .slice(0, 2);
//   };

//   // Handle avatar upload
//   const handleAvatarUpload = () => {
//     setIsUploadingAvatar(true);
//     // TODO: Implement actual file upload
//     setTimeout(() => {
//       setIsUploadingAvatar(false);
//     }, 2000);
//   };

//   // Format join date
//   const formatJoinDate = (dateString: string) => {
//     const date = new Date(dateString);
//     return date.toLocaleDateString('en-US', { 
//       year: 'numeric', 
//       month: 'long' 
//     });
//   };

//   return (
//     <motion.div
//       variants={parentVariants}
//       initial="hidden"
//       animate="visible"
//       className={`relative ${className}`}
//     >
//       <div className="flex items-center justify-between py-4 lg:py-6">
        
//         {/* Left Section - User Info */}
//         <motion.div 
//           variants={childVariants}
//           className="flex items-center space-x-3 lg:space-x-4"
//         >
//           {/* Mobile Menu Button */}
//           <motion.button
//             variants={motionVariants.tabItem}
//             whileHover="hover"
//             whileTap="tap"
//             onClick={onMobileMenuToggle}
//             className="lg:hidden p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
//             aria-label="Toggle navigation menu"
//           >
//             {isMobileMenuOpen ? (
//               <X className="w-5 h-5" />
//             ) : (
//               <Menu className="w-5 h-5" />
//             )}
//           </motion.button>

//           {/* Profile Avatar */}
//           <motion.div 
//             variants={childVariants}
//             className="relative group"
//           >
//             <div className="relative">
//               {mockUser.avatar ? (
//                 <img
//                   src={mockUser.avatar}
//                   alt={`${mockUser.name}'s avatar`}
//                   className="w-12 h-12 lg:w-16 lg:h-16 rounded-2xl object-cover border-2 border-white dark:border-slate-700 shadow-sm"
//                 />
//               ) : (
//                 <div className="w-12 h-12 lg:w-16 lg:h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm lg:text-lg border-2 border-white dark:border-slate-700 shadow-sm">
//                   {getUserInitials(mockUser.name)}
//                 </div>
//               )}
              
//               {/* Upload Overlay */}
//               <motion.button
//                 variants={motionVariants.floatingElement}
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//                 onClick={handleAvatarUpload}
//                 disabled={isUploadingAvatar}
//                 className="absolute inset-0 bg-black/40 backdrop-blur-sm rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
//                 aria-label="Upload profile picture"
//               >
//                 <Camera className="w-4 h-4 lg:w-5 lg:h-5 text-white" />
//               </motion.button>
              
//               {/* Loading indicator */}
//               {isUploadingAvatar && (
//                 <motion.div
//                   variants={motionVariants.loadingPulse}
//                   animate="pulse"
//                   className="absolute inset-0 bg-blue-500/20 rounded-2xl flex items-center justify-center"
//                 >
//                   <div className="w-3 h-3 bg-blue-500 rounded-full" />
//                 </motion.div>
//               )}
//             </div>
//           </motion.div>

//           {/* User Details */}
//           <motion.div 
//             variants={childVariants}
//             className="min-w-0 flex-1"
//           >
//             <div className="flex items-center space-x-2">
//               <h1 className="text-lg lg:text-xl font-semibold text-slate-900 dark:text-white truncate">
//                 {mockUser.name}
//               </h1>
//               {mockUser.subscription === 'Premium' && (
//                 <motion.div
//                   variants={motionVariants.statusIndicator}
//                   initial="hidden"
//                   animate="success"
//                   className="flex items-center"
//                 >
//                   <Award className="w-4 h-4 text-yellow-500" />
//                 </motion.div>
//               )}
//             </div>
            
//             <div className="flex items-center space-x-4 mt-1">
//               <div className="flex items-center space-x-1 text-sm text-slate-500 dark:text-slate-400">
//                 <Calendar className="w-3 h-3" />
//                 <span className="hidden sm:inline">Joined</span>
//                 <span>{formatJoinDate(mockUser.joinDate)}</span>
//               </div>
              
//               {/* Location - Hidden on small mobile */}
//               <div className="hidden md:flex items-center space-x-1 text-sm text-slate-500 dark:text-slate-400">
//                 <MapPin className="w-3 h-3" />
//                 <span>{mockUser.location}</span>
//               </div>
//             </div>
//           </motion.div>
//         </motion.div>

//         {/* Right Section - Quick Stats & Actions */}
//         <motion.div 
//           variants={childVariants}
//           className="flex items-center space-x-2 lg:space-x-4"
//         >
//           {/* Quick Stats - Hidden on mobile */}
//           <div className="hidden lg:flex items-center space-x-6">
//             <motion.div 
//               variants={motionVariants.statsCounter}
//               className="text-center"
//             >
//               <div className="text-xl font-bold text-slate-900 dark:text-white">
//                 {mockUser.questsCompleted}
//               </div>
//               <div className="text-xs text-slate-500 dark:text-slate-400">
//                 Quests
//               </div>
//             </motion.div>
            
//             <motion.div 
//               variants={motionVariants.statsCounter}
//               className="text-center"
//             >
//               <div className="text-xl font-bold text-slate-900 dark:text-white">
//                 {mockUser.currentStreak}
//               </div>
//               <div className="text-xs text-slate-500 dark:text-slate-400">
//                 Day Streak
//               </div>
//             </motion.div>
            
//             <motion.div 
//               variants={motionVariants.statsCounter}
//               className="text-center"
//             >
//               <div className="flex items-center space-x-1">
//                 <span className="text-xl font-bold text-slate-900 dark:text-white">
//                   {mockUser.engagementScore}%
//                 </span>
//                 <TrendingUp className="w-4 h-4 text-green-500" />
//               </div>
//               <div className="text-xs text-slate-500 dark:text-slate-400">
//                 Engagement
//               </div>
//             </motion.div>
//           </div>

//           {/* Action Buttons */}
//           <div className="flex items-center space-x-2">
//             {/* Notifications */}
//             <motion.button
//               variants={motionVariants.tabItem}
//               whileHover="hover"
//               whileTap="tap"
//               onClick={() => setShowNotifications(!showNotifications)}
//               className="relative p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
//               aria-label="Notifications"
//             >
//               <Bell className="w-5 h-5" />
//               {/* Notification badge */}
//               <motion.div
//                 variants={motionVariants.statusIndicator}
//                 initial="hidden"
//                 animate="success"
//                 className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white dark:border-slate-800"
//               />
//             </motion.button>

//             {/* Quick Settings - Desktop only */}
//             <motion.button
//               variants={motionVariants.tabItem}
//               whileHover="hover"
//               whileTap="tap"
//               className="hidden lg:flex p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
//               aria-label="Quick settings"
//             >
//               <Settings className="w-5 h-5" />
//             </motion.button>
//           </div>
//         </motion.div>
//       </div>

//       {/* Section Context Bar */}
//       <motion.div
//         variants={childVariants}
//         className="border-t border-slate-200/50 dark:border-slate-700/50 pt-4 pb-2"
//       >
//         <div className="flex items-center justify-between">
//           <div className="flex items-center space-x-2">
//             <h2 className="text-sm font-medium text-slate-600 dark:text-slate-300">
//               {getSectionDisplayName(currentSection)}
//             </h2>
//             {currentSection !== 'overview' && (
//               <ChevronDown className="w-4 h-4 text-slate-400 rotate-180" />
//             )}
//           </div>
          
//           {/* Mobile Stats */}
//           <div className="lg:hidden flex items-center space-x-4 text-xs">
//             <div className="flex items-center space-x-1">
//               <span className="font-medium text-slate-900 dark:text-white">
//                 {mockUser.questsCompleted}
//               </span>
//               <span className="text-slate-500">quests</span>
//             </div>
//             <div className="flex items-center space-x-1">
//               <span className="font-medium text-slate-900 dark:text-white">
//                 {mockUser.currentStreak}
//               </span>
//               <span className="text-slate-500">streak</span>
//             </div>
//           </div>
//         </div>
//       </motion.div>

//       {/* Notifications Dropdown - Simple implementation */}
//       {showNotifications && (
//         <motion.div
//           variants={motionVariants.modalContent}
//           initial="hidden"
//           animate="visible"
//           exit="exit"
//           className="absolute top-full right-0 mt-2 w-80 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xl z-50"
//         >
//           <div className="p-4">
//             <h3 className="font-semibold text-slate-900 dark:text-white mb-3">
//               Notifications
//             </h3>
//             <div className="space-y-2">
//               <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
//                 <p className="text-sm text-slate-700 dark:text-slate-300">
//                   Welcome to your profile! Complete your first quest to unlock insights.
//                 </p>
//               </div>
//             </div>
//           </div>
//         </motion.div>
//       )}
//     </motion.div>
//   );
// }



import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';

/**
 * Profile header component showing user info and quick stats
 * Redesigned with brand identity
 */
const ProfileHeader = () => {
  const { user } = useAuth();
  
  // Extract user metadata
  const userMetadata = user?.user_metadata || {};
  const firstName = userMetadata.first_name || '';
  const lastName = userMetadata.last_name || '';
  const displayName = firstName && lastName 
    ? `${firstName} ${lastName}` 
    : user?.email?.split('@')[0] || 'User';
    
  // Format join date
  const joinDate = user?.created_at 
    ? new Date(user.created_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : 'Recent member';

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  };

  const avatarVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: { 
      scale: 1, 
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 20,
        delay: 0.2
      }
    },
    hover: {
      scale: 1.05,
      boxShadow: "0 0 20px rgba(255,255,255,0.3)",
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10
      }
    }
  };
    
  return (
    // In ProfileHeader.tsx, modify the main container div:
      <motion.div 
        className="bg-gradient-to-r from-navy to-navy/90 text-white p-6 md:p-8 shadow-md w-full"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="pt-20 pb-6 px-6 md:px-8">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6 max-w-7xl mx-auto sm:px-12">
            {/* Profile image */}
            <motion.div 
              className="w-24 h-24 rounded-full bg-gray-200 border-4 border-white flex items-center justify-center text-navy text-2xl font-bold shadow-lg"
              variants={avatarVariants}
              whileHover="hover"
            >
              {displayName.charAt(0).toUpperCase()}
            </motion.div>
            
            {/* User info */}
            <div className="flex-1">
              <motion.h1 
                className="text-2xl md:text-3xl font-playfair font-bold"
                variants={itemVariants}
              >
                Your Profile
              </motion.h1>
              
              {/* <motion.p 
                className="text-white/80 font-medium"
                variants={itemVariants}
              >
                {user?.email}
              </motion.p> */}
              
              <motion.div 
                className="flex items-center mt-2 text-white/60 text-sm"
                variants={itemVariants}
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-4 w-4 mr-1" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                >
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="16" y1="2" x2="16" y2="6"></line>
                  <line x1="8" y1="2" x2="8" y2="6"></line>
                  <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
                Member since {joinDate}
              </motion.div>
              
              <motion.div 
                className="mt-4 md:mt-2"
                variants={itemVariants}
              >
                <span className="bg-terracotta/20 text-white px-3 py-1 rounded-full text-xs font-medium">
                  {userMetadata.email_verified ? 'Verified Account' : 'Account Pending Verification'}
                </span>
              </motion.div>
            </div>
            
          </div>
        </div>
      
      {/* Quick stats section */}
    </motion.div>
  );
};

export default ProfileHeader;