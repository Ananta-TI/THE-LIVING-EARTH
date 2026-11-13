import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Breadcrumbs } from "@/components/public/breadcrumbs";
import { CTASection } from "@/components/public/cta-section";
import { LoadingState } from "@/components/public/loading-state";
import { PageHeroBanner } from "@/components/public/page-hero-banner";
import { PillarGrid, type PillarGridItem } from "@/components/public/pillar-grid";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getExploreOverview } from "@/features/public/queries";
import { CONTENT_PILLARS } from "@/lib/constants/pillars";

export const metadata: Metadata = {
  title: "Explore Environmental Pillars",
  description:
    "Discover the five interconnected environmental pillars of THE LIVING EARTH: Climate & Atmosphere, Oceans & Water, Forests & Biodiversity, Pollution & Human Impact, and Solutions & Restoration.",
  alternates: {
    canonical: "/explore",
  },
};

const FALLBACK_EXPLORE_PILLARS: readonly PillarGridItem[] = CONTENT_PILLARS.map((p) => ({
  id: p.slug,
  slug: p.slug,
  name: p.title,
  description: p.subtitle,
  cover_image_path: null,
}));

async function ExplorePillarsContent() {
  const result = await getExploreOverview();
  const pillars: readonly PillarGridItem[] =
    result.status === "ok" && result.data.length > 0
      ? result.data
      : FALLBACK_EXPLORE_PILLARS;

  const allTopics =
    result.status === "ok"
      ? result.data.flatMap((pillar) =>
          pillar.topics.map((topic) => ({
            ...topic,
            pillarSlug: pillar.slug,
            pillarName: pillar.name,
          })),
        )
      : [];

  return (
    <div className="space-y-12">
      <PillarGrid pillars={pillars} variant="portrait" />

      {allTopics.length > 0 ? (
        <section
          aria-labelledby="explore-topics-heading"
          className="rounded-2xl border border-border bg-card p-6 sm:p-8"
        >
          <h2
            id="explore-topics-heading"
            className="font-heading text-2xl font-medium text-foreground"
          >
            Active Research Topics
          </h2>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Browse curated environmental subtopics indexed inside each pillar.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            {allTopics.map((topic) => (
              <Link
                key={topic.id}
                href={`/explore/${topic.pillarSlug}`}
                className="focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              >
                <Badge
                  variant="secondary"
                  className="px-3 py-1 text-xs font-medium hover:bg-primary hover:text-primary-foreground"
                >
                  {topic.name}
                </Badge>
              </Link>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}

export default function ExplorePage() {
  return (
    <>
      <PageHeroBanner
        eyebrow="Five Knowledge Domains"
        title="Explore Our Planet"
        description="Discover the five interconnected pillars of our environmental world—climate, oceans, forests, human impact, and restoration."
        imageSrc="/images/about-earth.jpg"
        imageAlt="High-altitude coastal river delta flowing into azure ocean reefs"
      >
        <Breadcrumbs tone="dark" items={[{ label: "Home", href: "/" }, { label: "Explore" }]} />
      </PageHeroBanner>

      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
        <Suspense fallback={<LoadingState label="Loading environmental pillars and topics..." />}>
          <ExplorePillarsContent />
        </Suspense>

        <section
          aria-labelledby="explore-cross-nav-heading"
          className="mt-14 rounded-3xl border border-border bg-card p-8"
        >
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
            <div className="max-w-2xl space-y-2">
              <h2
                id="explore-cross-nav-heading"
                className="font-heading text-2xl font-medium text-foreground sm:text-3xl"
              >
                Looking for cross-cutting global indicators?
              </h2>
              <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
                Visit Our Planet for global pressure breakdowns and comparative data visualizations,
                or read published dispatches across all pillars in Stories.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg" className="h-11 rounded-full px-6">
                <Link href="/our-planet" className="gap-2">
                  <span>Explore Our Planet</span>
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="h-11 rounded-full px-6">
                <Link href="/stories">Browse Stories</Link>
              </Button>
            </div>
          </div>
        </section>

        <div className="mt-14">
          <CTASection
            title="Have a field topic or verified dataset to suggest?"
            description="Reach out to our editorial team to share environmental research leads or educational feedback."
            primaryLabel="Contact Us"
            primaryHref="/contact"
            secondaryLabel="Explore Solutions"
            secondaryHref="/solutions"
          />
        </div>
      </div>
    </>
  );
}
