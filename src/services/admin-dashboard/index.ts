// Export all types
export * from './types';
import { supabase } from '@/integrations/supabase/client';
import { DashboardResponse, DashboardStats, QuickStats } from './types';

/**
 * Fetch dashboard statistics from all relevant tables
 * This aggregates data from users, summaries, payments, and feedback
 */
export const fetchDashboardStats = async (): Promise<DashboardResponse> => {
  try {
    console.log('🔍 Fetching dashboard statistics...');

    // Calculate date ranges
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // Parallel fetch all statistics
    const [
      // Users statistics
      usersResult,
      newUsersResult,
      activeUsersResult,
      
      // Summaries statistics
      summariesResult,
      paidSummariesResult,
      recentSummariesResult,
      
      // Payments statistics
      paymentsResult,
      revenueThisMonthResult,
      
      // Feedback statistics
      feedbackResult,
      recentFeedbackResult
    ] = await Promise.all([
      // Users queries
      supabase.from('user_data').select('id', { count: 'exact' }),
      supabase.from('user_data').select('id', { count: 'exact' }).gte('last_used', thirtyDaysAgo.toISOString()),
      supabase.from('user_data').select('id', { count: 'exact' }).gte('last_used', sevenDaysAgo.toISOString()),
      
      // Summaries queries
      supabase.from('summary_generation').select('id', { count: 'exact' }),
      supabase.from('summary_generation').select('id', { count: 'exact' }).in('payment_status', ['success', 'completed']),
      supabase.from('summary_generation').select('id', { count: 'exact' }).gte('starting_time', thirtyDaysAgo.toISOString()),
      
      // Payments queries
      supabase.from('transaction_details').select('total_paid, status', { count: 'exact' }),
      supabase.from('transaction_details').select('total_paid').eq('status', 'success').gte('payment_completed_time', startOfMonth.toISOString()),
      
      // Feedback queries
      supabase.from('summary_overall_feedback').select('rating', { count: 'exact' }),
      supabase.from('summary_overall_feedback').select('id', { count: 'exact' }).gte('created_at', thirtyDaysAgo.toISOString())
    ]);

    // Process users data
    const totalUsers = usersResult.count || 0;
    const newUsersLast30Days = newUsersResult.count || 0;
    const activeUsersLast7Days = activeUsersResult.count || 0;

    // Process summaries data
    const totalSummaries = summariesResult.count || 0;
    const paidSummaries = paidSummariesResult.count || 0;
    const summariesLast30Days = recentSummariesResult.count || 0;

    // Process payments data
    const allPayments = paymentsResult.data || [];
    const totalTransactions = paymentsResult.count || 0;
    const successfulPayments = allPayments.filter(p => p.status === 'success').length;
    
    // Calculate total revenue (sum of successful payments)
    const totalRevenue = allPayments
      .filter(p => p.status === 'success')
      .reduce((sum, p) => sum + (parseFloat(p.total_paid) || 0), 0);
    
    // Calculate revenue this month
    const monthlyPayments = revenueThisMonthResult.data || [];
    const revenueThisMonth = monthlyPayments
      .reduce((sum, p) => sum + (parseFloat(p.total_paid) || 0), 0);

    // Process feedback data
    const totalFeedbacks = feedbackResult.count || 0;
    const recentFeedbacksLast30Days = recentFeedbackResult.count || 0;
    
    // Calculate average rating
    const ratings = feedbackResult.data?.map(f => parseInt(f.rating || '0')).filter(r => r > 0) || [];
    const averageRating = ratings.length > 0 
      ? parseFloat((ratings.reduce((sum, r) => sum + r, 0) / ratings.length).toFixed(1))
      : 0;

    // Compile dashboard statistics
    const dashboardStats: DashboardStats = {
      users: {
        totalUsers,
        newUsersLast30Days,
        activeUsersLast7Days,
      },
      summaries: {
        totalSummaries,
        paidSummaries,
        summariesLast30Days,
      },
      payments: {
        totalRevenue: totalRevenue / 100, // Convert from cents to dollars/rupees
        totalTransactions,
        revenueThisMonth: revenueThisMonth / 100, // Convert from cents
        successfulPayments,
      },
      feedback: {
        totalFeedbacks,
        averageRating,
        feedbacksLast30Days: recentFeedbacksLast30Days,
      },
    };

    console.log('✅ Dashboard stats fetched successfully:', dashboardStats);

    return {
      success: true,
      data: dashboardStats,
    };
  } catch (error: any) {
    console.error('❌ Error fetching dashboard stats:', error);
    return {
      success: false,
      error: error?.message || 'Failed to fetch dashboard statistics',
    };
  }
};

/**
 * Format dashboard stats into display-ready cards
 */
export const formatQuickStats = (stats: DashboardStats): QuickStats[] => {
  return [
    {
      label: 'Total Users',
      value: stats.users.totalUsers.toLocaleString(),
      change: {
        value: stats.users.newUsersLast30Days,
        type: 'increase',
        period: 'last 30 days'
      },
      icon: 'users',
      color: 'blue',
    },
    {
      label: 'Generated Summaries',
      value: stats.summaries.totalSummaries.toLocaleString(),
      change: {
        value: stats.summaries.summariesLast30Days,
        type: 'increase',
        period: 'last 30 days'
      },
      icon: 'summaries',
      color: 'green',
    },
    {
      label: 'Total Revenue',
      value: `$${stats.payments.totalRevenue.toLocaleString()}`,
      change: {
        value: Math.round(stats.payments.revenueThisMonth),
        type: 'increase',
        period: 'this month'
      },
      icon: 'payments',
      color: 'purple',
    },
    {
      label: 'Customer Feedback',
      value: `${stats.feedback.totalFeedbacks.toLocaleString()} (${stats.feedback.averageRating}⭐)`,
      change: {
        value: stats.feedback.feedbacksLast30Days,
        type: 'increase',
        period: 'last 30 days'
      },
      icon: 'feedback',
      color: 'orange',
    },
  ];
};

/**
 * Get additional dashboard insights
 */
export const getDashboardInsights = (stats: DashboardStats) => {
  return {
    userEngagement: {
      activeUsersRatio: stats.users.totalUsers > 0 
        ? Math.round((stats.users.activeUsersLast7Days / stats.users.totalUsers) * 100)
        : 0,
      newUserGrowth: stats.users.newUsersLast30Days,
    },
    businessMetrics: {
      conversionRate: stats.summaries.totalSummaries > 0
        ? Math.round((stats.summaries.paidSummaries / stats.summaries.totalSummaries) * 100)
        : 0,
      averageRevenue: stats.payments.successfulPayments > 0
        ? Math.round(stats.payments.totalRevenue / stats.payments.successfulPayments)
        : 0,
      paymentSuccessRate: stats.payments.totalTransactions > 0
        ? Math.round((stats.payments.successfulPayments / stats.payments.totalTransactions) * 100)
        : 0,
    },
    qualityMetrics: {
      customerSatisfaction: stats.feedback.averageRating,
      feedbackVolume: stats.feedback.totalFeedbacks,
    },
  };
};