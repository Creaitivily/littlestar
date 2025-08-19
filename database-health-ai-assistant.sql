-- AI Health Assistant Database Extensions for Little Star
-- Enhanced LLM-powered health guidance with cost optimization
-- Run these commands in your Supabase SQL Editor after health-extensions setup

-- 1. Create AI conversations table
CREATE TABLE IF NOT EXISTS public.ai_conversations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    daughter_id UUID REFERENCES public.daughters(id) ON DELETE CASCADE NOT NULL,
    conversation_title TEXT,
    conversation_type TEXT DEFAULT 'general', -- 'general', 'growth', 'vaccination', 'milestone', 'emergency'
    cost_cents INTEGER DEFAULT 0, -- Track API costs in cents
    local_responses INTEGER DEFAULT 0, -- Track local vs API responses
    api_responses INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create AI messages table
CREATE TABLE IF NOT EXISTS public.ai_messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    conversation_id UUID REFERENCES public.ai_conversations(id) ON DELETE CASCADE NOT NULL,
    role TEXT NOT NULL, -- 'user', 'assistant', 'system'
    content TEXT NOT NULL,
    response_type TEXT DEFAULT 'hybrid', -- 'local', 'llm', 'hybrid'
    model_used TEXT, -- 'llama-3.1-8b', 'claude-3-haiku', 'gpt-4o-mini'
    confidence_score DECIMAL(3,2), -- 0.00 to 1.00
    tokens_used INTEGER DEFAULT 0,
    cost_cents INTEGER DEFAULT 0,
    processing_time_ms INTEGER,
    safety_flags JSONB DEFAULT '{}', -- Store safety check results
    emergency_detected BOOLEAN DEFAULT FALSE,
    child_context_used JSONB, -- Store what child data was used
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Create local knowledge base table
CREATE TABLE IF NOT EXISTS public.health_knowledge_base (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    category TEXT NOT NULL, -- 'growth', 'vaccination', 'milestone', 'nutrition', 'safety'
    subcategory TEXT, -- 'height_percentile', 'weight_concern', 'mmr_vaccine', etc.
    age_range_min INTEGER, -- Minimum age in months (0 for all ages)
    age_range_max INTEGER, -- Maximum age in months (999 for no limit)
    question_patterns JSONB NOT NULL, -- Array of question patterns/keywords
    response_template TEXT NOT NULL,
    source TEXT NOT NULL, -- 'CDC', 'WHO', 'AAP'
    confidence_level DECIMAL(3,2) DEFAULT 0.95,
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Create emergency patterns table
CREATE TABLE IF NOT EXISTS public.emergency_patterns (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    pattern TEXT NOT NULL, -- Emergency keyword/phrase
    severity TEXT NOT NULL, -- 'high', 'medium', 'low'
    response_template TEXT NOT NULL,
    requires_911 BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Create cost tracking table
CREATE TABLE IF NOT EXISTS public.ai_usage_tracking (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    total_queries INTEGER DEFAULT 0,
    local_queries INTEGER DEFAULT 0,
    api_queries INTEGER DEFAULT 0,
    total_cost_cents INTEGER DEFAULT 0,
    tokens_used INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, date)
);

-- 6. Create cached responses table for cost optimization
CREATE TABLE IF NOT EXISTS public.ai_response_cache (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    query_hash TEXT NOT NULL, -- Hash of normalized query
    child_age_months INTEGER,
    growth_standard TEXT, -- 'CDC', 'WHO'
    response TEXT NOT NULL,
    model_used TEXT,
    confidence_score DECIMAL(3,2),
    usage_count INTEGER DEFAULT 1,
    last_used TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(query_hash, child_age_months, growth_standard)
);

-- 7. Enable Row Level Security on all AI tables
ALTER TABLE public.ai_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_usage_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_response_cache ENABLE ROW LEVEL SECURITY;

-- Knowledge base and emergency patterns are read-only for all users
ALTER TABLE public.health_knowledge_base ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.emergency_patterns ENABLE ROW LEVEL SECURITY;

-- 8. Create RLS Policies

-- AI conversations - users can only access their own
CREATE POLICY "Users can manage own AI conversations" ON public.ai_conversations
    FOR ALL USING (auth.uid() = user_id);

-- AI messages - users can only access messages from their conversations
CREATE POLICY "Users can manage own AI messages" ON public.ai_messages
    FOR ALL USING (
        conversation_id IN (
            SELECT id FROM public.ai_conversations WHERE user_id = auth.uid()
        )
    );

-- Usage tracking - users can only see their own usage
CREATE POLICY "Users can view own usage tracking" ON public.ai_usage_tracking
    FOR ALL USING (auth.uid() = user_id);

-- Response cache - all authenticated users can read cached responses
CREATE POLICY "Authenticated users can read response cache" ON public.ai_response_cache
    FOR SELECT USING (auth.role() = 'authenticated');

-- Knowledge base - all authenticated users can read
CREATE POLICY "Authenticated users can read knowledge base" ON public.health_knowledge_base
    FOR SELECT USING (auth.role() = 'authenticated');

-- Emergency patterns - all authenticated users can read
CREATE POLICY "Authenticated users can read emergency patterns" ON public.emergency_patterns
    FOR SELECT USING (auth.role() = 'authenticated');

-- 9. Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_ai_conversations_user_daughter ON public.ai_conversations(user_id, daughter_id);
CREATE INDEX IF NOT EXISTS idx_ai_messages_conversation ON public.ai_messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_ai_messages_emergency ON public.ai_messages(emergency_detected) WHERE emergency_detected = true;
CREATE INDEX IF NOT EXISTS idx_knowledge_base_category ON public.health_knowledge_base(category, subcategory);
CREATE INDEX IF NOT EXISTS idx_knowledge_base_age ON public.health_knowledge_base(age_range_min, age_range_max);
CREATE INDEX IF NOT EXISTS idx_emergency_patterns_severity ON public.emergency_patterns(severity);
CREATE INDEX IF NOT EXISTS idx_usage_tracking_date ON public.ai_usage_tracking(user_id, date);
CREATE INDEX IF NOT EXISTS idx_response_cache_query ON public.ai_response_cache(query_hash);
CREATE INDEX IF NOT EXISTS idx_response_cache_age ON public.ai_response_cache(child_age_months);

-- 10. Create triggers for updated_at columns
CREATE TRIGGER update_ai_conversations_updated_at BEFORE UPDATE ON public.ai_conversations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 11. Create utility functions

-- Function to calculate daily cost for user
CREATE OR REPLACE FUNCTION get_user_daily_cost(user_uuid UUID, target_date DATE DEFAULT CURRENT_DATE)
RETURNS INTEGER AS $$
BEGIN
    RETURN COALESCE(
        (SELECT total_cost_cents FROM public.ai_usage_tracking 
         WHERE user_id = user_uuid AND date = target_date), 
        0
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user is within daily cost limit
CREATE OR REPLACE FUNCTION check_daily_cost_limit(user_uuid UUID, cost_limit_cents INTEGER DEFAULT 100)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN get_user_daily_cost(user_uuid) < cost_limit_cents;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to increment usage tracking
CREATE OR REPLACE FUNCTION increment_usage_tracking(
    user_uuid UUID, 
    is_api_query BOOLEAN, 
    cost_cents INTEGER DEFAULT 0, 
    tokens INTEGER DEFAULT 0
)
RETURNS VOID AS $$
BEGIN
    INSERT INTO public.ai_usage_tracking (user_id, date, total_queries, local_queries, api_queries, total_cost_cents, tokens_used)
    VALUES (
        user_uuid, 
        CURRENT_DATE, 
        1, 
        CASE WHEN is_api_query THEN 0 ELSE 1 END,
        CASE WHEN is_api_query THEN 1 ELSE 0 END,
        cost_cents, 
        tokens
    )
    ON CONFLICT (user_id, date) DO UPDATE SET
        total_queries = ai_usage_tracking.total_queries + 1,
        local_queries = ai_usage_tracking.local_queries + CASE WHEN is_api_query THEN 0 ELSE 1 END,
        api_queries = ai_usage_tracking.api_queries + CASE WHEN is_api_query THEN 1 ELSE 0 END,
        total_cost_cents = ai_usage_tracking.total_cost_cents + cost_cents,
        tokens_used = ai_usage_tracking.tokens_used + tokens;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 12. Insert initial knowledge base data

-- Growth-related knowledge base
INSERT INTO public.health_knowledge_base (category, subcategory, age_range_min, age_range_max, question_patterns, response_template, source) VALUES
('growth', 'height_percentile', 0, 999, '["height normal", "height percentile", "tall enough", "short for age", "growth chart"]', 
'Based on the CDC growth charts, your child''s height is in the {percentile}th percentile for {age} old children. Percentiles between the 3rd and 97th are considered normal. The {percentile}th percentile means your child is taller than {percentile}% of children their age.', 'CDC'),

('growth', 'weight_percentile', 0, 999, '["weight normal", "weight percentile", "too heavy", "too light", "weight concern"]', 
'Your child''s weight is in the {percentile}th percentile according to CDC standards. This means they weigh more than {percentile}% of children their age. Percentiles between 3rd-97th are typically considered healthy ranges.', 'CDC'),

('growth', 'bmi_concern', 24, 999, '["bmi", "body mass index", "overweight", "underweight", "obesity"]', 
'Your child''s BMI is {bmi}, placing them in the {percentile}th percentile. For children over 2 years old, BMI percentiles help assess whether weight is appropriate for height and age. Consult your pediatrician if you have concerns.', 'CDC');

-- Vaccination knowledge base
INSERT INTO public.health_knowledge_base (category, subcategory, age_range_min, age_range_max, question_patterns, response_template, source) VALUES
('vaccination', 'schedule', 0, 999, '["vaccine schedule", "when vaccinate", "immunization due", "vaccine timing"]', 
'Based on the CDC immunization schedule, here are the vaccines typically due for a {age} old child: {upcoming_vaccines}. Always consult your pediatrician for personalized vaccination scheduling.', 'CDC'),

('vaccination', 'delayed', 0, 999, '["missed vaccine", "late vaccination", "behind schedule", "catch up vaccines"]', 
'If your child has missed vaccines, they can usually catch up safely. The CDC provides catch-up schedules for children who are behind. Contact your pediatrician to create a catch-up plan tailored to your child''s needs.', 'CDC'),

('vaccination', 'side_effects', 0, 999, '["vaccine reaction", "side effects", "fever after vaccine", "vaccine safety"]', 
'Most vaccine side effects are mild and normal, such as slight fever, fussiness, or soreness at the injection site. Serious reactions are rare. Contact your pediatrician if you notice severe reactions or have concerns.', 'CDC');

-- Milestone knowledge base
INSERT INTO public.health_knowledge_base (category, subcategory, age_range_min, age_range_max, question_patterns, response_template, source) VALUES
('milestone', 'motor_development', 0, 999, '["crawling", "walking", "motor skills", "physical development", "movement"]', 
'Motor development varies widely among children. By {age}, most children can {expected_skills}. If your child hasn''t reached these milestones, discuss with your pediatrician, as early intervention can be helpful.', 'CDC'),

('milestone', 'language_development', 0, 999, '["talking", "words", "speech", "language delay", "communication"]', 
'Language development milestones for a {age} old typically include {expected_language}. Every child develops at their own pace, but if you have concerns about speech development, consult your pediatrician.', 'CDC'),

('milestone', 'social_development', 0, 999, '["social skills", "playing", "interaction", "behavior", "emotions"]', 
'Social and emotional development for {age} old children typically includes {expected_social}. These skills develop gradually and can vary significantly between children.', 'CDC');

-- Safety and emergency patterns
INSERT INTO public.emergency_patterns (pattern, severity, response_template, requires_911) VALUES
('difficulty breathing', 'high', '🚨 EMERGENCY: If your child is having difficulty breathing, call 911 immediately. Do not wait or try home remedies. Breathing difficulties require immediate medical attention.', true),
('unconscious', 'high', '🚨 EMERGENCY: If your child is unconscious, call 911 immediately. Check if they are breathing and follow emergency operator instructions.', true),
('high fever 104', 'high', '🚨 URGENT: A fever of 104°F (40°C) or higher requires immediate medical attention. Call your pediatrician immediately or go to the emergency room.', false),
('severe allergic reaction', 'high', '🚨 EMERGENCY: Signs of severe allergic reaction (difficulty breathing, swelling, widespread rash) require immediate medical attention. Call 911.', true),
('head injury', 'high', '🚨 URGENT: Head injuries in children should be evaluated immediately. Call 911 if the child is unconscious, vomiting, or acting confused.', false),
('poisoning', 'high', '🚨 EMERGENCY: If you suspect poisoning, call Poison Control (1-800-222-1222) immediately and/or 911. Do not induce vomiting unless instructed.', true),
('fever infant under 3 months', 'high', '🚨 URGENT: Fever in infants under 3 months old requires immediate medical evaluation. Contact your pediatrician or go to emergency room.', false),
('persistent vomiting', 'medium', '⚠️ CONCERNING: Persistent vomiting, especially with signs of dehydration, needs medical evaluation. Contact your pediatrician.', false),
('severe diarrhea', 'medium', '⚠️ CONCERNING: Severe diarrhea can lead to dehydration quickly in children. Monitor for signs of dehydration and contact your pediatrician.', false),
('unusual behavior', 'medium', '⚠️ CONCERNING: Sudden changes in behavior, extreme lethargy, or unusual irritability should be evaluated by your pediatrician.', false);

-- 13. Create response cache cleanup function (run monthly)
CREATE OR REPLACE FUNCTION cleanup_ai_response_cache()
RETURNS VOID AS $$
BEGIN
    -- Delete cache entries older than 30 days with low usage
    DELETE FROM public.ai_response_cache 
    WHERE created_at < NOW() - INTERVAL '30 days' 
    AND usage_count < 5;
    
    -- Delete cache entries older than 90 days regardless of usage
    DELETE FROM public.ai_response_cache 
    WHERE created_at < NOW() - INTERVAL '90 days';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;