export interface PayPalTransaction {
  id: string;
  amount: {
    total: string;
    currency: string;
  };
  state: string;
  create_time: string;
  update_time: string;
  parent_payment: string;
  receipt_id?: string;
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
  paypal_order_id?: string;
  user_data: {
    user_name: string;
    email: string;
    mobile_number?: string;
    city?: string;
  } | null;
}

export interface TransactionLookupResult {
  success: boolean;
  status: 'VERIFIED' | 'UNRECORDED' | 'NOT_IN_PAYPAL' | 'NOT_FOUND';
  message: string;
  database_data: DatabaseTransaction | null;
  paypal_data: PayPalTransaction | null;
  can_refund: boolean;
  error?: string;
}

export interface RefundRequest {
  transaction_id: string;
  amount?: string; // Optional partial refund amount
  currency?: string;
  description?: string;
}

export interface RefundResult {
  success: boolean;
  refund_id?: string;
  amount?: string;
  currency?: string;
  state?: string;
  message?: string;
  error?: string;
}

export interface PayPalAuthToken {
  access_token: string;
  token_type: string;
  expires_in: number;
}

export interface PayPalRefundResponse {
  id: string;
  amount: {
    total: string;
    currency: string;
  };
  state: string;
  create_time: string;
  parent_payment: string;
  sale_id: string;
}