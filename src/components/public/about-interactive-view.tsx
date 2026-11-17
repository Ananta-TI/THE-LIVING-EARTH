"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  AnimatePresence,
} from "motion/react";
import { ArrowUpRight, BookOpen, Eye, Leaf, Users } from "lucide-react";
import { GlareHover } from "@/components/public/glare-hover";
import { CONTENT_PILLARS } from "@/lib/constants/pillars";

const EASE = [0.22, 1, 0.36, 1] as const;

const CORE_VALUES = [
  {
    code: "01",
    title: "Knowledge",
    description: "Verified facts grounded in peer-reviewed research and raw telemetry.",
    icon: BookOpen,
    accent: "from-emerald-500/15 to-transparent",
  },
  {
    code: "02",
    title: "Action",
    description: "Practical, evidence-led conservation pathways scaled for real ecosystems.",
    icon: Leaf,
    accent: "from-teal-500/15 to-transparent",
  },
  {
    code: "03",
    title: "Clarity",
    description: "Accessible visual storytelling without sensationalism or alarmism.",
    icon: Eye,
    accent: "from-amber-500/15 to-transparent",
  },
  {
    code: "04",
    title: "Collaboration",
    description: "Shared civic, scientific, and indigenous community stewardship.",
    icon: Users,
    accent: "from-lime-500/15 to-transparent",
  },
] as const;

const APPROACH_STEPS = [
  {
    step: "01",
    tag: "TELEMETRY & ARCHIVES",
    title: "Primary scientific documentation",
    body: "Research summaries cite peer-reviewed journals, environmental assessments, and institutional datasets with clear observation dates and measurement units.",
    metric: "100% Peer-Reviewed Provenance",
  },
  {
    step: "02",
    tag: "FIELD REPORTING",
    title: "Place-based field case studies",
    body: "Broad global indicators become tangible when grounded in regional watersheds, coral reefs, rainforest corridors, and coastal restoration initiatives.",
    metric: "42+ Active Field Corridors",
  },
  {
    step: "03",
    tag: "SYSTEMS SYNTHESIS",
    title: "Balanced solutions analysis",
    body: "Instead of simplified silver bullets, we examine ecological trade-offs, implementation timelines, and how systemic policy aligns with daily action.",
    metric: "3-Layer Verification Protocol",
  },
] as const;

const PUBLISHING_FACTS = [
  { value: "05", label: "Planetary Domains", detail: "Atmosphere to Restoration" },
  { value: "04", label: "Working Principles", detail: "Editorial Guardrails" },
  { value: "03", label: "Editorial Layers", detail: "Data, Place & Action" },
  { value: "01", label: "Minimum Source", detail: "Per Published Figure" },
] as const;

const DOMAIN_PREVIEWS: Record<string, string> = {
  "climate-atmosphere": "/images/hero-planet.jpg",
  "oceans-water": "/images/about-earth.jpg",
  "forests-biodiversity": "/images/pillar-forests.jpg",
  "pollution-human-impact": "/images/pillar-pollution.jpg",
  "solutions-restoration": "/images/pillar-solutions.jpg",
};

export function AboutInteractiveView() {
  const prefersReduced = useReducedMotion() ?? false;
  const heroRef = useRef<HTMLElement>(null);
  const figureRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress: heroScroll } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroImgY = useTransform(heroScroll, [0, 1], ["0%", "22%"]);
  const heroTextY = useTransform(heroScroll, [0, 1], ["0%", "40%"]);
  const heroOpacity = useTransform(heroScroll, [0, 0.85], [1, 0]);

  const { scrollYProgress: figScroll } = useScroll({
    target: figureRef,
    offset: ["start end", "end start"],
  });
  const figImgScale = useTransform(figScroll, [0, 0.5, 1], [1.14, 1.03, 1]);

  const [hoveredDomain, setHoveredDomain] = useState<string | null>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 260, damping: 28, mass: 0.5 });
  const springY = useSpring(mouseY, { stiffness: 260, damping: 28, mass: 0.5 });

  const handleDomainMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left + 28);
    mouseY.set(e.clientY - rect.top - 90);
  };

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
            src="/images/hero-planet.jpg"
            alt="Misty mountain peaks and evergreen rainforest canopy"
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
              01 / WHO WE ARE — PUBLIC ARCHIVE
            </span>
            <span className="font-mono text-[11px] tracking-[0.16em] text-earth-ivory/60">
              EST. OBSERVATORY EDITION
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
                An environmental record,{" "}
                <span className="italic text-earth-sage">kept in public.</span>
              </motion.h1>
            </div>

            <motion.div
              initial={prefersReduced ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.85, delay: 0.15, ease: EASE }}
              className="lg:col-span-4 lg:pb-2"
            >
              <p className="text-[15px] leading-relaxed text-earth-ivory/80 sm:text-base">
                Documenting how the planet is changing and what is being done about it. Every
                number we publish carries a source; every place we describe has been reported.
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
          transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
          className="flex w-max items-center gap-10 whitespace-nowrap font-mono text-xs tracking-[0.22em] text-earth-sage/90 uppercase"
        >
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="flex items-center gap-10">
              <span>PEER-REVIEWED TELEMETRY</span>
              <span className="text-earth-ivory/30">&bull;</span>
              <span>FIELD CORRIDOR DISPATCHES</span>
              <span className="text-earth-ivory/30">&bull;</span>
              <span>OPEN PROVENANCE DATA</span>
              <span className="text-earth-ivory/30">&bull;</span>
              <span>ECOLOGICAL RESTORATION</span>
              <span className="text-earth-ivory/30">&bull;</span>
              <span>ZERO ALARMISM</span>
              <span className="text-earth-ivory/30">&bull;</span>
            </div>
          ))}
        </motion.div>
      </div>

      <section className="mx-auto w-full max-w-[1400px] px-4 py-20 sm:px-6 sm:py-28 lg:px-10">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-7">
            <motion.div
              initial={prefersReduced ? false : { opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7, ease: EASE }}
            >
              <span className="inline-flex items-center gap-2 rounded-full border border-border bg-muted/50 px-3.5 py-1 font-mono text-[10px] tracking-[0.16em] text-earth-muted uppercase">
                <span className="size-1.5 rounded-full bg-primary" />
                Section 02 — Manifesto
              </span>

              <h2 className="mt-6 font-heading text-2xl leading-[1.18] tracking-[-0.02em] text-foreground sm:text-4xl lg:text-[2.65rem]">
                A publicly literate world where nature and humanity thrive together — guided by
                calm, accurate understanding of how{" "}
                <span className="underline decoration-primary/40 decoration-2 underline-offset-8">
                  climate, water, forests, and human systems
                </span>{" "}
                depend on one another.
              </h2>

              <p className="mt-8 max-w-[62ch] border-l-2 border-primary/50 pl-5 text-base leading-relaxed text-muted-foreground">
                Our mission is to deliver accessible environmental journalism, transparent
                scientific indicators with named provenance, and regional conservation case studies
                that inspire informed ecological stewardship.
              </p>
            </motion.div>

            <div className="mt-14">
              <div className="mb-5 flex items-center justify-between">
                <h3 className="font-mono text-[11px] tracking-[0.16em] text-earth-muted uppercase">
                  Working Principles
                </h3>
                <span className="font-mono text-[11px] text-earth-muted">01 — 04</span>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {CORE_VALUES.map((value, idx) => {
                  const Icon = value.icon;
                  return (
                    <motion.div
                      key={value.title}
                      initial={prefersReduced ? false : { opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-60px" }}
                      transition={{ duration: 0.55, delay: idx * 0.08, ease: EASE }}
                      className={`group relative overflow-hidden rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg ${
                        idx % 2 === 1 ? "sm:translate-y-4" : ""
                      }`}
                    >
                      <div
                        className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${value.accent} opacity-0 transition-opacity duration-500 group-hover:opacity-100`}
                      />
                      <div className="relative z-10 flex items-center justify-between">
                        <span className="flex size-11 items-center justify-center rounded-xl border border-border bg-background text-primary transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3">
                          <Icon className="size-5" aria-hidden="true" />
                        </span>
                        <span className="font-mono text-xs text-earth-muted tabular-nums">
                          /{value.code}
                        </span>
                      </div>

                      <h4 className="relative z-10 mt-6 font-heading text-xl text-foreground">
                        {value.title}
                      </h4>
                      <p className="relative z-10 mt-2 text-sm leading-relaxed text-muted-foreground">
                        {value.description}
                      </p>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>

          <div ref={figureRef} className="lg:col-span-5 lg:pt-12">
            <div className="sticky top-28">
              <GlareHover>
                <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl border border-border bg-secondary">
                  <motion.div
                    style={prefersReduced ? undefined : { scale: figImgScale }}
                    className="relative h-full w-full"
                  >
                    <Image
                      src="/images/about-earth.jpg"
                      alt="Aerial view of coastal river delta channels flowing through mangroves to the sea"
                      fill
                      sizes="(min-width: 1024px) 40vw, 100vw"
                      className="object-cover"
                    />
                  </motion.div>
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent p-6 text-earth-ivory">
                    <span className="font-mono text-[10px] tracking-[0.16em] text-earth-sage uppercase">
                      FIELD PLATE 04 — ESTUARY SYSTEMS
                    </span>
                    <p className="mt-1.5 text-xs leading-relaxed text-earth-ivory/85">
                      Coastal deltas connect terrestrial watersheds, mangrove biodiversity, and
                      marine currents into a single living system.
                    </p>
                  </div>
                </div>
              </GlareHover>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-muted/30 py-20 sm:py-24">
        <div className="mx-auto w-full max-w-[1400px] px-4 sm:px-6 lg:px-10">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <span className="font-mono text-[11px] tracking-[0.18em] text-earth-muted uppercase">
                Section 03 — By The Numbers
              </span>
              <h2 className="mt-2 font-heading text-3xl tracking-[-0.02em] text-foreground sm:text-4xl">
                The shape of the record
              </h2>
            </div>
            <p className="max-w-sm text-sm text-muted-foreground">
              Every metric on this platform adheres to strict provenance and verification
              standards.
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {PUBLISHING_FACTS.map((fact, idx) => (
              <motion.div
                key={fact.label}
                initial={prefersReduced ? false : { opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.6, delay: idx * 0.08, ease: EASE }}
                className="group relative flex flex-col justify-between rounded-2xl border border-border bg-background p-7 transition-colors duration-300 hover:border-primary/50"
              >
                <div className="flex items-start justify-between">
                  <span className="font-heading text-[4rem] leading-none tracking-[-0.04em] text-foreground transition-colors duration-300 group-hover:text-primary sm:text-[4.8rem]">
                    {fact.value}
                  </span>
                  <ArrowUpRight className="size-5 text-muted-foreground/40 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-primary" />
                </div>

                <div className="mt-10 border-t border-border pt-4">
                  <p className="font-mono text-[11px] font-medium tracking-[0.12em] text-foreground uppercase">
                    {fact.label}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">{fact.detail}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section
        id="approach"
        className="mx-auto w-full max-w-[1400px] scroll-mt-24 px-4 py-20 sm:px-6 sm:py-28 lg:px-10"
      >
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <div className="sticky top-28">
              <span className="font-mono text-[11px] tracking-[0.18em] text-earth-muted uppercase">
                Section 04 — Methodology
              </span>
              <h2 className="mt-3 font-heading text-3xl leading-tight tracking-[-0.02em] text-foreground sm:text-5xl">
                How each entry is made.
              </h2>
              <p className="mt-5 text-[15px] leading-relaxed text-muted-foreground">
                Every topic follows a three-layer editorial architecture connecting raw scientific
                measurements with place-based reporting and balanced restoration options.
              </p>

              <div className="mt-8 rounded-2xl border border-border bg-earth-deep-forest p-6 text-earth-ivory">
                <p className="font-mono text-[10px] tracking-[0.16em] text-earth-sage uppercase">
                  VERIFICATION PLEDGE
                </p>
                <p className="mt-2 text-sm leading-relaxed text-earth-ivory/85">
                  Where the science carries uncertainty ranges, we publish the confidence interval
                  explicitly rather than smoothing it over.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-6 lg:col-span-7">
            {APPROACH_STEPS.map((item, idx) => (
              <motion.article
                key={item.step}
                initial={prefersReduced ? false : { opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.65, delay: idx * 0.1, ease: EASE }}
                className="group rounded-2xl border border-border bg-card p-8 transition-all duration-300 hover:border-primary/40 hover:shadow-md sm:p-10"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <span className="font-mono text-xs tracking-[0.16em] text-primary">
                    LAYER {item.step} — {item.tag}
                  </span>
                  <span className="rounded-full border border-border bg-muted px-3 py-1 font-mono text-[10px] text-muted-foreground">
                    {item.metric}
                  </span>
                </div>

                <h3 className="mt-5 font-heading text-2xl leading-snug text-foreground sm:text-3xl">
                  {item.title}
                </h3>
                <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">
                  {item.body}
                </p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-border bg-earth-deep-forest py-20 text-earth-ivory sm:py-28">
        <div className="mx-auto w-full max-w-[1400px] px-4 sm:px-6 lg:px-10">
          <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
            <div>
              <span className="font-mono text-[11px] tracking-[0.18em] text-earth-sage uppercase">
                Section 05 — Planetary Systems
              </span>
              <h2 className="mt-3 font-heading text-3xl tracking-[-0.02em] text-earth-ivory sm:text-5xl">
                The five domains we cover
              </h2>
            </div>

            <Link
              href="/explore"
              className="group/x inline-flex items-center gap-2 rounded-full border border-earth-ivory/30 px-5 py-2.5 text-sm font-medium text-earth-ivory transition-colors duration-200 hover:border-earth-sage hover:bg-earth-sage/10"
            >
              <span>Open the domain ledger</span>
              <ArrowUpRight className="size-4 transition-transform duration-300 group-hover/x:translate-x-0.5 group-hover/x:-translate-y-0.5" />
            </Link>
          </div>

          <div
            onMouseMove={handleDomainMouseMove}
            onMouseLeave={() => setHoveredDomain(null)}
            className="relative mt-14 border-t border-earth-ivory/15"
          >
            {!prefersReduced && (
              <motion.div
                style={{ x: springX, y: springY }}
                className="pointer-events-none absolute top-0 left-0 z-30 hidden h-48 w-72 overflow-hidden rounded-xl border border-earth-ivory/25 shadow-2xl lg:block"
                animate={{
                  opacity: hoveredDomain ? 1 : 0,
                  scale: hoveredDomain ? 1 : 0.9,
                }}
                transition={{ duration: 0.25, ease: EASE }}
              >
                <AnimatePresence mode="wait">
                  {hoveredDomain ? (
                    <motion.div
                      key={hoveredDomain}
                      initial={{ opacity: 0, scale: 1.08 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="relative h-full w-full"
                    >
                      <Image
                        src={DOMAIN_PREVIEWS[hoveredDomain] ?? "/images/hero-planet.jpg"}
                        alt=""
                        fill
                        sizes="288px"
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                      <span className="absolute bottom-3 left-3 font-mono text-[10px] tracking-[0.14em] text-earth-sage uppercase">
                        EXPLORE DOMAIN &rarr;
                      </span>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </motion.div>
            )}

            <ol>
              {CONTENT_PILLARS.map((pillar) => (
                <li
                  key={pillar.slug}
                  onMouseEnter={() => setHoveredDomain(pillar.slug)}
                  className="border-b border-earth-ivory/15"
                >
                  <Link
                    href={pillar.href}
                    className="group/row grid items-center gap-x-8 gap-y-3 py-7 transition-colors duration-300 hover:bg-earth-ivory/[0.04] lg:grid-cols-12 lg:px-4"
                  >
                    <span className="font-mono text-xs text-earth-sage tabular-nums lg:col-span-1">
                      {pillar.code}
                    </span>
                    <span className="font-heading text-2xl text-earth-ivory transition-transform duration-300 group-hover/row:translate-x-2 sm:text-3xl lg:col-span-5">
                      {pillar.title}
                    </span>
                    <span className="text-sm leading-relaxed text-earth-ivory/70 lg:col-span-5">
                      {pillar.subtitle}
                    </span>
                    <span className="hidden justify-end lg:col-span-1 lg:flex">
                      <span className="flex size-10 items-center justify-center rounded-full border border-earth-ivory/20 text-earth-ivory transition-all duration-300 group-hover/row:border-earth-sage group-hover/row:bg-earth-sage group-hover/row:text-earth-deep-forest">
                        <ArrowUpRight className="size-4" />
                      </span>
                    </span>
                  </Link>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-[1400px] px-4 py-20 sm:px-6 sm:py-24 lg:px-10">
        <div className="relative overflow-hidden rounded-3xl border border-border bg-muted/40 p-8 sm:p-12 lg:p-16">
          <div className="grid items-center gap-8 lg:grid-cols-12">
            <div className="lg:col-span-8">
              <span className="font-mono text-[11px] tracking-[0.18em] text-earth-muted uppercase">
                Section 06 — Open Corrections &amp; Contributions
              </span>
              <h2 className="mt-3 font-heading text-3xl leading-tight tracking-[-0.02em] text-foreground sm:text-4xl">
                Spot an outdated figure or have field data to contribute?
              </h2>
              <p className="mt-4 max-w-[65ch] text-[15px] leading-relaxed text-muted-foreground">
                If a figure on this site is wrong, we want to hear it first. Send the citation and
                we will review, correct, and republish with a transparent changelog note.
              </p>
            </div>

            <div className="flex lg:col-span-4 lg:justify-end">
              <Link
                href="/contact"
                className="group/btn inline-flex items-center gap-3 rounded-full bg-primary px-7 py-4 text-sm font-medium text-primary-foreground transition-transform duration-300 hover:scale-[1.03]"
              >
                <span>Reach the editorial desk</span>
                <ArrowUpRight className="size-4 transition-transform duration-300 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}