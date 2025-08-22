-- Update content schema to include images and better organization
-- Run this in Supabase SQL Editor

-- First, add image_url column if it doesn't exist
ALTER TABLE topic_content 
ADD COLUMN IF NOT EXISTS image_url TEXT,
ADD COLUMN IF NOT EXISTS reading_time INTEGER DEFAULT 5,
ADD COLUMN IF NOT EXISTS author TEXT DEFAULT 'Expert',
ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}';

-- Clear existing test data
TRUNCATE TABLE topic_content;

-- Reset the content_refresh_log
TRUNCATE TABLE content_refresh_log;

-- Update the view to include new columns
DROP VIEW IF EXISTS fresh_topic_content;

CREATE OR REPLACE VIEW fresh_topic_content AS
SELECT 
  tc.*,
  EXTRACT(days FROM NOW() - tc.last_refreshed) as days_since_refresh
FROM topic_content tc
WHERE tc.is_active = TRUE
  AND tc.refresh_cycle >= (get_current_refresh_cycle() - 1)
ORDER BY tc.quality_score DESC, tc.publication_date DESC;