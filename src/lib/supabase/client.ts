import { createBrowserClient } from "@supabase/ssr";
import { requireSupabasePublicEnv } from "@/lib/validations/env";
import type { Database } from "@/types/database";

/**
 * Creates a browser-side Supabase client for Client Components.
 * Uses only public anon credentials; never reference service-role keys here.
 */
export function createClient() {
  const { url, anonKey } = requireSupabasePublicEnv();
  return createBrowserClient<Database>(url, anonKey);
}
