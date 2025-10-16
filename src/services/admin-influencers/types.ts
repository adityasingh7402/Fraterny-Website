// Influencer data structure matching database schema
export interface InfluencerData {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  profile_image: string | null;
  bio: string | null;
  social_links: SocialLinks | null;
  affiliate_code: string;
  commission_rate: number;
  status: 'active' | 'inactive' | 'suspended';
  total_earnings: number;
  remaining_balance: number;
  total_paid: number;
  payment_info: PaymentInfo | null;
  total_clicks: number;
  total_signups: number;
  total_questionnaires: number;
  total_purchases: number;
  conversion_rate: number;
  created_at: string;
  updated_at: string;
  last_activity_at: string | null;
}

// Social media links structure
export interface SocialLinks {
  instagram?: string;
  twitter?: string;
  youtube?: string;
  linkedin?: string;
  facebook?: string;
}

// Payment information structure
export interface PaymentInfo {
  bank_name?: string;
  account_number?: string;
  ifsc?: string;
  upi?: string;
  paypal?: string;
}

// Filters for influencer queries
export interface InfluencerFilters {
  searchTerm?: string;
  status?: 'active' | 'inactive' | 'suspended';
  minEarnings?: number;
  maxEarnings?: number;
  minConversionRate?: number;
  maxConversionRate?: number;
  dateFrom?: string;
  dateTo?: string;
}

// Pagination parameters
export interface PaginationParams {
  page: number;
  pageSize: number;
}

// Pagination metadata
export interface PaginationMeta {
  currentPage: number;
  pageSize: number;
  totalRecords: number;
  totalPages: number;
}

// Statistics for dashboard cards
export interface InfluencerStats {
  totalInfluencers: number;
  activeInfluencers: number;
  totalRevenue: number;
  totalCommissions: number;
  totalClicks: number;
  totalSignups: number;
  totalQuestionnaires: number;
  totalPurchases: number;
  averageConversionRate: number;
}

// Response for fetching influencers
export interface InfluencersResponse {
  success: boolean;
  data: {
    influencers: InfluencerData[];
    pagination: PaginationMeta;
    filteredStats?: InfluencerStats;
  } | null;
  error: string | null;
}

// Response for single influencer operations
export interface InfluencerResponse {
  success: boolean;
  data: InfluencerData | null;
  error: string | null;
}

// Response for delete operations
export interface DeleteInfluencerResponse {
  success: boolean;
  message: string | null;
  error: string | null;
}

// Input data for creating influencer
export interface CreateInfluencerInput {
  name: string;
  email: string;
  phone?: string;
  profile_image?: string;
  bio?: string;
  social_links?: SocialLinks;
  affiliate_code: string;
  commission_rate: number;
  payment_info?: PaymentInfo;
}

// Input data for updating influencer
export interface UpdateInfluencerInput {
  name?: string;
  email?: string;
  phone?: string;
  profile_image?: string;
  bio?: string;
  social_links?: SocialLinks;
  commission_rate?: number;
  status?: 'active' | 'inactive' | 'suspended';
  payment_info?: PaymentInfo;
}

// Tracking event data
export interface TrackingEvent {
  id: string;
  affiliate_code: string;
  user_id: string | null;
  session_id: string | null;
  test_id: string | null;
  event_type: 'click' | 'signup' | 'questionnaire_completed' | 'pdf_purchased';
  ip_address: string | null;
  device_info: any | null;
  location: string | null;
  metadata: any | null;
  revenue: number;
  commission_earned: number;
  conversion_value: number | null;
  timestamp: string;
}

// Payout record
export interface PayoutRecord {
  id: string;
  influencer_id: string;
  amount: number;
  payout_date: string | null;
  payout_method: 'bank_transfer' | 'upi' | 'paypal' | null;
  transaction_id: string | null;
  status: 'pending' | 'completed' | 'failed';
  notes: string | null;
  created_at: string;
  processed_by: string | null;
}
