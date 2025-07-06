// export type Json =
//   | string
//   | number
//   | boolean
//   | null
//   | { [key: string]: Json | undefined }
//   | Json[]

// export type Database = {
//   public: {
//     Tables: {
//       blog_comments: {
//         Row: {
//           blog_post_id: string
//           content: string
//           created_at: string
//           email: string
//           id: string
//           name: string
//         }
//         Insert: {
//           blog_post_id: string
//           content: string
//           created_at?: string
//           email: string
//           id?: string
//           name: string
//         }
//         Update: {
//           blog_post_id?: string
//           content?: string
//           created_at?: string
//           email?: string
//           id?: string
//           name?: string
//         }
//         Relationships: [
//           {
//             foreignKeyName: "blog_comments_blog_post_id_fkey"
//             columns: ["blog_post_id"]
//             isOneToOne: false
//             referencedRelation: "blog_posts"
//             referencedColumns: ["id"]
//           },
//         ]
//       }
//       blog_posts: {
//         Row: {
//           category: string | null
//           content: string
//           created_at: string
//           id: string
//           image_key: string | null
//           published: boolean
//           tags: string[] | null
//           title: string
//           updated_at: string
//         }
//         Insert: {
//           category?: string | null
//           content: string
//           created_at?: string
//           id?: string
//           image_key?: string | null
//           published?: boolean
//           tags?: string[] | null
//           title: string
//           updated_at?: string
//         }
//         Update: {
//           category?: string | null
//           content?: string
//           created_at?: string
//           id?: string
//           image_key?: string | null
//           published?: boolean
//           tags?: string[] | null
//           title?: string
//           updated_at?: string
//         }
//         Relationships: []
//       }
//       newsletter_subscribers: {
//         Row: {
//           created_at: string
//           email: string
//           id: string
//         }
//         Insert: {
//           created_at?: string
//           email: string
//           id?: string
//         }
//         Update: {
//           created_at?: string
//           email?: string
//           id?: string
//         }
//         Relationships: []
//       }
//       website_images: {
//         Row: {
//           alt_text: string
//           category: string | null
//           created_at: string
//           description: string
//           height: number | null
//           id: string
//           key: string
//           metadata: Json | null
//           sizes: Json | null
//           storage_path: string
//           updated_at: string
//           width: number | null
//         }
//         Insert: {
//           alt_text: string
//           category?: string | null
//           created_at?: string
//           description: string
//           height?: number | null
//           id?: string
//           key: string
//           metadata?: Json | null
//           sizes?: Json | null
//           storage_path: string
//           updated_at?: string
//           width?: number | null
//         }
//         Update: {
//           alt_text?: string
//           category?: string | null
//           created_at?: string
//           description?: string
//           height?: number | null
//           id?: string
//           key?: string
//           metadata?: Json | null
//           sizes?: Json | null
//           storage_path?: string
//           updated_at?: string
//           width?: number | null
//         }
//         Relationships: []
//       }
//       website_settings: {
//         Row: {
//           created_at: string
//           id: string
//           key: string
//           updated_at: string
//           value: string
//         }
//         Insert: {
//           created_at?: string
//           id?: string
//           key: string
//           updated_at?: string
//           value: string
//         }
//         Update: {
//           created_at?: string
//           id?: string
//           key?: string
//           updated_at?: string
//           value?: string
//         }
//         Relationships: []
//       }
//     }
//     Views: {
//       [_ in never]: never
//     }
//     Functions: {
//       get_current_user_role: {
//         Args: Record<PropertyKey, never>
//         Returns: {
//           is_admin: boolean
//         }[]
//       }
//     }
//     Enums: {
//       [_ in never]: never
//     }
//     CompositeTypes: {
//       [_ in never]: never
//     }
//   }
// }

// type DefaultSchema = Database[Extract<keyof Database, "public">]

// export type Tables<
//   DefaultSchemaTableNameOrOptions extends
//     | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
//     | { schema: keyof Database },
//   TableName extends DefaultSchemaTableNameOrOptions extends {
//     schema: keyof Database
//   }
//     ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
//         Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
//     : never = never,
// > = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
//   ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
//       Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
//       Row: infer R
//     }
//     ? R
//     : never
//   : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
//         DefaultSchema["Views"])
//     ? (DefaultSchema["Tables"] &
//         DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
//         Row: infer R
//       }
//       ? R
//       : never
//     : never

// export type TablesInsert<
//   DefaultSchemaTableNameOrOptions extends
//     | keyof DefaultSchema["Tables"]
//     | { schema: keyof Database },
//   TableName extends DefaultSchemaTableNameOrOptions extends {
//     schema: keyof Database
//   }
//     ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
//     : never = never,
// > = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
//   ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
//       Insert: infer I
//     }
//     ? I
//     : never
//   : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
//     ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
//         Insert: infer I
//       }
//       ? I
//       : never
//     : never

// export type TablesUpdate<
//   DefaultSchemaTableNameOrOptions extends
//     | keyof DefaultSchema["Tables"]
//     | { schema: keyof Database },
//   TableName extends DefaultSchemaTableNameOrOptions extends {
//     schema: keyof Database
//   }
//     ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
//     : never = never,
// > = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
//   ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
//       Update: infer U
//     }
//     ? U
//     : never
//   : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
//     ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
//         Update: infer U
//       }
//       ? U
//       : never
//     : never

// export type Enums<
//   DefaultSchemaEnumNameOrOptions extends
//     | keyof DefaultSchema["Enums"]
//     | { schema: keyof Database },
//   EnumName extends DefaultSchemaEnumNameOrOptions extends {
//     schema: keyof Database
//   }
//     ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
//     : never = never,
// > = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
//   ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
//   : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
//     ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
//     : never

// export type CompositeTypes<
//   PublicCompositeTypeNameOrOptions extends
//     | keyof DefaultSchema["CompositeTypes"]
//     | { schema: keyof Database },
//   CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
//     schema: keyof Database
//   }
//     ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
//     : never = never,
// > = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
//   ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
//   : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
//     ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
//     : never

// export const Constants = {
//   public: {
//     Enums: {},
//   },
// } as const


export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      blog_comments: {
        Row: {
          blog_post_id: string
          content: string
          created_at: string
          email: string
          id: string
          name: string
        }
        Insert: {
          blog_post_id: string
          content: string
          created_at?: string
          email: string
          id?: string
          name: string
        }
        Update: {
          blog_post_id?: string
          content?: string
          created_at?: string
          email?: string
          id?: string
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "blog_comments_blog_post_id_fkey"
            columns: ["blog_post_id"]
            isOneToOne: false
            referencedRelation: "blog_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      blog_posts: {
        Row: {
          category: string | null
          content: string
          created_at: string
          id: string
          image_key: string | null
          published: boolean
          tags: string[] | null
          title: string
          updated_at: string
        }
        Insert: {
          category?: string | null
          content: string
          created_at?: string
          id?: string
          image_key?: string | null
          published?: boolean
          tags?: string[] | null
          title: string
          updated_at?: string
        }
        Update: {
          category?: string | null
          content?: string
          created_at?: string
          id?: string
          image_key?: string | null
          published?: boolean
          tags?: string[] | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      newsletter_subscribers: {
        Row: {
          created_at: string
          email: string
          id: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
        }
        Relationships: []
      }
      website_images: {
        Row: {
          alt_text: string
          category: string | null
          created_at: string
          description: string
          height: number | null
          id: string
          key: string
          metadata: Json | null
          sizes: Json | null
          storage_path: string
          updated_at: string
          width: number | null
        }
        Insert: {
          alt_text: string
          category?: string | null
          created_at?: string
          description: string
          height?: number | null
          id?: string
          key: string
          metadata?: Json | null
          sizes?: Json | null
          storage_path: string
          updated_at?: string
          width?: number | null
        }
        Update: {
          alt_text?: string
          category?: string | null
          created_at?: string
          description?: string
          height?: number | null
          id?: string
          key?: string
          metadata?: Json | null
          sizes?: Json | null
          storage_path?: string
          updated_at?: string
          width?: number | null
        }
        Relationships: []
      }
      website_settings: {
        Row: {
          created_at: string
          id: string
          key: string
          updated_at: string
          value: string
        }
        Insert: {
          created_at?: string
          id?: string
          key: string
          updated_at?: string
          value: string
        }
        Update: {
          created_at?: string
          id?: string
          key?: string
          updated_at?: string
          value?: string
        }
        Relationships: []
      }
      // ===== NEW QUEST ANALYTICS TABLES =====
      user_profiles: {
        Row: {
          id: string
          user_id: string
          subscription_type: 'free' | 'paid'
          subscription_start_date: string | null
          subscription_end_date: string | null
          payment_status: 'active' | 'cancelled' | 'expired' | 'pending'
          email_notifications: boolean
          quest_reminders: boolean
          data_sharing_consent: boolean
          privacy_level: 'minimal' | 'standard' | 'full'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          subscription_type?: 'free' | 'paid'
          subscription_start_date?: string | null
          subscription_end_date?: string | null
          payment_status?: 'active' | 'cancelled' | 'expired' | 'pending'
          email_notifications?: boolean
          quest_reminders?: boolean
          data_sharing_consent?: boolean
          privacy_level?: 'minimal' | 'standard' | 'full'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          subscription_type?: 'free' | 'paid'
          subscription_start_date?: string | null
          subscription_end_date?: string | null
          payment_status?: 'active' | 'cancelled' | 'expired' | 'pending'
          email_notifications?: boolean
          quest_reminders?: boolean
          data_sharing_consent?: boolean
          privacy_level?: 'minimal' | 'standard' | 'full'
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_analytics: {
        Row: {
          id: string
          user_id: string
          total_logins: number
          logins_30d: number
          logins_90d: number
          last_login_at: string | null
          first_login_at: string | null
          total_quests_started: number
          total_quests_completed: number
          average_quest_duration_minutes: number
          last_quest_at: string | null
          total_sessions: number
          average_session_duration_minutes: number
          quest_completion_rate: number
          days_since_last_login: number
          days_since_registration: number
          user_engagement_score: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          total_logins?: number
          logins_30d?: number
          logins_90d?: number
          last_login_at?: string | null
          first_login_at?: string | null
          total_quests_started?: number
          total_quests_completed?: number
          average_quest_duration_minutes?: number
          last_quest_at?: string | null
          total_sessions?: number
          average_session_duration_minutes?: number
          quest_completion_rate?: number
          days_since_last_login?: number
          days_since_registration?: number
          user_engagement_score?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          total_logins?: number
          logins_30d?: number
          logins_90d?: number
          last_login_at?: string | null
          first_login_at?: string | null
          total_quests_started?: number
          total_quests_completed?: number
          average_quest_duration_minutes?: number
          last_quest_at?: string | null
          total_sessions?: number
          average_session_duration_minutes?: number
          quest_completion_rate?: number
          days_since_last_login?: number
          days_since_registration?: number
          user_engagement_score?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      quest_sessions: {
        Row: {
          id: string
          user_id: string
          quest_definition_id: string | null
          session_status: 'started' | 'in_progress' | 'completed' | 'abandoned'
          current_question_index: number
          total_questions: number
          questions_answered: number
          questions_skipped: number
          started_at: string
          completed_at: string | null
          last_activity_at: string
          total_duration_minutes: number | null
          responses: Json
          progress_percentage: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          quest_definition_id?: string | null
          session_status?: 'started' | 'in_progress' | 'completed' | 'abandoned'
          current_question_index?: number
          total_questions: number
          questions_answered?: number
          questions_skipped?: number
          started_at?: string
          completed_at?: string | null
          last_activity_at?: string
          total_duration_minutes?: number | null
          responses?: Json
          progress_percentage?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          quest_definition_id?: string | null
          session_status?: 'started' | 'in_progress' | 'completed' | 'abandoned'
          current_question_index?: number
          total_questions?: number
          questions_answered?: number
          questions_skipped?: number
          started_at?: string
          completed_at?: string | null
          last_activity_at?: string
          total_duration_minutes?: number | null
          responses?: Json
          progress_percentage?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      quest_responses: {
        Row: {
          id: string
          session_id: string
          user_id: string
          question_index: number
          question_text: string
          question_difficulty: 'easy' | 'medium' | 'hard'
          response_text: string
          response_type: 'multiple_choice' | 'text_input' | 'scale_rating' | 'image_choice'
          self_awareness_tags: string[]
          response_time_seconds: number | null
          revision_count: number
          answered_at: string
          created_at: string
        }
        Insert: {
          id?: string
          session_id: string
          user_id: string
          question_index: number
          question_text: string
          question_difficulty: 'easy' | 'medium' | 'hard'
          response_text: string
          response_type: 'multiple_choice' | 'text_input' | 'scale_rating' | 'image_choice'
          self_awareness_tags?: string[]
          response_time_seconds?: number | null
          revision_count?: number
          answered_at?: string
          created_at?: string
        }
        Update: {
          id?: string
          session_id?: string
          user_id?: string
          question_index?: number
          question_text?: string
          question_difficulty?: 'easy' | 'medium' | 'hard'
          response_text?: string
          response_type?: 'multiple_choice' | 'text_input' | 'scale_rating' | 'image_choice'
          self_awareness_tags?: string[]
          response_time_seconds?: number | null
          revision_count?: number
          answered_at?: string
          created_at?: string
        }
        Relationships: []
      }
      quest_results: {
        Row: {
          id: string
          session_id: string
          user_id: string
          ai_analysis: Json
          personality_insights: Json | null
          behavioral_patterns: Json | null
          recommendations: Json | null
          analysis_version: string | null
          confidence_score: number | null
          processing_time_seconds: number | null
          is_shareable: boolean
          shared_publicly: boolean
          generated_at: string
          created_at: string
        }
        Insert: {
          id?: string
          session_id: string
          user_id: string
          ai_analysis: Json
          personality_insights?: Json | null
          behavioral_patterns?: Json | null
          recommendations?: Json | null
          analysis_version?: string | null
          confidence_score?: number | null
          processing_time_seconds?: number | null
          is_shareable?: boolean
          shared_publicly?: boolean
          generated_at?: string
          created_at?: string
        }
        Update: {
          id?: string
          session_id?: string
          user_id?: string
          ai_analysis?: Json
          personality_insights?: Json | null
          behavioral_patterns?: Json | null
          recommendations?: Json | null
          analysis_version?: string | null
          confidence_score?: number | null
          processing_time_seconds?: number | null
          is_shareable?: boolean
          shared_publicly?: boolean
          generated_at?: string
          created_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_current_user_role: {
        Args: Record<PropertyKey, never>
        Returns: {
          is_admin: boolean
        }[]
      }
      update_login_analytics: {
        Args: {
          p_user_id: string
        }
        Returns: undefined
      }
      update_quest_analytics: {
        Args: {
          p_user_id: string
          p_duration_minutes: number
          p_completed?: boolean
        }
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const