// // src/components/quest/views/QuestHistory.tsx - FIXED VERSION

// import React, { useState, useEffect } from 'react';
// import { motion } from 'framer-motion';
// import { useNavigate } from 'react-router-dom';
// import { 
//   Calendar, 
//   Clock, 
//   FileText, 
//   ChevronRight, 
//   AlertTriangle, 
//   Loader2, 
//   CheckCircle,
//   Eye,
//   EyeOff
// } from 'lucide-react';
// import { useAuth } from '../../../contexts/AuthContext';
// import { supabase } from '../../../integrations/supabase/client';
// import { Button } from '../../../components/ui/button';

// // ✅ CORRECTED - Match actual table structure
// interface SessionHistoryItem {
//   id: string;
//   user_id: string;
//   session_id: string;
//   created_at: string;
//   is_viewed: boolean;
// }

// export function QuestHistory({ className = '' }: { className?: string }) {
//   const { user } = useAuth();
//   const navigate = useNavigate();
  
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [sessions, setSessions] = useState<SessionHistoryItem[]>([]);
  
//   // Animation variants
//   const containerVariants = {
//     hidden: { opacity: 0, y: 20 },
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
  
//   // ✅ FIXED - Proper error handling and logging
//   useEffect(() => {
//     const fetchSessionHistory = async () => {
//       if (!user) {
//         setError("Please log in to view your assessment history");
//         setIsLoading(false);
//         return;
//       }
      
//       try {
//         setIsLoading(true);
//         console.log('🔍 Fetching session history for user:', user.id);
        
//         // ✅ FIXED - Remove 'as any' and proper column selection
//         const { data, error } = await supabase
//           .from('user_session_history')
//           .select('id, user_id, session_id, created_at, is_viewed')
//           .eq('user_id', user.id)
//           .order('created_at', { ascending: false });
        
//         if (error) {
//           console.error('❌ Supabase error:', error);
          
//           // Provide specific error message based on error type
//           if (error.code === 'PGRST116') {
//             setError('Session history table not found. Please contact support.');
//           } else if (error.message.includes('policy')) {
//             setError('Access denied. Please ensure you are properly authenticated.');
//           } else {
//             setError(`Failed to load assessment history: ${error.message}`);
//           }
//         } else {
//           console.log('✅ Session history data:', data);
//           setSessions(data || []);
          
//           // Mark sessions as viewed when user views the history page
//           if (data && data.length > 0) {
//             const unviewedSessions = data.filter(session => !session.is_viewed);
//             if (unviewedSessions.length > 0) {
//               // Update is_viewed flag for unviewed sessions
//               const { error: updateError } = await supabase
//                 .from('user_session_history')
//                 .update({ is_viewed: true })
//                 .eq('user_id', user.id)
//                 .eq('is_viewed', false);
                
//               if (updateError) {
//                 console.warn('⚠️ Could not update viewed status:', updateError);
//               } else {
//                 // Update local state to reflect the change
//                 setSessions(prevSessions => 
//                   prevSessions.map(session => ({ ...session, is_viewed: true }))
//                 );
//               }
//             }
//           }
//         }
//       } catch (err) {
//         console.error('💥 Unexpected error:', err);
//         setError('An unexpected error occurred. Please try again later.');
//       } finally {
//         setIsLoading(false);
//       }
//     };
    
//     fetchSessionHistory();
//   }, [user]);
  
//   // Format date for display
//   const formatDate = (dateString: string) => {
//     if (!dateString) return 'N/A';
    
//     return new Date(dateString).toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'long',
//       day: 'numeric',
//     });
//   };
  
//   // Format time for display
//   const formatTime = (dateString: string) => {
//     if (!dateString) return '';
    
//     return new Date(dateString).toLocaleTimeString('en-US', {
//       hour: '2-digit',
//       minute: '2-digit',
//     });
//   };
  
//   // Handle viewing results
//   const handleViewResults = (sessionId: string) => {
//     navigate(`/quest-result/result/${sessionId}`);
//   };
  
//   // Loading state
//   if (isLoading) {
//     return (
//       <div className={`max-w-4xl mx-auto py-8 px-4 ${className}`}>
//         <div className="flex flex-col items-center justify-center py-12">
//           <motion.div
//             animate={{
//               rotate: 360,
//               scale: [1, 1.1, 1],
//             }}
//             transition={{
//               rotate: { duration: 1.5, repeat: Infinity, ease: "linear" },
//               scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
//             }}
//             className="w-16 h-16 border-4 border-navy border-t-transparent rounded-full mb-6"
//           />
//           <p className="text-gray-600">Loading your assessment history...</p>
//         </div>
//       </div>
//     );
//   }
  
//   // Error state
//   if (error) {
//     return (
//       <div className={`max-w-4xl mx-auto py-8 px-4 ${className}`}>
//         <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
//           <motion.div
//             initial={{ scale: 0.9, opacity: 0 }}
//             animate={{ scale: 1, opacity: 1 }}
//             className="bg-red-50 text-red-700 p-4 rounded-lg mb-6 inline-flex items-center"
//           >
//             <AlertTriangle className="h-6 w-6 mr-2" />
//             Error
//           </motion.div>
//           <h2 className="text-xl font-semibold text-navy mb-4">Unable to Load History</h2>
//           <p className="text-gray-600 mb-6 max-w-md">{error}</p>
//           <Button
//             onClick={() => window.location.reload()}
//             className="px-6 py-3 bg-navy text-white rounded-lg hover:bg-navy/90 transition-colors"
//           >
//             Try Again
//           </Button>
//         </div>
//       </div>
//     );
//   }
  
//   // Empty state
//   if (sessions.length === 0) {
//     return (
//       <div className={`max-w-4xl mx-auto py-8 px-4 ${className}`}>
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.5 }}
//           className="text-center"
//         >
//           <div className="bg-slate-50 dark:bg-slate-800/50 p-8 rounded-xl border border-slate-200 dark:border-slate-700">
//             <FileText className="h-16 w-16 mx-auto text-navy opacity-30 mb-4" />
//             <h2 className="text-2xl font-playfair text-navy mb-4">No Assessments Found</h2>
//             <p className="text-gray-600 dark:text-slate-400 mb-8 max-w-md mx-auto">
//               You haven't completed any assessments yet. Take an assessment to start gaining insights into your psychology.
//             </p>
//             <Button
//               onClick={() => navigate('/assessment')}
//               className="bg-terracotta hover:bg-terracotta/90 text-white"
//             >
//               Take Assessment
//             </Button>
//           </div>
//         </motion.div>
//       </div>
//     );
//   }
  
//   // Successful state with history
//   return (
//     <div className={`max-w-4xl mx-auto py-8 px-4 ${className}`}>
//       <motion.div
//         variants={containerVariants}
//         initial="hidden"
//         animate="visible"
//       >
//         <motion.div variants={itemVariants} className="mb-8">
//           <h1 className="text-3xl font-playfair text-navy mb-2">Your Assessment History</h1>
//           <p className="text-gray-600">
//             View your past assessments and access your personalized results.
//           </p>
//         </motion.div>
        
//         <motion.div variants={itemVariants} className="space-y-6">
//           {sessions.map((session) => (
//             <motion.div
//               key={session.id}
//               whileHover={{ y: -2, boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' }}
//               className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-6 transition-all"
//             >
//               <div className="flex items-center justify-between">
//                 <div className="flex items-center space-x-4">
//                   {session.is_viewed ? (
//                     <div className="bg-navy/10 p-3 rounded-full">
//                       <Eye className="h-5 w-5 text-navy" />
//                     </div>
//                   ) : (
//                     <div className="bg-terracotta/10 p-3 rounded-full">
//                       <EyeOff className="h-5 w-5 text-terracotta" />
//                     </div>
//                   )}
                  
//                   <div>
//                     <h3 className="font-medium text-lg text-navy">
//                       Psychology Assessment
//                     </h3>
//                     <div className="flex items-center mt-1 text-sm text-gray-500">
//                       <Calendar className="h-4 w-4 mr-1" />
//                       {formatDate(session.created_at)}
//                       <span className="mx-2">•</span>
//                       <Clock className="h-4 w-4 mr-1" />
//                       {formatTime(session.created_at)}
//                     </div>
//                   </div>
//                 </div>
                
//                 <Button
//                   onClick={() => handleViewResults(session.session_id)}
//                   className="bg-navy hover:bg-navy/90 text-white flex items-center"
//                   size="sm"
//                 >
//                   {session.is_viewed ? 'View Again' : 'View Results'}
//                   <ChevronRight className="ml-1 h-4 w-4" />
//                 </Button>
//               </div>
              
//               {!session.is_viewed && (
//                 <div className="mt-3 flex items-center">
//                   <span className="flex items-center text-xs text-terracotta bg-terracotta/10 px-2 py-1 rounded-full">
//                     <CheckCircle className="w-3 h-3 mr-1" /> New results available
//                   </span>
//                 </div>
//               )}
//             </motion.div>
//           ))}
//         </motion.div>
        
//         <motion.div variants={itemVariants} className="mt-8 text-center">
//           <Button
//             onClick={() => navigate('/assessment')}
//             className="bg-terracotta hover:bg-terracotta/90 text-white"
//           >
//             Take Another Assessment
//           </Button>
//         </motion.div>
//       </motion.div>
//     </div>
//   );
// }

// export default QuestHistory;


// src/components/quest/views/QuestHistory.tsx

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
 Calendar, 
 Clock, 
 FileText, 
 ChevronRight, 
 AlertTriangle, 
 Loader2, 
 CheckCircle,
 Eye,
 EyeOff
} from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';
import { supabase } from '../../../integrations/supabase/client';
import { Button } from '../../../components/ui/button';
import QuestLayout from '../../quest/layout/QuestLayout';

interface SessionHistoryItem {
 id: string;
 user_id: string;
 session_id: string;
 created_at: string;
 is_viewed?: boolean;
}

export function QuestHistory({ className = '' }: { className?: string }) {
 const { user } = useAuth();
 const navigate = useNavigate();
 
 const [isLoading, setIsLoading] = useState(true);
 const [error, setError] = useState<string | null>(null);
 const [sessions, setSessions] = useState<SessionHistoryItem[]>([]);
 
 // Animation variants
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
 
 // Fetch user's session history
 useEffect(() => {
   const fetchSessionHistory = async () => {
     if (!user) {
       setError("Please log in to view your assessment history");
       setIsLoading(false);
       return;
     }
     
     try {
       setIsLoading(true);
       
       // Fetch session history from the database
       const { data, error } = await supabase
         .from('user_session_history')
         .select('*')
         .eq('user_id', user.id)
         .order('created_at', { ascending: false });
       
       if (error) {
         console.error('Error fetching session history:', error);
         setError('Failed to load your assessment history. Please try again later.');
       } else {
         setSessions(data || []);
       }
     } catch (err) {
       console.error('Error in fetchSessionHistory:', err);
       setError('An unexpected error occurred. Please try again later.');
     } finally {
       setIsLoading(false);
     }
   };
   
   fetchSessionHistory();
 }, [user]);
 
 // Format date for display
 const formatDate = (dateString: string) => {
   if (!dateString) return 'N/A';
   
   return new Date(dateString).toLocaleDateString('en-US', {
     year: 'numeric',
     month: 'long',
     day: 'numeric',
   });
 };
 
 // Format time for display
 const formatTime = (dateString: string) => {
   if (!dateString) return '';
   
   return new Date(dateString).toLocaleTimeString('en-US', {
     hour: '2-digit',
     minute: '2-digit',
   });
 };
 
 // Handle viewing results
 const handleViewResults = (sessionId: string) => {
   navigate(`/quest-result/result/${sessionId}`);
 };
 
 // Loading state
 if (isLoading) {
   return (
     <QuestLayout showHeader={true} showNavigation={false} className={className}>
       <div className="flex flex-col items-center justify-center py-12">
         <motion.div
           animate={{
             rotate: 360,
             scale: [1, 1.1, 1],
           }}
           transition={{
             rotate: { duration: 1.5, repeat: Infinity, ease: "linear" },
             scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
           }}
           className="w-16 h-16 border-4 border-navy border-t-transparent rounded-full mb-6"
         />
         <p className="text-gray-600">Loading your assessment history...</p>
       </div>
     </QuestLayout>
   );
 }
 
 // Error state
 if (error) {
   return (
     <QuestLayout showHeader={true} showNavigation={false} className={className}>
       <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
         <motion.div
           initial={{ scale: 0.9, opacity: 0 }}
           animate={{ scale: 1, opacity: 1 }}
           className="bg-red-50 text-red-700 p-4 rounded-lg mb-6 inline-flex items-center"
         >
           <AlertTriangle className="h-6 w-6 mr-2" />
           Error
         </motion.div>
         <h2 className="text-xl font-semibold text-navy mb-4">Unable to Load History</h2>
         <p className="text-gray-600 mb-6 max-w-md">{error}</p>
         <Button
           onClick={() => window.location.reload()}
           className="px-6 py-3 bg-navy text-white rounded-lg hover:bg-navy/90 transition-colors"
         >
           Try Again
         </Button>
       </div>
     </QuestLayout>
   );
 }
 
 // Empty state
 if (sessions.length === 0) {
   return (
       <motion.div
         initial={{ opacity: 0, y: 20 }}
         animate={{ opacity: 1, y: 0 }}
         transition={{ duration: 0.5 }}
         className="container mx-auto px-6"
       >
         <div className="bg-slate-50 dark:bg-slate-800/50 p-8 rounded-xl border border-slate-200 dark:border-slate-700">
           <FileText className="h-16 w-16 mx-auto text-navy opacity-30 mb-4" />
           <h2 className="text-2xl font-playfair text-navy mb-4">No Assessments Found</h2>
           <p className="text-gray-600 dark:text-slate-400 mb-8 max-w-md mx-auto">
             You haven't completed any assessments yet. Take an assessment to start gaining insights into your psychology.
           </p>
           <Button
             onClick={() => navigate('/assessment')}
             className="bg-terracotta hover:bg-terracotta/90 text-white"
           >
             Take Assessment
           </Button>
         </div>
       </motion.div>
   );
 }
 
 // Successful state with history
 return (
     <motion.div
       variants={containerVariants}
       initial="hidden"
       animate="visible"
       className="container mx-auto px-6"
     >
       <motion.div variants={itemVariants} className="mb-8">
         <h1 className="text-3xl font-playfair text-navy mb-2">Your Assessment History</h1>
         <p className="text-gray-600">
           View your past assessments and access your personalized results.
         </p>
       </motion.div>
       
       <motion.div variants={itemVariants} className="space-y-6">
         {sessions.map((session) => (
           <motion.div
             key={session.id}
             whileHover={{ y: -2, boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' }}
             className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-6 transition-all"
           >
             <div className="flex items-center justify-between">
               <div className="flex items-center space-x-4">
                 {session.is_viewed ? (
                   <div className="bg-navy/10 p-3 rounded-full">
                     <Eye className="h-5 w-5 text-navy" />
                   </div>
                 ) : (
                   <div className="bg-terracotta/10 p-3 rounded-full">
                     <EyeOff className="h-5 w-5 text-terracotta" />
                   </div>
                 )}
                 
                 <div>
                   <h3 className="font-medium text-lg text-navy">
                     Psychology Assessment
                   </h3>
                   <div className="flex items-center mt-1 text-sm text-gray-500">
                     <Calendar className="h-4 w-4 mr-1" />
                     {formatDate(session.created_at)}
                     <span className="mx-2">•</span>
                     <Clock className="h-4 w-4 mr-1" />
                     {formatTime(session.created_at)}
                   </div>
                 </div>
               </div>
               
               <Button
                 onClick={() => handleViewResults(session.session_id)}
                 className="bg-navy hover:bg-navy/90 text-white flex items-center"
                 size="sm"
               >
                 {session.is_viewed ? 'View Again' : 'View Results'}
                 <ChevronRight className="ml-1 h-4 w-4" />
               </Button>
             </div>
           </motion.div>
         ))}
       </motion.div>
       
       <motion.div variants={itemVariants} className="mt-8 text-center">
         <Button
           onClick={() => navigate('/assessment')}
           className="bg-terracotta hover:bg-terracotta/90 text-white"
         >
           Take Another Assessment
         </Button>
       </motion.div>
     </motion.div>
 );
}

export default QuestHistory;