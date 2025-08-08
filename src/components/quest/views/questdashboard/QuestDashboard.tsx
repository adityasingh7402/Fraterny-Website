// /src/components/quest/views/questdashboard/QuestDashboard.tsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Lock, Download, Calendar, ExternalLink , FileText, AlertCircle } from 'lucide-react';
import { useAuth } from '../../../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import emailjs from '@emailjs/browser';
import { toast } from 'sonner';

const EMAILJS_SERVICE_ID = 'service_t02m05r';
const EMAILJS_TEMPLATE_ID = 'template_8ew3q9o'; 
const EMAILJS_PUBLIC_KEY = '5h8-GbUjfznY55GzW';


interface DashboardApiResponse {
  status: number;
  data: DashboardTest[];
}

// Interface for dashboard test data
interface DashboardTest {
  userid: string;
  testid: string;
  sessionid: string;
  testtaken: string;
  ispaymentdone: boolean;
  pdflink: string;
}

// Props interface
interface QuestDashboardProps {
  className?: string;
}

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
  const { user }: { user: { id?: string, email?: string, user_metadata?: { first_name?: string } } | null } = useAuth();
  const [data, setData] = useState<DashboardTest[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
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
      return dateString; // Return original if parsing fails
    }
  };

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user?.id) {
        setError('User not authenticated');
        setLoading(false);
        return;
      }

      // try {
      //   setLoading(true);
      //   setError(null);
        
      //   const response = await axios.get<DashboardApiResponse>(
      //     `https://api.fraterny.in/api/userdashboard/${user.id}`,
      //     {
      //       headers: {
      //         'Content-Type': 'application/json',
      //       },
      //     }
      //   );

      //   // Handle both single object and array responses
      //   const responseData = response.data.data; // This gets the actual array
      //   setData(responseData);
      // } catch (err: any) {
      //   console.error('Dashboard API error:', err);
      //   if (err.code === 'ECONNABORTED') {
      //     setError('Request timeout - please try again');
      //   } else if (err.response?.status === 404) {
      //     setError('No test data found');
      //   } else if (err.response?.status === 401) {
      //     setError('Unauthorized - please log in again');
      //   } else {
      //     setError('Failed to load dashboard data');
      //   }
      // } finally {
      //   setLoading(false);
      // }

    try {
        setLoading(true);
        setError(null);
        console.log('Fetching dashboard data for user:', user?.user_metadata?.first_name);
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Use mock data
        setData(MOCK_DATA);
    } catch (err: any) {
        setError('Failed to load dashboard data');
    } finally {
        setLoading(false);
        }
    };

    fetchDashboardData();
  }, [user?.id]);

  // Handle download actions
  const handleFreeReport = (testData: DashboardTest) => {
    navigate(`/quest-result/result/${testData.sessionid}/${testData.userid}/${testData.testid}`)
  };

  const handlePaidReport = async (testData: DashboardTest) => {
  if (testData.ispaymentdone) {
    try {
      // Send email with PDF link
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          user_name: user?.user_metadata?.first_name || 'User',
          user_email: user?.email,
          test_date: formatDate(testData.testtaken),
          session_id: testData.sessionid,
          pdf_link: testData.pdflink
        },
        EMAILJS_PUBLIC_KEY
      );
      
      toast.success('Email sent successfully with your report link!');
    } catch (error) {
      console.error('Email send failed:', error);
      toast.error('Failed to send email. Please try again.');
    }
  } else {
    console.log('Redirect to payment for:', testData.testid);
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
    <div className=' flex flex-col items-center justify-center w-full mb-8'>
        <div className='text-3xl font-normal font-["Gilroy-Bold"]'>
            QUEST
        </div>
        <div className='text-sm font-normal font-["Gilroy-Regular"] tracking-[0.1rem] pl-0 mt-[-8px]'>
            BY FRATERNY
        </div>
    </div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-['Gilroy-Bold'] text-white  mb-2">Test Dashboard</h1>
        <p className="font-['Gilroy-semiBold'] text-white">View and download your assessment reports</p>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-2xl overflow-hidden flex flex-col gap-2">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Test ID
                </th> */}
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date Taken
                </th>
                {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payment Status
                </th> */}
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
                  {/* Test ID */}
                  {/* <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {test.testid}
                  </td> */}

                  {/* Date Taken */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-2" />
                      {formatDate(test.testtaken)}
                    </div>
                  </td>

                  {/* Payment Status */}
                  {/* <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        test.ispaymentdone
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      <CreditCard className="w-3 h-3 mr-1" />
                      {test.ispaymentdone ? 'Paid' : 'Pending'}
                    </span>
                  </td> */}

                  {/* Free Report */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => handleFreeReport(test)}
                      className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-black"
                    >
                      {/* <Download className="w-4 h-4 mr-2" /> */}
                      <ExternalLink className="w-4 h-4 mr-2" />
                    </button>
                  </td>

                  {/* Paid Report */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    {test.ispaymentdone ? (
                      <button
                        onClick={() => handlePaidReport(test)}
                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Click here
                      </button>
                    ) : (
                      <button
                        onClick={() => handlePaidReport(test)}
                        className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm leading-4 font-medium rounded-md text-gray-500 bg-white/10 backdrop-blur-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors cursor-pointer"
                        style={{
                          background: 'rgba(255, 255, 255, 0.1)',
                          backdropFilter: 'blur(4px)',
                        }}
                      >
                        <Lock className="w-4 h-4 mr-2" />
                        Locked
                      </button>
                    )}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className='flex justify-between p-4 bg-red-500'>
          <button>Go to Homepage</button>
          <button> Take another test </button>
        </div>
      </div>
    </div>
  );
};

export default QuestDashboard;