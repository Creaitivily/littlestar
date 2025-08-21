-- =====================================================
-- DATABASE VERIFICATION QUERIES
-- Run these queries after setup to verify everything is working
-- =====================================================

-- 1. Check all tables were created
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- Expected result: Should show these tables:
-- activities
-- ai_conversations
-- daughters
-- file_attachments
-- growth_records
-- health_ai_insights
-- health_records
-- memories
-- milestones
-- user_settings
-- users
-- vaccinations

-- 2. Check RLS is enabled on all tables
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
ORDER BY tablename;

-- Expected: All tables should show rowsecurity = true

-- 3. Check all RLS policies are created
SELECT schemaname, tablename, policyname 
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename;

-- Expected: Each table should have at least one policy

-- 4. Check triggers are working
SELECT trigger_name, event_object_table 
FROM information_schema.triggers 
WHERE trigger_schema = 'public'
ORDER BY event_object_table;

-- Expected triggers:
-- on_auth_user_created (auth.users)
-- on_auth_user_created_settings (users)
-- handle_updated_at (multiple tables)

-- 5. Check indexes for performance
SELECT indexname, tablename 
FROM pg_indexes 
WHERE schemaname = 'public' 
AND indexname LIKE 'idx_%'
ORDER BY tablename;

-- 6. Test user settings creation (optional)
-- This will show if settings are being created for users
SELECT 
    u.email,
    us.country,
    us.theme,
    us.emergency_contact_numbers
FROM public.users u
LEFT JOIN public.user_settings us ON u.id = us.user_id
LIMIT 5;

-- 7. Check column existence
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'daughters'
ORDER BY ordinal_position;

-- Should include 'birth_time' column of type 'time'

-- 8. Count records in each table
SELECT 
    'users' as table_name, COUNT(*) as record_count FROM public.users
UNION ALL
SELECT 'daughters', COUNT(*) FROM public.daughters
UNION ALL
SELECT 'activities', COUNT(*) FROM public.activities
UNION ALL
SELECT 'growth_records', COUNT(*) FROM public.growth_records
UNION ALL
SELECT 'health_records', COUNT(*) FROM public.health_records
UNION ALL
SELECT 'memories', COUNT(*) FROM public.memories
UNION ALL
SELECT 'user_settings', COUNT(*) FROM public.user_settings
ORDER BY table_name;