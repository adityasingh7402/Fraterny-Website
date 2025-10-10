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
    totalRevenue: number;
    totalTransactions: number;
    revenueThisMonth: number;
    successfulPayments: number;
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