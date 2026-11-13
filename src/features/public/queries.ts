import "server-only";

import {
  FALLBACK_ARTICLE_CARDS,
  FALLBACK_ARTICLES_FULL,
  FALLBACK_CASE_STUDIES_FULL,
  FALLBACK_CASE_STUDY_CARDS,
  FALLBACK_EXPLORE_PILLARS,
  FALLBACK_PILLARS,
  FALLBACK_REFERENCES,
  FALLBACK_STATISTICS,
  FALLBACK_TOPICS,
} from "@/features/public/fallback-catalog";
import { createPublicClient } from "@/lib/supabase/public";
import type { Database } from "@/types/database";

export type PillarRow = Database["public"]["Tables"]["pillars"]["Row"];
export type TopicRow = Database["public"]["Tables"]["topics"]["Row"];
export type ArticleRow = Database["public"]["Tables"]["articles"]["Row"];
export type CaseStudyRow = Database["public"]["Tables"]["case_studies"]["Row"];
export type StatisticRow = Database["public"]["Tables"]["statistics"]["Row"];
export type ReferenceRow = Database["public"]["Tables"]["references"]["Row"];

export type QueryResult<T> =
  | { readonly status: "ok"; readonly data: T }
  | { readonly status: "unconfigured" }
  | { readonly status: "error"; readonly message: string };

export interface PublicArticleCard {
  readonly id: string;
  readonly title: string;
  readonly slug: string;
  readonly excerpt: string;
  readonly content: string;
  readonly cover_image_path: string | null;
  readonly featured: boolean;
  readonly published_at: string | null;
  readonly pillarName: string;
  readonly pillarSlug: string;
  readonly topicName: string | null;
}

export interface PublicStatisticWithSource extends StatisticRow {
  readonly pillarName: string;
  readonly pillarSlug: string;
  readonly reference: Pick<
    ReferenceRow,
    "id" | "title" | "organization" | "source_type" | "source_url" | "publication_date"
  > | null;
}

export interface PublicCaseStudyCard {
  readonly id: string;
  readonly title: string;
  readonly slug: string;
  readonly summary: string;
  readonly country: string;
  readonly region: string | null;
  readonly latitude: number | null;
  readonly longitude: number | null;
  readonly cover_image_path: string | null;
  readonly organization: string | null;
  readonly start_date: string | null;
  readonly end_date: string | null;
  readonly published_at: string | null;
  readonly pillarName: string;
  readonly pillarSlug: string;
}

export interface ExplorePillarItem extends PillarRow {
  readonly topics: readonly Pick<TopicRow, "id" | "name" | "slug" | "description">[];
  readonly publishedArticlesCount: number;
}

export interface HomePageData {
  readonly pillars: readonly PillarRow[];
  readonly featuredStories: readonly PublicArticleCard[];
  readonly keyStatistics: readonly PublicStatisticWithSource[];
}

export interface PillarDetailData {
  readonly pillar: PillarRow;
  readonly topics: readonly TopicRow[];
  readonly articles: readonly PublicArticleCard[];
  readonly caseStudies: readonly PublicCaseStudyCard[];
  readonly statistics: readonly PublicStatisticWithSource[];
  readonly references: readonly ReferenceRow[];
}

export interface StoriesPageData {
  readonly featuredStory: PublicArticleCard | null;
  readonly articles: readonly PublicArticleCard[];
  readonly totalCount: number;
  readonly page: number;
  readonly pageSize: number;
  readonly pillars: readonly Pick<PillarRow, "id" | "name" | "slug">[];
}

export interface StoryDetailData {
  readonly article: ArticleRow & {
    readonly pillarName: string;
    readonly pillarSlug: string;
    readonly topicName: string | null;
  };
  readonly references: readonly ReferenceRow[];
  readonly relatedArticles: readonly PublicArticleCard[];
}

export interface OurPlanetData {
  readonly pillars: readonly PillarRow[];
  readonly caseStudies: readonly PublicCaseStudyCard[];
  readonly statistics: readonly PublicStatisticWithSource[];
  readonly references: readonly ReferenceRow[];
}

export interface CaseStudyDetailData {
  readonly caseStudy: CaseStudyRow & {
    readonly pillarName: string;
    readonly pillarSlug: string;
  };
  readonly references: readonly ReferenceRow[];
  readonly relatedCaseStudies: readonly PublicCaseStudyCard[];
}

function mapArticleCard(row: {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover_image_path: string | null;
  featured: boolean;
  published_at: string | null;
  pillars: unknown;
  topics: unknown;
}): PublicArticleCard {
  const pillar = row.pillars as { name?: string; slug?: string } | null;
  const topic = row.topics as { name?: string } | null;
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    excerpt: row.excerpt,
    content: row.content,
    cover_image_path: row.cover_image_path,
    featured: row.featured,
    published_at: row.published_at,
    pillarName: pillar?.name ?? "Environment",
    pillarSlug: pillar?.slug ?? "climate-atmosphere",
    topicName: topic?.name ?? null,
  };
}

function mapCaseStudyCard(row: {
  id: string;
  title: string;
  slug: string;
  summary: string;
  country: string;
  region: string | null;
  latitude: number | null;
  longitude: number | null;
  cover_image_path: string | null;
  organization: string | null;
  start_date: string | null;
  end_date: string | null;
  published_at: string | null;
  pillars: unknown;
}): PublicCaseStudyCard {
  const pillar = row.pillars as { name?: string; slug?: string } | null;
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    summary: row.summary,
    country: row.country,
    region: row.region,
    latitude: row.latitude,
    longitude: row.longitude,
    cover_image_path: row.cover_image_path,
    organization: row.organization,
    start_date: row.start_date,
    end_date: row.end_date,
    published_at: row.published_at,
    pillarName: pillar?.name ?? "Environment",
    pillarSlug: pillar?.slug ?? "climate-atmosphere",
  };
}

function mapStatisticWithSource(
  row: StatisticRow & { pillars?: unknown; references?: unknown },
): PublicStatisticWithSource {
  const pillar = row.pillars as { name?: string; slug?: string } | null;
  const ref = row.references as PublicStatisticWithSource["reference"];
  return {
    ...row,
    pillarName: pillar?.name ?? "Environment",
    pillarSlug: pillar?.slug ?? "climate-atmosphere",
    reference: ref ?? null,
  };
}

function getFallbackPillarDetail(slug: string): PillarDetailData | null {
  const pillar = FALLBACK_PILLARS.find((p) => p.slug === slug);
  if (!pillar) return null;

  return {
    pillar,
    topics: FALLBACK_TOPICS.filter((t) => t.pillar_id === pillar.id),
    articles: FALLBACK_ARTICLE_CARDS.filter((a) => a.pillarSlug === slug),
    caseStudies: FALLBACK_CASE_STUDY_CARDS.filter((c) => c.pillarSlug === slug),
    statistics: FALLBACK_STATISTICS.filter((s) => s.pillarSlug === slug),
    references: FALLBACK_REFERENCES,
  };
}

function getFallbackStoriesList(options: {
  readonly search?: string;
  readonly pillarSlug?: string;
  readonly page?: number;
  readonly pageSize?: number;
}): StoriesPageData {
  const page = Math.max(1, options.page ?? 1);
  const pageSize = options.pageSize ?? 9;
  const search = options.search?.trim().toLowerCase() ?? "";
  const pillarSlug = options.pillarSlug && options.pillarSlug !== "all" ? options.pillarSlug : "";

  let filtered = [...FALLBACK_ARTICLE_CARDS];
  if (pillarSlug) {
    filtered = filtered.filter((a) => a.pillarSlug === pillarSlug);
  }
  if (search) {
    filtered = filtered.filter(
      (a) =>
        a.title.toLowerCase().includes(search) || a.excerpt.toLowerCase().includes(search),
    );
  }

  const featuredStory =
    page === 1 && !search && !pillarSlug
      ? (FALLBACK_ARTICLE_CARDS.find((a) => a.featured) ?? FALLBACK_ARTICLE_CARDS[0] ?? null)
      : null;

  const from = (page - 1) * pageSize;
  const paged = filtered.slice(from, from + pageSize);

  return {
    featuredStory,
    articles: paged,
    totalCount: filtered.length,
    page,
    pageSize,
    pillars: FALLBACK_PILLARS.map((p) => ({ id: p.id, name: p.name, slug: p.slug })),
  };
}

export async function getHomePageData(): Promise<QueryResult<HomePageData>> {
  const supabase = createPublicClient();
  if (!supabase) {
    return {
      status: "ok",
      data: {
        pillars: FALLBACK_PILLARS,
        featuredStories: FALLBACK_ARTICLE_CARDS.slice(1, 4),
        keyStatistics: FALLBACK_STATISTICS,
      },
    };
  }

  const [pillarsRes, featuredArticlesRes, fallbackArticlesRes, statsRes] = await Promise.all([
    supabase
      .from("pillars")
      .select("*")
      .eq("is_active", true)
      .order("display_order", { ascending: true }),
    supabase
      .from("articles")
      .select(
        "id, title, slug, excerpt, content, cover_image_path, featured, published_at, pillars(name, slug), topics(name)",
      )
      .eq("status", "published")
      .eq("featured", true)
      .order("published_at", { ascending: false })
      .limit(3),
    supabase
      .from("articles")
      .select(
        "id, title, slug, excerpt, content, cover_image_path, featured, published_at, pillars(name, slug), topics(name)",
      )
      .eq("status", "published")
      .order("published_at", { ascending: false })
      .limit(3),
    supabase
      .from("statistics")
      .select(
        "*, pillars(name, slug), references(id, title, organization, source_type, source_url, publication_date)",
      )
      .eq("status", "published")
      .order("measurement_year", { ascending: false })
      .limit(4),
  ]);

  const dbPillars =
    !pillarsRes.error && (pillarsRes.data?.length ?? 0) > 0
      ? (pillarsRes.data ?? [])
      : FALLBACK_PILLARS;

  const rawFeatured =
    (featuredArticlesRes.data?.length ?? 0) > 0
      ? (featuredArticlesRes.data ?? [])
      : (fallbackArticlesRes.data ?? []);

  const featuredStories =
    rawFeatured.length > 0
      ? rawFeatured.map(mapArticleCard)
      : FALLBACK_ARTICLE_CARDS.slice(1, 4);

  const keyStatistics =
    !statsRes.error && (statsRes.data?.length ?? 0) > 0
      ? (statsRes.data ?? []).map(mapStatisticWithSource)
      : FALLBACK_STATISTICS;

  return {
    status: "ok",
    data: {
      pillars: dbPillars,
      featuredStories,
      keyStatistics,
    },
  };
}

export async function getExploreOverview(): Promise<QueryResult<readonly ExplorePillarItem[]>> {
  const supabase = createPublicClient();
  if (!supabase) {
    return { status: "ok", data: FALLBACK_EXPLORE_PILLARS };
  }

  const [pillarsRes, topicsRes, articlesRes] = await Promise.all([
    supabase
      .from("pillars")
      .select("*")
      .eq("is_active", true)
      .order("display_order", { ascending: true }),
    supabase
      .from("topics")
      .select("id, pillar_id, name, slug, description")
      .eq("is_active", true)
      .order("display_order", { ascending: true }),
    supabase
      .from("articles")
      .select("id, pillar_id")
      .eq("status", "published"),
  ]);

  if (pillarsRes.error || (pillarsRes.data?.length ?? 0) === 0) {
    return { status: "ok", data: FALLBACK_EXPLORE_PILLARS };
  }

  const topicsByPillar = new Map<
    string,
    Pick<TopicRow, "id" | "name" | "slug" | "description">[]
  >();
  for (const t of topicsRes.data ?? []) {
    const arr = topicsByPillar.get(t.pillar_id) ?? [];
    arr.push({ id: t.id, name: t.name, slug: t.slug, description: t.description });
    topicsByPillar.set(t.pillar_id, arr);
  }

  const articleCounts = new Map<string, number>();
  for (const a of articlesRes.data ?? []) {
    articleCounts.set(a.pillar_id, (articleCounts.get(a.pillar_id) ?? 0) + 1);
  }

  const items: ExplorePillarItem[] = (pillarsRes.data ?? []).map((pillar) => ({
    ...pillar,
    topics: topicsByPillar.get(pillar.id) ?? [],
    publishedArticlesCount: articleCounts.get(pillar.id) ?? 0,
  }));

  return { status: "ok", data: items };
}

export async function getPillarDetailBySlug(
  slug: string,
): Promise<QueryResult<PillarDetailData | null>> {
  const supabase = createPublicClient();
  if (!supabase) {
    return { status: "ok", data: getFallbackPillarDetail(slug) };
  }

  const { data: pillar, error: pillarError } = await supabase
    .from("pillars")
    .select("*")
    .eq("slug", slug)
    .eq("is_active", true)
    .maybeSingle();

  if (pillarError) {
    return { status: "ok", data: getFallbackPillarDetail(slug) };
  }
  if (!pillar) {
    return { status: "ok", data: getFallbackPillarDetail(slug) };
  }

  const [topicsRes, articlesRes, caseStudiesRes, statsRes] = await Promise.all([
    supabase
      .from("topics")
      .select("*")
      .eq("pillar_id", pillar.id)
      .eq("is_active", true)
      .order("display_order", { ascending: true }),
    supabase
      .from("articles")
      .select(
        "id, title, slug, excerpt, content, cover_image_path, featured, published_at, pillars(name, slug), topics(name)",
      )
      .eq("pillar_id", pillar.id)
      .eq("status", "published")
      .order("featured", { ascending: false })
      .order("published_at", { ascending: false })
      .limit(9),
    supabase
      .from("case_studies")
      .select(
        "id, title, slug, summary, country, region, latitude, longitude, cover_image_path, organization, start_date, end_date, published_at, pillars(name, slug)",
      )
      .eq("pillar_id", pillar.id)
      .eq("status", "published")
      .order("published_at", { ascending: false })
      .limit(6),
    supabase
      .from("statistics")
      .select(
        "*, pillars(name, slug), references(id, title, organization, source_type, source_url, publication_date)",
      )
      .eq("pillar_id", pillar.id)
      .eq("status", "published")
      .order("measurement_year", { ascending: false }),
  ]);

  const fallback = getFallbackPillarDetail(slug);
  const articleIds = (articlesRes.data ?? []).map((a) => a.id);
  const caseStudyIds = (caseStudiesRes.data ?? []).map((c) => c.id);
  const refIdSet = new Set<string>();

  for (const stat of statsRes.data ?? []) {
    refIdSet.add(stat.reference_id);
  }

  const [artRefLinks, csRefLinks] = await Promise.all([
    articleIds.length > 0
      ? supabase.from("article_references").select("reference_id").in("article_id", articleIds)
      : Promise.resolve({ data: [], error: null }),
    caseStudyIds.length > 0
      ? supabase
          .from("case_study_references")
          .select("reference_id")
          .in("case_study_id", caseStudyIds)
      : Promise.resolve({ data: [], error: null }),
  ]);

  for (const r of artRefLinks.data ?? []) refIdSet.add(r.reference_id);
  for (const r of csRefLinks.data ?? []) refIdSet.add(r.reference_id);

  let references: ReferenceRow[] = [];
  if (refIdSet.size > 0) {
    const { data: refsData } = await supabase
      .from("references")
      .select("*")
      .in("id", Array.from(refIdSet))
      .order("publication_date", { ascending: false });
    references = refsData ?? [];
  }

  return {
    status: "ok",
    data: {
      pillar,
      topics:
        (topicsRes.data?.length ?? 0) > 0 ? (topicsRes.data ?? []) : (fallback?.topics ?? []),
      articles:
        (articlesRes.data?.length ?? 0) > 0
          ? (articlesRes.data ?? []).map(mapArticleCard)
          : (fallback?.articles ?? []),
      caseStudies:
        (caseStudiesRes.data?.length ?? 0) > 0
          ? (caseStudiesRes.data ?? []).map(mapCaseStudyCard)
          : (fallback?.caseStudies ?? []),
      statistics:
        (statsRes.data?.length ?? 0) > 0
          ? (statsRes.data ?? []).map(mapStatisticWithSource)
          : (fallback?.statistics ?? []),
      references: references.length > 0 ? references : (fallback?.references ?? []),
    },
  };
}

export async function getStoriesList(options: {
  readonly search?: string;
  readonly pillarSlug?: string;
  readonly page?: number;
  readonly pageSize?: number;
}): Promise<QueryResult<StoriesPageData>> {
  const supabase = createPublicClient();
  if (!supabase) {
    return { status: "ok", data: getFallbackStoriesList(options) };
  }

  const page = Math.max(1, options.page ?? 1);
  const pageSize = options.pageSize ?? 9;
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const { data: pillarsData, error: pillarsError } = await supabase
    .from("pillars")
    .select("id, name, slug")
    .eq("is_active", true)
    .order("display_order", { ascending: true });

  if (pillarsError || (pillarsData?.length ?? 0) === 0) {
    return { status: "ok", data: getFallbackStoriesList(options) };
  }

  const pillars = pillarsData ?? [];
  const selectedPillar =
    options.pillarSlug && options.pillarSlug !== "all"
      ? pillars.find((p) => p.slug === options.pillarSlug)
      : undefined;

  let query = supabase
    .from("articles")
    .select(
      "id, title, slug, excerpt, content, cover_image_path, featured, published_at, pillars(name, slug), topics(name)",
      { count: "exact" },
    )
    .eq("status", "published");

  if (selectedPillar) {
    query = query.eq("pillar_id", selectedPillar.id);
  } else if (options.pillarSlug && options.pillarSlug !== "all") {
    return {
      status: "ok",
      data: {
        featuredStory: null,
        articles: [],
        totalCount: 0,
        page,
        pageSize,
        pillars,
      },
    };
  }

  const search = options.search?.trim();
  if (search) {
    const escaped = search.replace(/[%_]/g, "\\$&");
    query = query.or(`title.ilike.%${escaped}%,excerpt.ilike.%${escaped}%`);
  }

  query = query.order("published_at", { ascending: false }).range(from, to);

  const [articlesRes, featuredRes] = await Promise.all([
    query,
    !search && !selectedPillar && page === 1
      ? supabase
          .from("articles")
          .select(
            "id, title, slug, excerpt, content, cover_image_path, featured, published_at, pillars(name, slug), topics(name)",
          )
          .eq("status", "published")
          .eq("featured", true)
          .order("published_at", { ascending: false })
          .limit(1)
          .maybeSingle()
      : Promise.resolve({ data: null, error: null }),
  ]);

  if (articlesRes.error || ((articlesRes.count ?? 0) === 0 && !search && !selectedPillar)) {
    return { status: "ok", data: getFallbackStoriesList(options) };
  }

  return {
    status: "ok",
    data: {
      featuredStory: featuredRes.data ? mapArticleCard(featuredRes.data) : null,
      articles: (articlesRes.data ?? []).map(mapArticleCard),
      totalCount: articlesRes.count ?? 0,
      page,
      pageSize,
      pillars,
    },
  };
}

export async function getStoryDetailBySlug(
  slug: string,
): Promise<QueryResult<StoryDetailData | null>> {
  const fallbackMatch = FALLBACK_ARTICLES_FULL.find((a) => a.slug === slug);
  const fallbackDetail: StoryDetailData | null = fallbackMatch
    ? {
        article: fallbackMatch,
        references: FALLBACK_REFERENCES,
        relatedArticles: FALLBACK_ARTICLE_CARDS.filter((a) => a.slug !== slug).slice(0, 3),
      }
    : null;

  const supabase = createPublicClient();
  if (!supabase) {
    return { status: "ok", data: fallbackDetail };
  }

  const { data: article, error } = await supabase
    .from("articles")
    .select("*, pillars(id, name, slug), topics(name)")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  if (error || !article) {
    return { status: "ok", data: fallbackDetail };
  }

  const pillarObj = article.pillars as { id?: string; name?: string; slug?: string } | null;
  const topicObj = article.topics as { name?: string } | null;

  const [refLinksRes, relatedRes] = await Promise.all([
    supabase
      .from("article_references")
      .select("references(*)")
      .eq("article_id", article.id),
    supabase
      .from("articles")
      .select(
        "id, title, slug, excerpt, content, cover_image_path, featured, published_at, pillars(name, slug), topics(name)",
      )
      .eq("status", "published")
      .eq("pillar_id", article.pillar_id)
      .neq("id", article.id)
      .order("published_at", { ascending: false })
      .limit(3),
  ]);

  const references = (refLinksRes.data ?? [])
    .map((row) => row.references as ReferenceRow | null)
    .filter((ref): ref is ReferenceRow => Boolean(ref));

  return {
    status: "ok",
    data: {
      article: {
        ...article,
        pillarName: pillarObj?.name ?? "Environment",
        pillarSlug: pillarObj?.slug ?? "climate-atmosphere",
        topicName: topicObj?.name ?? null,
      },
      references: references.length > 0 ? references : FALLBACK_REFERENCES,
      relatedArticles:
        (relatedRes.data?.length ?? 0) > 0
          ? (relatedRes.data ?? []).map(mapArticleCard)
          : FALLBACK_ARTICLE_CARDS.filter((a) => a.slug !== slug).slice(0, 3),
    },
  };
}

export async function getOurPlanetData(): Promise<QueryResult<OurPlanetData>> {
  const supabase = createPublicClient();
  if (!supabase) {
    return {
      status: "ok",
      data: {
        pillars: FALLBACK_PILLARS,
        caseStudies: FALLBACK_CASE_STUDY_CARDS,
        statistics: FALLBACK_STATISTICS,
        references: FALLBACK_REFERENCES,
      },
    };
  }

  const [pillarsRes, caseStudiesRes, statsRes, refsRes] = await Promise.all([
    supabase
      .from("pillars")
      .select("*")
      .eq("is_active", true)
      .order("display_order", { ascending: true }),
    supabase
      .from("case_studies")
      .select(
        "id, title, slug, summary, country, region, latitude, longitude, cover_image_path, organization, start_date, end_date, published_at, pillars(name, slug)",
      )
      .eq("status", "published")
      .order("published_at", { ascending: false })
      .limit(12),
    supabase
      .from("statistics")
      .select(
        "*, pillars(name, slug), references(id, title, organization, source_type, source_url, publication_date)",
      )
      .eq("status", "published")
      .order("measurement_year", { ascending: false }),
    supabase.from("references").select("*").order("publication_date", { ascending: false }),
  ]);

  return {
    status: "ok",
    data: {
      pillars:
        !pillarsRes.error && (pillarsRes.data?.length ?? 0) > 0
          ? (pillarsRes.data ?? [])
          : FALLBACK_PILLARS,
      caseStudies:
        !caseStudiesRes.error && (caseStudiesRes.data?.length ?? 0) > 0
          ? (caseStudiesRes.data ?? []).map(mapCaseStudyCard)
          : FALLBACK_CASE_STUDY_CARDS,
      statistics:
        !statsRes.error && (statsRes.data?.length ?? 0) > 0
          ? (statsRes.data ?? []).map(mapStatisticWithSource)
          : FALLBACK_STATISTICS,
      references:
        !refsRes.error && (refsRes.data?.length ?? 0) > 0
          ? (refsRes.data ?? [])
          : FALLBACK_REFERENCES,
    },
  };
}

export async function getCaseStudyDetailBySlug(
  slug: string,
): Promise<QueryResult<CaseStudyDetailData | null>> {
  const fallbackMatch = FALLBACK_CASE_STUDIES_FULL.find((c) => c.slug === slug);
  const fallbackDetail: CaseStudyDetailData | null = fallbackMatch
    ? {
        caseStudy: fallbackMatch,
        references: FALLBACK_REFERENCES,
        relatedCaseStudies: FALLBACK_CASE_STUDY_CARDS.filter((c) => c.slug !== slug),
      }
    : null;

  const supabase = createPublicClient();
  if (!supabase) {
    return { status: "ok", data: fallbackDetail };
  }

  const { data: caseStudy, error } = await supabase
    .from("case_studies")
    .select("*, pillars(id, name, slug)")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  if (error || !caseStudy) {
    return { status: "ok", data: fallbackDetail };
  }

  const pillarObj = caseStudy.pillars as { id?: string; name?: string; slug?: string } | null;

  const [refLinksRes, relatedRes] = await Promise.all([
    supabase
      .from("case_study_references")
      .select("references(*)")
      .eq("case_study_id", caseStudy.id),
    supabase
      .from("case_studies")
      .select(
        "id, title, slug, summary, country, region, latitude, longitude, cover_image_path, organization, start_date, end_date, published_at, pillars(name, slug)",
      )
      .eq("status", "published")
      .eq("pillar_id", caseStudy.pillar_id)
      .neq("id", caseStudy.id)
      .order("published_at", { ascending: false })
      .limit(3),
  ]);

  const references = (refLinksRes.data ?? [])
    .map((row) => row.references as ReferenceRow | null)
    .filter((ref): ref is ReferenceRow => Boolean(ref));

  return {
    status: "ok",
    data: {
      caseStudy: {
        ...caseStudy,
        pillarName: pillarObj?.name ?? "Environment",
        pillarSlug: pillarObj?.slug ?? "climate-atmosphere",
      },
      references: references.length > 0 ? references : FALLBACK_REFERENCES,
      relatedCaseStudies:
        (relatedRes.data?.length ?? 0) > 0
          ? (relatedRes.data ?? []).map(mapCaseStudyCard)
          : FALLBACK_CASE_STUDY_CARDS.filter((c) => c.slug !== slug),
    },
  };
}

export async function getPublishedSitemapEntries(): Promise<{
  readonly pillars: readonly { slug: string; updated_at: string }[];
  readonly articles: readonly { slug: string; updated_at: string }[];
  readonly caseStudies: readonly { slug: string; updated_at: string }[];
}> {
  const supabase = createPublicClient();
  if (!supabase) {
    return {
      pillars: FALLBACK_PILLARS.map((p) => ({ slug: p.slug, updated_at: p.updated_at })),
      articles: FALLBACK_ARTICLES_FULL.map((a) => ({ slug: a.slug, updated_at: a.updated_at })),
      caseStudies: FALLBACK_CASE_STUDIES_FULL.map((c) => ({
        slug: c.slug,
        updated_at: c.updated_at,
      })),
    };
  }

  const [pillarsRes, articlesRes, caseStudiesRes] = await Promise.all([
    supabase.from("pillars").select("slug, updated_at").eq("is_active", true),
    supabase.from("articles").select("slug, updated_at").eq("status", "published"),
    supabase.from("case_studies").select("slug, updated_at").eq("status", "published"),
  ]);

  return {
    pillars:
      (pillarsRes.data?.length ?? 0) > 0
        ? (pillarsRes.data ?? [])
        : FALLBACK_PILLARS.map((p) => ({ slug: p.slug, updated_at: p.updated_at })),
    articles:
      (articlesRes.data?.length ?? 0) > 0
        ? (articlesRes.data ?? [])
        : FALLBACK_ARTICLES_FULL.map((a) => ({ slug: a.slug, updated_at: a.updated_at })),
    caseStudies:
      (caseStudiesRes.data?.length ?? 0) > 0
        ? (caseStudiesRes.data ?? [])
        : FALLBACK_CASE_STUDIES_FULL.map((c) => ({
            slug: c.slug,
            updated_at: c.updated_at,
          })),
  };
}
