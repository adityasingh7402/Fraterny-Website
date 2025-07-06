-- ===================================
-- USER PROFILES TABLE MIGRATION
-- Creates user subscription and preference management
-- ===================================

BEGIN;

-- Create user_profiles table
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Subscription Management
  subscription_type TEXT NOT NULL DEFAULT 'free' CHECK (subscription_type IN ('free', 'paid')),
  subscription_start_date TIMESTAMP WITH TIME ZONE,
  subscription_end_date TIMESTAMP WITH TIME ZONE,
  payment_status TEXT DEFAULT 'active' CHECK (payment_status IN ('active', 'cancelled', 'expired', 'pending')),
  
  -- User Preferences
  email_notifications BOOLEAN DEFAULT true,
  quest_reminders BOOLEAN DEFAULT true,
  data_sharing_consent BOOLEAN DEFAULT false,
  privacy_level TEXT DEFAULT 'standard' CHECK (privacy_level IN ('minimal', 'standard', 'full')),
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Constraints
  UNIQUE(user_id)
);

-- Create indexes for performance
CREATE INDEX idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX idx_user_profiles_subscription ON user_profiles(subscription_type, payment_status);

-- Enable Row Level Security
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies
CREATE POLICY "Users can view own profile" ON user_profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" ON user_profiles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile" ON user_profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

COMMIT;