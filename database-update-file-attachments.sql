-- Database update script to add file attachment support
-- Run in Supabase SQL Editor

-- Add attachment_url column to health_records table
ALTER TABLE public.health_records 
ADD COLUMN IF NOT EXISTS attachment_url TEXT;

-- Add doctor_name column to health_records table
ALTER TABLE public.health_records 
ADD COLUMN IF NOT EXISTS doctor_name TEXT;

-- Add attachment_url column to memories table
ALTER TABLE public.memories 
ADD COLUMN IF NOT EXISTS attachment_url TEXT;

-- Add google_photos_url column to memories table
ALTER TABLE public.memories 
ADD COLUMN IF NOT EXISTS google_photos_url TEXT;

-- Add google_photos_urls column for multiple imported photos
ALTER TABLE public.memories 
ADD COLUMN IF NOT EXISTS google_photos_urls TEXT[];

-- Add comments for clarity
COMMENT ON COLUMN public.health_records.attachment_url IS 'URL to attached file (medical documents, images, etc.)';
COMMENT ON COLUMN public.health_records.doctor_name IS 'Name of the doctor or healthcare provider';
COMMENT ON COLUMN public.memories.attachment_url IS 'URL to attached file (photos, documents, etc.)';
COMMENT ON COLUMN public.memories.google_photos_url IS 'URL/link to photo shared from Google Photos';
COMMENT ON COLUMN public.memories.google_photos_urls IS 'Array of URLs for multiple photos imported from Google Photos';

-- No need to update RLS policies since they already cover all columns