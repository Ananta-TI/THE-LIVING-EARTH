import "server-only";

import { requireAdmin } from "@/features/auth/dal";
import type { Database } from "@/types/database";

export type CaseStudyRow = Database["public"]["Tables"]["case_studies"]["Row"];

export interface CaseStudyListItem {
  readonly id: string;
  readonly title: string;
  readonly slug: string;
  readonly country: string;
  readonly region: string | null;
  readonly status: "draft" | "published" | "archived";
  readonly pillar_id: string;
  readonly pillarName: string;
  readonly updated_at: string;
}

export interface CaseStudyFormLookups {
  readonly pillars: readonly { id: string; name: string }[];
  readonly references: readonly { id: string; title: string; organization: string }[];
}

export async function getCaseStudyLookups(): Promise<
  | { readonly ok: true; readonly data: CaseStudyFormLookups }
  | { readonly ok: false; readonly error: string }
> {
  const { supabase } = await requireAdmin();
  const [pillarsRes, refsRes] = await Promise.all([
    supabase.from("pillars").select("id, name").order("display_order", { ascending: true }),
    supabase.from("references").select("id, title, organization").order("title", { ascending: true }),
  ]);

  const firstError = pillarsRes.error ?? refsRes.error;
  if (firstError) {
    return { ok: false, error: `Failed to load lookups: ${firstError.message}` };
  }

  return {
    ok: true,
    data: {
      pillars: pillarsRes.data ?? [],
      references: refsRes.data ?? [],
    },
  };
}

export async function getCaseStudiesList(): Promise<
  | {
      readonly ok: true;
      readonly data: {
        readonly items: readonly CaseStudyListItem[];
        readonly pillars: readonly { id: string; name: string }[];
      };
    }
  | { readonly ok: false; readonly error: string }
> {
  const { supabase } = await requireAdmin();

  const [csRes, pillarsRes] = await Promise.all([
    supabase
      .from("case_studies")
      .select("id, title, slug, country, region, status, pillar_id, updated_at, pillars(name)")
      .order("updated_at", { ascending: false }),
    supabase.from("pillars").select("id, name").order("display_order", { ascending: true }),
  ]);

  const firstError = csRes.error ?? pillarsRes.error;
  if (firstError) {
    return { ok: false, error: `Failed to load case studies: ${firstError.message}` };
  }

  const items: CaseStudyListItem[] = (csRes.data ?? []).map((row) => {
    const pillarObj = row.pillars as { name?: string } | null;
    return {
      id: row.id,
      title: row.title,
      slug: row.slug,
      country: row.country,
      region: row.region,
      status: row.status,
      pillar_id: row.pillar_id,
      pillarName: pillarObj?.name ?? "Unassigned",
      updated_at: row.updated_at,
    };
  });

  return {
    ok: true,
    data: {
      items,
      pillars: pillarsRes.data ?? [],
    },
  };
}

export async function getCaseStudyForEdit(id: string): Promise<
  | {
      readonly ok: true;
      readonly data: {
        readonly caseStudy: CaseStudyRow;
        readonly selectedReferenceIds: readonly string[];
        readonly lookups: CaseStudyFormLookups;
      };
    }
  | { readonly ok: false; readonly error: string }
> {
  const { supabase } = await requireAdmin();

  const [csRes, linksRes, lookupsRes] = await Promise.all([
    supabase.from("case_studies").select("*").eq("id", id).maybeSingle(),
    supabase.from("case_study_references").select("reference_id").eq("case_study_id", id),
    getCaseStudyLookups(),
  ]);

  if (csRes.error) {
    return { ok: false, error: `Failed to load case study: ${csRes.error.message}` };
  }
  if (!csRes.data) {
    return { ok: false, error: "Case study not found." };
  }
  if (!lookupsRes.ok) {
    return lookupsRes;
  }

  return {
    ok: true,
    data: {
      caseStudy: csRes.data,
      selectedReferenceIds: (linksRes.data ?? []).map((r) => r.reference_id),
      lookups: lookupsRes.data,
    },
  };
}
