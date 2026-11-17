"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import { cn } from "@/lib/utils";

const EASE = [0.22, 1, 0.36, 1] as const;
const SLIDE_INTERVAL_MS = 6200;

export interface HeroSlide {
  readonly slug: string;
  readonly name: string;
  readonly imageSrc: string;
  readonly topic: string | null;
}

interface HomeHeroProps {
  readonly slides: readonly HeroSlide[];
}

/**
 * Field-station hero: the five planetary domains as a pushed filmstrip.
 * Vertical wipes advance on a timer, on domain selection, and on arrow keys.
 * The current domain name is the headline, so the strip *is* the navigation.
 */
export function HomeHero({ slides }: HomeHeroProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const prefersReduced = useReducedMotion() ?? false;

  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(true);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 });
  const bodyY = useTransform(progress, [0, 1], [0, 44]);
  const bodyOpacity = useTransform(progress, [0, 0.85], [1, 0]);
  const spineScale = useTransform(progress, [0, 1], [1, 0.86]);

  const advance = useCallback(
    (delta: number) => {
      setIndex((current) => (current + delta + slides.length) % slides.length);
    },
    [slides.length],
  );

  useEffect(() => {
    if (prefersReduced || !playing || slides.length < 2) return;
    const timer = window.setInterval(() => advance(1), SLIDE_INTERVAL_MS);
    return () => window.clearInterval(timer);
  }, [advance, playing, prefersReduced, slides.length]);

  useEffect(() => {
    if (prefersReduced) return;

    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "ArrowDown" || event.key === "ArrowRight") {
        setPlaying(false);
        advance(1);
      } else if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
        setPlaying(false);
        advance(-1);
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [advance, prefersReduced]);

  return (
    <section
      ref={sectionRef}
      aria-labelledby="hero-headline"
      className="relative isolate overflow-hidden bg-earth-deep-forest text-earth-ivory"
    >
      {/* Filmstrip: frames cross-fade with a clip-path wipe. Inactive frames stay
          fully painted and are only revealed by the wipe, so no empty plate is
          ever visible mid-transition. */}
      <div aria-hidden="true" className="absolute inset-0">
        {slides.map((slide, slideIndex) => {
          const isActive = slideIndex === index;

          return (
            <motion.div
              key={slide.slug}
              className="absolute inset-0 will-change-[clip-path,transform]"
              initial={false}
              animate={
                isActive
                  ? { clipPath: "inset(0% 0% 0% 0%)", scale: 1.02 }
                  : { clipPath: "inset(0% 0% 0% 0%)", scale: 1.02, opacity: 0 }
              }
              transition={{ duration: prefersReduced ? 0 : 1.1, ease: EASE }}
              style={{ zIndex: isActive ? 2 : 1 }}
            >
              <motion.div
                className="absolute inset-0"
                initial={false}
                animate={
                  isActive
                    ? { clipPath: "inset(0% 0% 0% 0%)" }
                    : { clipPath: "inset(100% 0% 0% 0%)" }
                }
                transition={{ duration: prefersReduced ? 0 : 1.1, ease: EASE }}
              >
                <Image
                  src={slide.imageSrc}
                  alt=""
                  fill
                  priority={slideIndex === 0}
                  sizes="100vw"
                  className="object-cover object-center"
                />
              </motion.div>
            </motion.div>
          );
        })}
      </div>

      {/* Legibility: directional scrim plus a soft vertical fade into the band below. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-r from-black/82 via-black/48 to-black/12"
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-earth-deep-forest to-transparent"
      />

      <motion.div
        style={prefersReduced ? undefined : { y: bodyY, opacity: bodyOpacity }}
        className="relative mx-auto flex min-h-[38rem] max-w-[1400px] flex-col justify-end px-4 pt-28 pb-10 sm:min-h-[42rem] sm:px-6 sm:pb-14 lg:min-h-[46rem] lg:px-10 lg:pt-32"
      >
        <div className="grid items-end gap-10 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-7">
            <p className="font-mono text-[11px] tracking-[0.16em] text-earth-sage/90 tabular-nums">
              {String(index + 1).padStart(2, "0")}
              <span className="px-1 text-earth-sage/45">/</span>
              {String(slides.length).padStart(2, "0")}
            </p>

            <div className="relative mt-4 grid">
              {slides.map((slide, slideIndex) => {
                const isActive = slideIndex === index;
                // Only the active frame carries the page's single <h1>; the
                // other frames are plain, aria-hidden text, so the document
                // never exposes five competing top-level headings.
                const headlineClass = cn(
                  "col-start-1 row-start-1 font-heading text-[2.6rem] leading-[0.98] tracking-[-0.02em] text-earth-ivory sm:text-6xl lg:text-[4.6rem]",
                  !isActive && "pointer-events-none",
                );
                const animation = {
                  opacity: isActive ? 1 : 0,
                  y: isActive ? 0 : 18,
                  filter: isActive ? "blur(0px)" : "blur(6px)",
                };
                const transition = { duration: prefersReduced ? 0 : 0.65, ease: EASE };

                if (!isActive) {
                  return (
                    <p
                      key={slide.slug}
                      aria-hidden="true"
                      className={headlineClass}
                      style={{ opacity: 0, pointerEvents: "none" }}
                    >
                      {slide.name}
                    </p>
                  );
                }

                return (
                  <motion.h1
                    id="hero-headline"
                    key={slide.slug}
                    className={headlineClass}
                    initial={false}
                    animate={animation}
                    transition={transition}
                  >
                    {slide.name}
                  </motion.h1>
                );
              })}
            </div>

            <p className="mt-6 max-w-lg text-[15px] leading-relaxed text-earth-ivory/80 sm:text-base">
              Five connected systems — atmosphere, water, forest, human pressure and
              restoration. Evidence drawn from published science and field reporting.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-x-7 gap-y-3">
              <Link
                href="/our-planet"
                className="group/cta inline-flex items-center gap-2 border-b border-earth-ivory/60 pb-1.5 text-sm font-medium text-earth-ivory transition-colors duration-200 hover:border-earth-ivory focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-earth-sage"
              >
                <span>Open the field studies</span>
                <span
                  aria-hidden="true"
                  className="transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/cta:translate-x-1 motion-reduce:transform-none"
                >
                  &rarr;
                </span>
              </Link>

              <Link
                href="/stories"
                className="text-sm text-earth-ivory/70 underline-offset-4 transition-colors duration-200 hover:text-earth-ivory hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-earth-sage"
              >
                Read the reporting
              </Link>
            </div>
          </div>

          {/* Champagne rail: domain selector doubling as a reading instrument. */}
          <div className="lg:col-span-5 lg:pl-4">
            <ul className="flex flex-col">
              {slides.map((slide, slideIndex) => {
                const isActive = slideIndex === index;
                return (
                  <li key={slide.slug} className="border-t border-earth-ivory/15 last:border-b">
                    <Link
                      href={`/explore/${slide.slug}`}
                      onMouseEnter={() => {
                        setPlaying(false);
                        setIndex(slideIndex);
                      }}
                      onFocus={() => {
                        setPlaying(false);
                        setIndex(slideIndex);
                      }}
                      onClick={() => setIndex(slideIndex)}
                      aria-current={isActive ? "true" : undefined}
                      className="group/rail block py-3.5"
                    >
                      <span className="flex items-baseline gap-3">
                        <span
                          className={cn(
                            "font-mono text-[10px] tabular-nums transition-colors duration-300",
                            isActive ? "text-earth-ivory" : "text-earth-ivory/40",
                          )}
                        >
                          {String(slideIndex + 1).padStart(2, "0")}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span
                            className={cn(
                              "block truncate text-[13px] font-medium transition-colors duration-300",
                              isActive
                                ? "text-earth-ivory"
                                : "text-earth-ivory/55 group-hover/rail:text-earth-ivory/85",
                            )}
                          >
                            {slide.topic ?? slide.name}
                          </span>
                          {/* Measured progress hairline for the active domain. */}
                          <span aria-hidden="true" className="mt-2.5 block h-px w-full bg-earth-ivory/15">
                            {isActive ? (
                              <motion.span
                                key={`${slide.slug}-${playing}-${prefersReduced}`}
                                className="block h-px bg-earth-sage"
                                initial={{ scaleX: 0 }}
                                animate={{ scaleX: 1 }}
                                style={{ originX: 0 }}
                                transition={
                                  prefersReduced || !playing
                                    ? { duration: 0 }
                                    : { duration: SLIDE_INTERVAL_MS / 1000, ease: "linear" }
                                }
                              />
                            ) : null}
                          </span>
                        </span>
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>

            <div className="mt-6 flex items-center gap-4">
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => {
                    setPlaying(false);
                    advance(-1);
                  }}
                  aria-label="Previous planetary domain"
                  className="flex size-9 items-center justify-center rounded-full border border-earth-ivory/25 text-earth-ivory/80 transition-colors duration-200 hover:border-earth-ivory/60 hover:text-earth-ivory focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-earth-sage"
                >
                  <span aria-hidden="true">&uarr;</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setPlaying(false);
                    advance(1);
                  }}
                  aria-label="Next planetary domain"
                  className="flex size-9 items-center justify-center rounded-full border border-earth-ivory/25 text-earth-ivory/80 transition-colors duration-200 hover:border-earth-ivory/60 hover:text-earth-ivory focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-earth-sage"
                >
                  <span aria-hidden="true">&darr;</span>
                </button>
              </div>

              <button
                type="button"
                onClick={() => setPlaying((current) => !current)}
                aria-pressed={!playing}
                className="font-mono text-[10px] tracking-[0.14em] text-earth-ivory/60 transition-colors duration-200 hover:text-earth-ivory focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-earth-sage"
              >
                {playing ? "Pause cycle" : "Resume cycle"}
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Measured spine: a hairline that compresses as the hero is scrolled away. */}
      <motion.div
        aria-hidden="true"
        style={prefersReduced ? undefined : { scaleX: spineScale }}
        className="absolute inset-x-0 bottom-0 h-px origin-left bg-earth-ivory/25"
      />
    </section>
  );
}
