import { Suspense } from "react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CloudRain, Flame, Thermometer, Waves } from "lucide-react";
import { ArticleCard } from "@/components/public/article-card";
import { Breadcrumbs } from "@/components/public/breadcrumbs";
import { CaseStudyCard } from "@/components/public/case-study-card";
import { CTASection } from "@/components/public/cta-section";
import { EmptyState } from "@/components/public/empty-state";
import { ErrorState } from "@/components/public/error-state";
import { LoadingState } from "@/components/public/loading-state";
import { PageHeroBanner } from "@/components/public/page-hero-banner";
import { ReferenceList } from "@/components/public/reference-list";
import { SectionHeading } from "@/components/public/section-heading";
import { StatisticCard } from "@/components/public/statistic-card";
import { Badge } from "@/components/ui/badge";
import { getPillarDetailBySlug } from "@/features/public/queries";
import { cn } from "@/lib/utils";
import { resolveEditorialImageUrl } from "@/lib/utils/media-url";

interface PillarPageProps {
  readonly params: Promise<{ readonly slug: string }>;
}

const PILLAR_CONTEXT_ESSAYS: Record<
  string,
  {
    readonly lens: string;
    readonly significance: string;
    readonly medallionImage: string;
    readonly keyContextPoints: readonly {
      readonly title: string;
      readonly summary: string;
    }[];
  }
> = {
  "climate-atmosphere": {
    lens: "Climate systems regulate planetary energy balance through atmospheric circulation, greenhouse gas concentrations, ocean heat exchange, and cryospheric ice cover.",
    significance:
      "Even fractions of a degree of global mean surface warming reshape extreme heat frequency, glacier meltwater reliability, and seasonal rainfall patterns relied upon by ecosystems and communities worldwide.",
    medallionImage: "/images/earth-globe.jpg",
    keyContextPoints: [
      {
        title: "Rising Temperatures",
        summary:
          "Global surface temperatures have risen approximately 1.2°C above pre-industrial baselines due to cumulative greenhouse gas emissions.",
      },
      {
        title: "Extreme Weather",
        summary:
          "Warmer air holds more moisture, intensifying heavy precipitation events alongside prolonged regional droughts and heatwaves.",
      },
      {
        title: "Sea Level Rise",
        summary:
          "Thermal expansion of warming ocean waters combined with mountain glacier and ice-sheet loss drives accelerating coastal sea-level rise.",
      },
    ],
  },
  "oceans-water": {
    lens: "Pelagic heat absorption, carbonate chemistry, coral ecosystems, coastal estuaries, and terrestrial freshwater basins.",
    significance:
      "Oceans absorb over 90% of excess planetary heat and nearly a third of anthropogenic CO₂ emissions while sustaining marine food webs and regulating global weather.",
    medallionImage: "/images/sea-turtle.jpg",
    keyContextPoints: [
      {
        title: "Ocean Heat & Coral Stress",
        summary:
          "Marine heatwaves push tropical coral reef ecosystems past thermal bleaching thresholds with increasing frequency.",
      },
      {
        title: "Ocean Acidification",
        summary:
          "Absorbed carbon dioxide alters seawater carbonate chemistry, increasing surface ocean acidity by roughly 30%.",
      },
      {
        title: "Freshwater & Coastal Resilience",
        summary:
          "Protecting watersheds, wetlands, and coastal mangrove belts buffers shorelines and secures drinking water basins.",
      },
    ],
  },
  "forests-biodiversity": {
    lens: "Primary rainforests, boreal carbon sinks, fragmented habitat corridors, soil microbiomes, and species interdependence.",
    significance:
      "Intact biodiversity supports pollination, hydrological recycling, nutrient cycling, and long-term terrestrial carbon storage that monoculture plantations cannot replicate.",
    medallionImage: "/images/pillar-forests.jpg",
    keyContextPoints: [
      {
        title: "Primary Canopy Retention",
        summary:
          "Old-growth forests store multi-century carbon reserves in living biomass and deep organic forest soils.",
      },
      {
        title: "Wildlife Corridor Connectivity",
        summary:
          "Connected habitat corridors prevent genetic isolation and allow species to track shifting climate zones.",
      },
      {
        title: "Hydrological Evapotranspiration",
        summary:
          "Intact forest canopies recycle atmospheric moisture that sustains inland rainfall and river basins.",
      },
    ],
  },
  "pollution-human-impact": {
    lens: "Fine particulate air quality, synthetic polymers, nutrient eutrophication, chemical persistence, and resource extraction footprints.",
    significance:
      "Tracking pollution across production, consumption, and disposal reveals where upstream redesign prevents cumulative ecological toxicity.",
    medallionImage: "/images/pillar-pollution.jpg",
    keyContextPoints: [
      {
        title: "Atmospheric Particulates",
        summary:
          "Combustion aerosols and tropospheric ozone affect both regional air quality and radiative cloud interactions.",
      },
      {
        title: "Plastic & Polymer Leakage",
        summary:
          "Synthetic polymers fragment into persistent microplastics across river deltas, soils, and marine food webs.",
      },
      {
        title: "Nutrient & Chemical Runoff",
        summary:
          "Excess agricultural nitrogen and phosphorus drive freshwater algal blooms and coastal hypoxic dead zones.",
      },
    ],
  },
  "solutions-restoration": {
    lens: "Clean energy deployment, natural climate pathways, protected-area governance, circular material systems, and community conservation.",
    significance:
      "Durable restoration succeeds when ecological science aligns with local stewardship, transparent measurement, and structural reduction of primary pressures.",
    medallionImage: "/images/pillar-solutions.jpg",
    keyContextPoints: [
      {
        title: "Grid Decarbonization",
        summary:
          "Scaling utility solar, wind, and energy storage displaces fossil generation across electricity and transport.",
      },
      {
        title: "Ecological Rewetting & Replanting",
        summary:
          "Restoring native mangroves, peatlands, and watersheds recovers biodiversity alongside natural carbon sinks.",
      },
      {
        title: "Circular Material Design",
        summary:
          "Repairability standards, reuse networks, and material recovery cut virgin resource extraction.",
      },
    ],
  },
};

export async function generateMetadata({ params }: PillarPageProps): Promise<Metadata> {
  const { slug } = await params;
  const result = await getPillarDetailBySlug(slug);

  if (result.status !== "ok" || !result.data) {
    return {
      title: "Environmental Pillar",
      description:
        "Explore environmental stories, case studies, scientific statistics, and verified references across Earth systems.",
      alternates: {
        canonical: `/explore/${slug}`,
      },
    };
  }

  const { pillar } = result.data;
  return {
    title: pillar.name,
    description: pillar.description,
    alternates: {
      canonical: `/explore/${pillar.slug}`,
    },
    openGraph: {
      title: `${pillar.name} | THE LIVING EARTH`,
      description: pillar.description,
      images: [
        {
          url: resolveEditorialImageUrl(pillar.cover_image_path, {
            defaultBucket: "pillar-images",
            pillarSlug: pillar.slug,
          }),
          alt: pillar.name,
        },
      ],
    },
  };
}

async function PillarDetailContent({
  params,
}: {
  readonly params: Promise<{ readonly slug: string }>;
}) {
  const { slug } = await params;
  const result = await getPillarDetailBySlug(slug);

  if (result.status === "unconfigured") {
    return (
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <ErrorState
          title="Database configuration required"
          description="Public database access must be configured to load this environmental pillar."
          actionHref="/explore"
          actionLabel="Back to Explore"
        />
      </div>
    );
  }

  if (result.status === "error") {
    return (
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <ErrorState
          title="Unable to load pillar details"
          description={result.message}
          actionHref="/explore"
          actionLabel="Back to Explore"
        />
      </div>
    );
  }

  if (!result.data) {
    notFound();
  }

  const { pillar, topics, articles, caseStudies, statistics, references } = result.data;
  const coverSrc = resolveEditorialImageUrl(pillar.cover_image_path, {
    defaultBucket: "pillar-images",
    pillarSlug: pillar.slug,
  });
  const contextEssay = PILLAR_CONTEXT_ESSAYS[pillar.slug];
  const medallionSrc = contextEssay?.medallionImage ?? coverSrc;

  return (
    <>
      <PageHeroBanner
        eyebrow="Environmental Pillar"
        title={pillar.name}
        description={pillar.description}
        imageSrc={coverSrc}
        imageAlt={`${pillar.name} landscape background`}
      >
        <Breadcrumbs
          tone="dark"
          items={[
            { label: "Home", href: "/" },
            { label: "Explore", href: "/explore" },
            { label: pillar.name },
          ]}
        />
      </PageHeroBanner>

      {/* Clean Horizontal Underline Tab Bar (Matching Mockup Screen 4) */}
      <div className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
          <nav aria-label="Pillar sections" className="flex flex-wrap items-center gap-6">
            {[
              { label: "Overview", href: "#overview", active: true },
              { label: "Key Issues", href: "#key-issues", active: false },
              { label: "Statistics", href: "#statistics", active: false },
              { label: "Related Articles", href: "#articles", active: false },
            ].map((tab) => (
              <a
                key={tab.href}
                href={tab.href}
                className={cn(
                  "inline-flex min-h-12 items-center border-b-2 px-1 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
                  tab.active
                    ? "border-primary font-semibold text-primary"
                    : "border-transparent text-muted-foreground hover:border-border hover:text-foreground",
                )}
              >
                {tab.label}
              </a>
            ))}
          </nav>

          <Link
            href="/explore"
            className="inline-flex items-center gap-1.5 py-2 text-xs font-semibold text-primary hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            <ArrowLeft className="size-3.5" aria-hidden="true" />
            <span>All pillars</span>
          </Link>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-14 lg:px-8">
        {/* About This Pillar + Circular Earth Medallion (Matching Screen 4) */}
        <section
          id="overview"
          aria-labelledby="about-pillar-heading"
          className="grid scroll-mt-24 items-center gap-8 rounded-3xl border border-border bg-card p-7 sm:p-10 lg:grid-cols-12"
        >
          <div className="space-y-4 lg:col-span-7">
            <h2
              id="about-pillar-heading"
              className="font-heading text-3xl font-medium text-foreground sm:text-4xl"
            >
              About This Pillar
            </h2>
            <p className="text-base leading-relaxed text-muted-foreground">
              {contextEssay ? contextEssay.lens : pillar.description}
            </p>
            {contextEssay ? (
              <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
                {contextEssay.significance}
              </p>
            ) : null}
          </div>

          <div className="flex justify-center lg:col-span-5">
            <div className="relative size-56 overflow-hidden rounded-full border-4 border-secondary shadow-md sm:size-64">
              <Image
                src={medallionSrc}
                alt={`${pillar.name} circular globe visual`}
                fill
                sizes="256px"
                className="object-cover"
              />
            </div>
          </div>
        </section>

        {/* Key Environmental Context — Vertical Stack of Icon Rows (Matching Screen 4) */}
        {contextEssay ? (
          <section id="key-issues" aria-labelledby="pillar-context-heading" className="mt-12 scroll-mt-24">
            <h2
              id="pillar-context-heading"
              className="font-heading text-2xl font-medium text-foreground sm:text-3xl"
            >
              Key Environmental Context
            </h2>

            <div className="mt-5 space-y-3.5">
              {contextEssay.keyContextPoints.map((point, idx) => {
                const Icon =
                  idx === 0 ? Thermometer : idx === 1 ? CloudRain : idx === 2 ? Waves : Flame;
                return (
                  <div
                    key={point.title}
                    className="flex items-start gap-4 rounded-2xl border border-border bg-card p-5 transition-colors hover:border-primary/40"
                  >
                    <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-secondary text-primary">
                      <Icon className="size-5" aria-hidden="true" />
                    </span>
                    <div className="space-y-1">
                      <h3 className="font-heading text-xl font-medium text-foreground">
                        {point.title}
                      </h3>
                      <p className="text-sm leading-relaxed text-muted-foreground">
                        {point.summary}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        ) : null}

        {/* Featured Articles */}
        <section id="articles" aria-labelledby="pillar-articles-heading" className="mt-14 scroll-mt-24">
          <SectionHeading
            headingId="pillar-articles-heading"
            title="Featured Articles"
            actionLabel="View All Articles →"
            actionHref={`/stories?pillar=${encodeURIComponent(pillar.slug)}`}
          />

          <div className="mt-6">
            {articles.length > 0 ? (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {articles.map((article) => (
                  <ArticleCard key={article.id} article={article} />
                ))}
              </div>
            ) : (
              <EmptyState
                title={`No published stories in ${pillar.name} yet`}
                description="Editorial dispatches for this domain are still in progress. Check the full Stories archive or explore another pillar."
                actionLabel="Browse Stories Archive"
                actionHref="/stories"
              />
            )}
          </div>
        </section>

        {/* Related Topics */}
        {topics.length > 0 ? (
          <section aria-labelledby="pillar-topics-heading" className="mt-14">
            <SectionHeading
              headingId="pillar-topics-heading"
              title="Related Topics"
              description="Curated research themes categorized under this environmental domain."
            />

            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {topics.map((topic) => (
                <div key={topic.id} className="rounded-2xl border border-border bg-card p-5">
                  <Badge variant="secondary" className="mb-2.5">
                    Topic
                  </Badge>
                  <h3 className="font-heading text-xl font-medium text-foreground">
                    {topic.name}
                  </h3>
                  {topic.description ? (
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {topic.description}
                    </p>
                  ) : null}
                </div>
              ))}
            </div>
          </section>
        ) : null}

        {/* Relevant Statistics */}
        <section id="statistics" aria-labelledby="pillar-stats-heading" className="mt-14 scroll-mt-24">
          <SectionHeading
            headingId="pillar-stats-heading"
            title="Environmental Statistics"
            description="Verified indicators with declared units, observation years, and primary sources."
          />

          <div className="mt-6">
            {statistics.length > 0 ? (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {statistics.map((stat) => (
                  <StatisticCard key={stat.id} statistic={stat} />
                ))}
              </div>
            ) : (
              <EmptyState
                title="No published statistics assigned to this pillar yet"
                description="Only validated quantitative metrics with documented units and scientific citations are displayed."
                actionLabel="View Global Overview"
                actionHref="/our-planet#sources"
              />
            )}
          </div>
        </section>

        {/* Related Case Studies */}
        {caseStudies.length > 0 ? (
          <section aria-labelledby="pillar-cases-heading" className="mt-14">
            <SectionHeading
              headingId="pillar-cases-heading"
              title="Field Case Studies"
              description="Documented geographic conditions, ecological impacts, and conservation responses."
              actionLabel="View Our Planet →"
              actionHref="/our-planet"
            />

            <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {caseStudies.map((cs) => (
                <CaseStudyCard key={cs.id} caseStudy={cs} />
              ))}
            </div>
          </section>
        ) : null}

        {references.length > 0 ? (
          <section aria-labelledby="pillar-refs-heading" className="mt-14">
            <SectionHeading
              headingId="pillar-refs-heading"
              title="Scientific References & Sources"
              description="Authoritative institutions and literature cited across this pillar."
            />
            <div className="mt-6">
              <ReferenceList references={references} />
            </div>
          </section>
        ) : null}

        <div className="mt-16">
          <CTASection
            title="Continue exploring Earth's living systems."
            description="Read practical conservation strategies on our Solutions page or inspect planetary indicators on Our Planet."
            primaryLabel="Explore Solutions"
            primaryHref="/solutions"
            secondaryLabel="Explore Our Planet"
            secondaryHref="/our-planet"
          />
        </div>
      </div>
    </>
  );
}

export default function PillarDetailPage({ params }: PillarPageProps) {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <LoadingState label="Loading environmental pillar..." />
        </div>
      }
    >
      <PillarDetailContent params={params} />
    </Suspense>
  );
}
