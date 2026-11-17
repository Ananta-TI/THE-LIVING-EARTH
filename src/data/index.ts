import "server-only";

import type {
  ArticleRecord,
  ArticleReferenceRecord,
  CaseStudyRecord,
  CaseStudyReferenceRecord,
  PillarRecord,
  ReferenceRecord,
  SiteSettingsRecord,
  StatisticRecord,
  TopicRecord,
} from "@/types/content-data";

import articlesJson from "./articles.json";
import articleReferencesJson from "./article-references.json";
import caseStudiesJson from "./case-studies.json";
import caseStudyReferencesJson from "./case-study-references.json";
import pillarsJson from "./pillars.json";
import referencesJson from "./references.json";
import siteSettingsJson from "./site-settings.json";
import statisticsJson from "./statistics.json";
import topicsJson from "./topics.json";

/**
 * Static editorial content for THE LIVING EARTH.
 *
 * The JSON files in this directory are the single source of truth for the
 * public site. No database or network request is required at runtime, so
 * public routes never depend on an external data service.
 */
export const PILLARS = pillarsJson as unknown as readonly PillarRecord[];
export const TOPICS = topicsJson as unknown as readonly TopicRecord[];
export const REFERENCES = referencesJson as unknown as readonly ReferenceRecord[];
export const STATISTICS = statisticsJson as unknown as readonly StatisticRecord[];
export const ARTICLES = articlesJson as unknown as readonly ArticleRecord[];
export const CASE_STUDIES = caseStudiesJson as unknown as readonly CaseStudyRecord[];
export const ARTICLE_REFERENCES =
  articleReferencesJson as unknown as readonly ArticleReferenceRecord[];
export const CASE_STUDY_REFERENCES =
  caseStudyReferencesJson as unknown as readonly CaseStudyReferenceRecord[];
export const SITE_SETTINGS = siteSettingsJson as unknown as SiteSettingsRecord;

export const PUBLISHED_ARTICLES = ARTICLES.filter((article) => article.status === "published");
export const PUBLISHED_CASE_STUDIES = CASE_STUDIES.filter(
  (caseStudy) => caseStudy.status === "published",
);
export const PUBLISHED_STATISTICS = STATISTICS.filter(
  (statistic) => statistic.status === "published",
);

export const PILLARS_BY_ID = new Map(PILLARS.map((pillar) => [pillar.id, pillar]));
export const PILLARS_BY_SLUG = new Map(PILLARS.map((pillar) => [pillar.slug, pillar]));
export const TOPICS_BY_ID = new Map(TOPICS.map((topic) => [topic.id, topic]));
export const REFERENCES_BY_ID = new Map(REFERENCES.map((reference) => [reference.id, reference]));

export function comparePublishedAtDesc(
  left: { readonly published_at: string | null },
  right: { readonly published_at: string | null },
): number {
  const leftTime = left.published_at ? new Date(left.published_at).getTime() : 0;
  const rightTime = right.published_at ? new Date(right.published_at).getTime() : 0;
  return rightTime - leftTime;
}

export function getActiveTopicsForPillar(pillarId: string): readonly TopicRecord[] {
  return TOPICS.filter((topic) => topic.pillar_id === pillarId && topic.is_active).sort(
    (a, b) => a.display_order - b.display_order,
  );
}

/**
 * Resolve the references genuinely linked to one article or case study.
 *
 * Only rows present in the join table are returned. Previously every remaining
 * reference in the catalogue was appended to each record, which made a study
 * that cites one source appear to cite all of them — the page then listed
 * unrelated material under "supporting documentation".
 */
function resolveReferences(
  linkedReferenceIds: readonly string[],
): readonly ReferenceRecord[] {
  return linkedReferenceIds
    .map((referenceId) => REFERENCES_BY_ID.get(referenceId))
    .filter((reference): reference is ReferenceRecord => Boolean(reference));
}

export function getReferencesForArticle(articleId: string): readonly ReferenceRecord[] {
  const linkedIds = ARTICLE_REFERENCES.filter((link) => link.article_id === articleId).map(
    (link) => link.reference_id,
  );
  return resolveReferences(linkedIds);
}

export function getReferencesForCaseStudy(caseStudyId: string): readonly ReferenceRecord[] {
  const linkedIds = CASE_STUDY_REFERENCES.filter(
    (link) => link.case_study_id === caseStudyId,
  ).map((link) => link.reference_id);
  return resolveReferences(linkedIds);
}
