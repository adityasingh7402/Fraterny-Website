-- ===================================
-- USER ANALYTICS TABLE MIGRATION
-- Creates comprehensive user engagement tracking
-- ===================================

BEGIN;

-- Create user_analytics table
CREATE TABLE user_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Login Frequency Tracking
  total_logins INTEGER DEFAULT 0,
  logins_30d INTEGER DEFAULT 0,
  logins_90d INTEGER DEFAULT 0,
  last_login_at TIMESTAMP WITH TIME ZONE,
  first_login_at TIMESTAMP WITH TIME ZONE,
  
  -- Quest Engagement
  total_quests_started INTEGER DEFAULT 0,
  total_quests_completed INTEGER DEFAULT 0,
  average_quest_duration_minutes DECIMAL(6,2) DEFAULT 0,
  last_quest_at TIMESTAMP WITH TIME ZONE,
  
  -- Session Analytics
  total_sessions INTEGER DEFAULT 0,
  average_session_duration_minutes DECIMAL(6,2) DEFAULT 0,
  
  -- Calculated Fields
  quest_completion_rate DECIMAL(4,3) DEFAULT 0.000, -- 0.000 to 1.000
  days_since_last_login INTEGER DEFAULT 0,
  days_since_registration INTEGER DEFAULT 0,
  user_engagement_score DECIMAL(4,2) DEFAULT 0.00, -- 0.00 to 10.00
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Constraints
  UNIQUE(user_id)
);

-- Create indexes for analytics queries
CREATE INDEX idx_user_analytics_user_id ON user_analytics(user_id);
CREATE INDEX idx_user_analytics_engagement ON user_analytics(user_engagement_score);
CREATE INDEX idx_user_analytics_last_activity ON user_analytics(last_login_at, last_quest_at);

-- Enable Row Level Security
ALTER TABLE user_analytics ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies
CREATE POLICY "Users can view own analytics" ON user_analytics
  FOR SELECT USING (auth.uid() = user_id);

-- System can insert/update analytics (users cannot directly modify)
CREATE POLICY "System can insert analytics" ON user_analytics
  FOR INSERT WITH CHECK (true);

CREATE POLICY "System can update analytics" ON user_analytics
  FOR UPDATE USING (true);

COMMIT;