-- Migration 0001: Profiles, updated_at trigger helper, and admin authorization helper
-- Note: Public user registration is disabled; profiles are provisioned only via trusted admin bootstrap.

BEGIN;

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

CREATE TABLE public.profiles (
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

COMMIT;
