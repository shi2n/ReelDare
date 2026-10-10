-- =========================================================================
-- REEL DARE — SUPABASE POSTGRESQL PRODUCTION SCHEMA
-- Run this in: Supabase Dashboard -> SQL Editor -> New Query -> Run
-- =========================================================================

-- 1. USERS TABLE (Profiles, XP, Level, Avatar, Instagram, Customizations)
CREATE TABLE IF NOT EXISTS public.users (
  id VARCHAR(100) PRIMARY KEY,
  username VARCHAR(60) NOT NULL UNIQUE,
  display_name VARCHAR(100),
  email VARCHAR(320) NOT NULL UNIQUE,
  password_hash VARCHAR(255),
  social_link TEXT NOT NULL DEFAULT '',
  instagram VARCHAR(100) DEFAULT '',
  bio TEXT NOT NULL DEFAULT 'Live more. Regret nothing.',
  avatar TEXT,
  accent_color VARCHAR(40) DEFAULT '#a855f7',
  xp INTEGER NOT NULL DEFAULT 150,
  completed_tasks INTEGER NOT NULL DEFAULT 0,
  spins_count INTEGER NOT NULL DEFAULT 0,
  preferences TEXT, -- JSON stringified questionnaire preferences
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- 2. VERIFIED EVIDENCE & PROOFS
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
  submitted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- 3. CUSTOM BUCKET LIST GOALS (MY 100)
CREATE TABLE IF NOT EXISTS public.custom_wishes (
  id VARCHAR(100) PRIMARY KEY,
  user_id VARCHAR(100) NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  category VARCHAR(50) NOT NULL DEFAULT 'Personal',
  completed BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- 4. EXPERIENCES & DARES CATALOG
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
  trending BOOLEAN NOT NULL DEFAULT FALSE,
  featured BOOLEAN NOT NULL DEFAULT FALSE,
  tags TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- 5. SHAMEFUL & PUBLIC ACTS (2,000 UNIQUE STRUCTURED CHALLENGES)
CREATE TABLE IF NOT EXISTS public.challenges (
  id VARCHAR(50) PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category VARCHAR(50) NOT NULL,
  difficulty VARCHAR(20) NOT NULL,
  duration VARCHAR(50) NOT NULL,
  embarrassment_level INTEGER NOT NULL DEFAULT 1,
  social_intensity INTEGER NOT NULL DEFAULT 1,
  location VARCHAR(50) NOT NULL,
  requires_consent BOOLEAN NOT NULL DEFAULT FALSE,
  requires_permission BOOLEAN NOT NULL DEFAULT FALSE,
  safety_note TEXT NOT NULL DEFAULT 'Safe and voluntary',
  reel_potential INTEGER NOT NULL DEFAULT 5,
  tags TEXT[] DEFAULT ARRAY[]::TEXT[],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- 6. NEWSLETTER SUBSCRIBERS
CREATE TABLE IF NOT EXISTS public.newsletter_subscribers (
  id SERIAL PRIMARY KEY,
  email VARCHAR(320) NOT NULL UNIQUE,
  plan VARCHAR(30) NOT NULL DEFAULT 'free',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- =========================================================================
-- PERFORMANCE INDEXES
-- =========================================================================
CREATE INDEX IF NOT EXISTS idx_users_username ON public.users(username);
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_evidences_user_id ON public.evidences(user_id);
CREATE INDEX IF NOT EXISTS idx_custom_wishes_user_id ON public.custom_wishes(user_id);
CREATE INDEX IF NOT EXISTS idx_experiences_category ON public.experiences(category);
CREATE INDEX IF NOT EXISTS idx_experiences_mood ON public.experiences(mood);
CREATE INDEX IF NOT EXISTS idx_challenges_category ON public.challenges(category);

-- =========================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =========================================================================
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.evidences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.custom_wishes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Allow public read access to experiences and challenges
CREATE POLICY "Public experiences are viewable by everyone" ON public.experiences FOR SELECT USING (true);
CREATE POLICY "Public challenges are viewable by everyone" ON public.challenges FOR SELECT USING (true);
CREATE POLICY "Public user profiles are viewable by everyone" ON public.users FOR SELECT USING (true);
CREATE POLICY "Public evidences are viewable by everyone" ON public.evidences FOR SELECT USING (true);

-- Allow service_role / backend full management
CREATE POLICY "Service role has full access to users" ON public.users FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service role has full access to evidences" ON public.evidences FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service role has full access to custom_wishes" ON public.custom_wishes FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service role has full access to experiences" ON public.experiences FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service role has full access to challenges" ON public.challenges FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service role has full access to newsletter" ON public.newsletter_subscribers FOR ALL USING (true) WITH CHECK (true);
