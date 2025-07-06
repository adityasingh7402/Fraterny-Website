-- ===================================
-- QUEST SESSIONS TABLE MIGRATION
-- Creates quest attempt tracking and progress management
-- ===================================

BEGIN;

-- Create quest_sessions table
CREATE TABLE quest_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- References
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  quest_definition_id UUID, -- For future quest templates
  
  -- Session Details
  session_status TEXT DEFAULT 'started' CHECK (session_status IN ('started', 'in_progress', 'completed', 'abandoned')),
  
  -- Progress Tracking
  current_question_index INTEGER DEFAULT 0,
  total_questions INTEGER NOT NULL,
  questions_answered INTEGER DEFAULT 0,
  questions_skipped INTEGER DEFAULT 0,
  
  -- Timing Information
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  last_activity_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  total_duration_minutes DECIMAL(6,2),
  
  -- Session Data
  responses JSONB DEFAULT '[]', -- Array of response objects
  progress_percentage DECIMAL(5,2) DEFAULT 0.00,
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for quest session queries
CREATE INDEX idx_quest_sessions_user_id ON quest_sessions(user_id);
CREATE INDEX idx_quest_sessions_status ON quest_sessions(session_status);
CREATE INDEX idx_quest_sessions_completed ON quest_sessions(user_id, completed_at) WHERE completed_at IS NOT NULL;
CREATE INDEX idx_quest_sessions_active ON quest_sessions(user_id, last_activity_at) WHERE session_status IN ('started', 'in_progress');

-- Enable Row Level Security
ALTER TABLE quest_sessions ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies
CREATE POLICY "Users can view own quest sessions" ON quest_sessions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own quest sessions" ON quest_sessions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own quest sessions" ON quest_sessions
  FOR UPDATE USING (auth.uid() = user_id);

COMMIT;