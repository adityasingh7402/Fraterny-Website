// src/services/userJourneyManager.ts

import axios from 'axios';
import { getPlatformInfo, PlatformInfo } from '@/utils/platformTracking';
import { detectPlatform, storePlatformInfo } from '@/utils/platformTracking';

interface PageVisit {
  page: string;
  title: string;
  entry_time: string;
  exit_time?: string;
  time_spent_seconds: number;
  is_entry_page: boolean;
  is_exit_page: boolean;
}

interface UserAction {
  action: string;
  page: string;
  timestamp: string;
  signup_method?: string;
  user_data?: {
    email?: string;
    first_name?: string;
    last_name?: string;
    phone?: string;
  };
}

interface UserJourneyData {
  session_info: {
    session_id: string;
    timestamp: string;
    user_id?: string | null;
  };
  platform_source: PlatformInfo | null;
  device_info: {
    type: 'mobile' | 'tablet' | 'desktop';
    user_agent: string;
    screen_width: number;
    screen_height: number;
  };
  page_journey: PageVisit[];
  session_summary: {
    total_pages_visited: number;
    total_session_duration_seconds: number;
    entry_page: string;
    exit_page: string;
    converted: boolean;
    conversion_type?: string;
  };
  user_actions: UserAction[];
}

class UserJourneyManager {
  private sessionId: string;
  private startTime: number;
  private currentPage: string = '';
  private pageStartTime: number = 0;
  private pageVisits: PageVisit[] = [];
  private userActions: UserAction[] = [];
  private platformSource: PlatformInfo | null = null;
  private deviceInfo: any = null;
  private sessionTimer: NodeJS.Timeout | null = null;
  private heartbeatTimer: NodeJS.Timeout | null = null;
  private isSessionActive: boolean = false;

  // Configuration
  private readonly SESSION_DURATION = 120 * 60 * 1000; // 2 hours means the user is active for 2 hours
  private readonly SESSION_TIMEOUT = 180 * 60 * 1000; // 30 minutes means the user is inactive
  private readonly HEARTBEAT_INTERVAL = 30 * 1000; // 30 seconds means the user is active
// Configuration (TESTING VALUES)
    // private readonly SESSION_DURATION = 2 * 60 * 1000; // 2 minutes (instead of 1 hour)
    // private readonly SESSION_TIMEOUT = 1 * 60 * 1000; // 1 minute (instead of 30 minutes)
    // private readonly HEARTBEAT_INTERVAL = 10 * 1000; // 10 seconds (instead of 30 seconds)
    private readonly BACKEND_URL = '/api/analytics/user-journey'; // Update with your backend URL

  constructor() {
    this.sessionId = this.generateSessionId();
    this.startTime = Date.now();
    this.initializeSession();
    this.setupEventListeners();
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private initializeSession(): void {
    // Get platform source
    // this.platformSource = getPlatformInfo();
    const detectedPlatform = detectPlatform();
    storePlatformInfo(detectedPlatform);
    this.platformSource = detectedPlatform;
    
    // Get device info
    this.deviceInfo = this.getDeviceInfo();
    
    // Mark session as active
    this.isSessionActive = true;
    
    // Set session timeout (30 minutes of inactivity)
    this.resetSessionTimeout();

    // Set maximum session duration (2 hours)
    this.sessionTimer = setTimeout(() => {
      this.endSession('session_expired');
    }, this.SESSION_DURATION);

    //console.log('🚀 User journey session started:', this.sessionId);
  }

  private getDeviceInfo() {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const isTablet = /iPad|Android(?!.*Mobile)/i.test(navigator.userAgent);
    
    return {
      type: isTablet ? 'tablet' : (isMobile ? 'mobile' : 'desktop'),
      user_agent: navigator.userAgent,
      screen_width: window.screen.width,
      screen_height: window.screen.height
    };
  }

  private setupEventListeners(): void {
    // Track page visibility changes
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.pauseTracking();
      } else {
        this.resumeTracking();
      }
    });

    // Track page unload (user leaving)
    window.addEventListener('beforeunload', () => {
      this.endSession('page_unload');
    });

    // Track page unload for mobile (pagehide is more reliable on mobile)
    window.addEventListener('pagehide', () => {
      this.endSession('page_hide');
    });

    // Start heartbeat to track user activity
    this.startHeartbeat();
  }

  private startHeartbeat(): void {
    this.heartbeatTimer = setInterval(() => {
      if (this.isSessionActive && !document.hidden) {
        this.resetSessionTimeout();
      }
    }, this.HEARTBEAT_INTERVAL);
  }

  private resetSessionTimeout(): void {
    if (this.sessionTimer) {
      clearTimeout(this.sessionTimer);
    }
    
    this.sessionTimer = setTimeout(() => {
      this.endSession('user_inactive');
    }, this.SESSION_TIMEOUT);
  }

  private pauseTracking(): void {
    // Don't track time when page is hidden
    if (this.currentPage && this.pageStartTime) {
      this.updateCurrentPageTime();
    }
  }

  private resumeTracking(): void {
    // Resume tracking when page becomes visible
    if (this.currentPage) {
      this.pageStartTime = Date.now();
    }
    this.resetSessionTimeout();
  }

  // Public method to track page visits
  public trackPageVisit(page: string, title: string = ''): void {
    if (!this.isSessionActive) {
      return;
    }

    // End previous page if exists
    if (this.currentPage) {
      this.endCurrentPage();
    }

    // Start new page
    this.startNewPage(page, title);
    
    // console.log(`📄 Page visit tracked: ${page}`);
  }

  private startNewPage(page: string, title: string): void {
    this.currentPage = page;
    this.pageStartTime = Date.now();
    
    const pageVisit: PageVisit = {
      page,
      title: title || document.title || page,
      entry_time: new Date().toISOString(),
      time_spent_seconds: 0,
      is_entry_page: this.pageVisits.length === 0,
      is_exit_page: false
    };
    
    this.pageVisits.push(pageVisit);
    this.resetSessionTimeout();
  }

  private endCurrentPage(): void {
    if (this.pageVisits.length === 0) return;
    
    const currentPageVisit = this.pageVisits[this.pageVisits.length - 1];
    currentPageVisit.exit_time = new Date().toISOString();
    currentPageVisit.time_spent_seconds = this.updateCurrentPageTime();
  }

  private updateCurrentPageTime(): number {
    if (!this.pageStartTime) return 0;
    
    const timeSpent = Math.floor((Date.now() - this.pageStartTime) / 1000);
    
    if (this.pageVisits.length > 0) {
      this.pageVisits[this.pageVisits.length - 1].time_spent_seconds = timeSpent;
    }
    
    return timeSpent;
  }

  // Public method to track user actions
  public trackUserAction(action: string, additionalData?: any): void {
    if (!this.isSessionActive) {
      return;
    }

    const userAction: UserAction = {
      action,
      page: this.currentPage,
      timestamp: new Date().toISOString(),
      ...additionalData
    };
    
    this.userActions.push(userAction);
    this.resetSessionTimeout();
    
    console.log(`🎯 User action tracked: ${action}`);
  }

  // Public method to track signup
  public trackSignup(signupData: {
    method: string;
    email?: string;
    first_name?: string;
    last_name?: string;
    phone?: string;
  }): void {
    this.trackUserAction('signup', {
      signup_method: signupData.method,
      user_data: {
        email: signupData.email,
        first_name: signupData.first_name,
        last_name: signupData.last_name,
        phone: signupData.phone
      }
    });
  }

  private endSession(reason: string): void {
    if (!this.isSessionActive) {
      return;
    }

    // console.log(`🏁 Ending session: ${this.sessionId} (${reason})`);
    
    // End current page
    if (this.currentPage) {
      this.endCurrentPage();
      // Mark last page as exit page
      if (this.pageVisits.length > 0) {
        this.pageVisits[this.pageVisits.length - 1].is_exit_page = true;
      }
    }

    // Mark session as inactive
    this.isSessionActive = false;

    // Clear timers
    if (this.sessionTimer) {
      clearTimeout(this.sessionTimer);
    }
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
    }

    // Send data to backend
    this.sendJourneyData(reason);
  }

  private generateJourneyData(): UserJourneyData {
    const totalDuration = Math.floor((Date.now() - this.startTime) / 1000);
    const hasSignup = this.userActions.some(action => action.action === 'signup');
    
    return {
      session_info: {
        session_id: this.sessionId,
        timestamp: new Date(this.startTime).toISOString(),
        user_id: null // Will be set by backend if user is logged in
      },
      platform_source: this.platformSource,
      device_info: this.deviceInfo,
      page_journey: this.pageVisits,
      session_summary: {
        total_pages_visited: this.pageVisits.length,
        total_session_duration_seconds: totalDuration,
        entry_page: this.pageVisits[0]?.page || '',
        exit_page: this.pageVisits[this.pageVisits.length - 1]?.page || '',
        converted: hasSignup,
        conversion_type: hasSignup ? 'signup' : undefined
      },
      user_actions: this.userActions
    };
  }

  private async sendJourneyData(endReason: string): Promise<void> {
    try {
      const journeyData = this.generateJourneyData();
      
      // Add end reason to the data
      (journeyData as any).end_reason = endReason;
      
      // console.log('📤 Sending journey data to backend:', journeyData);
      // alert('Journey data logged to console! Check it now before clicking OK.');
      
      // Send to backend using axios
      // const response = await axios.post(this.BACKEND_URL, {
      //   user_journey: journeyData
      // }, {
      //   headers: {
      //     'Content-Type': 'application/json'
      //   },
      //   timeout: 5000 // 5 second timeout
      // });
      
      // console.log('✅ Journey data sent successfully:', response.status);
      
    } catch (error) {
      // console.error('❌ Failed to send journey data:', error);
      
      // Store failed data in localStorage for retry later
      this.storeFailedData(this.generateJourneyData());
    }
  }

  private storeFailedData(data: UserJourneyData): void {
    try {
      const failedData = localStorage.getItem('failed_journey_data');
      const failedArray = failedData ? JSON.parse(failedData) : [];
      
      failedArray.push({
        ...data,
        failed_at: new Date().toISOString()
      });
      
      // Keep only last 10 failed attempts
      if (failedArray.length > 10) {
        failedArray.splice(0, failedArray.length - 10);
      }
      
      localStorage.setItem('failed_journey_data', JSON.stringify(failedArray));
      console.log('💾 Failed journey data stored for retry');
      
    } catch (error) {
      console.error('Failed to store journey data:', error);
    }
  }

  // Public method to manually end session
  public endSessionManually(): void {
    this.endSession('manual_end');
  }

  // Public method to get current session info
  public getSessionInfo() {
    return {
      sessionId: this.sessionId,
      isActive: this.isSessionActive,
      startTime: this.startTime,
      currentPage: this.currentPage,
      pageVisits: this.pageVisits.length,
      userActions: this.userActions.length
    };
  }
}

// Create singleton instance
let journeyManager: UserJourneyManager | null = null;

// Export singleton functions
export const initializeUserJourney = (): UserJourneyManager => {
  if (!journeyManager) {
    journeyManager = new UserJourneyManager();
  }
  return journeyManager;
};

export const trackPageVisit = (page: string, title?: string): void => {
  if (journeyManager) {
    journeyManager.trackPageVisit(page, title);
  }
};

export const trackUserAction = (action: string, additionalData?: any): void => {
  if (journeyManager) {
    journeyManager.trackUserAction(action, additionalData);
  }
};

export const trackSignup = (signupData: {
  method: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
}): void => {
  if (journeyManager) {
    journeyManager.trackSignup(signupData);
  }
};

export const endUserJourney = (): void => {
  if (journeyManager) {
    journeyManager.endSessionManually();
    journeyManager = null;
  }
};

export const getUserJourneyInfo = () => {
  return journeyManager?.getSessionInfo() || null;
};