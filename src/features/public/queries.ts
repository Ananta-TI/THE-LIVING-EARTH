import "server-only";

import {
  ARTICLES,
  CASE_STUDIES,
  PILLARS,
  PILLARS_BY_ID,
  PILLARS_BY_SLUG,
  PUBLISHED_ARTICLES,
  PUBLISHED_CASE_STUDIES,
  PUBLISHED_STATISTICS,
  REFERENCES,
  REFERENCES_BY_ID,
  TOPICS_BY_ID,
  comparePublishedAtDesc,
  getActiveTopicsForPillar,
  getReferencesForArticle,
  getReferencesForCaseStudy,
} from "@/data";
import type {
  ArticleRecord,
  CaseStudyRecord,
  PillarRecord,
  ReferenceRecord,
  StatisticRecord,
  TopicRecord,
} from "@/types/content-data";

export type PillarRow = PillarRecord;
export type TopicRow = TopicRecord;
export type ArticleRow = ArticleRecord;
export type CaseStudyRow = CaseStudyRecord;
export type StatisticRow = StatisticRecord;
export type ReferenceRow = ReferenceRecord;

/**
 * Public content now comes from static JSON, so `ok` is always returned.
 * The other variants are kept so existing route-level error boundaries and
 * future data adapters can use the same contract.
 */
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

function getActivePillars(): readonly PillarRow[] {
  return PILLARS.filter((pillar) => pillar.is_active).sort(
    (a, b) => a.display_order - b.display_order,
  );
}

function mapArticleCard(row: ArticleRecord): PublicArticleCard {
  const pillar = PILLARS_BY_ID.get(row.pillar_id);
  const topic = row.topic_id ? TOPICS_BY_ID.get(row.topic_id) : undefined;

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

function mapCaseStudyCard(row: CaseStudyRecord): PublicCaseStudyCard {
  const pillar = PILLARS_BY_ID.get(row.pillar_id);

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

function mapStatisticWithSource(row: StatisticRecord): PublicStatisticWithSource {
  const pillar = PILLARS_BY_ID.get(row.pillar_id);
  const reference = REFERENCES_BY_ID.get(row.reference_id) ?? null;

  return {
    ...row,
    pillarName: pillar?.name ?? "Environment",
    pillarSlug: pillar?.slug ?? "climate-atmosphere",
    reference: reference
      ? {
          id: reference.id,
          title: reference.title,
          organization: reference.organization,
          source_type: reference.source_type,
          source_url: reference.source_url,
          publication_date: reference.publication_date,
        }
      : null,
  };
}

export async function getHomePageData(): Promise<QueryResult<HomePageData>> {
  return {
    status: "ok",
    data: {
      pillars: getActivePillars(),
      featuredStories: PUBLISHED_ARTICLES.slice(1, 4).map(mapArticleCard),
      keyStatistics: PUBLISHED_STATISTICS.map(mapStatisticWithSource),
    },
  };
}

export async function getExploreOverview(): Promise<QueryResult<readonly ExplorePillarItem[]>> {
  const pillars = getActivePillars();
  const articleCounts = new Map<string, number>();
  for (const article of PUBLISHED_ARTICLES) {
    articleCounts.set(article.pillar_id, (articleCounts.get(article.pillar_id) ?? 0) + 1);
  }

  return {
    status: "ok",
    data: pillars.map((pillar) => ({
      ...pillar,
      topics: getActiveTopicsForPillar(pillar.id).map((topic) => ({
        id: topic.id,
        name: topic.name,
        slug: topic.slug,
        description: topic.description,
      })),
      publishedArticlesCount: articleCounts.get(pillar.id) ?? 0,
    })),
  };
}

export async function getPillarDetailBySlug(
  slug: string,
): Promise<QueryResult<PillarDetailData | null>> {
  const pillar = PILLARS_BY_SLUG.get(slug);

  if (!pillar || !pillar.is_active) {
    return { status: "ok", data: null };
  }

  const articles = PUBLISHED_ARTICLES.filter(
    (article) => article.pillar_id === pillar.id,
  )
    .sort(
      (a, b) =>
        Number(b.featured) - Number(a.featured) || comparePublishedAtDesc(a, b),
    )
    .slice(0, 9)
    .map(mapArticleCard);

  const caseStudies = PUBLISHED_CASE_STUDIES.filter(
    (caseStudy) => caseStudy.pillar_id === pillar.id,
  )
    .sort(comparePublishedAtDesc)
    .slice(0, 6)
    .map(mapCaseStudyCard);

  const statistics = PUBLISHED_STATISTICS.filter(
    (statistic) => statistic.pillar_id === pillar.id,
  )
    .sort((a, b) => b.measurement_year - a.measurement_year)
    .map(mapStatisticWithSource);

  return {
    status: "ok",
    data: {
      pillar,
      topics: getActiveTopicsForPillar(pillar.id),
      articles,
      caseStudies,
      statistics,
      references: REFERENCES,
    },
  };
}

export async function getStoriesList(options: {
  readonly search?: string;
  readonly pillarSlug?: string;
  readonly page?: number;
  readonly pageSize?: number;
}): Promise<QueryResult<StoriesPageData>> {
  const page = Math.max(1, options.page ?? 1);
  const pageSize = options.pageSize ?? 9;
  const search = options.search?.trim().toLowerCase() ?? "";
  const selectedPillar =
    options.pillarSlug && options.pillarSlug !== "all"
      ? PILLARS_BY_SLUG.get(options.pillarSlug)
      : undefined;

  let filtered = [...PUBLISHED_ARTICLES].sort(comparePublishedAtDesc);

  if (selectedPillar) {
    filtered = filtered.filter((article) => article.pillar_id === selectedPillar.id);
  } else if (options.pillarSlug && options.pillarSlug !== "all") {
    filtered = [];
  }

  if (search) {
    filtered = filtered.filter(
      (article) =>
        article.title.toLowerCase().includes(search) ||
        article.excerpt.toLowerCase().includes(search),
    );
  }

  const featuredStory =
    page === 1 && !search && !selectedPillar
      ? (filtered.find((article) => article.featured) ?? filtered[0] ?? null)
      : null;

  const from = (page - 1) * pageSize;
  const paged = filtered.slice(from, from + pageSize);

  return {
    status: "ok",
    data: {
      featuredStory: featuredStory ? mapArticleCard(featuredStory) : null,
      articles: paged.map(mapArticleCard),
      totalCount: filtered.length,
      page,
      pageSize,
      pillars: getActivePillars().map((pillar) => ({
        id: pillar.id,
        name: pillar.name,
        slug: pillar.slug,
      })),
    },
  };
}

export async function getStoryDetailBySlug(
  slug: string,
): Promise<QueryResult<StoryDetailData | null>> {
  const article = PUBLISHED_ARTICLES.find((item) => item.slug === slug);

  if (!article) {
    return { status: "ok", data: null };
  }

  const pillar = PILLARS_BY_ID.get(article.pillar_id);
  const topic = article.topic_id ? TOPICS_BY_ID.get(article.topic_id) : undefined;
  const relatedArticles = PUBLISHED_ARTICLES.filter((item) => item.id !== article.id)
    .sort(comparePublishedAtDesc)
    .slice(0, 3)
    .map(mapArticleCard);

  return {
    status: "ok",
    data: {
      article: {
        ...article,
        pillarName: pillar?.name ?? "Environment",
        pillarSlug: pillar?.slug ?? "climate-atmosphere",
        topicName: topic?.name ?? null,
      },
      references: getReferencesForArticle(article.id),
      relatedArticles,
    },
  };
}

export async function getOurPlanetData(): Promise<QueryResult<OurPlanetData>> {
  return {
    status: "ok",
    data: {
      pillars: getActivePillars(),
      caseStudies: [...PUBLISHED_CASE_STUDIES]
        .sort(comparePublishedAtDesc)
        .slice(0, 12)
        .map(mapCaseStudyCard),
      statistics: [...PUBLISHED_STATISTICS]
        .sort((a, b) => b.measurement_year - a.measurement_year)
        .map(mapStatisticWithSource),
      references: REFERENCES,
    },
  };
}

export async function getCaseStudyDetailBySlug(
  slug: string,
): Promise<QueryResult<CaseStudyDetailData | null>> {
  const caseStudy = PUBLISHED_CASE_STUDIES.find((item) => item.slug === slug);

  if (!caseStudy) {
    return { status: "ok", data: null };
  }

  const pillar = PILLARS_BY_ID.get(caseStudy.pillar_id);
  const relatedCaseStudies = PUBLISHED_CASE_STUDIES.filter(
    (item) => item.id !== caseStudy.id,
  )
    .sort(comparePublishedAtDesc)
    .map(mapCaseStudyCard);

  return {
    status: "ok",
    data: {
      caseStudy: {
        ...caseStudy,
        pillarName: pillar?.name ?? "Environment",
        pillarSlug: pillar?.slug ?? "climate-atmosphere",
      },
      references: getReferencesForCaseStudy(caseStudy.id),
      relatedCaseStudies,
    },
  };
}

export async function getPublishedSitemapEntries(): Promise<{
  readonly pillars: readonly { slug: string; updated_at: string }[];
  readonly articles: readonly { slug: string; updated_at: string }[];
  readonly caseStudies: readonly { slug: string; updated_at: string }[];
}> {
  return {
    pillars: getActivePillars().map((pillar) => ({
      slug: pillar.slug,
      updated_at: pillar.updated_at,
    })),
    articles: PUBLISHED_ARTICLES.map((article) => ({
      slug: article.slug,
      updated_at: article.updated_at,
    })),
    caseStudies: PUBLISHED_CASE_STUDIES.map((caseStudy) => ({
      slug: caseStudy.slug,
      updated_at: caseStudy.updated_at,
    })),
  };
}

export { ARTICLES, CASE_STUDIES, PILLARS, REFERENCES };
