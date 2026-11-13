import "server-only";

import { requireAdmin } from "@/features/auth/dal";
import type { Database } from "@/types/database";

export type ReferenceRow = Database["public"]["Tables"]["references"]["Row"];

export interface ReferenceWithUsage extends ReferenceRow {
  readonly usageCount: number;
  readonly articlesCount: number;
  readonly caseStudiesCount: number;
  readonly statisticsCount: number;
}

export interface ReferenceDetailWithLinks {
  readonly reference: ReferenceRow;
  readonly linkedArticles: readonly { id: string; title: string; status: string }[];
  readonly linkedCaseStudies: readonly { id: string; title: string; status: string }[];
  readonly linkedStatistics: readonly { id: string; indicator: string; measurement_year: number }[];
}

export async function getReferencesWithUsage(): Promise<
  | { readonly ok: true; readonly data: readonly ReferenceWithUsage[] }
  | { readonly ok: false; readonly error: string }
> {
  const { supabase } = await requireAdmin();

  const [refsRes, artLinksRes, csLinksRes, statsRes] = await Promise.all([
    supabase.from("references").select("*").order("created_at", { ascending: false }),
    supabase.from("article_references").select("reference_id"),
    supabase.from("case_study_references").select("reference_id"),
    supabase.from("statistics").select("reference_id"),
  ]);

  const firstError = refsRes.error ?? artLinksRes.error ?? csLinksRes.error ?? statsRes.error;
  if (firstError) {
    return {
      ok: false,
      error: `Failed to load scientific references: ${firstError.message}`,
    };
  }

  const artCounts = new Map<string, number>();
  for (const r of artLinksRes.data ?? []) {
    artCounts.set(r.reference_id, (artCounts.get(r.reference_id) ?? 0) + 1);
  }

  const csCounts = new Map<string, number>();
  for (const r of csLinksRes.data ?? []) {
    csCounts.set(r.reference_id, (csCounts.get(r.reference_id) ?? 0) + 1);
  }

  const statCounts = new Map<string, number>();
  for (const r of statsRes.data ?? []) {
    statCounts.set(r.reference_id, (statCounts.get(r.reference_id) ?? 0) + 1);
  }

  const enriched: ReferenceWithUsage[] = (refsRes.data ?? []).map((ref) => {
    const articlesCount = artCounts.get(ref.id) ?? 0;
    const caseStudiesCount = csCounts.get(ref.id) ?? 0;
    const statisticsCount = statCounts.get(ref.id) ?? 0;
    return {
      ...ref,
      articlesCount,
      caseStudiesCount,
      statisticsCount,
      usageCount: articlesCount + caseStudiesCount + statisticsCount,
    };
  });

  return { ok: true, data: enriched };
}

export async function getReferenceById(id: string): Promise<
  | { readonly ok: true; readonly data: ReferenceDetailWithLinks }
  | { readonly ok: false; readonly error: string }
> {
  const { supabase } = await requireAdmin();

  const [refRes, artLinksRes, csLinksRes, statsRes] = await Promise.all([
    supabase.from("references").select("*").eq("id", id).maybeSingle(),
    supabase
      .from("article_references")
      .select("article_id, articles(id, title, status)")
      .eq("reference_id", id),
    supabase
      .from("case_study_references")
      .select("case_study_id, case_studies(id, title, status)")
      .eq("reference_id", id),
    supabase
      .from("statistics")
      .select("id, indicator, measurement_year")
      .eq("reference_id", id)
      .order("measurement_year", { ascending: false }),
  ]);

  if (refRes.error) {
    return { ok: false, error: `Failed to load reference: ${refRes.error.message}` };
  }
  if (!refRes.data) {
    return { ok: false, error: "Reference record not found." };
  }

  const linkedArticles = (artLinksRes.data ?? [])
    .map((row) => row.articles as { id: string; title: string; status: string } | null)
    .filter((item): item is { id: string; title: string; status: string } => Boolean(item));

  const linkedCaseStudies = (csLinksRes.data ?? [])
    .map((row) => row.case_studies as { id: string; title: string; status: string } | null)
    .filter((item): item is { id: string; title: string; status: string } => Boolean(item));

  return {
    ok: true,
    data: {
      reference: refRes.data,
      linkedArticles,
      linkedCaseStudies,
      linkedStatistics: statsRes.data ?? [],
    },
  };
}
