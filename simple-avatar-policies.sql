-- =====================================================
-- SIMPLE AVATAR STORAGE POLICIES - SUPABASE SQL EDITOR
-- =====================================================

-- Check if your bucket exists first
SELECT name, public FROM storage.buckets WHERE name = 'avatars';

-- =====================================================
-- CREATE THE 4 STORAGE POLICIES
-- (Run these one by one to see which works)
-- =====================================================

-- 1. Allow users to upload their own avatars
CREATE POLICY "Users can upload own avatars" 
ON storage.objects 
FOR INSERT 
TO authenticated
WITH CHECK (
    bucket_id = 'avatars' 
    AND auth.uid()::text = (storage.foldername(name))[1]
);

-- 2. Allow public viewing of avatars
CREATE POLICY "Public avatar access" 
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
-- VERIFY POLICIES WERE CREATED
-- =====================================================

SELECT 
    policyname as policy_name,
    cmd as action
FROM pg_policies 
WHERE schemaname = 'storage' 
AND tablename = 'objects'
AND policyname LIKE '%avatar%';

-- =====================================================
-- ALTERNATIVE: If the above policies fail, try these simpler ones
-- =====================================================

/*
-- Simpler policies without the foldername check
CREATE POLICY "Simple upload policy" 
ON storage.objects 
FOR INSERT 
TO authenticated
WITH CHECK (bucket_id = 'avatars');

CREATE POLICY "Simple view policy" 
ON storage.objects 
FOR SELECT 
TO public
USING (bucket_id = 'avatars');

CREATE POLICY "Simple update policy" 
ON storage.objects 
FOR UPDATE 
TO authenticated
USING (bucket_id = 'avatars');

CREATE POLICY "Simple delete policy" 
ON storage.objects 
FOR DELETE 
TO authenticated  
USING (bucket_id = 'avatars');
*/