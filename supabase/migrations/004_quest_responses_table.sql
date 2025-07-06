-- ===================================
-- QUEST RESPONSES TABLE MIGRATION
-- Creates individual question response storage
-- ===================================

BEGIN;

-- Create quest_responses table
CREATE TABLE quest_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- References
  session_id UUID REFERENCES quest_sessions(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Question Information
  question_index INTEGER NOT NULL,
  question_text TEXT NOT NULL,
  question_difficulty TEXT NOT NULL CHECK (question_difficulty IN ('easy', 'medium', 'hard')),
  
  -- Response Information
  response_text TEXT NOT NULL,
  response_type TEXT NOT NULL CHECK (response_type IN ('multiple_choice', 'text_input', 'scale_rating', 'image_choice')),
  
  -- Self-Awareness Tags
  self_awareness_tags TEXT[] DEFAULT '{}', -- Array: ['Honest', 'Sarcastic', 'Unsure', 'Avoiding']
  
  -- Response Metadata
  response_time_seconds INTEGER, -- Time taken to answer this question
  revision_count INTEGER DEFAULT 0, -- How many times they changed their answer
  
  -- Timestamps
  answered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for response analysis
CREATE INDEX idx_quest_responses_session_id ON quest_responses(session_id);
CREATE INDEX idx_quest_responses_user_id ON quest_responses(user_id);
CREATE INDEX idx_quest_responses_difficulty ON quest_responses(question_difficulty);
CREATE INDEX idx_quest_responses_tags ON quest_responses USING GIN(self_awareness_tags);

-- Enable Row Level Security
ALTER TABLE quest_responses ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies
CREATE POLICY "Users can view own responses" ON quest_responses
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own responses" ON quest_responses
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- No updates allowed on responses (immutable records)
CREATE POLICY "No response updates" ON quest_responses
  FOR UPDATE USING (false);

COMMIT;