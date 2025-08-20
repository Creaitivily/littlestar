-- Database schema for MilestoneBee Insights System
-- Run this in Supabase SQL Editor

-- User interests/preferences table
CREATE TABLE IF NOT EXISTS public.user_interests (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    interest_category VARCHAR(100) NOT NULL,
    subcategories TEXT[] DEFAULT '{}',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id, interest_category)
);

-- Content library table
CREATE TABLE IF NOT EXISTS public.content_library (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    content_type VARCHAR(50) NOT NULL, -- 'video', 'article', 'webpage', 'pdf'
    source_url TEXT NOT NULL,
    thumbnail_url TEXT,
    categories TEXT[] NOT NULL DEFAULT '{}',
    tags TEXT[] DEFAULT '{}',
    source_name VARCHAR(100),
    author VARCHAR(255),
    published_date DATE,
    reading_time_minutes INTEGER,
    quality_score INTEGER DEFAULT 0, -- 0-100 quality rating
    is_verified BOOLEAN DEFAULT false,
    age_group VARCHAR(50), -- 'newborn', '0-6months', '6-12months', '1-2years', etc.
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- User saved content table
CREATE TABLE IF NOT EXISTS public.user_saved_content (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    content_id UUID NOT NULL REFERENCES public.content_library(id) ON DELETE CASCADE,
    is_favorite BOOLEAN DEFAULT false,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id, content_id)
);

-- MilestoneBot conversation history
CREATE TABLE IF NOT EXISTS public.milestonebot_conversations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    daughter_id UUID REFERENCES public.daughters(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    response TEXT NOT NULL,
    conversation_context JSONB,
    session_id UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Content interactions tracking
CREATE TABLE IF NOT EXISTS public.content_interactions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    content_id UUID NOT NULL REFERENCES public.content_library(id) ON DELETE CASCADE,
    interaction_type VARCHAR(50) NOT NULL, -- 'view', 'like', 'share', 'save', 'rate'
    interaction_value INTEGER, -- for ratings, time spent, etc.
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.user_interests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_saved_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.milestonebot_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_interactions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_interests
CREATE POLICY "Users can view their own interests" ON public.user_interests
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own interests" ON public.user_interests
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own interests" ON public.user_interests
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own interests" ON public.user_interests
    FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for user_saved_content
CREATE POLICY "Users can view their own saved content" ON public.user_saved_content
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own saved content" ON public.user_saved_content
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own saved content" ON public.user_saved_content
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own saved content" ON public.user_saved_content
    FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for milestonebot_conversations
CREATE POLICY "Users can view their own conversations" ON public.milestonebot_conversations
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own conversations" ON public.milestonebot_conversations
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for content_interactions
CREATE POLICY "Users can view their own interactions" ON public.content_interactions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own interactions" ON public.content_interactions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Public read access to content_library (no RLS needed for public content)
-- Content library will be publicly readable but only admin writable

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_interests_user_id ON public.user_interests(user_id);
CREATE INDEX IF NOT EXISTS idx_user_interests_category ON public.user_interests(interest_category);
CREATE INDEX IF NOT EXISTS idx_content_library_categories ON public.content_library USING GIN(categories);
CREATE INDEX IF NOT EXISTS idx_content_library_tags ON public.content_library USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_user_saved_content_user_id ON public.user_saved_content(user_id);
CREATE INDEX IF NOT EXISTS idx_milestonebot_conversations_user_id ON public.milestonebot_conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_content_interactions_user_content ON public.content_interactions(user_id, content_id);

-- Insert predefined interest categories
INSERT INTO public.content_library (title, description, content_type, source_url, categories, tags, source_name, quality_score, is_verified, age_group) VALUES
-- Newborn care content
('Understanding Newborn Sleep Patterns', 'Expert guidance on establishing healthy sleep routines for newborns', 'article', 'https://www.healthychildren.org/English/ages-stages/baby/sleep/Pages/A-Parents-Guide-to-Safe-Sleep.aspx', ARRAY['sleep', 'newborn'], ARRAY['sleep training', 'safe sleep', 'SIDS prevention'], 'American Academy of Pediatrics', 95, true, 'newborn'),

('Breastfeeding Basics: Getting Started', 'Comprehensive guide to successful breastfeeding for new mothers', 'article', 'https://www.cdc.gov/breastfeeding/breastfeeding-special-circumstances/index.html', ARRAY['feeding', 'newborn'], ARRAY['breastfeeding', 'latch', 'milk supply'], 'CDC', 98, true, 'newborn'),

('Newborn Development Milestones', 'What to expect in your baby''s first months of development', 'video', 'https://www.zerotothree.org/resource/your-babys-development-birth-to-3-months/', ARRAY['development', 'milestones'], ARRAY['motor skills', 'cognitive development', 'social development'], 'Zero to Three', 92, true, '0-3months'),

-- Growth and nutrition
('Baby-Led Weaning Introduction', 'Safe and effective introduction to solid foods', 'article', 'https://www.nhs.uk/conditions/baby/weaning-and-feeding/babys-first-solid-foods/', ARRAY['feeding', 'development'], ARRAY['baby led weaning', 'solid foods', 'nutrition'], 'NHS', 90, true, '6-12months'),

('Tracking Growth: When to Worry', 'Understanding growth charts and when to consult your pediatrician', 'article', 'https://www.cdc.gov/growthcharts/clinical_charts.htm', ARRAY['growth', 'health'], ARRAY['growth charts', 'percentiles', 'development'], 'CDC', 96, true, 'all-ages'),

-- Safety content
('Childproofing Your Home', 'Essential safety measures for different developmental stages', 'video', 'https://safekids.org/tip/home-safety-checklist', ARRAY['safety', 'home'], ARRAY['childproofing', 'accident prevention', 'home safety'], 'Safe Kids Worldwide', 88, true, '6months-2years'),

('Car Seat Safety Guidelines', 'Proper installation and usage of car seats by age', 'article', 'https://www.nhtsa.gov/equipment/car-seats-and-booster-seats', ARRAY['safety', 'transportation'], ARRAY['car seat', 'vehicle safety', 'travel'], 'NHTSA', 97, true, 'all-ages'),

-- Mental health and bonding
('Postpartum Mental Health', 'Recognizing and addressing postpartum depression and anxiety', 'article', 'https://www.postpartum.net/learn-more/', ARRAY['mental health', 'postpartum'], ARRAY['postpartum depression', 'anxiety', 'maternal health'], 'Postpartum International', 94, true, 'parents'),

('Building Secure Attachment', 'Understanding and fostering secure attachment with your baby', 'video', 'https://www.zerotothree.org/resource/secure-attachment/', ARRAY['bonding', 'development'], ARRAY['attachment', 'bonding', 'emotional development'], 'Zero to Three', 91, true, '0-2years')

ON CONFLICT DO NOTHING;

-- Functions for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- AI usage tracking table
CREATE TABLE IF NOT EXISTS public.ai_usage_tracking (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    total_queries INTEGER DEFAULT 0,
    local_queries INTEGER DEFAULT 0,
    api_queries INTEGER DEFAULT 0,
    total_cost_cents INTEGER DEFAULT 0,
    total_tokens INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id, date)
);

-- Health knowledge base for local responses
CREATE TABLE IF NOT EXISTS public.health_knowledge_base (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    category VARCHAR(100) NOT NULL,
    question_patterns TEXT[] NOT NULL,
    response_template TEXT NOT NULL,
    age_range_min INTEGER DEFAULT 0, -- in months
    age_range_max INTEGER DEFAULT 240, -- 20 years in months
    confidence_level DECIMAL(3,2) DEFAULT 0.85,
    source VARCHAR(255),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security for new tables
ALTER TABLE public.ai_usage_tracking ENABLE ROW LEVEL SECURITY;
-- Health knowledge base is public read, admin write (no RLS)

-- RLS Policies for ai_usage_tracking
CREATE POLICY "Users can view their own usage tracking" ON public.ai_usage_tracking
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own usage tracking" ON public.ai_usage_tracking
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own usage tracking" ON public.ai_usage_tracking
    FOR UPDATE USING (auth.uid() = user_id);

-- Additional indexes
CREATE INDEX IF NOT EXISTS idx_ai_usage_tracking_user_date ON public.ai_usage_tracking(user_id, date);
CREATE INDEX IF NOT EXISTS idx_health_knowledge_base_category ON public.health_knowledge_base(category);
CREATE INDEX IF NOT EXISTS idx_health_knowledge_base_age_range ON public.health_knowledge_base(age_range_min, age_range_max);

-- Insert basic health knowledge base entries
INSERT INTO public.health_knowledge_base (category, question_patterns, response_template, age_range_min, age_range_max, confidence_level, source) VALUES
('sleep', ARRAY['sleep', 'bedtime', 'nap', 'wake up'], 'At {age}, {name} typically needs about {sleep_hours} hours of sleep per day. Here are some gentle strategies that work well for children this age...', 0, 24, 0.80, 'AAP Sleep Guidelines'),
('feeding', ARRAY['eat', 'food', 'milk', 'bottle', 'breastfeed'], 'For {name} at {age}, here''s what''s typical for feeding patterns and nutrition...', 0, 36, 0.85, 'AAP Nutrition Guidelines'),
('development', ARRAY['milestone', 'develop', 'crawl', 'walk', 'talk'], 'At {age}, {name} is likely working on these developmental milestones. Every child develops at their own pace...', 0, 60, 0.75, 'CDC Developmental Milestones'),
('growth', ARRAY['height', 'weight', 'size', 'percentile'], 'Based on {name}''s age of {age}, here''s what to know about growth patterns and when to check with your pediatrician...', 0, 240, 0.80, 'WHO Growth Charts')
ON CONFLICT DO NOTHING;

-- Database functions for usage tracking
CREATE OR REPLACE FUNCTION check_daily_cost_limit(user_uuid UUID, cost_limit_cents INTEGER)
RETURNS BOOLEAN AS $$
DECLARE
    daily_cost INTEGER;
BEGIN
    SELECT COALESCE(total_cost_cents, 0) INTO daily_cost 
    FROM ai_usage_tracking 
    WHERE user_id = user_uuid AND date = CURRENT_DATE;
    
    RETURN COALESCE(daily_cost, 0) < cost_limit_cents;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION increment_usage_tracking(
    user_uuid UUID, 
    is_api_query BOOLEAN,
    cost_cents INTEGER DEFAULT 0,
    tokens INTEGER DEFAULT 0
)
RETURNS VOID AS $$
BEGIN
    INSERT INTO ai_usage_tracking (user_id, date, total_queries, local_queries, api_queries, total_cost_cents, total_tokens)
    VALUES (user_uuid, CURRENT_DATE, 1, CASE WHEN is_api_query THEN 0 ELSE 1 END, CASE WHEN is_api_query THEN 1 ELSE 0 END, cost_cents, tokens)
    ON CONFLICT (user_id, date) 
    DO UPDATE SET 
        total_queries = ai_usage_tracking.total_queries + 1,
        local_queries = ai_usage_tracking.local_queries + CASE WHEN is_api_query THEN 0 ELSE 1 END,
        api_queries = ai_usage_tracking.api_queries + CASE WHEN is_api_query THEN 1 ELSE 0 END,
        total_cost_cents = ai_usage_tracking.total_cost_cents + cost_cents,
        total_tokens = ai_usage_tracking.total_tokens + tokens,
        updated_at = timezone('utc'::text, now());
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Triggers for updated_at
CREATE TRIGGER update_user_interests_updated_at BEFORE UPDATE ON public.user_interests FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_content_library_updated_at BEFORE UPDATE ON public.content_library FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_saved_content_updated_at BEFORE UPDATE ON public.user_saved_content FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_ai_usage_tracking_updated_at BEFORE UPDATE ON public.ai_usage_tracking FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_health_knowledge_base_updated_at BEFORE UPDATE ON public.health_knowledge_base FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();