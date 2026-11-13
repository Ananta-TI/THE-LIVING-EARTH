-- Migration 0003: Scientific references and content-reference join tables

BEGIN;

CREATE TABLE public.references (
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

CREATE TABLE public.article_references (
  article_id UUID NOT NULL REFERENCES public.articles(id) ON DELETE CASCADE,
  reference_id UUID NOT NULL REFERENCES public.references(id) ON DELETE RESTRICT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
  PRIMARY KEY (article_id, reference_id)
);

CREATE TABLE public.case_study_references (
  case_study_id UUID NOT NULL REFERENCES public.case_studies(id) ON DELETE CASCADE,
  reference_id UUID NOT NULL REFERENCES public.references(id) ON DELETE RESTRICT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
  PRIMARY KEY (case_study_id, reference_id)
);

COMMIT;
