import "server-only";

import { requireAdmin } from "@/features/auth/dal";
import type { Database } from "@/types/database";

export type TopicRow = Database["public"]["Tables"]["topics"]["Row"];

export interface TopicWithPillar extends TopicRow {
  readonly pillarName: string;
  readonly articlesCount: number;
}

export interface TopicsOverviewData {
  readonly topics: readonly TopicWithPillar[];
  readonly pillars: readonly { id: string; name: string; display_order: number }[];
}

export async function getTopicsOverview(): Promise<
  | { readonly ok: true; readonly data: TopicsOverviewData }
  | { readonly ok: false; readonly error: string }
> {
  const { supabase } = await requireAdmin();

  const [topicsRes, pillarsRes, articlesRes] = await Promise.all([
    supabase
      .from("topics")
      .select("*, pillars(name)")
      .order("display_order", { ascending: true })
      .order("name", { ascending: true }),
    supabase
      .from("pillars")
      .select("id, name, display_order")
      .order("display_order", { ascending: true }),
    supabase.from("articles").select("topic_id").not("topic_id", "is", null),
  ]);

  const firstError = topicsRes.error ?? pillarsRes.error ?? articlesRes.error;
  if (firstError) {
    return {
      ok: false,
      error: `Failed to load topics: ${firstError.message}`,
    };
  }

  const articleCounts = new Map<string, number>();
  for (const row of articlesRes.data ?? []) {
    if (row.topic_id) {
      articleCounts.set(row.topic_id, (articleCounts.get(row.topic_id) ?? 0) + 1);
    }
  }

  const topics: TopicWithPillar[] = (topicsRes.data ?? []).map((row) => {
    const pillarObj = row.pillars as { name?: string } | null;
    return {
      id: row.id,
      pillar_id: row.pillar_id,
      name: row.name,
      slug: row.slug,
      description: row.description,
      display_order: row.display_order,
      is_active: row.is_active,
      created_at: row.created_at,
      updated_at: row.updated_at,
      pillarName: pillarObj?.name ?? "Unknown Pillar",
      articlesCount: articleCounts.get(row.id) ?? 0,
    };
  });

  return {
    ok: true,
    data: {
      topics,
      pillars: pillarsRes.data ?? [],
    },
  };
}
