-- Complete Content System Redesign
-- Simplifies the system and adds image support

-- 1. Clear existing data
TRUNCATE TABLE topic_content CASCADE;
TRUNCATE TABLE content_refresh_log CASCADE;

-- 2. Update schema with new columns
ALTER TABLE topic_content 
ADD COLUMN IF NOT EXISTS image_url TEXT,
ADD COLUMN IF NOT EXISTS reading_time INTEGER DEFAULT 5,
ADD COLUMN IF NOT EXISTS author TEXT DEFAULT 'MilestoneBee Expert',
ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS age_min_months INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS age_max_months INTEGER DEFAULT 36,
ADD COLUMN IF NOT EXISTS view_count INTEGER DEFAULT 0;

-- 3. Drop the complex age_range constraint
ALTER TABLE topic_content 
DROP CONSTRAINT IF EXISTS valid_age_range;

-- 4. Make age_range optional
ALTER TABLE topic_content 
ALTER COLUMN age_range DROP NOT NULL,
ALTER COLUMN age_range SET DEFAULT 'all';

-- 5. Update the view for simpler content fetching
DROP VIEW IF EXISTS fresh_topic_content;

CREATE OR REPLACE VIEW fresh_topic_content AS
SELECT 
  tc.*,
  EXTRACT(days FROM NOW() - tc.last_refreshed) as days_since_refresh
FROM topic_content tc
WHERE tc.is_active = TRUE
ORDER BY tc.quality_score DESC, tc.publication_date DESC;

-- 6. Create a function to get top articles by topic
CREATE OR REPLACE FUNCTION get_top_articles_by_topic(
  p_topic TEXT,
  p_limit INTEGER DEFAULT 12
)
RETURNS TABLE (
  id UUID,
  title TEXT,
  url TEXT,
  content_summary TEXT,
  image_url TEXT,
  source_domain TEXT,
  quality_score REAL,
  reading_time INTEGER,
  tags TEXT[],
  publication_date DATE
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    tc.id,
    tc.title,
    tc.url,
    tc.content_summary,
    tc.image_url,
    tc.source_domain,
    tc.quality_score,
    tc.reading_time,
    tc.tags,
    tc.publication_date
  FROM topic_content tc
  WHERE tc.topic = p_topic
    AND tc.is_active = TRUE
  ORDER BY tc.quality_score DESC, tc.publication_date DESC
  LIMIT p_limit;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 7. Create indexes for performance
DROP INDEX IF EXISTS idx_topic_quality;
CREATE INDEX idx_topic_quality ON topic_content(topic, quality_score DESC) 
WHERE is_active = TRUE;

DROP INDEX IF EXISTS idx_topic_date;
CREATE INDEX idx_topic_date ON topic_content(topic, publication_date DESC) 
WHERE is_active = TRUE;

-- Grant necessary permissions
GRANT EXECUTE ON FUNCTION get_top_articles_by_topic TO anon, authenticated;
GRANT SELECT ON fresh_topic_content TO anon, authenticated;