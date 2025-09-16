import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, Home, FileText, CreditCard, Lightbulb, TrendingUp, User, Calendar, ExternalLink, LogOut, Plus, X } from 'lucide-react';
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
  const { user, signOut } = useAuth();
  const [data, setData] = useState<DashboardTest[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [paymentLoading, setPaymentLoading] = useState<string | null>(null);
  const [emailLoading, setEmailLoading] = useState<string | null>(null);
  const [priceDisplay, setPriceDisplay] = useState('Loading...');
  const [originalPrice, setOriginalPrice] = useState('');
  const [isLoadingPrice, setIsLoadingPrice] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
        await new Promise(resolve => setTimeout(resolve, 500));
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

  // SINGLE useEffect to fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);

        if (USE_MOCK_DATA) {
          console.log('Using mock data for dashboard');
          await new Promise(resolve => setTimeout(resolve, 1000));
          setData(MOCK_DATA);
        } else {
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
  }, [userId]);

  // Handle download actions
  const handleFreeReport = (testData: DashboardTest) => {
    navigate(`/quest-result/result/${testData.userid}/${testData.sessionid}/${testData.testid}`);
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

  // Get user's first name or fallback
  const getUserName = () => {
    return user?.user_metadata?.first_name || user?.user_metadata?.name || 'User';
  };

  // Get latest assessment data for insights
  const getLatestAssessment = () => {
    if (data && data.length > 0) {
      return data.sort((a, b) => new Date(b.testtaken).getTime() - new Date(a.testtaken).getTime())[0];
    }
    return null;
  };

  // Calculate completion percentage
  const getCompletionPercentage = () => {
    const paidTests = data.filter(test => test.ispaymentdone === 'success').length;
    const totalTests = data.length;
    if (totalTests === 0) return 0;
    return Math.round((paidTests / totalTests) * 100);
  };

  // Handle menu actions
  const handleNewAssessment = () => {
    setIsMenuOpen(false);
    navigate('/assessment');
  };

  const handleSignOut = async () => {
    setIsMenuOpen(false);
    try {
      await signOut();
      toast.success('Signed out successfully');
      navigate('/auth');
    } catch (error) {
      console.error('Sign out error:', error);
      toast.error('Failed to sign out');
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
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
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
        <div className="text-center">
          <div className="w-12 h-12 text-red-500 mx-auto mb-4">⚠️</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Dashboard</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => navigate('/quest')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Quest
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 font-poppins relative">
      {/* Header */}
      <header className="bg-gradient-to-br from-cyan-600 to-blue-800 text-white p-6 pb-16 rounded-b-3xl relative z-10">
        <div className="flex justify-between items-center mb-10">
          <div onClick={() => navigate('/quest')} className="cursor-pointer">
            <h1 className="text-2xl font-bold">QUEST</h1>
            <p className="text-xs">BY FRATERNY</p>
          </div>
          <button 
            onClick={toggleMenu}
            className="text-white hover:text-gray-200 transition-colors relative z-50"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
        <div className="flex items-center">
          <div className="flex-1">
            <h2 className="text-3xl font-bold">Hello, {getUserName()}!</h2>
            <p className="text-sm mt-1">Explore your journey of self-discovery.</p>
          </div>
          <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center border-4 border-white shadow-lg">
            {user?.user_metadata?.avatar_url ? (
              <img 
                alt={`${getUserName()}'s avatar`} 
                className="w-full h-full rounded-full object-cover" 
                src={user.user_metadata.avatar_url}
              />
            ) : (
              <User className="w-12 h-12 text-gray-400" />
            )}
          </div>
        </div>
      </header>

      {/* Sliding Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeMenu}
              className="fixed inset-0 bg-black bg-opacity-50"
              style={{ zIndex: 40 }}
            />
            
            {/* Sliding Menu */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="fixed top-0 right-0 h-full w-80 bg-white shadow-xl flex flex-col"
              style={{ zIndex: 50 }}
            >
              {/* Menu Header */}
              <div className="bg-gradient-to-r from-cyan-600 to-blue-800 text-white p-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-xl font-bold">Menu</h2>
                    <p className="text-sm opacity-90">Hello, {getUserName()}!</p>
                  </div>
                  <button 
                    onClick={closeMenu}
                    className="text-white hover:text-gray-200 transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>
              
              {/* Menu Items */}
              <div className="flex-1 p-6">
                <div className="space-y-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleNewAssessment}
                    className="w-full flex items-center p-4 text-left bg-gray-50 hover:bg-blue-50 rounded-lg transition-colors group"
                  >
                    <div className="bg-blue-100 p-2 rounded-lg mr-4 group-hover:bg-blue-200 transition-colors">
                      <Plus className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">New Assessment</h3>
                      <p className="text-sm text-gray-500">Start a new psychology assessment</p>
                    </div>
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSignOut}
                    className="w-full flex items-center p-4 text-left bg-gray-50 hover:bg-red-50 rounded-lg transition-colors group"
                  >
                    <div className="bg-red-100 p-2 rounded-lg mr-4 group-hover:bg-red-200 transition-colors">
                      <LogOut className="w-5 h-5 text-red-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">Sign out</h3>
                      <p className="text-sm text-gray-500">Sign out of your account</p>
                    </div>
                  </motion.button>
                </div>
              </div>
              
              {/* User Info Footer */}
              <div className="p-6 border-t border-gray-100">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                    {user?.user_metadata?.avatar_url ? (
                      <img 
                        alt={`${getUserName()}'s avatar`} 
                        className="w-full h-full rounded-full object-cover" 
                        src={user.user_metadata.avatar_url}
                      />
                    ) : (
                      <User className="w-5 h-5 text-blue-600" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">{getUserName()}</p>
                    <p className="text-xs text-gray-500">{user?.email}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="px-6 -mt-8 relative z-20">
        {/* Assessment Journeys Card */}
        <div className="bg-white rounded-xl shadow-md p-4 mb-8">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold text-gray-800">Your Assessment Journeys</h3>
            <button 
              onClick={() => data.length > 0 ? handleFreeReport(getLatestAssessment()!) : navigate('/assessment')}
              className="bg-gray-200 text-gray-700 text-xs font-semibold px-3 py-1 rounded-full hover:bg-gray-300 transition-colors"
            >
              {data.length > 0 ? 'New Result' : 'Start Assessment'}
            </button>
          </div>
          <div className="w-1/3 border-b-2 border-blue-600 mt-2"></div>
        </div>

        {/* Insights Section */}
        <section className="mb-8">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Your Insights at a Glance</h3>
          <div className="grid grid-cols-3 gap-4">
            {/* Creative Thinker Card */}
            <div className="bg-white rounded-xl shadow-md p-4 text-center flex flex-col items-center justify-between min-h-[140px]">
              <Lightbulb className="w-12 h-12 mb-2 text-yellow-500" />
              <h4 className="font-bold text-sm text-gray-800">Creative Thinker</h4>
              <p className="text-xs text-gray-500 mt-1">Based on your latest assessment</p>
            </div>

            {/* Areas for Growth Card */}
            <div className="bg-white rounded-xl shadow-md p-4 text-center flex flex-col items-center justify-between min-h-[140px]">
              <TrendingUp className="w-12 h-12 mb-2 text-blue-500" />
              <h4 className="font-bold text-sm text-gray-800">Areas for Growth</h4>
              <p className="text-xs text-gray-500 mt-1">Public Speaking & Collaboration</p>
              <p className="text-xs text-gray-400 mt-1">Unlock your full potential</p>
            </div>

            {/* Progress Card */}
            <div className="bg-white rounded-xl shadow-md p-4 text-center flex flex-col items-center justify-between min-h-[140px]">
              <div className="w-12 h-12 mb-2 text-green-500">
                🏃‍♂️
              </div>
              <h4 className="font-bold text-sm text-gray-800">Your Progress</h4>
              <div className="relative w-16 h-16 my-2">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  <path 
                    className="text-gray-200" 
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="3"
                  />
                  <path 
                    className="text-orange-500" 
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeDasharray={`${getCompletionPercentage()}, 100`} 
                    strokeLinecap="round" 
                    strokeWidth="3"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-lg font-bold text-gray-800">{getCompletionPercentage()}%</span>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-1">Personality Profile Mapped</p>
            </div>
          </div>
        </section>

        {/* Explore All Insights Button */}
        <div className="mb-24">
          <button 
            onClick={() => data.length > 0 && getLatestAssessment() ? handleFreeReport(getLatestAssessment()!) : navigate('/assessment')}
            className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg shadow-lg hover:bg-blue-700 transition-colors"
          >
            {data.length > 0 ? 'Explore All Insights' : 'Start Your First Assessment'}
          </button>
        </div>
      </main>

      {/* Bottom Navigation */}
      <footer className="fixed bottom-0 left-0 right-0 bg-white shadow-t flex justify-around py-3 border-t">
        <div className="text-center text-blue-600 cursor-pointer">
          <Home className="w-6 h-6 mx-auto" />
          <p className="text-xs font-medium">Home</p>
        </div>
        <div 
          className="text-center text-gray-400 cursor-pointer hover:text-gray-600 transition-colors"
          onClick={() => navigate(`/assessment-list/${userId}`)}
        >
          <FileText className="w-6 h-6 mx-auto" />
          <p className="text-xs font-medium">Assessment</p>
        </div>
        <div 
          className="text-center text-gray-400 cursor-pointer hover:text-gray-600 transition-colors"
          onClick={() => navigate(`/payment-history/${userId}`)}
        >
          <CreditCard className="w-6 h-6 mx-auto" />
          <p className="text-xs font-medium">Payment</p>
        </div>
      </footer>
    </div>
  );
};
export default QuestDashboard;