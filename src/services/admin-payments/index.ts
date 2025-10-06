
// Export all types
export * from './types';
import { supabase } from '@/integrations/supabase/client';
import {
  PaymentStatus,
  PaymentFilters,
  PaginationParams,
  PaymentResponse,
  EnrichedTransaction,
  PaginationMeta,
} from './types';

/**
 * Fetch payment details with filtering and pagination
 * 
 * @param statusType - Payment status: 'success' | 'Start' | 'error'
 * @param paginationParams - Page and pageSize
 * @param filters - Optional filters (search, date range, gateway, etc.)
 * @returns PaymentResponse with transactions and pagination metadata
 */
export const fetchPaymentDetails = async (
  statusType: PaymentStatus,
  paginationParams: PaginationParams,
  filters?: PaymentFilters
): Promise<PaymentResponse> => {
  try {
    const { page, pageSize } = paginationParams;
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    // Build the base query with joins
    let query = supabase
      .from('transaction_details')
      .select(
        `
        *,
        user_data (*),
        summary_generation (
          testid,
          quest_pdf,
          payment_status,
          paid_generation_time,
          summary_error,
          quest_error,
          quest_status,
          status,
          qualityscore,
          ip_address
        )
        `,
        { count: 'exact' }
      );

    // Filter by status type
    if (statusType === 'error') {
      // Disputed payments: status is neither 'success' nor 'Start'
      query = query.not('status', 'in', '("success","Start")');
    } else {
      // Successful or Attempted payments
      query = query.eq('status', statusType);
    }

    // Apply search filter (global search across multiple fields)
    if (filters?.searchTerm && filters.searchTerm.trim()) {
      const searchTerm = filters.searchTerm.trim();
      query = query.or(
        `order_id.ilike.%${searchTerm}%,payment_id.ilike.%${searchTerm}%,session_id.ilike.%${searchTerm}%,testid.ilike.%${searchTerm}%,user_data.email.ilike.%${searchTerm}%,user_data.user_name.ilike.%${searchTerm}%,user_data.mobile_number.ilike.%${searchTerm}%`
      );
    }

    // Apply date range filters
    if (filters?.dateFrom) {
      query = query.gte('payment_completed_time', filters.dateFrom);
    }
    if (filters?.dateTo) {
      query = query.lte('payment_completed_time', filters.dateTo);
    }

    // Apply gateway filter
    if (filters?.gateway) {
      query = query.eq('gateway', filters.gateway);
    }

    // Apply IsIndia filter
    if (filters?.isIndia !== null && filters?.isIndia !== undefined) {
      query = query.eq('IsIndia', filters.isIndia);
    }

    // Apply amount range filters
    if (filters?.minAmount !== null && filters?.minAmount !== undefined) {
      query = query.gte('total_paid', filters.minAmount);
    }
    if (filters?.maxAmount !== null && filters?.maxAmount !== undefined) {
      query = query.lte('total_paid', filters.maxAmount);
    }

    // Apply pagination and ordering
    query = query
      .range(from, to)
      .order('payment_completed_time', { ascending: false });

    // Execute query
    const { data, error, count } = await query;

    if (error) {
      console.error('Error fetching payment details:', error);
      return {
        success: false,
        data: null,
        error: error.message,
      };
    }

    // Calculate pagination metadata
    const totalRecords = count || 0;
    const totalPages = Math.ceil(totalRecords / pageSize);

    const paginationMeta: PaginationMeta = {
      currentPage: page,
      pageSize,
      totalRecords,
      totalPages,
    };

    return {
      success: true,
      data: {
        transactions: (data as EnrichedTransaction[]) || [],
        pagination: paginationMeta,
      },
      error: null,
    };
  } catch (error: any) {
    console.error('Unexpected error in fetchPaymentDetails:', error);
    return {
      success: false,
      data: null,
      error: error?.message || 'An unexpected error occurred',
    };
  }
};

/**
 * Example Usage:
 * 
 * const result = await fetchPaymentDetails(
 *   'success',
 *   { page: 1, pageSize: 20 },
 *   {
 *     searchTerm: 'john@example.com',
 *     dateFrom: '2025-01-01',
 *     dateTo: '2025-01-31',
 *     gateway: 'razorpay',
 *     isIndia: true,
 *     minAmount: 500,
 *     maxAmount: 1000
 *   }
 * );
 * 
 * Expected JSON Response:
 * {
 *   success: true,
 *   data: {
 *     transactions: [
 *       {
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