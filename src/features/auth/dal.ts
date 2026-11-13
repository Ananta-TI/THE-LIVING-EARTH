import "server-only";

import { cache } from "react";
import { redirect } from "next/navigation";
import type { SupabaseClient, User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import { getSupabasePublicEnv } from "@/lib/validations/env";
import type { Database } from "@/types/database";

export type AdminProfile = Database["public"]["Tables"]["profiles"]["Row"];

export interface AdminContext {
  readonly supabase: SupabaseClient<Database>;
  readonly user: User;
  readonly profile: AdminProfile;
}

export type AuthCheckResult =
  | {
      readonly status: "unconfigured";
      readonly missing: readonly string[];
      readonly user: null;
      readonly profile: null;
    }
  | {
      readonly status: "unauthenticated";
      readonly user: null;
      readonly profile: null;
    }
  | {
      readonly status: "forbidden";
      readonly user: User;
      readonly profile: null;
    }
  | {
      readonly status: "authenticated";
      readonly user: User;
      readonly profile: AdminProfile;
    };

/**
 * Resolves the current authentication and admin authorization state without redirecting.
 */
export const getAuthStatus = cache(async (): Promise<AuthCheckResult> => {
  const env = getSupabasePublicEnv();
  if (!env.configured) {
    return {
      status: "unconfigured",
      missing: env.missing,
      user: null,
      profile: null,
    };
  }

  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return {
      status: "unauthenticated",
      user: null,
      profile: null,
    };
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .eq("role", "admin")
    .maybeSingle();

  if (profileError || !profile) {
    return {
      status: "forbidden",
      user,
      profile: null,
    };
  }

  return {
    status: "authenticated",
    user,
    profile,
  };
});

/**
 * Enforces an authenticated admin session for protected Server Components.
 * Redirects to `/admin/login` when unauthenticated or unauthorized.
 */
export async function requireAdmin(): Promise<AdminContext> {
  const env = getSupabasePublicEnv();
  if (!env.configured) {
    redirect("/admin/login?error=unconfigured");
  }

  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect("/admin/login");
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .eq("role", "admin")
    .maybeSingle();

  if (profileError || !profile) {
    redirect("/admin/login?error=forbidden");
  }

  return {
    supabase,
    user,
    profile,
  };
}

/**
 * Verifies admin credentials inside Server Actions and Route Handlers without throwing a redirect.
 */
export async function verifyAdminAction(): Promise<
  | ({ readonly ok: true } & AdminContext)
  | { readonly ok: false; readonly error: string }
> {
  const env = getSupabasePublicEnv();
  if (!env.configured) {
    return {
      ok: false,
      error:
        "Supabase environment variables are not validly configured. Fix NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY first.",
    };
  }

  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return {
      ok: false,
      error: "Your session has expired. Please sign in again.",
    };
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .eq("role", "admin")
    .maybeSingle();

  if (profileError || !profile) {
    return {
      ok: false,
      error: "Access denied. This account does not have administrator privileges.",
    };
  }

  return {
    ok: true,
    supabase,
    user,
    profile,
  };
}
