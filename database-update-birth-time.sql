-- Add birth_time column to daughters table
-- Run this in your Supabase SQL Editor

ALTER TABLE public.daughters 
ADD COLUMN IF NOT EXISTS birth_time TIME;