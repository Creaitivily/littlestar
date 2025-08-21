-- =====================================================
-- COMPLETE MILESTONEBEE DATABASE SETUP
-- Run this entire script in your Supabase SQL Editor
-- =====================================================

-- =====================================================
-- SECTION 1: CORE TABLES
-- =====================================================

-- 1. Create users table (if not exists)
CREATE TABLE IF NOT EXISTS public.users (
    id UUID REFERENCES auth.users(id) PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create daughters table with birth_time
CREATE TABLE IF NOT EXISTS public.daughters (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    birth_date DATE NOT NULL,
    birth_time TIME,
    profile_image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add birth_time column if it doesn't exist
ALTER TABLE public.daughters ADD COLUMN IF NOT EXISTS birth_time TIME;

-- 3. Create activities table
CREATE TABLE IF NOT EXISTS public.activities (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    daughter_id UUID REFERENCES public.daughters(id) ON DELETE CASCADE NOT NULL,
    type TEXT NOT NULL,
    description TEXT,
    date DATE NOT NULL,
    time TIME,
    duration_minutes INTEGER,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Create growth_records table
CREATE TABLE IF NOT EXISTS public.growth_records (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    daughter_id UUID REFERENCES public.daughters(id) ON DELETE CASCADE NOT NULL,
    height DECIMAL(5,2),
    weight DECIMAL(5,2),
    head_circumference DECIMAL(5,2),
    measurement_date DATE NOT NULL,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Create health_records table with extended fields
CREATE TABLE IF NOT EXISTS public.health_records (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    daughter_id UUID REFERENCES public.daughters(id) ON DELETE CASCADE NOT NULL,
    type TEXT NOT NULL,
    description TEXT NOT NULL,
    date DATE NOT NULL,
    provider TEXT,
    location TEXT,
    notes TEXT,
    follow_up_date DATE,
    medications TEXT[],
    symptoms TEXT[],
    temperature DECIMAL(4,1),
    blood_pressure TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Create memories table
CREATE TABLE IF NOT EXISTS public.memories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    daughter_id UUID REFERENCES public.daughters(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    image_url TEXT,
    date DATE NOT NULL,
    milestone_category TEXT,
    tags TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- SECTION 2: USER SETTINGS TABLE (NEW)
-- =====================================================

CREATE TABLE IF NOT EXISTS public.user_settings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
    
    -- Notification settings
    milestone_reminders BOOLEAN DEFAULT true,
    weekly_summaries BOOLEAN DEFAULT true,
    app_updates BOOLEAN DEFAULT false,
    email_notifications BOOLEAN DEFAULT true,
    push_notifications BOOLEAN DEFAULT true,
    
    -- Privacy & Security settings
    two_factor_enabled BOOLEAN DEFAULT false,
    data_encryption_enabled BOOLEAN DEFAULT true,
    
    -- Appearance settings
    theme TEXT DEFAULT 'auto' CHECK (theme IN ('light', 'dark', 'auto')),
    color_scheme TEXT DEFAULT 'milestonebee',
    
    -- Language & Region settings
    language TEXT DEFAULT 'en',
    date_format TEXT DEFAULT 'MM/DD/YYYY',
    country TEXT DEFAULT 'US',
    emergency_contact_numbers JSONB DEFAULT '{}',
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- SECTION 3: HEALTH & INSIGHTS TABLES
-- =====================================================

-- Vaccinations table
CREATE TABLE IF NOT EXISTS public.vaccinations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    daughter_id UUID REFERENCES public.daughters(id) ON DELETE CASCADE NOT NULL,
    vaccine_name TEXT NOT NULL,
    dose_number INTEGER,
    date_given DATE NOT NULL,
    provider TEXT,
    location TEXT,
    next_dose_date DATE,
    side_effects TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Milestones table
CREATE TABLE IF NOT EXISTS public.milestones (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    daughter_id UUID REFERENCES public.daughters(id) ON DELETE CASCADE NOT NULL,
    category TEXT NOT NULL, -- motor, cognitive, social, language
    title TEXT NOT NULL,
    description TEXT,
    achieved_date DATE,
    expected_age_months INTEGER,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Health AI Insights table
CREATE TABLE IF NOT EXISTS public.health_ai_insights (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    daughter_id UUID REFERENCES public.daughters(id) ON DELETE CASCADE NOT NULL,
    insight_type TEXT NOT NULL, -- growth_analysis, health_alert, milestone_prediction
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    severity TEXT CHECK (severity IN ('info', 'warning', 'alert')),
    action_items JSONB,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- AI Conversations table for MilestoneBot
CREATE TABLE IF NOT EXISTS public.ai_conversations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    daughter_id UUID REFERENCES public.daughters(id),
    message TEXT NOT NULL,
    response TEXT NOT NULL,
    message_type TEXT, -- question, emergency, general
    context JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- SECTION 4: FILE ATTACHMENTS
-- =====================================================

CREATE TABLE IF NOT EXISTS public.file_attachments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    daughter_id UUID REFERENCES public.daughters(id) ON DELETE CASCADE,
    record_type TEXT NOT NULL, -- health_record, memory, activity
    record_id UUID,
    file_name TEXT NOT NULL,
    file_type TEXT NOT NULL,
    file_size INTEGER,
    file_url TEXT NOT NULL,
    thumbnail_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- SECTION 5: ENABLE ROW LEVEL SECURITY
-- =====================================================

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daughters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.growth_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.health_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.memories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vaccinations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.health_ai_insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.file_attachments ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- SECTION 6: CREATE RLS POLICIES
-- =====================================================

-- Users policies
DROP POLICY IF EXISTS "Users can view own profile" ON public.users;
CREATE POLICY "Users can view own profile" ON public.users
    FOR ALL USING (auth.uid() = id);

-- Daughters policies
DROP POLICY IF EXISTS "Users can manage own daughters" ON public.daughters;
CREATE POLICY "Users can manage own daughters" ON public.daughters
    FOR ALL USING (auth.uid() = user_id);

-- Activities policies
DROP POLICY IF EXISTS "Users can manage own activities" ON public.activities;
CREATE POLICY "Users can manage own activities" ON public.activities
    FOR ALL USING (auth.uid() = user_id);

-- Growth records policies
DROP POLICY IF EXISTS "Users can manage own growth records" ON public.growth_records;
CREATE POLICY "Users can manage own growth records" ON public.growth_records
    FOR ALL USING (auth.uid() = user_id);

-- Health records policies
DROP POLICY IF EXISTS "Users can manage own health records" ON public.health_records;
CREATE POLICY "Users can manage own health records" ON public.health_records
    FOR ALL USING (auth.uid() = user_id);

-- Memories policies
DROP POLICY IF EXISTS "Users can manage own memories" ON public.memories;
CREATE POLICY "Users can manage own memories" ON public.memories
    FOR ALL USING (auth.uid() = user_id);

-- User settings policies
DROP POLICY IF EXISTS "Users can manage own settings" ON public.user_settings;
CREATE POLICY "Users can manage own settings" ON public.user_settings
    FOR ALL USING (auth.uid() = user_id);

-- Vaccinations policies
DROP POLICY IF EXISTS "Users can manage own vaccinations" ON public.vaccinations;
CREATE POLICY "Users can manage own vaccinations" ON public.vaccinations
    FOR ALL USING (auth.uid() = user_id);

-- Milestones policies
DROP POLICY IF EXISTS "Users can manage own milestones" ON public.milestones;
CREATE POLICY "Users can manage own milestones" ON public.milestones
    FOR ALL USING (auth.uid() = user_id);

-- Health AI insights policies
DROP POLICY IF EXISTS "Users can manage own insights" ON public.health_ai_insights;
CREATE POLICY "Users can manage own insights" ON public.health_ai_insights
    FOR ALL USING (auth.uid() = user_id);

-- AI conversations policies
DROP POLICY IF EXISTS "Users can manage own conversations" ON public.ai_conversations;
CREATE POLICY "Users can manage own conversations" ON public.ai_conversations
    FOR ALL USING (auth.uid() = user_id);

-- File attachments policies
DROP POLICY IF EXISTS "Users can manage own attachments" ON public.file_attachments;
CREATE POLICY "Users can manage own attachments" ON public.file_attachments
    FOR ALL USING (auth.uid() = user_id);

-- =====================================================
-- SECTION 7: CREATE FUNCTIONS & TRIGGERS
-- =====================================================

-- Function to automatically create user profile
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.users (id, email, full_name, created_at, updated_at)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
        NOW(),
        NOW()
    )
    ON CONFLICT (id) DO UPDATE SET
        email = EXCLUDED.email,
        updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to automatically create user settings
CREATE OR REPLACE FUNCTION public.handle_new_user_settings()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.user_settings (user_id)
    VALUES (NEW.id)
    ON CONFLICT (user_id) DO NOTHING;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for user settings creation
DROP TRIGGER IF EXISTS on_auth_user_created_settings ON public.users;
CREATE TRIGGER on_auth_user_created_settings
    AFTER INSERT ON public.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_settings();

-- Function to update timestamps
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add update triggers for tables with updated_at
DROP TRIGGER IF EXISTS handle_updated_at ON public.users;
CREATE TRIGGER handle_updated_at
    BEFORE UPDATE ON public.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS handle_updated_at ON public.daughters;
CREATE TRIGGER handle_updated_at
    BEFORE UPDATE ON public.daughters
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS handle_updated_at ON public.user_settings;
CREATE TRIGGER handle_updated_at
    BEFORE UPDATE ON public.user_settings
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- =====================================================
-- SECTION 8: INSERT DEFAULT DATA
-- =====================================================

-- Insert default emergency numbers for existing users
INSERT INTO public.user_settings (user_id, country, emergency_contact_numbers)
SELECT 
    id, 
    'US',
    '{
        "emergency": "911",
        "poison_control": "1-800-222-1222",
        "child_abuse": "1-800-4-A-CHILD",
        "suicide_prevention": "988"
    }'::jsonb
FROM public.users
WHERE NOT EXISTS (
    SELECT 1 FROM public.user_settings WHERE user_settings.user_id = users.id
)
ON CONFLICT (user_id) DO UPDATE SET
    emergency_contact_numbers = CASE 
        WHEN public.user_settings.emergency_contact_numbers = '{}'::jsonb 
        THEN EXCLUDED.emergency_contact_numbers
        ELSE public.user_settings.emergency_contact_numbers
    END;

-- =====================================================
-- SECTION 9: CREATE INDEXES FOR PERFORMANCE
-- =====================================================

-- Create indexes for foreign keys and commonly queried fields
CREATE INDEX IF NOT EXISTS idx_daughters_user_id ON public.daughters(user_id);
CREATE INDEX IF NOT EXISTS idx_activities_user_id ON public.activities(user_id);
CREATE INDEX IF NOT EXISTS idx_activities_daughter_id ON public.activities(daughter_id);
CREATE INDEX IF NOT EXISTS idx_activities_date ON public.activities(date);
CREATE INDEX IF NOT EXISTS idx_growth_records_user_id ON public.growth_records(user_id);
CREATE INDEX IF NOT EXISTS idx_growth_records_daughter_id ON public.growth_records(daughter_id);
CREATE INDEX IF NOT EXISTS idx_health_records_user_id ON public.health_records(user_id);
CREATE INDEX IF NOT EXISTS idx_health_records_daughter_id ON public.health_records(daughter_id);
CREATE INDEX IF NOT EXISTS idx_memories_user_id ON public.memories(user_id);
CREATE INDEX IF NOT EXISTS idx_memories_daughter_id ON public.memories(daughter_id);
CREATE INDEX IF NOT EXISTS idx_vaccinations_user_id ON public.vaccinations(user_id);
CREATE INDEX IF NOT EXISTS idx_vaccinations_daughter_id ON public.vaccinations(daughter_id);
CREATE INDEX IF NOT EXISTS idx_milestones_user_id ON public.milestones(user_id);
CREATE INDEX IF NOT EXISTS idx_milestones_daughter_id ON public.milestones(daughter_id);
CREATE INDEX IF NOT EXISTS idx_health_ai_insights_user_id ON public.health_ai_insights(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_conversations_user_id ON public.ai_conversations(user_id);

-- =====================================================
-- SECTION 10: GRANT PERMISSIONS
-- =====================================================

-- Grant necessary permissions to authenticated users
GRANT ALL ON public.users TO authenticated;
GRANT ALL ON public.daughters TO authenticated;
GRANT ALL ON public.activities TO authenticated;
GRANT ALL ON public.growth_records TO authenticated;
GRANT ALL ON public.health_records TO authenticated;
GRANT ALL ON public.memories TO authenticated;
GRANT ALL ON public.user_settings TO authenticated;
GRANT ALL ON public.vaccinations TO authenticated;
GRANT ALL ON public.milestones TO authenticated;
GRANT ALL ON public.health_ai_insights TO authenticated;
GRANT ALL ON public.ai_conversations TO authenticated;
GRANT ALL ON public.file_attachments TO authenticated;

-- Grant usage on sequences
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- =====================================================
-- VERIFICATION QUERIES (Optional - Run separately to verify)
-- =====================================================

-- Check if all tables were created successfully
/*
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- Check RLS policies
SELECT schemaname, tablename, policyname, cmd, qual 
FROM pg_policies 
WHERE schemaname = 'public';

-- Check triggers
SELECT trigger_name, event_object_table, action_statement 
FROM information_schema.triggers 
WHERE trigger_schema = 'public';
*/

-- =====================================================
-- SUCCESS MESSAGE
-- =====================================================
-- If you see this comment, the script executed successfully!
-- Your MilestoneBee database is now fully configured.
-- =====================================================