export interface RazorpayTransaction {
  id: string;
  amount: number;
  currency: string;
  status: string;
  order_id: string;
  invoice_id?: string;
  international: boolean;
  method: string;
  amount_refunded: number;
  refund_status?: string;
  captured: boolean;
  description?: string;
  card_id?: string;
  bank?: string;
  wallet?: string;
  vpa?: string;
  email: string;
  contact: string;
  notes?: Record<string, string>;
  fee?: number;
  tax?: number;
  error_code?: string;
  error_description?: string;
  error_source?: string;
  error_step?: string;
  error_reason?: string;
  acquirer_data?: Record<string, any>;
  created_at: number;
}

export interface DatabaseTransaction {
  id: number;
  user_id: string;
  testid: string;
  total_paid: number;
  gateway: string;
  status: string;
  payment_completed_time: string;
  session_start_time: string;
  payment_id: string;
  order_id?: string;
  transaction_id?: string;
  user_data: {
    user_name: string;
    email: string;
    mobile_number?: string;
    city?: string;
  } | null;
}

export interface TransactionLookupResult {
  success: boolean;
  status: 'VERIFIED' | 'UNRECORDED' | 'NOT_IN_RAZORPAY' | 'NOT_FOUND';
  message: string;
  database_data: DatabaseTransaction | null;
  razorpay_data: RazorpayTransaction | null;
  can_refund: boolean;
  error?: string;
}

export interface RefundRequest {
  payment_id: string;
  amount?: number; // Optional partial refund amount in paise
  speed?: 'normal' | 'optimum';
  notes?: Record<string, string>;
  receipt?: string;
}

export interface RefundResult {
  success: boolean;
  refund_id?: string;
  payment_id?: string;
  amount?: number;
  currency?: string;
  status?: string;
  speed?: string;
  message?: string;
  error?: string;
}

export interface RazorpayRefundResponse {
  id: string;
  entity: string;
  amount: number;
  currency: string;
  payment_id: string;
  notes?: Record<string, string>;
  receipt?: string;
  acquirer_data?: Record<string, any>;
  created_at: number;
  batch_id?: string;
  status: string;
  speed_processed: string;
  speed_requested: string;
}

export interface RazorpayErrorResponse {
  error: {
    code: string;
    description: string;
    source: string;
    step: string;
    reason: string;
    metadata?: Record<string, any>;
  };
}