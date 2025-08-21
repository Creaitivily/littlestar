-- =====================================================
-- SUPABASE STORAGE SETUP - RUN IN SQL EDITOR
-- =====================================================

-- First, let's check what storage tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'storage' 
ORDER BY table_name;

-- Check if the avatars bucket exists
SELECT name, public, file_size_limit, allowed_mime_types 
FROM storage.buckets 
WHERE name = 'avatars';

-- Check if RLS is already enabled (skip ALTER TABLE if true)
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'storage' AND tablename = 'objects';

-- =====================================================
-- NOTE: RLS is likely already enabled on storage.objects
-- Skip the ALTER TABLE command if you get permission errors
-- =====================================================

-- =====================================================
-- RLS POLICIES FOR AVATARS BUCKET
-- =====================================================

-- 1. Allow authenticated users to upload their own avatars
CREATE POLICY "Allow users to upload avatars" 
ON storage.objects 
FOR INSERT 
TO authenticated
WITH CHECK (
    bucket_id = 'avatars' 
    AND auth.uid()::text = (storage.foldername(name))[1]
);

-- 2. Allow everyone to view avatars (public access)
CREATE POLICY "Avatars are publicly accessible" 
ON storage.objects 
FOR SELECT 
TO public
USING (bucket_id = 'avatars');

-- 3. Allow users to update their own avatars
CREATE POLICY "Users can update own avatars" 
ON storage.objects 
FOR UPDATE 
TO authenticated
USING (
    bucket_id = 'avatars' 
    AND auth.uid()::text = (storage.foldername(name))[1]
)
WITH CHECK (
    bucket_id = 'avatars' 
    AND auth.uid()::text = (storage.foldername(name))[1]
);

-- 4. Allow users to delete their own avatars
CREATE POLICY "Users can delete own avatars" 
ON storage.objects 
FOR DELETE 
TO authenticated
USING (
    bucket_id = 'avatars' 
    AND auth.uid()::text = (storage.foldername(name))[1]
);

-- =====================================================
-- VERIFY THE SETUP
-- =====================================================

-- Check RLS is enabled
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'storage' AND tablename = 'objects';

-- List all policies on storage.objects
SELECT 
    policyname,
    cmd,
    roles,
    qual
FROM pg_policies 
WHERE schemaname = 'storage' AND tablename = 'objects';

-- =====================================================
-- ALTERNATIVE: CHECK POLICIES USING SUPABASE FUNCTIONS
-- =====================================================

-- If the above doesn't work, try this simpler approach:
-- Just check that the bucket exists and RLS is working
SELECT 
    'avatars' as bucket_name,
    EXISTS(SELECT 1 FROM storage.buckets WHERE name = 'avatars') as bucket_exists,
    (SELECT rowsecurity FROM pg_tables WHERE schemaname = 'storage' AND tablename = 'objects') as rls_enabled;