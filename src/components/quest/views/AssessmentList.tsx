import React, { useState, useEffect } from 'react';
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
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import {
  unifiedPaymentService,
  processPaymentWithGateway,
  getBothGatewayPricing,
  type PaymentGateway,
  type UnifiedPricingData
} from '../../../services/payments/unifiedPaymentService';

// Design Tokens
const tokens = {
  textDark: "#0A0A0A",
  textLight: "#FFFFFF",
  muted: "#6B7280",
  border: "#E6EAF2",
  accent: "#0C45F0",
  accent2: "#41D9FF",
  accent3: "#48B9D8",
  soft: "#F7F9FC",
};

// Utility function to format time
const formatTime = (s: number): string => {
  const m = Math.floor(s / 60).toString().padStart(2, "0");
  const r = (s % 60).toString().padStart(2, "0");
  return `${m}:${r}`;
};

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
  const [upsellOpen, setUpsellOpen] = useState(false);
  const [selectedAssessment, setSelectedAssessment] = useState<DashboardTest | null>(null);
  const [paymentModalLoading, setPaymentModalLoading] = useState(false);
  const [pricing, setPricing] = useState({
    razorpay: {
      main: '₹950',
      original: '₹1200',
      currency: 'INR',
      symbol: '₹',
      amount: 950,
      isIndia: true,
      isLoading: true
    },
    paypal: {
      main: '$20',
      original: '$25',
      currency: 'USD',
      amount: 20,
      isIndia: false
    },
    isLoading: true
  });
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
        `${import.meta.env.VITE_BACKEND_URL}/api/userdashboard/${userId}`
      );
      const assessmentData = response.data.data || [];
      // Sort assessments in descending order by date (latest first)
      const sortedData = assessmentData.sort((a: DashboardTest, b: DashboardTest) => {
        const dateA = new Date(a.testtaken).getTime();
        const dateB = new Date(b.testtaken).getTime();
        return dateB - dateA; // Descending order (latest first)
      });
      return sortedData;
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
          `${import.meta.env.VITE_BACKEND_URL}/api/userdashboard/${userId}`,
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );
        console.log('Assessment data response:', response.data);
        if (response.data.status === 200) {
          const assessmentData = response.data.data || [];
          // Sort assessments in descending order by date (latest first)
          const sortedData = assessmentData.sort((a: DashboardTest, b: DashboardTest) => {
            const dateA = new Date(a.testtaken).getTime();
            const dateB = new Date(b.testtaken).getTime();
            return dateB - dateA; // Descending order (latest first)
          });
          setData(sortedData);
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

  // Load pricing data
  useEffect(() => {
    const loadPricing = async () => {
      try {
        console.log('💰 AssessmentList: Loading pricing for both gateways...');
        const unifiedPricingData = await getBothGatewayPricing();
        console.log('💰 AssessmentList: Unified pricing data:', unifiedPricingData);

        const newPricing = {
          razorpay: {
            main: unifiedPricingData.razorpay.main,
            original: unifiedPricingData.razorpay.original,
            currency: unifiedPricingData.razorpay.currency,
            symbol: unifiedPricingData.razorpay.symbol,
            amount: unifiedPricingData.razorpay.amount,
            isIndia: unifiedPricingData.razorpay.isIndia,
            isLoading: false
          },
          paypal: {
            main: unifiedPricingData.paypal.displayAmount,
            original: unifiedPricingData.paypal.displayOriginal,
            currency: unifiedPricingData.paypal.currency,
            amount: unifiedPricingData.paypal.numericAmount,
            isIndia: unifiedPricingData.paypal.isIndia
          },
          isLoading: false
        };

        setPricing(newPricing);
        console.log('✅ AssessmentList: Dual gateway pricing updated', newPricing);
      } catch (error) {
        console.error('❌ AssessmentList: Failed to load pricing:', error);
        setPricing(prev => ({ ...prev, isLoading: false }));
      }
    };

    loadPricing();
  }, []);

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

    // If payment not done, open the modal instead of direct payment
    if (testData.ispaymentdone !== "success") {
      setSelectedAssessment(testData);
      setUpsellOpen(true);
      return;
    }

    toast.error('Unable to process request. Please try again.');
  };

  // Handle payment from modal
  const handleModalPayment = async (selectedGateway: PaymentGateway): Promise<void> => {
    if (!selectedAssessment) return;

    setPaymentModalLoading(true);
    try {
      console.log('Payment attempt with:', { selectedGateway, sessionId: selectedAssessment.sessionid, testId: selectedAssessment.testid });

      const paymentResult = await unifiedPaymentService.processPayment(
        selectedGateway, 
        selectedAssessment.sessionid, 
        selectedAssessment.testid
      );

      if (paymentResult.success) {
        toast.success('Payment successful!');
        setUpsellOpen(false);
        
        // Refresh data to update payment status
        const updatedData = await fetchUpdatedAssessmentData();
        if (updatedData) {
          setData(updatedData);
        }
        
        // Track analytics
        googleAnalytics.trackPaymentInitiatedFromDashboard({
          session_id: selectedAssessment.sessionid,
          test_id: selectedAssessment.testid,
          user_state: user?.id ? 'logged_in' : 'anonymous',
          payment_amount: 95000,
          pricing_tier: 'early'
        });
        
        // Track Google Ads conversion
        const urlParams = new URLSearchParams(window.location.search);
        const gclid = urlParams.get('gclid') || sessionStorage.getItem('gclid') || localStorage.getItem('gclid');
        if (gclid) {
          googleAnalytics.trackGoogleAdsConversion({
            session_id: selectedAssessment.sessionid,
            payment_id: 'dashboard_payment',
            amount: 950,
            currency: 'INR'
          });
        }
        
        // Track Reddit conversion
        if (googleAnalytics.isRedditTraffic()) {
          googleAnalytics.trackRedditConversion({
            session_id: selectedAssessment.sessionid,
            payment_id: 'dashboard_payment',
            amount: 950,
            currency: 'INR'
          });
        }
        
      } else {
        const errorMessage = paymentResult.error || 'Payment failed.';
        console.error('Payment failed:', errorMessage);
        toast.error(errorMessage, {
          position: "top-right"
        });
      }
    } catch (error: any) {
      console.error('Payment error:', error);
      let errorMessage = 'Payment failed. Please try again.';
      if (error.message?.includes('Network error')) {
        errorMessage = 'Network error. Please check your connection and try again.';
      }
      toast.error(errorMessage, {
        position: "top-right"
      });
    } finally {
      setPaymentModalLoading(false);
    }
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
      <div className="relative z-10">
        {/* Header */}
        <header className="bg-white shadow-sm sticky top-0 z-10">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
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
          </div>
        </header>

        {/* Main Content */}
        <main className="pb-24">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
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
                        <div className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg z-30 border border-gray-100">
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
                          {/* <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(assessment);
                            }}
                            className="flex items-center w-full text-left px-4 py-2 text-sm font-['Gilroy-Regular'] text-red-600 hover:bg-gray-100 transition-colors"
                          >
                            <FileText className="w-4 h-4 mr-2" />
                            Delete
                          </button> */}
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
          </div>
        </main>

        {/* Bottom Navigation */}
        <footer className="fixed bottom-0 left-0 right-0 bg-white shadow-t flex justify-around py-3 border-t z-20">
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
      </div>

      {/* Click outside to close menu */}
      {openMenuId && (
        <div 
          className="fixed inset-0 z-[5]"
          onClick={() => setOpenMenuId(null)}
        />
      )}

      {/* UpsellSheet Modal */}
      <UpsellSheetComponent
        open={upsellOpen}
        onClose={() => setUpsellOpen(false)}
        onPayment={handleModalPayment}
        paymentLoading={paymentModalLoading}
        pricing={pricing}
      />
    </div>
  );
};

// UpsellSheet Component
interface UpsellSheetComponentProps {
  open: boolean;
  onClose: () => void;
  onPayment: (gateway: PaymentGateway) => Promise<void>;
  paymentLoading: boolean;
  pricing: any;
}

const UpsellSheetComponent: React.FC<UpsellSheetComponentProps> = ({ open, onClose, onPayment, paymentLoading, pricing }) => {
  const [trial, setTrial] = useState(true);
  const [selectedGateway, setSelectedGateway] = useState<PaymentGateway>('razorpay');
  const [seconds, setSeconds] = useState(30 * 60);

  useEffect(() => {
    const t = setInterval(() => setSeconds((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, []);

  const handlePaymentClick = async () => {
    try {
      await onPayment(selectedGateway);
    } catch (error) {
      console.error('Payment error in UpsellSheet:', error);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-[70]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <div className="absolute inset-0 bg-black/35" onClick={onClose} />
          <motion.div
            className="absolute inset-x-0 bottom-0 mx-auto w-full max-w-[390px] rounded-t-[28px] bg-white flex flex-col"
            style={{ 
              boxShadow: "0 -12px 32px rgba(0,0,0,0.15)", 
              border: `1px solid ${tokens.border}`,
              maxHeight: 'calc(100vh - 2rem)',
              minHeight: '60vh'
            }}
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 260, damping: 28 }}
          >
            {/* Fixed Header with Close Button */}
            <div className="flex-shrink-0 relative px-4 pt-4 pb-2">
              <button 
                aria-label="Close" 
                onClick={onClose} 
                className="absolute right-4 top-4 rounded-full p-2 bg-gray-100 hover:bg-gray-200 transition-colors z-10"
                style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
              >
                <X className="h-5 w-5" color={tokens.textDark} />
              </button>
              <div className="pt-6 text-[26px] font-['Gilroy-Regular'] leading-8" style={{ color: tokens.textDark }}>
                Download your 35+ page <span className="font-['Gilroy-Black']">Personalised PDF Report</span>
              </div>
              <div className="mb-3 text-[14px] font-['Gilroy-Regular']" style={{ color: tokens.muted }}> Powered by Fraterny's advanced AI model </div>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto px-4" style={{
              WebkitOverflowScrolling: 'touch',
              overscrollBehavior: 'contain'
            }}>
              <ul className="grid gap-2 pb-4">
                {["A Deep-Dive Mindset Analysis", "Detailed Mental Blueprint", "Personalized Content Operating System ", "You VS Future You", "Curated Action & Growth Plan"].map((t, i) => (
                  <li key={i} className="flex items-center gap-2 text-[14px] font-['Gilroy-semiBold']">
                    <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ background: i === 0 ? "#FF3B6B" : tokens.accent }} />
                    <span className={i === 0 ? "font-[700]" : ""} style={{ color: tokens.textDark }}>
                      {i === 0 ? <span style={{ color: "#FF3B6B" }}>A Deep-Dive Mindset Analysis</span> : t}
                    </span>
                  </li>
                ))}
              </ul>

              <motion.div
                className="relative rounded-2xl p-4 text-white mb-4"
                style={{ background: "linear-gradient(135deg, rgba(12,69,240,1) 0%, rgba(65,217,255,1) 45%, rgba(72,185,216,1) 100%)" }}
                animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              >
                <div className="text-[12px] opacity-95"><span>Ends in {formatTime(seconds)}</span></div>
                <div className="mt-1 flex items-baseline gap-2">
                  <span className="text-[24px] font-['Gilroy-Regular'] font-[400] text-white">
                    {pricing.isLoading ? '...' : (selectedGateway === 'razorpay' ? pricing.razorpay.main : pricing.paypal.main)}
                  </span>
                  <span className="text-[18px] font-['Gilroy-Regular'] line-through text-gray-800">
                    {pricing.isLoading ? '...' : (selectedGateway === 'razorpay' ? pricing.razorpay.original : pricing.paypal.original)}
                  </span>
                </div>
              </motion.div>

              <div className="mb-4 flex items-center justify-between rounded-xl bg-[#F2F5FA] px-3 py-3 font-['Gilroy-Bold']" style={{ border: `1px solid ${tokens.border}` }}>
                <div className="text-[16px]" style={{ color: tokens.textDark }}>Incorporate My Feedback</div>
                <button aria-label="toggle trial" onClick={() => setTrial((t) => !t)} className="relative h-6 w-11 rounded-full" style={{ background: trial ? tokens.accent : "#D1D5DB", boxShadow: "0 10px 30px rgba(12,69,240,0.06)" }}>
                  <span className="absolute top-1 left-1 h-4 w-4 rounded-full bg-white transition-transform" style={{ transform: `translateX(${trial ? 20 : 0}px)` }} />
                </button>
              </div>

              {/* Payment Gateway Selection */}
              <div className="pb-4">
                <div className="text-[14px] font-['Gilroy-semiBold'] mb-3" style={{ color: tokens.textDark }}>
                  Choose Payment Method
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {/* Razorpay Option */}
                  <button
                    onClick={() => setSelectedGateway('razorpay')}
                    className={`p-3 rounded-xl border-2 transition-all ${selectedGateway === 'razorpay'
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                      }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-lg">💳</span>
                      <span className="font-['Gilroy-Bold'] text-[14px]" style={{ color: tokens.textDark }}>
                        Razorpay
                      </span>
                    </div>
                    <div className="text-[12px] text-gray-600 text-left">
                      Cards, UPI, Net Banking
                    </div>
                  </button>

                  {/* PayPal Option */}
                  <button
                    onClick={() => setSelectedGateway('paypal')}
                    className={`p-3 rounded-xl border-2 transition-all ${selectedGateway === 'paypal'
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                      }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">🌐</span>
                        <span className="font-['Gilroy-Bold'] text-[14px]" style={{ color: tokens.textDark }}>
                          PayPal
                        </span>
                      </div>
                      <span className="text-[12px] text-gray-500 font-['Gilroy-Regular']">(USD)</span>
                    </div>
                    <div className="text-[12px] text-gray-600 text-left">
                      PayPal Balance, Cards
                    </div>
                  </button>
                </div>
              </div>
            </div>

            {/* Fixed Footer */}
            <div className="flex-shrink-0 border-t bg-white" style={{ borderColor: tokens.border }}>
              <div className="px-4 py-3">
                <button
                  onClick={handlePaymentClick}
                  disabled={paymentLoading}
                  className="w-full rounded-xl px-4 py-3 text-[16px] font-[600] font-['Gilroy-Bold'] tracking-tight text-white disabled:opacity-50"
                  style={{ background: tokens.textDark }}
                >
                  {paymentLoading ? 'Processing...' : 'Continue'}
                </button>
                <div className="pt-2 text-center text-[12px]" style={{ color: tokens.muted }}>
                  Fully Refundable. T&C apply.
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AssessmentList;
