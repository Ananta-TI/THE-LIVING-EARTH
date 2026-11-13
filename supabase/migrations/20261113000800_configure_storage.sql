-- Migration 0008: Configure Supabase Storage buckets and RLS policies
-- Public buckets allow unauthenticated GET/read of published image assets,
-- while INSERT, UPDATE, and DELETE are restricted strictly to authenticated admins.

BEGIN;

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

CREATE POLICY "storage_public_read_editorial_buckets"
  ON storage.objects
  FOR SELECT
  TO anon, authenticated
  USING (
    bucket_id IN ('article-images', 'case-study-images', 'pillar-images', 'site-assets')
  );

CREATE POLICY "storage_admin_insert_editorial_buckets"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id IN ('article-images', 'case-study-images', 'pillar-images', 'site-assets')
    AND public.is_admin()
  );

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

CREATE POLICY "storage_admin_delete_editorial_buckets"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (
    bucket_id IN ('article-images', 'case-study-images', 'pillar-images', 'site-assets')
    AND public.is_admin()
  );

COMMIT;
