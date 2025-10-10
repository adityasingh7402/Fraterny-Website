import { supabase } from '@/integrations/supabase/client';
import {
  RazorpayTransaction,
  DatabaseTransaction,
  TransactionLookupResult,
  RefundRequest,
  RefundResult,
  RazorpayRefundResponse,
  RazorpayErrorResponse,
} from './types';

// Export types
export * from './types';

// Razorpay configuration
const RAZORPAY_KEY_ID = import.meta.env.VITE_RAZORPAY_KEY_ID;
const RAZORPAY_KEY_SECRET = import.meta.env.VITE_RAZORPAY_KEY_SECRET;
const RAZORPAY_BASE_URL = 'https://api.razorpay.com/v1';

/**
 * Fetch transaction from database by payment_id or order_id
 */
async function fetchDatabaseTransaction(paymentId: string): Promise<DatabaseTransaction | null> {
  try {
    console.log('🔍 Searching database for Razorpay transaction:', paymentId);
    
    // Search by multiple Razorpay-related fields
    const { data, error } = await supabase
      .from('transaction_details')
      .select(`
        *,
        user_data (
          user_name,
          email,
          mobile_number,
          city
        )
      `)
      .or(`payment_id.eq.${paymentId},order_id.eq.${paymentId},transaction_id.eq.${paymentId}`)
      .eq('gateway', 'Razorpay')
      .limit(1);

    if (error) {
      console.error('Database query error:', error);
      return null;
    }

    if (data && data.length > 0) {
      console.log('✅ Found Razorpay transaction in database:', {
        payment_id: data[0].payment_id,
        order_id: data[0].order_id,
        transaction_id: data[0].transaction_id,
        gateway: data[0].gateway,
        user_name: data[0].user_data?.user_name
      });
      return data[0] as DatabaseTransaction;
    }

    console.log('❌ Razorpay transaction not found in database for ID:', paymentId);
    
    // Additional debugging: search for Razorpay transactions to see what IDs exist
    const { data: razorpayTransactions } = await supabase
      .from('transaction_details')
      .select('payment_id, order_id, transaction_id, gateway')
      .eq('gateway', 'Razorpay')
      .limit(5);
    
    console.log('🔍 Sample Razorpay transactions in database:', razorpayTransactions);
    return null;
  } catch (error) {
    console.error('Error fetching database transaction:', error);
    return null;
  }
}

/**
 * Fetch transaction from Razorpay API
 */
async function fetchRazorpayTransaction(paymentId: string): Promise<RazorpayTransaction | null> {
  try {
    console.log('🔍 Searching Razorpay for transaction:', paymentId);
    
    // Create Basic Auth header
    const credentials = btoa(`${RAZORPAY_KEY_ID}:${RAZORPAY_KEY_SECRET}`);
    
    const response = await fetch(`${RAZORPAY_BASE_URL}/payments/${paymentId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${credentials}`,
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      const razorpayData = await response.json();
      console.log('✅ Found transaction in Razorpay:', razorpayData);
      return razorpayData as RazorpayTransaction;
    } else if (response.status === 404) {
      console.log('❌ Transaction not found in Razorpay');
      return null;
    } else {
      const errorData = await response.json().catch(() => null);
      console.error('Razorpay API error:', response.status, response.statusText, errorData);
      return null;
    }
  } catch (error) {
    console.error('Error fetching Razorpay transaction:', error);
    return null;
  }
}

/**
 * Lookup transaction in both database and Razorpay
 */
export async function lookupTransaction(paymentId: string): Promise<TransactionLookupResult> {
  try {
    console.log('🔍 Starting Razorpay transaction lookup for:', paymentId);
    
    // Fetch from both sources in parallel
    const [databaseData, razorpayData] = await Promise.all([
      fetchDatabaseTransaction(paymentId),
      fetchRazorpayTransaction(paymentId),
    ]);

    // Determine status based on what was found
    if (databaseData && razorpayData) {
      // Check if the transaction can be refunded
      const canRefund = razorpayData.status === 'captured' && 
                       razorpayData.amount_refunded < razorpayData.amount;
      
      return {
        success: true,
        status: 'VERIFIED',
        message: canRefund 
          ? 'Transaction found in both database and Razorpay. Ready for refund.'
          : 'Transaction found but cannot be refunded (not captured or already refunded).',
        database_data: databaseData,
        razorpay_data: razorpayData,
        can_refund: canRefund,
      };
    } else if (!databaseData && razorpayData) {
      return {
        success: true,
        status: 'UNRECORDED',
        message: 'Payment made in Razorpay but not recorded in database.',
        database_data: null,
        razorpay_data: razorpayData,
        can_refund: false,
      };
    } else if (databaseData && !razorpayData) {
      return {
        success: true,
        status: 'NOT_IN_RAZORPAY',
        message: 'Payment recorded in database but not found in Razorpay.',
        database_data: databaseData,
        razorpay_data: null,
        can_refund: false,
      };
    } else {
      return {
        success: true,
        status: 'NOT_FOUND',
        message: 'Transaction not found in database or Razorpay.',
        database_data: null,
        razorpay_data: null,
        can_refund: false,
      };
    }
  } catch (error: any) {
    console.error('Error in Razorpay transaction lookup:', error);
    return {
      success: false,
      status: 'NOT_FOUND',
      message: 'Error occurred during transaction lookup.',
      database_data: null,
      razorpay_data: null,
      can_refund: false,
      error: error.message,
    };
  }
}

/**
 * Process Razorpay refund
 */
export async function processRazorpayRefund(request: RefundRequest): Promise<RefundResult> {
  try {
    console.log('💰 Processing Razorpay refund for:', request.payment_id);
    
    // Create Basic Auth header
    const credentials = btoa(`${RAZORPAY_KEY_ID}:${RAZORPAY_KEY_SECRET}`);
    
    // Prepare refund data
    const refundData: any = {};
    
    if (request.amount) {
      refundData.amount = request.amount; // Amount in paise
    }
    
    if (request.speed) {
      refundData.speed = request.speed;
    }
    
    if (request.notes) {
      refundData.notes = request.notes;
    }
    
    if (request.receipt) {
      refundData.receipt = request.receipt;
    }

    const response = await fetch(`${RAZORPAY_BASE_URL}/payments/${request.payment_id}/refund`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${credentials}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(refundData),
    });

    if (response.ok) {
      const refundResponse: RazorpayRefundResponse = await response.json();
      console.log('✅ Razorpay refund processed successfully:', refundResponse);
      
      return {
        success: true,
        refund_id: refundResponse.id,
        payment_id: refundResponse.payment_id,
        amount: refundResponse.amount,
        currency: refundResponse.currency,
        status: refundResponse.status,
        speed: refundResponse.speed_requested,
        message: 'Refund processed successfully',
      };
    } else {
      const errorData: RazorpayErrorResponse = await response.json().catch(() => ({
        error: { 
          code: 'UNKNOWN_ERROR',
          description: response.statusText,
          source: 'api',
          step: 'refund',
          reason: 'network_error'
        }
      }));
      
      console.error('❌ Razorpay refund failed:', errorData);
      
      return {
        success: false,
        error: errorData.error?.description || 'Refund failed',
        message: 'Failed to process refund with Razorpay',
      };
    }
  } catch (error: any) {
    console.error('Error processing Razorpay refund:', error);
    return {
      success: false,
      error: error.message,
      message: 'Error occurred while processing refund',
    };
  }
}

/**
 * Format Razorpay amount from paise to rupees
 */
export function formatRazorpayAmount(amountInPaise: number): string {
  return (amountInPaise / 100).toFixed(2);
}

/**
 * Convert amount from rupees to paise for Razorpay API
 */
export function convertToRazorpayAmount(amountInRupees: number): number {
  return Math.round(amountInRupees * 100);
}

/**
 * Example Usage:
 * 
 * // Look up transaction
 * const result = await lookupTransaction('pay_1234567890');
 * 
 * // Process refund if verified
 * if (result.can_refund) {
 *   const refund = await processRazorpayRefund({
 *     payment_id: 'pay_1234567890',
 *     amount: 1000, // 10.00 INR in paise
 *     speed: 'normal',
 *     notes: { reason: 'Customer request' },
 *     receipt: 'refund_receipt_123'
 *   });
 * }
 */