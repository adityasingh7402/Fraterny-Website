-- ===================================
-- ANALYTICS FUNCTIONS MIGRATION
-- Creates automated analytics tracking functions
-- ===================================

BEGIN;

-- Function to update user analytics on login
CREATE OR REPLACE FUNCTION update_login_analytics(p_user_id UUID)
RETURNS VOID AS $$
DECLARE
  profile_exists BOOLEAN;
  analytics_exists BOOLEAN;
BEGIN
  -- Check if user profile exists, create if not
  SELECT EXISTS(SELECT 1 FROM user_profiles WHERE user_id = p_user_id) INTO profile_exists;
  
  IF NOT profile_exists THEN
    INSERT INTO user_profiles (user_id, created_at) 
    VALUES (p_user_id, NOW());
  END IF;
  
  -- Check if analytics record exists
  SELECT EXISTS(SELECT 1 FROM user_analytics WHERE user_id = p_user_id) INTO analytics_exists;
  
  IF NOT analytics_exists THEN
    -- Create new analytics record
    INSERT INTO user_analytics (
      user_id, 
      total_logins, 
      logins_30d, 
      logins_90d,
      last_login_at, 
      first_login_at,
      total_sessions,
      days_since_registration
    ) VALUES (
      p_user_id, 
      1, 
      1, 
      1,
      NOW(), 
      NOW(),
      1,
      0
    );
  ELSE
    -- Update existing analytics
    UPDATE user_analytics SET
      total_logins = total_logins + 1,
      logins_30d = logins_30d + 1,
      logins_90d = logins_90d + 1,
      last_login_at = NOW(),
      total_sessions = total_sessions + 1,
      days_since_last_login = 0,
      days_since_registration = EXTRACT(DAY FROM NOW() - first_login_at),
      updated_at = NOW()
    WHERE user_id = p_user_id;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Function to update quest completion analytics
CREATE OR REPLACE FUNCTION update_quest_analytics(
  p_user_id UUID,
  p_duration_minutes DECIMAL,
  p_completed BOOLEAN DEFAULT true
)
RETURNS VOID AS $$
BEGIN
  UPDATE user_analytics SET
    total_quests_started = total_quests_started + 1,
    total_quests_completed = CASE 
      WHEN p_completed THEN total_quests_completed + 1 
      ELSE total_quests_completed 
    END,
    average_quest_duration_minutes = CASE
      WHEN total_quests_completed > 0 THEN
        ((average_quest_duration_minutes * total_quests_completed) + p_duration_minutes) / 
        (total_quests_completed + CASE WHEN p_completed THEN 1 ELSE 0 END)
      ELSE p_duration_minutes
    END,
    last_quest_at = NOW(),
    quest_completion_rate = CASE
      WHEN total_quests_started > 0 THEN
        (total_quests_completed + CASE WHEN p_completed THEN 1 ELSE 0 END)::DECIMAL / 
        (total_quests_started + 1)
      ELSE 0
    END,
    user_engagement_score = LEAST(10.0, (
      (quest_completion_rate * 5.0) + 
      (LEAST(total_logins, 30) * 0.1) +
      (CASE WHEN last_login_at > NOW() - INTERVAL '7 days' THEN 2.0 ELSE 0.0 END)
    )),
    updated_at = NOW()
  WHERE user_id = p_user_id;
END;
$$ LANGUAGE plpgsql;

-- Function to clean old analytics data and update rolling windows
CREATE OR REPLACE FUNCTION maintain_analytics()
RETURNS VOID AS $$
BEGIN
  -- Update days since last login for all users
  UPDATE user_analytics SET
    days_since_last_login = COALESCE(
      EXTRACT(DAY FROM NOW() - last_login_at)::INTEGER,
      999
    ),
    days_since_registration = COALESCE(
      EXTRACT(DAY FROM NOW() - first_login_at)::INTEGER,
      0
    ),
    updated_at = NOW()
  WHERE last_login_at IS NOT NULL;
END;
$$ LANGUAGE plpgsql;

COMMIT;