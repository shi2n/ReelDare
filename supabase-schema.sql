-- =========================================================================
-- Things Done Before Die — Supabase PostgreSQL Schema
-- Copy and paste this into Supabase Dashboard -> SQL Editor -> Run
-- =========================================================================

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
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
  preferences TEXT, -- JSON stringified questionnaire responses
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- 2. Verified Evidences (Proof of Completion)
CREATE TABLE IF NOT EXISTS evidences (
  id VARCHAR(100) PRIMARY KEY,
  user_id VARCHAR(100) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
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

-- 3. Custom Bucket List Goals (My 100)
CREATE TABLE IF NOT EXISTS custom_wishes (
  id VARCHAR(100) PRIMARY KEY,
  user_id VARCHAR(100) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  category VARCHAR(50) NOT NULL DEFAULT 'Personal',
  completed BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- 4. Experiences Catalog (If you want to sync experiences to Supabase)
CREATE TABLE IF NOT EXISTS experiences (
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

-- 5. Newsletter Subscribers
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id SERIAL PRIMARY KEY,
  email VARCHAR(320) NOT NULL UNIQUE,
  plan VARCHAR(30) NOT NULL DEFAULT 'free',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Enable Row Level Security (optional - default disabled for backend server access)
-- ALTER TABLE users ENABLE ROW LEVEL SECURITY;
