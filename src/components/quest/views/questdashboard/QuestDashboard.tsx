// // Simplified QuestDashboard - Single useEffect approach

// import React, { useState, useEffect } from 'react';
// import { motion } from 'framer-motion';
// import { Lock, Download, Calendar, ExternalLink, FileText, AlertCircle } from 'lucide-react';
// import { useAuth } from '../../../../contexts/AuthContext';
// import { useNavigate } from 'react-router-dom';
// import emailjs from '@emailjs/browser';
// import { toast } from 'sonner';
// import { PaymentService, sessionStorageManager, sessionManager } from '@/services/payments';
// import axios from 'axios';

// const EMAILJS_SERVICE_ID = 'service_t02m05r';
// const EMAILJS_TEMPLATE_ID = 'template_8ew3q9o'; 
// const EMAILJS_PUBLIC_KEY = '5h8-GbUjfznY55GzW';

// interface DashboardApiResponse {
//   status: number;
//   data: DashboardTest[];
// }

// interface DashboardTest {
//   userid: string;
//   testid: string;
//   sessionid: string;
//   testtaken: string;
//   ispaymentdone: boolean;
//   pdflink: string;
// }

// interface QuestDashboardProps {
//   className?: string;
// }

// // Configuration flag - set to true for mock data, false for API
// const USE_MOCK_DATA = true;

// // Mock data for testing
// const MOCK_DATA: DashboardTest[] = [
//   {
//     userid: "9bba4c19-c22b-4c83-9b60-bfc81a2695fe",
//     testid: "bae03e2a81ef518a232cd95800708b60bd1cfea9",
//     sessionid: "session_1752577737404",
//     testtaken: "2025-07-15T11:08:57.404Z",
//     ispaymentdone: true,
//     pdflink: "https://api.fraterny.in/api/report/session_1752577737404/9bba4c19-c22b-4c83-9b60-bfc81a2695fe/bae03e2a81ef518a232cd95800708b60bd1cfea9"
//   },
//   {
//     userid: "9bba4c19-c22b-4c83-9b60-bfc81a2695fe", 
//     testid: "34545jljerkldsjrw35-3454e",
//     sessionid: "e4aef47f-2359-4f8b-93ea-efc5dfd49f2a",
//     testtaken: "2025-07-11T12:24:58.654Z",
//     ispaymentdone: false,
//     pdflink: "https://api.fraterny.in/api/report/e4aef47f-2359-4f8b-93ea-efc5dfd49f2a/9bba4c19-c22b-4c83-9b60-bfc81a2695fe/34545jljerkldsjrw35-3454e"
//   },
//   {
//     userid: "fedf723f-dcb0-4806-b84e-1590dfef4f76",
//     testid: "bbadf5ce-2eb4-4f9c-8f96-9e4b9fd0e10a", 
//     sessionid: "session_1752236698654",
//     testtaken: "2025-07-11T12:24:58.654Z",
//     ispaymentdone: true,
//     pdflink: "https://api.fraterny.in/api/report/session_1752236698654/fedf723f-dcb0-4806-b84e-1590dfef4f76/bbadf5ce-2eb4-4f9c-8f96-9e4b9fd0e10a"
//   },
//   {
//     userid: "9bba4c19-c22b-4c83-9b60-bfc81a2695fe",
//     testid: "9d5602bd6a3f05b9e00900793e0d315d436f4ed7",
//     sessionid: "session_1753961797982",
//     testtaken: "2025-07-31T11:36:50.561Z",
//     ispaymentdone: false,
//     pdflink: "https://api.fraterny.in/api/report/session_1753961797982/9bba4c19-c22b-4c83-9b60-bfc81a2695fe/9d5602bd6a3f05b9e00900793e0d315d436f4ed7"
//   },
//   {
//     userid: "9bba4c19-c22b-4c83-9b60-bfc81a2695fe",
//     testid: "c8a27db647f5c8742b8d5d70aa9cedb3f00a7b09",
//     sessionid: "session_1753962293131",
//     testtaken: "2025-07-31T11:45:17.168Z",
//     ispaymentdone: true,
//     pdflink: "https://api.fraterny.in/api/report/session_1753962293131/9bba4c19-c22b-4c83-9b60-bfc81a2695fe/c8a27db647f5c8742b8d5d70aa9cedb3f00a7b09"
//   }
// ];

// const QuestDashboard: React.FC<QuestDashboardProps> = ({ className = '' }) => {
//   const { user, signInWithGoogle } = useAuth();
//   const [data, setData] = useState<DashboardTest[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);
//   const [paymentLoading, setPaymentLoading] = useState<string | null>(null);
//   const navigate = useNavigate();

//   // Format date helper function
//   const formatDate = (dateString: string): string => {
//     try {
//       const date = new Date(dateString);
//       return date.toLocaleDateString('en-US', {
//         year: 'numeric',
//         month: 'short',
//         day: 'numeric'
//       });
//     } catch (err) {
//       return dateString;
//     }
//   };

//   // Helper function to refresh dashboard data
//   const fetchUpdatedDashboardData = async (): Promise<DashboardTest[] | null> => {
//     if (!user?.id) return null;
    
//     try {
//       if (USE_MOCK_DATA) {
//         await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay
//         return MOCK_DATA;
//       } else {
//         const response = await axios.get<DashboardApiResponse>(
//           `https://api.fraterny.in/api/userdashboard/${user.id}`
//         );
//         return response.data.data;
//       }
//     } catch (error) {
//       console.error('Failed to refresh dashboard data:', error);
//       return null;
//     }
//   };

//   // SINGLE useEffect to fetch dashboard data
//   useEffect(() => {
//     const fetchDashboardData = async () => {
//       try {
//         setLoading(true);
//         setError(null);

//         if (USE_MOCK_DATA) {
//           // Mock data approach
//           console.log('Using mock data for dashboard');
//           await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
//           setData(MOCK_DATA);
//         } else {
//           // Real API approach
//           if (!user?.id) {
//             setError('User not authenticated');
//             return;
//           }

//           console.log('Fetching dashboard data from API for user:', user.id);
//           const response = await axios.get<DashboardApiResponse>(
//             `https://api.fraterny.in/api/userdashboard/${user.id}`,
//             {
//               headers: {
//                 'Content-Type': 'application/json',
//               },
//               timeout: 10000, // 10 second timeout
//             }
//           );

//           setData(response.data.data);
//         }
//       } catch (err: any) {
//         console.error('Dashboard data fetch error:', err);
        
//         if (USE_MOCK_DATA) {
//           setError('Failed to load mock data');
//         } else {
//           // Handle different types of API errors
//           if (err.code === 'ECONNABORTED') {
//             setError('Request timeout - please try again');
//           } else if (err.response?.status === 404) {
//             setError('No test data found');
//           } else if (err.response?.status === 401) {
//             setError('Unauthorized - please log in again');
//           } else {
//             setError('Failed to load dashboard data');
//           }
//         }
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchDashboardData();
//   }, [user?.id]); // Only depend on user.id

//   // Handle return from authentication/payment
//   useEffect(() => {
//     const handleAuthReturn = async () => {
//       try {
//         // First check if user just signed in and has pending payment context
//         if (user?.id) {
//           const paymentContext = sessionStorageManager.getPaymentContext();
//           const sessionData = sessionStorageManager.getSessionData();
          
//           // Check if this is a return from authentication
//           const isReturningFromAuth = paymentContext && sessionData?.authenticationRequired;
          
//           if (isReturningFromAuth) {
//             // User just completed sign-in and has pending payment
//             toast.success('You are signed in now. You can proceed to payment for detailed report');
            
//             // Mark authentication as completed
//             sessionManager.markAuthenticationCompleted();
//             return;
//           }
//         }
        
//         // Then check for actual payment results
//         const paymentResult = await PaymentService.handleAuthReturn();
        
//         if (paymentResult) {
//           if (paymentResult.success) {
//             toast.success('Payment successful! Your report is now unlocked.');
            
//             // Refresh dashboard data to get updated payment status
//             if (user?.id) {
//               const updatedData = await fetchUpdatedDashboardData();
//               if (updatedData) {
//                 setData(updatedData);
//               }
//             }
            
//           } else {
//             toast.error('Payment failed after authentication. Please try again.');
//           }
//         }
//       } catch (error) {
//         console.error('Error handling auth return:', error);
//       }
//     };

//     handleAuthReturn();
//   }, [user?.id]);

//   // Handle download actions
//   const handleFreeReport = (testData: DashboardTest) => {
//     navigate(`/quest-result/result/${testData.sessionid}/${testData.userid}/${testData.testid}`);
//   };

//   const handlePaidReport = async (testData: DashboardTest) => {
//     // If payment is already done, send email with PDF
//     if (testData.ispaymentdone) {
//       try {
//         await emailjs.send(
//           EMAILJS_SERVICE_ID,
//           EMAILJS_TEMPLATE_ID,
//           {
//             user_name: user?.user_metadata?.first_name || 'User',
//             user_email: user?.email,
//             test_date: formatDate(testData.testtaken),
//             session_id: testData.sessionid,
//             pdf_link: testData.pdflink
//           },
//           EMAILJS_PUBLIC_KEY
//         );
//         toast.success('Email sent successfully with your report link!');
//       } catch (error) {
//         toast.error('Failed to send email. Please try again.');
//       }
//       return;
//     }

//     // Check if user is signed in
//     if (!user?.id) {
//       toast.info('You are not signed in. Please sign in for saving your answer with more accurate analysis');
//       try {
//         await signInWithGoogle();
//         // After sign-in, user can click the button again
//       } catch (error) {
//         toast.error('Sign-in failed. Please try again.');
//       }
//       return;
//     }

//     // User is signed in, proceed with payment
//     try {
//       setPaymentLoading(testData.sessionid);
      
//       const paymentResult = await PaymentService.startPayment(
//         testData.sessionid, 
//         testData.testid
//       );
      
//       if (paymentResult.success) {
//         toast.success('Payment successful!');
//         // Update UI, send email, etc.
//       } else {
//         toast.error(paymentResult.error || 'Payment failed');
//       }
      
//     } catch (error) {
//       toast.error('Payment failed. Please try again.');
//     } finally {
//       setPaymentLoading(null);
//     }
//   };

//   // Loading state
//   if (loading) {
//     return (
//       <div className={`p-6 ${className}`}>
//         <div className="animate-pulse space-y-4">
//           <div className="h-8 bg-gray-200 rounded w-1/3"></div>
//           <div className="space-y-3">
//             {[1, 2, 3].map((i) => (
//               <div key={i} className="h-16 bg-gray-200 rounded"></div>
//             ))}
//           </div>
//         </div>
//       </div>
//     );
//   }

//   // Error state
//   if (error) {
//     return (
//       <div className={`p-6 ${className}`}>
//         <div className="text-center py-12">
//           <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
//           <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Dashboard</h3>
//           <p className="text-gray-600 mb-4">{error}</p>
//           <button
//             onClick={() => window.location.reload()}
//             className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
//           >
//             Try Again
//           </button>
//         </div>
//       </div>
//     );
//   }

//   // Empty state
//   if (data.length === 0) {
//     return (
//       <div className={`p-6 ${className}`}>
//         <div className="text-center py-12">
//           <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
//           <h3 className="text-lg font-medium text-gray-900 mb-2">No Tests Found</h3>
//           <p className="text-gray-600">You haven't taken any tests yet.</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className={`p-6 ${className} bg-[#004A7F] text-white h-screen`}>
//       <div className='flex flex-col items-center justify-center w-full mb-8'>
//         <div className='text-3xl font-normal font-["Gilroy-Bold"]'>
//           QUEST
//         </div>
//         <div className='text-sm font-normal font-["Gilroy-Regular"] tracking-[0.1rem] pl-0 mt-[-8px]'>
//           BY FRATERNY
//         </div>
//       </div>
      
//       {/* Header */}
//       <div className="mb-8">
//         <h1 className="text-3xl font-['Gilroy-Bold'] text-white mb-2">Test Dashboard</h1>
//         <p className="font-['Gilroy-semiBold'] text-white">View and download your assessment reports</p>
//       </div>

//       {/* Table */}
//       <div className="bg-white rounded-lg shadow-2xl overflow-hidden flex flex-col gap-2">
//         <div className="overflow-x-auto">
//           <table className="min-w-full divide-y divide-gray-200">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Date Taken
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Free Report
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Paid Report
//                 </th>
//               </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-200">
//               {data.map((test, index) => (
//                 <motion.tr
//                   key={test.testid}
//                   initial={{ opacity: 0, y: 20 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   transition={{ delay: index * 0.1 }}
//                   className="hover:bg-gray-50 transition-colors"
//                 >
//                   {/* Date Taken */}
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                     <div className="flex items-center">
//                       <Calendar className="w-4 h-4 mr-2" />
//                       {formatDate(test.testtaken)}
//                     </div>
//                   </td>

//                   {/* Free Report */}
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <button
//                       onClick={() => handleFreeReport(test)}
//                       className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-black hover:bg-gray-100 transition-colors"
//                     >
//                       <ExternalLink className="w-4 h-4 mr-2" />
//                       View
//                     </button>
//                   </td>

//                   {/* Paid Report */}
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     {test.ispaymentdone ? (
//                       <button
//                         onClick={() => handlePaidReport(test)}
//                         className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-green-600 hover:bg-green-700 transition-colors"
//                       >
//                         <Download className="w-4 h-4 mr-2" />
//                         Download
//                       </button>
//                     ) : (
//                       <button
//                         onClick={() => handlePaidReport(test)}
//                         disabled={paymentLoading === test.sessionid}
//                         className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm leading-4 font-medium rounded-md text-gray-500 bg-white/10 backdrop-blur-sm hover:bg-gray-50 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
//                         style={{
//                           background: 'rgba(255, 255, 255, 0.1)',
//                           backdropFilter: 'blur(4px)',
//                         }}
//                       >
//                         {paymentLoading === test.sessionid ? (
//                           <>
//                             <div className="w-4 h-4 mr-2 animate-spin border-2 border-gray-500 border-t-transparent rounded-full"></div>
//                             Processing...
//                           </>
//                         ) : (
//                           <>
//                             <Lock className="w-4 h-4 mr-2" />
//                             Unlock
//                           </>
//                         )}
//                       </button>
//                     )}
//                   </td>
//                 </motion.tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default QuestDashboard;

// ------------------------------------------------------ //

// Simplified QuestDashboard - Removed sign-in logic for sidebar usage

// import React, { useState, useEffect } from 'react';
// import { motion } from 'framer-motion';
// import { Lock, Download, Calendar, ExternalLink, FileText, AlertCircle } from 'lucide-react';
// import { useAuth } from '../../../../contexts/AuthContext';
// import { useNavigate } from 'react-router-dom';
// import emailjs from '@emailjs/browser';
// import { toast } from 'sonner';
// import { PaymentService } from '@/services/payments';
// import axios from 'axios';

// const EMAILJS_SERVICE_ID = 'service_15zo26r';
// const EMAILJS_TEMPLATE_ID = 'template_8ew3q9o'; 
// const EMAILJS_PUBLIC_KEY = '5h8-GbUjfznY55GzW';

// interface DashboardApiResponse {
//   status: number;
//   data: DashboardTest[];
// }

// interface DashboardTest {
//   userid: string;
//   testid: string;
//   sessionid: string;
//   testtaken: string;
//   ispaymentdone: boolean;
//   pdflink: string;
// }

// interface QuestDashboardProps {
//   className?: string;
// }

// // Configuration flag - set to true for mock data, false for API
// const USE_MOCK_DATA = true;

// // Mock data for testing
// const MOCK_DATA: DashboardTest[] = [
//   {
//     userid: "9bba4c19-c22b-4c83-9b60-bfc81a2695fe",
//     testid: "bae03e2a81ef518a232cd95800708b60bd1cfea9",
//     sessionid: "session_1752577737404",
//     testtaken: "2025-07-15T11:08:57.404Z",
//     ispaymentdone: true,
//     pdflink: "https://api.fraterny.in/api/report/session_1752577737404/9bba4c19-c22b-4c83-9b60-bfc81a2695fe/bae03e2a81ef518a232cd95800708b60bd1cfea9"
//   },
//   {
//     userid: "9bba4c19-c22b-4c83-9b60-bfc81a2695fe", 
//     testid: "34545jljerkldsjrw35-3454e",
//     sessionid: "e4aef47f-2359-4f8b-93ea-efc5dfd49f2a",
//     testtaken: "2025-07-11T12:24:58.654Z",
//     ispaymentdone: false,
//     pdflink: "https://api.fraterny.in/api/report/e4aef47f-2359-4f8b-93ea-efc5dfd49f2a/9bba4c19-c22b-4c83-9b60-bfc81a2695fe/34545jljerkldsjrw35-3454e"
//   },
//   {
//     userid: "fedf723f-dcb0-4806-b84e-1590dfef4f76",
//     testid: "bbadf5ce-2eb4-4f9c-8f96-9e4b9fd0e10a", 
//     sessionid: "session_1752236698654",
//     testtaken: "2025-07-11T12:24:58.654Z",
//     ispaymentdone: true,
//     pdflink: "https://api.fraterny.in/api/report/session_1752236698654/fedf723f-dcb0-4806-b84e-1590dfef4f76/bbadf5ce-2eb4-4f9c-8f96-9e4b9fd0e10a"
//   },
//   {
//     userid: "9bba4c19-c22b-4c83-9b60-bfc81a2695fe",
//     testid: "9d5602bd6a3f05b9e00900793e0d315d436f4ed7",
//     sessionid: "session_1753961797982",
//     testtaken: "2025-07-31T11:36:50.561Z",
//     ispaymentdone: false,
//     pdflink: "https://api.fraterny.in/api/report/session_1753961797982/9bba4c19-c22b-4c83-9b60-bfc81a2695fe/9d5602bd6a3f05b9e00900793e0d315d436f4ed7"
//   },
//   {
//     userid: "9bba4c19-c22b-4c83-9b60-bfc81a2695fe",
//     testid: "c8a27db647f5c8742b8d5d70aa9cedb3f00a7b09",
//     sessionid: "session_1753962293131",
//     testtaken: "2025-07-31T11:45:17.168Z",
//     ispaymentdone: true,
//     pdflink: "https://api.fraterny.in/api/report/session_1753962293131/9bba4c19-c22b-4c83-9b60-bfc81a2695fe/c8a27db647f5c8742b8d5d70aa9cedb3f00a7b09"
//   }
// ];

// const QuestDashboard: React.FC<QuestDashboardProps> = ({ className = '' }) => {
//   const { user } = useAuth();
//   const [data, setData] = useState<DashboardTest[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);
//   const [paymentLoading, setPaymentLoading] = useState<string | null>(null);
//   const navigate = useNavigate();

//   // Format date helper function
//   const formatDate = (dateString: string): string => {
//     try {
//       const date = new Date(dateString);
//       return date.toLocaleDateString('en-US', {
//         year: 'numeric',
//         month: 'short',
//         day: 'numeric'
//       });
//     } catch (err) {
//       return dateString;
//     }
//   };

//   // Helper function to refresh dashboard data
//   const fetchUpdatedDashboardData = async (): Promise<DashboardTest[] | null> => {
//     if (!user?.id) return null;
    
//     try {
//       if (USE_MOCK_DATA) {
//         await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay
//         return MOCK_DATA;
//       } else {
//         const response = await axios.get<DashboardApiResponse>(
//           `https://api.fraterny.in/api/userdashboard/${user.id}`
//         );
//         return response.data.data;
//       }
//     } catch (error) {
//       console.error('Failed to refresh dashboard data:', error);
//       return null;
//     }
//   };

//   // SINGLE useEffect to fetch dashboard data
//   useEffect(() => {
//     const fetchDashboardData = async () => {
//       try {
//         setLoading(true);
//         setError(null);

//         if (USE_MOCK_DATA) {
//           // Mock data approach
//           console.log('Using mock data for dashboard');
//           await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
//           setData(MOCK_DATA);
//         } else {
//           // Real API approach
//           if (!user?.id) {
//             setError('User not authenticated');
//             return;
//           }

//           console.log('Fetching dashboard data from API for user:', user.id);
//           const response = await axios.get<DashboardApiResponse>(
//             `https://api.fraterny.in/api/userdashboard/${user.id}`,
//             {
//               headers: {
//                 'Content-Type': 'application/json',
//               },
//               timeout: 10000, // 10 second timeout
//             }
//           );

//           setData(response.data.data);
//         }
//       } catch (err: any) {
//         console.error('Dashboard data fetch error:', err);
        
//         if (USE_MOCK_DATA) {
//           setError('Failed to load mock data');
//         } else {
//           // Handle different types of API errors
//           if (err.code === 'ECONNABORTED') {
//             setError('Request timeout - please try again');
//           } else if (err.response?.status === 404) {
//             setError('No test data found');
//           } else if (err.response?.status === 401) {
//             setError('Unauthorized - please log in again');
//           } else {
//             setError('Failed to load dashboard data');
//           }
//         }
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchDashboardData();
//   }, [user?.id]); // Only depend on user.id

//   // Handle payment result updates
//   useEffect(() => {
//     const handlePaymentResult = async () => {
//       try {
//         // Check for payment results from PaymentService
//         const paymentResult = await PaymentService.handleAuthReturn();
        
//         if (paymentResult) {
//           if (paymentResult.success) {
//             toast.success('Payment successful! Your report is now unlocked.');
            
//             // Refresh dashboard data to get updated payment status
//             if (user?.id) {
//               const updatedData = await fetchUpdatedDashboardData();
//               if (updatedData) {
//                 setData(updatedData);
//               }
//             }
            
//           } else {
//             toast.error('Payment failed. Please try again.');
//           }
//         }
//       } catch (error) {
//         console.error('Error handling payment result:', error);
//       }
//     };

//     handlePaymentResult();
//   }, [user?.id]);

//   // Handle download actions
//   const handleFreeReport = (testData: DashboardTest) => {
//     navigate(`/quest-result/result/${testData.sessionid}/${testData.userid}/${testData.testid}`);
//   };

//   const handlePaidReport = async (testData: DashboardTest) => {
//     // If payment is already done, send email with PDF
//     if (testData.ispaymentdone) {
//       try {
//         await emailjs.send(
//           EMAILJS_SERVICE_ID,
//           EMAILJS_TEMPLATE_ID,
//           {
//             user_name: user?.user_metadata?.first_name || 'User',
//             user_email: user?.email,
//             test_date: formatDate(testData.testtaken),
//             session_id: testData.sessionid,
//             pdf_link: testData.pdflink
//           },
//           EMAILJS_PUBLIC_KEY
//         );
//         toast.success('Email sent successfully with your report link!');
//       } catch (error) {
//         toast.error('Failed to send email. Please try again.');
//       }
//       return;
//     }

//     // User is authenticated (guaranteed in sidebar), proceed with payment
//     try {
//       setPaymentLoading(testData.sessionid);
      
//       const paymentResult = await PaymentService.startPayment(
//         testData.sessionid, 
//         testData.testid
//       );
      
//       if (paymentResult.success) {
//         toast.success('Payment successful!');
//         // Refresh data to show updated payment status
//         const updatedData = await fetchUpdatedDashboardData();
//         if (updatedData) {
//           setData(updatedData);
//         }
//       } else {
//         toast.error(paymentResult.error || 'Payment failed');
//       }
      
//     } catch (error) {
//       toast.error('Payment failed. Please try again.');
//     } finally {
//       setPaymentLoading(null);
//     }
//   };

//   // Loading state
//   if (loading) {
//     return (
//       <div className={`p-6 ${className}`}>
//         <div className="animate-pulse space-y-4">
//           <div className="h-8 bg-gray-200 rounded w-1/3"></div>
//           <div className="space-y-3">
//             {[1, 2, 3].map((i) => (
//               <div key={i} className="h-16 bg-gray-200 rounded"></div>
//             ))}
//           </div>
//         </div>
//       </div>
//     );
//   }

//   // Error state
//   if (error) {
//     return (
//       <div className={`p-6 ${className}`}>
//         <div className="text-center py-12">
//           <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
//           <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Dashboard</h3>
//           <p className="text-gray-600 mb-4">{error}</p>
//           <button
//             onClick={() => window.location.reload()}
//             className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
//           >
//             Try Again
//           </button>
//         </div>
//       </div>
//     );
//   }

//   // Empty state
//   if (data.length === 0) {
//     return (
//       <div className={`p-6 ${className}`}>
//         <div className="text-center py-12">
//           <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
//           <h3 className="text-lg font-medium text-gray-900 mb-2">No Tests Found</h3>
//           <p className="text-gray-600">You haven't taken any tests yet.</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className={`p-6 ${className} bg-[#004A7F] text-white h-screen`}>
//       <div className='flex flex-col items-center justify-center w-full mb-8'>
//         <div className='text-3xl font-normal font-["Gilroy-Bold"]'>
//           QUEST
//         </div>
//         <div className='text-sm font-normal font-["Gilroy-Regular"] tracking-[0.1rem] pl-0 mt-[-8px]'>
//           BY FRATERNY
//         </div>
//       </div>
      
//       {/* Header */}
//       <div className="mb-8">
//         <h1 className="text-3xl font-['Gilroy-Bold'] text-white mb-2">Test Dashboard</h1>
//         <p className="font-['Gilroy-semiBold'] text-white">View and download your assessment reports</p>
//       </div>

//       {/* Table */}
//       <div className="bg-white rounded-lg shadow-2xl overflow-hidden flex flex-col gap-2">
//         <div className="overflow-x-auto">
//           <table className="min-w-full divide-y divide-gray-200">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Date Taken
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Free Report
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Paid Report
//                 </th>
//               </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-200">
//               {data.map((test, index) => (
//                 <motion.tr
//                   key={test.testid}
//                   initial={{ opacity: 0, y: 20 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   transition={{ delay: index * 0.1 }}
//                   className="hover:bg-gray-50 transition-colors"
//                 >
//                   {/* Date Taken */}
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                     <div className="flex items-center">
//                       <Calendar className="w-4 h-4 mr-2" />
//                       {formatDate(test.testtaken)}
//                     </div>
//                   </td>

//                   {/* Free Report */}
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <button
//                       onClick={() => handleFreeReport(test)}
//                       className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-black hover:bg-gray-100 transition-colors"
//                     >
//                       <ExternalLink className="w-4 h-4 mr-2" />
//                       View
//                     </button>
//                   </td>

//                   {/* Paid Report */}
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     {test.ispaymentdone ? (
//                       <button
//                         onClick={() => handlePaidReport(test)}
//                         className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-green-600 hover:bg-green-700 transition-colors"
//                       >
//                         <Download className="w-4 h-4 mr-2" />
//                         Download
//                       </button>
//                     ) : (
//                       <button
//                         onClick={() => handlePaidReport(test)}
//                         disabled={paymentLoading === test.sessionid}
//                         className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm leading-4 font-medium rounded-md text-gray-500 bg-white/10 backdrop-blur-sm hover:bg-gray-50 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
//                         style={{
//                           background: 'rgba(255, 255, 255, 0.1)',
//                           backdropFilter: 'blur(4px)',
//                         }}
//                       >
//                         {paymentLoading === test.sessionid ? (
//                           <>
//                             <div className="w-4 h-4 mr-2 animate-spin border-2 border-gray-500 border-t-transparent rounded-full"></div>
//                             Processing...
//                           </>
//                         ) : (
//                           <>
//                             <Lock className="w-4 h-4 mr-2" />
//                             Unlock
//                           </>
//                         )}
//                       </button>
//                     )}
//                   </td>
//                 </motion.tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default QuestDashboard;

// ---------------------------------------------------

// QuestDashboard - Backend Email API Integration

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Lock, Download, Calendar, ExternalLink, FileText, AlertCircle } from 'lucide-react';
import { useAuth } from '../../../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { PaymentService, sessionStorageManager, sessionManager } from '@/services/payments';
import axios from 'axios';

interface DashboardApiResponse {
  status: number;
  data: DashboardTest[];
}

interface DashboardTest {
  userid: string;
  testid: string;
  sessionid: string;
  testtaken: string;
  ispaymentdone: boolean;
  pdflink: string;
}

interface QuestDashboardProps {
  className?: string;
}

interface EmailApiResponse {
  success: boolean;
  error?: string;
  message?: string;
}

// Configuration flag - set to true for mock data, false for API
const USE_MOCK_DATA = true;

// Mock data for testing
const MOCK_DATA: DashboardTest[] = [
  {
    userid: "9bba4c19-c22b-4c83-9b60-bfc81a2695fe",
    testid: "bae03e2a81ef518a232cd95800708b60bd1cfea9",
    sessionid: "session_1752577737404",
    testtaken: "2025-07-15T11:08:57.404Z",
    ispaymentdone: true,
    pdflink: "https://api.fraterny.in/api/report/session_1752577737404/9bba4c19-c22b-4c83-9b60-bfc81a2695fe/bae03e2a81ef518a232cd95800708b60bd1cfea9"
  },
  {
    userid: "9bba4c19-c22b-4c83-9b60-bfc81a2695fe", 
    testid: "34545jljerkldsjrw35-3454e",
    sessionid: "e4aef47f-2359-4f8b-93ea-efc5dfd49f2a",
    testtaken: "2025-07-11T12:24:58.654Z",
    ispaymentdone: false,
    pdflink: "https://api.fraterny.in/api/report/e4aef47f-2359-4f8b-93ea-efc5dfd49f2a/9bba4c19-c22b-4c83-9b60-bfc81a2695fe/34545jljerkldsjrw35-3454e"
  },
  {
    userid: "fedf723f-dcb0-4806-b84e-1590dfef4f76",
    testid: "bbadf5ce-2eb4-4f9c-8f96-9e4b9fd0e10a", 
    sessionid: "session_1752236698654",
    testtaken: "2025-07-11T12:24:58.654Z",
    ispaymentdone: true,
    pdflink: "https://api.fraterny.in/api/report/session_1752236698654/fedf723f-dcb0-4806-b84e-1590dfef4f76/bbadf5ce-2eb4-4f9c-8f96-9e4b9fd0e10a"
  },
  {
    userid: "9bba4c19-c22b-4c83-9b60-bfc81a2695fe",
    testid: "9d5602bd6a3f05b9e00900793e0d315d436f4ed7",
    sessionid: "session_1753961797982",
    testtaken: "2025-07-31T11:36:50.561Z",
    ispaymentdone: false,
    pdflink: "https://api.fraterny.in/api/report/session_1753961797982/9bba4c19-c22b-4c83-9b60-bfc81a2695fe/9d5602bd6a3f05b9e00900793e0d315d436f4ed7"
  },
  {
    userid: "9bba4c19-c22b-4c83-9b60-bfc81a2695fe",
    testid: "c8a27db647f5c8742b8d5d70aa9cedb3f00a7b09",
    sessionid: "session_1753962293131",
    testtaken: "2025-07-31T11:45:17.168Z",
    ispaymentdone: true,
    pdflink: "https://api.fraterny.in/api/report/session_1753962293131/9bba4c19-c22b-4c83-9b60-bfc81a2695fe/c8a27db647f5c8742b8d5d70aa9cedb3f00a7b09"
  }
];

const QuestDashboard: React.FC<QuestDashboardProps> = ({ className = '' }) => {
  const { user } = useAuth();
  const [data, setData] = useState<DashboardTest[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [paymentLoading, setPaymentLoading] = useState<string | null>(null);
  const [emailLoading, setEmailLoading] = useState<string | null>(null);
  const navigate = useNavigate();

  // Format date helper function
  const formatDate = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (err) {
      return dateString;
    }
  };

  // Helper function to refresh dashboard data
  const fetchUpdatedDashboardData = async (): Promise<DashboardTest[] | null> => {
    if (!user?.id) return null;
    
    try {
      if (USE_MOCK_DATA) {
        await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay
        return MOCK_DATA;
      } else {
        const response = await axios.get<DashboardApiResponse>(
          `https://api.fraterny.in/api/userdashboard/${user.id}`
        );
        return response.data.data;
      }
    } catch (error) {
      console.error('Failed to refresh dashboard data:', error);
      return null;
    }
  };

  // Send email via backend API
  const sendReportEmail = async (testData: DashboardTest): Promise<EmailApiResponse> => {
    try {
      const response = await axios.post<EmailApiResponse>(
        'https://api.fraterny.in/send-report-email', // Your backend endpoint
        {
          user_name: user?.user_metadata?.first_name || 'User',
          user_email: user?.email || 'one@gmail.com',
          test_date: formatDate(testData.testtaken),
          session_id: testData.sessionid,
          pdf_link: testData.pdflink,
          user_id: testData.userid,
          test_id: testData.testid
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
          timeout: 15000, // 15 second timeout for email sending
        }
      );
      console.log(`Email response from backend:`, response);
      return response.data;
    } catch (error: any) {
      console.error('Email API error:', error);
      
      if (error.code === 'ECONNABORTED') {
        return {
          success: false,
          error: 'Email sending timeout - please try again'
        };
      } else if (error.response?.status === 429) {
        return {
          success: false,
          error: 'Too many email requests - please wait a moment'
        };
      } else if (error.response?.status >= 500) {
        return {
          success: false,
          error: 'Server error - please try again later'
        };
      } else {
        return {
          success: false,
          error: error.response?.data?.error || 'Failed to send email'
        };
      }
    }
  };

  // SINGLE useEffect to fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);

        if (USE_MOCK_DATA) {
          // Mock data approach
          console.log('Using mock data for dashboard');
          await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
          setData(MOCK_DATA);
        } else {
          // Real API approach
          if (!user?.id) {
            setError('User not authenticated');
            return;
          }

          console.log('Fetching dashboard data from API for user:', user.id);
          const response = await axios.get<DashboardApiResponse>(
            `https://api.fraterny.in/api/userdashboard/${user.id}`,
            {
              headers: {
                'Content-Type': 'application/json',
              },
              timeout: 10000, // 10 second timeout
            }
          );

          setData(response.data.data);
        }
      } catch (err: any) {
        console.error('Dashboard data fetch error:', err);
        
        if (USE_MOCK_DATA) {
          setError('Failed to load mock data');
        } else {
          // Handle different types of API errors
          if (err.code === 'ECONNABORTED') {
            setError('Request timeout - please try again');
          } else if (err.response?.status === 404) {
            setError('No test data found');
          } else if (err.response?.status === 401) {
            setError('Unauthorized - please log in again');
          } else {
            setError('Failed to load dashboard data');
          }
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user?.id]); // Only depend on user.id

  // Handle payment result updates
  useEffect(() => {
    const handlePaymentResult = async () => {
      try {
        // Check for payment results from PaymentService
        const paymentResult = await PaymentService.handleAuthReturn();
        
        if (paymentResult) {
          if (paymentResult.success) {
            toast.success('Payment successful! Your report is now unlocked.');
            
            // Refresh dashboard data to get updated payment status
            if (user?.id) {
              const updatedData = await fetchUpdatedDashboardData();
              if (updatedData) {
                setData(updatedData);
              }
            }
            
          } else {
            toast.error('Payment failed. Please try again.');
          }
        }
      } catch (error) {
        console.error('Error handling payment result:', error);
      }
    };

    handlePaymentResult();
  }, [user?.id]);

  // Handle download actions
  const handleFreeReport = (testData: DashboardTest) => {
    navigate(`/quest-result/result/${testData.sessionid}/${testData.userid}/${testData.testid}`);
  };

  // Updated handlePaidReport function with backend email API
  const handlePaidReport = async (testData: DashboardTest) => {
    // If payment is already done, send email with PDF via backend API
    if (testData.ispaymentdone) {
      try {
        setEmailLoading(testData.sessionid);
        
        // Show immediate feedback
        toast.info('Sending your report email...', {
          duration: 2000
        });
        
        const emailResult = await sendReportEmail(testData);
        console.log('Email result:', emailResult);

        if (emailResult.success) {
          toast.success('Professional email sent successfully with your report link!', {
            duration: 5000
          });
        } else {
          toast.error(`Failed to send email: ${emailResult.error}`, {
            duration: 6000
          });
        }
      } catch (error) {
        console.error('Email sending error:', error);
        toast.error('Failed to send email. Please try again.');
      } finally {
        setEmailLoading(null);
      }
      return;
    }

    // User is authenticated (guaranteed in sidebar), proceed with payment
    try {
      setPaymentLoading(testData.sessionid);
      
      const paymentResult = await PaymentService.startPayment(
        testData.sessionid, 
        testData.testid
      );
      
      if (paymentResult.success) {
        toast.success('Payment successful!');
        // Refresh data to show updated payment status
        const updatedData = await fetchUpdatedDashboardData();
        if (updatedData) {
          setData(updatedData);
        }
      } else {
        toast.error(paymentResult.error || 'Payment failed');
      }
      
    } catch (error) {
      toast.error('Payment failed. Please try again.');
    } finally {
      setPaymentLoading(null);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className={`p-6 ${className}`}>
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className={`p-6 ${className}`}>
        <div className="text-center py-12">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Dashboard</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Empty state
  if (data.length === 0) {
    return (
      <div className={`p-6 ${className}`}>
        <div className="text-center py-12">
          <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Tests Found</h3>
          <p className="text-gray-600">You haven't taken any tests yet.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`p-6 ${className} bg-[#004A7F] text-white h-screen`}>
      <div className='flex flex-col items-center justify-center w-full mb-8'>
        <div className='text-3xl font-normal font-["Gilroy-Bold"]'>
          QUEST
        </div>
        <div className='text-sm font-normal font-["Gilroy-Regular"] tracking-[0.1rem] pl-0 mt-[-8px]'>
          BY FRATERNY
        </div>
      </div>
      
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-['Gilroy-Bold'] text-white mb-2">Test Dashboard</h1>
        <p className="font-['Gilroy-semiBold'] text-white">View and download your assessment reports</p>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-2xl overflow-hidden flex flex-col gap-2">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date Taken
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Free Report
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Paid Report
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.map((test, index) => (
                <motion.tr
                  key={test.testid}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="hover:bg-gray-50 transition-colors"
                >
                  {/* Date Taken */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-2" />
                      {formatDate(test.testtaken)}
                    </div>
                  </td>

                  {/* Free Report */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => handleFreeReport(test)}
                      className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-black hover:bg-gray-100 transition-colors"
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      View
                    </button>
                  </td>

                  {/* Paid Report */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    {test.ispaymentdone ? (
                      <button
                        onClick={() => handlePaidReport(test)}
                        disabled={emailLoading === test.sessionid}
                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-green-600 hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {emailLoading === test.sessionid ? (
                          <>
                            <div className="w-4 h-4 mr-2 animate-spin border-2 border-white border-t-transparent rounded-full"></div>
                            Sending...
                          </>
                        ) : (
                          <>
                            <Download className="w-4 h-4 mr-2" />
                            Email Report
                          </>
                        )}
                      </button>
                    ) : (
                      <button
                        onClick={() => handlePaidReport(test)}
                        disabled={paymentLoading === test.sessionid}
                        className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm leading-4 font-medium rounded-md text-gray-500 bg-white/10 backdrop-blur-sm hover:bg-gray-50 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                        style={{
                          background: 'rgba(255, 255, 255, 0.1)',
                          backdropFilter: 'blur(4px)',
                        }}
                      >
                        {paymentLoading === test.sessionid ? (
                          <>
                            <div className="w-4 h-4 mr-2 animate-spin border-2 border-gray-500 border-t-transparent rounded-full"></div>
                            Processing...
                          </>
                        ) : (
                          <>
                            <Lock className="w-4 h-4 mr-2" />
                            Unlock
                          </>
                        )}
                      </button>
                    )}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default QuestDashboard;