import type { Metadata } from "next";
import { Suspense } from "react";
import { LoadingState } from "@/components/public/loading-state";
import { SolutionsInteractiveView } from "@/components/public/solutions-interactive-view";
import { getPillarDetailBySlug } from "@/features/public/queries";

export const metadata: Metadata = {
  title: "Solutions & Restoration",
  description:
    "Explore grounded climate action, renewable energy transitions, forest and marine conservation, circular economy practices, ecosystem restoration, and community participation.",
  alternates: {
    canonical: "/solutions",
  },
};

async function SolutionsContent() {
  const result = await getPillarDetailBySlug("solutions-restoration");

  const articles = result.status === "ok" && result.data ? result.data.articles : [];
  const caseStudies = result.status === "ok" && result.data ? result.data.caseStudies : [];

  return (
    <SolutionsInteractiveView
      articles={articles.map((a) => ({
        id: a.id,
        title: a.title,
        slug: a.slug,
        excerpt: a.excerpt,
        content: a.content,
        cover_image_path: a.cover_image_path,
        pillarName: a.pillarName,
        pillarSlug: a.pillarSlug,
        published_at: a.published_at,
        topicName: a.topicName,
      }))}
      caseStudies={caseStudies.map((cs) => ({
        id: cs.id,
        title: cs.title,
        slug: cs.slug,
        summary: cs.summary,
        country: cs.country,
        region: cs.region,
        cover_image_path: cs.cover_image_path,
        pillarName: cs.pillarName,
        pillarSlug: cs.pillarSlug,
        organization: cs.organization,
        start_date: cs.start_date,
        end_date: cs.end_date,
      }))}
    />
  );
}

export default function SolutionsPage() {
  return (
    <Suspense fallback={<LoadingState label="Loading solutions..." />}>
      <SolutionsContent />
    </Suspense>
  );
}