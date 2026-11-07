-- ================================================================
-- TECHXERA HACKFEST '26 // SUPABASE DATABASE SCHEMA
-- All tables and permissions for HackVerse '26
-- ================================================================

-- 1. PARTNERS TABLE (Official Arena Partners & Tiers)
CREATE TABLE IF NOT EXISTS public.partners (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    tier TEXT NOT NULL DEFAULT 'Gold',
    category TEXT DEFAULT 'Developer Ecosystem & Grants',
    perk TEXT DEFAULT 'Official Arena Combat Partner',
    logo_url TEXT,
    website_url TEXT,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. GALLERY TABLE (Event Chronicles & Photo Archives)
CREATE TABLE IF NOT EXISTS public.gallery (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    category TEXT NOT NULL DEFAULT 'EVENT',
    image TEXT NOT NULL,
    caption TEXT,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. CHALLENGES TABLE (Arena Problem Statements & Quests)
CREATE TABLE IF NOT EXISTS public.challenges (
    id TEXT PRIMARY KEY,
    number TEXT,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    difficulty TEXT DEFAULT 'All Levels',
    short_description TEXT,
    problem_statement TEXT,
    requirements JSONB DEFAULT '[]'::jsonb,
    judging_criteria JSONB DEFAULT '[]'::jsonb,
    skills JSONB DEFAULT '[]'::jsonb,
    image TEXT,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. TIMELINE TABLE (Event Schedule & Chronology)
CREATE TABLE IF NOT EXISTS public.timeline (
    id TEXT PRIMARY KEY,
    day TEXT NOT NULL,
    time TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    milestone BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. TEAMS TABLE (Featured Enlisted Squads)
CREATE TABLE IF NOT EXISTS public.teams (
    id TEXT PRIMARY KEY,
    number TEXT,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. FAQ TABLE (Rules & Guidelines Q&A Base)
CREATE TABLE IF NOT EXISTS public.faq (
    id TEXT PRIMARY KEY,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    category TEXT,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. REGISTRATIONS TABLE (Warrior Ticket Enlistments)
CREATE TABLE IF NOT EXISTS public.registrations (
    id TEXT PRIMARY KEY,
    team_name TEXT NOT NULL,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    college_or_org TEXT,
    selected_challenge TEXT,
    team_members JSONB DEFAULT '[]'::jsonb,
    github_or_portfolio TEXT,
    submitted_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 8. SITE CONTENT TABLE (Complete Unified Site State)
CREATE TABLE IF NOT EXISTS public.site_content (
    id TEXT PRIMARY KEY DEFAULT 'hackverse_2026',
    content JSONB NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 9. ENABLE ROW LEVEL SECURITY (RLS) ON ALL TABLES
ALTER TABLE public.partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.timeline ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faq ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;

-- 10. PUBLIC POLICIES (READ & WRITE ACCESS)
DO $$
DECLARE
    tbl text;
BEGIN
    FOR tbl IN SELECT tablename FROM pg_tables WHERE schemaname = 'public' LOOP
        EXECUTE format('DROP POLICY IF EXISTS "Public can read %I" ON public.%I', tbl, tbl);
        EXECUTE format('CREATE POLICY "Public can read %I" ON public.%I FOR SELECT TO anon, authenticated USING (true)', tbl, tbl);

        EXECUTE format('DROP POLICY IF EXISTS "Public can write %I" ON public.%I', tbl, tbl);
        EXECUTE format('CREATE POLICY "Public can write %I" ON public.%I FOR ALL TO anon, authenticated USING (true) WITH CHECK (true)', tbl, tbl);
    END LOOP;
END $$;

-- 11. MEDIA STORAGE BUCKET (LOGOS, PARTNERS & GALLERY IMAGES)
INSERT INTO storage.buckets (id, name, public)
VALUES ('media', 'media', true)
ON CONFLICT (id) DO UPDATE SET public = true;

DROP POLICY IF EXISTS "Public can view media" ON storage.objects;
CREATE POLICY "Public can view media"
ON storage.objects FOR SELECT
TO anon, authenticated
USING (bucket_id = 'media');

DROP POLICY IF EXISTS "Public can upload media" ON storage.objects;
CREATE POLICY "Public can upload media"
ON storage.objects FOR INSERT
TO anon, authenticated
WITH CHECK (bucket_id = 'media');

DROP POLICY IF EXISTS "Public can modify media" ON storage.objects;
CREATE POLICY "Public can modify media"
ON storage.objects FOR ALL
TO anon, authenticated
USING (bucket_id = 'media');
