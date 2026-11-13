import "server-only";

import { requireAdmin } from "@/features/auth/dal";
import type { Database } from "@/types/database";

export type ContactSubmissionRow = Database["public"]["Tables"]["contact_submissions"]["Row"];

export async function getContactSubmissions(): Promise<
  | { readonly ok: true; readonly data: readonly ContactSubmissionRow[] }
  | { readonly ok: false; readonly error: string }
> {
  const { supabase } = await requireAdmin();

  const { data, error } = await supabase
    .from("contact_submissions")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return {
      ok: false,
      error: `Failed to load contact submissions: ${error.message}`,
    };
  }

  return { ok: true, data: data ?? [] };
}

export async function getContactSubmissionById(id: string): Promise<
  | { readonly ok: true; readonly data: ContactSubmissionRow }
  | { readonly ok: false; readonly error: string }
> {
  const { supabase } = await requireAdmin();

  const { data, error } = await supabase
    .from("contact_submissions")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    return { ok: false, error: `Failed to load submission: ${error.message}` };
  }
  if (!data) {
    return { ok: false, error: "Contact submission not found." };
  }

  return { ok: true, data };
}
