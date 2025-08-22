-- Migration: Add attachment fields to memories table
-- Run this in Supabase SQL Editor or psql

-- Add additional attachment fields to memories table
ALTER TABLE public.memories 
ADD COLUMN IF NOT EXISTS attachment_url text,
ADD COLUMN IF NOT EXISTS attachment_urls text[],
ADD COLUMN IF NOT EXISTS google_photos_url text,
ADD COLUMN IF NOT EXISTS google_photos_urls text[];

-- Add comments to describe the new fields
COMMENT ON COLUMN public.memories.attachment_url IS 'Single file attachment URL (legacy support)';
COMMENT ON COLUMN public.memories.attachment_urls IS 'Array of multiple file attachment URLs';
COMMENT ON COLUMN public.memories.google_photos_url IS 'Single Google Photos URL (legacy support)';
COMMENT ON COLUMN public.memories.google_photos_urls IS 'Array of multiple Google Photos URLs';

-- Create index for attachment URL searches (optional, for performance)
CREATE INDEX IF NOT EXISTS idx_memories_attachment_urls ON public.memories USING GIN (attachment_urls);
CREATE INDEX IF NOT EXISTS idx_memories_google_photos_urls ON public.memories USING GIN (google_photos_urls);

-- Verify the changes
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'memories' AND table_schema = 'public'
ORDER BY ordinal_position;