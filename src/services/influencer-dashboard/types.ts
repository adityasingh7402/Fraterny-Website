// Influencer Dashboard Types

export interface InfluencerProfile {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  profile_image: string | null;
  bio: string | null;
  social_links: {
    instagram?: string;
    twitter?: string;
    youtube?: string;
    linkedin?: string;
  } | null;
  affiliate_code: string;
  commission_rate: number;
  status: 'active' | 'inactive' | 'suspended';
  is_india: boolean | null;
  payment_info: {
    bank_name?: string;
    account_number?: string;
    ifsc?: string;
    upi?: string;
  } | null;
  total_earnings: number;
  total_clicks: number;
  total_signups: number;
  total_purchases: number;
  conversion_rate: number;
  remaining_balance: number;
  total_paid: number;
  created_at: string;
  updated_at: string;
  last_activity_at: string | null;
}

export interface DashboardStats {
  totalClicks: number;
  totalSignups: number;
  totalQuestionnaires?: number;
  totalPurchases: number;
  totalEarnings: number;
  conversionRate: number;
  clickToSignup: number;
  signupToPurchase: number;
}

export interface TrackingEvent {
  id: string;
  affiliate_code: string;
  user_id: string | null;
  session_id: string | null;
  test_id: string | null;
  event_type: 'click' | 'signup' | 'questionnaire_completed' | 'pdf_purchased';
  ip_address: string | null;
  device_info: any;
  location: string | null;
  metadata: any;
  revenue: number;
  commission_earned: number;
  conversion_value: number | null;
  timestamp: string;
}

export interface RecentActivity {
  id: string;
  type: 'click' | 'signup' | 'questionnaire_completed' | 'pdf_purchased';
  description: string;
  timestamp: string;
  earnings?: number;
}

export interface ConversionFunnel {
  clicks: number;
  signups: number;
  questionnairesCompleted: number;
  purchases: number;
  clickToSignupRate: number;
  signupToQuestionnaireRate: number;
  questionnaireToPurchaseRate: number;
  overallConversionRate: number;
}

export interface PerformanceData {
  date: string;
  clicks: number;
  signups: number;
  purchases: number;
}

export interface DateRange {
  startDate: string;
  endDate: string;
}

export interface DashboardResponse<T> {
  success: boolean;
  data: T | null;
  error: string | null;
}
