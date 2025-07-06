// ===================================
// QUEST DATABASE SERVICE
// Core service for all quest-related database operations
// ===================================

import { supabase } from '@/integrations/supabase/client';
import type { 
  QuestSession, 
  QuestResponse, 
  UserAnalytics, 
  UserProfile,
  SaveQuestResponseRequest,
  CreateSessionRequest,
  UpdateSessionRequest,
  QuestError,
  QuestOperationResult,
  SessionStatus
} from '@/types/quest';
import type { 
  AIPayload, 
  AIUserResponse, 
  AIUserData, 
  AIAssessmentMetadata, 
  AIUserAnalytics,
  RawQuestData
} from '@/types/aiPayload';

export class QuestDatabaseService {
  
  // ===================================
  // USER ANALYTICS OPERATIONS
  // ===================================
  
  /**
   * Update user login analytics (called on each login)
   */
  async updateLoginAnalytics(userId: string): Promise<QuestOperationResult<void>> {
    try {
      const { error } = await supabase.rpc('update_login_analytics', {
        p_user_id: userId
      });
      
      if (error) {
        console.error('Error updating login analytics:', error);
        return {
          success: false,
          error: {
            code: 'DATABASE_ERROR',
            message: 'Failed to update login analytics',
            details: error
          }
        };
      }
      
      return { success: true };
    } catch (error) {
      console.error('Unexpected error updating login analytics:', error);
      return {
        success: false,
        error: {
          code: 'DATABASE_ERROR',
          message: 'Unexpected error updating login analytics',
          details: error
        }
      };
    }
  }
  
  /**
   * Get user analytics data
   */
  async getUserAnalytics(userId: string): Promise<QuestOperationResult<UserAnalytics>> {
    try {
      const { data, error } = await supabase
        .from('user_analytics')
        .select('*')
        .eq('user_id', userId)
        .single();
      
      if (error) {
        // If user analytics don't exist, that's okay - they'll be created on first login
        if (error.code === 'PGRST116') {
          return {
            success: false,
            error: {
              code: 'VALIDATION_ERROR',
              message: 'User analytics not found - user may need to log in first'
            }
          };
        }
        
        console.error('Error fetching user analytics:', error);
        return {
          success: false,
          error: {
            code: 'DATABASE_ERROR',
            message: 'Failed to fetch user analytics',
            details: error
          }
        };
      }
      
      return {
        success: true,
        data: data as UserAnalytics
      };
    } catch (error) {
      console.error('Unexpected error fetching user analytics:', error);
      return {
        success: false,
        error: {
          code: 'DATABASE_ERROR',
          message: 'Unexpected error fetching user analytics',
          details: error
        }
      };
    }
  }
  
  /**
   * Get or create user profile
   */
  async getUserProfile(userId: string): Promise<QuestOperationResult<UserProfile>> {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', userId)
        .single();
      
      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching user profile:', error);
        return {
          success: false,
          error: {
            code: 'DATABASE_ERROR',
            message: 'Failed to fetch user profile',
            details: error
          }
        };
      }
      
      // If profile doesn't exist, create it
      if (!data) {
        const { data: newProfile, error: createError } = await supabase
          .from('user_profiles')
          .insert({
            user_id: userId,
            subscription_type: 'free',
            payment_status: 'active',
            email_notifications: true,
            quest_reminders: true,
            data_sharing_consent: false,
            privacy_level: 'standard'
          })
          .select()
          .single();
        
        if (createError) {
          console.error('Error creating user profile:', createError);
          return {
            success: false,
            error: {
              code: 'DATABASE_ERROR',
              message: 'Failed to create user profile',
              details: createError
            }
          };
        }
        
        return {
          success: true,
          data: newProfile as UserProfile
        };
      }
      
      return {
        success: true,
        data: data as UserProfile
      };
    } catch (error) {
      console.error('Unexpected error with user profile:', error);
      return {
        success: false,
        error: {
          code: 'DATABASE_ERROR',
          message: 'Unexpected error with user profile',
          details: error
        }
      };
    }
  }
  
  // ===================================
  // QUEST SESSION OPERATIONS
  // ===================================
  
  /**
   * Create a new quest session
   */
  async createQuestSession(request: CreateSessionRequest): Promise<QuestOperationResult<QuestSession>> {
    try {
      const { data, error } = await supabase
        .from('quest_sessions')
        .insert({
          user_id: request.user_id,
          total_questions: request.total_questions,
          quest_definition_id: request.quest_definition_id || null,
          session_status: 'started',
          current_question_index: 0,
          questions_answered: 0,
          questions_skipped: 0,
          progress_percentage: 0,
          responses: []
        })
        .select()
        .single();
      
      if (error) {
        console.error('Error creating quest session:', error);
        return {
          success: false,
          error: {
            code: 'DATABASE_ERROR',
            message: 'Failed to create quest session',
            details: error
          }
        };
      }
      
      return {
        success: true,
        data: data as QuestSession
      };
    } catch (error) {
      console.error('Unexpected error creating quest session:', error);
      return {
        success: false,
        error: {
          code: 'DATABASE_ERROR',
          message: 'Unexpected error creating quest session',
          details: error
        }
      };
    }
  }
  
  /**
   * Update quest session
   */
  async updateQuestSession(request: UpdateSessionRequest): Promise<QuestOperationResult<void>> {
    try {
      const { error } = await supabase
        .from('quest_sessions')
        .update({
          ...request,
          last_activity_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', request.session_id);
      
      if (error) {
        console.error('Error updating quest session:', error);
        return {
          success: false,
          error: {
            code: 'DATABASE_ERROR',
            message: 'Failed to update quest session',
            details: error
          }
        };
      }
      
      return { success: true };
    } catch (error) {
      console.error('Unexpected error updating quest session:', error);
      return {
        success: false,
        error: {
          code: 'DATABASE_ERROR',
          message: 'Unexpected error updating quest session',
          details: error
        }
      };
    }
  }
  
  /**
   * Get quest session by ID
   */
  async getQuestSession(sessionId: string): Promise<QuestOperationResult<QuestSession>> {
    try {
      const { data, error } = await supabase
        .from('quest_sessions')
        .select('*')
        .eq('id', sessionId)
        .single();
      
      if (error) {
        if (error.code === 'PGRST116') {
          return {
            success: false,
            error: {
              code: 'SESSION_NOT_FOUND',
              message: 'Quest session not found'
            }
          };
        }
        
        console.error('Error fetching quest session:', error);
        return {
          success: false,
          error: {
            code: 'DATABASE_ERROR',
            message: 'Failed to fetch quest session',
            details: error
          }
        };
      }
      
      return {
        success: true,
        data: data as QuestSession
      };
    } catch (error) {
      console.error('Unexpected error fetching quest session:', error);
      return {
        success: false,
        error: {
          code: 'DATABASE_ERROR',
          message: 'Unexpected error fetching quest session',
          details: error
        }
      };
    }
  }
  
  /**
   * Complete quest session and update analytics
   */
  async completeQuestSession(
    sessionId: string, 
    userId: string, 
    durationMinutes: number
  ): Promise<QuestOperationResult<void>> {
    try {
      // Update session as completed
      const updateResult = await this.updateQuestSession({
        session_id: sessionId,
        session_status: 'completed',
        progress_percentage: 100
      });
      
      if (!updateResult.success) {
        return updateResult;
      }
      
      // Update session completion time and duration
      const { error: sessionError } = await supabase
        .from('quest_sessions')
        .update({
          completed_at: new Date().toISOString(),
          total_duration_minutes: durationMinutes
        })
        .eq('id', sessionId);
      
      if (sessionError) {
        console.error('Error updating session completion:', sessionError);
        return {
          success: false,
          error: {
            code: 'DATABASE_ERROR',
            message: 'Failed to update session completion',
            details: sessionError
          }
        };
      }
      
      // Update user analytics
      const { error: analyticsError } = await supabase.rpc('update_quest_analytics', {
        p_user_id: userId,
        p_duration_minutes: durationMinutes,
        p_completed: true
      });
      
      if (analyticsError) {
        console.error('Error updating quest analytics:', analyticsError);
        return {
          success: false,
          error: {
            code: 'DATABASE_ERROR',
            message: 'Failed to update quest analytics',
            details: analyticsError
          }
        };
      }
      
      return { success: true };
    } catch (error) {
      console.error('Unexpected error completing quest session:', error);
      return {
        success: false,
        error: {
          code: 'DATABASE_ERROR',
          message: 'Unexpected error completing quest session',
          details: error
        }
      };
    }
  }
  
  // ===================================
  // QUEST RESPONSE OPERATIONS
  // ===================================
  
  /**
   * Save quest response
   */
  async saveQuestResponse(request: SaveQuestResponseRequest): Promise<QuestOperationResult<void>> {
    try {
      const { error } = await supabase
        .from('quest_responses')
        .insert({
          session_id: request.session_id,
          user_id: '', // Will be filled by the calling code
          question_index: request.question_index,
          question_text: request.question_text,
          question_difficulty: request.question_difficulty,
          response_text: request.response_text,
          response_type: request.response_type,
          self_awareness_tags: request.self_awareness_tags,
          response_time_seconds: request.response_time_seconds || null,
          revision_count: 0
        });
      
      if (error) {
        console.error('Error saving quest response:', error);
        return {
          success: false,
          error: {
            code: 'DATABASE_ERROR',
            message: 'Failed to save quest response',
            details: error
          }
        };
      }
      
      return { success: true };
    } catch (error) {
      console.error('Unexpected error saving quest response:', error);
      return {
        success: false,
        error: {
          code: 'DATABASE_ERROR',
          message: 'Unexpected error saving quest response',
          details: error
        }
      };
    }
  }
  
  /**
   * Get session responses
   */
  async getSessionResponses(sessionId: string): Promise<QuestOperationResult<QuestResponse[]>> {
    try {
      const { data, error } = await supabase
        .from('quest_responses')
        .select('*')
        .eq('session_id', sessionId)
        .order('question_index');
      
      if (error) {
        console.error('Error fetching session responses:', error);
        return {
          success: false,
          error: {
            code: 'DATABASE_ERROR',
            message: 'Failed to fetch session responses',
            details: error
          }
        };
      }
      
      return {
        success: true,
        data: data as QuestResponse[]
      };
    } catch (error) {
      console.error('Unexpected error fetching session responses:', error);
      return {
        success: false,
        error: {
          code: 'DATABASE_ERROR',
          message: 'Unexpected error fetching session responses',
          details: error
        }
      };
    }
  }
  
  // ===================================
  // AI PAYLOAD GENERATION
  // ===================================
  
  /**
   * Generate complete AI payload for a completed session
   */
  async generateAIPayload(sessionId: string, userId: string): Promise<QuestOperationResult<AIPayload>> {
    try {
      // Get user profile
      const profileResult = await this.getUserProfile(userId);
      if (!profileResult.success) {
        return profileResult as unknown as  QuestOperationResult<AIPayload>;
      }
      
      // Get user analytics
      const analyticsResult = await this.getUserAnalytics(userId);
      if (!analyticsResult.success) {
        return analyticsResult as unknown as QuestOperationResult<AIPayload>;
      }
      
      // Get session responses
      const responsesResult = await this.getSessionResponses(sessionId);
      if (!responsesResult.success) {
        return responsesResult as unknown as QuestOperationResult<AIPayload>;
      }
      
      // Get session metadata
      const sessionResult = await this.getQuestSession(sessionId);
      if (!sessionResult.success) {
        return sessionResult as unknown as QuestOperationResult<AIPayload>;
      }
      
      // Get user basic info
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) {
        return {
          success: false,
          error: {
            code: 'AUTH_ERROR',
            message: 'User not authenticated'
          }
        };
      }
      
      const profile = profileResult.data!;
      const analytics = analyticsResult.data!;
      const responses = responsesResult.data!;
      const session = sessionResult.data!;
      
      // Build AI payload according to the defined structure
      const aiPayload: AIPayload = {
        user_responses: responses.map((response, index) => {
          const aiResponse: AIUserResponse = {
            [`question_${index + 1}`]: response.question_text,
            [`answer_${index + 1}`]: response.response_text,
            question_difficulty: response.question_difficulty,
            response_type: response.response_type,
            self_awareness_tags: response.self_awareness_tags
          };
          return aiResponse;
        }),
        user_data: [{
          name: `${user.user.user_metadata?.firstName || ''} ${user.user.user_metadata?.lastName || ''}`.trim() || 'Unknown User',
          email: user.user.email || '',
          user_type: profile.subscription_type
        }],
        assessment_metadata: {
          session_id: sessionId,
          completed_at: session.completed_at || new Date().toISOString(),
          total_questions: session.total_questions,
          answered_questions: session.questions_answered,
          skipped_questions: session.questions_skipped,
          assessment_version: 'v1.0',
          total_duration_minutes: session.total_duration_minutes || 0
        },
        user_analytics: {
          login_frequency: {
            last_30_days: analytics.logins_30d,
            last_90_days: analytics.logins_90d,
            lifetime: analytics.total_logins
          },
          engagement_history: {
            last_login: analytics.last_login_at || '',
            first_login: analytics.first_login_at || '',
            total_assessments_completed: analytics.total_quests_completed,
            average_assessment_duration_minutes: analytics.average_quest_duration_minutes,
            last_assessment_date: analytics.last_quest_at || undefined
          },
          activity_patterns: {
            days_since_last_login: analytics.days_since_last_login,
            days_since_registration: analytics.days_since_registration,
            total_platform_sessions: analytics.total_sessions,
            assessment_completion_rate: analytics.quest_completion_rate
          }
        }
      };
      
      return {
        success: true,
        data: aiPayload
      };
    } catch (error) {
      console.error('Unexpected error generating AI payload:', error);
      return {
        success: false,
        error: {
          code: 'DATABASE_ERROR',
          message: 'Unexpected error generating AI payload',
          details: error
        }
      };
    }
  }
}

// Export singleton instance
export const questDb = new QuestDatabaseService();