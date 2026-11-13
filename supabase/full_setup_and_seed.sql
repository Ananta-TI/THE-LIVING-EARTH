-- =============================================================================
-- THE LIVING EARTH — COMPLETE DATABASE SCHEMA, RLS, STORAGE & SEED DATA
-- Cara Pakai: Buka Supabase Dashboard -> SQL Editor -> New Query,
--             tempel (paste) seluruh isi file ini, lalu klik tombol RUN.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 20261113000100_create_profiles_and_auth_helpers.sql
-- -----------------------------------------------------------------------------
-- Migration 0001: Profiles, updated_at trigger helper, and admin authorization helper
-- Note: Public user registration is disabled; profiles are provisioned only via trusted admin bootstrap.


CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = timezone('utc', now());
  RETURN NEW;
END;
$$;

CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL CHECK (char_length(btrim(full_name)) BETWEEN 1 AND 120),
  avatar_url TEXT NULL CHECK (avatar_url IS NULL OR char_length(btrim(avatar_url)) > 0),
  role TEXT NOT NULL CHECK (role IN ('admin')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

COMMENT ON TABLE public.profiles IS 'Application profile metadata for trusted Supabase Auth administrators.';
COMMENT ON COLUMN public.profiles.role IS 'Application role. Restricted to admin; self-registration and self-escalation are disallowed.';

-- SECURITY DEFINER avoids recursive RLS evaluation when policies check admin status.
-- search_path is pinned to prevent object shadowing.
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.profiles AS p
    WHERE p.id = auth.uid()
      AND p.role = 'admin'
  );
$$;

REVOKE ALL ON FUNCTION public.is_admin() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;

-- -----------------------------------------------------------------------------
-- 20261113000200_create_content_tables.sql
-- -----------------------------------------------------------------------------
-- Migration 0002: Core editorial content tables (pillars, topics, articles, case_studies)


CREATE TABLE IF NOT EXISTS public.pillars (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL CHECK (char_length(btrim(name)) BETWEEN 2 AND 120),
  slug TEXT NOT NULL UNIQUE CHECK (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  description TEXT NOT NULL CHECK (char_length(btrim(description)) > 0),
  cover_image_path TEXT NULL CHECK (cover_image_path IS NULL OR char_length(btrim(cover_image_path)) > 0),
  display_order INTEGER NOT NULL UNIQUE CHECK (display_order >= 1),
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

CREATE TABLE IF NOT EXISTS public.topics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pillar_id UUID NOT NULL REFERENCES public.pillars(id) ON DELETE RESTRICT,
  name TEXT NOT NULL CHECK (char_length(btrim(name)) BETWEEN 2 AND 120),
  slug TEXT NOT NULL CHECK (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  description TEXT NOT NULL CHECK (char_length(btrim(description)) > 0),
  display_order INTEGER NOT NULL DEFAULT 1 CHECK (display_order >= 1),
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
  CONSTRAINT topics_pillar_slug_unique UNIQUE (pillar_id, slug),
  -- Supports composite FK from articles so topic_id must belong to the same pillar_id.
  CONSTRAINT topics_id_pillar_unique UNIQUE (id, pillar_id)
);

CREATE TABLE IF NOT EXISTS public.articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pillar_id UUID NOT NULL REFERENCES public.pillars(id) ON DELETE RESTRICT,
  topic_id UUID NULL,
  title TEXT NOT NULL CHECK (char_length(btrim(title)) BETWEEN 3 AND 200),
  slug TEXT NOT NULL UNIQUE CHECK (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  excerpt TEXT NOT NULL CHECK (char_length(btrim(excerpt)) > 0),
  content TEXT NOT NULL CHECK (char_length(btrim(content)) > 0),
  cover_image_path TEXT NULL CHECK (cover_image_path IS NULL OR char_length(btrim(cover_image_path)) > 0),
  author_id UUID NULL REFERENCES public.profiles(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  featured BOOLEAN NOT NULL DEFAULT false,
  seo_title TEXT NULL CHECK (seo_title IS NULL OR char_length(btrim(seo_title)) <= 160),
  seo_description TEXT NULL CHECK (seo_description IS NULL OR char_length(btrim(seo_description)) <= 320),
  published_at TIMESTAMPTZ NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
  CONSTRAINT articles_topic_matches_pillar_fk
    FOREIGN KEY (topic_id, pillar_id)
    REFERENCES public.topics(id, pillar_id)
    ON DELETE RESTRICT,
  CONSTRAINT articles_published_requires_timestamp
    CHECK (status <> 'published' OR published_at IS NOT NULL)
);

CREATE TABLE IF NOT EXISTS public.case_studies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pillar_id UUID NOT NULL REFERENCES public.pillars(id) ON DELETE RESTRICT,
  title TEXT NOT NULL CHECK (char_length(btrim(title)) BETWEEN 3 AND 200),
  slug TEXT NOT NULL UNIQUE CHECK (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  summary TEXT NOT NULL CHECK (char_length(btrim(summary)) > 0),
  content TEXT NOT NULL CHECK (char_length(btrim(content)) > 0),
  country TEXT NOT NULL CHECK (char_length(btrim(country)) > 0),
  region TEXT NULL CHECK (region IS NULL OR char_length(btrim(region)) > 0),
  latitude NUMERIC(9, 6) NULL CHECK (latitude IS NULL OR (latitude >= -90 AND latitude <= 90)),
  longitude NUMERIC(9, 6) NULL CHECK (longitude IS NULL OR (longitude >= -180 AND longitude <= 180)),
  cover_image_path TEXT NULL CHECK (cover_image_path IS NULL OR char_length(btrim(cover_image_path)) > 0),
  organization TEXT NULL CHECK (organization IS NULL OR char_length(btrim(organization)) > 0),
  start_date DATE NULL,
  end_date DATE NULL,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  published_at TIMESTAMPTZ NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
  CONSTRAINT case_studies_coordinates_pair
    CHECK ((latitude IS NULL AND longitude IS NULL) OR (latitude IS NOT NULL AND longitude IS NOT NULL)),
  CONSTRAINT case_studies_date_order
    CHECK (start_date IS NULL OR end_date IS NULL OR end_date >= start_date),
  CONSTRAINT case_studies_published_requires_timestamp
    CHECK (status <> 'published' OR published_at IS NOT NULL)
);

-- -----------------------------------------------------------------------------
-- 20261113000300_create_reference_and_join_tables.sql
-- -----------------------------------------------------------------------------
-- Migration 0003: Scientific references and content-reference join tables


CREATE TABLE IF NOT EXISTS public.references (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL CHECK (char_length(btrim(title)) > 0),
  organization TEXT NOT NULL CHECK (char_length(btrim(organization)) > 0),
  source_type TEXT NOT NULL CHECK (
    source_type IN (
      'scientific_journal',
      'research_report',
      'government_data',
      'international_organization',
      'institutional_report',
      'other'
    )
  ),
  author TEXT NULL CHECK (author IS NULL OR char_length(btrim(author)) > 0),
  publication_date DATE NULL,
  source_url TEXT NOT NULL CHECK (source_url ~* '^https?://[^\s]+$'),
  accessed_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
  notes TEXT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
  CONSTRAINT references_unique_title_url UNIQUE (title, source_url)
);

CREATE TABLE IF NOT EXISTS public.article_references (
  article_id UUID NOT NULL REFERENCES public.articles(id) ON DELETE CASCADE,
  reference_id UUID NOT NULL REFERENCES public.references(id) ON DELETE RESTRICT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
  PRIMARY KEY (article_id, reference_id)
);

CREATE TABLE IF NOT EXISTS public.case_study_references (
  case_study_id UUID NOT NULL REFERENCES public.case_studies(id) ON DELETE CASCADE,
  reference_id UUID NOT NULL REFERENCES public.references(id) ON DELETE RESTRICT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
  PRIMARY KEY (case_study_id, reference_id)
);

-- -----------------------------------------------------------------------------
-- 20261113000400_create_statistics_and_media_tables.sql
-- -----------------------------------------------------------------------------
-- Migration 0004: Environmental statistics and Storage media asset metadata tables


CREATE TABLE IF NOT EXISTS public.statistics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pillar_id UUID NOT NULL REFERENCES public.pillars(id) ON DELETE RESTRICT,
  reference_id UUID NOT NULL REFERENCES public.references(id) ON DELETE RESTRICT,
  indicator TEXT NOT NULL CHECK (char_length(btrim(indicator)) > 0),
  value NUMERIC NOT NULL,
  unit TEXT NOT NULL CHECK (char_length(btrim(unit)) > 0),
  geographic_scope TEXT NOT NULL CHECK (char_length(btrim(geographic_scope)) > 0),
  measurement_year INTEGER NOT NULL CHECK (measurement_year BETWEEN 1800 AND 2150),
  publication_date DATE NULL,
  methodology TEXT NULL,
  limitations TEXT NULL,
  data_type TEXT NOT NULL CHECK (
    data_type IN ('historical_observation', 'current_estimate', 'projection')
  ),
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

CREATE TABLE IF NOT EXISTS public.media_assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  file_name TEXT NOT NULL CHECK (char_length(btrim(file_name)) > 0),
  storage_bucket TEXT NOT NULL CHECK (
    storage_bucket IN ('article-images', 'case-study-images', 'pillar-images', 'site-assets')
  ),
  storage_path TEXT NOT NULL CHECK (char_length(btrim(storage_path)) > 0),
  mime_type TEXT NOT NULL CHECK (mime_type ~ '^[a-z0-9.+-]+/[a-z0-9.+-]+$'),
  file_size BIGINT NOT NULL CHECK (file_size > 0),
  alt_text TEXT NULL,
  uploaded_by UUID NULL REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
  CONSTRAINT media_assets_bucket_path_unique UNIQUE (storage_bucket, storage_path)
);

-- -----------------------------------------------------------------------------
-- 20261113000500_create_contact_and_settings_tables.sql
-- -----------------------------------------------------------------------------
-- Migration 0005: Public contact submissions and private site settings tables


CREATE TABLE IF NOT EXISTS public.contact_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL CHECK (char_length(btrim(name)) BETWEEN 2 AND 120),
  email TEXT NOT NULL CHECK (
    char_length(btrim(email)) BETWEEN 5 AND 254
    AND email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'
  ),
  subject TEXT NOT NULL CHECK (char_length(btrim(subject)) BETWEEN 3 AND 200),
  message TEXT NOT NULL CHECK (char_length(btrim(message)) BETWEEN 10 AND 5000),
  status TEXT NOT NULL DEFAULT 'unread' CHECK (
    status IN ('unread', 'read', 'replied', 'archived')
  ),
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

CREATE TABLE IF NOT EXISTS public.site_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  setting_key TEXT NOT NULL UNIQUE CHECK (setting_key ~ '^[a-z0-9]+(?:_[a-z0-9]+)*$'),
  setting_value JSONB NOT NULL DEFAULT '{}'::jsonb,
  description TEXT NULL,
  updated_by UUID NULL REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

-- -----------------------------------------------------------------------------
-- 20261113000600_create_indexes_and_triggers.sql
-- -----------------------------------------------------------------------------
-- Migration 0006: Purposeful query indexes and updated_at triggers


-- Query-aligned indexes (unique constraints on slugs/keys/bucket+path already create indexes)
CREATE INDEX IF NOT EXISTS idx_topics_pillar_active_order
  ON public.topics (pillar_id, is_active, display_order);

CREATE INDEX IF NOT EXISTS idx_articles_status_published_at
  ON public.articles (status, published_at DESC);

CREATE INDEX IF NOT EXISTS idx_articles_pillar_topic_status
  ON public.articles (pillar_id, topic_id, status);

CREATE INDEX IF NOT EXISTS idx_articles_featured_published
  ON public.articles (featured, published_at DESC)
  WHERE status = 'published';

CREATE INDEX IF NOT EXISTS idx_articles_author_id
  ON public.articles (author_id);

CREATE INDEX IF NOT EXISTS idx_case_studies_status_published_at
  ON public.case_studies (status, published_at DESC);

CREATE INDEX IF NOT EXISTS idx_case_studies_pillar_status
  ON public.case_studies (pillar_id, status);

CREATE INDEX IF NOT EXISTS idx_references_organization
  ON public.references (organization);

CREATE INDEX IF NOT EXISTS idx_article_references_reference_id
  ON public.article_references (reference_id);

CREATE INDEX IF NOT EXISTS idx_case_study_references_reference_id
  ON public.case_study_references (reference_id);

CREATE INDEX IF NOT EXISTS idx_statistics_pillar_year_status
  ON public.statistics (pillar_id, measurement_year DESC, status);

CREATE INDEX IF NOT EXISTS idx_statistics_reference_id
  ON public.statistics (reference_id);

CREATE INDEX IF NOT EXISTS idx_contact_submissions_status_created_at
  ON public.contact_submissions (status, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_media_assets_uploaded_by
  ON public.media_assets (uploaded_by);

-- Attach updated_at triggers to all mutable tables with updated_at
DROP TRIGGER IF EXISTS trg_profiles_set_updated_at ON public.profiles;
CREATE TRIGGER trg_profiles_set_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_pillars_set_updated_at ON public.pillars;
CREATE TRIGGER trg_pillars_set_updated_at
  BEFORE UPDATE ON public.pillars
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_topics_set_updated_at ON public.topics;
CREATE TRIGGER trg_topics_set_updated_at
  BEFORE UPDATE ON public.topics
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_articles_set_updated_at ON public.articles;
CREATE TRIGGER trg_articles_set_updated_at
  BEFORE UPDATE ON public.articles
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_case_studies_set_updated_at ON public.case_studies;
CREATE TRIGGER trg_case_studies_set_updated_at
  BEFORE UPDATE ON public.case_studies
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_references_set_updated_at ON public.references;
CREATE TRIGGER trg_references_set_updated_at
  BEFORE UPDATE ON public.references
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_statistics_set_updated_at ON public.statistics;
CREATE TRIGGER trg_statistics_set_updated_at
  BEFORE UPDATE ON public.statistics
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_contact_submissions_set_updated_at ON public.contact_submissions;
CREATE TRIGGER trg_contact_submissions_set_updated_at
  BEFORE UPDATE ON public.contact_submissions
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_site_settings_set_updated_at ON public.site_settings;
CREATE TRIGGER trg_site_settings_set_updated_at
  BEFORE UPDATE ON public.site_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

-- -----------------------------------------------------------------------------
-- 20261113000700_enable_rls_and_create_policies.sql
-- -----------------------------------------------------------------------------
-- Migration 0007: Enable Row Level Security (RLS) and enforce least-privilege access policies


ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pillars ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.case_studies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.references ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.article_references ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.case_study_references ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.statistics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- 1. profiles (no public read, no self-registration, no self-escalation)
DROP POLICY IF EXISTS "profiles_select_self_or_admin" ON public.profiles;
CREATE POLICY "profiles_select_self_or_admin"
  ON public.profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id OR public.is_admin());

DROP POLICY IF EXISTS "profiles_update_admin_only" ON public.profiles;
CREATE POLICY "profiles_update_admin_only"
  ON public.profiles
  FOR UPDATE
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin() AND role = 'admin');

-- 2. pillars
DROP POLICY IF EXISTS "pillars_public_select_active" ON public.pillars;
CREATE POLICY "pillars_public_select_active"
  ON public.pillars
  FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

DROP POLICY IF EXISTS "pillars_admin_select_all" ON public.pillars;
CREATE POLICY "pillars_admin_select_all"
  ON public.pillars
  FOR SELECT
  TO authenticated
  USING (public.is_admin());

DROP POLICY IF EXISTS "pillars_admin_insert" ON public.pillars;
CREATE POLICY "pillars_admin_insert"
  ON public.pillars
  FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "pillars_admin_update" ON public.pillars;
CREATE POLICY "pillars_admin_update"
  ON public.pillars
  FOR UPDATE
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "pillars_admin_delete" ON public.pillars;
CREATE POLICY "pillars_admin_delete"
  ON public.pillars
  FOR DELETE
  TO authenticated
  USING (public.is_admin());

-- 3. topics
DROP POLICY IF EXISTS "topics_public_select_active" ON public.topics;
CREATE POLICY "topics_public_select_active"
  ON public.topics
  FOR SELECT
  TO anon, authenticated
  USING (
    is_active = true
    AND EXISTS (
      SELECT 1
      FROM public.pillars AS p
      WHERE p.id = topics.pillar_id
        AND p.is_active = true
    )
  );

DROP POLICY IF EXISTS "topics_admin_select_all" ON public.topics;
CREATE POLICY "topics_admin_select_all"
  ON public.topics
  FOR SELECT
  TO authenticated
  USING (public.is_admin());

DROP POLICY IF EXISTS "topics_admin_insert" ON public.topics;
CREATE POLICY "topics_admin_insert"
  ON public.topics
  FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "topics_admin_update" ON public.topics;
CREATE POLICY "topics_admin_update"
  ON public.topics
  FOR UPDATE
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "topics_admin_delete" ON public.topics;
CREATE POLICY "topics_admin_delete"
  ON public.topics
  FOR DELETE
  TO authenticated
  USING (public.is_admin());

-- 4. articles
DROP POLICY IF EXISTS "articles_public_select_published" ON public.articles;
CREATE POLICY "articles_public_select_published"
  ON public.articles
  FOR SELECT
  TO anon, authenticated
  USING (
    status = 'published'
    AND published_at IS NOT NULL
    AND published_at <= timezone('utc', now())
  );

DROP POLICY IF EXISTS "articles_admin_select_all" ON public.articles;
CREATE POLICY "articles_admin_select_all"
  ON public.articles
  FOR SELECT
  TO authenticated
  USING (public.is_admin());

DROP POLICY IF EXISTS "articles_admin_insert" ON public.articles;
CREATE POLICY "articles_admin_insert"
  ON public.articles
  FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "articles_admin_update" ON public.articles;
CREATE POLICY "articles_admin_update"
  ON public.articles
  FOR UPDATE
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "articles_admin_delete" ON public.articles;
CREATE POLICY "articles_admin_delete"
  ON public.articles
  FOR DELETE
  TO authenticated
  USING (public.is_admin());

-- 5. case_studies
DROP POLICY IF EXISTS "case_studies_public_select_published" ON public.case_studies;
CREATE POLICY "case_studies_public_select_published"
  ON public.case_studies
  FOR SELECT
  TO anon, authenticated
  USING (
    status = 'published'
    AND published_at IS NOT NULL
    AND published_at <= timezone('utc', now())
  );

DROP POLICY IF EXISTS "case_studies_admin_select_all" ON public.case_studies;
CREATE POLICY "case_studies_admin_select_all"
  ON public.case_studies
  FOR SELECT
  TO authenticated
  USING (public.is_admin());

DROP POLICY IF EXISTS "case_studies_admin_insert" ON public.case_studies;
CREATE POLICY "case_studies_admin_insert"
  ON public.case_studies
  FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "case_studies_admin_update" ON public.case_studies;
CREATE POLICY "case_studies_admin_update"
  ON public.case_studies
  FOR UPDATE
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "case_studies_admin_delete" ON public.case_studies;
CREATE POLICY "case_studies_admin_delete"
  ON public.case_studies
  FOR DELETE
  TO authenticated
  USING (public.is_admin());

-- 6. references (public may only read references cited by published content)
DROP POLICY IF EXISTS "references_public_select_published_citations" ON public.references;
CREATE POLICY "references_public_select_published_citations"
  ON public.references
  FOR SELECT
  TO anon, authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.article_references AS ar
      JOIN public.articles AS a ON a.id = ar.article_id
      WHERE ar.reference_id = "references".id
        AND a.status = 'published'
        AND a.published_at IS NOT NULL
        AND a.published_at <= timezone('utc', now())
    )
    OR EXISTS (
      SELECT 1
      FROM public.case_study_references AS csr
      JOIN public.case_studies AS cs ON cs.id = csr.case_study_id
      WHERE csr.reference_id = "references".id
        AND cs.status = 'published'
        AND cs.published_at IS NOT NULL
        AND cs.published_at <= timezone('utc', now())
    )
    OR EXISTS (
      SELECT 1
      FROM public.statistics AS s
      WHERE s.reference_id = "references".id
        AND s.status = 'published'
    )
  );

DROP POLICY IF EXISTS "references_admin_select_all" ON public.references;
CREATE POLICY "references_admin_select_all"
  ON public.references
  FOR SELECT
  TO authenticated
  USING (public.is_admin());

DROP POLICY IF EXISTS "references_admin_insert" ON public.references;
CREATE POLICY "references_admin_insert"
  ON public.references
  FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "references_admin_update" ON public.references;
CREATE POLICY "references_admin_update"
  ON public.references
  FOR UPDATE
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "references_admin_delete" ON public.references;
CREATE POLICY "references_admin_delete"
  ON public.references
  FOR DELETE
  TO authenticated
  USING (public.is_admin());

-- 7. article_references
DROP POLICY IF EXISTS "article_references_public_select_published" ON public.article_references;
CREATE POLICY "article_references_public_select_published"
  ON public.article_references
  FOR SELECT
  TO anon, authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.articles AS a
      WHERE a.id = article_references.article_id
        AND a.status = 'published'
        AND a.published_at IS NOT NULL
        AND a.published_at <= timezone('utc', now())
    )
  );

DROP POLICY IF EXISTS "article_references_admin_select_all" ON public.article_references;
CREATE POLICY "article_references_admin_select_all"
  ON public.article_references
  FOR SELECT
  TO authenticated
  USING (public.is_admin());

DROP POLICY IF EXISTS "article_references_admin_insert" ON public.article_references;
CREATE POLICY "article_references_admin_insert"
  ON public.article_references
  FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "article_references_admin_delete" ON public.article_references;
CREATE POLICY "article_references_admin_delete"
  ON public.article_references
  FOR DELETE
  TO authenticated
  USING (public.is_admin());

-- 8. case_study_references
DROP POLICY IF EXISTS "case_study_references_public_select_published" ON public.case_study_references;
CREATE POLICY "case_study_references_public_select_published"
  ON public.case_study_references
  FOR SELECT
  TO anon, authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.case_studies AS cs
      WHERE cs.id = case_study_references.case_study_id
        AND cs.status = 'published'
        AND cs.published_at IS NOT NULL
        AND cs.published_at <= timezone('utc', now())
    )
  );

DROP POLICY IF EXISTS "case_study_references_admin_select_all" ON public.case_study_references;
CREATE POLICY "case_study_references_admin_select_all"
  ON public.case_study_references
  FOR SELECT
  TO authenticated
  USING (public.is_admin());

DROP POLICY IF EXISTS "case_study_references_admin_insert" ON public.case_study_references;
CREATE POLICY "case_study_references_admin_insert"
  ON public.case_study_references
  FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "case_study_references_admin_delete" ON public.case_study_references;
CREATE POLICY "case_study_references_admin_delete"
  ON public.case_study_references
  FOR DELETE
  TO authenticated
  USING (public.is_admin());

-- 9. statistics
DROP POLICY IF EXISTS "statistics_public_select_published" ON public.statistics;
CREATE POLICY "statistics_public_select_published"
  ON public.statistics
  FOR SELECT
  TO anon, authenticated
  USING (status = 'published');

DROP POLICY IF EXISTS "statistics_admin_select_all" ON public.statistics;
CREATE POLICY "statistics_admin_select_all"
  ON public.statistics
  FOR SELECT
  TO authenticated
  USING (public.is_admin());

DROP POLICY IF EXISTS "statistics_admin_insert" ON public.statistics;
CREATE POLICY "statistics_admin_insert"
  ON public.statistics
  FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "statistics_admin_update" ON public.statistics;
CREATE POLICY "statistics_admin_update"
  ON public.statistics
  FOR UPDATE
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "statistics_admin_delete" ON public.statistics;
CREATE POLICY "statistics_admin_delete"
  ON public.statistics
  FOR DELETE
  TO authenticated
  USING (public.is_admin());

-- 10. media_assets (admin-managed metadata; avoids exposing uploader UUIDs to anon)
DROP POLICY IF EXISTS "media_assets_admin_select" ON public.media_assets;
CREATE POLICY "media_assets_admin_select"
  ON public.media_assets
  FOR SELECT
  TO authenticated
  USING (public.is_admin());

DROP POLICY IF EXISTS "media_assets_admin_insert" ON public.media_assets;
CREATE POLICY "media_assets_admin_insert"
  ON public.media_assets
  FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "media_assets_admin_update" ON public.media_assets;
CREATE POLICY "media_assets_admin_update"
  ON public.media_assets
  FOR UPDATE
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "media_assets_admin_delete" ON public.media_assets;
CREATE POLICY "media_assets_admin_delete"
  ON public.media_assets
  FOR DELETE
  TO authenticated
  USING (public.is_admin());

-- 11. contact_submissions (public insert-only with unread status; admin read/manage)
DROP POLICY IF EXISTS "contact_submissions_public_insert_unread" ON public.contact_submissions;
CREATE POLICY "contact_submissions_public_insert_unread"
  ON public.contact_submissions
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (status = 'unread');

DROP POLICY IF EXISTS "contact_submissions_admin_select" ON public.contact_submissions;
CREATE POLICY "contact_submissions_admin_select"
  ON public.contact_submissions
  FOR SELECT
  TO authenticated
  USING (public.is_admin());

DROP POLICY IF EXISTS "contact_submissions_admin_update" ON public.contact_submissions;
CREATE POLICY "contact_submissions_admin_update"
  ON public.contact_submissions
  FOR UPDATE
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "contact_submissions_admin_delete" ON public.contact_submissions;
CREATE POLICY "contact_submissions_admin_delete"
  ON public.contact_submissions
  FOR DELETE
  TO authenticated
  USING (public.is_admin());

-- 12. site_settings (admin-only read and write)
DROP POLICY IF EXISTS "site_settings_admin_select" ON public.site_settings;
CREATE POLICY "site_settings_admin_select"
  ON public.site_settings
  FOR SELECT
  TO authenticated
  USING (public.is_admin());

DROP POLICY IF EXISTS "site_settings_admin_insert" ON public.site_settings;
CREATE POLICY "site_settings_admin_insert"
  ON public.site_settings
  FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "site_settings_admin_update" ON public.site_settings;
CREATE POLICY "site_settings_admin_update"
  ON public.site_settings
  FOR UPDATE
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "site_settings_admin_delete" ON public.site_settings;
CREATE POLICY "site_settings_admin_delete"
  ON public.site_settings
  FOR DELETE
  TO authenticated
  USING (public.is_admin());

-- -----------------------------------------------------------------------------
-- 20261113000800_configure_storage.sql
-- -----------------------------------------------------------------------------
-- Migration 0008: Configure Supabase Storage buckets and RLS policies
-- Public buckets allow unauthenticated GET/read of published image assets,
-- while INSERT, UPDATE, and DELETE are restricted strictly to authenticated admins.


INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES
  (
    'article-images',
    'article-images',
    true,
    5242880,
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/avif']
  ),
  (
    'case-study-images',
    'case-study-images',
    true,
    5242880,
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/avif']
  ),
  (
    'pillar-images',
    'pillar-images',
    true,
    5242880,
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/avif']
  ),
  (
    'site-assets',
    'site-assets',
    true,
    5242880,
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/svg+xml']
  )
ON CONFLICT (id) DO UPDATE
SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

DROP POLICY IF EXISTS "storage_public_read_editorial_buckets" ON storage.objects;
CREATE POLICY "storage_public_read_editorial_buckets"
  ON storage.objects
  FOR SELECT
  TO anon, authenticated
  USING (
    bucket_id IN ('article-images', 'case-study-images', 'pillar-images', 'site-assets')
  );

DROP POLICY IF EXISTS "storage_admin_insert_editorial_buckets" ON storage.objects;
CREATE POLICY "storage_admin_insert_editorial_buckets"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id IN ('article-images', 'case-study-images', 'pillar-images', 'site-assets')
    AND public.is_admin()
  );

DROP POLICY IF EXISTS "storage_admin_update_editorial_buckets" ON storage.objects;
CREATE POLICY "storage_admin_update_editorial_buckets"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (
    bucket_id IN ('article-images', 'case-study-images', 'pillar-images', 'site-assets')
    AND public.is_admin()
  )
  WITH CHECK (
    bucket_id IN ('article-images', 'case-study-images', 'pillar-images', 'site-assets')
    AND public.is_admin()
  );

DROP POLICY IF EXISTS "storage_admin_delete_editorial_buckets" ON storage.objects;
CREATE POLICY "storage_admin_delete_editorial_buckets"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (
    bucket_id IN ('article-images', 'case-study-images', 'pillar-images', 'site-assets')
    AND public.is_admin()
  );

-- -----------------------------------------------------------------------------
-- INITIAL SEED DATA (Pillars, Topics, References, Statistics, Articles, Case Studies)
-- -----------------------------------------------------------------------------
-- =============================================================================
-- Seed Data for THE LIVING EARTH
-- Seeds the 5 environmental pillars, 5 topics, 3 verified scientific references,
-- 3 verified environmental statistics, 6 published articles, 3 published case
-- studies, reference join records, and default site settings.
-- Fully idempotent (safe to run multiple times).
-- =============================================================================


-- 1. PILLARS (5 Core Environmental Domains)
INSERT INTO public.pillars (id, name, slug, description, cover_image_path, display_order, is_active)
VALUES
  (
    '00000000-0000-4000-8000-000000000001',
    'Climate & Atmosphere',
    'climate-atmosphere',
    'Understanding our changing climate—from rising global temperatures and atmospheric carbon to extreme weather and cryosphere shifts.',
    '/images/pillar-climate.jpg',
    1,
    true
  ),
  (
    '00000000-0000-4000-8000-000000000002',
    'Oceans & Water',
    'oceans-water',
    'Marine ecosystems, coral reefs, ocean heat absorption, carbonate chemistry, and global freshwater watershed security.',
    '/images/sea-turtle.jpg',
    2,
    true
  ),
  (
    '00000000-0000-4000-8000-000000000003',
    'Forests & Biodiversity',
    'forests-biodiversity',
    'Primary rainforests, boreal carbon sinks, wildlife corridors, and the living web of terrestrial biodiversity.',
    '/images/pillar-forests.jpg',
    3,
    true
  ),
  (
    '00000000-0000-4000-8000-000000000004',
    'Pollution & Human Impact',
    'pollution-human-impact',
    'Air quality, industrial emissions, plastic polymers, and human extraction footprints across land and water.',
    '/images/pillar-pollution.jpg',
    4,
    true
  ),
  (
    '00000000-0000-4000-8000-000000000005',
    'Solutions & Restoration',
    'solutions-restoration',
    'Renewable energy transitions, mangrove and forest restoration, circular material systems, and community stewardship.',
    '/images/pillar-solutions.jpg',
    5,
    true
  )
ON CONFLICT (slug) DO UPDATE
SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  cover_image_path = EXCLUDED.cover_image_path,
  display_order = EXCLUDED.display_order,
  is_active = EXCLUDED.is_active;

-- 2. TOPICS
INSERT INTO public.topics (id, pillar_id, name, slug, description, display_order, is_active)
VALUES
  (
    '00000000-0000-4000-8001-000000000001',
    '00000000-0000-4000-8000-000000000001',
    'Rising Temperatures',
    'rising-temperatures',
    'Global surface warming anomalies and regional heatwave intensification.',
    1,
    true
  ),
  (
    '00000000-0000-4000-8001-000000000002',
    '00000000-0000-4000-8000-000000000001',
    'Extreme Weather',
    'extreme-weather',
    'Shifts in monsoon reliability, severe droughts, and cyclonic rainfall.',
    2,
    true
  ),
  (
    '00000000-0000-4000-8001-000000000003',
    '00000000-0000-4000-8000-000000000001',
    'Sea Level Rise',
    'sea-level-rise',
    'Thermal ocean expansion and cryosphere ice-sheet mass loss.',
    3,
    true
  ),
  (
    '00000000-0000-4000-8001-000000000004',
    '00000000-0000-4000-8000-000000000002',
    'Coral Reefs & Blue Carbon',
    'coral-reefs-blue-carbon',
    'Tropical reef thermal resilience, seagrass meadows, and mangrove nurseries.',
    1,
    true
  ),
  (
    '00000000-0000-4000-8001-000000000005',
    '00000000-0000-4000-8000-000000000003',
    'Primary Forest Conservation',
    'primary-forest-conservation',
    'Old-growth canopy retention, biodiversity corridors, and watershed protection.',
    1,
    true
  )
ON CONFLICT (pillar_id, slug) DO UPDATE
SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  display_order = EXCLUDED.display_order,
  is_active = EXCLUDED.is_active;

-- 3. VERIFIED SCIENTIFIC REFERENCES
INSERT INTO public.references (
  id,
  title,
  organization,
  source_type,
  author,
  publication_date,
  source_url,
  notes
)
VALUES
  (
    '00000000-0000-4000-8002-000000000001',
    'Climate Change 2023: Synthesis Report (Sixth Assessment Report)',
    'Intergovernmental Panel on Climate Change (IPCC)',
    'international_organization',
    'IPCC Core Writing Team',
    '2023-03-20',
    'https://www.ipcc.ch/report/ar6/syr/',
    'Primary reference for global mean surface temperature rise (~1.1-1.2°C above 1850-1900).'
  ),
  (
    '00000000-0000-4000-8002-000000000002',
    'Ocean Acidification: Saturation State & Surface pH Observations',
    'National Oceanic and Atmospheric Administration (NOAA PMEL)',
    'government_data',
    'NOAA Pacific Marine Environmental Laboratory',
    '2023-06-15',
    'https://www.pmel.noaa.gov/co2/story/What+is+Ocean+Acidification%3F',
    'Verified marine carbonate chemistry indicator (~30% increase in surface ocean acidity).'
  ),
  (
    '00000000-0000-4000-8002-000000000003',
    'Global Forest Resources Assessment (FRA): Forest Extent and Changes',
    'Food and Agriculture Organization of the United Nations (FAO)',
    'international_organization',
    'FAO Forestry Division',
    '2022-05-02',
    'https://www.fao.org/forest-resources-assessment/en/',
    'Global terrestrial forest cover benchmark (~31% of global land area).'
  )
ON CONFLICT (title, source_url) DO UPDATE
SET
  organization = EXCLUDED.organization,
  source_type = EXCLUDED.source_type,
  author = EXCLUDED.author,
  publication_date = EXCLUDED.publication_date,
  notes = EXCLUDED.notes;

-- 4. VERIFIED ENVIRONMENTAL STATISTICS
INSERT INTO public.statistics (
  id,
  pillar_id,
  reference_id,
  indicator,
  value,
  unit,
  geographic_scope,
  measurement_year,
  publication_date,
  methodology,
  limitations,
  data_type,
  status
)
VALUES
  (
    '00000000-0000-4000-8003-000000000001',
    '00000000-0000-4000-8000-000000000001',
    '00000000-0000-4000-8002-000000000001',
    'Global Temp Rise',
    1.2,
    '°C',
    'Global Mean Surface',
    2023,
    '2023-03-20',
    'Observed human-induced warming of global mean surface temperature relative to the 1850-1900 pre-industrial baseline.',
    'Decadal averaging across land and marine surface temperature stations.',
    'historical_observation',
    'published'
  ),
  (
    '00000000-0000-4000-8003-000000000002',
    '00000000-0000-4000-8000-000000000002',
    '00000000-0000-4000-8002-000000000002',
    'Ocean Acidification',
    30,
    '%',
    'Global Surface Oceans',
    2023,
    '2023-06-15',
    'Approximate percentage increase in surface ocean acidity (hydrogen ion concentration) since the industrial era.',
    'Calculated from ~0.1 pH unit decline across open-ocean time-series stations.',
    'historical_observation',
    'published'
  ),
  (
    '00000000-0000-4000-8003-000000000003',
    '00000000-0000-4000-8000-000000000003',
    '00000000-0000-4000-8002-000000000003',
    'Global Forest Cover',
    31,
    '%',
    'Global Land Area',
    2022,
    '2022-05-02',
    'Share of Earth total land surface covered by forest ecosystems (~4.06 billion hectares).',
    'Includes primary, naturally regenerating, and planted forest area.',
    'current_estimate',
    'published'
  )
ON CONFLICT (id) DO UPDATE
SET
  indicator = EXCLUDED.indicator,
  value = EXCLUDED.value,
  unit = EXCLUDED.unit,
  geographic_scope = EXCLUDED.geographic_scope,
  measurement_year = EXCLUDED.measurement_year,
  methodology = EXCLUDED.methodology,
  limitations = EXCLUDED.limitations,
  data_type = EXCLUDED.data_type,
  status = EXCLUDED.status;

-- 5. PUBLISHED ARTICLES
INSERT INTO public.articles (
  id,
  pillar_id,
  topic_id,
  title,
  slug,
  excerpt,
  content,
  cover_image_path,
  status,
  featured,
  seo_title,
  seo_description,
  published_at
)
VALUES
  (
    '00000000-0000-4000-8004-000000000001',
    '00000000-0000-4000-8000-000000000001',
    '00000000-0000-4000-8001-000000000001',
    'The Urgent Need for Climate Action',
    'the-urgent-need-for-climate-action',
    'How rising atmospheric greenhouse concentrations are reshaping global weather patterns—and why every fraction of a degree matters for living ecosystems.',
    E'## Understanding the Pace of Planetary Warming\n\nEarth''s climate system is governed by a delicate radiative balance. As concentrations of carbon dioxide, methane, and nitrous oxide continue to accumulate in the atmosphere, outgoing infrared energy is trapped within the lower troposphere, raising global mean temperatures to roughly **1.2°C above pre-industrial baselines**.\n\n### Key Ecological Pressures\n\n- **Shifting Hydrological Regimes:** Warmer air holds approximately 7% more water vapor per degree Celsius, intensifying downpours in wet regions while accelerating soil moisture evaporation across semi-arid agricultural belts.\n- **Cryosphere Retreat:** Mountain glaciers in the Alps, Andes, and Himalayas are losing mass at historic rates.\n- **Compound Extremes:** Heatwaves increasingly coincide with prolonged drought, stressing primary forest canopies.\n\n> "Every increment of global warming avoided reduces the frequency and intensity of extreme heat, heavy precipitation, and ecological disruption." — IPCC Sixth Assessment Synthesis\n\n### Pathways Forward\n\nStabilizing global temperatures requires rapid structural decarbonization of energy, transport, and industry alongside large-scale protection and restoration of natural carbon sinks.',
    '/images/pillar-forests.jpg',
    'published',
    true,
    'The Urgent Need for Climate Action | THE LIVING EARTH',
    'Explore the scientific evidence behind global warming and the systemic pathways required to stabilize Earth''s climate.',
    '2025-04-24T08:00:00Z'
  ),
  (
    '00000000-0000-4000-8004-000000000002',
    '00000000-0000-4000-8000-000000000001',
    '00000000-0000-4000-8001-000000000001',
    'Climate Change Accelerates Global Warming',
    'climate-change-accelerates-global-warming',
    'Satellite observations and ocean buoys confirm how Earth''s energy imbalance drives record surface temperatures and shifting climate zones.',
    E'## Tracking Planetary Energy Imbalance\n\nModern satellite radiometers and autonomous Argo ocean floats provide an unprecedented view of Earth''s climate system. Over 90% of excess heat trapped by greenhouse gases is absorbed by the world''s oceans, while the remainder warms the atmosphere, land surface, and cryosphere.\n\n### What the Observations Show\n\n1. **Multi-Decadal Warming Trend:** Each of the last four decades has been successively warmer at Earth''s surface than any preceding decade since 1850.\n2. **Amplified Polar Warming:** Arctic surface temperatures are rising more than twice as fast as the global average due to sea-ice albedo feedbacks.\n3. ** Actionable Mitigation:** Rapid deployment of solar, wind, grid storage, and methane leak abatement can slow the rate of near-term warming.',
    '/images/earth-globe.jpg',
    'published',
    true,
    NULL,
    NULL,
    '2025-04-20T08:00:00Z'
  ),
  (
    '00000000-0000-4000-8004-000000000003',
    '00000000-0000-4000-8000-000000000002',
    '00000000-0000-4000-8001-000000000004',
    'Melting Glaciers Threaten Water Supply',
    'melting-glaciers-threaten-water-supply',
    'Retreating mountain glaciers alter seasonal river flows, challenging freshwater security for downstream ecosystems and communities.',
    E'## Mountain Water Towers Under Thermal Stress\n\nHigh-altitude glaciers store winter precipitation as snow and ice, releasing cool meltwater during dry summer months when rivers, irrigated farmlands, and freshwater ecosystems need it most.\n\n### Observable Changes Across Alpine Basins\n\nField measurements across major mountain ranges document accelerating glacier terminus retreat and thinning ice thickness. Over multi-decade horizons, diminished ice volume leads to reduced dry-season baseflow.\n\n### Protecting Downstream Watersheds\n\n- **High-Altitude Monitoring:** Expanding automated meteorological and mass-balance stations.\n- **Wetland Conservation:** Preserving high-mountain wetlands and forested headwaters that sponge and slowly release rainfall.\n- **Water-Use Efficiency:** Upgrading municipal and agricultural irrigation networks in snowmelt-dependent valleys.',
    '/images/pillar-climate.jpg',
    'published',
    true,
    NULL,
    NULL,
    '2025-04-16T08:00:00Z'
  ),
  (
    '00000000-0000-4000-8004-000000000004',
    '00000000-0000-4000-8000-000000000003',
    '00000000-0000-4000-8001-000000000005',
    'Protecting Biodiversity in Tropical Forests',
    'protecting-biodiversity-in-tropical-forests',
    'Why safeguarding intact primary rainforest canopies and wildlife corridors is essential for planetary carbon stability and species survival.',
    E'## Why Intact Tropical Canopies Are Irreplaceable\n\nTropical rainforests harbor more than half of Earth''s terrestrial species while cycling vast quantities of moisture back into the atmosphere through evapotranspiration.\n\n### Beyond Simple Tree Counts\n\nEcological research consistently shows that intact primary forests store significantly more stable carbon and support far richer trophic webs than young monoculture plantations.\n\n### Community-Led Forest Stewardship\n\nDurable conservation pairs satellite deforestation monitoring with legal recognition of Indigenous and local community territories, wildlife corridor reconnection, and native-species ecological restoration.',
    '/images/hero-planet.jpg',
    'published',
    true,
    NULL,
    NULL,
    '2025-04-12T08:00:00Z'
  ),
  (
    '00000000-0000-4000-8004-000000000005',
    '00000000-0000-4000-8000-000000000005',
    NULL,
    'Restoring Coastal Mangroves for Climate Resilience',
    'restoring-coastal-mangroves-for-resilience',
    'Community-led mangrove rehabilitation across Indonesian coastlines buffers storm surge, revives fisheries, and locks carbon in coastal sediments.',
    E'## Blue Carbon Along Tropical Coastlines\n\nMangrove ecosystems thrive at the boundary between land and sea. Their dense root systems slow incoming tidal currents, trap organic sediment, and protect coastal villages from erosion and extreme storm surge.\n\n### Ecological Restoration vs. Monoculture Planting\n\nSuccessful projects restore natural tidal hydrology first—reopening blocked estuarine channels so buoyant native mangrove propagules can establish across their natural intertidal zones.',
    '/images/mangrove-coastal.jpg',
    'published',
    false,
    NULL,
    NULL,
    '2025-04-08T08:00:00Z'
  ),
  (
    '00000000-0000-4000-8004-000000000006',
    '00000000-0000-4000-8000-000000000004',
    NULL,
    'Clean Air & The Global Renewable Transition',
    'clean-air-and-the-global-renewable-transition',
    'Phasing out coal and industrial combustion immediately reduces urban fine particulate pollution while bending the curve on greenhouse emissions.',
    E'## Co-Benefits of Clean Electrification\n\nTransitioning power grids and urban transport away from fossil fuel combustion delivers immediate public-health benefits alongside long-term climate stabilization by cutting fine particulate matter (PM2.5) and nitrogen oxides.',
    '/images/solar-wind.jpg',
    'published',
    false,
    NULL,
    NULL,
    '2025-04-02T08:00:00Z'
  )
ON CONFLICT (slug) DO UPDATE
SET
  title = EXCLUDED.title,
  excerpt = EXCLUDED.excerpt,
  content = EXCLUDED.content,
  cover_image_path = EXCLUDED.cover_image_path,
  status = EXCLUDED.status,
  featured = EXCLUDED.featured,
  published_at = EXCLUDED.published_at;

-- 6. PUBLISHED CASE STUDIES
INSERT INTO public.case_studies (
  id,
  pillar_id,
  title,
  slug,
  summary,
  content,
  country,
  region,
  latitude,
  longitude,
  cover_image_path,
  organization,
  start_date,
  status,
  published_at
)
VALUES
  (
    '00000000-0000-4000-8005-000000000001',
    '00000000-0000-4000-8000-000000000002',
    'Mangrove Restoration in Coastal Indonesia',
    'mangrove-restoration-in-coastal-indonesia',
    'Nature-based hydrological rehabilitation and community stewardship rebuilding resilient blue-carbon coastlines across Indonesia.',
    E'## Overview\n\nIndonesia holds the largest extent of mangrove ecosystems on Earth, spanning coastal estuaries across Java, Sumatra, Kalimantan, Sulawesi, and Papua. Mangrove forests are among the planet''s most productive **blue carbon** ecosystems, storing up to four times more carbon per hectare in their waterlogged soils than terrestrial tropical forests.\n\n## The Solution\n\nWorking alongside coastal villages and ecological researchers, restoration teams shifted toward **hydrological mangrove rehabilitation**:\n\n- **Restoring Natural Tidal Flow:** Re-opening blocked estuarine channels and constructing permeable brushwood sediment traps.\n- **Multi-Species Native Zoning:** Matching *Rhizophora*, *Avicennia*, and *Sonneratia* species to their natural intertidal salinity zones.\n- **Community Silvofishery Stewardship:** Integrating sustainable crab and fish cultivation within protected mangrove buffers.\n\n## Results\n\nRestored mangrove corridors across northern Java and Kalimantan have measurably dampened wave energy, stabilized accreting mudflats, and revived juvenile fish and crustacean populations.',
    'Indonesia',
    'Coastal Java & Kalimantan',
    -6.872200,
    110.508900,
    '/images/mangrove-coastal.jpg',
    'Coastal Blue Carbon & Community Restoration Network',
    '2021-03-01',
    'published',
    '2025-04-18T00:00:00Z'
  ),
  (
    '00000000-0000-4000-8005-000000000002',
    '00000000-0000-4000-8000-000000000001',
    'Alpine Glacier & Headwater Conservation',
    'alpine-glacier-headwater-conservation',
    'High-altitude cryosphere tracking and watershed adaptation protecting downstream freshwater supply.',
    E'## Overview\n\nAlpine glaciers regulate seasonal river discharge across central Europe. High-resolution mass-balance monitoring paired with headwater wetland conservation helps downstream municipalities adapt to shifting snowmelt timing.',
    'Switzerland',
    'Central Alps',
    46.547500,
    8.029400,
    '/images/pillar-climate.jpg',
    'Alpine Cryosphere & Watershed Observatory',
    '2020-06-01',
    'published',
    '2025-04-10T00:00:00Z'
  ),
  (
    '00000000-0000-4000-8005-000000000003',
    '00000000-0000-4000-8000-000000000003',
    'Tropical Peatland & Canopy Reconnection',
    'tropical-peatland-canopy-reconnection',
    'Rewetting drained peat domes and reconnecting fragmented rainforest corridors for endangered wildlife.',
    E'## Overview\n\nTropical peat-swamp forests store millennia of carbon in waterlogged organic soils. Blocking drainage canals and replanting native dipterocarp species reduces wildfire risk and restores arboreal wildlife corridors.',
    'Indonesia',
    'Central Kalimantan',
    -2.208300,
    113.916700,
    '/images/pillar-forests.jpg',
    'Borneo Peatland & Biodiversity Initiative',
    '2021-09-01',
    'published',
    '2025-04-04T00:00:00Z'
  )
ON CONFLICT (slug) DO UPDATE
SET
  title = EXCLUDED.title,
  summary = EXCLUDED.summary,
  content = EXCLUDED.content,
  country = EXCLUDED.country,
  region = EXCLUDED.region,
  cover_image_path = EXCLUDED.cover_image_path,
  organization = EXCLUDED.organization,
  status = EXCLUDED.status,
  published_at = EXCLUDED.published_at;

-- 7. ARTICLE & CASE STUDY REFERENCE LINKS
INSERT INTO public.article_references (article_id, reference_id)
VALUES
  ('00000000-0000-4000-8004-000000000001', '00000000-0000-4000-8002-000000000001'),
  ('00000000-0000-4000-8004-000000000002', '00000000-0000-4000-8002-000000000001'),
  ('00000000-0000-4000-8004-000000000003', '00000000-0000-4000-8002-000000000002'),
  ('00000000-0000-4000-8004-000000000004', '00000000-0000-4000-8002-000000000003')
ON CONFLICT (article_id, reference_id) DO NOTHING;

INSERT INTO public.case_study_references (case_study_id, reference_id)
VALUES
  ('00000000-0000-4000-8005-000000000001', '00000000-0000-4000-8002-000000000002'),
  ('00000000-0000-4000-8005-000000000002', '00000000-0000-4000-8002-000000000001'),
  ('00000000-0000-4000-8005-000000000003', '00000000-0000-4000-8002-000000000003')
ON CONFLICT (case_study_id, reference_id) DO NOTHING;

-- 8. DEFAULT SITE SETTINGS
INSERT INTO public.site_settings (setting_key, setting_value, description)
VALUES
  (
    'site_identity',
    '{"siteTitle":"THE LIVING EARTH","tagline":"A Journey Through Our Changing Planet","contactEmail":"editorial@thelivingearth.org","featuredHeroSlug":"the-urgent-need-for-climate-action"}'::jsonb,
    'Core editorial identity and contact metadata for THE LIVING EARTH.'
  )
ON CONFLICT (setting_key) DO UPDATE
SET
  setting_value = EXCLUDED.setting_value,
  description = EXCLUDED.description;
