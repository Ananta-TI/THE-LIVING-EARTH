import { createClient } from "@supabase/supabase-js";
import { getSupabasePublicEnv } from "@/lib/validations/env";
import type { Database } from "@/types/database";

/**
 * Cookieless anonymous Supabase client for public Server Components,
 * metadata generation, and sitemap generation under Next.js 16 Cache Components.
 * All queries strictly execute under the `anon` role and Phase 2 RLS policies.
 */
export function createPublicClient() {
  const env = getSupabasePublicEnv();
  if (!env.configured || !env.url || !env.anonKey) {
    return null;
  }

  return createClient<Database>(env.url, env.anonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });
}
