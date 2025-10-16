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
      additional: {
        Row: {
          id: number
          usdinr: string
        }
        Insert: {
          id?: number
          usdinr: string
        }
        Update: {
          id?: number
          usdinr?: string
        }
        Relationships: []
      }
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
      },
      user_session_history: {
        Row: {
          id: string
          user_id: string
          session_id: string
          testid: string | null
          created_at: string
          is_viewed: boolean
        }
        Insert: {
          id?: string
          user_id: string
          session_id: string
          testid: string | null
          created_at?: string
          is_viewed?: boolean
        }
        Update: {
          id?: string
          user_id?: string
          session_id?: string
          testid: string | null
          created_at?: string
          is_viewed?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "user_session_history_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      transaction_details: {
        Row: {
          id: number
          total_discount: number | null
          coupon: string | null
          total_paid: number | null
          date: string | null
          order_id: string | null
          status: string | null
          session_id: string | null
          user_id: string | null
          testid: string | null
          payment_session_id: string | null
          payment_id: string | null
          session_duration: string | null
          session_start_time: string | null
          payment_completed_time: string | null
          IsIndia: boolean | null
          gateway: string | null
          paypal_order_id: string | null
          transaction_id: string | null
        }
        Insert: {
          id?: number
          total_discount?: number | null
          coupon?: string | null
          total_paid?: number | null
          date?: string | null
          order_id?: string | null
          status?: string | null
          session_id?: string | null
          user_id?: string | null
          testid?: string | null
          payment_session_id?: string | null
          payment_id?: string | null
          session_duration?: string | null
          session_start_time?: string | null
          payment_completed_time?: string | null
          IsIndia?: boolean | null
          gateway?: string | null
          paypal_order_id?: string | null
          transaction_id?: string | null
        }
        Update: {
          id?: number
          total_discount?: number | null
          coupon?: string | null
          total_paid?: number | null
          date?: string | null
          order_id?: string | null
          status?: string | null
          session_id?: string | null
          user_id?: string | null
          testid?: string | null
          payment_session_id?: string | null
          payment_id?: string | null
          session_duration?: string | null
          session_start_time?: string | null
          payment_completed_time?: string | null
          IsIndia?: boolean | null
          gateway?: string | null
          paypal_order_id?: string | null
          transaction_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "transaction_details_testid_fkey"
            columns: ["testid"]
            isOneToOne: false
            referencedRelation: "summary_generation"
            referencedColumns: ["testid"]
          },
          {
            foreignKeyName: "transaction_details_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_data"
            referencedColumns: ["user_id"]
          }
        ]
      }
      user_data: {
        Row: {
          user_name: string
          email: string
          dob: string | null
          mobile_number: string | null
          city: string | null
          total_summary_generation: number | null
          total_paid_generation: number | null
          last_used: string | null
          is_anonymous: string | null
          user_id: string
          gender: string | null
        }
        Insert: {
          user_name?: string
          email?: string
          dob?: string | null
          mobile_number?: string | null
          city?: string | null
          total_summary_generation?: number | null
          total_paid_generation?: number | null
          last_used?: string | null
          is_anonymous?: string | null
          user_id: string
          gender?: string | null
        }
        Update: {
          user_name?: string
          email?: string
          dob?: string | null
          mobile_number?: string | null
          city?: string | null
          total_summary_generation?: number | null
          total_paid_generation?: number | null
          last_used?: string | null
          is_anonymous?: string | null
          user_id?: string
          gender?: string | null
        }
        Relationships: []
      }
      summary_generation: {
        Row: {
          id: number
          user_id: string | null
          starting_time: string | null
          question_answer: string | null
          summary_response: string | null
          device_type: string | null
          device_browser: string | null
          operating_system: string | null
          completion_time: string | null
          complete_duration: string | null
          q1_5: string | null
          q2_1: string | null
          q2_2: string | null
          q2_3: string | null
          q3_1: string | null
          q3_2: string | null
          q3_3: string | null
          q3_4: string | null
          q3_5: string | null
          q3_6: string | null
          q4_1: string | null
          q4_2: string | null
          q4_3: string | null
          q4_4: string | null
          q5_1: string | null
          q5_2: string | null
          q5_3: string | null
          session_id: string | null
          testid: string | null
          quest_pdf: string | null
          payment_status: string | null
          paid_generation_time: string | null
          summary_error: string | null
          quest_error: string | null
          quest_status: string | null
          brain_mapping: string | null
          future_compass: string | null
          content_output: string | null
          q1_1: string | null
          q1_3: string | null
          q1_4: string | null
          q1_2: string | null
          thought: string | null
          agent_start_time: string | null
          agent_completion_time: string | null
          total_time_taken_by_agent: number | null
          status: string | null
          url: string | null
          qualityscore: string | null
          AQI: number | null
          pdf_attempt: number | null
          paid_agent_start_time: string | null
          paid_agent_complete_time: string | null
          paid_agent_time: number | null
          ip_address: string | null
          device_fingerprint: string | null
          perecentile: string | null
          Archetype: string | null
        }
        Insert: {
          id?: number
          user_id?: string | null
          starting_time?: string | null
          question_answer?: string | null
          summary_response?: string | null
          device_type?: string | null
          device_browser?: string | null
          operating_system?: string | null
          completion_time?: string | null
          complete_duration?: string | null
          q1_5?: string | null
          q2_1?: string | null
          q2_2?: string | null
          q2_3?: string | null
          q3_1?: string | null
          q3_2?: string | null
          q3_3?: string | null
          q3_4?: string | null
          q3_5?: string | null
          q3_6?: string | null
          q4_1?: string | null
          q4_2?: string | null
          q4_3?: string | null
          q4_4?: string | null
          q5_1?: string | null
          q5_2?: string | null
          q5_3?: string | null
          session_id?: string | null
          testid?: string | null
          quest_pdf?: string | null
          payment_status?: string | null
          paid_generation_time?: string | null
          summary_error?: string | null
          quest_error?: string | null
          quest_status?: string | null
          brain_mapping?: string | null
          future_compass?: string | null
          content_output?: string | null
          q1_1?: string | null
          q1_3?: string | null
          q1_4?: string | null
          q1_2?: string | null
          thought?: string | null
          agent_start_time?: string | null
          agent_completion_time?: string | null
          total_time_taken_by_agent?: number | null
          status?: string | null
          url?: string | null
          qualityscore?: string | null
          AQI?: number | null
          pdf_attempt?: number | null
          paid_agent_start_time?: string | null
          paid_agent_complete_time?: string | null
          paid_agent_time?: number | null
          ip_address?: string | null
          device_fingerprint?: string | null
          perecentile?: string | null
          Archetype?: string | null
        }
        Update: {
          id?: number
          user_id?: string | null
          starting_time?: string | null
          question_answer?: string | null
          summary_response?: string | null
          device_type?: string | null
          device_browser?: string | null
          operating_system?: string | null
          completion_time?: string | null
          complete_duration?: string | null
          q1_5?: string | null
          q2_1?: string | null
          q2_2?: string | null
          q2_3?: string | null
          q3_1?: string | null
          q3_2?: string | null
          q3_3?: string | null
          q3_4?: string | null
          q3_5?: string | null
          q3_6?: string | null
          q4_1?: string | null
          q4_2?: string | null
          q4_3?: string | null
          q4_4?: string | null
          q5_1?: string | null
          q5_2?: string | null
          q5_3?: string | null
          session_id?: string | null
          testid?: string | null
          quest_pdf?: string | null
          payment_status?: string | null
          paid_generation_time?: string | null
          summary_error?: string | null
          quest_error?: string | null
          quest_status?: string | null
          brain_mapping?: string | null
          future_compass?: string | null
          content_output?: string | null
          q1_1?: string | null
          q1_3?: string | null
          q1_4?: string | null
          q1_2?: string | null
          thought?: string | null
          agent_start_time?: string | null
          agent_completion_time?: string | null
          total_time_taken_by_agent?: number | null
          status?: string | null
          url?: string | null
          qualityscore?: string | null
          AQI?: number | null
          pdf_attempt?: number | null
          paid_agent_start_time?: string | null
          paid_agent_complete_time?: string | null
          paid_agent_time?: number | null
          ip_address?: string | null
          device_fingerprint?: string | null
          perecentile?: string | null
          Archetype?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "summary_generation_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_data"
            referencedColumns: ["user_id"]
          }
        ]
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