-- User Settings Table
-- Run this in your Supabase SQL Editor

-- Create user_settings table
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

-- Enable RLS
ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;

-- Create RLS Policy
CREATE POLICY "Users can manage own settings" ON public.user_settings
    FOR ALL USING (auth.uid() = user_id);

-- Create function to automatically create user settings
CREATE OR REPLACE FUNCTION public.handle_new_user_settings()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.user_settings (user_id)
    VALUES (NEW.id)
    ON CONFLICT (user_id) DO NOTHING;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically create settings for new users
DROP TRIGGER IF EXISTS on_auth_user_created_settings ON public.users;
CREATE TRIGGER on_auth_user_created_settings
    AFTER INSERT ON public.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_settings();

-- Add country-specific emergency numbers
INSERT INTO public.user_settings (user_id, country, emergency_contact_numbers)
SELECT id, 'US', '{
    "emergency": "911",
    "poison_control": "1-800-222-1222",
    "child_abuse": "1-800-4-A-CHILD",
    "suicide_prevention": "988"
}'::jsonb
FROM public.users
ON CONFLICT (user_id) DO UPDATE SET
    emergency_contact_numbers = EXCLUDED.emergency_contact_numbers;