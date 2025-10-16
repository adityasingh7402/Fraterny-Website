import { supabase } from '@/integrations/supabase/client';
import { createTrackingEvent, getDeviceInfo, getUserIP } from '../tracking';
import { calculateCommission } from '../commission';

/**
 * Check if user already has a signup event tracked
 */
export async function hasSignupTracked(userId: string): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from('tracking_events')
      .select('id')
      .eq('event_type', 'signup')
      .eq('user_id', userId)
      .limit(1)
      .maybeSingle();

    if (error && error.code !== 'PGRST116') {
      console.error('❌ Error checking signup tracking:', error);
      return false;
    }

    return !!data;
  } catch (error) {
    console.error('❌ Failed to check signup tracking:', error);
    return false;
  }
}

/**
 * Track user signup event
 * Only tracks if user doesn't already have a signup event
 */
export async function trackSignup(
  userId: string,
  sessionId: string,
  testId: string,
  referredBy: string
): Promise<{ success: boolean; skipped?: boolean; reason?: string }> {
  try {
    console.log('🔍 Checking if signup already tracked for user:', userId);

    // Check if user already has signup event
    const alreadyTracked = await hasSignupTracked(userId);

    if (alreadyTracked) {
      console.log('⚠️ Signup already tracked for this user, skipping');
      return { success: true, skipped: true, reason: 'already_tracked' };
    }

    // Get device info and IP
    const deviceInfo = getDeviceInfo();
    const ipAddress = await getUserIP();

    console.log('✅ Tracking new signup event for user:', userId);

    // Track signup event
    await createTrackingEvent({
      affiliate_code: referredBy,
      event_type: 'signup',
      user_id: userId,
      session_id: sessionId,
      test_id: testId,
      ip_address: ipAddress,
      device_info: deviceInfo,
      location: null,
      metadata: {
        signup_time: new Date().toISOString()
      }
    });

    console.log('✅ Signup tracked successfully for affiliate:', referredBy);
    return { success: true };
  } catch (error) {
    console.error('❌ Failed to track signup:', error);
    throw error;
  }
}

/**
 * Track payment/purchase event with commission
 */
export async function trackPayment(
  userId: string,
  sessionId: string,
  testId: string,
  referredBy: string,
  gateway: 'razorpay' | 'paypal',
  amountInSmallestUnit: number,  // paise for INR, cents for USD
  currency: 'INR' | 'USD'
): Promise<{ success: boolean }> {
  try {
    console.log('💳 Tracking payment event:', {
      userId,
      gateway,
      amount: amountInSmallestUnit,
      currency,
      referredBy
    });

    // Calculate commission
    const commissionResult = await calculateCommission(
      amountInSmallestUnit,
      currency,
      referredBy
    );

    console.log('💰 Commission calculated:', commissionResult);

    // Get device info and IP
    const deviceInfo = getDeviceInfo();
    const ipAddress = await getUserIP();

    // Track payment event
    await createTrackingEvent({
      affiliate_code: referredBy,
      event_type: 'pdf_purchased',
      user_id: userId,
      session_id: sessionId,
      test_id: testId,
      ip_address: ipAddress,
      device_info: deviceInfo,
      location: null,
      revenue: commissionResult.amountInUSD,
      commission_earned: commissionResult.commissionInUSD,
      conversion_value: commissionResult.amountInUSD,
      metadata: {
        gateway,
        original_currency: currency,
        original_amount: amountInSmallestUnit,
        commission_rate: commissionResult.commissionRate,
        exchange_rate: commissionResult.exchangeRate,
        payment_time: new Date().toISOString()
      }
    });

    console.log('✅ Payment tracked successfully for affiliate:', referredBy);
    
    // Update influencer's total earnings and statistics
    await updateInfluencerStats(referredBy, commissionResult.commissionInUSD);

    return { success: true };
  } catch (error) {
    console.error('❌ Failed to track payment:', error);
    throw error;
  }
}

/**
 * Update influencer statistics after a payment
 */
async function updateInfluencerStats(
  affiliateCode: string,
  commissionEarned: number
): Promise<void> {
  try {
    // Fetch current influencer data
    const { data: influencer, error: fetchError } = await supabase
      .from('influencers')
      .select('total_earnings, remaining_balance')
      .eq('affiliate_code', affiliateCode)
      .single();

    if (fetchError) {
      console.error('❌ Error fetching influencer data:', fetchError);
      return;
    }

    // Calculate new values
    const newTotalEarnings = (parseFloat(influencer.total_earnings.toString()) || 0) + commissionEarned;
    const newRemainingBalance = (parseFloat(influencer.remaining_balance.toString()) || 0) + commissionEarned;

    // Update influencer record
    const { error: updateError } = await supabase
      .from('influencers')
      .update({
        total_earnings: newTotalEarnings,
        remaining_balance: newRemainingBalance,
        updated_at: new Date().toISOString(),
        last_activity_at: new Date().toISOString()
      })
      .eq('affiliate_code', affiliateCode);

    if (updateError) {
      console.error('❌ Error updating influencer stats:', updateError);
      return;
    }

    console.log(`✅ Updated influencer ${affiliateCode} earnings:`, {
      commissionEarned: `$${commissionEarned}`,
      newTotalEarnings: `$${newTotalEarnings}`,
      newRemainingBalance: `$${newRemainingBalance}`
    });
  } catch (error) {
    console.error('❌ Failed to update influencer stats:', error);
  }
}
