import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { AnimatedContent } from "@/components/public/animated-content";
import { EditorialPageHero } from "@/components/public/editorial-page-hero";
import { EditorialSection } from "@/components/public/editorial-section";
import { LoadingState } from "@/components/public/loading-state";
import { PillarLedger } from "@/components/public/pillar-ledger";
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

interface ExplorePillarItem {
  readonly id: string;
  readonly slug: string;
  readonly name: string;
  readonly description: string;
  readonly cover_image_path: string | null;
  readonly topics: readonly {
    readonly id: string;
    readonly name: string;
    readonly slug: string;
    readonly description: string;
  }[];
  readonly publishedArticlesCount: number;
}

const FALLBACK_PILLARS: readonly ExplorePillarItem[] = CONTENT_PILLARS.map((pillar) => ({
  id: pillar.slug,
  slug: pillar.slug,
  name: pillar.title,
  description: pillar.subtitle,
  cover_image_path: null,
  topics: [],
  publishedArticlesCount: 0,
}));

const DOMAIN_QUESTIONS: readonly {
  readonly domain: string;
  readonly question: string;
  readonly href: string;
}[] = [
  {
    domain: "Climate",
    question: "How fast is the atmosphere warming, and what does each fraction of a degree change?",
    href: "/explore/climate-atmosphere",
  },
  {
    domain: "Oceans",
    question: "What happens to marine chemistry, coral reefs, and freshwater when heat accumulates?",
    href: "/explore/oceans-water",
  },
  {
    domain: "Forests",
    question: "Which canopies are irreplaceable, and what lives inside them?",
    href: "/explore/forests-biodiversity",
  },
  {
    domain: "Human impact",
    question: "Where do pollution, waste, and land conversion land in the end?",
    href: "/explore/pollution-human-impact",
  },
  {
    domain: "Restoration",
    question: "Which interventions are documented to work, and on what timescale?",
    href: "/explore/solutions-restoration",
  },
];

async function ExploreLedger() {
  const result = await getExploreOverview();
  const pillars: readonly ExplorePillarItem[] =
    result.status === "ok" && result.data.length > 0 ? result.data : FALLBACK_PILLARS;

  const topicCount = pillars.reduce((total, pillar) => total + pillar.topics.length, 0);
  const noteCount = pillars.reduce(
    (total, pillar) => total + pillar.publishedArticlesCount,
    0,
  );

  return (
    <>
      <div className="flex flex-wrap items-baseline gap-x-8 gap-y-2 border-t border-border pt-6 font-mono text-[10px] tracking-[0.12em] text-earth-muted">
        <span className="tabular-nums">
          {pillars.length} DOMAINS
        </span>
        <span className="tabular-nums">{topicCount} INDEXED TOPICS</span>
        <span className="tabular-nums">{noteCount} PUBLISHED NOTES</span>
      </div>

      <div className="mt-10">
        <AnimatedContent distance={24} duration={0.75} threshold={0.05} stagger={0.07}>
          <PillarLedger pillars={pillars} />
        </AnimatedContent>
      </div>
    </>
  );
}

/** Static list: the questions each domain is responsible for answering. */
function DomainQuestions() {
  return (
    <AnimatedContent distance={24} duration={0.7} threshold={0.05} stagger={0.08}>
      <ol className="grid border-t border-border lg:grid-cols-5">
      {DOMAIN_QUESTIONS.map((item, index) => (
        <li
          key={item.domain}
          className="border-b border-border px-0 py-6 lg:border-b-0 lg:border-l lg:px-6 lg:first:border-l-0 lg:first:pl-0"
        >
          <Link
            href={item.href}
            className="group/q block focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
          >
            <p className="font-mono text-[10px] tracking-[0.12em] text-earth-muted tabular-nums">
              {String(index + 1).padStart(2, "0")} &middot; {item.domain}
            </p>
            <p className="mt-4 font-heading text-lg leading-snug text-foreground transition-colors duration-200 group-hover/q:text-primary">
              {item.question}
            </p>
            <span
              aria-hidden="true"
              className="mt-5 block h-px w-0 bg-primary transition-[width] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/q:w-14 motion-reduce:transition-none"
            />
          </Link>
        </li>
      ))}
      </ol>
    </AnimatedContent>
  );
}

export default function ExplorePage() {
  return (
    <>
      <EditorialPageHero
        index="Section 02"
        context="The five domains"
        title="Explore Our Planet"
        standfirst="Five interconnected systems — atmosphere, water, forest, human pressure, and restoration. Each domain holds its own indexed topics, published notes, field studies, and measurements."
        imageSrc="/images/about-earth.jpg"
        imageAlt="High-altitude coastal river delta flowing into azure ocean reefs"
      />

      <div className="mx-auto w-full max-w-[1400px] px-4 py-16 sm:px-6 sm:py-20 lg:px-10">
        <Suspense fallback={<LoadingState label="Loading the five domains..." />}>
          <ExploreLedger />
        </Suspense>

        <EditorialSection
          className="mt-20 scroll-mt-28 sm:mt-28"
          headingId="explore-questions-heading"
          index="Section 03"
          title="What each domain is responsible for answering"
          lede="The archive is organised around questions rather than subjects. Every note, study, and measurement filed under a domain exists to close one of these gaps."
        >
          <DomainQuestions />
        </EditorialSection>

        <EditorialSection
          className="mt-20 scroll-mt-28 sm:mt-28"
          headingId="explore-cross-heading"
          index="Section 04"
          title="Where the domains meet"
          lede="Cross-cutting pressures rarely respect a single domain. Our Planet holds the global breakdowns and comparative measurements; Stories holds the reporting that connects them."
          aside={
            <div className="flex flex-wrap items-center gap-x-7 gap-y-3">
              <Link
                href="/our-planet"
                className="group/x inline-flex items-center gap-2 border-b border-foreground/25 pb-1 text-sm font-medium text-foreground transition-colors duration-200 hover:border-primary hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
              >
                <span>Read the global breakdowns</span>
                <span
                  aria-hidden="true"
                  className="transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/x:translate-x-1 motion-reduce:transform-none"
                >
                  &rarr;
                </span>
              </Link>
              <Link
                href="/stories"
                className="text-sm text-muted-foreground underline-offset-4 transition-colors duration-200 hover:text-foreground hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
              >
                Browse the reporting
              </Link>
            </div>
          }
        >
          <ul className="grid border-t border-border sm:grid-cols-3">
            {[
              {
                label: "Our Planet",
                body: "Global pressures, regional case studies, and every published measurement with its source.",
                href: "/our-planet",
              },
              {
                label: "Stories",
                body: "Long-form reporting and field dispatches, listed in the order they were recorded.",
                href: "/stories",
              },
              {
                label: "Solutions",
                body: "Ten working pathways for recovery, with the case studies that evidence them.",
                href: "/solutions",
              },
            ].map((item) => (
              <li key={item.label} className="border-b border-border py-7 sm:border-b-0 sm:border-l sm:px-6 sm:first:border-l-0 sm:first:pl-0">
                <h3 className="font-heading text-xl text-foreground">
                  <Link
                    href={item.href}
                    className="transition-colors duration-200 hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
                  >
                    {item.label}
                  </Link>
                </h3>
                <p className="mt-2.5 max-w-[38ch] text-sm leading-relaxed text-muted-foreground">
                  {item.body}
                </p>
              </li>
            ))}
          </ul>
        </EditorialSection>
      </div>
    </>
  );
}
