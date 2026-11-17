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
import { ArrowUpRight, Leaf, Zap, Trees, Droplets, Recycle, Sprout, Users, Globe2 } from "lucide-react";

const EASE = [0.22, 1, 0.36, 1] as const;

const PATHWAYS = [
  { title: "Climate Action", tag: "Mitigation & adaptation", description: "Cutting fossil emissions alongside heat-resilient urban planning and early-warning watershed infrastructure.", icon: Zap },
  { title: "Renewable Energy", tag: "Clean electrification", description: "Scaling solar, wind, geothermal, grid-scale storage, and electrified public transit across power systems.", icon: Zap },
  { title: "Forest Conservation", tag: "Canopy protection", description: "Protecting intact old-growth forests and Indigenous stewardship territories that hold irreplaceable carbon.", icon: Trees },
  { title: "Marine Conservation", tag: "Ocean sanctuaries", description: "Enforcing marine protected areas, sustainable fisheries governance, and reduced coastal nutrient runoff.", icon: Droplets },
  { title: "Waste Reduction", tag: "Upstream prevention", description: "Eliminating unnecessary single-use packaging, curbing food loss, and prioritizing durable design upstream.", icon: Recycle },
  { title: "Circular Economy", tag: "Material recovery", description: "Standardizing repairability, modular hardware, packaging reuse, and high-purity material recovery.", icon: Recycle },
  { title: "Ecosystem Restoration", tag: "Rewilding & rewetting", description: "Rewetting drained peatlands, removing obsolete river barriers, and replanting native mangrove belts.", icon: Sprout },
  { title: "Sustainable Consumption", tag: "Everyday stewardship", description: "Resource-light diets where appropriate, extended appliance lifespans, and low-carbon mobility.", icon: Leaf },
  { title: "Biodiversity Protection", tag: "Habitat corridors", description: "Linking fragmented habitats through wildlife corridors, riparian wetlands, and native plant buffers.", icon: Globe2 },
  { title: "Community Participation", tag: "Civic science", description: "Engaging neighborhood watershed monitors, municipal canopy programs, and civic land-use planning.", icon: Users },
] as const;

interface ArticleItem {
  readonly id: string;
  readonly title: string;
  readonly slug: string;
  readonly excerpt: string;
  readonly content: string;
  readonly cover_image_path: string | null;
  readonly pillarName: string;
  readonly pillarSlug: string;
  readonly published_at: string | null;
  readonly topicName: string | null;
}

interface CaseStudyItem {
  readonly id: string;
  readonly title: string;
  readonly slug: string;
  readonly summary: string;
  readonly country: string;
  readonly region: string | null;
  readonly cover_image_path: string | null;
  readonly pillarName: string;
  readonly pillarSlug: string;
  readonly organization: string | null;
  readonly start_date: string | null;
  readonly end_date: string | null;
}

interface SolutionsInteractiveViewProps {
  readonly articles: readonly ArticleItem[];
  readonly caseStudies: readonly CaseStudyItem[];
}

export function SolutionsInteractiveView({ articles, caseStudies }: SolutionsInteractiveViewProps) {
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
        className="relative isolate flex min-h-[38rem] flex-col justify-end overflow-hidden bg-earth-deep-forest text-earth-ivory sm:min-h-[42rem] lg:min-h-[46rem]"
      >
        <motion.div
          style={prefersReduced ? undefined : { y: heroImgY }}
          className="absolute inset-0 -top-12 -bottom-12 z-0"
        >
          <Image
            src="/images/pillar-solutions.jpg"
            alt="Young green sprout emerging from dark fertile soil"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center brightness-[0.78]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-earth-deep-forest via-earth-deep-forest/45 to-black/30" />
        </motion.div>

        <motion.div
          style={prefersReduced ? undefined : { y: heroTextY, opacity: heroOpacity }}
          className="relative z-20 mx-auto w-full max-w-[1400px] px-4 pt-36 pb-14 sm:px-6 sm:pb-20 lg:px-10"
        >
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-earth-ivory/20 pb-5">
            <span className="font-mono text-[11px] tracking-[0.2em] text-earth-sage uppercase">
              06 / STEWARDSHIP AND RECOVERY — PATHWAYS
            </span>
            <span className="font-mono text-[11px] tracking-[0.16em] text-earth-ivory/60">
              10 PATHWAYS · {articles.length} NOTES · {caseStudies.length} FIELD STUDIES
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
                What restoration{" "}
                <span className="italic text-earth-sage">currently looks like.</span>
              </motion.h1>
            </div>

            <motion.div
              initial={prefersReduced ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.85, delay: 0.15, ease: EASE }}
              className="lg:col-span-4 lg:pb-2"
            >
              <p className="text-[15px] leading-relaxed text-earth-ivory/80 sm:text-base">
                Ten working pathways — from grid decarbonisation to peatland rewetting — each
                paired with the field evidence that supports it. Nothing here is a silver bullet.
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
          transition={{ duration: 26, repeat: Infinity, ease: "linear" }}
          className="flex w-max items-center gap-10 whitespace-nowrap font-mono text-xs tracking-[0.22em] text-earth-sage/90 uppercase"
        >
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="flex items-center gap-10">
              <span>CLIMATE ACTION</span>
              <span className="text-earth-ivory/30">&bull;</span>
              <span>RENEWABLE ENERGY</span>
              <span className="text-earth-ivory/30">&bull;</span>
              <span>FOREST CONSERVATION</span>
              <span className="text-earth-ivory/30">&bull;</span>
              <span>MARINE CONSERVATION</span>
              <span className="text-earth-ivory/30">&bull;</span>
              <span>CIRCULAR ECONOMY</span>
              <span className="text-earth-ivory/30">&bull;</span>
              <span>ECOSYSTEM RESTORATION</span>
              <span className="text-earth-ivory/30">&bull;</span>
            </div>
          ))}
        </motion.div>
      </div>

      <section className="mx-auto w-full max-w-[1400px] px-4 py-20 sm:px-6 sm:py-28 lg:px-10">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <span className="font-mono text-[11px] tracking-[0.18em] text-earth-muted uppercase">
              Section 02 — Pathways For Ecological Recovery
            </span>
            <h2 className="mt-2 font-heading text-3xl tracking-[-0.02em] text-foreground sm:text-4xl">
              Ten working pathways.
            </h2>
          </div>
          <p className="max-w-md text-sm text-muted-foreground">
            Durable recovery pairs systemic policy and clean infrastructure with measurable local
            restoration. Each pathway names what it addresses and where it operates.
          </p>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {PATHWAYS.map((pathway, index) => {
            const Icon = pathway.icon;
            return (
              <motion.div
                key={pathway.title}
                initial={prefersReduced ? false : { opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: index * 0.05, ease: EASE }}
                className="group relative overflow-hidden rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg"
              >
                <div className="flex items-center justify-between">
                  <span className="flex size-10 items-center justify-center rounded-xl border border-border bg-background text-primary transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3">
                    <Icon className="size-5" aria-hidden="true" />
                  </span>
                  <span className="font-mono text-xs text-earth-muted tabular-nums">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>

                <p className="mt-5 font-mono text-[10px] tracking-[0.14em] text-earth-muted uppercase">
                  {pathway.tag}
                </p>
                <h3 className="mt-2 font-heading text-xl text-foreground transition-colors duration-200 group-hover:text-primary">
                  {pathway.title}
                </h3>
                <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                  {pathway.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {caseStudies.length > 0 || articles.length > 0 ? (
        <section className="border-t border-border bg-earth-deep-forest py-20 text-earth-ivory sm:py-28">
          <div className="mx-auto w-full max-w-[1400px] px-4 sm:px-6 lg:px-10">
            <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
              <div>
                <span className="font-mono text-[11px] tracking-[0.18em] text-earth-sage uppercase">
                  Section 03 — Documented Restoration On File
                </span>
                <h2 className="mt-3 font-heading text-3xl tracking-[-0.02em] text-earth-ivory sm:text-5xl">
                  Field studies, in full.
                </h2>
              </div>
              <Link
                href="/explore/solutions-restoration"
                className="group/x inline-flex items-center gap-2 rounded-full border border-earth-ivory/30 px-5 py-2.5 text-sm font-medium text-earth-ivory transition-colors duration-200 hover:border-earth-sage hover:bg-earth-sage/10"
              >
                <span>Open the domain page</span>
                <ArrowUpRight className="size-4 transition-transform duration-300 group-hover/x:translate-x-0.5 group-hover/x:-translate-y-0.5" />
              </Link>
            </div>

            {articles.length > 0 ? (
              <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {articles.slice(0, 3).map((article, index) => (
                  <motion.div
                    key={article.id}
                    initial={prefersReduced ? false : { opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-60px" }}
                    transition={{ duration: 0.55, delay: index * 0.1, ease: EASE }}
                    className="group relative overflow-hidden rounded-2xl border border-earth-ivory/15 bg-earth-ivory/[0.03] transition-all duration-300 hover:-translate-y-1 hover:border-earth-sage/40 hover:bg-earth-ivory/[0.06]"
                  >
                    <div className="relative aspect-[16/9] w-full overflow-hidden bg-earth-deep-forest/50">
                      <Image
                        src={article.cover_image_path || "/images/pillar-solutions.jpg"}
                        alt=""
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    </div>
                    <div className="p-6">
                      <h3 className="font-heading text-lg text-earth-ivory transition-colors duration-200 group-hover:text-earth-sage">
                        {article.title}
                      </h3>
                      <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-earth-ivory/70">
                        {article.excerpt}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : null}

            <div className="mt-8 grid gap-6 md:grid-cols-2">
              {caseStudies.slice(0, 2).map((cs, index) => (
                <motion.div
                  key={cs.id}
                  initial={prefersReduced ? false : { opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.55, delay: index * 0.1, ease: EASE }}
                >
                  <Link
                    href={`/case-studies/${cs.slug}`}
                    className="group/card block overflow-hidden rounded-2xl border border-earth-ivory/15 bg-earth-ivory/[0.03] transition-all duration-300 hover:-translate-y-1 hover:border-earth-sage/40 hover:bg-earth-ivory/[0.06]"
                  >
                    <div className="p-6">
                      <span className="font-mono text-[10px] tracking-[0.12em] text-earth-sage uppercase">
                        {cs.country}
                        {cs.region ? ` · ${cs.region}` : ""}
                      </span>
                      <h3 className="mt-3 font-heading text-xl text-earth-ivory transition-colors duration-200 group-hover/card:text-earth-sage">
                        {cs.title}
                      </h3>
                      <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-earth-ivory/70">
                        {cs.summary}
                      </p>
                      <div className="mt-4 flex items-center justify-between border-t border-earth-ivory/15 pt-4">
                        <span className="font-mono text-[10px] tracking-[0.12em] text-earth-ivory/60">
                          {cs.pillarName}
                        </span>
                        <span className="font-mono text-[10px] tracking-[0.12em] text-earth-ivory/60">
                          {cs.organization ?? "Documented Field Study"}
                        </span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <section className="mx-auto w-full max-w-[1400px] px-4 py-20 sm:px-6 sm:py-24 lg:px-10">
        <div className="relative overflow-hidden rounded-3xl border border-border bg-muted/40 p-8 sm:p-12 lg:p-16">
          <div className="grid items-center gap-8 lg:grid-cols-12">
            <div className="lg:col-span-8">
              <span className="font-mono text-[11px] tracking-[0.18em] text-earth-muted uppercase">
                Section 04 — Open Corrections & Contributions
              </span>
              <h2 className="mt-3 font-heading text-3xl leading-tight tracking-[-0.02em] text-foreground sm:text-4xl">
                Have a documented case study?
              </h2>
              <p className="mt-4 max-w-[65ch] text-[15px] leading-relaxed text-muted-foreground">
                THE LIVING EARTH does not publish restoration claims without an assigned
                implementing organisation, a location, and a measurement period. If a project is
                still in progress, we file it as a case study rather than a result.
              </p>
            </div>

            <div className="flex flex-wrap gap-3 lg:col-span-4 lg:justify-end">
              <Link
                href="/contact"
                className="group/btn inline-flex items-center gap-3 rounded-full bg-primary px-7 py-4 text-sm font-medium text-primary-foreground transition-transform duration-300 hover:scale-[1.03]"
              >
                <span>Submit a record</span>
                <ArrowUpRight className="size-4 transition-transform duration-300 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
              </Link>
              <Link
                href="/our-planet"
                className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-3 text-sm font-medium text-foreground transition-colors duration-200 hover:border-primary hover:text-primary"
              >
                See the global pressures
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}