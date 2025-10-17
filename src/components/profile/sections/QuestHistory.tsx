import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Home, 
  FileText, 
  CreditCard, 
  Calendar,
  Download,
  Clock,
  Eye,
  Plus,
  Loader2,
  AlertTriangle,
  CheckCircle,
  Brain,
  User,
  Unlock,
  Edit
} from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';
import axios from 'axios';
import { toast } from 'sonner';
import { clusters, Archetype, Cluster } from '../../../../src/components/archeotype/archeotype'
import { PaymentService, sessionManager } from '@/services/payments';
import { googleAnalytics } from '../../../services/analytics/googleAnalytics'
import AssessmentList from '@/components/quest/views/AssessmentList';
import QuestAssessment from '@/components/quest/views/QuestAssessment';
import QuestAssessmentDashboard from './QuestAssessmentDashboard';
import QuestPaymentDashboard from './QuestPaymentDashboard';
import Button from 'node_modules/@mui/material/esm/Button/Button';
import { itemVariants } from '@/components/quest/views/questresultcards/utils/animations';
import { containerVariants } from '@/components/quest/utils/animationHelpers';

// Data types matching backend API
interface DashboardApiResponse {
  status: number;
  data: DashboardTest[];
}

interface DashboardTest {
  userid: string;
  testid: string;
  sessionid: string;
  testtaken: string;
  ispaymentdone: "success" | null;
  quest_pdf: string;
  quest_status: "generated" | "working";
}

interface QuestHistoryProps {
  className?: string;
}

export function QuestHistory({ className = '' }: QuestHistoryProps) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'home' | 'results' | 'payments'>('home');
  const [data, setData] = useState<DashboardTest[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [archetypeData, setArchetypeData] = useState<{ cluster: Cluster; archetype: Archetype } | null>(null);
    const [archetypeLoading, setArchetypeLoading] = useState(false);
     const [paymentLoading, setPaymentLoading] = useState<string | null>(null);

  const userId = user?.id;

  // Format date helper
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

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);

        if (!userId) {
          setError('User not authenticated');
          return;
        }

        //console.log('Fetching dashboard data from API for user:', userId);
        const response = await axios.get<DashboardApiResponse>(
          `${import.meta.env.VITE_BACKEND_URL}/api/userdashboard/${userId}`,
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );
        
        //console.log('Dashboard data response:', response.data);
        
        if (response.data.status === 200) {
          const assessmentData = response.data.data || [];
          // Sort assessments in descending order by date (latest first)
          const sortedData = assessmentData.sort((a: DashboardTest, b: DashboardTest) => {
            const dateA = new Date(a.testtaken).getTime();
            const dateB = new Date(b.testtaken).getTime();
            return dateB - dateA;
          });
          setData(sortedData);
        } else {
          setError('There is an error in fetching your data. Please visit us again in sometime.');
        }
      } catch (err: any) {
        console.error('Dashboard data fetch error:', err);

        if (err.code === 'ECONNABORTED') {
          setError('Request timeout - please try again');
        } else if (err.response?.status === 404) {
          setError('No test data found');
        } else if (err.response?.status === 401) {
          setError('Unauthorized - please log in again');
        } else {
          setError('Failed to load dashboard data');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [userId]);

  useEffect(() => {
    const fetchArchetypeData = async () => {
      const latestAssessment = getLatestAssessment();
      if (!latestAssessment) {
        setArchetypeLoading(false);
        return;
      }

      try {
        setArchetypeLoading(true);
        // Fetch the result data to get the archetype name
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/report/${latestAssessment.userid}/${latestAssessment.sessionid}/${latestAssessment.testid}`
        );

        let resultsData = response.data.results;
        if (typeof resultsData === 'string') {
          resultsData = JSON.parse(resultsData);
        }

        const archetypeName = resultsData?.['Mind Card']?.personality_type || resultsData?.['Mind Card']?.name;
        
        if (archetypeName) {
          // Find the archetype in clusters
          for (const cluster of clusters) {
            const foundArchetype = cluster.archetypes.find(
              arch => arch.name.toLowerCase() === archetypeName.toLowerCase()
            );
            if (foundArchetype) {
              setArchetypeData({ cluster, archetype: foundArchetype });
              break;
            }
          }
        }
      } catch (error) {
        console.error('Failed to fetch archetype data:', error);
      } finally {
        setArchetypeLoading(false);
      }
    };

    if (data.length > 0) {
      fetchArchetypeData();
    }
  }, [data]);

  // Get latest assessment
  const getLatestAssessment = () => {
    if (data && data.length > 0) {
      return data[0];
    }
    return null;
  };

  // Get user's first name
  const getUserName = () => {
    return user?.user_metadata?.first_name || user?.user_metadata?.name || 'User';
  };

  // Handle navigation actions
  const handleViewResults = (assessment: DashboardTest) => {
    if (assessment.ispaymentdone === "success" && assessment.quest_status === "generated") {
      navigate(`/quest/result/${assessment.userid}/${assessment.sessionid}/${assessment.testid}`);
    } else if (assessment.ispaymentdone === "success" && assessment.quest_status === "working") {
      toast.info('Your report is being generated. Please check back soon!');
    } else {
      toast.error('Payment required to view results');
    }
  };

  const handleDownloadPDF = (assessment: DashboardTest) => {
    if (assessment.quest_pdf) {
      window.open(assessment.quest_pdf, '_blank');
    } else {
      toast.error('PDF not available yet');
    }
  };

  const handleUnlockPotential = () => {
      const latestAssessment = getLatestAssessment();
      
      if (!latestAssessment) {
        // No assessments - go to quest page to start new assessment
        navigate('/quest');
        return;
      }
      
      if (latestAssessment.ispaymentdone === "success") {
        if (latestAssessment.quest_status === "generated") {
          // Payment done and PDF ready - download PDF directly
          try {
            const link = document.createElement('a');
            link.href = latestAssessment.quest_pdf;
            link.download = `Quest-Report-${formatDate(latestAssessment.testtaken)}.pdf`;
            link.target = '_blank';
            
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            toast.success('Downloading your PDF report!');
          } catch (error) {
            console.error('PDF download error:', error);
            window.open(latestAssessment.quest_pdf, '_blank');
            toast.success('Opening your PDF report!');
          }
          return;
        } else {
          // Payment done but PDF still generating - do nothing
          toast.info('Your PDF is still being generated. Please check back in 15 minutes.');
          return;
        }
      } else {
        // Payment not done - navigate to result page
        navigate(`/quest-result/result/${latestAssessment.userid}/${latestAssessment.sessionid}/${latestAssessment.testid}`);
        return;
      }
    };

    const fetchUpdatedDashboardData = async (): Promise<DashboardTest[] | null> => {
    if (!user?.id) return null;

    try {
      const response = await axios.get<DashboardApiResponse>(
        `${import.meta.env.VITE_BACKEND_URL}/api/userdashboard/${userId}`
      );
      return response.data.data;
    } catch (error) {
      console.error('Failed to refresh dashboard data:', error);
      return null;
    }
  };

  const handlePaidReport = async (testData: DashboardTest) => {
      if (testData.ispaymentdone === "success" && testData.quest_status === "generated") {
        try {
          const link = document.createElement('a');
          link.href = testData.quest_pdf;
          link.download = `Quest-Report-${formatDate(testData.testtaken)}.pdf`;
          link.target = '_blank';
  
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
  
          toast.success('Downloading your PDF report!');
        } catch (error) {
          console.error('PDF download error:', error);
          window.open(testData.quest_pdf, '_blank');
          toast.success('Opening your PDF report!');
        }
        return;
      }
  
      if (testData.ispaymentdone === "success" && testData.quest_status === "working") {
        toast.info('Your PDF is still being generated. Please check back in 15 minutes.');
        return;
      }
  
      if (testData.ispaymentdone !== "success") {
        try {
          setPaymentLoading(testData.sessionid);
          const paymentResult = await PaymentService.startPayment(
            testData.sessionid,
            testData.testid
          );
  
          googleAnalytics.trackPaymentInitiatedFromDashboard({
            session_id: testData.sessionid,
            test_id: testData.testid,
            user_state: user?.id ? 'logged_in' : 'anonymous',
            payment_amount: 95000,
            pricing_tier: 'early'
          });
  
          if (paymentResult.success) {
            toast.success('Payment successful!');
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
        return;
      }
  
      toast.error('Unable to process request. Please try again.');
    };

  // Loading state
  // if (loading) {
  //   return (
  //     <div className="flex items-center justify-center py-16">
  //       <div className="text-center">
  //         <Loader2 className="animate-spin h-12 w-12 text-cyan-600 mx-auto mb-4" />
  //         <p className="text-gray-600 font-medium">Loading your quest history...</p>
  //       </div>
  //     </div>
  //   );
  // }

  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-gray-600 font-medium">{error}</p>
        </div>
      </div>
    );
  }

  // Tab content rendering
  const renderTabContent = () => {
    switch (activeTab) {
      case 'home':
        return renderHomeTab();
      // case 'results':
      //   return renderResultsTab();
      // case 'payments':
      //   return renderPaymentsTab();
      default:
        return null;
    }
  };

  // Home Tab
  const renderHomeTab = () => {
    const latestAssessment = getLatestAssessment();

    return (
      // <div className="space-y-6">
      //   {/* Welcome Section */}
      //   <div className="bg-gradient-to-br from-cyan-600 to-blue-800 text-white p-6 rounded-lg">
      //     <h2 className="text-2xl font-bold mb-2">Hello, {getUserName()}!</h2>
      //     <p className="text-sm opacity-90">Explore your journey of self-discovery</p>
      //   </div>

      //   {/* Quick Stats */}
      //   <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      //     <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
      //       <div className="flex items-center space-x-3">
      //         <FileText className="w-8 h-8 text-cyan-600" />
      //         <div>
      //           <p className="text-2xl font-bold text-gray-900">{data.length}</p>
      //           <p className="text-sm text-gray-600">Total Assessments</p>
      //         </div>
      //       </div>
      //     </div>

      //     <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
      //       <div className="flex items-center space-x-3">
      //         <CheckCircle className="w-8 h-8 text-green-600" />
      //         <div>
      //           <p className="text-2xl font-bold text-gray-900">
      //             {data.filter(d => d.ispaymentdone === "success").length}
      //           </p>
      //           <p className="text-sm text-gray-600">Completed</p>
      //         </div>
      //       </div>
      //     </div>

      //     <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
      //       <div className="flex items-center space-x-3">
      //         <Download className="w-8 h-8 text-blue-600" />
      //         <div>
      //           <p className="text-2xl font-bold text-gray-900">
      //             {data.filter(d => d.quest_status === "generated").length}
      //           </p>
      //           <p className="text-sm text-gray-600">PDFs Ready</p>
      //         </div>
      //       </div>
      //     </div>
      //   </div>

      //   {/* Latest Assessment Card */}
      //   {latestAssessment && (
      //     <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      //       <h3 className="text-lg font-bold text-gray-900 mb-4">Latest Assessment</h3>
      //       <div className="space-y-3">
      //         <div className="flex items-center justify-between">
      //           <span className="text-sm text-gray-600">Date Taken:</span>
      //           <span className="text-sm font-medium text-gray-900">
      //             {formatDate(latestAssessment.testtaken)}
      //           </span>
      //         </div>
      //         <div className="flex items-center justify-between">
      //           <span className="text-sm text-gray-600">Status:</span>
      //           <span className={`text-sm font-medium ${
      //             latestAssessment.ispaymentdone === "success" 
      //               ? 'text-green-600' 
      //               : 'text-orange-600'
      //           }`}>
      //             {latestAssessment.ispaymentdone === "success" ? 'Paid' : 'Pending Payment'}
      //           </span>
      //         </div>
      //         <div className="flex items-center justify-between">
      //           <span className="text-sm text-gray-600">Report:</span>
      //           <span className={`text-sm font-medium ${
      //             latestAssessment.quest_status === "generated" 
      //               ? 'text-green-600' 
      //               : 'text-orange-600'
      //           }`}>
      //             {latestAssessment.quest_status === "generated" ? 'Ready' : 'Processing'}
      //           </span>
      //         </div>
      //         <button
      //           onClick={() => handleViewResults(latestAssessment)}
      //           className="w-full mt-4 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-all"
      //         >
      //           View Results
      //         </button>
      //       </div>
      //     </div>
      //   )}
      // </div>
      <>
      <section className="mb-6">
        <header className="bg-gradient-to-br from-cyan-600 to-blue-800 mb-6 rounded-xl shadow-sm sticky top-0 z-10">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex justify-center items-center">
              <h1 className="text-xl md:text-2xl lg:text-3xl text-center font-['Gilroy-semiBold'] text-white tracking-tighter">Personality</h1>
              <div className="w-6"></div>
            </div>
          </div>
        </header>
          {archetypeLoading ? (
            <div className="flex items-center justify-center py-16">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600 font-['Gilroy-bold']">Loading your insights...</p>
              </div>
            </div>
          ) : archetypeData ? (
            <div className="relative">
              {/* Horizontal Scrollable Main Cards - Modified to show only first card */}
              <div 
                // ref={contextCardsRef} // Commented out as slider is disabled
                className="flex overflow-hidden snap-x snap-mandatory gap-4 pb-2"
                style={{ scrollSnapType: 'x mandatory' }}
              >
                {/* Card 1: SELF - Fully Visible */}
                <div className="flex-shrink-0 w-full snap-center h-[600px]">
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="bg-gradient-to-br from-white to-blue-50 rounded-3xl overflow-hidden border border-blue-100 h-full flex flex-col"
                  >
                    {/* Image Section */}
                    <div className="relative h-56 overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/20 z-10"></div>
                      <motion.img 
                        src={archetypeData.cluster.img} 
                        alt={archetypeData.cluster.name}
                        className="w-full h-full object-cover transform scale-105"
                        initial={{ scale: 1.1 }}
                        animate={{ scale: 1.05 }}
                        transition={{ duration: 0.6 }}
                      />
                      {/* Tag - Moved "How You See Yourself" here */}
                      <div className="absolute top-4 right-4 z-20">
                        <motion.div 
                          initial={{ x: 20, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: 0.3 }}
                          className="inline-flex items-center gap-2.5 px-4 py-2 bg-gradient-to-br from-cyan-600 to-blue-800 rounded-full shadow-lg"
                        >
                          <User className="w-4 h-4 text-white" />
                          <span className="text-[11px] font-['Gilroy-Bold'] text-white uppercase tracking-[0.08em] leading-none">How You See Yourself</span>
                        </motion.div>
                      </div>
                      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-600"></div>
                    </div>
                    
                    {/* Content Section - Moved cluster name here */}
                    <div className="px-6 pt-5 pb-7 relative flex-1 flex flex-col">
                      <div>
                        {/* Cluster name badge - moved from top right */}
                        <motion.div
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.1 }}
                          className="inline-flex items-center gap-2.5 mb-2 px-5 py-2.5 bg-gradient-to-br from-cyan-600 to-blue-800 text-white font-['Gilroy-Bold'] text-xs rounded-full uppercase tracking-wider shadow-lg backdrop-blur-sm border border-white/20"
                        >
                          {archetypeData.cluster.name}
                        </motion.div>
                        
                        <motion.h2 
                          initial={{ y: 10, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: 0.2 }}
                          className="text-[28px] font-['Gilroy-Bold'] text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-blue-900 mb-4 leading-tight tracking-tight"
                        >
                          {archetypeData.archetype.name}
                        </motion.h2>
                      </div>
                      
                      <motion.div 
                        initial={{ y: 10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="text-gray-600 font-['Gilroy-Regular'] text-base leading-[1.7] tracking-wide"
                      >
                        {archetypeData.archetype.contexts.self}
                      </motion.div>
                      
                      <div className="flex items-center gap-3 mt-6 pt-5 border-t border-blue-100">
                        <div className="flex-1 h-[2px] bg-gradient-to-r from-blue-300 to-transparent rounded-full"></div>
                        <Brain className="w-5 h-5 text-blue-500 flex-shrink-0" />
                        <div className="flex-1 h-[2px] bg-gradient-to-l from-blue-300 to-transparent rounded-full"></div>
                      </div>
                    </div>
                  </motion.div>
                </div>

                {/* Card 2: WORLD */}
                <div className="flex-shrink-0 w-full snap-center h-[600px]">
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="bg-gradient-to-br from-white to-purple-50 rounded-3xl overflow-hidden border border-purple-100 relative h-full flex flex-col"
                  >
                    {/* Image Section */}
                    <div className="relative h-56 overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/20 z-10"></div>
                      <img 
                        src={archetypeData.cluster.img} 
                        alt={archetypeData.cluster.name}
                        className="w-full h-full object-cover"
                      />
                      {/* Tag */}
                      <div className="absolute top-4 right-4 z-20">
                        <div className="bg-gradient-to-r from-[#003366] to-[#004A7F] text-white px-5 py-2.5 font-['Gilroy-Bold'] text-xs rounded-full uppercase tracking-wider shadow-lg backdrop-blur-sm border border-white/20">
                          {archetypeData.cluster.name}
                        </div>
                      </div>
                      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-fuchsia-600"></div>
                    </div>
                    
                    {/* Content Section */}
                    <div className="px-6 pt-5 pb-7 relative flex-1 flex flex-col">
                      {/* Badge and Heading */}
                      <div className="relative z-30">
                        <div className="inline-flex items-center gap-2.5 mb-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full shadow-lg">
                          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 104 0 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className="text-[11px] font-['Gilroy-Bold'] text-white uppercase tracking-[0.08em] leading-none">How World Sees You</span>
                        </div>
                        
                        <h2 className="text-[28px] font-['Gilroy-Bold'] text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-purple-900 mb-4 leading-tight tracking-tight">
                          {archetypeData.archetype.name}
                        </h2>
                      </div>
                      
                      {/* Content - Conditional Blur */}
                      <div className="text-gray-600 font-['Gilroy-Regular'] text-base leading-[1.7] tracking-wide flex-1" style={{ filter: getLatestAssessment()?.ispaymentdone === 'success' ? 'none' : 'blur(8px)' }}>
                        {archetypeData.archetype.contexts.world}
                      </div>
                      
                      {/* Conditional Button/Overlay */}
                      {getLatestAssessment()?.ispaymentdone === 'success' ? (
                        /* PDF Button Below Content */
                        <div className="mt-4 pt-4 border-t border-purple-100">
                          <button
                            onClick={() => handlePaidReport(getLatestAssessment()!)}
                            disabled={getLatestAssessment()?.quest_status === 'working'}
                            className={`w-full px-6 py-3 bg-gradient-to-r ${
                              getLatestAssessment()?.quest_status === 'generated' 
                                ? 'from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600' 
                                : 'from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600'
                            } text-white text-base font-['Gilroy-Bold'] rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100`}
                          >
                            {getLatestAssessment()?.quest_status === 'generated' ? (
                              <>
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                <span>Download PDF Report</span>
                              </>
                            ) : (
                              <>
                                <Clock className="w-5 h-5" />
                                <span>PDF Processing...</span>
                              </>
                            )}
                          </button>
                        </div>
                      ) : (
                        /* Unlock Overlay */
                        <div className="absolute inset-x-0 bottom-0 top-32 flex items-center justify-center bg-white/5 backdrop-blur-[2px]">
                          <button
                            onClick={handleUnlockPotential}
                            className="px-6 py-3 bg-gradient-to-br from-cyan-600 to-blue-800 hover:from-cyan-600 hover:to-blue-800 text-white text-base font-['Gilroy-Bold'] rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg flex items-center justify-center gap-2"
                          >
                            <Unlock className="w-5 h-5" />
                            <span>Get Complete Analysis</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </motion.div>
                </div>

                {/* Card 3: ASPIRE */}
                <div className="flex-shrink-0 w-full snap-center h-[600px]">
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="bg-gradient-to-br from-white to-green-50 rounded-3xl overflow-hidden border border-green-100 relative h-full flex flex-col"
                  >
                    {/* Image Section */}
                    <div className="relative h-56 overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/20 z-10"></div>
                      <img 
                        src={archetypeData.cluster.img} 
                        alt={archetypeData.cluster.name}
                        className="w-full h-full object-cover"
                      />
                      {/* Tag */}
                      <div className="absolute top-4 right-4 z-20">
                        <div className="bg-gradient-to-r from-[#003366] to-[#004A7F] text-white px-5 py-2.5 font-['Gilroy-Bold'] text-xs rounded-full uppercase tracking-wider shadow-lg backdrop-blur-sm border border-white/20">
                          {archetypeData.cluster.name}
                        </div>
                      </div>
                      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-600"></div>
                    </div>
                    
                    {/* Content Section */}
                    <div className="px-6 pt-5 pb-7 relative flex-1 flex flex-col">
                      {/* Badge and Heading */}
                      <div className="relative z-30">
                        <div className="inline-flex items-center gap-2.5 mb-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full shadow-lg">
                          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                          </svg>
                          <span className="text-[11px] font-['Gilroy-Bold'] text-white uppercase tracking-[0.08em] leading-none">What You Aspire To Be</span>
                        </div>
                        
                        <h2 className="text-[28px] font-['Gilroy-Bold'] text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-green-900 mb-4 leading-tight tracking-tight">
                          {archetypeData.archetype.name}
                        </h2>
                      </div>
                      
                      {/* Content - Conditional Blur */}
                      <div className="text-gray-600 font-['Gilroy-Regular'] text-base leading-[1.7] tracking-wide flex-1" style={{ filter: getLatestAssessment()?.ispaymentdone === 'success' ? 'none' : 'blur(8px)' }}>
                        {archetypeData.archetype.contexts.aspire}
                      </div>
                      
                      {/* Conditional Button/Overlay */}
                      {getLatestAssessment()?.ispaymentdone === 'success' ? (
                        /* PDF Button Below Content */
                        <div className="mt-4 pt-4 border-t border-green-100">
                          <button
                            onClick={() => handlePaidReport(getLatestAssessment()!)}
                            disabled={getLatestAssessment()?.quest_status === 'working'}
                            className={`w-full px-6 py-3 bg-gradient-to-r ${
                              getLatestAssessment()?.quest_status === 'generated' 
                                ? 'from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600' 
                                : 'from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600'
                            } text-white text-base font-['Gilroy-Bold'] rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100`}
                          >
                            {getLatestAssessment()?.quest_status === 'generated' ? (
                              <>
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                <span>Download PDF Report</span>
                              </>
                            ) : (
                              <>
                                <Clock className="w-5 h-5" />
                                <span>PDF Processing...</span>
                              </>
                            )}
                          </button>
                        </div>
                      ) : (
                        /* Unlock Overlay */
                        <div className="absolute inset-x-0 bottom-0 top-32 flex items-center justify-center bg-white/5 backdrop-blur-[2px]">
                          <button
                            onClick={handleUnlockPotential}
                            className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white text-base font-['Gilroy-Bold'] rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg flex items-center justify-center gap-2"
                          >
                            <Unlock className="w-5 h-5" />
                            <span>Get Complete Analysis</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </motion.div>
                </div>
              </div>

              {/* Scroll Indicators - Commented out as slider is disabled */}
              {/* <div className="flex justify-center gap-2 mt-4">
                {[0, 1, 2].map((index) => (
                  <button
                    key={index}
                    onClick={() => {
                      console.log('Indicator clicked:', index);
                      // if (contextCardsRef.current) { // Commented out as slider is disabled
                      //   const cardWidth = contextCardsRef.current.offsetWidth; // Commented out as slider is disabled
                      //   contextCardsRef.current.scrollTo({ // Commented out as slider is disabled
                      //     left: cardWidth * index, // Commented out as slider is disabled
                      //     behavior: 'smooth' // Commented out as slider is disabled
                      //   }); // Commented out as slider is disabled
                      // } // Commented out as slider is disabled
                    }}
                    className={`h-2 rounded-full transition-all duration-300 hover:opacity-80 ${
                      'w-2 bg-gray-300 hover:bg-gray-400' // Default style as slider is disabled
                    }`}
                    aria-label={`Go to card ${index + 1}`}
                  />
                ))}
              </div> */}
            </div>
          ) : (
            // Fallback when no archetype data
            <div className="bg-white rounded-xl shadow-md p-6 text-center">
              <Brain className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 font-['Gilroy-Regular'] mb-4">
                Complete an assessment to discover your archetype
              </p>
              <button
                onClick={() => navigate('/quest')}
                className="px-6 py-3 bg-gradient-to-br from-cyan-600 to-blue-800 hover:from-cyan-600 hover:to-blue-800 text-white font-['Gilroy-Bold'] rounded-lg transition-all duration-200 transform hover:scale-105"
              >
                Start Quest
              </button>
            </div>
          )}
        </section>


      <section className="mb-6">
        <QuestAssessmentDashboard />
        <QuestPaymentDashboard />
      </section>
      </>
    );
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  // Results Tab
  // const renderResultsTab = () => {
  //   if (data.length === 0) {
  //     return (
  //       <div className="text-center py-16">
  //         <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
  //         <p className="text-gray-600 mb-4">No assessments found</p>
  //         <button
  //           onClick={() => navigate('/assessment')}
  //           className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white px-6 py-2 rounded-lg font-medium"
  //         >
  //           <Plus className="w-4 h-4 inline mr-2" />
  //           Start New Assessment
  //         </button>
  //       </div>
  //     );
  //   }

  //   return (
  //     <div className="space-y-4">
  //       {data.map((assessment, index) => (
  //         <motion.div
  //           key={assessment.sessionid}
  //           initial={{ opacity: 0, y: 20 }}
  //           animate={{ opacity: 1, y: 0 }}
  //           transition={{ delay: index * 0.1 }}
  //           className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
  //         >
  //           <div className="flex items-start justify-between">
  //             <div className="flex-1">
  //               <div className="flex items-center space-x-3 mb-3">
  //                 <Calendar className="w-5 h-5 text-gray-400" />
  //                 <span className="text-lg font-semibold text-gray-900">
  //                   Assessment {data.length - index}
  //                 </span>
  //               </div>
                
  //               <div className="space-y-2 text-sm text-gray-600">
  //                 <div className="flex items-center space-x-2">
  //                   <Clock className="w-4 h-4" />
  //                   <span>{formatDate(assessment.testtaken)}</span>
  //                 </div>
                  
  //                 <div className="flex items-center space-x-4">
  //                   <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
  //                     assessment.ispaymentdone === "success"
  //                       ? 'bg-green-100 text-green-800'
  //                       : 'bg-orange-100 text-orange-800'
  //                   }`}>
  //                     {assessment.ispaymentdone === "success" ? 'Paid' : 'Unlock Your Report'}
  //                   </span>
                    
  //                   <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
  //                     assessment.quest_status === "generated"
  //                       ? 'bg-blue-100 text-blue-800'
  //                       : 'bg-yellow-100 text-yellow-800'
  //                   }`}>
  //                     {assessment.quest_status === "generated" ? 'Report Ready' : 'Processing'}
  //                   </span>
  //                 </div>
  //               </div>
  //             </div>

  //             <div className="flex flex-col space-y-2">
  //               <button
  //                 onClick={() => handleViewResults(assessment)}
  //                 className="flex items-center space-x-2 bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
  //               >
  //                 <Eye className="w-4 h-4" />
  //                 <span>View</span>
  //               </button>
                
  //               {assessment.quest_pdf && assessment.quest_status === "generated" && (
  //                 <button
  //                   onClick={() => handleDownloadPDF(assessment)}
  //                   className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
  //                 >
  //                   <Download className="w-4 h-4" />
  //                   <span>PDF</span>
  //                 </button>
  //               )}
  //             </div>
  //           </div>
  //         </motion.div>
  //       ))}
  //     </div>
  //   );
  // };

  // // Payments Tab
  // const renderPaymentsTab = () => {
  //   const paidAssessments = data.filter(d => d.ispaymentdone === "success");

  //   if (paidAssessments.length === 0) {
  //     return (
  //       <div className="text-center py-16">
  //         <CreditCard className="w-16 h-16 text-gray-300 mx-auto mb-4" />
  //         <p className="text-gray-600">No payment history found</p>
  //       </div>
  //     );
  //   }

  //   return (
  //     <div className="space-y-4">
  //       <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
  //         <h3 className="text-lg font-bold text-gray-900 mb-2">Payment Summary</h3>
  //         <div className="flex items-center justify-between">
  //           <span className="text-gray-600">Total Payments:</span>
  //           <span className="text-2xl font-bold text-green-600">{paidAssessments.length}</span>
  //         </div>
  //       </div>

  //       {paidAssessments.map((assessment, index) => (
  //         <motion.div
  //           key={assessment.sessionid}
  //           initial={{ opacity: 0, y: 20 }}
  //           animate={{ opacity: 1, y: 0 }}
  //           transition={{ delay: index * 0.1 }}
  //           className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
  //         >
  //           <div className="flex items-center justify-between">
  //             <div className="flex-1">
  //               <div className="flex items-center space-x-3 mb-2">
  //                 <CheckCircle className="w-5 h-5 text-green-600" />
  //                 <span className="font-semibold text-gray-900">
  //                   Payment Successful
  //                 </span>
  //               </div>
  //               <div className="text-sm text-gray-600 space-y-1">
  //                 <p>Date: {formatDate(assessment.testtaken)}</p>
  //                 <p>Test ID: {assessment.testid}</p>
  //               </div>
  //             </div>
  //             <div className="text-right">
  //               <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
  //                 Completed
  //               </span>
  //             </div>
  //           </div>
  //         </motion.div>
  //       ))}
  //     </div>
  //   );
  // };

  return (
    // <div className={`min-h-screen bg-gray-50 ${className}`}>
    //   {/* Tab Navigation */}
    //   {/* <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
    //     <div className="max-w-6xl mx-auto px-6">
    //       <div className="flex space-x-8">
    //         <button
    //           onClick={() => setActiveTab('home')}
    //           className={`flex items-center space-x-2 px-4 py-4 border-b-2 transition-colors ${
    //             activeTab === 'home'
    //               ? 'border-cyan-600 text-cyan-600'
    //               : 'border-transparent text-gray-600 hover:text-gray-900'
    //           }`}
    //         >
    //           <Home className="w-5 h-5" />
    //           <span className="font-medium">Home</span>
    //         </button>

    //         <button
    //           onClick={() => setActiveTab('results')}
    //           className={`flex items-center space-x-2 px-4 py-4 border-b-2 transition-colors ${
    //             activeTab === 'results'
    //               ? 'border-cyan-600 text-cyan-600'
    //               : 'border-transparent text-gray-600 hover:text-gray-900'
    //           }`}
    //         >
    //           <FileText className="w-5 h-5" />
    //           <span className="font-medium">Results</span>
    //         </button>

    //         <button
    //           onClick={() => setActiveTab('payments')}
    //           className={`flex items-center space-x-2 px-4 py-4 border-b-2 transition-colors ${
    //             activeTab === 'payments'
    //               ? 'border-cyan-600 text-cyan-600'
    //               : 'border-transparent text-gray-600 hover:text-gray-900'
    //           }`}
    //         >
    //           <CreditCard className="w-5 h-5" />
    //           <span className="font-medium">Payments</span>
    //         </button>
    //       </div>
    //     </div>
    //   </div> */}

    //   {/* Content Area */}
    //   <div className="max-w-6xl mx-auto px-6 py-8">
    //     <div className="flex justify-between items-start">
    //       <motion.div variants={itemVariants} className="flex-1">
    //         <h2 className="text-2xl md:text-3xl font-playfair font-semibold mb-2">
    //           Account Information
    //         </h2>
    //         <p className="text-sm md:text-base text-white/80">
    //           Your personal details and account status
    //         </p>
    //       </motion.div>
    //     </div>
    //     <AnimatePresence mode="wait">
    //       <motion.div
    //         key={activeTab}
    //         initial={{ opacity: 0, y: 20 }}
    //         animate={{ opacity: 1, y: 0 }}
    //         exit={{ opacity: 0, y: -20 }}
    //         transition={{ duration: 0.3 }}
    //       >
    //         {renderTabContent()}
    //       </motion.div>
    //     </AnimatePresence>
    //   </div>
    // </div>

    <motion.div
      initial="hidden"
      animate="visible"
      className={`bg-white dark:bg-slate-900 rounded-xl border border-slate-200/50 dark:border-slate-700/50 shadow-sm overflow-hidden ${className}`}
    >
      {/* Header Section */}
      <div className="bg-gradient-to-br from-cyan-600 to-blue-800 p-6 md:p-8 text-white">
        <div className="flex justify-between items-start">
          <motion.div variants={itemVariants} className="flex-1">
            <h2 className="dashboard-card-header">
              Your Quest History
            </h2>
            <p className="dashboard-card-subheader">
              A record of your completed and ongoing quests
            </p>
          </motion.div>
          
          
        </div>
      </div>
      
      
      {/* Main Content */}
      <motion.div variants={itemVariants} className="px-6 md:px-8 pt-6 pb-8">
        {renderHomeTab()}  
      </motion.div>
    
    </motion.div>
  );
}

export default QuestHistory;