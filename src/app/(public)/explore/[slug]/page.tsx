import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArticleCard } from "@/components/public/article-card";
import { CaseStudyCard } from "@/components/public/case-study-card";
import { CTASection } from "@/components/public/cta-section";
import { EditorialPageHero } from "@/components/public/editorial-page-hero";
import { EditorialSection } from "@/components/public/editorial-section";
import { EmptyState } from "@/components/public/empty-state";
import { ErrorState } from "@/components/public/error-state";
import { LoadingState } from "@/components/public/loading-state";
import { ReferenceList } from "@/components/public/reference-list";
import { StatisticCard } from "@/components/public/statistic-card";
import { PILLARS } from "@/data";
import { getPillarDetailBySlug } from "@/features/public/queries";
import { resolveEditorialImageUrl } from "@/lib/utils/media-url";

interface PillarPageProps {
  readonly params: Promise<{ readonly slug: string }>;
}

export function generateStaticParams() {
  return PILLARS.filter((pillar) => pillar.is_active).map((pillar) => ({
    slug: pillar.slug,
  }));
}

const PILLAR_CONTEXT_ESSAYS: Record<
  string,
  {
    readonly lens: string;
    readonly significance: string;
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
      <ErrorState
        title="Pillar unavailable"
        description="This environmental pillar is not available right now."
        actionHref="/explore"
        actionLabel="Back to Explore"
      />
    );
  }

  if (result.status === "error") {
    return (
      <ErrorState
        title="Unable to load pillar details"
        description={result.message}
        actionHref="/explore"
        actionLabel="Back to Explore"
      />
    );
  }

  if (!result.data) {
    notFound();
  }

  const { pillar, topics, articles, caseStudies, statistics, references } = result.data;
  const coverSrc = resolveEditorialImageUrl(pillar.cover_image_path, {
    pillarSlug: pillar.slug,
  });
  const contextEssay = PILLAR_CONTEXT_ESSAYS[pillar.slug];

  return (
    <>
      <EditorialPageHero
        index={`Domain ${pillar.slug === "climate-atmosphere" ? "01" : pillar.slug === "oceans-water" ? "02" : pillar.slug === "forests-biodiversity" ? "03" : pillar.slug === "pollution-human-impact" ? "04" : "05"}`}
        context={pillar.name}
        title={pillar.name}
        standfirst={pillar.description}
        imageSrc={coverSrc}
        imageAlt={`${pillar.name} landscape`}
      >
        <Link
          href="/explore"
          className="inline-flex items-center gap-1.5 font-mono text-[10px] tracking-[0.12em] text-earth-ivory/70 transition-colors hover:text-earth-ivory focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-earth-sage"
        >
          <span>All domains</span>
        </Link>
      </EditorialPageHero>

      <div className="mx-auto w-full max-w-[1400px] px-4 py-16 sm:px-6 sm:py-20 lg:px-10">
        {/* About this domain: lens + significance as a two-column spread. */}
        {contextEssay ? (
          <EditorialSection
            headingId="pillar-about-heading"
            index="Section 02"
            title="About this domain"
            lede={contextEssay.lens}
          >
            <p className="max-w-[72ch] text-[15px] leading-relaxed text-muted-foreground">
              {contextEssay.significance}
            </p>
          </EditorialSection>
        ) : null}

        {/* Key context: a numbered ledger instead of icon cards. */}
        {contextEssay ? (
          <EditorialSection
            className="mt-20 scroll-mt-28 sm:mt-28"
            headingId="pillar-context-heading"
            index="Section 03"
            title="Key context"
            lede="The questions this domain is responsible for answering, and what the evidence currently says."
          >
            <ol className="border-t border-border">
              {contextEssay.keyContextPoints.map((point, idx) => (
                <li
                  key={point.title}
                  className="grid gap-4 border-b border-border py-7 lg:grid-cols-12 lg:gap-10"
                >
                  <p className="font-mono text-[11px] text-earth-muted tabular-nums lg:col-span-1">
                    {String(idx + 1).padStart(2, "0")}
                  </p>
                  <h3 className="font-heading text-xl leading-snug text-foreground lg:col-span-4 sm:text-2xl">
                    {point.title}
                  </h3>
                  <p className="max-w-[62ch] text-[15px] leading-relaxed text-muted-foreground lg:col-span-7">
                    {point.summary}
                  </p>
                </li>
              ))}
            </ol>
          </EditorialSection>
        ) : null}

        {/* Indexed topics. */}
        {topics.length > 0 ? (
          <EditorialSection
            className="mt-20 scroll-mt-28 sm:mt-28"
            headingId="pillar-topics-heading"
            index="Section 04"
            title="Indexed topics"
            lede="Curated research themes grouped under this domain."
            aside={
              <Link
                href="/explore"
                className="group/x inline-flex items-center gap-2 border-b border-foreground/25 pb-1 text-sm font-medium text-foreground transition-colors duration-200 hover:border-primary hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
              >
                <span>All domains</span>
                <span
                  aria-hidden="true"
                  className="transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/x:translate-x-1 motion-reduce:transform-none"
                >
                  &rarr;
                </span>
              </Link>
            }
          >
            <ol className="border-t border-border">
              {topics.map((topic, idx) => (
                <li key={topic.id} className="border-b border-border">
                  <div className="grid gap-4 py-6 lg:grid-cols-12 lg:gap-10">
                    <p className="font-mono text-[11px] text-earth-muted tabular-nums lg:col-span-1">
                      {String(idx + 1).padStart(2, "0")}
                    </p>
                    <h3 className="font-heading text-lg leading-snug text-foreground lg:col-span-4">
                      {topic.name}
                    </h3>
                    {topic.description ? (
                      <p className="max-w-[62ch] text-sm leading-relaxed text-muted-foreground lg:col-span-7">
                        {topic.description}
                      </p>
                    ) : null}
                  </div>
                </li>
              ))}
            </ol>
          </EditorialSection>
        ) : null}

        {/* Published notes. */}
        <EditorialSection
          className="mt-20 scroll-mt-28 sm:mt-28"
          headingId="pillar-articles-heading"
          index="Section 05"
          title="Published notes"
          lede="Editorial dispatches filed under this domain, in the order they were recorded."
          aside={
            articles.length > 0 ? (
              <Link
                href={`/stories?pillar=${encodeURIComponent(pillar.slug)}`}
                className="group/x inline-flex items-center gap-2 border-b border-foreground/25 pb-1 text-sm font-medium text-foreground transition-colors duration-200 hover:border-primary hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
              >
                <span>All notes</span>
                <span
                  aria-hidden="true"
                  className="transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/x:translate-x-1 motion-reduce:transform-none"
                >
                  &rarr;
                </span>
              </Link>
            ) : undefined
          }
        >
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
        </EditorialSection>

        {/* Field case studies. */}
        {caseStudies.length > 0 ? (
          <EditorialSection
            className="mt-20 scroll-mt-28 sm:mt-28"
            headingId="pillar-cases-heading"
            index="Section 06"
            title="Field case studies"
            lede="Documented geographic conditions, ecological impacts, and conservation responses."
            aside={
              <Link
                href="/our-planet"
                className="group/x inline-flex items-center gap-2 border-b border-foreground/25 pb-1 text-sm font-medium text-foreground transition-colors duration-200 hover:border-primary hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
              >
                <span>Our Planet</span>
                <span
                  aria-hidden="true"
                  className="transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/x:translate-x-1 motion-reduce:transform-none"
                >
                  &rarr;
                </span>
              </Link>
            }
          >
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {caseStudies.map((cs) => (
                <CaseStudyCard key={cs.id} caseStudy={cs} />
              ))}
            </div>
          </EditorialSection>
        ) : null}

        {/* Measurements. */}
        <EditorialSection
          className="mt-20 scroll-mt-28 sm:mt-28"
          headingId="pillar-stats-heading"
          index="Section 07"
          title="Measurements"
          lede="Verified indicators with declared units, observation years, and primary sources."
        >
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
        </EditorialSection>

        {/* Sources. */}
        {references.length > 0 ? (
          <EditorialSection
            className="mt-20 scroll-mt-28 sm:mt-28"
            headingId="pillar-refs-heading"
            index="Section 08"
            title="Sources"
            lede="Authoritative institutions and literature cited across this domain."
          >
            <ReferenceList references={references} />
          </EditorialSection>
        ) : null}

        <div className="mt-20">
          <CTASection
            title="Continue exploring Earth's living systems."
            description="Read practical conservation strategies on our Solutions page or inspect planetary indicators on Our Planet."
            primaryLabel="Explore Solutions"
            primaryHref="/solutions"
            secondaryLabel="Our Planet"
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