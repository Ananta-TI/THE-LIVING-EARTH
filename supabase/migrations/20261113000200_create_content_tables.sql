-- Migration 0002: Core editorial content tables (pillars, topics, articles, case_studies)

BEGIN;

CREATE TABLE public.pillars (
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

CREATE TABLE public.topics (
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

CREATE TABLE public.articles (
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

CREATE TABLE public.case_studies (
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

COMMIT;
