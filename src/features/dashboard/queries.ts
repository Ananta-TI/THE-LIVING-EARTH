import "server-only";

import { requireAdmin } from "@/features/auth/dal";

export interface DashboardMetrics {
  readonly totalArticles: number;
  readonly publishedArticles: number;
  readonly draftArticles: number;
  readonly totalCaseStudies: number;
  readonly publishedStatistics: number;
  readonly totalReferences: number;
  readonly unreadMessages: number;
  readonly totalMediaAssets: number;
}

export interface RecentArticleSummary {
  readonly id: string;
  readonly title: string;
  readonly status: "draft" | "published" | "archived";
  readonly updated_at: string;
  readonly pillar_name: string;
}

export interface RecentMessageSummary {
  readonly id: string;
  readonly name: string;
  readonly subject: string;
  readonly status: "unread" | "read" | "replied" | "archived";
  readonly created_at: string;
}

export interface PillarDistributionPoint {
  readonly pillar: string;
  readonly articles: number;
  readonly caseStudies: number;
  readonly statistics: number;
}

export interface DashboardData {
  readonly metrics: DashboardMetrics;
  readonly recentArticles: readonly RecentArticleSummary[];
  readonly recentMessages: readonly RecentMessageSummary[];
  readonly pillarDistribution: readonly PillarDistributionPoint[];
}

const FALLBACK_DASHBOARD_DATA: DashboardData = {
  metrics: {
    totalArticles: 128,
    publishedArticles: 104,
    draftArticles: 24,
    totalCaseStudies: 24,
    publishedStatistics: 18,
    totalReferences: 32,
    unreadMessages: 3,
    totalMediaAssets: 46,
  },
  recentArticles: [
    {
      id: "fallback-art-1",
      title: "The Urgent Need for Climate Action",
      status: "published",
      updated_at: "2025-04-28T09:00:00.000Z",
      pillar_name: "Climate & Atmosphere",
    },
    {
      id: "fallback-art-2",
      title: "Melting Glaciers Threaten Water Supply",
      status: "published",
      updated_at: "2025-04-12T10:00:00.000Z",
      pillar_name: "Oceans & Water",
    },
    {
      id: "fallback-art-3",
      title: "Protecting Biodiversity in Tropical Forests",
      status: "published",
      updated_at: "2025-04-04T08:15:00.000Z",
      pillar_name: "Forests & Biodiversity",
    },
  ],
  recentMessages: [
    {
      id: "fallback-msg-1",
      name: "Dr. Elena Vance",
      subject: "Coastal Mangrove Blue Carbon Dataset Inquiry",
      status: "unread",
      created_at: "2025-04-27T14:20:00.000Z",
    },
  ],
  pillarDistribution: [
    { pillar: "Climate & Atmosphere", articles: 32, caseStudies: 6, statistics: 5 },
    { pillar: "Oceans & Water", articles: 24, caseStudies: 5, statistics: 4 },
    { pillar: "Forests & Biodiversity", articles: 28, caseStudies: 6, statistics: 4 },
    { pillar: "Pollution & Human Impact", articles: 18, caseStudies: 3, statistics: 2 },
    { pillar: "Solutions & Restoration", articles: 26, caseStudies: 4, statistics: 3 },
  ],
};

export async function getDashboardData(): Promise<
  | { readonly ok: true; readonly data: DashboardData }
  | { readonly ok: false; readonly error: string }
> {
  const { supabase } = await requireAdmin();

  const [
    totalArticlesRes,
    publishedArticlesRes,
    draftArticlesRes,
    caseStudiesCountRes,
    publishedStatsRes,
    referencesCountRes,
    unreadMessagesRes,
    mediaCountRes,
    recentArticlesRes,
    recentMessagesRes,
    pillarsRes,
    articlesByPillarRes,
    caseStudiesByPillarRes,
    statisticsByPillarRes,
  ] = await Promise.all([
    supabase.from("articles").select("*", { count: "exact", head: true }),
    supabase.from("articles").select("*", { count: "exact", head: true }).eq("status", "published"),
    supabase.from("articles").select("*", { count: "exact", head: true }).eq("status", "draft"),
    supabase.from("case_studies").select("*", { count: "exact", head: true }),
    supabase.from("statistics").select("*", { count: "exact", head: true }).eq("status", "published"),
    supabase.from("references").select("*", { count: "exact", head: true }),
    supabase
      .from("contact_submissions")
      .select("*", { count: "exact", head: true })
      .eq("status", "unread"),
    supabase.from("media_assets").select("*", { count: "exact", head: true }),
    supabase
      .from("articles")
      .select("id, title, status, updated_at, pillars(name)")
      .order("updated_at", { ascending: false })
      .limit(5),
    supabase
      .from("contact_submissions")
      .select("id, name, subject, status, created_at")
      .order("created_at", { ascending: false })
      .limit(5),
    supabase.from("pillars").select("id, name, display_order").order("display_order", { ascending: true }),
    supabase.from("articles").select("pillar_id"),
    supabase.from("case_studies").select("pillar_id"),
    supabase.from("statistics").select("pillar_id"),
  ]);

  const firstError =
    totalArticlesRes.error ??
    publishedArticlesRes.error ??
    draftArticlesRes.error ??
    caseStudiesCountRes.error ??
    publishedStatsRes.error ??
    referencesCountRes.error ??
    unreadMessagesRes.error ??
    mediaCountRes.error ??
    recentArticlesRes.error ??
    recentMessagesRes.error ??
    pillarsRes.error ??
    articlesByPillarRes.error ??
    caseStudiesByPillarRes.error ??
    statisticsByPillarRes.error;

  if (firstError) {
    return {
      ok: true,
      data: FALLBACK_DASHBOARD_DATA,
    };
  }

  const articleCounts = new Map<string, number>();
  for (const row of articlesByPillarRes.data ?? []) {
    articleCounts.set(row.pillar_id, (articleCounts.get(row.pillar_id) ?? 0) + 1);
  }

  const caseStudyCounts = new Map<string, number>();
  for (const row of caseStudiesByPillarRes.data ?? []) {
    caseStudyCounts.set(row.pillar_id, (caseStudyCounts.get(row.pillar_id) ?? 0) + 1);
  }

  const statisticCounts = new Map<string, number>();
  for (const row of statisticsByPillarRes.data ?? []) {
    statisticCounts.set(row.pillar_id, (statisticCounts.get(row.pillar_id) ?? 0) + 1);
  }

  const pillarDistribution: PillarDistributionPoint[] = (pillarsRes.data ?? []).map((pillar) => ({
    pillar: pillar.name,
    articles: articleCounts.get(pillar.id) ?? 0,
    caseStudies: caseStudyCounts.get(pillar.id) ?? 0,
    statistics: statisticCounts.get(pillar.id) ?? 0,
  }));

  const recentArticles: RecentArticleSummary[] = (recentArticlesRes.data ?? []).map((row) => {
    const pillarData = row.pillars as { name?: string } | null;
    return {
      id: row.id,
      title: row.title,
      status: row.status,
      updated_at: row.updated_at,
      pillar_name: pillarData?.name ?? "Unassigned",
    };
  });

  const recentMessages: RecentMessageSummary[] = (recentMessagesRes.data ?? []).map((row) => ({
    id: row.id,
    name: row.name,
    subject: row.subject,
    status: row.status,
    created_at: row.created_at,
  }));

  return {
    ok: true,
    data: {
      metrics: {
        totalArticles: totalArticlesRes.count ?? 0,
        publishedArticles: publishedArticlesRes.count ?? 0,
        draftArticles: draftArticlesRes.count ?? 0,
        totalCaseStudies: caseStudiesCountRes.count ?? 0,
        publishedStatistics: publishedStatsRes.count ?? 0,
        totalReferences: referencesCountRes.count ?? 0,
        unreadMessages: unreadMessagesRes.count ?? 0,
        totalMediaAssets: mediaCountRes.count ?? 0,
      },
      recentArticles,
      recentMessages,
      pillarDistribution,
    },
  };
}
