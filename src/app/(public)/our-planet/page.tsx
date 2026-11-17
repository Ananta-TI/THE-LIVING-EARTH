import { Suspense } from "react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { EditorialPageHero } from "@/components/public/editorial-page-hero";
import { EditorialSection } from "@/components/public/editorial-section";
import { EmptyState } from "@/components/public/empty-state";
import { ErrorState } from "@/components/public/error-state";
import { GlareHover } from "@/components/public/glare-hover";
import { LoadingState } from "@/components/public/loading-state";
import { ReferenceList } from "@/components/public/reference-list";
import { StatisticsOverviewChart } from "@/components/public/statistics-overview-chart";
import { getOurPlanetData } from "@/features/public/queries";
import { formatDateTime } from "@/lib/utils/format";
import { resolveEditorialImageUrl } from "@/lib/utils/media-url";

export const metadata: Metadata = {
  title: "Our Planet",
  description:
    "Examine global environmental case studies like Mangrove Restoration in Coastal Indonesia alongside major planetary pressures, verified statistics, and scientific sources.",
  alternates: {
    canonical: "/our-planet",
  },
};

const GLOBAL_PRESSURES = [
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
  },
  {
    id: "pollution",
    pillarHref: "/explore/pollution-human-impact",
    title: "Pollution & Waste",
    summary:
      "Synthetic chemicals, microplastics, heavy metals, and airborne particulates persist across ecological boundaries — affecting watersheds, marine fauna, and urban health.",
    keyDrivers: [
      "Single-use polymer leakage into river basins and coastal gyres",
      "Fine particulate matter and tropospheric ozone from combustion and industry",
      "Untreated agricultural nutrients and electronic-waste leachates",
    ],
  },
] as const;

async function PlanetEvidence() {
  const result = await getOurPlanetData();

  if (result.status === "unconfigured") {
    return (
      <div className="mt-16">
        <ErrorState
          title="Content unavailable"
          description="Case studies, statistics, and references are not available right now."
        />
      </div>
    );
  }

  if (result.status === "error") {
    return (
      <div className="mt-16">
        <ErrorState
          title="Unable to load global evidence records"
          description={result.message}
        />
      </div>
    );
  }

  const { pillars, caseStudies, statistics, references } = result.data;

  return (
    <>
      <EditorialSection
        className="mt-20 scroll-mt-28 sm:mt-28"
        headingId="planet-cases-heading"
        index="Section 04"
        title="Regional studies on file"
        lede="Field investigations connecting ecological pressures, observable impacts, and documented conservation responses. Each entry names its site and period."
        aside={
          <Link
            href="/explore"
            className="group/x inline-flex items-center gap-2 border-b border-foreground/25 pb-1 text-sm font-medium text-foreground transition-colors duration-200 hover:border-primary hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
          >
            <span>Open the domain ledger</span>
            <span
              aria-hidden="true"
              className="transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/x:translate-x-1 motion-reduce:transform-none"
            >
              &rarr;
            </span>
          </Link>
        }
      >
        {caseStudies.length > 0 ? (
          <ol className="border-t border-border">
            {caseStudies.map((cs, index) => {
              const imageSrc = resolveEditorialImageUrl(cs.cover_image_path, {
                pillarSlug: cs.pillarSlug,
              });
              const period = cs.start_date
                ? `${formatDateTime(cs.start_date)} — ${cs.end_date ? formatDateTime(cs.end_date) : "ongoing"}`
                : "Ongoing";

              return (
                <li key={cs.id} className="border-b border-border">
                  <Link
                    href={`/case-studies/${cs.slug}`}
                    className="group/row grid gap-6 py-8 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring lg:grid-cols-12 lg:gap-10 lg:py-10"
                  >
                    <div className="flex items-start gap-4 lg:col-span-8 lg:gap-8">
                      <span className="w-8 shrink-0 pt-1 font-mono text-[11px] text-earth-muted tabular-nums">
                        {String(index + 1).padStart(2, "0")}
                      </span>

                      <div className="max-w-[14rem] shrink-0 sm:max-w-[17rem]">
                        <GlareHover>
                          <div className="relative aspect-4/3 w-full overflow-hidden bg-secondary">
                            <Image
                              src={imageSrc}
                              alt=""
                              fill
                              sizes="(max-width: 1024px) 60vw, 22vw"
                              className="object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/row:scale-[1.035] motion-reduce:transform-none"
                            />
                          </div>
                        </GlareHover>
                      </div>

                      <div className="min-w-0 flex-1 pt-1">
                        <h3 className="font-heading text-xl leading-tight tracking-[-0.015em] text-foreground transition-colors duration-200 group-hover/row:text-primary sm:text-2xl">
                          {cs.title}
                        </h3>
                        <p className="mt-3 max-w-[52ch] text-sm leading-relaxed text-muted-foreground">
                          {cs.summary}
                        </p>
                        <span className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-primary">
                          <span>Open the study</span>
                          <span
                            aria-hidden="true"
                            className="transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/row:translate-x-1 motion-reduce:transform-none"
                          >
                            &rarr;
                          </span>
                        </span>
                      </div>
                    </div>

                    <dl className="lg:col-span-4 lg:pt-1">
                      <div className="flex items-baseline justify-between gap-4 border-b border-border/60 py-2">
                        <dt className="font-mono text-[10px] tracking-[0.12em] text-earth-muted">
                          Site
                        </dt>
                        <dd className="text-right text-[13px] text-foreground/85">
                          {cs.country}
                          {cs.region ? ` · ${cs.region}` : ""}
                        </dd>
                      </div>
                      <div className="flex items-baseline justify-between gap-4 border-b border-border/60 py-2">
                        <dt className="font-mono text-[10px] tracking-[0.12em] text-earth-muted">
                          Domain
                        </dt>
                        <dd className="text-right text-[13px] text-foreground/85">
                          {cs.pillarName}
                        </dd>
                      </div>
                      <div className="flex items-baseline justify-between gap-4 border-b border-border/60 py-2">
                        <dt className="font-mono text-[10px] tracking-[0.12em] text-earth-muted">
                          Period
                        </dt>
                        <dd className="text-right text-[13px] text-foreground/85 tabular-nums">
                          {period}
                        </dd>
                      </div>
                      {cs.latitude !== null && cs.longitude !== null ? (
                        <div className="flex items-baseline justify-between gap-4 py-2">
                          <dt className="font-mono text-[10px] tracking-[0.12em] text-earth-muted">
                            Coordinates
                          </dt>
                          <dd className="text-right text-[13px] text-foreground/85 tabular-nums">
                            {cs.latitude.toFixed(3)}, {cs.longitude.toFixed(3)}
                          </dd>
                        </div>
                      ) : null}
                    </dl>
                  </Link>
                </li>
              );
            })}
          </ol>
        ) : (
          <EmptyState
            title="Regional case studies are being curated"
            description="Verified field case studies will appear here as soon as editorial review is complete."
            actionLabel="Browse stories"
            actionHref="/stories"
          />
        )}
      </EditorialSection>

      <EditorialSection
        className="mt-20 scroll-mt-28 sm:mt-28"
        headingId="planet-stats-heading"
        index="Section 05"
        title="Verified measurements, with their limitations"
        lede="Indicators are grouped by matching measurement unit and paired with an explicit data type, geographic scope, observation year, and citation."
      >
        {statistics.length > 0 ? (
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
            <div className="lg:col-span-7">
              <StatisticsOverviewChart statistics={statistics} pillars={pillars} />
            </div>
            <div className="border-t border-border lg:col-span-5 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-12">
              <p className="pt-6 font-mono text-[10px] tracking-[0.12em] text-earth-muted lg:pt-0">
                INDICATORS
              </p>
              <ul className="mt-4 border-t border-border">
                {statistics.map((stat) => (
                  <li key={stat.id} className="border-b border-border py-4">
                    <p className="flex items-baseline justify-between gap-6">
                      <span className="text-[15px] font-medium text-foreground">
                        {stat.indicator}
                      </span>
                      <span className="shrink-0 font-heading text-xl text-foreground tabular-nums">
                        {stat.unit === "%"
                          ? `~${stat.value}%`
                          : `${stat.value}${stat.unit}`}
                      </span>
                    </p>
                    <p className="mt-1.5 font-mono text-[10px] tracking-[0.1em] text-earth-muted">
                      {stat.geographic_scope} &middot; {stat.measurement_year}
                    </p>
                    <p className="mt-2 text-[12px] leading-relaxed text-muted-foreground">
                      {stat.reference?.organization ?? "Verified source"}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ) : (
          <EmptyState
            title="Verified statistics dataset awaiting publication"
            description="THE LIVING EARTH never invents placeholder metrics or extrapolated charts. Published indicators from verified scientific sources will appear here automatically."
            actionLabel="Learn about our standards"
            actionHref="/about#approach"
          />
        )}
      </EditorialSection>

      <EditorialSection
        id="sources"
        className="mt-20 scroll-mt-28 sm:mt-28"
        headingId="planet-sources-heading"
        index="Section 06"
        title="Sources and scientific references"
        lede="Institutional reports, peer-reviewed journals, and public datasets referenced across the platform."
      >
        {references.length > 0 ? (
          <ReferenceList references={references} />
        ) : (
          <div className="border-t border-border pt-6">
            <p className="font-mono text-[10px] tracking-[0.12em] text-earth-muted">
              STRICT CITATION &amp; PROVENANCE POLICY
            </p>
            <p className="mt-4 max-w-[70ch] text-[15px] leading-relaxed text-muted-foreground">
              No quantitative dataset is displayed without an assigned institutional source,
              publication date, and unit classification in the editorial records. Primary
              references list automatically here alongside published statistics and articles.
            </p>
          </div>
        )}
      </EditorialSection>
    </>
  );
}

export default function OurPlanetPage() {
  return (
    <>
      <EditorialPageHero
        index="Section 05"
        context="Global pressures"
        title="What is happening to the planet, and where"
        standfirst="Four interacting pressures — warming, biodiversity loss, ocean change, and pollution — read against regional field studies and the measurements that document them."
        imageSrc="/images/mangrove-coastal.jpg"
        imageAlt="Lush coastal mangrove roots along an Indonesian shoreline"
      />

      <div className="mx-auto w-full max-w-[1400px] px-4 py-16 sm:px-6 sm:py-20 lg:px-10">
        {/* Lead field study, kept as its own composure at the top of the page. */}
        <EditorialSection
          headingId="planet-lead-heading"
          index="Section 02"
          title="Featured field study"
          lede="A single documented restoration effort, in full, before the global picture."
        >
          <article className="grid gap-10 lg:grid-cols-12 lg:gap-12">
            <div className="lg:col-span-7">
              <p className="font-mono text-[10px] tracking-[0.12em] text-earth-muted">
                INDONESIA &middot; COASTAL JAVA &amp; KALIMANTAN
              </p>
              <h3 className="mt-4 font-heading text-[1.9rem] leading-[1.08] tracking-[-0.015em] text-foreground sm:text-4xl">
                <Link
                  href="/case-studies/mangrove-restoration-in-coastal-indonesia"
                  className="transition-colors duration-200 hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
                >
                  Mangrove Restoration in Coastal Indonesia
                </Link>
              </h3>

              <p className="mt-6 max-w-[64ch] text-lg leading-relaxed text-foreground/85">
                Indonesia stewards the largest mangrove extent on Earth — intertidal forests whose
                dense aerial root networks dissipate storm surge energy, trap coastal sediment, and
                sequester up to four times more carbon per hectare than terrestrial tropical
                forests.
              </p>

              <p className="mt-5 max-w-[64ch] text-[15px] leading-relaxed text-muted-foreground">
                Decades of aquaculture pond conversion and seawall modification left low-lying
                villages exposed to tidal flooding, shoreline erosion, and declining nearshore crab
                and finfish nurseries. Restoration teams shifted away from monoculture planting
                toward hydrological rehabilitation: reopening blocked estuarine channels and
                letting natural propagules re-establish.
              </p>

              <Link
                href="/case-studies/mangrove-restoration-in-coastal-indonesia"
                className="group/x mt-8 inline-flex items-center gap-2 border-b border-foreground/25 pb-1 text-sm font-medium text-foreground transition-colors duration-200 hover:border-primary hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
              >
                <span>Read the full study</span>
                <span
                  aria-hidden="true"
                  className="transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/x:translate-x-1 motion-reduce:transform-none"
                >
                  &rarr;
                </span>
              </Link>
            </div>

            <figure className="lg:col-span-5">
              <div className="relative aspect-3/4 w-full overflow-hidden bg-secondary">
                <Image
                  src="/images/mangrove-coastal.jpg"
                  alt="Restored coastal mangrove belt stabilizing a tropical shoreline"
                  fill
                  sizes="(max-width: 1024px) 100vw, 36vw"
                  className="object-cover"
                />
              </div>
              <figcaption className="mt-4 border-t border-border pt-3 font-mono text-[10px] leading-relaxed tracking-[0.1em] text-earth-muted">
                PERMEABLE SEDIMENT BARRIERS AND REOPENED TIDAL CHANNELS ALLOW PROPAGULES TO
                RE-ESTABLISH WITHOUT PLANTING.
              </figcaption>
            </figure>
          </article>
        </EditorialSection>

        {/* The four pressures, as dense numbered records rather than cards. */}
        <EditorialSection
          className="mt-20 scroll-mt-28 sm:mt-28"
          headingId="planet-pressures-heading"
          index="Section 03"
          title="Major planetary pressures"
          lede="How atmospheric warming, biodiversity loss, ocean chemistry, and pollution interact across global systems."
        >
          <ol className="grid border-t border-border lg:grid-cols-2">
            {GLOBAL_PRESSURES.map((pressure, index) => (
              <li
                key={pressure.id}
                id={pressure.id}
                className="scroll-mt-28 border-b border-border py-8 lg:[&:nth-child(2n)]:border-l lg:[&:nth-child(2n)]:pl-8 lg:[&:nth-child(2n+1)]:pr-8"
              >
                <p className="font-mono text-[10px] tracking-[0.12em] text-earth-muted tabular-nums">
                  {String(index + 1).padStart(2, "0")}
                </p>
                <h3 className="mt-3 font-heading text-2xl leading-tight tracking-[-0.015em] text-foreground">
                  {pressure.title}
                </h3>
                <p className="mt-4 max-w-[58ch] text-[15px] leading-relaxed text-muted-foreground">
                  {pressure.summary}
                </p>

                <p className="mt-6 font-mono text-[10px] tracking-[0.12em] text-earth-muted">
                  KEY DRIVERS
                </p>
                <ul className="mt-3">
                  {pressure.keyDrivers.map((driver) => (
                    <li
                      key={driver}
                      className="border-b border-border/60 py-2.5 text-[13px] leading-relaxed text-foreground/80 last:border-b-0"
                    >
                      {driver}
                    </li>
                  ))}
                </ul>

                <Link
                  href={pressure.pillarHref}
                  className="group/x mt-6 inline-flex items-center gap-2 text-sm font-medium text-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
                >
                  <span>Open the related domain</span>
                  <span
                    aria-hidden="true"
                    className="transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/x:translate-x-1 motion-reduce:transform-none"
                  >
                    &rarr;
                  </span>
                </Link>
              </li>
            ))}
          </ol>
        </EditorialSection>

        <Suspense fallback={<LoadingState label="Loading regional studies, measurements, and sources..." />}>
          <PlanetEvidence />
        </Suspense>

        <EditorialSection
          className="mt-20 scroll-mt-28 sm:mt-28"
          headingId="planet-next-heading"
          index="Section 07"
          title="From pressures to pathways"
          lede="Understanding the problem is only half the record. The other half is what is documented to work."
          aside={
            <div className="flex flex-wrap items-center gap-x-7 gap-y-3">
              <Link
                href="/solutions"
                className="group/x inline-flex items-center gap-2 border-b border-foreground/25 pb-1 text-sm font-medium text-foreground transition-colors duration-200 hover:border-primary hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
              >
                <span>See the restoration pathways</span>
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
                Read the reporting
              </Link>
            </div>
          }
        >
          <p className="max-w-[70ch] text-[15px] leading-relaxed text-muted-foreground">
            Every pressure above has at least one documented countermeasure on file. We separate
            what has been measured from what is still being trialled, and we publish the
            difference.
          </p>
        </EditorialSection>
      </div>
    </>
  );
}
