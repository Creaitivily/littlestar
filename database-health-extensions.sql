-- Health Data Extensions for Little Star
-- Enhanced pediatric health tracking with official data sources
-- Run these commands in your Supabase SQL Editor after base setup

-- 1. Extend growth_records table with percentile data and head circumference
ALTER TABLE public.growth_records ADD COLUMN IF NOT EXISTS head_circumference DECIMAL(5,2);
ALTER TABLE public.growth_records ADD COLUMN IF NOT EXISTS height_percentile DECIMAL(5,2);
ALTER TABLE public.growth_records ADD COLUMN IF NOT EXISTS weight_percentile DECIMAL(5,2);
ALTER TABLE public.growth_records ADD COLUMN IF NOT EXISTS bmi DECIMAL(5,2);
ALTER TABLE public.growth_records ADD COLUMN IF NOT EXISTS bmi_percentile DECIMAL(5,2);
ALTER TABLE public.growth_records ADD COLUMN IF NOT EXISTS growth_standard TEXT DEFAULT 'CDC'; -- CDC or WHO
ALTER TABLE public.growth_records ADD COLUMN IF NOT EXISTS gestational_weeks INTEGER; -- For preterm adjustments
ALTER TABLE public.growth_records ADD COLUMN IF NOT EXISTS notes TEXT;

-- 2. Create vaccination_records table
CREATE TABLE IF NOT EXISTS public.vaccination_records (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    daughter_id UUID REFERENCES public.daughters(id) ON DELETE CASCADE NOT NULL,
    vaccine_name TEXT NOT NULL,
    vaccine_code TEXT, -- CVX code for standardization
    dose_number INTEGER,
    vaccination_date DATE NOT NULL,
    next_due_date DATE,
    provider_name TEXT,
    lot_number TEXT,
    administered_by TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Create developmental_milestones table
CREATE TABLE IF NOT EXISTS public.developmental_milestones (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    daughter_id UUID REFERENCES public.daughters(id) ON DELETE CASCADE NOT NULL,
    milestone_category TEXT NOT NULL, -- 'motor', 'language', 'cognitive', 'social'
    milestone_name TEXT NOT NULL,
    age_months_expected INTEGER NOT NULL,
    age_months_achieved INTEGER,
    achieved BOOLEAN DEFAULT FALSE,
    achieved_date DATE,
    notes TEXT,
    source TEXT DEFAULT 'CDC', -- CDC, WHO, AAP
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Create nutrition_tracking table
CREATE TABLE IF NOT EXISTS public.nutrition_tracking (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    daughter_id UUID REFERENCES public.daughters(id) ON DELETE CASCADE NOT NULL,
    food_item TEXT NOT NULL,
    food_group TEXT, -- fruits, vegetables, grains, protein, dairy
    serving_size TEXT,
    calories DECIMAL(6,2),
    nutrients JSONB, -- Store detailed nutrition data
    meal_type TEXT, -- breakfast, lunch, dinner, snack
    consumption_date DATE NOT NULL,
    consumption_time TIME,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Create health_alerts table
CREATE TABLE IF NOT EXISTS public.health_alerts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    daughter_id UUID REFERENCES public.daughters(id) ON DELETE CASCADE NOT NULL,
    alert_type TEXT NOT NULL, -- 'growth_concern', 'vaccination_due', 'milestone_delay'
    severity TEXT NOT NULL, -- 'low', 'medium', 'high'
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    action_required BOOLEAN DEFAULT FALSE,
    dismissed BOOLEAN DEFAULT FALSE,
    dismissed_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Create growth_predictions table for ML-based growth forecasting
CREATE TABLE IF NOT EXISTS public.growth_predictions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    daughter_id UUID REFERENCES public.daughters(id) ON DELETE CASCADE NOT NULL,
    prediction_date DATE NOT NULL,
    predicted_height DECIMAL(5,2),
    predicted_weight DECIMAL(5,2),
    confidence_score DECIMAL(3,2), -- 0.00 to 1.00
    model_version TEXT DEFAULT 'v1.0',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. Create health_standards_cache table for offline capabilities
CREATE TABLE IF NOT EXISTS public.health_standards_cache (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    standard_type TEXT NOT NULL, -- 'growth_percentile', 'vaccine_schedule', 'milestone'
    standard_source TEXT NOT NULL, -- 'CDC', 'WHO', 'AAP'
    age_months INTEGER,
    gender TEXT, -- 'M', 'F', 'all'
    data JSONB NOT NULL, -- Cached calculation data
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(standard_type, standard_source, age_months, gender)
);

-- 8. Enable Row Level Security on new tables
ALTER TABLE public.vaccination_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.developmental_milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.nutrition_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.health_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.growth_predictions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.health_standards_cache ENABLE ROW LEVEL SECURITY;

-- 9. Create RLS Policies for new tables

-- Vaccination records
CREATE POLICY "Users can manage own vaccination records" ON public.vaccination_records
    FOR ALL USING (auth.uid() = user_id);

-- Developmental milestones
CREATE POLICY "Users can manage own milestones" ON public.developmental_milestones
    FOR ALL USING (auth.uid() = user_id);

-- Nutrition tracking
CREATE POLICY "Users can manage own nutrition data" ON public.nutrition_tracking
    FOR ALL USING (auth.uid() = user_id);

-- Health alerts
CREATE POLICY "Users can manage own health alerts" ON public.health_alerts
    FOR ALL USING (auth.uid() = user_id);

-- Growth predictions
CREATE POLICY "Users can view own growth predictions" ON public.growth_predictions
    FOR ALL USING (auth.uid() = user_id);

-- Health standards cache (read-only for all users)
CREATE POLICY "All users can read health standards cache" ON public.health_standards_cache
    FOR SELECT USING (true);

-- Only system can insert/update cache (restrict to service role)
CREATE POLICY "Only service can manage cache" ON public.health_standards_cache
    FOR INSERT WITH CHECK (false);

-- 10. Create triggers for updated_at columns
CREATE TRIGGER update_vaccination_records_updated_at BEFORE UPDATE ON public.vaccination_records
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_developmental_milestones_updated_at BEFORE UPDATE ON public.developmental_milestones
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 11. Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_vaccination_records_daughter_id ON public.vaccination_records(daughter_id);
CREATE INDEX IF NOT EXISTS idx_vaccination_records_due_date ON public.vaccination_records(next_due_date);
CREATE INDEX IF NOT EXISTS idx_milestones_daughter_age ON public.developmental_milestones(daughter_id, age_months_expected);
CREATE INDEX IF NOT EXISTS idx_nutrition_date ON public.nutrition_tracking(daughter_id, consumption_date);
CREATE INDEX IF NOT EXISTS idx_health_alerts_active ON public.health_alerts(user_id, dismissed) WHERE NOT dismissed;
CREATE INDEX IF NOT EXISTS idx_growth_predictions_daughter ON public.growth_predictions(daughter_id, prediction_date);
CREATE INDEX IF NOT EXISTS idx_health_standards_lookup ON public.health_standards_cache(standard_type, standard_source, age_months, gender);

-- 12. Create functions for health calculations

-- Function to calculate age in months from birth date
CREATE OR REPLACE FUNCTION calculate_age_months(birth_date DATE, reference_date DATE DEFAULT CURRENT_DATE)
RETURNS INTEGER AS $$
BEGIN
    RETURN EXTRACT(YEAR FROM AGE(reference_date, birth_date)) * 12 + 
           EXTRACT(MONTH FROM AGE(reference_date, birth_date));
END;
$$ LANGUAGE plpgsql;

-- Function to get latest growth data
CREATE OR REPLACE FUNCTION get_latest_growth_data(child_id UUID)
RETURNS TABLE(
    height DECIMAL(5,2),
    weight DECIMAL(5,2),
    bmi DECIMAL(5,2),
    height_percentile DECIMAL(5,2),
    weight_percentile DECIMAL(5,2),
    bmi_percentile DECIMAL(5,2),
    measurement_date DATE
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        gr.height,
        gr.weight,
        gr.bmi,
        gr.height_percentile,
        gr.weight_percentile,
        gr.bmi_percentile,
        gr.measurement_date
    FROM public.growth_records gr
    WHERE gr.daughter_id = child_id
    ORDER BY gr.measurement_date DESC
    LIMIT 1;
END;
$$ LANGUAGE plpgsql;

-- Function to check overdue vaccinations
CREATE OR REPLACE FUNCTION get_overdue_vaccinations(child_id UUID)
RETURNS TABLE(
    vaccine_name TEXT,
    next_due_date DATE,
    days_overdue INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        vr.vaccine_name,
        vr.next_due_date,
        CURRENT_DATE - vr.next_due_date as days_overdue
    FROM public.vaccination_records vr
    WHERE vr.daughter_id = child_id
    AND vr.next_due_date IS NOT NULL
    AND vr.next_due_date < CURRENT_DATE
    ORDER BY vr.next_due_date ASC;
END;
$$ LANGUAGE plpgsql;

-- Insert default CDC vaccination schedule data
INSERT INTO public.health_standards_cache (standard_type, standard_source, age_months, gender, data) VALUES
('vaccine_schedule', 'CDC', 0, 'all', '{"vaccines": [{"name": "Hepatitis B", "doses": 1, "due": "birth"}]}'),
('vaccine_schedule', 'CDC', 2, 'all', '{"vaccines": [{"name": "DTaP", "doses": 1}, {"name": "Hib", "doses": 1}, {"name": "IPV", "doses": 1}, {"name": "PCV13", "doses": 1}, {"name": "RV", "doses": 1}]}'),
('vaccine_schedule', 'CDC', 4, 'all', '{"vaccines": [{"name": "DTaP", "doses": 2}, {"name": "Hib", "doses": 2}, {"name": "IPV", "doses": 2}, {"name": "PCV13", "doses": 2}, {"name": "RV", "doses": 2}]}'),
('vaccine_schedule', 'CDC', 6, 'all', '{"vaccines": [{"name": "DTaP", "doses": 3}, {"name": "Hib", "doses": 3}, {"name": "IPV", "doses": 3}, {"name": "PCV13", "doses": 3}, {"name": "RV", "doses": 3}, {"name": "Hepatitis B", "doses": 2}]}')
ON CONFLICT (standard_type, standard_source, age_months, gender) DO NOTHING;

-- Insert CDC developmental milestones
INSERT INTO public.health_standards_cache (standard_type, standard_source, age_months, gender, data) VALUES
('milestone', 'CDC', 2, 'all', '{"milestones": [{"category": "social", "name": "Begins to smile at people"}, {"category": "motor", "name": "Can hold head up and begins to push up when lying on tummy"}]}'),
('milestone', 'CDC', 4, 'all', '{"milestones": [{"category": "social", "name": "Smiles spontaneously, especially at people"}, {"category": "motor", "name": "Holds head steady, unsupported"}]}'),
('milestone', 'CDC', 6, 'all', '{"milestones": [{"category": "language", "name": "Responds to sounds by making sounds"}, {"category": "motor", "name": "Rolls over in both directions"}]}'),
('milestone', 'CDC', 9, 'all', '{"milestones": [{"category": "language", "name": "Understands no"}, {"category": "motor", "name": "Sits without support"}]}'),
('milestone', 'CDC', 12, 'all', '{"milestones": [{"category": "language", "name": "Says mama and dada"}, {"category": "motor", "name": "Walks alone"}]}')
ON CONFLICT (standard_type, standard_source, age_months, gender) DO NOTHING;