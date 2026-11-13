-- Migration 0006: Purposeful query indexes and updated_at triggers

BEGIN;

-- Query-aligned indexes (unique constraints on slugs/keys/bucket+path already create indexes)
CREATE INDEX idx_topics_pillar_active_order
  ON public.topics (pillar_id, is_active, display_order);

CREATE INDEX idx_articles_status_published_at
  ON public.articles (status, published_at DESC);

CREATE INDEX idx_articles_pillar_topic_status
  ON public.articles (pillar_id, topic_id, status);

CREATE INDEX idx_articles_featured_published
  ON public.articles (featured, published_at DESC)
  WHERE status = 'published';

CREATE INDEX idx_articles_author_id
  ON public.articles (author_id);

CREATE INDEX idx_case_studies_status_published_at
  ON public.case_studies (status, published_at DESC);

CREATE INDEX idx_case_studies_pillar_status
  ON public.case_studies (pillar_id, status);

CREATE INDEX idx_references_organization
  ON public.references (organization);

CREATE INDEX idx_article_references_reference_id
  ON public.article_references (reference_id);

CREATE INDEX idx_case_study_references_reference_id
  ON public.case_study_references (reference_id);

CREATE INDEX idx_statistics_pillar_year_status
  ON public.statistics (pillar_id, measurement_year DESC, status);

CREATE INDEX idx_statistics_reference_id
  ON public.statistics (reference_id);

CREATE INDEX idx_contact_submissions_status_created_at
  ON public.contact_submissions (status, created_at DESC);

CREATE INDEX idx_media_assets_uploaded_by
  ON public.media_assets (uploaded_by);

-- Attach updated_at triggers to all mutable tables with updated_at
CREATE TRIGGER trg_profiles_set_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_pillars_set_updated_at
  BEFORE UPDATE ON public.pillars
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_topics_set_updated_at
  BEFORE UPDATE ON public.topics
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_articles_set_updated_at
  BEFORE UPDATE ON public.articles
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_case_studies_set_updated_at
  BEFORE UPDATE ON public.case_studies
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_references_set_updated_at
  BEFORE UPDATE ON public.references
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_statistics_set_updated_at
  BEFORE UPDATE ON public.statistics
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_contact_submissions_set_updated_at
  BEFORE UPDATE ON public.contact_submissions
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_site_settings_set_updated_at
  BEFORE UPDATE ON public.site_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

COMMIT;
