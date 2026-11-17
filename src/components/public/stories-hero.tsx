"use client";

import { useRef } from "react";
import Image from "next/image";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";

const EASE = [0.22, 1, 0.36, 1] as const;

interface StoriesHeroProps {
  readonly standfirst?: string;
  readonly imageSrc?: string;
  readonly imageAlt?: string;
  readonly count?: number;
}

export function StoriesHero({
  standfirst = "Long-form reporting and field dispatches across all five domains — each entry carries its domain, topic, publication date, and reading time.",
  imageSrc = "/images/hero-planet.jpg",
  imageAlt = "Forest river valley canopy representing environmental stories",
  count,
}: StoriesHeroProps) {
  const prefersReduced = useReducedMotion() ?? false;
  const heroRef = useRef<HTMLElement>(null);

  const { scrollYProgress: heroScroll } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroImgY = useTransform(heroScroll, [0, 1], ["0%", "20%"]);
  const heroTextY = useTransform(heroScroll, [0, 1], ["0%", "35%"]);
  const heroOpacity = useTransform(heroScroll, [0, 0.85], [1, 0]);

  return (
    <>
      <section
        ref={heroRef}
      className="relative isolate flex min-h-[88svh] flex-col justify-end overflow-hidden bg-earth-deep-forest text-earth-ivory"
    >
      <motion.div
        style={prefersReduced ? undefined : { y: heroImgY }}
        className="absolute inset-0 -top-12 -bottom-12 z-0"
      >
        <Image
          src={imageSrc}
          alt={imageAlt}
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
          THE ARCHIVE
        </span>
      </div>

      <motion.div
        style={prefersReduced ? undefined : { y: heroTextY, opacity: heroOpacity }}
        className="relative z-20 mx-auto w-full max-w-[1400px] px-4 pt-36 pb-14 sm:px-6 sm:pb-20 lg:px-10"
      >
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-earth-ivory/20 pb-5">
          <span className="font-mono text-[11px] tracking-[0.2em] text-earth-sage uppercase">
            03 / THE ARCHIVE — FIELD NOTES
          </span>
          <span className="font-mono text-[11px] tracking-[0.16em] text-earth-ivory/60">
            {count ? `${count} PUBLISHED NOTES` : "LONG-FORM REPORTING"}
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
              Every note, in the order it was recorded.
            </motion.h1>
          </div>

          <motion.div
            initial={prefersReduced ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, delay: 0.15, ease: EASE }}
            className="lg:col-span-4 lg:pb-2"
          >
            <p className="text-[15px] leading-relaxed text-earth-ivory/80 sm:text-base">
              {standfirst}
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
            <span>FIELD DISPATCHES</span>
            <span className="text-earth-ivory/30">&bull;</span>
            <span>SCIENTIFIC PROVENANCE</span>
            <span className="text-earth-ivory/30">&bull;</span>
            <span>REGIONAL REPORTING</span>
            <span className="text-earth-ivory/30">&bull;</span>
            <span>ECOLOGICAL ANALYSIS</span>
            <span className="text-earth-ivory/30">&bull;</span>
          </div>
        ))}
      </motion.div>
    </div>
    </>
  );
}