import "server-only";

import { requireAdmin } from "@/features/auth/dal";
import type { Database } from "@/types/database";

export type PillarRow = Database["public"]["Tables"]["pillars"]["Row"];

export interface PillarWithRelations extends PillarRow {
  readonly topicsCount: number;
  readonly articlesCount: number;
  readonly caseStudiesCount: number;
  readonly statisticsCount: number;
  readonly relatedTopics: readonly { id: string; name: string; is_active: boolean }[];
  readonly relatedArticles: readonly { id: string; title: string; status: string }[];
}

export async function getPillarsWithRelations(): Promise<
  | { readonly ok: true; readonly data: readonly PillarWithRelations[] }
  | { readonly ok: false; readonly error: string }
> {
  const { supabase } = await requireAdmin();

  const [pillarsRes, topicsRes, articlesRes, caseStudiesRes, statisticsRes] = await Promise.all([
    supabase.from("pillars").select("*").order("display_order", { ascending: true }),
    supabase
      .from("topics")
      .select("id, pillar_id, name, is_active")
      .order("display_order", { ascending: true }),
    supabase
      .from("articles")
      .select("id, pillar_id, title, status")
      .order("updated_at", { ascending: false }),
    supabase.from("case_studies").select("id, pillar_id"),
    supabase.from("statistics").select("id, pillar_id"),
  ]);

  const firstError =
    pillarsRes.error ??
    topicsRes.error ??
    articlesRes.error ??
    caseStudiesRes.error ??
    statisticsRes.error;

  if (firstError) {
    return {
      ok: false,
      error: `Failed to load environmental pillars: ${firstError.message}`,
    };
  }

  const topicsByPillar = new Map<string, { id: string; name: string; is_active: boolean }[]>();
  for (const t of topicsRes.data ?? []) {
    const list = topicsByPillar.get(t.pillar_id) ?? [];
    list.push({ id: t.id, name: t.name, is_active: t.is_active });
    topicsByPillar.set(t.pillar_id, list);
  }

  const articlesByPillar = new Map<string, { id: string; title: string; status: string }[]>();
  for (const a of articlesRes.data ?? []) {
    const list = articlesByPillar.get(a.pillar_id) ?? [];
    list.push({ id: a.id, title: a.title, status: a.status });
    articlesByPillar.set(a.pillar_id, list);
  }

  const caseStudyCountByPillar = new Map<string, number>();
  for (const cs of caseStudiesRes.data ?? []) {
    caseStudyCountByPillar.set(cs.pillar_id, (caseStudyCountByPillar.get(cs.pillar_id) ?? 0) + 1);
  }

  const statCountByPillar = new Map<string, number>();
  for (const st of statisticsRes.data ?? []) {
    statCountByPillar.set(st.pillar_id, (statCountByPillar.get(st.pillar_id) ?? 0) + 1);
  }

  const enriched: PillarWithRelations[] = (pillarsRes.data ?? []).map((pillar) => {
    const relatedTopics = topicsByPillar.get(pillar.id) ?? [];
    const relatedArticles = articlesByPillar.get(pillar.id) ?? [];
    return {
      ...pillar,
      topicsCount: relatedTopics.length,
      articlesCount: relatedArticles.length,
      caseStudiesCount: caseStudyCountByPillar.get(pillar.id) ?? 0,
      statisticsCount: statCountByPillar.get(pillar.id) ?? 0,
      relatedTopics,
      relatedArticles: relatedArticles.slice(0, 6),
    };
  });

  return { ok: true, data: enriched };
}
