import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, Home, FileText, CreditCard, Lightbulb, TrendingUp, User, Calendar, ExternalLink, LogOut, Plus, X, Brain, Unlock, LayoutDashboard, HelpCircle } from 'lucide-react';
import { useAuth } from '../../../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { QuestLoading } from '../QuestLoading';
import { PaymentService, sessionManager } from '@/services/payments';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { googleAnalytics } from '../../../../services/analytics/googleAnalytics';
import { getUserLocationFlag } from '../../../../services/payments/razorpay/config';
import { AnalyzeSidebar } from '../../../quest-landing/sections/AnalyzeSidebar';

interface MenuItemConfig {
  id: string;
  label: string;
  icon: React.ReactNode;
  action: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
}

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

// Fun Facts and Brain Teasers data
const FUN_FACTS = [
  "Did you know? The human brain generates about 50,000 thoughts per day.",
  "Quick Challenge: Name 3 creative uses for a paperclip!",
  "Fun Fact: Your brain uses 20% of your body's total energy despite being only 2% of your body weight.",
  "Brain Teaser: What gets wetter as it dries?",
  "Did you know? You have around 86 billion neurons in your brain, each connecting to thousands of others.",
  "Quick Challenge: How would you move Mount Fuji?",
  "Fun Fact: Your brain can process visual information in as little as 13 milliseconds.",
  "Brain Teaser: I am not alive, but I grow; I don't have lungs, but I need air. What am I?",
  "Did you know? The average person forgets 50% of new information within an hour.",
  "Quick Challenge: Design a better way to eat spaghetti!"
];

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
  // const [emailLoading, setEmailLoading] = useState<string | null>(null); // Not used
  // const [priceDisplay, setPriceDisplay] = useState('Loading...'); // Not used
  // const [originalPrice, setOriginalPrice] = useState(''); // Not used
  // const [isLoadingPrice, setIsLoadingPrice] = useState(true); // Not used
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [navigationLoading, setNavigationLoading] = useState<string | null>(null);
  const [currentFunFact, setCurrentFunFact] = useState<string>('');

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

  // Set random fun fact on component mount
  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * FUN_FACTS.length);
    setCurrentFunFact(FUN_FACTS[randomIndex]);
  }, []);

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
  // Not used - commented out in the UI
  // const getCompletionPercentage = () => {
  //   const paidTests = data.filter(test => test.ispaymentdone === 'success').length;
  //   const totalTests = data.length;
  //   if (totalTests === 0) return 0;
  //   return Math.round((paidTests / totalTests) * 100);
  // };

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
      navigate('/quest'); // Updated to match result page authentication route
    } catch (error) {
      console.error('Sign out error:', error);
      toast.error('Failed to sign out');
    }
  };

  // Dashboard-specific menu items
  const getDashboardMenuItems = (): MenuItemConfig[] => {
    return [
      {
        id: 'home',
        label: 'Home',
        icon: <Home className="w-5 h-5" />,
        action: () => {
          navigate('/quest');
        },
        variant: 'primary' as const
      },
      {
        id: 'assessments',
        label: 'Assessments',
        icon: <FileText className="w-5 h-5" />,
        action: () => {
          navigate(`/assessment-list/${userId}`);
        },
        variant: 'primary' as const
      },
      {
        id: 'payments',
        label: 'Payment History',
        icon: <CreditCard className="w-5 h-5" />,
        action: () => {
          navigate(`/payment-history/${userId}`);
        },
        variant: 'primary' as const
      },
      {
        id: 'new-test',
        label: 'New Assessment',
        icon: <Plus className="w-5 h-5" />,
        action: handleNewAssessment,
        variant: 'primary' as const
      },
      {
        id: 'logout',
        label: 'Sign Out',
        icon: <LogOut className="w-5 h-5" />,
        action: handleSignOut,
        variant: 'danger' as const
      }
    ];
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  // Handle unlock potential button
  const handleUnlockPotential = () => {
    const latestAssessment = getLatestAssessment();
    if (latestAssessment) {
      navigate(`/quest-result/result/${latestAssessment.userid}/${latestAssessment.sessionid}/${latestAssessment.testid}`);
    } else {
      // If no assessments, redirect to start new assessment
      navigate('/assessment');
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className='h-screen bg-[#004A7F] max-h-screen relative overflow-hidden flex items-center justify-center'>
        <div className="text-center px-4">
          <h2 className="text-4xl font-['Gilroy-Bold'] text-white mb-4">
            Loading your dashboard...
          </h2>
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          </div>
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
          <h3 className="text-lg font-['Gilroy-semiBold'] text-gray-900 mb-2">Error Loading Dashboard</h3>
          <p className="text-gray-600 font-['Gilroy-Regular'] mb-4">{error}</p>
          <button
            onClick={() => navigate('/quest')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-['Gilroy-semiBold']"
          >
            Back to Quest
          </button>
        </div>
      </div>
    );
  }

  // Navigation loading state
  if (navigationLoading) {
    const loadingMessage = navigationLoading === 'assessment' 
      ? 'Loading assessments...' 
      : 'Loading payment history...';
    
    return (
      <QuestLoading message={loadingMessage} />
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 font-['Gilroy-Regular'] relative">
      {/* Header */}
      <header className="bg-gradient-to-br from-cyan-600 to-blue-800 text-white p-6 pb-16 rounded-b-3xl relative z-10">
        <div className="flex justify-between items-center mb-10">
          <div onClick={() => navigate('/quest')} className="cursor-pointer">
            <div className="logo-dashboard ">
              <img src="/Vector.svg" className='invert w-24' alt="Logo" />
            </div>
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
            <h2 className="text-3xl font-['Gilroy-Bold']">Hello, {getUserName()}!</h2>
            <p className="text-sm font-['Gilroy-Regular'] mt-1">Explore your journey of self-discovery.</p>
          </div>
          {/* <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center border-4 border-white shadow-lg">
            {user?.user_metadata?.avatar_url ? (
              <img
                alt={`${getUserName()}'s avatar`}
                className="w-full h-full rounded-full object-cover"
                src={user.user_metadata.avatar_url}
              />
            ) : (
              <User className="w-12 h-12 text-gray-400" />
            )}
          </div> */}
        </div>
      </header>

      {/* Enhanced Sliding Menu with AnalyzeSidebar */}
      <AnalyzeSidebar
        isOpen={isMenuOpen}
        onClose={closeMenu}
        theme="blue"
        customMenuItems={getDashboardMenuItems()}
        headerTitle={`Hello, ${getUserName()}!`}
        showMobileOnly={false}
      />

      {/* Main Content */}
      <main className="px-6 -mt-8 relative z-20">
        {/* Assessment Journeys Card */}
        <div className="bg-white rounded-xl shadow-md p-4 mb-8">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-['Gilroy-Bold'] text-gray-800">Your Assessment Journeys</h3>
            {/* <button
              onClick={() => data.length > 0 ? handleFreeReport(getLatestAssessment()!) : navigate('/assessment')}
              className="bg-gray-200 text-gray-700 text-xs font-semibold px-3 py-1 rounded-full hover:bg-gray-300 transition-colors"
            >
              {data.length > 0 ? 'New Result' : 'Start Assessment'}
            </button> */}
          </div>
          <div className="w-1/3 border-b-2 border-blue-600 mt-2"></div>
        </div>

        {/* Insights Section */}
        <section className="mb-8">
          <h3 className="text-xl font-['Gilroy-Bold'] text-gray-800 mb-4">Your Insights at a Glance</h3>
          <div className="grid grid-cols-2 gap-4">
            {/* Creative Thinker Card */}
            <div className="bg-white rounded-xl shadow-md p-4 text-center flex flex-col items-center justify-between min-h-[140px]">
              <Lightbulb className="w-12 h-12 mb-2 text-yellow-500" />
              <h4 className="font-['Gilroy-Bold'] text-sm text-gray-800">Creative Thinker</h4>
              <p className="text-xs font-['Gilroy-Regular'] text-gray-500 mt-1">Creative thinking often leads to innovative solutions and unique perspectives.</p>
            </div>

            {/* Areas for Growth Card */}
            <div className="bg-white rounded-xl shadow-md p-4 text-center flex flex-col items-center justify-between min-h-[140px]">
              <TrendingUp className="w-12 h-12 mb-2 text-blue-500" />
              <h4 className="font-['Gilroy-Bold'] text-sm text-gray-800">Areas for Growth</h4>
              <p className="text-xs font-['Gilroy-Regular'] text-gray-500 mt-1">Strong communication and collaboration skills build lasting success in teams.</p>
            </div>

            {/* Fun Fact with Unlock Potential Card */}
            <div className="col-span-2 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl shadow-md p-4 border border-purple-100">
              <div className="flex flex-col gap-1">
                <Brain className="w-10 h-10 text-purple-500 flex-shrink-0 mt-1" />
                <div className="flex-1">
                  <h4 className="font-['Gilroy-Bold'] text-base text-gray-800 mb-2">Fun Fact / Brain Teaser</h4>
                  <p className="text-sm font-['Gilroy-Regular'] text-gray-600 mb-4 leading-relaxed">
                    {currentFunFact}
                  </p>
                  {/* <div className="flex items-center justify-between">
                    <p className="text-sm font-['Gilroy-semiBold'] text-blue-600">Uncover Your Strengths</p>
                    <button
                      onClick={handleUnlockPotential}
                      className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-sm font-['Gilroy-semiBold'] rounded-full hover:from-orange-600 hover:to-red-600 transition-all duration-200 transform hover:scale-105 shadow-sm flex items-center gap-2"
                    >
                      <Unlock className="w-4 h-4" />
                      Unlock
                    </button>
                  </div> */}
                </div>
              </div>
            </div>

            {/* Progress Card */}
            {/* <div className="bg-white rounded-xl shadow-md p-4 text-center flex flex-col items-center justify-between min-h-[140px]">
              <div className="w-12 h-12 mb-2 text-green-500">
                🏃‍♂️
              </div>
              <h4 className="font-['Gilroy-Bold'] text-sm text-gray-800">Your Progress</h4>
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
                  <span className="text-lg font-['Gilroy-Bold'] text-gray-800">{getCompletionPercentage()}%</span>
                </div>
              </div>
              <p className="text-xs font-['Gilroy-Regular'] text-gray-500 mt-1">Personality Profile Mapped</p>
            </div> */}
          </div>
        </section>

        {/* Explore All Insights Button */}
        {/* <div className="mb-24">
          <button
            onClick={() => data.length > 0 && getLatestAssessment() ? handleFreeReport(getLatestAssessment()!) : navigate('/assessment')}
            className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg shadow-lg hover:bg-blue-700 transition-colors"
          >
            {data.length > 0 ? 'Explore All Insights' : 'Start Your First Assessment'}
          </button>
        </div> */}
      </main>

      {/* Bottom Navigation */}
      <footer className="fixed bottom-0 left-0 right-0 bg-white shadow-t flex justify-around py-3 border-t">
        <div className="text-center text-blue-600 cursor-pointer">
          <Home className="w-6 h-6 mx-auto" />
          <p className="text-xs font-['Gilroy-semiBold']">Home</p>
        </div>
        <div
          className="text-center text-gray-400 cursor-pointer hover:text-gray-600 transition-colors"
          onClick={() => {
            setNavigationLoading('assessment');
            setTimeout(() => {
              navigate(`/assessment-list/${userId}`);
            });
          }}
        >
          <FileText className="w-6 h-6 mx-auto" />
          <p className="text-xs font-['Gilroy-semiBold']">Assessment</p>
        </div>
        <div
          className="text-center text-gray-400 cursor-pointer hover:text-gray-600 transition-colors"
          onClick={() => {
            setNavigationLoading('payment');
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
  );
};
export default QuestDashboard;