// ===================================
// QUEST USER ANALYTICS HOOK
// Hook for accessing and managing user analytics data
// ===================================

import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import type { 
  UserAnalytics, 
  UserProfile, 
  QuestError 
} from '@/types/quest';

interface AnalyticsState {
  analytics: UserAnalytics | null;
  profile: UserProfile | null;
  isLoading: boolean;
  error: QuestError | null;
  lastUpdated: string | null;
}

interface AnalyticsMetrics {
  engagementLevel: 'low' | 'medium' | 'high';
  loginStreak: number;
  averageSessionTime: number;
  completionTrend: 'improving' | 'stable' | 'declining';
  userLifecycleStage: 'new' | 'active' | 'returning' | 'dormant';
  timeUntilNextMilestone: number | null;
  nextMilestone: string | null;
}

export function useQuestAnalytics() {
  const { user, getQuestUserAnalytics, getQuestUserProfile } = useAuth();
  const [state, setState] = useState<AnalyticsState>({
    analytics: null,
    profile: null,
    isLoading: false,
    error: null,
    lastUpdated: null
  });

  const refreshInterval = useRef<NodeJS.Timeout | null>(null);
  const abortController = useRef<AbortController | null>(null);

  /**
   * Fetch analytics data from the server
   */
  const fetchAnalytics = useCallback(async (showLoading = true): Promise<void> => {
    if (!user) {
      setState(prev => ({
        ...prev,
        error: { code: 'AUTH_ERROR', message: 'User not authenticated' },
        isLoading: false
      }));
      return;
    }

    // Cancel any existing request
    if (abortController.current) {
      abortController.current.abort();
    }
    abortController.current = new AbortController();

    if (showLoading) {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
    }

    try {
      // Fetch both analytics and profile data in parallel
      const [analyticsResult, profileResult] = await Promise.all([
        getQuestUserAnalytics(),
        getQuestUserProfile()
      ]);

      // Check if request was aborted
      if (abortController.current?.signal.aborted) {
        return;
      }

      let newState: Partial<AnalyticsState> = {
        isLoading: false,
        lastUpdated: new Date().toISOString()
      };

      // Handle analytics result
      if (analyticsResult.success && analyticsResult.data) {
        newState.analytics = analyticsResult.data;
        newState.error = null;
      } else {
        // If analytics don't exist yet, that's okay for new users
        if (analyticsResult.error?.code === 'VALIDATION_ERROR') {
          newState.analytics = null;
          newState.error = null;
        } else {
          newState.error = analyticsResult.error || { code: 'DATABASE_ERROR', message: 'Failed to fetch analytics' };
        }
      }

      // Handle profile result
      if (profileResult.success && profileResult.data) {
        newState.profile = profileResult.data;
      } else {
        console.warn('Failed to fetch user profile:', profileResult.error);
      }

      setState(prev => ({ ...prev, ...newState }));
    } catch (error) {
      if (abortController.current?.signal.aborted) {
        return;
      }
      
      console.error('Error fetching analytics:', error);
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: { code: 'DATABASE_ERROR', message: 'Unexpected error fetching analytics', details: error }
      }));
    }
  }, [user, getQuestUserAnalytics, getQuestUserProfile]);

  /**
   * Calculate derived metrics from analytics data
   */
  const calculateMetrics = useCallback((): AnalyticsMetrics | null => {
    if (!state.analytics) return null;

    const analytics = state.analytics;

    // Calculate engagement level
    let engagementLevel: 'low' | 'medium' | 'high' = 'low';
    if (analytics.user_engagement_score >= 7) {
      engagementLevel = 'high';
    } else if (analytics.user_engagement_score >= 4) {
      engagementLevel = 'medium';
    }

    // Calculate login streak (simplified - based on recent activity)
    const loginStreak = analytics.days_since_last_login === 0 ? 
      Math.min(analytics.logins_30d, 30) : 0;

    // Average session time
    const averageSessionTime = analytics.average_session_duration_minutes;

    // Completion trend (simplified logic)
    let completionTrend: 'improving' | 'stable' | 'declining' = 'stable';
    if (analytics.quest_completion_rate > 0.8) {
      completionTrend = 'improving';
    } else if (analytics.quest_completion_rate < 0.3) {
      completionTrend = 'declining';
    }

    // User lifecycle stage
    let userLifecycleStage: 'new' | 'active' | 'returning' | 'dormant' = 'new';
    if (analytics.days_since_registration > 90 && analytics.days_since_last_login > 30) {
      userLifecycleStage = 'dormant';
    } else if (analytics.days_since_registration > 7 && analytics.logins_30d > 5) {
      userLifecycleStage = 'active';
    } else if (analytics.days_since_registration > 7) {
      userLifecycleStage = 'returning';
    }

    // Calculate next milestone
    let nextMilestone: string | null = null;
    let timeUntilNextMilestone: number | null = null;

    if (analytics.total_quests_completed < 1) {
      nextMilestone = 'Complete your first quest';
      timeUntilNextMilestone = 1 - analytics.total_quests_completed;
    } else if (analytics.total_quests_completed < 5) {
      nextMilestone = 'Complete 5 quests';
      timeUntilNextMilestone = 5 - analytics.total_quests_completed;
    } else if (analytics.total_quests_completed < 10) {
      nextMilestone = 'Complete 10 quests';
      timeUntilNextMilestone = 10 - analytics.total_quests_completed;
    } else if (analytics.quest_completion_rate < 0.8) {
      nextMilestone = 'Achieve 80% completion rate';
      timeUntilNextMilestone = null;
    }

    return {
      engagementLevel,
      loginStreak,
      averageSessionTime,
      completionTrend,
      userLifecycleStage,
      timeUntilNextMilestone,
      nextMilestone
    };
  }, [state.analytics]);

  /**
   * Get analytics for a specific time period
   */
  const getAnalyticsForPeriod = useCallback((period: '30d' | '90d' | 'lifetime') => {
    if (!state.analytics) return null;

    const analytics = state.analytics;
    
    switch (period) {
      case '30d':
        return {
          logins: analytics.logins_30d,
          period: 'Last 30 days'
        };
      case '90d':
        return {
          logins: analytics.logins_90d,
          period: 'Last 90 days'
        };
      case 'lifetime':
        return {
          logins: analytics.total_logins,
          period: 'All time'
        };
      default:
        return null;
    }
  }, [state.analytics]);

  /**
   * Get user subscription status
   */
  const getSubscriptionInfo = useCallback(() => {
    if (!state.profile) return null;

    return {
      type: state.profile.subscription_type,
      status: state.profile.payment_status,
      isActive: state.profile.payment_status === 'active',
      isPaid: state.profile.subscription_type === 'paid',
      startDate: state.profile.subscription_start_date,
      endDate: state.profile.subscription_end_date
    };
  }, [state.profile]);

  /**
   * Refresh analytics data
   */
  const refreshAnalytics = useCallback(async (): Promise<void> => {
    await fetchAnalytics(true);
  }, [fetchAnalytics]);

  /**
   * Clear any errors
   */
  const clearError = useCallback((): void => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  // Fetch analytics on mount and when user changes
  useEffect(() => {
    if (user) {
      fetchAnalytics(true);
    } else {
      setState({
        analytics: null,
        profile: null,
        isLoading: false,
        error: null,
        lastUpdated: null
      });
    }
  }, [user, fetchAnalytics]);

  // Set up periodic refresh (every 5 minutes)
  useEffect(() => {
    if (user && state.analytics) {
      refreshInterval.current = setInterval(() => {
        fetchAnalytics(false); // Silent refresh
      }, 5 * 60 * 1000); // 5 minutes

      return () => {
        if (refreshInterval.current) {
          clearInterval(refreshInterval.current);
        }
      };
    }
  }, [user, state.analytics, fetchAnalytics]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (refreshInterval.current) {
        clearInterval(refreshInterval.current);
      }
      if (abortController.current) {
        abortController.current.abort();
      }
    };
  }, []);

  return {
    // Raw data
    analytics: state.analytics,
    profile: state.profile,
    
    // State
    isLoading: state.isLoading,
    error: state.error,
    lastUpdated: state.lastUpdated,
    
    // Computed data
    metrics: calculateMetrics(),
    subscriptionInfo: getSubscriptionInfo(),
    
    // Actions
    refreshAnalytics,
    clearError,
    getAnalyticsForPeriod,
    
    // Utility functions
    hasData: !!state.analytics,
    isNewUser: !state.analytics || state.analytics.days_since_registration < 7,
    isActiveUser: !!state.analytics && state.analytics.days_since_last_login < 7,
    
    // Quick access to common metrics
    totalQuests: state.analytics?.total_quests_completed || 0,
    completionRate: state.analytics?.quest_completion_rate || 0,
    engagementScore: state.analytics?.user_engagement_score || 0,
    daysSinceLastLogin: state.analytics?.days_since_last_login || 0,
    loginFrequency30d: state.analytics?.logins_30d || 0
  };
}