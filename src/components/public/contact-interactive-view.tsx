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
import { ArrowUpRight, Mail } from "lucide-react";
import { ContactForm } from "@/components/public/contact-form";
import { SITE_CONFIG } from "@/config/site";

const EASE = [0.22, 1, 0.36, 1] as const;

const HANDLING_NOTES = [
  { label: "What reaches us", body: "Editorial questions, educational inquiries, dataset suggestions, documented regional case studies, and factual corrections." },
  { label: "What we do with it", body: "The form prepares a message in your own email app. Your note goes straight to the editorial desk and is never stored on this website." },
  { label: "Corrections", body: "If a figure on this site is wrong, send the citation. Verified corrections are republished with a note on the affected page." },
] as const;

const ELSEWHERE = [
  { label: "Explore the five domains", href: "/explore" },
  { label: "Read the archive", href: "/stories" },
  { label: "How entries are made", href: "/about#approach" },
] as const;

export function ContactInteractiveView() {
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
            src="/images/hero-planet.jpg"
            alt="Misty green valley representing THE LIVING EARTH correspondence"
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
            CORRESPONDENCE
          </span>
        </div>

        <motion.div
          style={prefersReduced ? undefined : { y: heroTextY, opacity: heroOpacity }}
          className="relative z-20 mx-auto w-full max-w-[1400px] px-4 pt-36 pb-14 sm:px-6 sm:pb-20 lg:px-10"
        >
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-earth-ivory/20 pb-5">
            <span className="font-mono text-[11px] tracking-[0.2em] text-earth-sage uppercase">
              07 / CORRESPONDENCE — EDITORIAL DESK
            </span>
            <a
              href={`mailto:${SITE_CONFIG.contactEmail}`}
              className="font-mono text-[11px] tracking-[0.12em] text-earth-ivory/70 transition-colors hover:text-earth-ivory"
            >
              {SITE_CONFIG.contactEmail}
            </a>
          </div>

          <div className="mt-8 grid gap-8 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-8">
              <motion.h1
                initial={prefersReduced ? false : { opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.85, ease: EASE }}
                className="font-heading text-[2.85rem] leading-[0.95] tracking-[-0.03em] text-earth-ivory sm:text-6xl lg:text-[5.2rem]"
              >
                Write to the{" "}
                <span className="italic text-earth-sage">editorial desk.</span>
              </motion.h1>
            </div>

            <motion.div
              initial={prefersReduced ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.85, delay: 0.15, ease: EASE }}
              className="lg:col-span-4 lg:pb-2"
            >
              <p className="text-[15px] leading-relaxed text-earth-ivory/80 sm:text-base">
                Questions, dataset suggestions, and documented field studies are all welcome. So
                are corrections — especially corrections.
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
          transition={{ duration: 24, repeat: Infinity, ease: "linear" }}
          className="flex w-max items-center gap-10 whitespace-nowrap font-mono text-xs tracking-[0.22em] text-earth-sage/90 uppercase"
        >
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="flex items-center gap-10">
              <span>EDITORIAL QUESTIONS</span>
              <span className="text-earth-ivory/30">&bull;</span>
              <span>DATASET SUGGESTIONS</span>
              <span className="text-earth-ivory/30">&bull;</span>
              <span>FIELD STUDY SUBMISSIONS</span>
              <span className="text-earth-ivory/30">&bull;</span>
              <span>FACTUAL CORRECTIONS</span>
              <span className="text-earth-ivory/30">&bull;</span>
            </div>
          ))}
        </motion.div>
      </div>

      <section className="mx-auto w-full max-w-[1400px] px-4 py-20 sm:px-6 sm:py-28 lg:px-10">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <div className="flex items-center justify-between gap-4">
              <div>
                <span className="font-mono text-[11px] tracking-[0.18em] text-earth-muted uppercase">
                  Section 02 — Send A Message
                </span>
                <h2 className="mt-2 font-heading text-3xl tracking-[-0.02em] text-foreground sm:text-4xl">
                  Fill in the fields below.
                </h2>
              </div>
            </div>
            <p className="mt-4 max-w-[60ch] text-sm text-muted-foreground">
              Your email app will open with the message ready to send. Nothing is submitted to
              this website.
            </p>

            <div className="mt-10">
              <ContactForm />
            </div>
          </div>

          <aside aria-label="Handling and correspondence notes" className="lg:col-span-5">
            <div className="sticky top-28">
              <span className="font-mono text-[11px] tracking-[0.18em] text-earth-muted uppercase">
                Section 03 — Handling Notes
              </span>
              <dl className="mt-6 border-t border-border">
                {HANDLING_NOTES.map((note, index) => (
                  <motion.div
                    key={note.label}
                    initial={prefersReduced ? false : { opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-60px" }}
                    transition={{ duration: 0.55, delay: index * 0.08, ease: EASE }}
                    className="border-b border-border py-6"
                  >
                    <dt className="font-mono text-[10px] tracking-[0.12em] text-earth-muted">
                      {note.label.toUpperCase()}
                    </dt>
                    <dd className="mt-3 max-w-[46ch] text-sm leading-relaxed text-muted-foreground">
                      {note.body}
                    </dd>
                  </motion.div>
                ))}
              </dl>

              <div className="mt-10">
                <p className="font-mono text-[10px] tracking-[0.12em] text-earth-muted">
                  ELSEWHERE ON THE RECORD
                </p>
                <ul className="mt-4 border-t border-border">
                  {ELSEWHERE.map((item) => (
                    <li key={item.href} className="border-b border-border">
                      <Link
                        href={item.href}
                        className="group/row flex items-center justify-between gap-6 py-4 text-sm text-foreground transition-colors duration-200 hover:text-primary"
                      >
                        <span>{item.label}</span>
                        <ArrowUpRight className="size-4 text-muted-foreground transition-transform duration-300 group-hover/row:translate-x-0.5 group-hover/row:-translate-y-0.5 group-hover/row:text-primary" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section className="mx-auto w-full max-w-[1400px] px-4 py-20 sm:px-6 sm:py-24 lg:px-10">
        <div className="relative overflow-hidden rounded-3xl border border-border bg-muted/40 p-8 sm:p-12 lg:p-16">
          <div className="grid items-center gap-8 lg:grid-cols-12">
            <div className="lg:col-span-8">
              <span className="font-mono text-[11px] tracking-[0.18em] text-earth-muted uppercase">
                Section 04 — Open Corrections
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
              <a
                href={`mailto:${SITE_CONFIG.contactEmail}`}
                className="group/btn inline-flex items-center gap-3 rounded-full bg-primary px-7 py-4 text-sm font-medium text-primary-foreground transition-transform duration-300 hover:scale-[1.03]"
              >
                <span>Write directly</span>
                <Mail className="size-4 transition-transform duration-300 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}