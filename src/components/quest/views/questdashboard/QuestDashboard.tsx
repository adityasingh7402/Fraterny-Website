import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Lock, Download, Calendar, ExternalLink, FileText, AlertCircle, Clock } from 'lucide-react';
import { useAuth } from '../../../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { PaymentService, sessionManager } from '@/services/payments';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { googleAnalytics } from '../../../../services/analytics/googleAnalytics';
import { getUserLocationFlag } from '../../../../services/payments/razorpay/config';

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

interface QuestDashboardProps {
  className?: string;
}

interface EmailApiResponse {
  success: boolean;
  error?: string;
  message?: string;
}

// Configuration flag - set to true for mock data, false for API
const USE_MOCK_DATA = false;

// Mock data for testing
const MOCK_DATA: DashboardTest[] = [
  {
    userid: "9bba4c19-c22b-4c83-9b60-bfc81a2695fe",
    testid: "bae03e2a81ef518a232cd95800708b60bd1cfea9",
    sessionid: "session_1752577737404",
    testtaken: "2025-07-15T11:08:57.404Z",
    ispaymentdone: 'success',
    quest_pdf: "https://api.fraterny.in/api/report/session_1752577737404/9bba4c19-c22b-4c83-9b60-bfc81a2695fe/bae03e2a81ef518a232cd95800708b60bd1cfea9",
    quest_status: "working"
  },
  {
    userid: "9bba4c19-c22b-4c83-9b60-bfc81a2695fe", 
    testid: "34545jljerkldsjrw35-3454e",
    sessionid: "e4aef47f-2359-4f8b-93ea-efc5dfd49f2a",
    testtaken: "2025-07-11T12:24:58.654Z",
    ispaymentdone: 'success',
    quest_pdf: "https://api.fraterny.in/api/report/e4aef47f-2359-4f8b-93ea-efc5dfd49f2a/9bba4c19-c22b-4c83-9b60-bfc81a2695fe/34545jljerkldsjrw35-3454e",
    quest_status: "working"
  },
  {
    userid: "fedf723f-dcb0-4806-b84e-1590dfef4f76",
    testid: "bbadf5ce-2eb4-4f9c-8f96-9e4b9fd0e10a", 
    sessionid: "session_1752236698654",
    testtaken: "2025-07-11T12:24:58.654Z",
    ispaymentdone: null,
    quest_pdf: "https://api.fraterny.in/api/report/session_1752236698654/fedf723f-dcb0-4806-b84e-1590dfef4f76/bbadf5ce-2eb4-4f9c-8f96-9e4b9fd0e10a",
    quest_status: "generated"
  },
  {
    userid: "9bba4c19-c22b-4c83-9b60-bfc81a2695fe",
    testid: "9d5602bd6a3f05b9e00900793e0d315d436f4ed7",
    sessionid: "session_1753961797982",
    testtaken: "2025-07-31T11:36:50.561Z",
    ispaymentdone: 'success',
    quest_pdf: "https://api.fraterny.in/api/report/session_1753961797982/9bba4c19-c22b-4c83-9b60-bfc81a2695fe/9d5602bd6a3f05b9e00900793e0d315d436f4ed7",
    quest_status: "generated"
  },
  {
    userid: "9bba4c19-c22b-4c83-9b60-bfc81a2695fe",
    testid: "c8a27db647f5c8742b8d5d70aa9cedb3f00a7b09",
    sessionid: "session_1753962293131",
    testtaken: "2025-07-31T11:45:17.168Z",
    ispaymentdone: null,
    quest_pdf: "https://api.fraterny.in/api/report/session_1753962293131/9bba4c19-c22b-4c83-9b60-bfc81a2695fe/c8a27db647f5c8742b8d5d70aa9cedb3f00a7b09",
    quest_status: "working"
  }
];

const QuestDashboard: React.FC<QuestDashboardProps> = ({ className = '' }) => {
  const { user } = useAuth();
  const [data, setData] = useState<DashboardTest[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [paymentLoading, setPaymentLoading] = useState<string | null>(null);
  const [emailLoading, setEmailLoading] = useState<string | null>(null);
  const [priceDisplay, setPriceDisplay] = useState('Loading...');
  const [originalPrice, setOriginalPrice] = useState('');
  const [isLoadingPrice, setIsLoadingPrice] = useState(true);

  const navigate = useNavigate();
  const { userId } = useParams();

  

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
          `https://api.fraterny.in/api/userdashboard/${userId}`
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
      console.log( {
          user_name: user?.user_metadata?.first_name || 'User',
          user_email: user?.email || 'one@gmail.com',
          test_date: formatDate(testData.testtaken),
          session_id: testData.sessionid,
          pdf_link: testData.quest_pdf,
          user_id: testData.userid,
          test_id: testData.testid
        })
      const response = await axios.post<EmailApiResponse>(
        'https://api.fraterny.in/send-report-email', // Your backend endpoint
        {
          user_name: user?.user_metadata?.first_name || 'User',
          user_email: user?.email || 'one@gmail.com',
          test_date: formatDate(testData.testtaken),
          session_id: testData.sessionid,
          pdf_link: testData.quest_pdf,
          user_id: testData.userid,
          test_id: testData.testid
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
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
          if (!userId) {
            setError('User not authenticated');
            return;
          }

          console.log('Fetching dashboard data from API for user:', userId);
          const response = await axios.get<DashboardApiResponse>(
            `https://api.fraterny.in/api/userdashboard/${userId}`,
            {
              headers: {
                'Content-Type': 'application/json',
              },
              
            }
          );
          console.log('Dashboard data response:', response.data);
          if (response.data.status === 200) {
            setData(response.data.data || []);
          } else {
            setError('There is an error in fetching your data. Please visit us again in sometime.');
          }
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
  }, [userId]); // Only depend on user.id

  // Handle payment result updates
  // useEffect(() => {
  //   const handlePaymentResult = async () => {
  //     try {
  //       // Check for payment results from PaymentService
  //       const paymentResult = await PaymentService.handleAuthReturn();
        
  //       if (paymentResult) {
  //         if (paymentResult.success) {
  //           toast.success('Payment successful! Your report is now unlocked.');
            
  //           // Refresh dashboard data to get updated payment status
  //           if (user?.id) {
  //             const updatedData = await fetchUpdatedDashboardData();
  //             if (updatedData) {
  //               setData(updatedData);
  //             }
  //           }
            
  //         } else {
  //           toast.error('Payment failed. Please try again.');
  //         }
  //       }
  //     } catch (error) {
  //       console.error('Error handling payment result:', error);
  //     }
  //   };

  //   handlePaymentResult();
  // }, [userId]);

  // Handle download actions
  const handleFreeReport = (testData: DashboardTest) => {
    navigate(`/quest-result/result/${testData.userid}/${testData.sessionid}/${testData.testid}`);
  };
  
  useEffect(() => {
    const loadPricing = async () => {
      try {
        setIsLoadingPrice(true);
        console.log('💰 Loading location-based pricing...');
        
        const isIndia = await getUserLocationFlag();
        console.log('🌍 Location result for pricing:', isIndia);
        
        if (isIndia) {
          setPriceDisplay('₹950');
          setOriginalPrice('₹1200');
        } else {
          setPriceDisplay('$20');
          setOriginalPrice('$25');
        }
        
        console.log('✅ Pricing loaded successfully');
      } catch (error) {
        console.error('❌ Failed to load pricing:', error);
        // Fallback to default pricing
        setPriceDisplay('₹950');
        setOriginalPrice('₹1200');
      } finally {
        setIsLoadingPrice(false);
      }
    };

    loadPricing();
  }, []);

  
  
  const handlePaidReport = async (testData: DashboardTest) => {
    // If payment is done and PDF is ready, download directly
    if (testData.ispaymentdone === "success" && testData.quest_status === "generated") {
      try {
        // Create a temporary link element to trigger download
        const link = document.createElement('a');
        link.href = testData.quest_pdf;
        link.download = `Quest-Report-${formatDate(testData.testtaken)}.pdf`;
        link.target = '_blank';
        
        // Trigger the download
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        toast.success('Downloading your PDF report!');
      } catch (error) {
        console.error('PDF download error:', error);
        // Fallback to opening in new tab
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
          payment_amount: 95000, // Same as result page for now
          pricing_tier: 'early' // Same as result page for now
        });
        
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
      return;
    }

    // Fallback for any other case
    toast.error('Unable to process request. Please try again.');
  };



  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 rounded-full border-4 border-blue-500 border-t-transparent animate-spin"></div>
          <p className="text-gray-700 font-medium">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className={`p-6 ${className} bg-[#004A7F] text-white h-screen `}>
        <div className="text-center py-12">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Dashboard</h3>
          <p className="text-white mb-4">{error}</p>
          <button
            onClick={() => navigate('/quest')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Homepage
          </button>
        </div>
      </div>
    );
  }

  // Empty state
  if (data && data.length === 0) {
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
    <div className={`p-6 ${className} bg-[#004A7F] text-white h-auto min-h-screen`}>
      <div className='flex flex-col items-center justify-center w-full mb-8'
      onClick={() => navigate('/quest')}>
        <div className='text-6xl font-normal font-["Gilroy-Bold"] tracking-tighter'>
          QUEST
        </div>
        <div className='text-sm font-normal font-["Gilroy-Regular"] tracking-[0.1rem] pl-0 mt-[-6px]'>
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
              {(data || []).map((test, index) => (
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
                    {test.ispaymentdone !== "success" ? (
                      // State 1: Payment not done - show unlock button
                      <button
                        onClick={() => {
                          // Track unlock CTA click
                          googleAnalytics.trackPdfUnlockCTAFromDashboard({
                            session_id: test.sessionid,
                            test_id: test.testid,
                            user_state: user?.id ? 'logged_in' : 'anonymous'
                          });
                          handlePaidReport(test);
                        }}
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
                    ) : test.quest_status === "working" ? (
                      // State 2: Payment done but PDF still generating
                      <div className="inline-flex items-center px-3 py-2 text-sm text-orange-600 bg-orange-50 rounded-md">
                        <Clock className="w-4 h-4 mr-2" />
                        <span className="text-xs">PDF generating, check after 15 mins</span>
                      </div>
                    ) : test.quest_status === "generated" ? (
                      // State 3: Payment done and PDF ready
                      <button
                        onClick={() => handlePaidReport(test)}
                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Get Your PDF
                      </button>
                    ) : (
                      // Fallback: Payment done but PDF status unknown - show email option
                      <div className="inline-flex items-center px-3 py-2 text-sm text-orange-600 bg-orange-50 rounded-md">
                        <Clock className="w-4 h-4 mr-2" />
                        <span className="text-xs">PDF generating, check after 15 mins</span>
                      </div>
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