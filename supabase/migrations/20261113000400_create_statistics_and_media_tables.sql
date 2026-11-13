-- Migration 0004: Environmental statistics and Storage media asset metadata tables

BEGIN;

CREATE TABLE public.statistics (
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

CREATE TABLE public.media_assets (
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

COMMIT;
