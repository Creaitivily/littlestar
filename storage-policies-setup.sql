-- =====================================================
-- STORAGE BUCKET AND POLICIES SETUP
-- Run this in Supabase SQL Editor AFTER creating the avatars bucket
-- =====================================================

-- Note: You must first create the 'avatars' bucket through the UI
-- Go to Storage → New Bucket → Name: avatars → Public: ON

-- =====================================================
-- STORAGE POLICIES FOR AVATARS BUCKET
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
-- ADDITIONAL STORAGE BUCKETS (Optional)
-- =====================================================

-- If you want to create more buckets for different file types:

-- For memory photos (private to each user)
-- 1. Create 'memories' bucket in UI (Public: OFF)
-- 2. Then run these policies:

/*
-- Allow users to upload memory photos
CREATE POLICY "Users can upload memories" 
ON storage.objects 
FOR INSERT 
TO authenticated
WITH CHECK (
    bucket_id = 'memories' 
    AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow users to view their own memories
CREATE POLICY "Users can view own memories" 
ON storage.objects 
FOR SELECT 
TO authenticated
USING (
    bucket_id = 'memories' 
    AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow users to update their own memories
CREATE POLICY "Users can update own memories" 
ON storage.objects 
FOR UPDATE 
TO authenticated
USING (
    bucket_id = 'memories' 
    AND auth.uid()::text = (storage.foldername(name))[1]
)
WITH CHECK (
    bucket_id = 'memories' 
    AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow users to delete their own memories
CREATE POLICY "Users can delete own memories" 
ON storage.objects 
FOR DELETE 
TO authenticated
USING (
    bucket_id = 'memories' 
    AND auth.uid()::text = (storage.foldername(name))[1]
);
*/

-- =====================================================
-- VERIFY STORAGE POLICIES
-- =====================================================

-- Check existing storage policies
SELECT 
    name as policy_name,
    action,
    definition
FROM storage.policies
WHERE bucket_id = 'avatars'
ORDER BY name;

-- =====================================================
-- HELPER FUNCTIONS FOR FILE UPLOADS
-- =====================================================

-- Function to generate unique file names
CREATE OR REPLACE FUNCTION generate_unique_filename(original_name TEXT)
RETURNS TEXT AS $$
BEGIN
    RETURN gen_random_uuid()::text || '-' || original_name;
END;
$$ LANGUAGE plpgsql;

-- Function to get file extension
CREATE OR REPLACE FUNCTION get_file_extension(filename TEXT)
RETURNS TEXT AS $$
BEGIN
    RETURN split_part(filename, '.', array_length(string_to_array(filename, '.'), 1));
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- USAGE NOTES
-- =====================================================

/*
How file uploads will work in your app:

1. Avatar uploads:
   - Files go to: avatars/{user_id}/filename.jpg
   - Public URL: https://[project].supabase.co/storage/v1/object/public/avatars/{user_id}/filename.jpg

2. Memory photos (if using memories bucket):
   - Files go to: memories/{user_id}/{daughter_id}/filename.jpg
   - Private URL: Requires authentication token

3. JavaScript/TypeScript upload example:

   const uploadAvatar = async (file: File) => {
     const fileExt = file.name.split('.').pop()
     const fileName = `${Math.random()}.${fileExt}`
     const filePath = `${user.id}/${fileName}`
     
     const { error: uploadError } = await supabase.storage
       .from('avatars')
       .upload(filePath, file)
       
     if (!uploadError) {
       const publicUrl = supabase.storage
         .from('avatars')
         .getPublicUrl(filePath).data.publicUrl
       
       return publicUrl
     }
   }
*/