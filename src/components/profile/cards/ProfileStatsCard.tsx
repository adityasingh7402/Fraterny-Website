// import React from 'react';
// import { motion } from 'framer-motion';
// import { 
//   User,
//   Mail,
//   Phone,
//   Calendar,
//   Shield,
//   CheckCircle,
//   Clock,
//   XCircle
// } from 'lucide-react';
// import { useAuth } from '@/contexts/AuthContext';

// interface ProfileStatsCardProps {
//   variant?: 'compact' | 'detailed';
//   className?: string;
// }

// export default function ProfileStatsCard({ 
//   variant = 'detailed', 
//   className = '' 
// }: ProfileStatsCardProps) {
//   // Get user data from AuthContext
//   const { user, isLoading } = useAuth();

//   // Animation variants - identical to AccountSettings
//   const containerVariants = {
//     hidden: { opacity: 0, y: 5 },
//     visible: { 
//       opacity: 1, 
//       y: 0, 
//       transition: { 
//         duration: 0.5,
//         staggerChildren: 0.1
//       } 
//     }
//   };

//   const itemVariants = {
//     hidden: { opacity: 0, y: 10 },
//     visible: { 
//       opacity: 1, 
//       y: 0, 
//       transition: { 
//         duration: 0.5
//       } 
//     }
//   };

//   // Loading state with branded styling
//   if (isLoading) {
//     return (
//       <motion.div 
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         className="bg-white dark:bg-slate-900 rounded-lg p-6 border border-slate-200/50 dark:border-slate-700/50 shadow-sm animate-pulse"
//       >
//         <div className="h-7 bg-slate-200 dark:bg-slate-700 rounded w-1/3 mb-4"></div>
//         <div className="h-5 bg-slate-200 dark:bg-slate-700 rounded w-1/2 mb-8"></div>
//         <div className="space-y-6">
//           {[1, 2, 3, 4, 5].map(i => (
//             <div key={i} className="flex items-center space-x-3">
//               <div className="h-12 w-12 rounded-full bg-navy/10 dark:bg-navy/30"></div>
//               <div className="flex-1">
//                 <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/4 mb-2"></div>
//                 <div className="h-5 bg-slate-200 dark:bg-slate-700 rounded w-3/4"></div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </motion.div>
//     );
//   }

//   // Error state with branded styling
//   if (!user) {
//     return (
//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.5 }}
//         className="bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200 rounded-lg p-6 border border-red-200 dark:border-red-800/50"
//       >
//         <h3 className="font-semibold mb-2 text-lg">Unable to load profile data</h3>
//         <p className="text-sm">Please try refreshing the page or contact support if the problem persists.</p>
//       </motion.div>
//     );
//   }
  
//   // Extract user metadata
//   const userMetadata = user.user_metadata || {};
  
//   // Format date for display
//   const formatDate = (dateString: string) => {
//     if (!dateString) return 'N/A';
//     return new Date(dateString).toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'long',
//       day: 'numeric',
//     });
//   };

//   // Data items to display
//   const userDataItems = [
//     {
//       id: 'name',
//       label: 'Full Name',
//       value: `${userMetadata.first_name || ''} ${userMetadata.last_name || ''}`.trim() || 'Not provided',
//       icon: User,
//       color: 'text-navy',
//       bgColor: 'bg-navy/10 group-hover:bg-navy/20',
//       iconColor: '#0A1A2F',
//       gradient: 'from-navy to-navy/80'
//     },
//     {
//       id: 'email',
//       label: 'Email Address',
//       value: user.email || 'Not provided',
//       verified: userMetadata.email_verified || false,
//       icon: Mail,
//       color: 'text-terracotta',
//       bgColor: 'bg-terracotta/10 group-hover:bg-terracotta/20',
//       iconColor: '#E07A5F',
//       gradient: 'from-terracotta to-terracotta/80'
//     },
//     {
//       id: 'phone',
//       label: 'Phone Number',
//       value: userMetadata.phone || 'Not provided',
//       verified: userMetadata.phone_verified || false,
//       icon: Phone,
//       color: 'text-gold',
//       bgColor: 'bg-gold/10 group-hover:bg-gold/20',
//       iconColor: '#D4AF37',
//       gradient: 'from-gold to-gold/80'
//     },
//     {
//       id: 'member_since',
//       label: 'Member Since',
//       value: formatDate(user.created_at),
//       icon: Calendar,
//       color: 'text-navy',
//       bgColor: 'bg-navy/10 group-hover:bg-navy/20',
//       iconColor: '#0A1A2F',
//       gradient: 'from-navy to-navy/80'
//     },
//     {
//       id: 'last_sign_in',
//       label: 'Last Sign In',
//       value: formatDate(user.last_sign_in_at || user.created_at),
//       icon: Clock,
//       color: 'text-terracotta',
//       bgColor: 'bg-terracotta/10 group-hover:bg-terracotta/20',
//       iconColor: '#E07A5F',
//       gradient: 'from-terracotta to-terracotta/80'
//     }
//   ];

//   const renderCompactCard = () => {
//     return (
//       <motion.div
//         variants={containerVariants}
//         initial="hidden"
//         animate="visible"
//         className="bg-white dark:bg-slate-900 rounded-lg p-6 border border-slate-200/50 dark:border-slate-700/50 shadow-sm transition-all duration-300 hover:shadow-md"
//       >
//         <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
//           <div>
//             <motion.h2 
//               variants={itemVariants}
//               className="text-xl md:text-2xl font-playfair font-semibold text-navy mb-2"
//             >
//               Profile Overview
//             </motion.h2>
//             <motion.p 
//               variants={itemVariants}
//               className="text-sm text-gray-600 dark:text-slate-400"
//             >
//               Your account information
//             </motion.p>
//           </div>
          
//           <div className="flex items-center gap-2">
//             <motion.div
//               variants={itemVariants}
//               className="p-2 bg-navy/10 dark:bg-navy/30 rounded-full"
//             >
//               <Shield className="w-5 h-5 text-navy" />
//             </motion.div>
            
//             {userMetadata.email_verified && (
//               <motion.div
//                 variants={itemVariants}
//                 className="flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300"
//               >
//                 <CheckCircle className="w-3 h-3" />
//                 <span>Verified</span>
//               </motion.div>
//             )}
//           </div>
//         </div>
        
//         <div className="space-y-4">
//           {userDataItems.map((item, index) => (
//             <motion.div 
//               key={item.id}
//               variants={itemVariants}
//               className="group flex items-start space-x-3"
//             >
//               <div className={`p-2.5 rounded-full ${item.bgColor} transition-all duration-300 flex-shrink-0`}>
//                 <item.icon className={`w-5 h-5 ${item.color}`} />
//               </div>
//               <div>
//                 <div className="text-sm text-gray-600 dark:text-slate-400 mb-1">
//                   {item.label}
//                 </div>
//                 <div className="font-medium text-navy dark:text-white">
//                   {item.value}
//                 </div>
//                 {'verified' in item && (
//                   <div className="flex items-center mt-1">
//                     {item.verified ? (
//                       <span className="flex items-center text-xs text-green-600 dark:text-green-400">
//                         <CheckCircle className="w-3 h-3 mr-1" /> Verified
//                       </span>
//                     ) : (
//                       <span className="flex items-center text-xs text-amber-600 dark:text-amber-400">
//                         <XCircle className="w-3 h-3 mr-1" /> Not verified
//                       </span>
//                     )}
//                   </div>
//                 )}
//               </div>
//             </motion.div>
//           ))}
//         </div>
//       </motion.div>
//     );
//   };

//   const renderDetailedCard = () => {
//     return (
//       <motion.div
//         variants={containerVariants}
//         initial="hidden"
//         animate="visible"
//         className="bg-white dark:bg-slate-900 rounded-lg p-6 md:p-8 border border-slate-200/50 dark:border-slate-700/50 shadow-sm transition-all duration-300 hover:shadow-md"
//       >
//         <motion.div 
//           variants={itemVariants}
//           className="flex items-center justify-between mb-8"
//         >
//           <div>
//             <h2 className="text-2xl md:text-3xl font-playfair font-semibold text-navy mb-2">
//               Account Information
//             </h2>
//             <p className="text-sm md:text-base text-gray-600 dark:text-slate-400">
//               Your personal details and verification status
//             </p>
//           </div>
          
//           <div className="p-2.5 md:p-3 bg-gradient-to-r from-navy to-navy/80 rounded-full shadow-sm">
//             <Shield className="w-5 h-5 md:w-6 md:h-6 text-white" />
//           </div>
//         </motion.div>
        
//         <div className="flex flex-col gap-6">
//           {userDataItems.map((item, index) => (
//             <motion.div 
//               key={item.id}
//               variants={itemVariants}
//               className="group flex items-start space-x-4 p-4 md:p-5 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50 hover:border-slate-200 dark:hover:border-slate-600 transition-colors hover:shadow-sm"
//             >
//               <div className={`p-3 md:p-3.5 rounded-full bg-gradient-to-r ${item.gradient} shadow-sm flex-shrink-0`}>
//                 <item.icon className="w-5 h-5 md:w-6 md:h-6 text-white" />
//               </div>
//               <div className="flex-1">
//                 <div className="text-sm text-gray-600 dark:text-slate-400 mb-1">
//                   {item.label}
//                 </div>
//                 <div className="font-medium text-navy dark:text-white text-lg md:text-xl">
//                   {item.value}
//                 </div>
                
//                 {'verified' in item && (
//                   <div className="mt-2">
//                     {item.verified ? (
//                       <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300">
//                         <CheckCircle className="w-3 h-3 mr-1" /> Verified
//                       </span>
//                     ) : (
//                       <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300">
//                         <XCircle className="w-3 h-3 mr-1" /> Not verified
//                       </span>
//                     )}
//                   </div>
//                 )}
//               </div>
//             </motion.div>
//           ))}
//         </div>
        
//         {/* Account status summary */}
//         <motion.div
//           variants={itemVariants}
//           className="mt-8 p-4 md:p-5 bg-gradient-to-r from-navy/5 to-terracotta/5 dark:from-navy/20 dark:to-terracotta/10 rounded-lg border border-navy/10 dark:border-navy/30"
//         >
//           <div className="flex items-center space-x-2 mb-2">
//             <Shield className="w-4 h-4 text-navy" />
//             <span className="font-medium text-navy dark:text-white">
//               Account Status
//             </span>
//           </div>
//           <p className="text-sm md:text-base text-gray-600 dark:text-slate-300">
//             Your account is active and {userMetadata.email_verified ? 'verified' : 'awaiting verification'}. 
//             You've been a member since {formatDate(user.created_at)}.
//             {!userMetadata.email_verified && ' Please verify your email to unlock all features.'}
//           </p>
//         </motion.div>
//       </motion.div>
//     );
//   };

//   return (
//     <div className={`relative ${className}`}>
//       {variant === 'compact' ? renderCompactCard() : renderDetailedCard()}
//     </div>
//   );
// }



import React from 'react';
import { motion } from 'framer-motion';
import { 
  User, Mail, Phone, Calendar, Shield, CheckCircle, Clock, 
  XCircle, MapPin, Briefcase, Building, Bell, Edit, AlertTriangle
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface ProfileStatsCardProps {
  variant?: 'compact' | 'detailed';
  className?: string;
  onEditClick?: () => void; // Optional callback for edit button
}

export default function ProfileStatsCard({ 
  variant = 'detailed', 
  className = '',
  onEditClick
}: ProfileStatsCardProps) {
  // Get user data from AuthContext
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();

  // Animation variants - identical to AccountSettings
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        duration: 0.5,
        staggerChildren: 0.1
      } 
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        duration: 0.5
      } 
    }
  };

  // Loading state with branded styling
  if (isLoading) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white dark:bg-slate-900 rounded-lg p-6 border border-slate-200/50 dark:border-slate-700/50 shadow-sm animate-pulse"
      >
        <div className="h-7 bg-slate-200 dark:bg-slate-700 rounded w-1/3 mb-4"></div>
        <div className="h-5 bg-slate-200 dark:bg-slate-700 rounded w-1/2 mb-8"></div>
        <div className="space-y-6">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="flex items-center space-x-3">
              <div className="h-12 w-12 rounded-full bg-navy/10 dark:bg-navy/30"></div>
              <div className="flex-1">
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/4 mb-2"></div>
                <div className="h-5 bg-slate-200 dark:bg-slate-700 rounded w-3/4"></div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    );
  }

  // Error state with branded styling
  if (!user) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200 rounded-lg p-6 border border-red-200 dark:border-red-800/50"
      >
        <h3 className="font-semibold mb-2 text-lg">Unable to load profile data</h3>
        <p className="text-sm">Please try refreshing the page or contact support if the problem persists.</p>
      </motion.div>
    );
  }
  
  // Extract user metadata
  const userMetadata = user.user_metadata || {};
  
  // Format date for display
  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Data subsections for organization
  const profileSections = [
    {
      id: 'personal',
      title: 'Personal Information',
      items: [
        {
          id: 'name',
          label: 'Full Name',
          value: `${userMetadata.first_name || ''} ${userMetadata.last_name || ''}`.trim() || 'Not provided',
          icon: User,
          color: 'text-navy',
          bgColor: 'bg-navy/10',
          iconColor: '#0A1A2F',
          gradient: 'from-navy to-navy/80'
        },
        {
          id: 'email',
          label: 'Email Address',
          value: user.email || 'Not provided',
          verified: userMetadata.email_verified || false,
          icon: Mail,
          color: 'text-terracotta',
          bgColor: 'bg-terracotta/10',
          iconColor: '#E07A5F',
          gradient: 'from-terracotta to-terracotta/80'
        },
        {
          id: 'phone',
          label: 'Phone Number',
          value: userMetadata.phone || 'Not provided',
          verified: userMetadata.phone_verified || false,
          icon: Phone,
          color: 'text-gold',
          bgColor: 'bg-gold/10',
          iconColor: '#D4AF37',
          gradient: 'from-gold to-gold/80'
        }
      ]
    },
    {
      id: 'professional',
      title: 'Professional Information',
      items: [
        {
          id: 'location',
          label: 'Location',
          value: userMetadata.location || 'Not provided',
          icon: MapPin,
          color: 'text-emerald-600',
          bgColor: 'bg-emerald-50',
          iconColor: '#059669',
          gradient: 'from-emerald-500 to-emerald-600'
        },
        {
          id: 'job_title',
          label: 'Job Title',
          value: userMetadata.job_title || 'Not provided',
          icon: Briefcase,
          color: 'text-purple-600',
          bgColor: 'bg-purple-50',
          iconColor: '#7C3AED',
          gradient: 'from-purple-500 to-purple-600'
        },
        {
          id: 'company',
          label: 'Company',
          value: userMetadata.company || 'Not provided',
          icon: Building,
          color: 'text-blue-600',
          bgColor: 'bg-blue-50',
          iconColor: '#2563EB',
          gradient: 'from-blue-500 to-blue-600'
        }
      ]
    },
    {
      id: 'account',
      title: 'Account Information',
      items: [
        {
          id: 'member_since',
          label: 'Member Since',
          value: formatDate(user.created_at),
          icon: Calendar,
          color: 'text-navy',
          bgColor: 'bg-navy/10',
          iconColor: '#0A1A2F',
          gradient: 'from-navy to-navy/80'
        },
        {
          id: 'last_sign_in',
          label: 'Last Sign In',
          value: formatDate(user.last_sign_in_at || user.created_at),
          icon: Clock,
          color: 'text-terracotta',
          bgColor: 'bg-terracotta/10',
          iconColor: '#E07A5F',
          gradient: 'from-terracotta to-terracotta/80'
        },
        {
          id: 'notification_preference',
          label: 'Notification Preference',
          value: userMetadata.notification_preference === 'all' 
            ? 'All Notifications' 
            : userMetadata.notification_preference === 'important' 
              ? 'Important Only' 
              : userMetadata.notification_preference === 'none'
                ? 'No Notifications'
                : 'All Notifications', // Default
          icon: Bell,
          color: 'text-amber-600',
          bgColor: 'bg-amber-50',
          iconColor: '#D97706',
          gradient: 'from-amber-500 to-amber-600'
        }
      ]
    }
  ];

  // Bio section (optional)
  const userBio = userMetadata.bio || '';

  // Handle edit button click
  // const handleEditClick = () => {
  //   if (onEditClick) {
  //     onEditClick();
  //   } else {
  //     // If no callback provided, try to navigate to a section
  //     document.getElementById('profile-edit-section')?.scrollIntoView({ behavior: 'smooth' });
  //   }
  // };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={`bg-white dark:bg-slate-900 rounded-xl border border-slate-200/50 dark:border-slate-700/50 shadow-sm overflow-hidden ${className}`}
    >
      {/* Header Section */}
      <div className="bg-gradient-to-r from-navy to-navy/80 p-6 md:p-8 text-white">
        <div className="flex justify-between items-start">
          <motion.div variants={itemVariants} className="flex-1">
            <h2 className="text-2xl md:text-3xl font-playfair font-semibold mb-2">
              Account Information
            </h2>
            <p className="text-sm md:text-base text-white/80">
              Your personal details and account status
            </p>
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <Button 
              size="sm"
              className="bg-white/10 text-white hover:bg-white/20 transition-colors"
              onClick = {() => {navigate('/profile?tab=security')}}
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
          </motion.div>
        </div>
        
        {/* Verification Status */}
        <motion.div 
          variants={itemVariants}
          className="mt-4 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-white/10"
        >
          <Shield className="h-4 w-4 mr-2" />
          <span>
            Account Status: {userMetadata.email_verified ? 'Verified' : 'Awaiting Verification'}
          </span>
          {userMetadata.email_verified ? (
            <CheckCircle className="h-4 w-4 ml-2 text-green-300" />
          ) : (
            <XCircle className="h-4 w-4 ml-2 text-amber-300" />
          )}
        </motion.div>
      </div>
      
      {/* Main Content */}
      <div className="px-6 md:px-8 pt-6 pb-8">
        {/* Bio Section (if available) */}
        {userBio && (
          <motion.div 
            variants={itemVariants}
            className="mb-8 pb-6 border-b border-slate-200 dark:border-slate-700"
          >
            <h3 className="text-lg font-medium text-navy mb-3">About</h3>
            <p className="text-gray-700 dark:text-gray-300">{userBio}</p>
          </motion.div>
        )}
        
        {/* Data Sections */}
        <div className="space-y-8">
          {profileSections.map((section) => (
            <motion.div 
              key={section.id}
              variants={itemVariants}
              className="space-y-4"
            >
              <h3 className="font-medium text-lg text-navy border-b border-slate-200 dark:border-slate-700 pb-2">
                {section.title}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-6">
                {section.items.map((item) => (
                  <div 
                    key={item.id}
                    className="flex space-x-4"
                  >
                    <div className={`p-3 h-10 w-10 rounded-full flex-shrink-0 ${item.bgColor}`}>
                      <item.icon className={`h-4 w-4 ${item.color}`} />
                    </div>
                    
                    <div>
                      <div className="text-sm text-gray-500 dark:text-slate-400">
                        {item.label}
                      </div>
                      <div className="font-medium text-navy dark:text-white">
                        {item.value}
                      </div>
                      
                      {'verified' in item && (
                        <div className="mt-1">
                          {item.verified ? (
                            <span className="flex items-center text-xs text-green-600 dark:text-green-400">
                              <CheckCircle className="w-3 h-3 mr-1" /> Verified
                            </span>
                          ) : (
                            <span className="flex items-center text-xs text-amber-600 dark:text-amber-400">
                              <XCircle className="w-3 h-3 mr-1" /> Not verified
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
        
        {/* Missing Info Prompt (if needed) */}
        {(!userMetadata.first_name || !userMetadata.phone || !userMetadata.location || !userMetadata.job_title || !userMetadata.company) && (
          <motion.div 
            variants={itemVariants}
            className="mt-8 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800/50"
          >
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <AlertTriangle className="h-5 w-5 text-amber-500" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-amber-800 dark:text-amber-300">
                  Your profile is incomplete
                </h3>
                <div className="mt-2 text-sm text-amber-700 dark:text-amber-400">
                  <p>
                    Complete your profile to get the most out of your experience.
                  </p>
                </div>
              </div>
              <div className="ml-auto pl-3">
                <Button
                  onClick={() => navigate('/profile?tab=security')}
                  size="sm"
                  className="bg-amber-100 hover:bg-amber-200 text-amber-800"
                >
                  Complete Profile
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}