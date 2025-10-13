// Admin Refunds Service Types

export interface RefundTransaction {
  id: number;
  refund_id: string;
  transaction_id?: string;
  payment_id?: string;
  order_id?: string;
  session_id?: string;
  testid?: string;
  user_id?: string;
  
  // Refund Details
  refund_amount: number;
  original_amount: number;
  currency: string;
  gateway: string;
  
  // Status and Processing
  refund_status: RefundStatus;
  gateway_refund_id?: string;
  gateway_refund_status?: string;
  
  // Admin Details
  initiated_by: string;
  reason?: string;
  admin_notes?: string;
  
  // Customer Details
  customer_name?: string;
  customer_email?: string;
  customer_mobile?: string;
  
  // Error Handling
  error_code?: string;
  error_message?: string;
  gateway_error?: string;
  
  // Timestamps
  initiated_at: string;
  processed_at?: string;
  completed_at?: string;
  
  // Additional Data
  gateway_response?: any;
  original_transaction_data?: any;
  metadata?: any;
  
  created_at: string;
  updated_at: string;
}

export type RefundStatus = 
  | 'initiated' 
  | 'processing' 
  | 'completed' 
  | 'failed' 
  | 'partial' 
  | 'cancelled';

export interface RefundRequest {
  // Required fields
  transaction_id?: string;
  payment_id?: string;
  order_id?: string;
  session_id?: string;
  testid?: string;
  user_id?: string;
  
  refund_amount: number;
  original_amount: number;
  currency: string;
  gateway: string;
  
  // Admin details
  initiated_by: string;
  reason?: string;
  admin_notes?: string;
  
  // Customer details
  customer_name?: string;
  customer_email?: string;
  customer_mobile?: string;
  
  // Original transaction data
  original_transaction_data?: any;
  metadata?: any;
}

export interface RefundResponse {
  success: boolean;
  data?: {
    refund: RefundTransaction;
    gateway_response?: any;
  };
  error?: string;
}

export interface RefundFilters {
  refund_status?: RefundStatus;
  gateway?: string;
  initiated_by?: string;
  dateFrom?: string;
  dateTo?: string;
  searchTerm?: string;
  user_id?: string;
}

export interface PaginationParams {
  page: number;
  pageSize: number;
}

export interface PaginationMeta {
  currentPage: number;
  pageSize: number;
  totalRecords: number;
  totalPages: number;
}

export interface RefundsResponse {
  success: boolean;
  data?: {
    refunds: RefundTransaction[];
    pagination: PaginationMeta;
    stats?: RefundStats;
  };
  error?: string;
}

export interface RefundStats {
  totalRefunds: number;
  completedRefunds: number;
  failedRefunds: number;
  processingRefunds: number;
  totalRefundAmount: number;
  completedRefundAmount: number;
}

export interface GatewayRefundResult {
  success: boolean;
  gateway_refund_id?: string;
  gateway_refund_status?: string;
  gateway_response?: any;
  error?: string;
}