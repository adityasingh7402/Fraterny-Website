import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import {
  getInfluencerByEmail,
  getDashboardStats,
  getRecentActivity,
  getConversionFunnel,
  getPerformanceData,
  generateAffiliateLink,
  type InfluencerProfile,
  type DashboardStats,
  type RecentActivity,
  type ConversionFunnel,
  type PerformanceData,
} from '@/services/influencer-dashboard';
import {
  Users,
  TrendingUp,
  DollarSign,
  MousePointer,
  Copy,
  Download,
  LogOut,
  Loader2,
  Clock,
  ChevronRight,
  Calendar,
  BarChart3,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import QRCode from 'qrcode';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const AffiliatesDashboard: React.FC = () => {
  const { user, isLoading: authLoading, signOut } = useAuth();
  const navigate = useNavigate();
  
  // State
  const [loading, setLoading] = useState(true);
  const [influencer, setInfluencer] = useState<InfluencerProfile | null>(null);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [funnel, setFunnel] = useState<ConversionFunnel | null>(null);
  const [performanceData, setPerformanceData] = useState<PerformanceData[]>([]);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [dateRange, setDateRange] = useState<'7d' | '30d' | '90d' | 'all'>('30d');

  const qrCanvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!authLoading) {
      if (!user || !user.email) {
        navigate('/affiliates');
      } else {
        loadDashboardData(user.email);
      }
    }
  }, [user, authLoading, navigate]);

  const loadDashboardData = async (email: string) => {
    setLoading(true);
    try {
      // Get influencer profile
      const influencerResponse = await getInfluencerByEmail(email);
      
      if (!influencerResponse.success || !influencerResponse.data) {
        toast.error('Access Denied', {
          description: 'You are not registered as an influencer.',
        });
        navigate('/affiliates');
        return;
      }

      const influencerData = influencerResponse.data;
      setInfluencer(influencerData);

      // Load all dashboard data in parallel
      const [statsResponse, activityResponse, funnelResponse, performanceResponse] = await Promise.all([
        getDashboardStats(influencerData.affiliate_code),
        getRecentActivity(influencerData.affiliate_code, 10),
        getConversionFunnel(influencerData.affiliate_code),
        getPerformanceData(influencerData.affiliate_code),
      ]);

      if (statsResponse.success && statsResponse.data) {
        setStats(statsResponse.data);
      }

      if (activityResponse.success && activityResponse.data) {
        setRecentActivity(activityResponse.data);
      }

      if (funnelResponse.success && funnelResponse.data) {
        setFunnel(funnelResponse.data);
      }

      if (performanceResponse.success && performanceResponse.data) {
        setPerformanceData(performanceResponse.data);
      }

      // Generate QR code
      const affiliateLink = generateAffiliateLink(influencerData.affiliate_code);
      const qrUrl = await QRCode.toDataURL(affiliateLink, {
        width: 256,
        margin: 2,
        color: {
          dark: '#0C45F0',
          light: '#FFFFFF',
        },
      });
      setQrCodeUrl(qrUrl);
    } catch (error) {
      console.error('Error loading dashboard:', error);
      toast.error('Error', {
        description: 'Failed to load dashboard data',
      });
    } finally {
      setLoading(false);
    }
  };

  const copyAffiliateLink = () => {
    if (!influencer) return;
    const link = generateAffiliateLink(influencer.affiliate_code);
    navigator.clipboard.writeText(link);
    toast.success('Link Copied!', {
      description: 'Affiliate link copied to clipboard',
    });
  };

  const downloadQRCode = () => {
    if (!qrCodeUrl) return;
    const link = document.createElement('a');
    link.download = `affiliate-qr-${influencer?.affiliate_code}.png`;
    link.href = qrCodeUrl;
    link.click();
    toast.success('QR Code Downloaded!');
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/affiliates');
  };

  const formatCurrency = (amount: number) => `₹${amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  const getTimeAgo = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) return `${seconds}s ago`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!influencer || !stats) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-600">Failed to load dashboard data</p>
      </div>
    );
  }

  const affiliateLink = generateAffiliateLink(influencer.affiliate_code);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Affiliate Dashboard</h1>
              <p className="text-sm text-gray-600">Welcome back, {influencer.name}</p>
            </div>
            <button
              onClick={handleSignOut}
              className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <LogOut className="h-4 w-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">Total Clicks</h3>
              <MousePointer className="h-5 w-5 text-blue-500" />
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats.totalClicks.toLocaleString()}</p>
            <p className="text-xs text-gray-500 mt-1">All-time clicks</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">Total Signups</h3>
              <Users className="h-5 w-5 text-green-500" />
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats.totalSignups.toLocaleString()}</p>
            <p className="text-xs text-green-600 mt-1">{stats.clickToSignup}% conversion</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">PDF Sales</h3>
              <TrendingUp className="h-5 w-5 text-purple-500" />
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats.totalPurchases.toLocaleString()}</p>
            <p className="text-xs text-purple-600 mt-1">{stats.conversionRate}% overall</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 shadow-sm text-white"
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-white/90">Total Earnings</h3>
              <DollarSign className="h-5 w-5 text-white" />
            </div>
            <p className="text-3xl font-bold">{formatCurrency(stats.totalEarnings)}</p>
            <p className="text-xs text-white/80 mt-1">Commission: {influencer.commission_rate}%</p>
          </motion.div>
        </div>

        {/* Affiliate Link Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-8"
        >
          <h2 className="text-xl font-bold text-gray-900 mb-4">Your Affiliate Link</h2>
          <div className="flex flex-col md:flex-row gap-4 items-start">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-4">
                <input
                  type="text"
                  value={affiliateLink}
                  readOnly
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 font-mono text-sm"
                />
                <button
                  onClick={copyAffiliateLink}
                  className="flex items-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Copy className="h-4 w-4" />
                  <span>Copy</span>
                </button>
              </div>
              <p className="text-sm text-gray-600">
                Share this link on your social media, website, or anywhere else to track referrals and earn commissions.
              </p>
            </div>
            <div className="flex flex-col items-center gap-2">
              {qrCodeUrl && (
                <>
                  <img src={qrCodeUrl} alt="QR Code" className="w-32 h-32 border-2 border-gray-200 rounded-lg" />
                  <button
                    onClick={downloadQRCode}
                    className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700"
                  >
                    <Download className="h-4 w-4" />
                    <span>Download QR</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Performance Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Performance Over Time</h2>
              <BarChart3 className="h-5 w-5 text-gray-400" />
            </div>
            {performanceData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="date" stroke="#9ca3af" fontSize={12} />
                  <YAxis stroke="#9ca3af" fontSize={12} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                  />
                  <Line type="monotone" dataKey="clicks" stroke="#3b82f6" strokeWidth={2} dot={{ fill: '#3b82f6' }} />
                  <Line type="monotone" dataKey="signups" stroke="#10b981" strokeWidth={2} dot={{ fill: '#10b981' }} />
                  <Line type="monotone" dataKey="purchases" stroke="#8b5cf6" strokeWidth={2} dot={{ fill: '#8b5cf6' }} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-gray-500">
                No data available yet
              </div>
            )}
          </motion.div>

          {/* Conversion Funnel */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-6">Conversion Funnel</h2>
            {funnel && (
              <div className="space-y-4">
                <div className="relative">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Clicks</span>
                    <span className="text-lg font-bold text-gray-900">{funnel.clicks}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div className="bg-blue-500 h-3 rounded-full" style={{ width: '100%' }}></div>
                  </div>
                </div>

                <div className="flex items-center justify-center">
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                  <span className="text-xs text-green-600 font-medium">{funnel.clickToSignupRate}%</span>
                </div>

                <div className="relative">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Signups</span>
                    <span className="text-lg font-bold text-gray-900">{funnel.signups}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-green-500 h-3 rounded-full" 
                      style={{ width: `${funnel.clicks > 0 ? (funnel.signups / funnel.clicks) * 100 : 0}%` }}
                    ></div>
                  </div>
                </div>

                <div className="flex items-center justify-center">
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                  <span className="text-xs text-green-600 font-medium">{funnel.signupToQuestionnaireRate}%</span>
                </div>

                <div className="relative">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Questionnaires</span>
                    <span className="text-lg font-bold text-gray-900">{funnel.questionnairesCompleted}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-yellow-500 h-3 rounded-full" 
                      style={{ width: `${funnel.clicks > 0 ? (funnel.questionnairesCompleted / funnel.clicks) * 100 : 0}%` }}
                    ></div>
                  </div>
                </div>

                <div className="flex items-center justify-center">
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                  <span className="text-xs text-green-600 font-medium">{funnel.questionnaireToPurchaseRate}%</span>
                </div>

                <div className="relative">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Purchases</span>
                    <span className="text-lg font-bold text-gray-900">{funnel.purchases}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-purple-500 h-3 rounded-full" 
                      style={{ width: `${funnel.clicks > 0 ? (funnel.purchases / funnel.clicks) * 100 : 0}%` }}
                    ></div>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-sm font-medium text-blue-900">Overall Conversion Rate</p>
                  <p className="text-2xl font-bold text-blue-600">{funnel.overallConversionRate}%</p>
                </div>
              </div>
            )}
          </motion.div>
        </div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
        >
          <h2 className="text-xl font-bold text-gray-900 mb-6">Recent Activity</h2>
          {recentActivity.length > 0 ? (
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="flex-shrink-0 mt-1">
                    <Clock className="h-5 w-5 text-gray-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">{activity.description}</p>
                    <p className="text-xs text-gray-500 mt-1">{getTimeAgo(activity.timestamp)}</p>
                  </div>
                  {activity.earnings && (
                    <div className="flex-shrink-0">
                      <span className="text-sm font-bold text-green-600">
                        +{formatCurrency(activity.earnings)}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <p>No activity yet</p>
              <p className="text-sm mt-2">Start sharing your affiliate link to see activity here</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default AffiliatesDashboard;
