// Export all types
export * from './types';
import { supabase } from '@/integrations/supabase/client';
import { processPayPalRefund } from '@/services/paypal-refund';
import { processRazorpayRefund } from '@/services/razorpay-refund';
import type { RefundResult as PayPalRefundResult } from '@/services/paypal-refund';
import type { RefundResult as RazorpayRefundResult } from '@/services/razorpay-refund';
import {
  RefundTransaction,
  RefundRequest,
  RefundResponse,
  RefundFilters,
  PaginationParams,
  RefundsResponse,
  RefundStats,
  PaginationMeta,
  GatewayRefundResult,
  RefundStatus
} from './types';

/**
 * Initiate a refund for a transaction
 * 
 * @param refundData - Refund request data
 * @returns RefundResponse with refund details
 */
export const initiateRefund = async (refundData: RefundRequest): Promise<RefundResponse> => {
  try {
    console.log('💰 Initiating refund:', refundData);

    // Step 1: Insert refund record into database
    const refundRecord = {
      transaction_id: refundData.transaction_id,
      payment_id: refundData.payment_id,
      order_id: refundData.order_id,
      session_id: refundData.session_id,
      testid: refundData.original_transaction_data?.testid,
      user_id: refundData.user_id,
      refund_amount: refundData.refund_amount,
      original_amount: refundData.original_amount,
      currency: refundData.currency,
      gateway: refundData.gateway,
      refund_status: 'initiated' as RefundStatus,
      initiated_by: refundData.initiated_by,
      reason: refundData.reason,
      admin_notes: refundData.admin_notes,
      customer_name: refundData.customer_name,
      customer_email: refundData.customer_email,
      customer_mobile: refundData.customer_mobile,
      original_transaction_data: refundData.original_transaction_data,
      metadata: refundData.metadata
    };

    const { data: refund, error: insertError } = await supabase
      .from('refund_transactions')
      .insert(refundRecord)
      .select()
      .single();

    if (insertError) {
      console.error('❌ Error inserting refund record:', insertError);
      return {
        success: false,
        error: `Failed to create refund record: ${insertError.message}`
      };
    }

    console.log('✅ Refund record created:', refund.refund_id);

    // Step 2: Process with payment gateway
    try {
      const gatewayResult = await processGatewayRefund(refundData);
      
      // Step 3: Update refund record with gateway response
      const updateData: any = {
        processed_at: new Date().toISOString(),
        gateway_response: gatewayResult.gateway_response
      };

      if (gatewayResult.success) {
        updateData.refund_status = 'processing';
        updateData.gateway_refund_id = gatewayResult.gateway_refund_id;
        updateData.gateway_refund_status = gatewayResult.gateway_refund_status;
        
        // If gateway immediately completes refund
        if (gatewayResult.gateway_refund_status === 'completed' || 
            gatewayResult.gateway_refund_status === 'processed') {
          updateData.refund_status = 'completed';
          updateData.completed_at = new Date().toISOString();
        }
      } else {
        updateData.refund_status = 'failed';
        updateData.error_code = 'GATEWAY_ERROR';
        updateData.error_message = gatewayResult.error;
        updateData.gateway_error = gatewayResult.gateway_response?.error || gatewayResult.error;
      }

      const { data: updatedRefund, error: updateError } = await supabase
        .from('refund_transactions')
        .update(updateData)
        .eq('id', refund.id)
        .select()
        .single();

      if (updateError) {
        console.error('❌ Error updating refund record:', updateError);
        // Don't fail the whole operation, refund might still be processing
      }

      const finalRefund = updatedRefund || refund;

      console.log('🎉 Refund initiated successfully:', {
        refund_id: finalRefund.refund_id,
        status: finalRefund.refund_status,
        gateway_status: finalRefund.gateway_refund_status
      });

      return {
        success: true,
        data: {
          refund: finalRefund,
          gateway_response: gatewayResult.gateway_response
        }
      };

    } catch (gatewayError: any) {
      console.error('❌ Gateway processing error:', gatewayError);
      
      // Update refund record with error
      await supabase
        .from('refund_transactions')
        .update({
          refund_status: 'failed',
          processed_at: new Date().toISOString(),
          error_code: 'GATEWAY_ERROR',
          error_message: gatewayError.message || 'Gateway processing failed',
          gateway_error: gatewayError.message
        })
        .eq('id', refund.id);

      return {
        success: false,
        error: `Gateway processing failed: ${gatewayError.message}`,
        data: {
          refund: { ...refund, refund_status: 'failed' as RefundStatus }
        }
      };
    }

  } catch (error: any) {
    console.error('❌ Unexpected error in initiateRefund:', error);
    return {
      success: false,
      error: error?.message || 'An unexpected error occurred'
    };
  }
};

/**
 * Process refund with payment gateway using actual gateway services
 */
const processGatewayRefund = async (refundData: RefundRequest): Promise<GatewayRefundResult> => {
  console.log('🌐 Processing gateway refund for:', refundData.gateway);
  
  try {
    let gatewayResult: PayPalRefundResult | RazorpayRefundResult;
    
    if (refundData.gateway === 'Razorpay') {
      // Use actual Razorpay refund service
      gatewayResult = await processRazorpayRefund({
        payment_id: refundData.payment_id || refundData.transaction_id || '',
        notes: { 
          reason: refundData.reason || 'Admin refund',
          admin_processed: 'true',
          initiated_by: refundData.initiated_by
        },
        speed: 'normal'
      });
    } else if (refundData.gateway === 'paypal') {
      // Use actual PayPal refund service
      gatewayResult = await processPayPalRefund({
        transaction_id: refundData.transaction_id || refundData.payment_id || '',
        description: `Admin refund: ${refundData.reason || 'Admin initiated refund'}`
      });
    } else {
      return {
        success: false,
        error: `Unsupported gateway: ${refundData.gateway}`
      };
    }

    // Convert gateway result to our format
    if (gatewayResult.success) {
      let gateway_refund_status = 'processing'; // default
      let gateway_refund_id = gatewayResult.refund_id;
      
      // Map gateway-specific status
      if (refundData.gateway === 'Razorpay' && 'status' in gatewayResult) {
        gateway_refund_status = gatewayResult.status || 'processing';
      } else if (refundData.gateway === 'paypal' && 'state' in gatewayResult) {
        gateway_refund_status = gatewayResult.state || 'processing';
      }
      
      return {
        success: true,
        gateway_refund_id,
        gateway_refund_status,
        gateway_response: gatewayResult
      };
    } else {
      return {
        success: false,
        error: gatewayResult.error || gatewayResult.message || 'Gateway refund failed',
        gateway_response: gatewayResult
      };
    }
  } catch (error: any) {
    console.error('Gateway refund error:', error);
    return {
      success: false,
      error: error.message || 'Gateway processing failed',
      gateway_response: { error: error.message }
    };
  }
};


/**
 * Fetch refund transactions with filtering and pagination
 */
export const fetchRefunds = async (
  paginationParams: PaginationParams,
  filters?: RefundFilters
): Promise<RefundsResponse> => {
  try {
    const { page, pageSize } = paginationParams;
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    // Build the base query
    let query = supabase
      .from('refund_transactions')
      .select('*', { count: 'exact' });

    // Apply filters
    if (filters?.refund_status) {
      query = query.eq('refund_status', filters.refund_status);
    }

    if (filters?.gateway) {
      query = query.eq('gateway', filters.gateway);
    }

    if (filters?.initiated_by) {
      query = query.eq('initiated_by', filters.initiated_by);
    }

    if (filters?.user_id) {
      query = query.eq('user_id', filters.user_id);
    }

    if (filters?.searchTerm && filters.searchTerm.trim()) {
      const searchTerm = filters.searchTerm.trim();
      query = query.or(
        `refund_id.ilike.%${searchTerm}%,transaction_id.ilike.%${searchTerm}%,payment_id.ilike.%${searchTerm}%,customer_email.ilike.%${searchTerm}%,customer_name.ilike.%${searchTerm}%`
      );
    }

    if (filters?.dateFrom) {
      query = query.gte('initiated_at', filters.dateFrom);
    }

    if (filters?.dateTo) {
      query = query.lte('initiated_at', filters.dateTo);
    }

    // Apply pagination and ordering
    query = query
      .range(from, to)
      .order('initiated_at', { ascending: false });

    const { data, error, count } = await query;

    if (error) {
      console.error('Error fetching refunds:', error);
      return {
        success: false,
        error: error.message
      };
    }

    const totalRecords = count || 0;
    const totalPages = Math.ceil(totalRecords / pageSize);

    const paginationMeta: PaginationMeta = {
      currentPage: page,
      pageSize,
      totalRecords,
      totalPages
    };

    return {
      success: true,
      data: {
        refunds: data as RefundTransaction[] || [],
        pagination: paginationMeta
      }
    };

  } catch (error: any) {
    console.error('Unexpected error in fetchRefunds:', error);
    return {
      success: false,
      error: error?.message || 'An unexpected error occurred'
    };
  }
};

/**
 * Get refund statistics
 */
export const getRefundStats = async (): Promise<RefundStats> => {
  try {
    const { data, error } = await supabase
      .from('refund_transactions')
      .select('refund_status, refund_amount, currency');

    if (error) {
      console.error('Error fetching refund stats:', error);
      return {
        totalRefunds: 0,
        completedRefunds: 0,
        failedRefunds: 0,
        processingRefunds: 0,
        totalRefundAmount: 0,
        completedRefundAmount: 0,
        totalRefundAmountUSD: 0,
        totalRefundAmountINR: 0,
        completedRefundAmountUSD: 0,
        completedRefundAmountINR: 0
      };
    }

    const totalRefunds = data?.length || 0;
    const completedRefunds = data?.filter(r => r.refund_status === 'completed').length || 0;
    const failedRefunds = data?.filter(r => r.refund_status === 'failed').length || 0;
    const processingRefunds = data?.filter(r => 
      r.refund_status === 'processing' || r.refund_status === 'initiated'
    ).length || 0;

    const totalRefundAmount = data?.reduce((sum, r) => sum + (r.refund_amount || 0), 0) || 0;
    const completedRefundAmount = data?.filter(r => r.refund_status === 'completed')
      .reduce((sum, r) => sum + (r.refund_amount || 0), 0) || 0;

    // Calculate separate currency totals
    const totalRefundAmountUSD = data?.filter(r => r.currency === 'USD')
      .reduce((sum, r) => sum + (r.refund_amount || 0), 0) || 0;
    const totalRefundAmountINR = data?.filter(r => r.currency === 'INR')
      .reduce((sum, r) => sum + (r.refund_amount || 0), 0) || 0;
    
    const completedRefundAmountUSD = data?.filter(r => r.refund_status === 'completed' && r.currency === 'USD')
      .reduce((sum, r) => sum + (r.refund_amount || 0), 0) || 0;
    const completedRefundAmountINR = data?.filter(r => r.refund_status === 'completed' && r.currency === 'INR')
      .reduce((sum, r) => sum + (r.refund_amount || 0), 0) || 0;

    return {
      totalRefunds,
      completedRefunds,
      failedRefunds,
      processingRefunds,
      totalRefundAmount,
      completedRefundAmount,
      totalRefundAmountUSD,
      totalRefundAmountINR,
      completedRefundAmountUSD,
      completedRefundAmountINR
    };

  } catch (error) {
    console.error('Unexpected error in getRefundStats:', error);
    return {
      totalRefunds: 0,
      completedRefunds: 0,
      failedRefunds: 0,
      processingRefunds: 0,
      totalRefundAmount: 0,
      completedRefundAmount: 0,
      totalRefundAmountUSD: 0,
      totalRefundAmountINR: 0,
      completedRefundAmountUSD: 0,
      completedRefundAmountINR: 0
    };
  }
};

/**
 * Update refund status (for webhook handling or manual updates)
 */
export const updateRefundStatus = async (
  refundId: string,
  status: RefundStatus,
  updateData?: Partial<RefundTransaction>
): Promise<RefundResponse> => {
  try {
    const updates: any = {
      refund_status: status,
      ...updateData
    };

    if (status === 'completed') {
      updates.completed_at = new Date().toISOString();
    }

    const { data, error } = await supabase
      .from('refund_transactions')
      .update(updates)
      .eq('refund_id', refundId)
      .select()
      .single();

    if (error) {
      return {
        success: false,
        error: error.message
      };
    }

    return {
      success: true,
      data: {
        refund: data as RefundTransaction
      }
    };

  } catch (error: any) {
    return {
      success: false,
      error: error?.message || 'An unexpected error occurred'
    };
  }
};

/**
 * Get refund by ID
 */
export const getRefundById = async (refundId: string): Promise<RefundResponse> => {
  try {
    const { data, error } = await supabase
      .from('refund_transactions')
      .select('*')
      .eq('refund_id', refundId)
      .single();

    if (error) {
      return {
        success: false,
        error: error.message
      };
    }

    return {
      success: true,
      data: {
        refund: data as RefundTransaction
      }
    };

  } catch (error: any) {
    return {
      success: false,
      error: error?.message || 'An unexpected error occurred'
    };
  }
};