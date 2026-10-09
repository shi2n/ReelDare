-- ============================================================================
-- THINGS DONE BEFORE DIE - PRODUCTION SUPABASE SECURITY MIGRATION (PHASE 1)
-- ============================================================================
-- Run this script in your Supabase SQL Editor:
-- Dashboard -> SQL Editor -> New Query -> Paste & Run

-- 1. Ensure required tables exist with proper owner references and constraints
CREATE TABLE IF NOT EXISTS public.experiences (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(40) NOT NULL,
    mood VARCHAR(40) NOT NULL,
    difficulty INTEGER NOT NULL DEFAULT 1,
    budget INTEGER NOT NULL DEFAULT 0,
    time VARCHAR(20) NOT NULL DEFAULT '1hour',
    energy VARCHAR(20) NOT NULL DEFAULT 'normal',
    location VARCHAR(20) NOT NULL DEFAULT 'anywhere',
    social VARCHAR(20) NOT NULL DEFAULT 'any',
    safety VARCHAR(20) NOT NULL DEFAULT 'safe',
    reel INTEGER NOT NULL DEFAULT 3,
    completions INTEGER NOT NULL DEFAULT 0,
    trending BOOLEAN NOT NULL DEFAULT false,
    featured BOOLEAN NOT NULL DEFAULT false,
    tags TEXT NOT NULL DEFAULT '',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.users (
    id VARCHAR(100) PRIMARY KEY,
    username VARCHAR(60) NOT NULL UNIQUE,
    email VARCHAR(320) NOT NULL UNIQUE,
    password_hash VARCHAR(255),
    social_link TEXT NOT NULL DEFAULT '',
    bio TEXT NOT NULL DEFAULT 'Live more. Regret nothing.',
    avatar TEXT,
    xp INTEGER NOT NULL DEFAULT 150,
    completed_tasks INTEGER NOT NULL DEFAULT 0,
    spins_count INTEGER NOT NULL DEFAULT 0,
    preferences TEXT,
    role VARCHAR(20) NOT NULL DEFAULT 'user', -- 'user' or 'admin', never editable by client
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.evidences (
    id VARCHAR(100) PRIMARY KEY,
    user_id VARCHAR(100) NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    exp_id INTEGER NOT NULL,
    exp_title TEXT NOT NULL,
    category VARCHAR(50) NOT NULL,
    what_you_did TEXT NOT NULL,
    time_spent VARCHAR(50) NOT NULL,
    completed_date VARCHAR(50) NOT NULL,
    evidence_link TEXT NOT NULL,
    xp_earned INTEGER NOT NULL DEFAULT 0,
    submitted_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.custom_wishes (
    id VARCHAR(100) PRIMARY KEY,
    user_id VARCHAR(100) NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    category VARCHAR(50) NOT NULL DEFAULT 'Personal',
    completed BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.newsletter_subscribers (
    id SERIAL PRIMARY KEY,
    email VARCHAR(320) NOT NULL UNIQUE,
    plan VARCHAR(30) NOT NULL DEFAULT 'free',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ============================================================================
-- 2. CREATE PERFORMANCE INDEXES ON OWNER & FOREIGN KEY COLUMNS
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_users_username ON public.users(username);
CREATE INDEX IF NOT EXISTS idx_evidences_user_id ON public.evidences(user_id);
CREATE INDEX IF NOT EXISTS idx_evidences_submitted_at ON public.evidences(submitted_at DESC);
CREATE INDEX IF NOT EXISTS idx_custom_wishes_user_id ON public.custom_wishes(user_id);

-- ============================================================================
-- 3. ENABLE ROW LEVEL SECURITY (RLS) ON ALL TABLES
-- ============================================================================
ALTER TABLE public.experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.experiences FORCE ROW LEVEL SECURITY;

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users FORCE ROW LEVEL SECURITY;

ALTER TABLE public.evidences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.evidences FORCE ROW LEVEL SECURITY;

ALTER TABLE public.custom_wishes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.custom_wishes FORCE ROW LEVEL SECURITY;

ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.newsletter_subscribers FORCE ROW LEVEL SECURITY;

-- Drop existing policies to prevent conflicts during re-run
DO $$ 
DECLARE
    pol record;
BEGIN
    FOR pol IN (
        SELECT policyname, tablename 
        FROM pg_policies 
        WHERE schemaname = 'public'
    ) LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', pol.policyname, pol.tablename);
    END LOOP;
END $$;

-- ============================================================================
-- 4. RLS POLICIES FOR: experiences (Catalog Table)
-- Public can read all challenge experiences. Only service_role can modify.
-- ============================================================================
CREATE POLICY "experiences_public_select"
    ON public.experiences
    FOR SELECT
    TO anon, authenticated
    USING (true);

CREATE POLICY "experiences_service_all"
    ON public.experiences
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

-- ============================================================================
-- 5. RLS POLICIES FOR: users
-- Users can view basic profiles for leaderboard & community.
-- Users can ONLY update or delete their own profile record.
-- ============================================================================
-- Public can read public profile data (username, avatar, bio, xp, tasks)
CREATE POLICY "users_public_select"
    ON public.users
    FOR SELECT
    TO anon, authenticated
    USING (true);

-- Authenticated user can insert their own record on signup
CREATE POLICY "users_auth_insert"
    ON public.users
    FOR INSERT
    TO authenticated
    WITH CHECK (id = (SELECT auth.uid()::text));

-- Authenticated user can update ONLY their own record (cannot hijack ownership)
CREATE POLICY "users_auth_update"
    ON public.users
    FOR UPDATE
    TO authenticated
    USING (id = (SELECT auth.uid()::text))
    WITH CHECK (id = (SELECT auth.uid()::text));

-- Authenticated user can delete their own account
CREATE POLICY "users_auth_delete"
    ON public.users
    FOR DELETE
    TO authenticated
    USING (id = (SELECT auth.uid()::text));

-- Full access for backend service_role
CREATE POLICY "users_service_all"
    ON public.users
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

-- ============================================================================
-- 6. RLS POLICIES FOR: evidences (Proof of Challenges)
-- Public can view community submitted proofs.
-- Only the owner can insert, edit, or delete their proof.
-- ============================================================================
CREATE POLICY "evidences_public_select"
    ON public.evidences
    FOR SELECT
    TO anon, authenticated
    USING (true);

CREATE POLICY "evidences_owner_insert"
    ON public.evidences
    FOR INSERT
    TO authenticated
    WITH CHECK (user_id = (SELECT auth.uid()::text));

CREATE POLICY "evidences_owner_update"
    ON public.evidences
    FOR UPDATE
    TO authenticated
    USING (user_id = (SELECT auth.uid()::text))
    WITH CHECK (user_id = (SELECT auth.uid()::text));

CREATE POLICY "evidences_owner_delete"
    ON public.evidences
    FOR DELETE
    TO authenticated
    USING (user_id = (SELECT auth.uid()::text));

CREATE POLICY "evidences_service_all"
    ON public.evidences
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

-- ============================================================================
-- 7. RLS POLICIES FOR: custom_wishes (Private User Bucket Lists)
-- Strictly PRIVATE to the owner: no other user can read or modify.
-- ============================================================================
CREATE POLICY "wishes_owner_select"
    ON public.custom_wishes
    FOR SELECT
    TO authenticated
    USING (user_id = (SELECT auth.uid()::text));

CREATE POLICY "wishes_owner_insert"
    ON public.custom_wishes
    FOR INSERT
    TO authenticated
    WITH CHECK (user_id = (SELECT auth.uid()::text));

CREATE POLICY "wishes_owner_update"
    ON public.custom_wishes
    FOR UPDATE
    TO authenticated
    USING (user_id = (SELECT auth.uid()::text))
    WITH CHECK (user_id = (SELECT auth.uid()::text));

CREATE POLICY "wishes_owner_delete"
    ON public.custom_wishes
    FOR DELETE
    TO authenticated
    USING (user_id = (SELECT auth.uid()::text));

CREATE POLICY "wishes_service_all"
    ON public.custom_wishes
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

-- ============================================================================
-- 8. RLS POLICIES FOR: newsletter_subscribers
-- Anyone can subscribe (INSERT). No public user can read subscriber list.
-- ============================================================================
CREATE POLICY "newsletter_anon_insert"
    ON public.newsletter_subscribers
    FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

CREATE POLICY "newsletter_service_all"
    ON public.newsletter_subscribers
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

-- ============================================================================
-- 9. SAFE STORAGE BUCKET CONFIGURATION (Proof Uploads)
-- ============================================================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('proof-uploads', 'proof-uploads', false)
ON CONFLICT (id) DO UPDATE SET public = false;

CREATE POLICY "storage_owner_read"
    ON storage.objects
    FOR SELECT
    TO authenticated
    USING (bucket_id = 'proof-uploads' AND (storage.foldername(name))[1] = (SELECT auth.uid()::text));

CREATE POLICY "storage_owner_insert"
    ON storage.objects
    FOR INSERT
    TO authenticated
    WITH CHECK (bucket_id = 'proof-uploads' AND (storage.foldername(name))[1] = (SELECT auth.uid()::text));

CREATE POLICY "storage_owner_delete"
    ON storage.objects
    FOR DELETE
    TO authenticated
    USING (bucket_id = 'proof-uploads' AND (storage.foldername(name))[1] = (SELECT auth.uid()::text));
