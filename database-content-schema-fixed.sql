-- Content Management Schema for MilestoneBee - FIXED VERSION
-- Run this in Supabase SQL Editor

-- Add is_admin column to users table if it doesn't exist
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT FALSE;

-- Table for storing scraped articles organized by topic and age range
CREATE TABLE IF NOT EXISTS topic_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  topic TEXT NOT NULL,
  age_range TEXT NOT NULL,
  title TEXT NOT NULL,
  url TEXT UNIQUE NOT NULL,
  content_summary TEXT,
  source_domain TEXT,
  publication_date DATE,
  scraped_at TIMESTAMPTZ DEFAULT NOW(),
  last_refreshed TIMESTAMPTZ DEFAULT NOW(),
  refresh_cycle INTEGER DEFAULT 1,
  is_active BOOLEAN DEFAULT TRUE,
  quality_score REAL DEFAULT 0.5 CHECK (quality_score >= 0 AND quality_score <= 1),
  
  CONSTRAINT valid_topic CHECK (topic IN (
    'feeding_nutrition',
    'sleep_patterns', 
    'cognitive_development',
    'physical_development',
    'social_emotional',
    'health_safety',
    'activities_play',
    'behavior_discipline',
    'language_communication'
  )),
  
  CONSTRAINT valid_age_range CHECK (age_range ~ '^[0-9]+-[0-9]+_months$')
);

-- Table for tracking content refresh operations
CREATE TABLE IF NOT EXISTS content_refresh_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  topic TEXT NOT NULL,
  age_range TEXT NOT NULL,
  refresh_date TIMESTAMPTZ DEFAULT NOW(),
  articles_added INTEGER DEFAULT 0,
  articles_removed INTEGER DEFAULT 0,
  status TEXT DEFAULT 'success' CHECK (status IN ('success', 'partial', 'failed')),
  error_message TEXT,
  refresh_cycle INTEGER NOT NULL
);

-- Table for tracking user content preferences (future enhancement)
CREATE TABLE IF NOT EXISTS user_content_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  preferred_topics TEXT[] DEFAULT '{}',
  content_difficulty TEXT DEFAULT 'moderate' CHECK (content_difficulty IN ('beginner', 'moderate', 'advanced')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for efficient querying
CREATE INDEX IF NOT EXISTS idx_topic_age_active ON topic_content (topic, age_range, is_active);
CREATE INDEX IF NOT EXISTS idx_last_refreshed ON topic_content (last_refreshed DESC);
CREATE INDEX IF NOT EXISTS idx_refresh_cycle ON topic_content (refresh_cycle, topic, age_range);
CREATE INDEX IF NOT EXISTS idx_quality_score ON topic_content (quality_score DESC) WHERE is_active = TRUE;
CREATE INDEX IF NOT EXISTS idx_publication_date ON topic_content (publication_date DESC) WHERE is_active = TRUE;
CREATE INDEX IF NOT EXISTS idx_refresh_log_date ON content_refresh_log (refresh_date DESC);

-- RLS Policies for content tables
ALTER TABLE topic_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_refresh_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_content_preferences ENABLE ROW LEVEL SECURITY;

-- Public read access for topic_content (all users can see articles)
CREATE POLICY "Public read access for content" ON topic_content
  FOR SELECT USING (is_active = TRUE);

-- Admin-only access for content_refresh_log (now with is_admin column)
CREATE POLICY "Admin only access for refresh log" ON content_refresh_log
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.is_admin = TRUE
    )
  );

-- User-specific access for preferences
CREATE POLICY "Users can manage own preferences" ON user_content_preferences
  FOR ALL USING (user_id = auth.uid());

-- Function to get current refresh cycle
CREATE OR REPLACE FUNCTION get_current_refresh_cycle()
RETURNS INTEGER AS $$
BEGIN
  RETURN COALESCE(
    (SELECT MAX(refresh_cycle) FROM topic_content), 
    0
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get next refresh cycle
CREATE OR REPLACE FUNCTION get_next_refresh_cycle()
RETURNS INTEGER AS $$
BEGIN
  RETURN get_current_refresh_cycle() + 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to clean old content (keep last 2 cycles)
CREATE OR REPLACE FUNCTION cleanup_old_content()
RETURNS INTEGER AS $$
DECLARE
  current_cycle INTEGER;
  cutoff_cycle INTEGER;
  deleted_count INTEGER;
BEGIN
  current_cycle := get_current_refresh_cycle();
  cutoff_cycle := current_cycle - 2;
  
  DELETE FROM topic_content 
  WHERE refresh_cycle < cutoff_cycle;
  
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  
  -- Log the cleanup
  INSERT INTO content_refresh_log (
    topic, age_range, articles_removed, status, refresh_cycle
  ) VALUES (
    'system_cleanup', 'all', deleted_count, 'success', current_cycle
  );
  
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- View for getting fresh content by topic and age
CREATE OR REPLACE VIEW fresh_topic_content AS
SELECT 
  tc.*,
  EXTRACT(days FROM NOW() - tc.last_refreshed) as days_since_refresh
FROM topic_content tc
WHERE tc.is_active = TRUE
  AND tc.refresh_cycle >= (get_current_refresh_cycle() - 1)
ORDER BY tc.quality_score DESC, tc.publication_date DESC;

-- Make yourself an admin (optional - replace with your email)
-- UPDATE users SET is_admin = TRUE WHERE email = 'your-email@example.com';

-- Comments for documentation
COMMENT ON TABLE topic_content IS 'Stores scraped parenting articles organized by topic and child age range';
COMMENT ON TABLE content_refresh_log IS 'Tracks content refresh operations and their results';
COMMENT ON TABLE user_content_preferences IS 'Stores user preferences for content personalization';
COMMENT ON FUNCTION get_current_refresh_cycle() IS 'Returns the current refresh cycle number';
COMMENT ON FUNCTION cleanup_old_content() IS 'Removes content older than 2 refresh cycles';
COMMENT ON VIEW fresh_topic_content IS 'Shows active content from the last 2 refresh cycles with quality ordering';