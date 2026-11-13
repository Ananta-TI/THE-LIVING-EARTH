-- Migration 0007: Enable Row Level Security (RLS) and enforce least-privilege access policies

BEGIN;

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
CREATE POLICY "profiles_select_self_or_admin"
  ON public.profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id OR public.is_admin());

CREATE POLICY "profiles_update_admin_only"
  ON public.profiles
  FOR UPDATE
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin() AND role = 'admin');

-- 2. pillars
CREATE POLICY "pillars_public_select_active"
  ON public.pillars
  FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

CREATE POLICY "pillars_admin_select_all"
  ON public.pillars
  FOR SELECT
  TO authenticated
  USING (public.is_admin());

CREATE POLICY "pillars_admin_insert"
  ON public.pillars
  FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin());

CREATE POLICY "pillars_admin_update"
  ON public.pillars
  FOR UPDATE
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "pillars_admin_delete"
  ON public.pillars
  FOR DELETE
  TO authenticated
  USING (public.is_admin());

-- 3. topics
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

CREATE POLICY "topics_admin_select_all"
  ON public.topics
  FOR SELECT
  TO authenticated
  USING (public.is_admin());

CREATE POLICY "topics_admin_insert"
  ON public.topics
  FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin());

CREATE POLICY "topics_admin_update"
  ON public.topics
  FOR UPDATE
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "topics_admin_delete"
  ON public.topics
  FOR DELETE
  TO authenticated
  USING (public.is_admin());

-- 4. articles
CREATE POLICY "articles_public_select_published"
  ON public.articles
  FOR SELECT
  TO anon, authenticated
  USING (
    status = 'published'
    AND published_at IS NOT NULL
    AND published_at <= timezone('utc', now())
  );

CREATE POLICY "articles_admin_select_all"
  ON public.articles
  FOR SELECT
  TO authenticated
  USING (public.is_admin());

CREATE POLICY "articles_admin_insert"
  ON public.articles
  FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin());

CREATE POLICY "articles_admin_update"
  ON public.articles
  FOR UPDATE
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "articles_admin_delete"
  ON public.articles
  FOR DELETE
  TO authenticated
  USING (public.is_admin());

-- 5. case_studies
CREATE POLICY "case_studies_public_select_published"
  ON public.case_studies
  FOR SELECT
  TO anon, authenticated
  USING (
    status = 'published'
    AND published_at IS NOT NULL
    AND published_at <= timezone('utc', now())
  );

CREATE POLICY "case_studies_admin_select_all"
  ON public.case_studies
  FOR SELECT
  TO authenticated
  USING (public.is_admin());

CREATE POLICY "case_studies_admin_insert"
  ON public.case_studies
  FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin());

CREATE POLICY "case_studies_admin_update"
  ON public.case_studies
  FOR UPDATE
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "case_studies_admin_delete"
  ON public.case_studies
  FOR DELETE
  TO authenticated
  USING (public.is_admin());

-- 6. references (public may only read references cited by published content)
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

CREATE POLICY "references_admin_select_all"
  ON public.references
  FOR SELECT
  TO authenticated
  USING (public.is_admin());

CREATE POLICY "references_admin_insert"
  ON public.references
  FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin());

CREATE POLICY "references_admin_update"
  ON public.references
  FOR UPDATE
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "references_admin_delete"
  ON public.references
  FOR DELETE
  TO authenticated
  USING (public.is_admin());

-- 7. article_references
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

CREATE POLICY "article_references_admin_select_all"
  ON public.article_references
  FOR SELECT
  TO authenticated
  USING (public.is_admin());

CREATE POLICY "article_references_admin_insert"
  ON public.article_references
  FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin());

CREATE POLICY "article_references_admin_delete"
  ON public.article_references
  FOR DELETE
  TO authenticated
  USING (public.is_admin());

-- 8. case_study_references
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

CREATE POLICY "case_study_references_admin_select_all"
  ON public.case_study_references
  FOR SELECT
  TO authenticated
  USING (public.is_admin());

CREATE POLICY "case_study_references_admin_insert"
  ON public.case_study_references
  FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin());

CREATE POLICY "case_study_references_admin_delete"
  ON public.case_study_references
  FOR DELETE
  TO authenticated
  USING (public.is_admin());

-- 9. statistics
CREATE POLICY "statistics_public_select_published"
  ON public.statistics
  FOR SELECT
  TO anon, authenticated
  USING (status = 'published');

CREATE POLICY "statistics_admin_select_all"
  ON public.statistics
  FOR SELECT
  TO authenticated
  USING (public.is_admin());

CREATE POLICY "statistics_admin_insert"
  ON public.statistics
  FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin());

CREATE POLICY "statistics_admin_update"
  ON public.statistics
  FOR UPDATE
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "statistics_admin_delete"
  ON public.statistics
  FOR DELETE
  TO authenticated
  USING (public.is_admin());

-- 10. media_assets (admin-managed metadata; avoids exposing uploader UUIDs to anon)
CREATE POLICY "media_assets_admin_select"
  ON public.media_assets
  FOR SELECT
  TO authenticated
  USING (public.is_admin());

CREATE POLICY "media_assets_admin_insert"
  ON public.media_assets
  FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin());

CREATE POLICY "media_assets_admin_update"
  ON public.media_assets
  FOR UPDATE
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "media_assets_admin_delete"
  ON public.media_assets
  FOR DELETE
  TO authenticated
  USING (public.is_admin());

-- 11. contact_submissions (public insert-only with unread status; admin read/manage)
CREATE POLICY "contact_submissions_public_insert_unread"
  ON public.contact_submissions
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (status = 'unread');

CREATE POLICY "contact_submissions_admin_select"
  ON public.contact_submissions
  FOR SELECT
  TO authenticated
  USING (public.is_admin());

CREATE POLICY "contact_submissions_admin_update"
  ON public.contact_submissions
  FOR UPDATE
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "contact_submissions_admin_delete"
  ON public.contact_submissions
  FOR DELETE
  TO authenticated
  USING (public.is_admin());

-- 12. site_settings (admin-only read and write)
CREATE POLICY "site_settings_admin_select"
  ON public.site_settings
  FOR SELECT
  TO authenticated
  USING (public.is_admin());

CREATE POLICY "site_settings_admin_insert"
  ON public.site_settings
  FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin());

CREATE POLICY "site_settings_admin_update"
  ON public.site_settings
  FOR UPDATE
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "site_settings_admin_delete"
  ON public.site_settings
  FOR DELETE
  TO authenticated
  USING (public.is_admin());

COMMIT;
