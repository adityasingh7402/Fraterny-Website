import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, Home, FileText, CreditCard, Lightbulb, TrendingUp, User, Calendar, ExternalLink, LogOut, Plus, X, Brain, Unlock, LayoutDashboard, HelpCircle, Clock } from 'lucide-react';
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
import { clusters, Archetype, Cluster } from '../../../archeotype/archeotype';

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
  const [archetypeData, setArchetypeData] = useState<{ cluster: Cluster; archetype: Archetype } | null>(null);
  const [archetypeLoading, setArchetypeLoading] = useState(false);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const contextCardsRef = useRef<HTMLDivElement>(null);

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
          `${import.meta.env.VITE_BACKEND_URL}/api/userdashboard/${userId}`
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
            `${import.meta.env.VITE_BACKEND_URL}/api/userdashboard/${userId}`,
            {
              headers: {
                'Content-Type': 'application/json',
              },
            }
          );
          console.log('Dashboard data response:', response.data);
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

  // Fetch archetype data from latest assessment
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

  // Handle context cards scroll animation
  useEffect(() => {
    const handleScroll = () => {
      if (!contextCardsRef.current) return;
      const scrollLeft = contextCardsRef.current.scrollLeft;
      const cardWidth = contextCardsRef.current.offsetWidth;
      const newIndex = Math.round(scrollLeft / cardWidth);
      console.log('Scroll position:', scrollLeft, 'Card width:', cardWidth, 'New index:', newIndex);
      setCurrentCardIndex(newIndex);
    };

    const cardsElement = contextCardsRef.current;
    if (cardsElement) {
      cardsElement.addEventListener('scroll', handleScroll, { passive: true });
      // Set initial index
      handleScroll();
      return () => cardsElement.removeEventListener('scroll', handleScroll);
    }
  }, [archetypeData]);

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
      // Data is already sorted, so just return the first item
      return data[0];
    }
    return null;
  };

  // Get button content based on latest assessment payment status
  const getButtonContent = () => {
    const latestAssessment = getLatestAssessment();
    
    if (!latestAssessment) {
      return {
        text: 'Start Assessment',
        icon: <Plus className="w-4 h-4" />,
        className: 'from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600'
      };
    }
    
    if (latestAssessment.ispaymentdone === "success") {
      if (latestAssessment.quest_status === "generated") {
        // Payment done and PDF ready
        return {
          text: 'Get Your PDF',
          icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          ),
          className: 'from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600'
        };
      } else {
        // Payment done but PDF generating
        return {
          text: 'Processing',
          icon: <Clock className="w-4 h-4" />,
          className: 'from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600'
        };
      }
    } else {
      // Payment not done
      return {
        text: 'Unlock',
        icon: <Unlock className="w-4 h-4" />,
        className: 'from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600'
      };
    }
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

  // Handle unlock potential button with different logic based on state
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
      <main className="px-6 -mt-10 relative z-20 pb-16">
        {/* Archetype Insights Section */}
        <section className="mb-6">
          {archetypeLoading ? (
            <div className="flex items-center justify-center py-16">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600 font-['Gilroy-bold']">Loading your insights...</p>
              </div>
            </div>
          ) : archetypeData ? (
            <div className="relative">
              {/* Horizontal Scrollable Main Cards */}
              <div 
                ref={contextCardsRef}
                className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide gap-4 pb-2"
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
                      {/* Tag */}
                      <div className="absolute top-4 right-4 z-20">
                        <motion.div 
                          initial={{ x: 20, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: 0.3 }}
                          className="bg-gradient-to-r from-[#003366] to-[#004A7F] text-white px-5 py-2.5 font-['Gilroy-Bold'] text-xs rounded-full uppercase tracking-wider shadow-lg backdrop-blur-sm border border-white/20"
                        >
                          {archetypeData.cluster.name}
                        </motion.div>
                      </div>
                      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-600"></div>
                    </div>
                    
                    {/* Content Section */}
                    <div className="px-6 pt-5 pb-7 relative flex-1 flex flex-col">
                      <div>
                        <motion.div
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.1 }}
                          className="inline-flex items-center gap-2.5 mb-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full shadow-lg"
                        >
                          <User className="w-4 h-4 text-white" />
                          <span className="text-[11px] font-['Gilroy-Bold'] text-white uppercase tracking-[0.08em] leading-none">How You See Yourself</span>
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
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
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

              {/* Scroll Indicators */}
              <div className="flex justify-center gap-2 mt-4">
                {[0, 1, 2].map((index) => (
                  <button
                    key={index}
                    onClick={() => {
                      console.log('Indicator clicked:', index);
                      if (contextCardsRef.current) {
                        const cardWidth = contextCardsRef.current.offsetWidth;
                        contextCardsRef.current.scrollTo({
                          left: cardWidth * index,
                          behavior: 'smooth'
                        });
                      }
                    }}
                    className={`h-2 rounded-full transition-all duration-300 hover:opacity-80 ${
                      currentCardIndex === index ? 'w-8 bg-blue-600' : 'w-2 bg-gray-300 hover:bg-gray-400'
                    }`}
                    aria-label={`Go to card ${index + 1}`}
                  />
                ))}
              </div>
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
                className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-['Gilroy-Bold'] rounded-lg transition-all duration-200 transform hover:scale-105"
              >
                Start Assessment
              </button>
            </div>
          )}
        </section>

      </main>

      {/* Bottom Navigation */}
      <footer className="fixed bottom-0 left-0 right-0 bg-white shadow-t flex justify-around py-3 border-t z-50">
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