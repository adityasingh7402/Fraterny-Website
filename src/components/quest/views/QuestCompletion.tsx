// import React, { useState } from 'react';
// import { motion } from 'framer-motion';
// import { useQuest } from '../core/useQuest';
// import { QuestLayout } from '../layout/QuestLayout';
// import { QuestSummary } from './QuestSummary';
// import { CompletionCelebration } from '../progress/CompletionCelebration';
// import { CompletionEffects } from '../effects/CompletionEffects';
// import { useAuth } from '@/contexts/AuthContext';

// interface QuestCompletionProps {
//   onRestart?: () => void;
//   onComplete?: () => void;
//   className?: string;
// }

// /**
//  * Quest completion screen that shows a summary and allows final submission
//  */
// export function QuestCompletion({
//   onRestart,
//   onComplete,
//   className = ''
// }: QuestCompletionProps) {
//   const { 
//     session, 
//     finishQuest, 
//     resetQuest,
//     changeSection,
//     currentSectionId,
//     isSubmitting
//   } = useQuest();
  
//   const [showSummary, setShowSummary] = useState(false);
//   const [submitted, setSubmitted] = useState(false);
//   const [result, setResult] = useState<any>(null);
  
//   // Handle going back to the assessment
//   const handleBack = () => {
//     setShowSummary(false);
//   };
  
//   // Handle final submission
//   const handleSubmit = async () => {
//     try {
//       // Format the session data for submission
//       const submissionData = formatSubmissionData();
      
//       // Call the finishQuest method from context
//       const result = await finishQuest();
      
//       // Set the result and mark as submitted
//       setResult(result);
//       setSubmitted(true);
      
//       // Call the onComplete callback if provided
//       if (onComplete) {
//         onComplete();
//       }
      
//       // Show the result
//       console.log('Quest completed:', result);
      
//       return result;
//     } catch (error) {
//       console.error('Error submitting quest:', error);
//       throw error;
//     }
//   };
  
//   // Format session data for submission
//   const formatSubmissionData = () => {
//     if (!session) return null;
    
//     // This function formats the data according to the required JSON structure
//     // You can customize this based on your backend requirements
//     return {
//       user_id: session.userId,
//       session_id: session.id,
//       responses: session.responses,
//       // Add other metadata as needed
//     };
//   };
  
//   // Handle restart
//   const handleRestart = () => {
//     resetQuest();
//     if (onRestart) {
//       onRestart();
//     }
//   };
  
//   // Show celebratory content before summary
//   if (!showSummary && !submitted) {
//     return (
//       <QuestLayout showHeader={false} showNavigation={false} className={className}>
//         <motion.div
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           transition={{ duration: 0.8 }}
//           className="text-center p-4"
//         >
//           {/* Celebration effects */}
//           <CompletionEffects />
          
//           {/* Celebration animation */}
//           <CompletionCelebration />
          
//           {/* Congratulation message */}
//           <motion.h2
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.5, duration: 0.8 }}
//             className="text-3xl font-playfair text-navy mt-8 mb-4"
//           >
//             Congratulations!
//           </motion.h2>
          
//           <motion.p
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             transition={{ delay: 0.8, duration: 0.8 }}
//             className="text-gray-600 mb-8 max-w-md mx-auto"
//           >
//             You've completed the assessment. Your responses have been recorded.
//           </motion.p>
          
//           {/* Action buttons */}
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 1.2, duration: 0.8 }}
//             className="flex flex-col sm:flex-row justify-center gap-4 mt-6"
//           >
//             <motion.button
//               onClick={() => setShowSummary(true)}
//               whileHover={{ scale: 1.05 }}
//               whileTap={{ scale: 0.98 }}
//               className="px-6 py-3 bg-terracotta text-white rounded-lg hover:bg-terracotta/90 transition-colors"
//             >
//               View Summary
//             </motion.button>
//           </motion.div>
//         </motion.div>
//       </QuestLayout>
//     );
//   }
  
//   // Show summary before submission
//   if (showSummary && !submitted) {
//     return (
//       <QuestLayout showHeader={false} showNavigation={false} className={className}>
//         <QuestSummary 
//           onSubmit={handleSubmit}
//           onBack={handleBack}
//         />
//       </QuestLayout>
//     );
//   }
  
//   // Show results after submission
//   return (
//     <QuestLayout showHeader={false} showNavigation={false} className={className}>
//       <motion.div
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         transition={{ duration: 0.8 }}
//         className="text-center p-4"
//       >
//         <motion.h2
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.3, duration: 0.8 }}
//           className="text-3xl font-playfair text-navy mb-4"
//         >
//           Thank You!
//         </motion.h2>
        
//         <motion.p
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           transition={{ delay: 0.6, duration: 0.8 }}
//           className="text-gray-600 mb-8 max-w-md mx-auto"
//         >
//           Your assessment has been successfully submitted.
//           We're processing your responses to provide you with personalized insights.
//         </motion.p>
        
//         {/* Success message */}
//         <motion.div
//           initial={{ opacity: 0, scale: 0.9 }}
//           animate={{ opacity: 1, scale: 1 }}
//           transition={{ delay: 0.9, duration: 0.8 }}
//           className="bg-green-50 text-green-800 p-4 rounded-lg border border-green-200 mb-6 inline-block"
//         >
//           <svg 
//             xmlns="http://www.w3.org/2000/svg" 
//             className="h-6 w-6 inline-block mr-2" 
//             fill="none" 
//             viewBox="0 0 24 24" 
//             stroke="currentColor"
//           >
//             <path 
//               strokeLinecap="round" 
//               strokeLinejoin="round" 
//               strokeWidth={2} 
//               d="M5 13l4 4L19 7" 
//             />
//           </svg>
//           Successfully submitted!
//         </motion.div>
        
//         {/* Action buttons */}
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 1.2, duration: 0.8 }}
//           className="mt-6"
//         >
//           <motion.button
//             onClick={handleRestart}
//             whileHover={{ scale: 1.05 }}
//             whileTap={{ scale: 0.98 }}
//             className="px-6 py-3 bg-navy text-white rounded-lg hover:bg-navy/90 transition-colors"
//           >
//             Start New Assessment
//           </motion.button>
//         </motion.div>
//       </motion.div>
//     </QuestLayout>
//   );
// }

// export default QuestCompletion;

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuest } from '../core/useQuest';
import { useAuth } from '@/contexts/AuthContext'; // Add this import
import { QuestLayout } from '../layout/QuestLayout';
import { QuestSummary } from './QuestSummary';
import { CompletionCelebration } from '../progress/CompletionCelebration';
import { CompletionEffects } from '../effects/CompletionEffects';

interface QuestCompletionProps {
  onRestart?: () => void;
  onComplete?: () => void;
  className?: string;
}

/**
 * Quest completion screen that shows a summary and allows final submission
 */
export function QuestCompletion({
  onRestart,
  onComplete,
  className = ''
}: QuestCompletionProps) {
  const { 
    session, 
    finishQuest, 
    resetQuest,
    changeSection,
    currentSectionId,
    isSubmitting,
    allQuestions, // Add this
    sections      // Add this
  } = useQuest();
  
  // Add auth context to get user data
  const auth = useAuth();
  
  const [showSummary, setShowSummary] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState<any>(null);
  
  // Handle going back to the assessment
  const handleBack = () => {
    setShowSummary(false);
  };
  
  // Handle final submission
  const handleSubmit = async () => {
    try {
      // Format the session data for submission
      const submissionData = formatSubmissionData();
      
      // Log the submission data to console
      console.log('Submission data:', JSON.stringify(submissionData, null, 2));

      // Send data to backend API
      // try {
      //   const response = await fetch('https://api.yourbackend.com/quest/submit', {
      //     method: 'POST',
      //     headers: {
      //       'Content-Type': 'application/json',
      //       'Authorization': `Bearer ${auth.session?.access_token || ''}`
      //     },
      //     body: JSON.stringify(submissionData)
      //   });
        
      //   if (!response.ok) {
      //     throw new Error(`API error: ${response.status}`);
      //   }
        
      //   const apiResult = await response.json();
      //   console.log('API response:', apiResult);
        
      //   // You can update the result state with the API response
      //   setResult(apiResult);
      // } catch (apiError) {
      //   console.error('Error submitting to API:', apiError);
      //   // Continue with local finishQuest even if API fails
      // }
      
      // Call the finishQuest method from context
      
      const result = await finishQuest();
      
      // Set the result and mark as submitted
      setResult(result);
      setSubmitted(true);
      
      // Call the onComplete callback if provided
      if (onComplete) {
        onComplete();
      }
      
      // Show the result
      console.log('Quest completed:', result);
      
      return result;
    } catch (error) {
      console.error('Error submitting quest:', error);
      throw error;
    }
  };
  
  // Format session data for submission
  const formatSubmissionData = () => {
    if (!session) return null;

    console.log('Auth user object:', auth.user);
    
    // Get user information from auth context
    const userData = {
      user_id: auth.user?.id || session.userId,
      name: auth.user?.user_metadata?.first_name 
        ? `${auth.user.user_metadata.first_name} ${auth.user.user_metadata.last_name || ''}`
        : 'User',
      email: auth.user?.email || 'user@example.com'
    };
    
    // Calculate completion time and duration
    const startTime = session.startedAt;
    const completionTime = new Date().toISOString();
    const durationMinutes = (new Date().getTime() - new Date(startTime).getTime()) / (1000 * 60);
    
    // Format responses array
    const responses = Object.entries(session.responses || {}).map(([questionId, response], index) => {
      // Find question details
      const question = allQuestions?.find(q => q.id === questionId);
      const sectionId = question?.sectionId || '';
      const sectionName = sections?.find(s => s.id === sectionId)?.title || '';
      
      return {
        qno: index + 1,
        question_id: questionId,
        question_text: question?.text || '',
        answer: response.response,
        section_id: sectionId,
        section_name: sectionName,
        difficulty: question?.difficulty || 'medium',
        metadata: {
          tags: response.tags || [],
          timestamp: response.timestamp
        }
      };
    });
    
    // Calculate analytics
    const analytics = calculateAnalytics(responses);
    
    // Create the full submission data object
    return {
      response: responses,
      user_data: userData,
      assessment_metadata: {
        session_id: session.id,
        start_time: startTime,
        completion_time: completionTime,
        duration_minutes: Number(durationMinutes.toFixed(1)),
        completion_percentage: Math.round((responses.length / (allQuestions?.length || 1)) * 100),
        average_response_time_seconds: 45.2, // Placeholder value
        device_info: {
          type: detectDeviceType(),
          browser: detectBrowser(),
          operating_system: detectOS()
        }
      },
      analytics: analytics,
      preliminary_analysis: {
        response_consistency_score: 0.85,
        authenticity_score: 0.92,
        thoroughness_score: 0.78,
        insight_areas: [
          "self_awareness",
          "goal_setting",
          "emotional_expression"
        ],
        potential_focus_areas: [
          "decision_making",
          "stress_management"
        ]
      }
    };
  };
  
  // Helper function to calculate analytics
  const calculateAnalytics = (responses: any[]) => {
    // Calculate tag distribution
    const tagCounts: Record<string, number> = {};
    responses.forEach(response => {
      if (response.metadata.tags) {
        response.metadata.tags.forEach((tag: string) => {
          tagCounts[tag] = (tagCounts[tag] || 0) + 1;
        });
      }
    });
    
    // Ensure all possible tags have counts
    const allTags = ['Honest', 'Unsure', 'Sarcastic', 'Avoiding'];
    allTags.forEach(tag => {
      if (!tagCounts[tag]) tagCounts[tag] = 0;
    });
    
    // Calculate difficulty breakdown
    const difficultyCounts: Record<string, number> = {
      easy: 0,
      medium: 0,
      hard: 0
    };
    
    responses.forEach(response => {
      if (response.difficulty) {
        difficultyCounts[response.difficulty] = (difficultyCounts[response.difficulty] || 0) + 1;
      }
    });
    
    // Calculate section completion times
    const sectionCompletionTimes: Record<string, number> = {};
    const sectionsMap = new Map<string, any[]>();
    
    // Group responses by section
    responses.forEach(response => {
      if (!sectionsMap.has(response.section_id)) {
        sectionsMap.set(response.section_id, []);
      }
      const sectionResponses = sectionsMap.get(response.section_id);
      if (sectionResponses) {
        sectionResponses.push(response);
      }
    });
    
    // Calculate times for each section
    sections?.forEach(section => {
      const sectionId = section.id;
      const responseCount = sectionsMap.get(sectionId)?.length || 0;
      // Assume 1 minute per response as a placeholder
      sectionCompletionTimes[sectionId] = responseCount;
    });
    
    // Calculate text response metrics
    let totalTextLength = 0;
    let textResponseCount = 0;
    let longestResponseId = '';
    let longestResponseLength = 0;
    let shortestResponseId = '';
    let shortestResponseLength = Infinity;
    
    responses.forEach(response => {
      const textLength = response.answer.length;
      if (textLength > 0) {
        totalTextLength += textLength;
        textResponseCount++;
        
        if (textLength > longestResponseLength) {
          longestResponseLength = textLength;
          longestResponseId = response.question_id;
        }
        
        if (textLength < shortestResponseLength) {
          shortestResponseLength = textLength;
          shortestResponseId = response.question_id;
        }
      }
    });
    
    const avgTextLength = textResponseCount > 0 ? (totalTextLength / textResponseCount) : 0;
    
    // Generate time_per_section data
    const timePerSection: Record<string, number> = {};
    sections?.forEach(section => {
      const responseCount = sectionsMap.get(section.id)?.length || 0;
      // Assume 60 seconds per question
      timePerSection[section.id] = responseCount * 60;
    });
    
    return {
      response_patterns: {
        tag_distribution: tagCounts,
        difficulty_breakdown: difficultyCounts,
        section_completion_times: sectionCompletionTimes,
        average_text_response_length: avgTextLength,
        longest_response_question_id: longestResponseId,
        shortest_response_question_id: shortestResponseId
      },
      engagement_metrics: {
        hesitations: Math.floor(Math.random() * 5), // Placeholder
        changed_answers: Math.floor(Math.random() * 5), // Placeholder
        time_per_section: timePerSection,
        pauses: Math.floor(Math.random() * 3) // Placeholder
      }
    };
  };
  
  // Helper functions for device detection
  const detectDeviceType = (): string => {
    const userAgent = navigator.userAgent;
    if (/mobile|android|iphone|ipad|ipod/i.test(userAgent.toLowerCase())) {
      return /ipad/i.test(userAgent.toLowerCase()) ? 'tablet' : 'mobile';
    }
    return 'desktop';
  };
  
  const detectBrowser = (): string => {
    const userAgent = navigator.userAgent;
    if (userAgent.indexOf('Chrome') > -1) return 'Chrome';
    if (userAgent.indexOf('Safari') > -1) return 'Safari';
    if (userAgent.indexOf('Firefox') > -1) return 'Firefox';
    if (userAgent.indexOf('MSIE') > -1 || userAgent.indexOf('Trident') > -1) return 'Internet Explorer';
    if (userAgent.indexOf('Edge') > -1) return 'Edge';
    return 'Unknown';
  };
  
  const detectOS = (): string => {
    const userAgent = navigator.userAgent;
    if (userAgent.indexOf('Windows') > -1) return 'Windows';
    if (userAgent.indexOf('Mac') > -1) return 'Mac';
    if (userAgent.indexOf('Linux') > -1) return 'Linux';
    if (userAgent.indexOf('Android') > -1) return 'Android';
    if (userAgent.indexOf('iOS') > -1) return 'iOS';
    return 'Unknown';
  };
  
  // Show celebratory content before summary
  if (!showSummary && !submitted) {
    return (
      <QuestLayout showHeader={false} showNavigation={false} className={className}>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="text-center p-4"
        >
          {/* Celebration effects */}
          <CompletionEffects />
          
          {/* Celebration animation */}
          <CompletionCelebration />
          
          {/* Congratulation message */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="text-3xl font-playfair text-navy mt-8 mb-4"
          >
            Congratulations!
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="text-gray-600 mb-8 max-w-md mx-auto"
          >
            You've completed the assessment. Your responses have been recorded.
          </motion.p>
          
          {/* Action buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.8 }}
            className="flex flex-col sm:flex-row justify-center gap-4 mt-6"
          >
            <motion.button
              onClick={() => setShowSummary(true)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              className="px-6 py-3 bg-terracotta text-white rounded-lg hover:bg-terracotta/90 transition-colors"
            >
              View Summary
            </motion.button>
          </motion.div>
        </motion.div>
      </QuestLayout>
    );
  }
  
  // Show summary before submission
  if (showSummary && !submitted) {
    return (
      <QuestLayout showHeader={false} showNavigation={false} className={className}>
        <QuestSummary 
          onSubmit={handleSubmit}
          onBack={handleBack}
        />
      </QuestLayout>
    );
  }
  
  // Show results after submission
  return (
    <QuestLayout showHeader={false} showNavigation={false} className={className}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="text-center p-4"
      >
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="text-3xl font-playfair text-navy mb-4"
        >
          Thank You!
        </motion.h2>
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="text-gray-600 mb-8 max-w-md mx-auto"
        >
          Your assessment has been successfully submitted.
          We're processing your responses to provide you with personalized insights.
        </motion.p>
        
        {/* Success message */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.9, duration: 0.8 }}
          className="bg-green-50 text-green-800 p-4 rounded-lg border border-green-200 mb-6 inline-block"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-6 w-6 inline-block mr-2" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M5 13l4 4L19 7" 
            />
          </svg>
          Successfully submitted!
        </motion.div>
        
        {/* Action buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="mt-6"
        >
          <motion.button
            onClick={resetQuest}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            className="px-6 py-3 bg-navy text-white rounded-lg hover:bg-navy/90 transition-colors"
          >
            Return to Homepage
          </motion.button>
        </motion.div>
      </motion.div>
    </QuestLayout>
  );
}

export default QuestCompletion;