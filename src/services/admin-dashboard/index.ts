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

    // Create filter function for excluding test data
    // Exclude records where user_name, email, or dob contains 'test' (case-insensitive)
    const applyTestDataFilter = (query: any) => {
      return query
        .not('user_name', 'ilike', '%test%')
        .not('email', 'ilike', '%test%')
        .not('dob', 'ilike', '%test%');
    };

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
      // Users queries - exclude test users
      applyTestDataFilter(supabase.from('user_data').select('user_id', { count: 'exact' })),
      applyTestDataFilter(supabase.from('user_data').select('user_id', { count: 'exact' }).gte('last_used', thirtyDaysAgo.toISOString())),
      applyTestDataFilter(supabase.from('user_data').select('user_id', { count: 'exact' }).gte('last_used', sevenDaysAgo.toISOString())),
      
      // Summaries queries - filter by BOTH user_data fields AND question_answer content
      supabase.from('summary_generation')
        .select(`
          id, question_answer,
          user_data!inner(
            user_id, user_name, email, dob
          )
        `, { count: 'exact' })
        .not('user_data.user_name', 'ilike', '%test%')
        .not('user_data.email', 'ilike', '%test%')
        .not('user_data.dob', 'ilike', '%test%')
        .not('question_answer', 'ilike', '%test%'),
        
      supabase.from('summary_generation')
        .select(`
          id, question_answer,
          user_data!inner(
            user_id, user_name, email, dob
          )
        `, { count: 'exact' })
        .in('payment_status', ['success', 'completed'])
        .not('user_data.user_name', 'ilike', '%test%')
        .not('user_data.email', 'ilike', '%test%')
        .not('user_data.dob', 'ilike', '%test%')
        .not('question_answer', 'ilike', '%test%'),
        
      supabase.from('summary_generation')
        .select(`
          id, question_answer,
          user_data!inner(
            user_id, user_name, email, dob
          )
        `, { count: 'exact' })
        .gte('starting_time', thirtyDaysAgo.toISOString())
        .not('user_data.user_name', 'ilike', '%test%')
        .not('user_data.email', 'ilike', '%test%')
        .not('user_data.dob', 'ilike', '%test%')
        .not('question_answer', 'ilike', '%test%'),
      
      // Payments queries - filter by user_data fields AND summary question_answer content
      // This ensures if EITHER the user data OR the summary question_answer has test data, the transaction is excluded
      supabase.from('transaction_details')
        .select(`
          total_paid, status, gateway, IsIndia,
          user_data!inner(
            user_id, user_name, email, dob
          ),
          summary_generation!inner(
            testid, user_id, question_answer
          )
        `, { count: 'exact' })
        .not('user_data.user_name', 'ilike', '%test%')
        .not('user_data.email', 'ilike', '%test%')
        .not('user_data.dob', 'ilike', '%test%')
        .not('summary_generation.question_answer', 'ilike', '%test%'),
        
      supabase.from('transaction_details')
        .select(`
          total_paid, gateway, IsIndia,
          user_data!inner(
            user_id, user_name, email, dob
          ),
          summary_generation!inner(
            testid, user_id, question_answer
          )
        `)
        .eq('status', 'success')
        .gte('payment_completed_time', startOfMonth.toISOString())
        .not('user_data.user_name', 'ilike', '%test%')
        .not('user_data.email', 'ilike', '%test%')
        .not('user_data.dob', 'ilike', '%test%')
        .not('summary_generation.question_answer', 'ilike', '%test%'),
      
      // Feedback queries - join with user_data to filter by user fields
      supabase.from('summary_overall_feedback')
        .select(`
          rating,
          user_data!inner(
            user_id, user_name, email, dob
          )
        `, { count: 'exact' })
        .not('user_data.user_name', 'ilike', '%test%')
        .not('user_data.email', 'ilike', '%test%')
        .not('user_data.dob', 'ilike', '%test%'),
        
      supabase.from('summary_overall_feedback')
        .select(`
          id,
          user_data!inner(
            user_id, user_name, email, dob
          )
        `, { count: 'exact' })
        .gte('created_at', thirtyDaysAgo.toISOString())
        .not('user_data.user_name', 'ilike', '%test%')
        .not('user_data.email', 'ilike', '%test%')
        .not('user_data.dob', 'ilike', '%test%')
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
    
    // Helper function to determine currency and calculate amount with regional breakdown
    const calculateCurrencyAmount = (payment: any) => {
      const amount = (parseFloat(payment.total_paid) || 0) / 100; // Convert from cents/paise
      
      // Determine currency based on gateway
      let isUSD = false;
      let isINR = false;
      
      if (payment.gateway === 'paypal') {
        isUSD = true; // PayPal is always USD
      } else if (payment.gateway === 'Razorpay') {
        if (payment.IsIndia === true) {
          isINR = true; // Razorpay in India = INR
        } else {
          isUSD = true; // Razorpay international = USD
        }
      }
      
      // Now determine region based on IsIndia flag (regardless of gateway)
      const isFromIndia = payment.IsIndia === true;
      
      if (isFromIndia) {
        // Payment from India (can be PayPal USD or Razorpay INR)
        return {
          usd: isUSD ? amount : 0,
          inr: isINR ? amount : 0,
          indiaUSD: isUSD ? amount : 0,
          indiaINR: isINR ? amount : 0,
          internationalUSD: 0
        };
      } else {
        // Payment from International (can be PayPal USD or Razorpay USD)
        return {
          usd: isUSD ? amount : 0,
          inr: isINR ? amount : 0,
          indiaUSD: 0,
          indiaINR: 0,
          internationalUSD: isUSD ? amount : 0
        };
      }
    };
    
    // Calculate total revenue by currency and region
    const successfulPaymentData = allPayments.filter(p => p.status === 'success');
    const totalRevenueByCurrency = successfulPaymentData.reduce(
      (totals, payment) => {
        const { usd, inr, indiaUSD, indiaINR, internationalUSD } = calculateCurrencyAmount(payment);
        return {
          usd: totals.usd + usd,
          inr: totals.inr + inr,
          indiaUSD: totals.indiaUSD + indiaUSD,
          indiaINR: totals.indiaINR + indiaINR,
          internationalUSD: totals.internationalUSD + internationalUSD
        };
      },
      { usd: 0, inr: 0, indiaUSD: 0, indiaINR: 0, internationalUSD: 0 }
    );
    
    // Calculate revenue this month by currency and region
    const monthlyPayments = revenueThisMonthResult.data || [];
    const monthlyRevenueByCurrency = monthlyPayments.reduce(
      (totals, payment) => {
        const { usd, inr, indiaUSD, indiaINR, internationalUSD } = calculateCurrencyAmount(payment);
        return {
          usd: totals.usd + usd,
          inr: totals.inr + inr,
          indiaUSD: totals.indiaUSD + indiaUSD,
          indiaINR: totals.indiaINR + indiaINR,
          internationalUSD: totals.internationalUSD + internationalUSD
        };
      },
      { usd: 0, inr: 0, indiaUSD: 0, indiaINR: 0, internationalUSD: 0 }
    );
    
    // For backward compatibility, calculate total revenue (USD + INR, but this isn't ideal)
    const totalRevenue = totalRevenueByCurrency.usd + totalRevenueByCurrency.inr;
    const revenueThisMonth = monthlyRevenueByCurrency.usd + monthlyRevenueByCurrency.inr;

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
        totalRevenue: totalRevenue, // For backward compatibility
        totalRevenueUSD: totalRevenueByCurrency.usd,
        totalRevenueINR: totalRevenueByCurrency.inr,
        totalTransactions,
        revenueThisMonth: revenueThisMonth, // For backward compatibility
        revenueThisMonthUSD: monthlyRevenueByCurrency.usd,
        revenueThisMonthINR: monthlyRevenueByCurrency.inr,
        successfulPayments,
        // Regional breakdown
        indiaRevenueUSD: totalRevenueByCurrency.indiaUSD,
        indiaRevenueINR: totalRevenueByCurrency.indiaINR,
        internationalRevenueUSD: totalRevenueByCurrency.internationalUSD,
      },
      feedback: {
        totalFeedbacks,
        averageRating,
        feedbacksLast30Days: recentFeedbacksLast30Days,
      },
    };

    console.log('✅ Dashboard stats fetched successfully (excluding test data):', dashboardStats);

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
      value: `$${stats.payments.totalRevenueUSD.toLocaleString()} + ₹${stats.payments.totalRevenueINR.toLocaleString()}`,
      change: {
        value: Math.round(stats.payments.revenueThisMonthUSD + stats.payments.revenueThisMonthINR),
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