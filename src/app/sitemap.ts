import type { MetadataRoute } from "next";
import { getSiteBaseUrl } from "@/config/site";
import { getPublishedSitemapEntries } from "@/features/public/queries";

const STATIC_PUBLIC_ROUTES = [
  { path: "", changeFrequency: "weekly" as const, priority: 1.0 },
  { path: "/about", changeFrequency: "monthly" as const, priority: 0.7 },
  { path: "/explore", changeFrequency: "weekly" as const, priority: 0.9 },
  { path: "/stories", changeFrequency: "daily" as const, priority: 0.9 },
  { path: "/our-planet", changeFrequency: "weekly" as const, priority: 0.9 },
  { path: "/solutions", changeFrequency: "monthly" as const, priority: 0.8 },
  { path: "/contact", changeFrequency: "yearly" as const, priority: 0.5 },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getSiteBaseUrl();
  const dynamicEntries = await getPublishedSitemapEntries();

  const staticEntries: MetadataRoute.Sitemap = STATIC_PUBLIC_ROUTES.map((route) => ({
    url: `${baseUrl}${route.path || "/"}`,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  const pillarEntries: MetadataRoute.Sitemap = dynamicEntries.pillars.map((pillar) => ({
    url: `${baseUrl}/explore/${pillar.slug}`,
    lastModified: pillar.updated_at ? new Date(pillar.updated_at) : undefined,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const articleEntries: MetadataRoute.Sitemap = dynamicEntries.articles.map((article) => ({
    url: `${baseUrl}/stories/${article.slug}`,
    lastModified: article.updated_at ? new Date(article.updated_at) : undefined,
    changeFrequency: "monthly",
    priority: 0.75,
  }));

  const caseStudyEntries: MetadataRoute.Sitemap = dynamicEntries.caseStudies.map((study) => ({
    url: `${baseUrl}/case-studies/${study.slug}`,
    lastModified: study.updated_at ? new Date(study.updated_at) : undefined,
    changeFrequency: "monthly",
    priority: 0.75,
  }));

  return [...staticEntries, ...pillarEntries, ...articleEntries, ...caseStudyEntries];
}
