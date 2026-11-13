import { Suspense } from "react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Compass,
  Droplets,
  FileText,
  Flame,
  Layers,
  Leaf,
  MapPin,
  ShieldCheck,
  Sprout,
  Wind,
} from "lucide-react";
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
import { StatisticsOverviewChart } from "@/components/public/statistics-overview-chart";
import { getOurPlanetData } from "@/features/public/queries";

export const metadata: Metadata = {
  title: "Our Planet",
  description:
    "Examine global environmental case studies like Mangrove Restoration in Coastal Indonesia alongside major planetary pressures, verified statistics, and scientific sources.",
  alternates: {
    canonical: "/our-planet",
  },
};

const RELATED_RESOURCES = [
  {
    label: "Mangrove Restoration Guide",
    href: "/case-studies/mangrove-restoration-in-coastal-indonesia",
    icon: Sprout,
  },
  {
    label: "Coastal Ecosystem Report",
    href: "/explore/oceans-water",
    icon: Compass,
  },
  {
    label: "Blue Carbon Assessment",
    href: "#sources",
    icon: FileText,
  },
  {
    label: "Habitat Protection Pathways",
    href: "/solutions",
    icon: BookOpen,
  },
] as const;

const GLOBAL_THEMES = [
  {
    id: "climate-change",
    pillarHref: "/explore/climate-atmosphere",
    title: "Climate Change",
    summary:
      "Greenhouse gas accumulation traps outgoing thermal radiation, raising global mean temperatures, accelerating glacier retreat, and amplifying regional heat and hydrological extremes.",
    keyDrivers: [
      "Fossil fuel combustion across electricity, transport, and heavy industry",
      "Land-use conversion and peatland drainage releasing stored soil carbon",
      "Permafrost thaw and reduced polar albedo creating amplifying feedbacks",
    ],
    icon: Flame,
  },
  {
    id: "biodiversity-loss",
    pillarHref: "/explore/forests-biodiversity",
    title: "Biodiversity Loss",
    summary:
      "Intact ecosystems depend on genetic, species, and habitat diversity. Rapid landscape fragmentation weakens pollination, soil fertility, and natural disease buffering.",
    keyDrivers: [
      "Primary forest clearing and agricultural frontier expansion",
      "Fragmentation of migratory corridors and freshwater wetlands",
      "Compounding pressure from shifting climate envelopes and invasive species",
    ],
    icon: Leaf,
  },
  {
    id: "ocean-degradation",
    pillarHref: "/explore/oceans-water",
    title: "Ocean Degradation",
    summary:
      "Marine waters regulate planetary climate and sustain over a billion people directly, yet absorb rising heat and excess CO₂ that drive bleaching and acidification.",
    keyDrivers: [
      "Marine heatwaves pushing tropical coral reefs beyond thermal tolerance",
      "Ocean acidification reducing carbonate ions needed for calcifying organisms",
      "Coastal nutrient runoff expanding hypoxic dead zones alongside overfishing",
    ],
    icon: Droplets,
  },
  {
    id: "pollution",
    pillarHref: "/explore/pollution-human-impact",
    title: "Pollution & Waste",
    summary:
      "Synthetic chemicals, microplastics, heavy metals, and airborne particulates persist across ecological boundaries—affecting watersheds, marine fauna, and urban health.",
    keyDrivers: [
      "Single-use polymer leakage into river basins and coastal gyres",
      "Fine particulate matter and tropospheric ozone from combustion and industry",
      "Untreated agricultural nutrients and electronic-waste leachates",
    ],
    icon: Wind,
  },
] as const;

async function OurPlanetDynamicSection() {
  const result = await getOurPlanetData();

  if (result.status === "unconfigured") {
    return (
      <section className="mt-14">
        <ErrorState
          title="Database configuration required"
          description="Published case studies, verified statistics, and scientific references require active public database access."
        />
      </section>
    );
  }

  if (result.status === "error") {
    return (
      <section className="mt-14">
        <ErrorState
          title="Unable to load global evidence records"
          description={result.message}
        />
      </section>
    );
  }

  const { pillars, caseStudies, statistics, references } = result.data;

  return (
    <>
      <section aria-labelledby="planet-cases-heading" className="mt-16">
        <SectionHeading
          headingId="planet-cases-heading"
          title="Featured Global Case Studies"
          description="Regional field investigations connecting ecological pressures, observable impacts, and documented conservation responses."
          actionLabel="Explore Pillars"
          actionHref="/explore"
        />

        <div className="mt-8">
          {caseStudies.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {caseStudies.map((cs) => (
                <CaseStudyCard key={cs.id} caseStudy={cs} />
              ))}
            </div>
          ) : (
            <EmptyState
              title="Regional case studies are being curated"
              description="Verified field case studies will appear here as soon as editorial review is published in the CMS."
              actionLabel="Browse Stories"
              actionHref="/stories"
            />
          )}
        </div>
      </section>

      <section aria-labelledby="planet-stats-heading" className="mt-16">
        <SectionHeading
          headingId="planet-stats-heading"
          title="Verified Environmental Data & Indicators"
          description="Quantitative indicators are grouped strictly by matching measurement unit and paired with explicit data types and citations."
        />

        <div className="mt-8 space-y-8">
          {statistics.length > 0 ? (
            <>
              <StatisticsOverviewChart statistics={statistics} pillars={pillars} />
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {statistics.map((stat) => (
                  <StatisticCard key={stat.id} statistic={stat} />
                ))}
              </div>
            </>
          ) : (
            <EmptyState
              title="Verified statistics dataset awaiting publication"
              description="THE LIVING EARTH never invents placeholder metrics or extrapolated charts. Published indicators from verified scientific sources will appear here automatically."
              actionLabel="Learn About Our Standards"
              actionHref="/about#approach"
            />
          )}
        </div>
      </section>

      <section id="sources" aria-labelledby="planet-sources-heading" className="mt-16 scroll-mt-24">
        <SectionHeading
          headingId="planet-sources-heading"
          title="Sources & Scientific References"
          description="Institutional reports, peer-reviewed journals, and public datasets referenced across the platform."
        />

        <div className="mt-8">
          {references.length > 0 ? (
            <ReferenceList references={references} />
          ) : (
            <div className="rounded-xl border border-border bg-card p-6 sm:p-8">
              <div className="flex items-start gap-3">
                <ShieldCheck className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden="true" />
                <div className="space-y-2 text-sm leading-relaxed text-muted-foreground">
                  <p className="font-medium text-foreground">Strict Citation &amp; Provenance Policy</p>
                  <p>
                    No quantitative dataset is displayed without an assigned institutional source,
                    publication date, and unit classification in the editorial database. Primary
                    references will list automatically here alongside published statistics and
                    articles.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}

export default function OurPlanetPage() {
  return (
    <>
      {/* Hero Banner matching Screen 6 ("Mangrove Restoration in Coastal Indonesia") */}
      <PageHeroBanner
        eyebrow="Our Planet · Featured Field Study"
        title="Mangrove Restoration in Coastal Indonesia"
        description="Nature-based solutions for stronger coastlines, thriving estuaries, and resilient blue-carbon ecosystems."
        imageSrc="/images/mangrove-coastal.jpg"
        imageAlt="Lush coastal mangrove roots along an Indonesian shoreline"
      >
        <Breadcrumbs tone="dark" items={[{ label: "Home", href: "/" }, { label: "Our Planet" }]} />
      </PageHeroBanner>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-14 lg:px-8">
        {/* Two-Column Case Study Spotlight + Sidebar matching Mockup Screen 6 */}
        <div className="grid gap-10 lg:grid-cols-12">
          {/* Left Column: Overview, The Solution, Results + 2 Side-by-Side Photos */}
          <div className="space-y-8 lg:col-span-8">
            <section aria-labelledby="spotlight-overview-heading" className="space-y-3">
              <h2
                id="spotlight-overview-heading"
                className="font-heading text-3xl font-medium text-foreground"
              >
                Overview
              </h2>
              <p className="text-base leading-relaxed text-muted-foreground">
                Indonesia stewards the largest mangrove extent on Earth—intertidal forests whose
                dense aerial root networks dissipate storm surge energy, trap coastal sediment, and
                sequester up to four times more carbon per hectare than terrestrial tropical forests.
              </p>
              <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
                Decades of coastal aquaculture pond conversion and seawall modification left low-lying
                villages exposed to tidal flooding, shoreline erosion, and declining nearshore crab
                and finfish nurseries.
              </p>
            </section>

            <section
              aria-labelledby="spotlight-solution-heading"
              className="space-y-3 border-t border-border pt-7"
            >
              <h2
                id="spotlight-solution-heading"
                className="font-heading text-3xl font-medium text-foreground"
              >
                The Solution
              </h2>
              <p className="text-base leading-relaxed text-muted-foreground">
                Community-led ecological mangrove restoration pairs permeable brushwood sediment
                barriers with tidal channel reopening—allowing natural mangrove propagules
                (<em>Avicennia</em> and <em>Rhizophora</em> species) to re-establish alongside mixed
                silvofishery ponds that sustain local livelihoods.
              </p>
            </section>

            <section
              aria-labelledby="spotlight-results-heading"
              className="space-y-5 border-t border-border pt-7"
            >
              <div className="flex items-center justify-between gap-4">
                <h2
                  id="spotlight-results-heading"
                  className="font-heading text-3xl font-medium text-foreground"
                >
                  Results
                </h2>
                <Link
                  href="/case-studies/mangrove-restoration-in-coastal-indonesia"
                  className="group inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                >
                  <span>View all</span>
                  <ArrowRight
                    className="size-3.5 transition-transform duration-200 group-hover:translate-x-1 motion-reduce:transform-none"
                    aria-hidden="true"
                  />
                </Link>
              </div>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div className="group overflow-hidden rounded-xl border border-border bg-card transition-colors duration-300 hover:border-primary/40">
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-muted">
                    <Image
                      src="/images/mangrove-coastal.jpg"
                      alt="Restored coastal mangrove belt stabilizing tropical shoreline"
                      fill
                      sizes="(max-width: 640px) 100vw, 400px"
                      className="object-cover transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03] motion-reduce:transform-none"
                    />
                  </div>
                  <div className="p-4">
                    <p className="font-heading text-base font-medium text-foreground">
                      Shoreline Sediment Accretion
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Permeable coastal buffers trap sediment and reduce wave impact energy.
                    </p>
                  </div>
                </div>

                <div className="group overflow-hidden rounded-xl border border-border bg-card transition-colors duration-300 hover:border-primary/40">
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-muted">
                    <Image
                      src="/images/about-earth.jpg"
                      alt="Estuarine river delta and nursery habitat recovery"
                      fill
                      sizes="(max-width: 640px) 100vw, 400px"
                      className="object-cover transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03] motion-reduce:transform-none"
                    />
                  </div>
                  <div className="p-4">
                    <p className="font-heading text-base font-medium text-foreground">
                      Estuary Biodiversity &amp; Blue Carbon
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Reconnected tidal channels restore nursery habitats and organic soil carbon.
                    </p>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* Right Sidebar: Location, Pillar, and Related Resources (Matching Screen 6) */}
          <aside aria-label="Case study metadata and related resources" className="space-y-6 lg:col-span-4">
            <div className="space-y-4 rounded-xl border border-border bg-card p-6 shadow-2xs">
              <div className="flex items-center gap-3.5">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-secondary text-primary">
                  <MapPin className="size-4" aria-hidden="true" />
                </span>
                <div>
                  <p className="text-xs font-medium text-muted-foreground">Location</p>
                  <p className="font-heading text-lg font-medium text-foreground">Indonesia</p>
                </div>
              </div>

              <div className="border-t border-border/70 pt-4">
                <Link
                  href="/explore/oceans-water"
                  className="group flex items-center gap-3.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                >
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-secondary text-primary">
                    <Layers className="size-4" aria-hidden="true" />
                  </span>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">Pillar</p>
                    <p className="font-heading text-lg font-medium text-foreground group-hover:text-primary">
                      Oceans &amp; Water
                    </p>
                  </div>
                </Link>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-card p-6 shadow-2xs">
              <h3 className="font-heading text-xl font-medium text-foreground">
                Related Resources
              </h3>
              <ul className="mt-4 space-y-3">
                {RELATED_RESOURCES.map((item) => {
                  const Icon = item.icon;
                  return (
                    <li key={item.label}>
                      <Link
                        href={item.href}
                        className="group flex items-center gap-3 rounded-xl p-2 transition-[background-color,transform] duration-200 hover:translate-x-0.5 hover:bg-secondary/65 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring motion-reduce:transform-none"
                      >
                        <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-secondary text-primary transition-transform duration-200 group-hover:scale-105 group-hover:-rotate-6 motion-reduce:transform-none">
                          <Icon className="size-4" aria-hidden="true" />
                        </span>
                        <span className="text-sm font-medium text-foreground transition-colors group-hover:text-primary">
                          {item.label}
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          </aside>
        </div>

        {/* Four Global Planetary Pressures (#climate-change, #biodiversity-loss, #ocean-degradation, #pollution) */}
        <section aria-labelledby="global-themes-heading" className="mt-16 border-t border-border pt-14">
          <SectionHeading
            headingId="global-themes-heading"
            title="Major Planetary Pressures"
            description="How atmospheric warming, biodiversity loss, ocean chemistry, and pollution interact across global systems."
          />

          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {GLOBAL_THEMES.map((theme) => {
              const Icon = theme.icon;
              return (
                <article
                  key={theme.id}
                  id={theme.id}
                  className="group flex scroll-mt-24 flex-col justify-between rounded-xl border border-border bg-card p-6 transition-[transform,border-color,box-shadow] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-xs motion-reduce:transform-none"
                >
                  <div>
                    <div className="flex items-center gap-3">
                      <span className="inline-flex size-10 items-center justify-center rounded-lg bg-secondary text-primary transition-transform duration-300 group-hover:scale-105 group-hover:-rotate-6 motion-reduce:transform-none">
                        <Icon className="size-5" aria-hidden="true" />
                      </span>
                      <h3 className="font-heading text-xl font-medium text-foreground">
                        {theme.title}
                      </h3>
                    </div>

                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                      {theme.summary}
                    </p>

                    <ul className="mt-4 space-y-1.5 text-xs text-muted-foreground">
                      {theme.keyDrivers.map((driver) => (
                        <li key={driver} className="flex items-start gap-2">
                          <span
                            aria-hidden="true"
                            className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary"
                          />
                          <span>{driver}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-5 border-t border-border/70 pt-3.5">
                    <Link
                      href={theme.pillarHref}
                      className="group/link inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                    >
                      <span>Explore related pillar</span>
                      <ArrowRight
                        className="size-3.5 transition-transform duration-200 group-hover/link:translate-x-1 motion-reduce:transform-none"
                        aria-hidden="true"
                      />
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <Suspense fallback={<LoadingState label="Loading global case studies, data, and sources..." />}>
          <OurPlanetDynamicSection />
        </Suspense>

        <div className="mt-16">
          <CTASection
            title="Move from understanding challenges to examining solutions."
            description="Explore realistic ecological restoration, clean energy transitions, and conservation frameworks."
            primaryLabel="Explore Solutions"
            primaryHref="/solutions"
            secondaryLabel="Read Stories"
            secondaryHref="/stories"
          />
        </div>
      </div>
    </>
  );
}
