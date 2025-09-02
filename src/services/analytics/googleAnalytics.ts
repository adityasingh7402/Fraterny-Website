// ===================================
// GOOGLE ANALYTICS 4 QUEST TRACKING SERVICE
// Handles GA4 initialization and quest-specific event tracking
// ===================================

// Extend Window interface for gtag
declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}

interface QuestEventParams {
  session_id: string;
  question_id: string;
  section_id: string;
  user_state: 'anonymous' | 'logged_in';
  question_index?: number;
  section_question_index?: number;
  [key: string]: any;
}

class GoogleAnalyticsService {
  private isInitialized: boolean = false;
  private measurementId: string;
  private eventQueue: Array<{ eventName: string; parameters: any }> = [];

  constructor() {
    this.measurementId = import.meta.env.VITE_GA4_MEASUREMENT_ID || '';
    
    if (this.measurementId) {
      this.initializeGA4();
    } else {
      console.warn('⚠️ GA4 Measurement ID not found in environment variables');
    }
  }

  private initializeGA4(): void {
    if (typeof window === 'undefined' || !this.measurementId) {
      console.warn('GA4 cannot initialize: missing measurement ID or running server-side');
      return;
    }

    try {
      // Load GA4 script
      const script = document.createElement('script');
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${this.measurementId}`;
      document.head.appendChild(script);

      // Initialize gtag
      window.dataLayer = window.dataLayer || [];
      window.gtag = function() { 
        window.dataLayer.push(arguments); 
      };
      
      window.gtag('js', new Date());
      window.gtag('config', this.measurementId, {
        // Enhanced measurement settings
        enhanced_measurement_settings: {
          scrolls: false, // We'll track quest progress manually
          outbound_clicks: true,
          site_search: false,
          video_engagement: false,
          file_downloads: false
        },
        // Custom parameters mapping
        custom_map: {
          'custom_session_id': 'session_id',
          'custom_question_id': 'question_id',
          'custom_section_id': 'section_id',
          'custom_user_state': 'user_state'
        }
      });

      this.isInitialized = true;
      console.log('✅ GA4 Quest Analytics initialized:', this.measurementId);
      
      // Process any queued events
      this.processEventQueue();
      
    } catch (error) {
      console.error('❌ Failed to initialize GA4:', error);
    }
  }

  private processEventQueue(): void {
    if (this.eventQueue.length > 0) {
      this.eventQueue.forEach(({ eventName, parameters }) => {
        this.sendEvent(eventName, parameters);
      });
      this.eventQueue = [];
      console.log('📤 Processed queued GA4 events');
    }
  }

  private sendEvent(eventName: string, parameters: any): void {
    if (!this.isInitialized) {
      // Queue event if GA4 not ready
      this.eventQueue.push({ eventName, parameters });
      return;
    }

    try {
      window.gtag('event', eventName, {
        ...parameters,
        // Add timestamp for all events
        timestamp: Date.now(),
        // Add page info
        page_location: window.location.href,
        page_title: document.title
      });
      
      console.log(`📊 GA4 Event: ${eventName}`, parameters);
    } catch (error) {
      console.error(`❌ Failed to send GA4 event ${eventName}:`, error);
    }
  }

  private getDeviceType(): 'mobile' | 'tablet' | 'desktop' {
    const userAgent = navigator.userAgent;
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
    const isTablet = /iPad|Android(?!.*Mobile)/i.test(userAgent);
    return isTablet ? 'tablet' : (isMobile ? 'mobile' : 'desktop');
  }

  // ===================================
  // QUEST EVENT TRACKING METHODS
  // ===================================

  /**
   * Track quest session start
   */
  trackQuestStart(params: {
    session_id: string;
    user_state: 'anonymous' | 'logged_in';
    total_questions: number;
    is_resumed_session?: boolean;
  }): void {
    this.sendEvent('quest_start', {
      event_category: 'Quest',
      event_label: 'Session Started',
      session_id: params.session_id,
      user_state: params.user_state,
      total_questions: params.total_questions,
      is_resumed_session: params.is_resumed_session || false,
      device_type: this.getDeviceType()
    });
  }

  /**
   * Track when user views a question
   */
  trackQuestionView(params: {
    session_id: string;
    question_id: string;
    section_id: string;
    user_state: 'anonymous' | 'logged_in';
    question_index: number;
    section_question_index: number;
  }): void {
    this.sendEvent('quest_question_view', {
      event_category: 'Quest',
      event_label: `Question View: ${params.question_id}`,
      session_id: params.session_id,
      question_id: params.question_id,
      section_id: params.section_id,
      user_state: params.user_state,
      question_index: params.question_index,
      section_question_index: params.section_question_index,
      device_type: this.getDeviceType()
    });
  }

  /**
   * Track question completion (successful save)
   */
  trackQuestionComplete(params: {
    session_id: string;
    question_id: string;
    section_id: string;
    user_state: 'anonymous' | 'logged_in';
    question_index: number;
    response_length?: number;
    time_on_question?: number;
  }): void {
    this.sendEvent('quest_question_complete', {
      event_category: 'Quest',
      event_label: `Question Complete: ${params.question_id}`,
      session_id: params.session_id,
      question_id: params.question_id,
      section_id: params.section_id,
      user_state: params.user_state,
      question_index: params.question_index,
      response_length: params.response_length || 0,
      time_on_question: Math.round(params.time_on_question || 0),
      device_type: this.getDeviceType()
    });
  }

  /**
   * Track quest completion
   */
  trackQuestComplete(params: {
    session_id: string;
    user_state: 'anonymous' | 'logged_in';
    total_duration: number;
    questions_completed: number;
  }): void {
    this.sendEvent('quest_complete', {
      event_category: 'Quest',
      event_label: 'Quest Completed',
      session_id: params.session_id,
      user_state: params.user_state,
      total_duration: Math.round(params.total_duration),
      questions_completed: params.questions_completed,
      device_type: this.getDeviceType()
    });

    // Also track as conversion
    this.sendEvent('quest_conversion', {
      event_category: 'Conversion',
      event_label: 'Quest Completed',
      value: params.questions_completed,
      currency: 'points'
    });
  }

  /**
   * Track quest abandonment
   */
  trackQuestAbandon(params: {
    session_id: string;
    question_id: string;
    section_id: string;
    user_state: 'anonymous' | 'logged_in';
    question_index: number;
    session_duration: number;
    abandon_reason?: string;
  }): void {
    this.sendEvent('quest_abandon', {
      event_category: 'Quest',
      event_label: `Abandoned at: ${params.question_id}`,
      session_id: params.session_id,
      question_id: params.question_id,
      section_id: params.section_id,
      user_state: params.user_state,
      question_index: params.question_index,
      session_duration: Math.round(params.session_duration),
      abandon_reason: params.abandon_reason || 'unknown',
      device_type: this.getDeviceType()
    });
  }

  /**
   * Track anonymous user conversion to logged-in
   */
  trackUserConversion(params: {
    session_id: string;
    conversion_point: string; // e.g., 'save_button', 'question_result'
    questions_completed_as_anonymous: number;
  }): void {
    this.sendEvent('user_conversion', {
      event_category: 'User Journey',
      event_label: 'Anonymous to Logged-in',
      session_id: params.session_id,
      conversion_point: params.conversion_point,
      questions_completed_as_anonymous: params.questions_completed_as_anonymous,
      device_type: this.getDeviceType()
    });

    // Track as conversion goal
    this.sendEvent('sign_up', {
      method: 'quest_save'
    });
  }

  /**
   * Track session save
   */
  trackSessionSave(params: {
    session_id: string;
    user_state: 'anonymous' | 'logged_in';
    questions_completed: number;
    save_trigger: 'auto' | 'manual' | 'before_unload';
  }): void {
    this.sendEvent('quest_session_save', {
      event_category: 'Quest',
      event_label: 'Session Saved',
      session_id: params.session_id,
      user_state: params.user_state,
      questions_completed: params.questions_completed,
      save_trigger: params.save_trigger,
      device_type: this.getDeviceType()
    });
  }

  /**
   * Track session resume
   */
  trackSessionResume(params: {
    session_id: string;
    user_state: 'anonymous' | 'logged_in';
    resume_question_id: string;
    time_since_save: number; // in hours
  }): void {
    this.sendEvent('quest_session_resume', {
      event_category: 'Quest',
      event_label: 'Session Resumed',
      session_id: params.session_id,
      user_state: params.user_state,
      resume_question_id: params.resume_question_id,
      time_since_save: Math.round(params.time_since_save * 100) / 100, // Round to 2 decimals
      device_type: this.getDeviceType()
    });
  }

  /**
   * Get initialization status
   */
  isReady(): boolean {
    return this.isInitialized;
  }

  /**
   * Get measurement ID (for debugging)
   */
  getMeasurementId(): string {
    return this.measurementId;
  }

  // ===================================
// PAYMENT EVENT TRACKING METHODS
// ===================================

/**
 * Track payment initiation from result page
 */
trackPaymentInitiated(params: {
  session_id: string;
  test_id: string;
  user_state: 'anonymous' | 'logged_in';
  payment_amount: number;
  pricing_tier: 'early' | 'regular';
}): void {
  this.sendEvent('payment_initiated_from_result_page', {
    event_category: 'Payment',
    event_label: 'Payment Started',
    session_id: params.session_id,
    test_id: params.test_id,
    user_state: params.user_state,
    payment_amount: params.payment_amount,
    pricing_tier: params.pricing_tier,
    device_type: this.getDeviceType()
  });
}

/**
 * Track payment modal opened successfully
 */
trackPaymentModalOpened(params: {
  session_id: string;
  order_id: string;
  amount: number;
  currency: string;
}): void {
  this.sendEvent('payment_modal_opened_from_result_page', {
    event_category: 'Payment',
    event_label: 'Payment Modal Opened',
    session_id: params.session_id,
    order_id: params.order_id,
    amount: params.amount,
    currency: params.currency,
    device_type: this.getDeviceType()
  });
}

/**
 * Track successful payment from result page
 */
trackPaymentSuccess(params: {
  session_id: string;
  payment_id: string;
  order_id: string;
  amount: number;
}): void {
  this.sendEvent('payment_success_from_result_page', {
    event_category: 'Payment',
    event_label: 'Payment Completed',
    session_id: params.session_id,
    payment_id: params.payment_id,
    order_id: params.order_id,
    amount: params.amount,
    device_type: this.getDeviceType()
  });
}

/**
 * Track payment completed (end-to-end verification)
 */
trackPaymentCompleted(params: {
  session_id: string;
  payment_id: string;
  verification_success: boolean;
  total_duration: number;
}): void {
  this.sendEvent('payment_completed_from_result_page', {
    event_category: 'Payment',
    event_label: 'Payment Fully Completed',
    session_id: params.session_id,
    payment_id: params.payment_id,
    verification_success: params.verification_success,
    total_duration: Math.round(params.total_duration),
    device_type: this.getDeviceType()
  });
}

/**
 * Track payment failure from result page
 */
trackPaymentFailed(params: {
  session_id: string;
  failure_reason: string;
  error_code?: string;
  amount: number;
}): void {
  this.sendEvent('payment_failed_from_result_page', {
    event_category: 'Payment',
    event_label: 'Payment Failed',
    session_id: params.session_id,
    failure_reason: params.failure_reason,
    error_code: params.error_code || 'unknown',
    amount: params.amount,
    device_type: this.getDeviceType()
  });
}

/**
 * Track payment cancellation from result page
 */
trackPaymentCancelled(params: {
  session_id: string;
  cancel_reason: string;
  amount: number;
}): void {
  this.sendEvent('payment_cancelled_from_result_page', {
    event_category: 'Payment',
    event_label: 'Payment Cancelled',
    session_id: params.session_id,
    cancel_reason: params.cancel_reason,
    amount: params.amount,
    device_type: this.getDeviceType()
  });
}

/**
 * Track PDF unlock CTA button click
 */
trackPdfUnlockCTA(params: {
  session_id: string;
  test_id: string;
  user_state: 'anonymous' | 'logged_in';
}): void {
  this.sendEvent('pdf_unlock_cta_clicked_from_result_page', {
    event_category: 'Engagement',
    event_label: 'PDF Unlock CTA Clicked',
    session_id: params.session_id,
    test_id: params.test_id,
    user_state: params.user_state,
    device_type: this.getDeviceType()
  });
}

/**
 * Track payment initiation from dashboard page
 */
trackPaymentInitiatedFromDashboard(params: {
  session_id: string;
  test_id: string;
  user_state: 'anonymous' | 'logged_in';
  payment_amount: number;
  pricing_tier: 'early' | 'regular';
}): void {
  this.sendEvent('payment_initiated_from_dashboard_page', {
    event_category: 'Payment',
    event_label: 'Payment Started',
    session_id: params.session_id,
    test_id: params.test_id,
    user_state: params.user_state,
    payment_amount: params.payment_amount,
    pricing_tier: params.pricing_tier,
    device_type: this.getDeviceType()
  });
}

/**
 * Track PDF unlock CTA button click from dashboard
 */
trackPdfUnlockCTAFromDashboard(params: {
  session_id: string;
  test_id: string;
  user_state: 'anonymous' | 'logged_in';
}): void {
  this.sendEvent('pdf_unlock_cta_clicked_from_dashboard_page', {
    event_category: 'Engagement',
    event_label: 'PDF Unlock CTA Clicked',
    session_id: params.session_id,
    test_id: params.test_id,
    user_state: params.user_state,
    device_type: this.getDeviceType()
  });
}

}

// Export singleton instance
export const googleAnalytics = new GoogleAnalyticsService();

// Export class for testing
export { GoogleAnalyticsService };

// Export types
export type { QuestEventParams };