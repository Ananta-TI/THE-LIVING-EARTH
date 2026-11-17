"use client";

import { useRef, type ReactNode } from "react";
import Image from "next/image";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { cn } from "@/lib/utils";

interface PageHeroBannerProps {
  readonly title: string;
  readonly description: string;
  readonly eyebrow?: string;
  readonly imageSrc?: string;
  readonly imageAlt?: string;
  readonly align?: "left" | "center";
  readonly compact?: boolean;
  readonly children?: ReactNode;
}

export function PageHeroBanner({
  title,
  description,
  eyebrow,
  imageSrc = "/images/hero-planet.jpg",
  imageAlt = "Atmospheric misty mountain forest landscape representing THE LIVING EARTH",
  align = "left",
  compact = false,
  children,
}: PageHeroBannerProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const prefersReduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "14%"]);
  const bgScale = useTransform(scrollYProgress, [0, 1], [1, 1.05]);

  return (
    <section
      ref={sectionRef}
      aria-labelledby="page-hero-title"
      className="relative isolate overflow-hidden border-b border-border bg-earth-deep-forest text-earth-ivory"
    >
      <motion.div
        aria-hidden="true"
        style={prefersReduced ? undefined : { y: bgY, scale: bgScale }}
        className="absolute inset-0 will-change-transform"
      >
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
      </motion.div>

      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-black/10"
      />

      <div
        className={cn(
          "relative mx-auto flex max-w-7xl flex-col justify-center px-4 sm:px-6 lg:px-8",
          compact
            ? "min-h-[19rem] pt-28 pb-12 sm:min-h-[22rem] sm:pt-32 sm:pb-16"
            : "min-h-[22rem] pt-32 pb-16 sm:min-h-[25rem] sm:pt-36 sm:pb-20",
          align === "center" ? "items-center text-center" : "items-start text-left",
        )}
      >
        <motion.div
          initial={prefersReduced ? false : { opacity: 0.92, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className={cn("space-y-4", align === "center" ? "max-w-2xl" : "max-w-3xl")}
        >
          {eyebrow ? <p className="text-sm text-earth-ivory/75">{eyebrow}</p> : null}

          <h1
            id="page-hero-title"
            className="font-heading text-3xl leading-[1.12] font-medium tracking-tight text-earth-ivory sm:text-5xl"
          >
            {title}
          </h1>

          <p className="text-base leading-relaxed text-earth-ivory/88 sm:text-lg">
            {description}
          </p>

          {children ? <div className="pt-2">{children}</div> : null}
        </motion.div>
      </div>
    </section>
  );
}
