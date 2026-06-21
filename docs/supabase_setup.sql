-- =============================================================================
-- ScamShield AI v2 — Supabase Database Setup
-- Run this entire file in your Supabase project's SQL Editor.
-- =============================================================================

-- ─────────────────────────────────────────────────────────────────────────────
-- ENUMS
-- ─────────────────────────────────────────────────────────────────────────────
DO $$ BEGIN
  CREATE TYPE scan_type_enum AS ENUM (
    'TEXT', 'URL', 'CHAT', 'SCREENSHOT', 'DOCUMENT', 'EMAIL', 'FILE'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE risk_level_enum AS ENUM ('Low', 'Medium', 'High');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE report_status_enum AS ENUM ('PENDING', 'VERIFIED', 'RESOLVED');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ─────────────────────────────────────────────────────────────────────────────
-- USERS TABLE
-- Mirrors auth.users; populated automatically via trigger below.
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.users (
  id          UUID        PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email       TEXT        NOT NULL UNIQUE,
  full_name   TEXT,
  avatar_url  TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "users_own_profile" ON public.users;
CREATE POLICY "users_own_profile" ON public.users
  FOR ALL USING (auth.uid() = id);

-- Trigger: auto-create a profile row when a new auth user signs up.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name'),
    NEW.raw_user_meta_data->>'avatar_url'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- ─────────────────────────────────────────────────────────────────────────────
-- SCANS TABLE
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.scans (
  id          UUID            PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID            NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  scan_type   scan_type_enum  NOT NULL,
  input_text  TEXT,
  risk_score  INT             NOT NULL CHECK (risk_score >= 0 AND risk_score <= 100),
  risk_level  risk_level_enum NOT NULL,
  category    TEXT            NOT NULL,
  confidence  FLOAT           NOT NULL DEFAULT 0,
  explanation TEXT,
  reasons     JSONB           NOT NULL DEFAULT '[]'::jsonb,
  source      TEXT            DEFAULT 'rule_based_only',
  created_at  TIMESTAMPTZ     NOT NULL DEFAULT now()
);

ALTER TABLE public.scans ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "scans_own_rows" ON public.scans;
CREATE POLICY "scans_own_rows" ON public.scans
  FOR ALL USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS scans_user_id_created_at_idx ON public.scans (user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS scans_risk_level_idx ON public.scans (risk_level);
CREATE INDEX IF NOT EXISTS scans_scan_type_idx ON public.scans (scan_type);

-- ─────────────────────────────────────────────────────────────────────────────
-- UPLOADED_FILES TABLE
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.uploaded_files (
  id             UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id        UUID        NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  file_name      TEXT        NOT NULL,
  file_url       TEXT        NOT NULL,
  extracted_text TEXT,
  scan_id        UUID        REFERENCES public.scans(id) ON DELETE SET NULL,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.uploaded_files ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "files_own_rows" ON public.uploaded_files;
CREATE POLICY "files_own_rows" ON public.uploaded_files
  FOR ALL USING (auth.uid() = user_id);

-- ─────────────────────────────────────────────────────────────────────────────
-- ANALYTICS TABLE
-- One row per user, updated on every scan save.
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.analytics (
  id                UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           UUID        NOT NULL UNIQUE REFERENCES public.users(id) ON DELETE CASCADE,
  total_scans       INT         NOT NULL DEFAULT 0,
  high_risk_count   INT         NOT NULL DEFAULT 0,
  medium_risk_count INT         NOT NULL DEFAULT 0,
  low_risk_count    INT         NOT NULL DEFAULT 0,
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.analytics ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "analytics_own_row" ON public.analytics;
CREATE POLICY "analytics_own_row" ON public.analytics
  FOR ALL USING (auth.uid() = user_id);

-- Function: upsert analytics row and increment correct counter after a scan insert.
CREATE OR REPLACE FUNCTION public.update_analytics_on_scan()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  INSERT INTO public.analytics (user_id, total_scans, high_risk_count, medium_risk_count, low_risk_count)
  VALUES (
    NEW.user_id, 1,
    CASE WHEN NEW.risk_level = 'High'   THEN 1 ELSE 0 END,
    CASE WHEN NEW.risk_level = 'Medium' THEN 1 ELSE 0 END,
    CASE WHEN NEW.risk_level = 'Low'    THEN 1 ELSE 0 END
  )
  ON CONFLICT (user_id) DO UPDATE SET
    total_scans       = analytics.total_scans + 1,
    high_risk_count   = analytics.high_risk_count   + CASE WHEN NEW.risk_level = 'High'   THEN 1 ELSE 0 END,
    medium_risk_count = analytics.medium_risk_count + CASE WHEN NEW.risk_level = 'Medium' THEN 1 ELSE 0 END,
    low_risk_count    = analytics.low_risk_count    + CASE WHEN NEW.risk_level = 'Low'    THEN 1 ELSE 0 END,
    updated_at        = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_scan_inserted ON public.scans;
CREATE TRIGGER on_scan_inserted
  AFTER INSERT ON public.scans
  FOR EACH ROW EXECUTE PROCEDURE public.update_analytics_on_scan();

-- ─────────────────────────────────────────────────────────────────────────────
-- REPORTS TABLE (optional — for user-flagged scan results)
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.reports (
  id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID        NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  scan_id    UUID        REFERENCES public.scans(id) ON DELETE CASCADE,
  notes      TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "reports_own_rows" ON public.reports;
CREATE POLICY "reports_own_rows" ON public.reports
  FOR ALL USING (auth.uid() = user_id);

-- ─────────────────────────────────────────────────────────────────────────────
-- COMMUNITY_REPORTS TABLE (optional)
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.community_reports (
  id          UUID                PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID                REFERENCES public.users(id) ON DELETE SET NULL,
  report_text TEXT                NOT NULL,
  category    TEXT                NOT NULL,
  status      report_status_enum  NOT NULL DEFAULT 'PENDING',
  created_at  TIMESTAMPTZ         NOT NULL DEFAULT now()
);

ALTER TABLE public.community_reports ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "community_reports_select" ON public.community_reports;
CREATE POLICY "community_reports_select" ON public.community_reports
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "community_reports_insert" ON public.community_reports;
CREATE POLICY "community_reports_insert" ON public.community_reports
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ─────────────────────────────────────────────────────────────────────────────
-- STORAGE BUCKET for uploaded files
-- ─────────────────────────────────────────────────────────────────────────────
-- Run this separately if the bucket doesn't exist yet:
-- INSERT INTO storage.buckets (id, name, public) VALUES ('scamshield-uploads', 'scamshield-uploads', false);
-- CREATE POLICY "Authenticated users can upload" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'scamshield-uploads');
-- CREATE POLICY "Users can view own files" ON storage.objects FOR SELECT TO authenticated USING (bucket_id = 'scamshield-uploads' AND auth.uid()::text = (storage.foldername(name))[1]);
