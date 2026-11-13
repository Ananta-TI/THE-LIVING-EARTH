import "server-only";

import { requireAdmin } from "@/features/auth/dal";
import type { Database } from "@/types/database";

export type ArticleRow = Database["public"]["Tables"]["articles"]["Row"];

export interface ArticleListFilters {
  readonly search?: string;
  readonly pillarId?: string;
  readonly status?: "all" | "draft" | "published" | "archived";
  readonly featured?: "all" | "featured" | "standard";
  readonly sort?: "updated_desc" | "created_desc" | "title_asc";
  readonly page?: number;
  readonly pageSize?: number;
}

export interface ArticleListItem {
  readonly id: string;
  readonly title: string;
  readonly slug: string;
  readonly status: "draft" | "published" | "archived";
  readonly featured: boolean;
  readonly pillar_id: string;
  readonly pillarName: string;
  readonly topicName: string | null;
  readonly published_at: string | null;
  readonly updated_at: string;
}

export interface ArticleFormLookups {
  readonly pillars: readonly { id: string; name: string }[];
  readonly topics: readonly { id: string; pillar_id: string; name: string }[];
  readonly references: readonly { id: string; title: string; organization: string }[];
}

export async function getArticleFormLookups(): Promise<
  | { readonly ok: true; readonly data: ArticleFormLookups }
  | { readonly ok: false; readonly error: string }
> {
  const { supabase } = await requireAdmin();

  const [pillarsRes, topicsRes, refsRes] = await Promise.all([
    supabase.from("pillars").select("id, name").order("display_order", { ascending: true }),
    supabase.from("topics").select("id, pillar_id, name").order("display_order", { ascending: true }),
    supabase.from("references").select("id, title, organization").order("title", { ascending: true }),
  ]);

  const firstError = pillarsRes.error ?? topicsRes.error ?? refsRes.error;
  if (firstError) {
    return {
      ok: false,
      error: `Failed to load article taxonomy & references: ${firstError.message}`,
    };
  }

  return {
    ok: true,
    data: {
      pillars: pillarsRes.data ?? [],
      topics: topicsRes.data ?? [],
      references: refsRes.data ?? [],
    },
  };
}

export async function getArticlesList(filters: ArticleListFilters): Promise<
  | {
      readonly ok: true;
      readonly data: {
        readonly items: readonly ArticleListItem[];
        readonly totalCount: number;
        readonly page: number;
        readonly pageSize: number;
        readonly pillars: readonly { id: string; name: string }[];
      };
    }
  | { readonly ok: false; readonly error: string }
> {
  const { supabase } = await requireAdmin();
  const page = Math.max(1, filters.page ?? 1);
  const pageSize = filters.pageSize ?? 12;
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase
    .from("articles")
    .select(
      "id, title, slug, status, featured, pillar_id, published_at, updated_at, pillars(name), topics(name)",
      { count: "exact" },
    );

  const search = filters.search?.trim();
  if (search) {
    const escaped = search.replace(/[%_]/g, "\\$&");
    query = query.or(
      `title.ilike.%${escaped}%,slug.ilike.%${escaped}%,excerpt.ilike.%${escaped}%`,
    );
  }

  if (filters.pillarId && filters.pillarId !== "all") {
    query = query.eq("pillar_id", filters.pillarId);
  }

  if (filters.status && filters.status !== "all") {
    query = query.eq("status", filters.status);
  }

  if (filters.featured === "featured") {
    query = query.eq("featured", true);
  } else if (filters.featured === "standard") {
    query = query.eq("featured", false);
  }

  if (filters.sort === "title_asc") {
    query = query.order("title", { ascending: true });
  } else if (filters.sort === "created_desc") {
    query = query.order("created_at", { ascending: false });
  } else {
    query = query.order("updated_at", { ascending: false });
  }

  query = query.range(from, to);

  const [articlesRes, pillarsRes] = await Promise.all([
    query,
    supabase.from("pillars").select("id, name").order("display_order", { ascending: true }),
  ]);

  const firstError = articlesRes.error ?? pillarsRes.error;
  if (firstError) {
    return {
      ok: false,
      error: `Failed to load articles: ${firstError.message}`,
    };
  }

  const items: ArticleListItem[] = (articlesRes.data ?? []).map((row) => {
    const pillarObj = row.pillars as { name?: string } | null;
    const topicObj = row.topics as { name?: string } | null;
    return {
      id: row.id,
      title: row.title,
      slug: row.slug,
      status: row.status,
      featured: row.featured,
      pillar_id: row.pillar_id,
      pillarName: pillarObj?.name ?? "Unassigned",
      topicName: topicObj?.name ?? null,
      published_at: row.published_at,
      updated_at: row.updated_at,
    };
  });

  return {
    ok: true,
    data: {
      items,
      totalCount: articlesRes.count ?? 0,
      page,
      pageSize,
      pillars: pillarsRes.data ?? [],
    },
  };
}

export async function getArticleForEdit(id: string): Promise<
  | {
      readonly ok: true;
      readonly data: {
        readonly article: ArticleRow;
        readonly selectedReferenceIds: readonly string[];
        readonly lookups: ArticleFormLookups;
      };
    }
  | { readonly ok: false; readonly error: string }
> {
  const { supabase } = await requireAdmin();

  const [articleRes, refsLinkRes, lookupsRes] = await Promise.all([
    supabase.from("articles").select("*").eq("id", id).maybeSingle(),
    supabase.from("article_references").select("reference_id").eq("article_id", id),
    getArticleFormLookups(),
  ]);

  if (articleRes.error) {
    return { ok: false, error: `Failed to load article: ${articleRes.error.message}` };
  }
  if (!articleRes.data) {
    return { ok: false, error: "Article not found." };
  }
  if (!lookupsRes.ok) {
    return lookupsRes;
  }

  return {
    ok: true,
    data: {
      article: articleRes.data,
      selectedReferenceIds: (refsLinkRes.data ?? []).map((r) => r.reference_id),
      lookups: lookupsRes.data,
    },
  };
}
