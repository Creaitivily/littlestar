-- =====================================================
-- INITIAL MILESTONEBEE DATABASE MIGRATION
-- This will be automatically applied to your Supabase project
-- =====================================================

-- Enable necessary extensions
create extension if not exists "uuid-ossp";

-- =====================================================
-- CORE TABLES
-- =====================================================

-- Users table
create table if not exists public.users (
    id uuid references auth.users(id) primary key,
    email text unique not null,
    full_name text,
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now()
);

-- Daughters table
create table if not exists public.daughters (
    id uuid default gen_random_uuid() primary key,
    user_id uuid references public.users(id) on delete cascade not null,
    name text not null,
    birth_date date not null,
    birth_time time,
    profile_image_url text,
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now()
);

-- Activities table
create table if not exists public.activities (
    id uuid default gen_random_uuid() primary key,
    user_id uuid references public.users(id) on delete cascade not null,
    daughter_id uuid references public.daughters(id) on delete cascade not null,
    type text not null,
    description text,
    date date not null,
    time time,
    duration_minutes integer,
    notes text,
    created_at timestamp with time zone default now()
);

-- Growth records table
create table if not exists public.growth_records (
    id uuid default gen_random_uuid() primary key,
    user_id uuid references public.users(id) on delete cascade not null,
    daughter_id uuid references public.daughters(id) on delete cascade not null,
    height decimal(5,2),
    weight decimal(5,2),
    head_circumference decimal(5,2),
    measurement_date date not null,
    notes text,
    created_at timestamp with time zone default now()
);

-- Health records table
create table if not exists public.health_records (
    id uuid default gen_random_uuid() primary key,
    user_id uuid references public.users(id) on delete cascade not null,
    daughter_id uuid references public.daughters(id) on delete cascade not null,
    type text not null,
    description text not null,
    date date not null,
    provider text,
    location text,
    notes text,
    follow_up_date date,
    medications text[],
    symptoms text[],
    temperature decimal(4,1),
    blood_pressure text,
    created_at timestamp with time zone default now()
);

-- Memories table
create table if not exists public.memories (
    id uuid default gen_random_uuid() primary key,
    user_id uuid references public.users(id) on delete cascade not null,
    daughter_id uuid references public.daughters(id) on delete cascade not null,
    title text not null,
    description text,
    image_url text,
    date date not null,
    milestone_category text,
    tags text[],
    created_at timestamp with time zone default now()
);

-- User settings table
create table if not exists public.user_settings (
    id uuid default gen_random_uuid() primary key,
    user_id uuid references public.users(id) on delete cascade not null unique,
    milestone_reminders boolean default true,
    weekly_summaries boolean default true,
    app_updates boolean default false,
    email_notifications boolean default true,
    push_notifications boolean default true,
    two_factor_enabled boolean default false,
    data_encryption_enabled boolean default true,
    theme text default 'auto' check (theme in ('light', 'dark', 'auto')),
    color_scheme text default 'milestonebee',
    language text default 'en',
    date_format text default 'MM/DD/YYYY',
    country text default 'US',
    emergency_contact_numbers jsonb default '{}',
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now()
);

-- =====================================================
-- EXTENDED TABLES
-- =====================================================

-- Vaccinations table
create table if not exists public.vaccinations (
    id uuid default gen_random_uuid() primary key,
    user_id uuid references public.users(id) on delete cascade not null,
    daughter_id uuid references public.daughters(id) on delete cascade not null,
    vaccine_name text not null,
    dose_number integer,
    date_given date not null,
    provider text,
    location text,
    next_dose_date date,
    side_effects text,
    created_at timestamp with time zone default now()
);

-- Milestones table
create table if not exists public.milestones (
    id uuid default gen_random_uuid() primary key,
    user_id uuid references public.users(id) on delete cascade not null,
    daughter_id uuid references public.daughters(id) on delete cascade not null,
    category text not null,
    title text not null,
    description text,
    achieved_date date,
    expected_age_months integer,
    notes text,
    created_at timestamp with time zone default now()
);

-- Health AI insights table
create table if not exists public.health_ai_insights (
    id uuid default gen_random_uuid() primary key,
    user_id uuid references public.users(id) on delete cascade not null,
    daughter_id uuid references public.daughters(id) on delete cascade not null,
    insight_type text not null,
    title text not null,
    content text not null,
    severity text check (severity in ('info', 'warning', 'alert')),
    action_items jsonb,
    is_read boolean default false,
    created_at timestamp with time zone default now()
);

-- AI conversations table
create table if not exists public.ai_conversations (
    id uuid default gen_random_uuid() primary key,
    user_id uuid references public.users(id) on delete cascade not null,
    daughter_id uuid references public.daughters(id),
    message text not null,
    response text not null,
    message_type text,
    context jsonb,
    created_at timestamp with time zone default now()
);

-- File attachments table
create table if not exists public.file_attachments (
    id uuid default gen_random_uuid() primary key,
    user_id uuid references public.users(id) on delete cascade not null,
    daughter_id uuid references public.daughters(id) on delete cascade,
    record_type text not null,
    record_id uuid,
    file_name text not null,
    file_type text not null,
    file_size integer,
    file_url text not null,
    thumbnail_url text,
    created_at timestamp with time zone default now()
);

-- =====================================================
-- ENABLE ROW LEVEL SECURITY
-- =====================================================

alter table public.users enable row level security;
alter table public.daughters enable row level security;
alter table public.activities enable row level security;
alter table public.growth_records enable row level security;
alter table public.health_records enable row level security;
alter table public.memories enable row level security;
alter table public.user_settings enable row level security;
alter table public.vaccinations enable row level security;
alter table public.milestones enable row level security;
alter table public.health_ai_insights enable row level security;
alter table public.ai_conversations enable row level security;
alter table public.file_attachments enable row level security;