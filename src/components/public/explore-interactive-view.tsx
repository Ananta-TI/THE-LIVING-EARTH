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
import { ArrowUpRight } from "lucide-react";
import { CONTENT_PILLARS } from "@/lib/constants/pillars";

const EASE = [0.22, 1, 0.36, 1] as const;

const DOMAIN_PREVIEWS: Record<string, string> = {
  "climate-atmosphere": "/images/pillar-climate.jpg",
  "oceans-water": "/images/sea-turtle.jpg",
  "forests-biodiversity": "/images/pillar-forests.jpg",
  "pollution-human-impact": "/images/pillar-pollution.jpg",
  "solutions-restoration": "/images/pillar-solutions.jpg",
};

const DOMAIN_QUESTIONS = [
  { domain: "Climate", question: "How fast is the atmosphere warming, and what does each fraction of a degree change?", href: "/explore/climate-atmosphere" },
  { domain: "Oceans", question: "What happens to marine chemistry, coral reefs, and freshwater when heat accumulates?", href: "/explore/oceans-water" },
  { domain: "Forests", question: "Which canopies are irreplaceable, and what lives inside them?", href: "/explore/forests-biodiversity" },
  { domain: "Human impact", question: "Where do pollution, waste, and land conversion land in the end?", href: "/explore/pollution-human-impact" },
  { domain: "Restoration", question: "Which interventions are documented to work, and on what timescale?", href: "/explore/solutions-restoration" },
] as const;

const CROSS_LINKS = [
  { label: "Our Planet", body: "Global pressures, regional case studies, and every published measurement with its source.", href: "/our-planet" },
  { label: "Stories", body: "Long-form reporting and field dispatches, listed in the order they were recorded.", href: "/stories" },
  { label: "Solutions", body: "Ten working pathways for recovery, with the case studies that evidence them.", href: "/solutions" },
] as const;

export function ExploreInteractiveView() {
  const prefersReduced = useReducedMotion() ?? false;
  const heroRef = useRef<HTMLElement>(null);

  const { scrollYProgress: heroScroll } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroImgY = useTransform(heroScroll, [0, 1], ["0%", "20%"]);
  const heroTextY = useTransform(heroScroll, [0, 1], ["0%", "35%"]);
  const heroOpacity = useTransform(heroScroll, [0, 0.85], [1, 0]);

  const [hoveredDomain, setHoveredDomain] = useState<string | null>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 260, damping: 28, mass: 0.5 });
  const springY = useSpring(mouseY, { stiffness: 260, damping: 28, mass: 0.5 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left + 28);
    mouseY.set(e.clientY - rect.top - 90);
  };

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
            src="/images/about-earth.jpg"
            alt="High-altitude coastal river delta flowing into azure ocean reefs"
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
            FIVE DOMAINS
          </span>
        </div>

        <motion.div
          style={prefersReduced ? undefined : { y: heroTextY, opacity: heroOpacity }}
          className="relative z-20 mx-auto w-full max-w-[1400px] px-4 pt-36 pb-14 sm:px-6 sm:pb-20 lg:px-10"
        >
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-earth-ivory/20 pb-5">
            <span className="font-mono text-[11px] tracking-[0.2em] text-earth-sage uppercase">
              02 / THE FIVE DOMAINS — PLANETARY SYSTEMS
            </span>
            <span className="font-mono text-[11px] tracking-[0.16em] text-earth-ivory/60">
              05 DOMAINS · 15+ TOPICS · 40+ NOTES
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
                Explore our planet,{" "}
                <span className="italic text-earth-sage">system by system.</span>
              </motion.h1>
            </div>

            <motion.div
              initial={prefersReduced ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.85, delay: 0.15, ease: EASE }}
              className="lg:col-span-4 lg:pb-2"
            >
              <p className="text-[15px] leading-relaxed text-earth-ivory/80 sm:text-base">
                Five interconnected systems — atmosphere, water, forest, human pressure, and
                restoration. Each domain holds its own indexed topics, published notes, field
                studies, and measurements.
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
          transition={{ duration: 32, repeat: Infinity, ease: "linear" }}
          className="flex w-max items-center gap-10 whitespace-nowrap font-mono text-xs tracking-[0.22em] text-earth-sage/90 uppercase"
        >
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="flex items-center gap-10">
              <span>CLIMATE & ATMOSPHERE</span>
              <span className="text-earth-ivory/30">&bull;</span>
              <span>OCEANS & WATER</span>
              <span className="text-earth-ivory/30">&bull;</span>
              <span>FORESTS & BIODIVERSITY</span>
              <span className="text-earth-ivory/30">&bull;</span>
              <span>POLLUTION & HUMAN IMPACT</span>
              <span className="text-earth-ivory/30">&bull;</span>
              <span>SOLUTIONS & RESTORATION</span>
              <span className="text-earth-ivory/30">&bull;</span>
            </div>
          ))}
        </motion.div>
      </div>

      <section className="border-b border-border bg-muted/30 py-16 sm:py-20">
        <div className="mx-auto w-full max-w-[1400px] px-4 sm:px-6 lg:px-10">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <span className="font-mono text-[11px] tracking-[0.18em] text-earth-muted uppercase">
                Section 02 — The Domain Ledger
              </span>
              <h2 className="mt-2 font-heading text-3xl tracking-[-0.02em] text-foreground sm:text-4xl">
                Five domains, one record
              </h2>
            </div>
            <p className="max-w-md text-sm text-muted-foreground">
              05 domains · 15+ indexed topics · 40+ published notes. Each domain is a complete
              reading instrument.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-[1400px] px-4 py-16 sm:px-6 sm:py-20 lg:px-10">
        <div
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setHoveredDomain(null)}
          className="relative"
        >
          {!prefersReduced && (
            <motion.div
              style={{ x: springX, y: springY }}
              className="pointer-events-none absolute top-0 left-0 z-30 hidden h-44 w-64 overflow-hidden rounded-xl border border-border shadow-2xl lg:block"
              animate={{ opacity: hoveredDomain ? 1 : 0, scale: hoveredDomain ? 1 : 0.9 }}
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
                      sizes="256px"
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                    <span className="absolute bottom-3 left-3 font-mono text-[10px] tracking-[0.14em] text-earth-sage uppercase">
                      OPEN DOMAIN &rarr;
                    </span>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </motion.div>
          )}

          <ol className="border-t border-border">
            {CONTENT_PILLARS.map((pillar) => (
              <li
                key={pillar.slug}
                onMouseEnter={() => setHoveredDomain(pillar.slug)}
                className="border-b border-border"
              >
                <Link
                  href={pillar.href}
                  className="group/row grid items-center gap-x-8 gap-y-3 py-7 transition-colors duration-300 hover:bg-muted/40 lg:grid-cols-12 lg:px-4 lg:py-9"
                >
                  <span className="font-mono text-xs text-earth-muted tabular-nums lg:col-span-1">
                    {pillar.code}
                  </span>
                  <span className="font-heading text-2xl text-foreground transition-transform duration-300 group-hover/row:translate-x-2 sm:text-3xl lg:col-span-4">
                    {pillar.title}
                  </span>
                  <span className="text-sm leading-relaxed text-muted-foreground lg:col-span-5">
                    {pillar.subtitle}
                  </span>
                  <span className="hidden justify-end lg:col-span-2 lg:flex">
                    <span className="flex size-10 items-center justify-center rounded-full border border-border text-muted-foreground transition-all duration-300 group-hover/row:border-primary group-hover/row:bg-primary group-hover/row:text-primary-foreground">
                      <ArrowUpRight className="size-4" />
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="border-t border-border bg-earth-deep-forest py-20 text-earth-ivory sm:py-28">
        <div className="mx-auto w-full max-w-[1400px] px-4 sm:px-6 lg:px-10">
          <span className="font-mono text-[11px] tracking-[0.18em] text-earth-sage uppercase">
            Section 03 — What Each Domain Answers
          </span>
          <h2 className="mt-3 font-heading text-3xl tracking-[-0.02em] text-earth-ivory sm:text-5xl">
            Questions, not subjects.
          </h2>
          <p className="mt-5 max-w-[60ch] text-[15px] leading-relaxed text-earth-ivory/70">
            The archive is organised around questions rather than subjects. Every note, study, and
            measurement filed under a domain exists to close one of these gaps.
          </p>

          <ol className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
            {DOMAIN_QUESTIONS.map((item, index) => (
              <motion.li
                key={item.domain}
                initial={prefersReduced ? false : { opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.55, delay: index * 0.07, ease: EASE }}
                className="group relative rounded-2xl border border-earth-ivory/15 bg-earth-ivory/[0.03] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-earth-sage/40 hover:bg-earth-ivory/[0.06]"
              >
                <span className="font-mono text-xs text-earth-sage tabular-nums">
                  {String(index + 1).padStart(2, "0")} · {item.domain}
                </span>
                <p className="mt-4 font-heading text-lg leading-snug text-earth-ivory">
                  {item.question}
                </p>
                <Link
                  href={item.href}
                  className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-earth-sage transition-colors duration-200 hover:text-earth-ivory"
                >
                  <span>Open domain</span>
                  <ArrowUpRight className="size-3.5" />
                </Link>
              </motion.li>
            ))}
          </ol>
        </div>
      </section>

      <section className="mx-auto w-full max-w-[1400px] px-4 py-20 sm:px-6 sm:py-24 lg:px-10">
        <div className="relative overflow-hidden rounded-3xl border border-border bg-muted/40 p-8 sm:p-12 lg:p-16">
          <div className="grid items-center gap-8 lg:grid-cols-12">
            <div className="lg:col-span-8">
              <span className="font-mono text-[11px] tracking-[0.18em] text-earth-muted uppercase">
                Section 04 — Where The Domains Meet
              </span>
              <h2 className="mt-3 font-heading text-3xl leading-tight tracking-[-0.02em] text-foreground sm:text-4xl">
                Cross-cutting pressures rarely respect a single domain.
              </h2>
              <p className="mt-4 max-w-[65ch] text-[15px] leading-relaxed text-muted-foreground">
                Our Planet holds the global breakdowns and comparative measurements; Stories holds
                the reporting that connects them.
              </p>
            </div>

            <div className="flex lg:col-span-4 lg:justify-end">
              <Link
                href="/our-planet"
                className="group/btn inline-flex items-center gap-3 rounded-full bg-primary px-7 py-4 text-sm font-medium text-primary-foreground transition-transform duration-300 hover:scale-[1.03]"
              >
                <span>Read the global breakdowns</span>
                <ArrowUpRight className="size-4 transition-transform duration-300 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
              </Link>
            </div>
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {CROSS_LINKS.map((item) => (
              <motion.div
                key={item.label}
                initial={prefersReduced ? false : { opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.55, delay: 0.08, ease: EASE }}
                className="group rounded-2xl border border-border bg-background p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-md"
              >
                <h3 className="font-heading text-xl text-foreground transition-colors duration-200 group-hover:text-primary">
                  <Link href={item.href}>{item.label}</Link>
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}