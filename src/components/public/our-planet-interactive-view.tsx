"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { GlareHover } from "@/components/public/glare-hover";
import { formatDateTime } from "@/lib/utils/format";
import { resolveEditorialImageUrl } from "@/lib/utils/media-url";

const EASE = [0.22, 1, 0.36, 1] as const;

const GLOBAL_PRESSURES = [
  {
    id: "climate-change",
    pillarHref: "/explore/climate-atmosphere",
    title: "Climate Change",
    summary: "Greenhouse gas accumulation traps outgoing thermal radiation, raising global mean temperatures, accelerating glacier retreat, and amplifying regional heat and hydrological extremes.",
    keyDrivers: ["Fossil fuel combustion across electricity, transport, and heavy industry", "Land-use conversion and peatland drainage releasing stored soil carbon", "Permafrost thaw and reduced polar albedo creating amplifying feedbacks"],
  },
  {
    id: "biodiversity-loss",
    pillarHref: "/explore/forests-biodiversity",
    title: "Biodiversity Loss",
    summary: "Intact ecosystems depend on genetic, species, and habitat diversity. Rapid landscape fragmentation weakens pollination, soil fertility, and natural disease buffering.",
    keyDrivers: ["Primary forest clearing and agricultural frontier expansion", "Fragmentation of migratory corridors and freshwater wetlands", "Compounding pressure from shifting climate envelopes and invasive species"],
  },
  {
    id: "ocean-degradation",
    pillarHref: "/explore/oceans-water",
    title: "Ocean Degradation",
    summary: "Marine waters regulate planetary climate and sustain over a billion people directly, yet absorb rising heat and excess CO₂ that drive bleaching and acidification.",
    keyDrivers: ["Marine heatwaves pushing tropical coral reefs beyond thermal tolerance", "Ocean acidification reducing carbonate ions needed for calcifying organisms", "Coastal nutrient runoff expanding hypoxic dead zones alongside overfishing"],
  },
  {
    id: "pollution",
    pillarHref: "/explore/pollution-human-impact",
    title: "Pollution & Waste",
    summary: "Synthetic chemicals, microplastics, heavy metals, and airborne particulates persist across ecological boundaries — affecting watersheds, marine fauna, and urban health.",
    keyDrivers: ["Single-use polymer leakage into river basins and coastal gyres", "Fine particulate matter and tropospheric ozone from combustion and industry", "Untreated agricultural nutrients and electronic-waste leachates"],
  },
] as const;

interface CaseStudyItem {
  readonly id: string;
  readonly title: string;
  readonly slug: string;
  readonly summary: string;
  readonly country: string;
  readonly region: string | null;
  readonly latitude: number | null;
  readonly longitude: number | null;
  readonly cover_image_path: string | null;
  readonly pillarName: string;
  readonly pillarSlug: string;
  readonly start_date: string | null;
  readonly end_date: string | null;
}

interface StatisticItem {
  readonly id: string;
  readonly indicator: string;
  readonly value: number;
  readonly unit: string;
  readonly geographic_scope: string;
  readonly measurement_year: number;
  readonly methodology?: string | null;
  readonly reference?: { readonly organization: string; readonly title: string } | null;
  readonly publication_date?: string | null;
}

interface ReferenceItem {
  readonly id: string;
  readonly title: string;
  readonly organization: string;
  readonly source_type: string;
  readonly source_url: string;
  readonly publication_date: string | null;
  readonly author: string | null;
}

interface OurPlanetInteractiveViewProps {
  readonly caseStudies: readonly CaseStudyItem[];
  readonly statistics: readonly StatisticItem[];
  readonly references: readonly ReferenceItem[];
}

const SOURCE_TYPE_LABELS: Record<string, string> = {
  scientific_journal: "Scientific Journal",
  research_report: "Research Report",
  government_data: "Government Data",
  international_organization: "International Organization",
  institutional_report: "Institutional Report",
  other: "Authoritative Source",
};

export function OurPlanetInteractiveView({
  caseStudies,
  statistics,
  references,
}: OurPlanetInteractiveViewProps) {
  const prefersReduced = useReducedMotion() ?? false;
  const heroRef = useRef<HTMLElement>(null);

  const { scrollYProgress: heroScroll } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroImgY = useTransform(heroScroll, [0, 1], ["0%", "20%"]);
  const heroTextY = useTransform(heroScroll, [0, 1], ["0%", "35%"]);
  const heroOpacity = useTransform(heroScroll, [0, 0.85], [1, 0]);

  return (
    <div className="overflow-x-clip bg-background text-foreground">
      <section
        ref={heroRef}
        className="relative isolate flex min-h-[88svh] flex-col justify-end overflow-hidden bg-earth-deep-forest text-earth-ivory"
      >
        <motion.div
          style={prefersReduced ? undefined : { y: heroImgY }}
          className="absolute inset-0 -top-12 -bottom-12 z-0"
        >
          <Image
            src="/images/mangrove-coastal.jpg"
            alt="Lush coastal mangrove roots along an Indonesian shoreline"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center brightness-[0.78]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-earth-deep-forest via-earth-deep-forest/45 to-black/30" />
        </motion.div>

        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-1/4 -left-8 z-10 select-none opacity-[0.06]"
        >
          <span className="font-heading text-[22vw] leading-none tracking-tighter whitespace-nowrap text-earth-ivory">
            PLANETARY RECORD
          </span>
        </div>

        <motion.div
          style={prefersReduced ? undefined : { y: heroTextY, opacity: heroOpacity }}
          className="relative z-20 mx-auto w-full max-w-[1400px] px-4 pt-36 pb-14 sm:px-6 sm:pb-20 lg:px-10"
        >
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-earth-ivory/20 pb-5">
            <span className="font-mono text-[11px] tracking-[0.2em] text-earth-sage uppercase">
              05 / GLOBAL PRESSURES — PLANETARY STATE
            </span>
            <span className="font-mono text-[11px] tracking-[0.16em] text-earth-ivory/60">
              04 PRESSURES · {caseStudies.length} FIELD STUDIES · {statistics.length} MEASUREMENTS
            </span>
          </div>

          <div className="mt-8 grid gap-8 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-8">
              <motion.h1
                initial={prefersReduced ? false : { opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.85, ease: EASE }}
                className="font-heading text-[2.85rem] leading-[0.95] tracking-[-0.03em] text-earth-ivory sm:text-6xl lg:text-[5.2rem]"
              >
                What is happening to the planet,{" "}
                <span className="italic text-earth-sage">and where.</span>
              </motion.h1>
            </div>

            <motion.div
              initial={prefersReduced ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.85, delay: 0.15, ease: EASE }}
              className="lg:col-span-4 lg:pb-2"
            >
              <p className="text-[15px] leading-relaxed text-earth-ivory/80 sm:text-base">
                Four interacting pressures — warming, biodiversity loss, ocean change, and
                pollution — read against regional field studies and the measurements that document
                them.
              </p>
            </motion.div>
          </div>
        </motion.div>
      </section>

      <div
        aria-hidden="true"
        className="relative overflow-hidden border-y border-border bg-earth-deep-forest py-4 text-earth-ivory"
      >
        <motion.div
          animate={prefersReduced ? undefined : { x: ["0%", "-50%"] }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          className="flex w-max items-center gap-10 whitespace-nowrap font-mono text-xs tracking-[0.22em] text-earth-sage/90 uppercase"
        >
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="flex items-center gap-10">
              <span>CLIMATE CHANGE</span>
              <span className="text-earth-ivory/30">&bull;</span>
              <span>BIODIVERSITY LOSS</span>
              <span className="text-earth-ivory/30">&bull;</span>
              <span>OCEAN DEGRADATION</span>
              <span className="text-earth-ivory/30">&bull;</span>
              <span>POLLUTION & WASTE</span>
              <span className="text-earth-ivory/30">&bull;</span>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Featured field study */}
      <section className="mx-auto w-full max-w-[1400px] px-4 py-20 sm:px-6 sm:py-28 lg:px-10">
        <motion.div
          initial={prefersReduced ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: EASE }}
          className="flex items-center justify-between gap-4"
        >
          <div>
            <span className="font-mono text-[11px] tracking-[0.18em] text-earth-muted uppercase">
              Section 02 — Featured Field Study
            </span>
            <h2 className="mt-2 font-heading text-3xl tracking-[-0.02em] text-foreground sm:text-4xl">
              A single documented restoration effort, in full.
            </h2>
          </div>
        </motion.div>

        <div className="mt-12 grid gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-7">
            <p className="font-mono text-[10px] tracking-[0.12em] text-earth-muted">
              INDONESIA · COASTAL JAVA & KALIMANTAN
            </p>
            <h3 className="mt-4 font-heading text-[1.9rem] leading-[1.08] tracking-[-0.015em] text-foreground sm:text-4xl">
              <Link
                href="/case-studies/mangrove-restoration-in-coastal-indonesia"
                className="transition-colors duration-200 hover:text-primary"
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
              toward hydrological rehabilitation.
            </p>

            <Link
              href="/case-studies/mangrove-restoration-in-coastal-indonesia"
              className="group/x mt-8 inline-flex items-center gap-2 border-b border-foreground/25 pb-1.5 text-sm font-medium text-foreground transition-colors duration-200 hover:border-primary hover:text-primary"
            >
              <span>Read the full study</span>
              <ArrowUpRight className="size-4 transition-transform duration-300 group-hover/x:translate-x-0.5 group-hover/x:-translate-y-0.5" />
            </Link>
          </div>

          <figure className="lg:col-span-5">
            <GlareHover>
              <div className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl border border-border bg-secondary">
                <Image
                  src="/images/mangrove-coastal.jpg"
                  alt="Restored coastal mangrove belt stabilizing a tropical shoreline"
                  fill
                  sizes="(max-width: 1024px) 100vw, 36vw"
                  className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] hover:scale-[1.035]"
                />
              </div>
            </GlareHover>
            <figcaption className="mt-4 border-t border-border pt-3 font-mono text-[10px] leading-relaxed tracking-[0.1em] text-earth-muted">
              PERMEABLE SEDIMENT BARRIERS AND REOPENED TIDAL CHANNELS ALLOW PROPAGULES TO
              RE-ESTABLISH WITHOUT PLANTING.
            </figcaption>
          </figure>
        </div>
      </section>

      {/* Global pressures */}
      <section className="border-t border-border bg-earth-deep-forest py-20 text-earth-ivory sm:py-28">
        <div className="mx-auto w-full max-w-[1400px] px-4 sm:px-6 lg:px-10">
          <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
            <div>
              <span className="font-mono text-[11px] tracking-[0.18em] text-earth-sage uppercase">
                Section 03 — Major Planetary Pressures
              </span>
              <h2 className="mt-3 font-heading text-3xl tracking-[-0.02em] text-earth-ivory sm:text-5xl">
                Four pressures, one system.
              </h2>
            </div>
            <p className="max-w-md text-sm text-earth-ivory/70">
              How atmospheric warming, biodiversity loss, ocean chemistry, and pollution interact
              across global systems.
            </p>
          </div>

          <div className="relative mt-14">
            <ol className="grid gap-6 sm:grid-cols-2">
              {GLOBAL_PRESSURES.map((pressure, index) => (
                <motion.li
                  key={pressure.id}
                  initial={prefersReduced ? false : { opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.55, delay: index * 0.08, ease: EASE }}
                  className="group relative overflow-hidden rounded-2xl border border-earth-ivory/15 bg-earth-ivory/[0.03] p-7 transition-all duration-300 hover:-translate-y-1 hover:border-earth-sage/40 hover:bg-earth-ivory/[0.06]"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs text-earth-sage tabular-nums">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <Link
                      href={pressure.pillarHref}
                      className="text-earth-ivory/50 transition-colors duration-200 hover:text-earth-sage"
                    >
                      <ArrowUpRight className="size-4" />
                    </Link>
                  </div>

                  <h3 className="mt-4 font-heading text-2xl text-earth-ivory">
                    {pressure.title}
                  </h3>
                  <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-earth-ivory/70">
                    {pressure.summary}
                  </p>

                  <ul className="mt-5 flex flex-wrap gap-2">
                    {pressure.keyDrivers.map((driver) => (
                      <li
                        key={driver}
                        className="rounded-full border border-earth-ivory/15 bg-earth-ivory/[0.04] px-3 py-1 font-mono text-[10px] tracking-[0.08em] text-earth-ivory/60"
                      >
                        {driver.split(" ").slice(0, 3).join(" ")}…
                      </li>
                    ))}
                  </ul>
                </motion.li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* Regional case studies */}
      {caseStudies.length > 0 ? (
        <section className="mx-auto w-full max-w-[1400px] px-4 py-20 sm:px-6 sm:py-28 lg:px-10">
          <div className="flex items-center justify-between gap-4">
            <div>
              <span className="font-mono text-[11px] tracking-[0.18em] text-earth-muted uppercase">
                Section 04 — Regional Studies On File
              </span>
              <h2 className="mt-2 font-heading text-3xl tracking-[-0.02em] text-foreground sm:text-4xl">
                Field investigations, in full.
              </h2>
            </div>
            <Link
              href="/explore"
              className="group/x hidden items-center gap-2 text-sm font-medium text-foreground transition-colors duration-200 hover:text-primary sm:inline-flex"
            >
              <span>Open the domain ledger</span>
              <ArrowUpRight className="size-4 transition-transform duration-300 group-hover/x:translate-x-0.5 group-hover/x:-translate-y-0.5" />
            </Link>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {caseStudies.slice(0, 4).map((cs, index) => {
              const imageSrc = resolveEditorialImageUrl(cs.cover_image_path, { pillarSlug: cs.pillarSlug });
              const period = cs.start_date ? `${formatDateTime(cs.start_date)} — ${cs.end_date ? formatDateTime(cs.end_date) : "ongoing"}` : "Ongoing";
              return (
                <motion.div
                  key={cs.id}
                  initial={prefersReduced ? false : { opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.6, delay: index * 0.1, ease: EASE }}
                >
                  <Link
                    href={`/case-studies/${cs.slug}`}
                    className="group/card block overflow-hidden rounded-2xl border border-border bg-card transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg"
                  >
                    <div className="relative aspect-[16/9] w-full overflow-hidden bg-secondary">
                      <Image
                        src={imageSrc}
                        alt=""
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/card:scale-[1.04]"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      <span className="absolute bottom-3 left-3 rounded-full border border-earth-ivory/30 bg-earth-deep-forest/60 px-2.5 py-1 font-mono text-[10px] tracking-[0.12em] text-earth-ivory backdrop-blur-sm">
                        {cs.country}
                      </span>
                    </div>
                    <div className="p-6">
                      <h3 className="font-heading text-xl text-foreground transition-colors duration-200 group-hover/card:text-primary">
                        {cs.title}
                      </h3>
                      <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                        {cs.summary}
                      </p>
                      <div className="mt-4 flex items-center justify-between border-t border-border/60 pt-4">
                        <span className="font-mono text-[10px] tracking-[0.12em] text-earth-muted">
                          {cs.pillarName}
                        </span>
                        <span className="font-mono text-[10px] tracking-[0.12em] text-earth-muted tabular-nums">
                          {period}
                        </span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </section>
      ) : null}

      {/* Verified measurements */}
      {statistics.length > 0 ? (
        <section className="border-t border-border bg-muted/30 py-20 sm:py-24">
          <div className="mx-auto w-full max-w-[1400px] px-4 sm:px-6 lg:px-10">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
              <div>
                <span className="font-mono text-[11px] tracking-[0.18em] text-earth-muted uppercase">
                  Section 05 — Verified Measurements
                </span>
                <h2 className="mt-2 font-heading text-3xl tracking-[-0.02em] text-foreground sm:text-4xl">
                  Numbers, with their limitations.
                </h2>
              </div>
              <Link
                href="/our-planet#sources"
                className="group/x text-sm font-medium text-muted-foreground transition-colors duration-200 hover:text-foreground"
              >
                Open the full ledger &rarr;
              </Link>
            </div>

            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {statistics.slice(0, 6).map((stat, index) => {
                const isPercent = stat.unit === "%";
                const value = `${isPercent ? "~" : ""}${stat.value}`;
                const unit = isPercent ? "%" : stat.unit;
                const published = stat.publication_date ? String(new Date(stat.publication_date).getUTCFullYear()) : String(stat.measurement_year);
                return (
                  <motion.div
                    key={stat.id}
                    initial={prefersReduced ? false : { opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-60px" }}
                    transition={{ duration: 0.55, delay: index * 0.06, ease: EASE }}
                    className="group relative rounded-2xl border border-border bg-background p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-md"
                  >
                    <p className="flex items-baseline gap-1.5 font-heading text-[3rem] leading-none tracking-[-0.03em] text-foreground tabular-nums">
                      <span>{value}</span>
                      <span className="font-sans text-base font-medium text-muted-foreground">
                        {unit}
                      </span>
                    </p>
                    <p className="mt-3 text-[15px] font-medium text-foreground">{stat.indicator}</p>
                    <p className="mt-1.5 font-mono text-[10px] tracking-[0.1em] text-earth-muted">
                      {stat.geographic_scope} · {published}
                    </p>
                    <p className="mt-3 text-[12px] leading-relaxed text-muted-foreground">
                      {stat.reference?.organization ?? "Verified source"}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>
      ) : null}

      {/* Sources */}
      {references.length > 0 ? (
        <section className="mx-auto w-full max-w-[1400px] px-4 py-20 sm:px-6 sm:py-24 lg:px-10">
          <span className="font-mono text-[11px] tracking-[0.18em] text-earth-muted uppercase">
            Section 06 — Sources & References
          </span>
          <h2 className="mt-2 font-heading text-3xl tracking-[-0.02em] text-foreground sm:text-4xl">
            Institutional reports, peer-reviewed journals, public datasets.
          </h2>
          <div className="mt-10">
            <ol className="border-t border-border">
              {references.slice(0, 8).map((ref, index) => (
                <li
                  key={ref.id}
                  className="grid gap-3 border-b border-border py-5 sm:grid-cols-[3rem_1fr] sm:gap-6"
                >
                  <span className="font-mono text-[11px] tracking-[0.12em] text-earth-muted tabular-nums">
                    [{String(index + 1).padStart(2, "0")}]
                  </span>
                  <div className="flex flex-col gap-1.5">
                    <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 font-mono text-[10px] tracking-[0.12em] text-earth-muted uppercase">
                      <span>{SOURCE_TYPE_LABELS[ref.source_type] ?? "Authoritative Source"}</span>
                      <span className="text-border">/</span>
                      <span className="normal-case tracking-normal">{ref.organization}</span>
                    </div>
                    <h3 className="font-heading text-lg leading-snug text-foreground">
                      {ref.title}
                    </h3>
                    <p className="font-mono text-[10px] tracking-[0.1em] text-earth-muted">
                      {ref.author ? `${ref.author} · ` : ""}
                      {ref.publication_date ? `Published ${formatDateTime(ref.publication_date)}` : "Authoritative Source"}
                    </p>
                    <a
                      href={ref.source_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-1 inline-flex w-fit items-center gap-1.5 text-sm font-medium text-primary underline-offset-4 transition-colors hover:underline"
                    >
                      <span>Visit source</span>
                      <ArrowUpRight className="size-3.5" />
                    </a>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>
      ) : null}

      <section className="mx-auto w-full max-w-[1400px] px-4 py-20 sm:px-6 sm:py-24 lg:px-10">
        <div className="relative overflow-hidden rounded-3xl border border-border bg-muted/40 p-8 sm:p-12 lg:p-16">
          <div className="grid items-center gap-8 lg:grid-cols-12">
            <div className="lg:col-span-8">
              <span className="font-mono text-[11px] tracking-[0.18em] text-earth-muted uppercase">
                Section 07 — From Pressures To Pathways
              </span>
              <h2 className="mt-3 font-heading text-3xl leading-tight tracking-[-0.02em] text-foreground sm:text-4xl">
                Understanding the problem is only half the record.
              </h2>
              <p className="mt-4 max-w-[65ch] text-[15px] leading-relaxed text-muted-foreground">
                Every pressure above has at least one documented countermeasure on file. We
                separate what has been measured from what is still being trialled, and we publish
                the difference.
              </p>
            </div>

            <div className="flex flex-wrap gap-3 lg:col-span-4 lg:justify-end">
              <Link
                href="/solutions"
                className="group/btn inline-flex items-center gap-3 rounded-full bg-primary px-7 py-4 text-sm font-medium text-primary-foreground transition-transform duration-300 hover:scale-[1.03]"
              >
                <span>See the restoration pathways</span>
                <ArrowUpRight className="size-4 transition-transform duration-300 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
              </Link>
              <Link
                href="/stories"
                className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-3 text-sm font-medium text-foreground transition-colors duration-200 hover:border-primary hover:text-primary"
              >
                Read the reporting
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}