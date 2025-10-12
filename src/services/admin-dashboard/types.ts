export interface DashboardStats {
  users: {
    totalUsers: number;
    newUsersLast30Days: number;
    activeUsersLast7Days: number;
  };
  summaries: {
    totalSummaries: number;
    paidSummaries: number;
    summariesLast30Days: number;
  };
  payments: {
    totalRevenue: number; // For backward compatibility
    totalRevenueUSD: number;
    totalRevenueINR: number;
    totalTransactions: number;
    revenueThisMonth: number; // For backward compatibility
    revenueThisMonthUSD: number;
    revenueThisMonthINR: number;
    successfulPayments: number;
    // Regional breakdown
    indiaRevenueUSD: number; // USD from India (Razorpay with IsIndia=false)
    indiaRevenueINR: number; // INR from India (Razorpay with IsIndia=true)
    internationalRevenueUSD: number; // USD from International (PayPal)
  };
  feedback: {
    totalFeedbacks: number;
    averageRating: number;
    feedbacksLast30Days: number;
  };
}

export interface DashboardResponse {
  success: boolean;
  data?: DashboardStats;
  error?: string;
}

export interface QuickStats {
  label: string;
  value: string;
  change?: {
    value: number;
    type: 'increase' | 'decrease';
    period: string;
  };
  icon: 'users' | 'summaries' | 'payments' | 'feedback';
  color: 'blue' | 'green' | 'purple' | 'orange';
}