"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeroSectionProps {
  readonly headline?: string;
  readonly description?: string;
}

export function HeroSection({
  headline = "Our planet is changing. Understanding it is where change begins",
  description = "Field stories, case studies and verified science across five connected systems: climate, oceans, forests, pollution and restoration.",
}: HeroSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const prefersReduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "12%"]);
  const bgScale = useTransform(scrollYProgress, [0, 1], [1, 1.06]);

  return (
    <section
      ref={sectionRef}
      aria-labelledby="hero-headline"
      className="relative isolate overflow-hidden border-b border-border bg-earth-deep-forest text-earth-ivory"
    >
      <motion.div
        aria-hidden="true"
        style={prefersReduced ? undefined : { y: bgY, scale: bgScale }}
        className="absolute inset-0 will-change-transform"
      >
        <Image
          src="/images/hero-planet.jpg"
          alt="Misty evergreen ridges and a winding river valley at dawn"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
      </motion.div>

      {/* Neutral scrim so the headline sits on calm, darkened valley */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/35 to-transparent"
      />

      <div className="relative mx-auto flex min-h-[32rem] max-w-7xl flex-col justify-center px-4 py-20 sm:min-h-[36rem] sm:px-6 lg:min-h-[42rem] lg:px-8">
        <motion.div
          initial={prefersReduced ? false : { opacity: 0.92, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-2xl space-y-6"
        >
          <h1
            id="hero-headline"
            className="font-heading text-4xl leading-[1.08] font-normal tracking-tight text-earth-ivory sm:text-5xl lg:text-6xl"
          >
            {headline}
          </h1>

          <p className="max-w-xl text-base leading-relaxed text-earth-ivory/85 sm:text-lg">
            {description}
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Button
              asChild
              size="lg"
              className="group/btn h-11 rounded-lg bg-earth-ivory px-5 text-earth-deep-forest transition-[background-color,transform] duration-200 hover:bg-white active:scale-[0.98]"
            >
              <Link href="/our-planet" className="gap-2">
                <span>Explore our planet</span>
                <ArrowRight
                  className="size-4 transition-transform duration-200 group-hover/btn:translate-x-1 motion-reduce:transform-none"
                  aria-hidden="true"
                />
              </Link>
            </Button>

            <Button
              asChild
              variant="ghost"
              size="lg"
              className="h-11 rounded-lg px-4 text-earth-ivory transition-[background-color,color,transform] duration-200 hover:bg-white/12 hover:text-earth-ivory active:scale-[0.98]"
            >
              <Link href="/stories">Read the stories</Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
