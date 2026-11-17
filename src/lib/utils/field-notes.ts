import "server-only";

import { PUBLISHED_ARTICLES, PUBLISHED_CASE_STUDIES, getActiveTopicsForPillar, PILLARS } from "@/data";

export interface FieldNote {
  readonly title: string;
  readonly slug: string;
  readonly href: string;
  readonly kind: "story" | "case-study";
  readonly year: string;
  readonly location: string;
  readonly topic: string | null;
  readonly imageSrc: string;
}

const TOPIC_HEADINGS: Readonly<Record<string, string>> = {
  "topic-rising-temperatures": "Key Ecological Pressures",
  "topic-coral-reefs": "Observable Changes",
  "topic-primary-forests": "Why It Matters",
};

const PILLAR_BY_ID = new Map(PILLARS.map((pillar) => [pillar.id, pillar]));

function plainText(markdown: string | null | undefined): string {
  if (!markdown) return "";
  return markdown
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`([^`]*)`/g, "$1")
    .replace(/!\[[^\]]*\]\([^)]+\)/g, " ")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/^\s*[-*]\s+/gm, "")
    .replace(/^\s*\d+\.\s+/gm, "")
    .replace(/[>*_~]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

/** First standfirst paragraph of an article body, trimmed to a set number of words. */
function standfirst(markdown: string, maxWords = 34): string {
  const paragraphs = markdown
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter((block) => block && !block.startsWith("#") && !block.startsWith(">"));

  const source = paragraphs[0] ?? "";
  const words = plainText(source).split(" ").filter(Boolean);
  if (words.length <= maxWords) return words.join(" ");
  return `${words.slice(0, maxWords).join(" ")}…`;
}

/** Pulls one verbatim bullet fragment from the article body so notes stay quoted. */
function bodyFragment(markdown: string, heading: string, maxWords = 16): string | null {
  const lines = markdown.split("\n");
  const start = lines.findIndex((line) => line.trim() === `### ${heading}`);
  if (start === -1) return null;

  for (let index = start + 1; index < lines.length; index += 1) {
    const line = lines[index].trim();
    if (line.startsWith("#")) return null;
    if (!line.startsWith("-")) continue;

    const text = plainText(line.replace(/^\s*-\s+/, ""));
    const words = text.split(" ").filter(Boolean);
    const fragment = words.length <= maxWords ? words.join(" ") : `${words.slice(0, maxWords).join(" ")}…`;
    return fragment.replace(/[:.]$/, "");
  }

  return null;
}

function yearOf(value: string | null | undefined): string {
  if (!value) return "";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "" : String(date.getUTCFullYear());
}

/**
 * Homepage field notes: the three most recent published stories and case
 * studies, flattened into one chronological, cited ledger.
 */
export function getHomeFieldNotes(limit = 6): readonly FieldNote[] {
  const stories: FieldNote[] = PUBLISHED_ARTICLES.slice(0, 4).map((article) => {
    const pillar = PILLAR_BY_ID.get(article.pillar_id);
    return {
      title: article.title,
      slug: article.slug,
      href: `/stories/${article.slug}`,
      kind: "story",
      year: yearOf(article.published_at),
      location: pillar?.name ?? "Editorial",
      topic: article.topic_id,
      imageSrc: article.cover_image_path ?? pillar?.cover_image_path ?? "/images/hero-planet.jpg",
    };
  });

  const cases: FieldNote[] = PUBLISHED_CASE_STUDIES.slice(0, 3).map((caseStudy) => ({
    title: caseStudy.title,
    slug: caseStudy.slug,
    href: `/case-studies/${caseStudy.slug}`,
    kind: "case-study",
    year: yearOf(caseStudy.published_at),
    location: caseStudy.country,
    topic: null,
    imageSrc: caseStudy.cover_image_path ?? "/images/hero-planet.jpg",
  }));

  const merged = [...stories, ...cases].sort((a, b) => b.year.localeCompare(a.year));
  return merged.slice(0, limit);
}

export function getNoteStandfirst(slug: string): string {
  const article = PUBLISHED_ARTICLES.find((item) => item.slug === slug);
  return article ? standfirst(article.content) : "";
}

export function getNoteFragment(slug: string): string | null {
  const article = PUBLISHED_ARTICLES.find((item) => item.slug === slug);
  if (!article) return null;
  const heading = article.topic_id ? TOPIC_HEADINGS[article.topic_id] : undefined;
  return heading ? bodyFragment(article.content, heading) : null;
}

export function getActiveTopicNames(pillarId: string): readonly string[] {
  return getActiveTopicsForPillar(pillarId).map((topic) => topic.name);
}
