import { Database } from '@/integrations/supabase/types';

// Use existing Supabase types
export type TransactionDetail = Database['public']['Tables']['transaction_details']['Row'];
export type UserData = Database['public']['Tables']['user_data']['Row'];

// Partial summary_generation with only selected fields
// Partial summary_generation with only selected fields
export type SummaryGenerationPartial = Pick <
  Database['public']['Tables']['summary_generation']['Row'],
  | 'quest_pdf'
  | 'payment_status'
  | 'paid_generation_time'
  | 'summary_error'
  | 'quest_error'
  | 'quest_status'  
  | 'status'
  | 'qualityscore'
  | 'ip_address'
  | 'testid' // Include testid for reference
>;

// Enriched transaction with nested user and summary data
export type EnrichedTransaction = TransactionDetail & {
  user_data: UserData | null;
  summary_generation: SummaryGenerationPartial | null;
};

// Filter options
export type PaymentFilters = {
  searchTerm?: string;
  dateFrom?: string;
  dateTo?: string;
  gateway?: 'razorpay' | 'paypal' | null;
  isIndia?: boolean | null;
  minAmount?: number | null;
  maxAmount?: number | null;
};

// Pagination parameters
export type PaginationParams = {
  page: number;
  pageSize: number;
};

// Pagination metadata
export type PaginationMeta = {
  currentPage: number;
  pageSize: number;
  totalRecords: number;
  totalPages: number;
};

// API Response structure
export type PaymentResponse = {
  success: boolean;
  data: {
    transactions: EnrichedTransaction[];
    pagination: PaginationMeta;
  } | null;
  error: string | null;
};

// Status types for filtering
export type PaymentStatus = 'success' | 'Start' | 'error';

/**
 * Example JSON Response Format:
 * 
 * {
 *   success: true,
 *   data: {
 *     transactions: [
 *       {
 *         // TransactionDetail fields
 *         id: 1,
 *         total_discount: 50.00,
 *         coupon: "SAVE50",
 *         total_paid: 950.00,
 *         date: "2025-01-15",
 *         order_id: "order_abc123",
 *         status: "success",
 *         session_id: "session_xyz",
 *         user_id: "user_123",
 *         testid: "test_456",
 *         payment_session_id: "pay_session_789",
 *         payment_id: "pay_id_101",
 *         session_duration: "45 minutes",
 *         session_start_time: "2025-01-15T10:00:00Z",
 *         payment_completed_time: "2025-01-15T10:45:00Z",
 *         IsIndia: true,
 *         gateway: "razorpay",
 *         paypal_order_id: null,
 *         transaction_id: "txn_112233",
 *         
 *         // Nested user_data
 *         user_data: {
 *           user_name: "John Doe",
 *           email: "john@example.com",
 *           dob: "1990-01-01",
 *           mobile_number: "+919876543210",
 *           city: "Mumbai",
 *           total_summary_generation: 5,
 *           total_paid_generation: 3,
 *           last_used: "2025-01-15T10:45:00Z",
 *           is_anonymous: "FALSE",
 *           user_id: "user_123",
 *           gender: "Male"
 *         },
 *         
 *         // Nested summary_generation (selected fields only)
 *         summary_generation: {
 *           testid: "test_456",
 *           quest_pdf: "https://storage.url/pdf_link",
 *           payment_status: "completed",
 *           paid_generation_time: "2025-01-15T10:50:00Z",
 *           summary_error: null,
 *           quest_error: null,
 *           quest_status: "completed",
 *           status: "completed",
 *           qualityscore: "85",
 *           ip_address: "192.168.1.1"
 *         }
 *       }
 *     ],
 *     pagination: {
 *       currentPage: 1,
 *       pageSize: 20,
 *       totalRecords: 150,
 *       totalPages: 8
 *     }
 *   },
 *   error: null
 * }
 */