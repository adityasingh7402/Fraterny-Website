import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Filter, 
  MoreVertical, 
  Home, 
  FileText, 
  CreditCard,
  Calendar,
  BarChart3,
  Brain,
  Briefcase,
  Lock,
  Download,
  Clock,
  Eye,
  MessageCircle
} from 'lucide-react';
import { QuestLoading } from './QuestLoading';
import { useAuth } from '../../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { PaymentService } from '@/services/payments';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { googleAnalytics } from '../../../services/analytics/googleAnalytics';

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

interface AssessmentListProps {
  className?: string;
}


// Assessment types with their corresponding icons and colors
const getAssessmentType = (index: number) => {
  const types = [
    { 
      name: "Personality Assessment", 
      icon: FileText, 
      bgColor: "bg-blue-100", 
      iconColor: "text-blue-500" 
    },
    { 
      name: "Cognitive Ability Test", 
      icon: BarChart3, 
      bgColor: "bg-green-100", 
      iconColor: "text-green-500" 
    },
    { 
      name: "Emotional Intelligence Quiz", 
      icon: Brain, 
      bgColor: "bg-purple-100", 
      iconColor: "text-purple-500" 
    },
    { 
      name: "Career Aptitude Test", 
      icon: Briefcase, 
      bgColor: "bg-orange-100", 
      iconColor: "text-orange-500" 
    }
  ];
  
  return types[index % types.length];
};

const AssessmentList: React.FC<AssessmentListProps> = ({ className = '' }) => {
  const { user } = useAuth();
  const [data, setData] = useState<DashboardTest[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [paymentLoading, setPaymentLoading] = useState<string | null>(null);
  const [navigationLoading, setNavigationLoading] = useState(false);
  const navigate = useNavigate();
  const { userId } = useParams();

  // Format date helper function
  const formatDate = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch (err) {
      return dateString;
    }
  };

  // Format date as assessment name
  const formatAssessmentName = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch (err) {
      return 'Assessment';
    }
  };

  // Helper function to refresh dashboard data
  const fetchUpdatedAssessmentData = async (): Promise<DashboardTest[] | null> => {
    if (!user?.id) return null;
    
    try {
      const response = await axios.get<DashboardApiResponse>(
        `https://api.fraterny.in/api/userdashboard/${userId}`
      );
      return response.data.data;
    } catch (error) {
      console.error('Failed to refresh assessment data:', error);
      return null;
    }
  };

  // Fetch assessment data
  useEffect(() => {
    const fetchAssessmentData = async () => {
      try {
        setLoading(true);
        setError(null);

        if (!userId) {
          setError('User not authenticated');
          return;
        }

        console.log('Fetching assessment data from API for user:', userId);
        const response = await axios.get<DashboardApiResponse>(
          `https://api.fraterny.in/api/userdashboard/${userId}`,
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );
        console.log('Assessment data response:', response.data);
        if (response.data.status === 200) {
          setData(response.data.data || []);
        } else {
          setError('There is an error in fetching your data. Please visit us again in sometime.');
        }
      } catch (err: any) {
        console.error('Assessment data fetch error:', err);
        
        if (err.code === 'ECONNABORTED') {
          setError('Request timeout - please try again');
        } else if (err.response?.status === 404) {
          setError('No assessment data found');
        } else if (err.response?.status === 401) {
          setError('Unauthorized - please log in again');
        } else {
          setError('Failed to load assessment data');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchAssessmentData();
  }, [userId]);

  // Handle menu actions
  const handleView = (testData: DashboardTest) => {
    setOpenMenuId(null);
    navigate(`/quest-result/result/${testData.userid}/${testData.sessionid}/${testData.testid}`);
  };

  const handleFeedback = (testData: DashboardTest) => {
    setOpenMenuId(null);
    navigate(`/quest-result/result/${testData.userid}/${testData.sessionid}/${testData.testid}`);
  };

  const handleDelete = (testData: DashboardTest) => {
    setOpenMenuId(null);
    toast.info('Delete functionality will be implemented soon.');
  };

  const handleAssessmentClick = (testData: DashboardTest) => {
    navigate(`/quest-result/result/${testData.userid}/${testData.sessionid}/${testData.testid}`);
  };

  // Handle payment and PDF actions
  const handlePaidReport = async (testData: DashboardTest) => {
    // If payment is done and PDF is ready, download directly
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

    // If payment is done but PDF still generating, show appropriate message
    if (testData.ispaymentdone === "success" && testData.quest_status === "working") {
      toast.info('Your PDF is still being generated. Please check back in 15 minutes.');
      return;
    }

    // If payment not done, proceed with payment flow
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
          const updatedData = await fetchUpdatedAssessmentData();
          // Track Google Ads conversion for dashboard payments
          const urlParams = new URLSearchParams(window.location.search);
          const gclid = urlParams.get('gclid') || sessionStorage.getItem('gclid') || localStorage.getItem('gclid');

          if (gclid) {
            googleAnalytics.trackGoogleAdsConversion({
              session_id: testData.sessionid,
              payment_id: 'dashboard_payment',
              amount: 950, // use dynamic pricing here
              currency: 'INR'
            });

          // Track Reddit conversion for dashboard payments
            if (googleAnalytics.isRedditTraffic()) {
              googleAnalytics.trackRedditConversion({
                session_id: testData.sessionid,
                payment_id: 'dashboard_payment',
                amount: 950,
                currency: 'INR'
              });
            }
          }
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

  // Navigation loading state
  if (navigationLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gray-200 border-t-blue-400 rounded-full animate-spin mx-auto mb-6"></div>
          <p className="text-lg text-gray-700 font-['Gilroy-Bold']">Loading payment history...</p>
          <div className="flex justify-center gap-1 mt-4">
            <div className="w-2 h-2 bg-blue-600 rounded-full" style={{animation: 'pulse 0.5s infinite alternate', animationDelay: '0s'}}></div>
            <div className="w-2 h-2 bg-blue-600 rounded-full" style={{animation: 'pulse 0.5s infinite alternate', animationDelay: '0.2s'}}></div>
            <div className="w-2 h-2 bg-blue-600 rounded-full" style={{animation: 'pulse 0.5s infinite alternate', animationDelay: '0.4s'}}></div>
          </div>
        </div>
      </div>
    );
  }

  // Data loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gray-200 border-t-blue-400 rounded-full animate-spin mx-auto mb-6"></div>
          <p className="text-lg text-gray-700 font-['Gilroy-Bold']">Loading previous assessments...</p>
          <div className="flex justify-center gap-1 mt-4">
            <div className="w-2 h-2 bg-blue-600 rounded-full" style={{animation: 'pulse 0.5s infinite alternate', animationDelay: '0s'}}></div>
            <div className="w-2 h-2 bg-blue-600 rounded-full" style={{animation: 'pulse 0.5s infinite alternate', animationDelay: '0.2s'}}></div>
            <div className="w-2 h-2 bg-blue-600 rounded-full" style={{animation: 'pulse 0.5s infinite alternate', animationDelay: '0.4s'}}></div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 font-['Gilroy-Regular']">
        <header className="bg-white p-4 shadow-sm sticky top-0 z-10">
          <div className="flex justify-between items-center">
            <button onClick={() => navigate(`/quest-dashboard/${userId}`)} className="text-gray-600">
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h1 className="text-xl font-['Gilroy-semiBold'] text-gray-800">Assessment</h1>
            <div className="w-6"></div>
          </div>
        </header>
        
        <main className="p-4">
          <div className="text-center py-16">
            <div className="w-12 h-12 text-red-500 mx-auto mb-4">⚠️</div>
            <h3 className="text-lg font-['Gilroy-semiBold'] text-gray-900 mb-2">Error Loading Assessments</h3>
            <p className="text-gray-600 font-['Gilroy-Regular'] mb-4">{error}</p>
            <button
              onClick={() => navigate('/quest')}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-['Gilroy-semiBold']"
            >
              Back to Quest
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-gray-50 font-['Gilroy-Regular']">
      {/* Header */}
      <header className="bg-white p-4 shadow-sm sticky top-0 z-10">
        <div className="flex justify-between items-center">
          <button 
            onClick={() => navigate(`/quest-dashboard/${userId}`)} 
            className="text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-['Gilroy-semiBold'] text-gray-800">Assessment</h1>
          <div className="w-6"></div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-4 pb-24">
        {data.length === 0 ? (
          // Empty state
          <div className="text-center py-16">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-['Gilroy-semiBold'] text-gray-900 mb-2">No Assessments Found</h3>
            <p className="text-gray-600 font-['Gilroy-Regular'] mb-6">You haven't completed any assessments yet.</p>
            <button
              onClick={() => navigate('/assessment')}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-['Gilroy-semiBold']"
            >
              Take Your First Assessment
            </button>
          </div>
        ) : (
          // Assessment list
          <div className="space-y-4">
            {data.map((assessment, index) => {
              const assessmentType = getAssessmentType(index);
              const IconComponent = assessmentType.icon;
              
              return (
                <motion.div
                  key={assessment.testid}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => handleAssessmentClick(assessment)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center flex-1">
                      <div className={`${assessmentType.bgColor} p-3 rounded-lg mr-4`}>
                        <IconComponent className={`w-6 h-6 ${assessmentType.iconColor}`} />
                      </div>
                      <div className="flex-1">
                        <h2 className="font-['Gilroy-semiBold'] text-gray-800">{formatAssessmentName(assessment.testtaken)}</h2>
                        <p className="text-sm font-['Gilroy-Regular'] text-gray-500">
                          Completed on {formatDate(assessment.testtaken)}
                        </p>
                        
                        {/* Payment/PDF Status */}
                        <div className="mt-2">
                          {assessment.ispaymentdone !== "success" ? (
                            // State 1: Payment not done - show unlock button
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                googleAnalytics.trackPdfUnlockCTAFromDashboard({
                                  session_id: assessment.sessionid,
                                  test_id: assessment.testid,
                                  user_state: user?.id ? 'logged_in' : 'anonymous'
                                });
                                handlePaidReport(assessment);
                              }}
                              disabled={paymentLoading === assessment.sessionid}
                              className="inline-flex items-center px-3 py-1 text-xs font-['Gilroy-semiBold'] rounded-full border border-gray-300 text-gray-600 bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {paymentLoading === assessment.sessionid ? (
                                <>
                                  <div className="w-3 h-3 mr-1 animate-spin border border-gray-500 border-t-transparent rounded-full"></div>
                                  Processing...
                                </>
                              ) : (
                                <>
                                  <Lock className="w-3 h-3 mr-1" />
                                  Unlock
                                </>
                              )}
                            </button>
                          ) : assessment.quest_status === "working" ? (
                            // State 2: Payment done but PDF still generating
                            <div className="inline-flex items-center px-3 py-1 text-xs font-['Gilroy-Regular'] text-orange-600 bg-orange-50 rounded-full">
                              <Clock className="w-3 h-3 mr-1" />
                              <span>PDF generating</span>
                            </div>
                          ) : assessment.quest_status === "generated" ? (
                            // State 3: Payment done and PDF ready
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handlePaidReport(assessment);
                              }}
                              className="inline-flex items-center px-3 py-1 text-xs font-['Gilroy-semiBold'] rounded-full text-white bg-blue-600 hover:bg-blue-700 transition-colors"
                            >
                              <Download className="w-3 h-3 mr-1" />
                              Get Your PDF
                            </button>
                          ) : (
                            // Fallback: Payment done but PDF status unknown
                            <div className="inline-flex items-center px-3 py-1 text-xs font-['Gilroy-Regular'] text-orange-600 bg-orange-50 rounded-full">
                              <Clock className="w-3 h-3 mr-1" />
                              <span>Processing</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {/* Menu dropdown */}
                    <div className="relative">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenMenuId(openMenuId === assessment.testid ? null : assessment.testid);
                        }}
                        className="text-gray-500 hover:text-gray-700 p-1 transition-colors"
                      >
                        <MoreVertical className="w-5 h-5" />
                      </button>
                      
                      {openMenuId === assessment.testid && (
                        <div className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg z-20 border border-gray-100">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleView(assessment);
                            }}
                            className="flex items-center w-full text-left px-4 py-2 text-sm font-['Gilroy-Regular'] text-gray-700 hover:bg-gray-100 transition-colors"
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            View
                          </button>
                          {/* <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleFeedback(assessment);
                            }}
                            className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                          >
                            <MessageCircle className="w-4 h-4 mr-2" />
                            Feedback
                          </button> */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(assessment);
                            }}
                            className="flex items-center w-full text-left px-4 py-2 text-sm font-['Gilroy-Regular'] text-red-600 hover:bg-gray-100 transition-colors"
                          >
                            <FileText className="w-4 h-4 mr-2" />
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </main>

      {/* Bottom Navigation */}
      <footer className="fixed bottom-0 left-0 right-0 bg-white shadow-t flex justify-around py-3 border-t">
        <div 
          className="text-center text-gray-400 cursor-pointer hover:text-gray-600 transition-colors"
          onClick={() => navigate(`/quest-dashboard/${userId}`)}
        >
          <Home className="w-6 h-6 mx-auto" />
          <p className="text-xs font-['Gilroy-semiBold']">Home</p>
        </div>
        <div className="text-center text-blue-600">
          <FileText className="w-6 h-6 mx-auto" />
          <p className="text-xs font-['Gilroy-semiBold']">Assessment</p>
        </div>
        <div 
          className="text-center text-gray-400 cursor-pointer hover:text-gray-600 transition-colors"
          onClick={() => {
            setNavigationLoading(true);
            setTimeout(() => {
              navigate(`/payment-history/${userId}`);
            });
          }}
        >
          <CreditCard className="w-6 h-6 mx-auto" />
          <p className="text-xs font-['Gilroy-semiBold']">Payment</p>
        </div>
      </footer>

      {/* Click outside to close menu */}
      {openMenuId && (
        <div 
          className="fixed inset-0 z-10"
          onClick={() => setOpenMenuId(null)}
        />
      )}
    </div>
  );
};

export default AssessmentList;
