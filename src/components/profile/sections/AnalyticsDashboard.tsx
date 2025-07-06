import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown,
  Calendar,
  Clock,
  Target,
  Brain,
  Activity,
  Zap,
  Award,
  Filter,
  Download,
  RefreshCw,
  Info,
  ChevronDown,
  Flame,
  Users,
  Eye,
  Loader2
} from 'lucide-react';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useSectionRevealAnimation } from '../../../hooks/useSectionRevealAnimation';
import { profileMotionVariants, getMotionVariants } from '../../../lib/motion/variants';
import { useAnalyticsData, useProfileData } from '../../../hooks/profile/useProfileData';

interface AnalyticsDashboardProps {
  className?: string;
}

export default function AnalyticsDashboard({ className = '' }: AnalyticsDashboardProps) {
  const [selectedPeriod, setSelectedPeriod] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  const [selectedMetric, setSelectedMetric] = useState<'engagement' | 'quests' | 'time'>('engagement');

  // Fetch real data from backend
  const { 
    data: analyticsData, 
    isLoading: analyticsLoading, 
    error: analyticsError,
    refetch: refetchAnalytics 
  } = useAnalyticsData(selectedPeriod);

  const { 
    data: profileData, 
    isLoading: profileLoading 
  } = useProfileData();

  const isLoading = analyticsLoading || profileLoading;
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Animation setup
  const {
    ref: containerRef,
    parentVariants,
    childVariants,
    isMobile,
    isInView
  } = useSectionRevealAnimation({
    variant: 'professional',
    once: true,
    amount: 0.2,
    staggerChildren: 0.1,
    delayChildren: 0.2
  });

  const motionVariants = getMotionVariants(isMobile);

  // Process real data for charts
  const chartData = useMemo(() => {
    if (!analyticsData?.weeklyActivity) return [];
    
    return analyticsData.weeklyActivity.map((item, index) => ({
      period: selectedPeriod === '7d' ? new Date(item.date).toLocaleDateString('en-US', { weekday: 'short' }) :
              selectedPeriod === '30d' ? `Day ${index + 1}` :
              selectedPeriod === '90d' ? `Week ${Math.floor(index / 7) + 1}` :
              new Date(item.date).toLocaleDateString('en-US', { month: 'short' }),
      engagement: item.engagement,
      sessions: item.sessions,
      duration: item.duration
    }));
  }, [analyticsData?.weeklyActivity, selectedPeriod]);

  // Process category distribution for pie chart
  const categoryData = useMemo(() => {
    if (!analyticsData?.categoryDistribution) return [];
    
    const colors = ['#3B82F6', '#10B981', '#8B5CF6', '#F59E0B', '#EF4444'];
    return analyticsData.categoryDistribution.map((item, index) => ({
      name: item.category,
      value: item.percentage,
      count: item.count,
      color: colors[index % colors.length]
    }));
  }, [analyticsData?.categoryDistribution]);

  // Generate insights based on real data
  const insights = useMemo(() => {
    if (!analyticsData) return [];

    const insights = [];
    
    // Engagement trend insight
    if (analyticsData.engagementScore > 80) {
      insights.push({
        id: '1',
        type: 'positive',
        icon: TrendingUp,
        title: 'High Engagement',
        description: `Your engagement score of ${analyticsData.engagementScore}% is excellent!`,
        metric: `${analyticsData.engagementScore}%`,
        color: 'text-green-600 dark:text-green-400'
      });
    }

    // Quest completion insight
    const completionRate = analyticsData.totalQuests > 0 
      ? Math.round((analyticsData.completedQuests / analyticsData.totalQuests) * 100)
      : 0;
    
    if (completionRate < 80) {
      insights.push({
        id: '2',
        type: 'improvement',
        icon: Target,
        title: 'Completion Opportunity',
        description: `Complete pending quests to improve your ${completionRate}% completion rate`,
        metric: `${completionRate}%`,
        color: 'text-orange-600 dark:text-orange-400'
      });
    }

    // Streak insight
    if (analyticsData.streakDays > 0) {
      insights.push({
        id: '3',
        type: 'achievement',
        icon: Flame,
        title: 'Active Streak',
        description: `You're on a ${analyticsData.streakDays}-day completion streak!`,
        metric: `${analyticsData.streakDays} days`,
        color: 'text-purple-600 dark:text-purple-400'
      });
    }

    // Session duration insight
    if (analyticsData.averageSessionDuration > 20) {
      insights.push({
        id: '4',
        type: 'neutral',
        icon: Clock,
        title: 'Thoughtful Responses',
        description: `Your ${analyticsData.averageSessionDuration}-minute average shows deep engagement`,
        metric: `${analyticsData.averageSessionDuration}m`,
        color: 'text-blue-600 dark:text-blue-400'
      });
    }

    return insights;
  }, [analyticsData]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refetchAnalytics();
    } catch (error) {
      console.error('Failed to refresh analytics:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const formatTime = (minutes: number) => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700 shadow-lg">
          <p className="text-slate-900 dark:text-white font-medium">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.value}{entry.name === 'engagement' ? '%' : entry.name === 'timeSpent' ? 'm' : ''}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div
      ref={containerRef}
      variants={parentVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      className={`p-6 lg:p-8 ${className}`}
    >
      {/* Header */}
      <motion.div
        variants={childVariants}
        className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8"
      >
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            Analytics Dashboard
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            Detailed insights into your engagement and progress patterns
          </p>
        </div>
        
        <div className="flex items-center space-x-3 mt-4 lg:mt-0">
          {/* Period Selector */}
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value as any)}
            className="px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 3 months</option>
            <option value="1y">Last year</option>
          </select>

          <motion.button
            variants={motionVariants.tabItem}
            whileHover="hover"
            whileTap="tap"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center space-x-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </motion.button>

          <motion.button
            variants={motionVariants.tabItem}
            whileHover="hover"
            whileTap="tap"
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Export</span>
          </motion.button>
        </div>
      </motion.div>

      {/* Loading State */}
      {isLoading && (
        <motion.div
          variants={childVariants}
          className="flex items-center justify-center py-12"
        >
          <div className="flex items-center space-x-3 text-slate-600 dark:text-slate-400">
            <Loader2 className="w-6 h-6 animate-spin" />
            <span>Loading analytics data...</span>
          </div>
        </motion.div>
      )}

      {/* Error State */}
      {analyticsError && (
        <motion.div
          variants={childVariants}
          className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-6 mb-8"
        >
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-red-100 dark:bg-red-900/50 rounded-xl">
              <Activity className="w-5 h-5 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <h3 className="font-semibold text-red-900 dark:text-red-100">
                Unable to load analytics
              </h3>
              <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                {analyticsError.message || 'Failed to fetch analytics data'}
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Content - only show when data is loaded */}
      {!isLoading && analyticsData && (
      <motion.div
        variants={childVariants}
        className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
      >
        <motion.div
          variants={motionVariants.profileCard}
          whileHover="hover"
          className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/50 dark:border-slate-700/50 shadow-sm"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-xl">
              <Brain className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <div className="text-sm text-slate-500 dark:text-slate-400">
            Engagement Score
          </div>
        </motion.div>

        <motion.div
          variants={motionVariants.profileCard}
          whileHover="hover"
          className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/50 dark:border-slate-700/50 shadow-sm"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-xl">
              <Target className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
          <div className="text-sm text-slate-500 dark:text-slate-400">
            Quests Completed
          </div>
        </motion.div>

        <motion.div
          variants={motionVariants.profileCard}
          whileHover="hover"
          className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/50 dark:border-slate-700/50 shadow-sm"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-xl">
              <Clock className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
          <div className="text-sm text-slate-500 dark:text-slate-400">
            Avg Session
          </div>
        </motion.div>

        <motion.div
          variants={motionVariants.profileCard}
          whileHover="hover"
          className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/50 dark:border-slate-700/50 shadow-sm"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-orange-100 dark:bg-orange-900/20 rounded-xl">
              <Flame className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
          </div>
          <div className="text-sm text-slate-500 dark:text-slate-400">
            Day Streak
          </div>
        </motion.div>
      </motion.div>
      )}


    </motion.div>
  );
}