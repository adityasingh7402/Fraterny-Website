import { supabase } from '@/integrations/supabase/client';
import {
  PayPalTransaction,
  DatabaseTransaction,
  TransactionLookupResult,
  RefundRequest,
  RefundResult,
  PayPalAuthToken,
  PayPalRefundResponse,
} from './types';

// Export types
export * from './types';

// PayPal configuration
const PAYPAL_CLIENT_ID = import.meta.env.VITE_PAYPAL_CLIENT_ID;
const PAYPAL_CLIENT_SECRET = import.meta.env.VITE_PAYPAL_CLIENT_SECRET;
const PAYPAL_ENVIRONMENT = import.meta.env.VITE_PAYPAL_ENVIRONMENT;

const PAYPAL_BASE_URL = PAYPAL_ENVIRONMENT === 'production' 
  ? 'https://api-m.paypal.com' 
  : 'https://api-m.sandbox.paypal.com';

/**
 * Get PayPal access token for API authentication
 */
async function getPayPalAccessToken(): Promise<PayPalAuthToken> {
  const credentials = btoa(`${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`);
  
  const response = await fetch(`${PAYPAL_BASE_URL}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${credentials}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  });

  if (!response.ok) {
    throw new Error(`Failed to get PayPal access token: ${response.statusText}`);
  }

  return await response.json();
}

/**
 * Fetch transaction from database by payment_id or paypal_order_id
 */
async function fetchDatabaseTransaction(transactionId: string): Promise<DatabaseTransaction | null> {
  try {
    console.log('🔍 Searching database for transaction:', transactionId);
    
    // Search by multiple PayPal-related fields
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
      .or(`payment_id.eq.${transactionId},paypal_order_id.eq.${transactionId},transaction_id.eq.${transactionId}`)
      .limit(1);

    if (error) {
      console.error('Database query error:', error);
      return null;
    }

    if (data && data.length > 0) {
      console.log('✅ Found transaction in database:', {
        payment_id: data[0].payment_id,
        paypal_order_id: data[0].paypal_order_id, 
        transaction_id: data[0].transaction_id,
        gateway: data[0].gateway,
        user_name: data[0].user_data?.user_name
      });
      return data[0] as DatabaseTransaction;
    }

    console.log('❌ Transaction not found in database for ID:', transactionId);
    
    // Additional debugging: search for PayPal transactions to see what IDs exist
    const { data: paypalTransactions } = await supabase
      .from('transaction_details')
      .select('payment_id, paypal_order_id, transaction_id, gateway')
      .eq('gateway', 'paypal')
      .limit(5);
    
    console.log('🔍 Sample PayPal transactions in database:', paypalTransactions);
    return null;
  } catch (error) {
    console.error('Error fetching database transaction:', error);
    return null;
  }
}

/**
 * Fetch transaction from PayPal API
 */
async function fetchPayPalTransaction(transactionId: string): Promise<PayPalTransaction | null> {
  try {
    console.log('🔍 Searching PayPal for transaction:', transactionId);
    
    const token = await getPayPalAccessToken();
    
    const response = await fetch(`${PAYPAL_BASE_URL}/v1/payments/sale/${transactionId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token.access_token}`,
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      const paypalData = await response.json();
      console.log('✅ Found transaction in PayPal:', paypalData);
      return paypalData as PayPalTransaction;
    } else if (response.status === 404) {
      console.log('❌ Transaction not found in PayPal');
      return null;
    } else {
      console.error('PayPal API error:', response.status, response.statusText);
      return null;
    }
  } catch (error) {
    console.error('Error fetching PayPal transaction:', error);
    return null;
  }
}

/**
 * Lookup transaction in both database and PayPal
 */
export async function lookupTransaction(transactionId: string): Promise<TransactionLookupResult> {
  try {
    console.log('🔍 Starting transaction lookup for:', transactionId);
    
    // Fetch from both sources in parallel
    const [databaseData, paypalData] = await Promise.all([
      fetchDatabaseTransaction(transactionId),
      fetchPayPalTransaction(transactionId),
    ]);

    // Determine status based on what was found
    if (databaseData && paypalData) {
      return {
        success: true,
        status: 'VERIFIED',
        message: 'Transaction found in both database and PayPal. Ready for refund.',
        database_data: databaseData,
        paypal_data: paypalData,
        can_refund: true,
      };
    } else if (!databaseData && paypalData) {
      return {
        success: true,
        status: 'UNRECORDED',
        message: 'Payment made in PayPal but not recorded in database.',
        database_data: null,
        paypal_data: paypalData,
        can_refund: false,
      };
    } else if (databaseData && !paypalData) {
      return {
        success: true,
        status: 'NOT_IN_PAYPAL',
        message: 'Payment recorded in database but not found in PayPal.',
        database_data: databaseData,
        paypal_data: null,
        can_refund: false,
      };
    } else {
      return {
        success: true,
        status: 'NOT_FOUND',
        message: 'Transaction not found in database or PayPal.',
        database_data: null,
        paypal_data: null,
        can_refund: false,
      };
    }
  } catch (error: any) {
    console.error('Error in transaction lookup:', error);
    return {
      success: false,
      status: 'NOT_FOUND',
      message: 'Error occurred during transaction lookup.',
      database_data: null,
      paypal_data: null,
      can_refund: false,
      error: error.message,
    };
  }
}

/**
 * Process PayPal refund
 */
export async function processPayPalRefund(request: RefundRequest): Promise<RefundResult> {
  try {
    console.log('💰 Processing PayPal refund for:', request.transaction_id);
    
    const token = await getPayPalAccessToken();
    
    // Prepare refund data
    const refundData: any = {};
    
    if (request.amount && request.currency) {
      refundData.amount = {
        total: request.amount,
        currency: request.currency,
      };
    }
    
    if (request.description) {
      refundData.description = request.description;
    }

    const response = await fetch(`${PAYPAL_BASE_URL}/v1/payments/sale/${request.transaction_id}/refund`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token.access_token}`,
        'Content-Type': 'application/json',
      },
      body: Object.keys(refundData).length > 0 ? JSON.stringify(refundData) : '{}',
    });

    if (response.ok) {
      const refundResponse: PayPalRefundResponse = await response.json();
      console.log('✅ Refund processed successfully:', refundResponse);
      
      return {
        success: true,
        refund_id: refundResponse.id,
        amount: refundResponse.amount.total,
        currency: refundResponse.amount.currency,
        state: refundResponse.state,
        message: 'Refund processed successfully',
      };
    } else {
      const errorData = await response.json().catch(() => ({ message: response.statusText }));
      console.error('❌ PayPal refund failed:', errorData);
      
      return {
        success: false,
        error: errorData.message || 'Refund failed',
        message: 'Failed to process refund with PayPal',
      };
    }
  } catch (error: any) {
    console.error('Error processing PayPal refund:', error);
    return {
      success: false,
      error: error.message,
      message: 'Error occurred while processing refund',
    };
  }
}

/**
 * Example Usage:
 * 
 * // Look up transaction
 * const result = await lookupTransaction('PAY-1234567890');
 * 
 * // Process refund if verified
 * if (result.can_refund) {
 *   const refund = await processPayPalRefund({
 *     transaction_id: 'PAY-1234567890',
 *     amount: '10.00',
 *     currency: 'USD',
 *     description: 'Refund for order #123'
 *   });
 * }
 */