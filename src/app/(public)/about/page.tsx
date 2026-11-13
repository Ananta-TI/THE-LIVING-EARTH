import type { Metadata } from "next";
import Image from "next/image";
import { BookOpenCheck, Compass, Handshake, Sprout } from "lucide-react";
import { Breadcrumbs } from "@/components/public/breadcrumbs";
import { CTASection } from "@/components/public/cta-section";
import { MotionReveal } from "@/components/public/motion-reveal";
import { PageHeroBanner } from "@/components/public/page-hero-banner";
import { PillarGrid, type PillarGridItem } from "@/components/public/pillar-grid";
import { SectionHeading } from "@/components/public/section-heading";
import { CONTENT_PILLARS } from "@/lib/constants/pillars";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn about THE LIVING EARTH—our vision, mission, scientific values, editorial approach, and five environmental pillars.",
  alternates: {
    canonical: "/about",
  },
};

const CORE_VALUES = [
  {
    title: "Knowledge",
    description: "Verified facts grounded in peer-reviewed research.",
    icon: BookOpenCheck,
  },
  {
    title: "Action",
    description: "Practical, evidence-led conservation pathways.",
    icon: Sprout,
  },
  {
    title: "Clarity",
    description: "Accessible storytelling without alarmism.",
    icon: Compass,
  },
  {
    title: "Collaboration",
    description: "Shared civic, scientific, and community care.",
    icon: Handshake,
  },
] as const;

const APPROACH_STEPS = [
  {
    step: "01",
    title: "Primary Scientific Documentation",
    body: "Research summaries cite peer-reviewed journals, environmental assessments, and institutional datasets with clear observation dates and measurement units.",
  },
  {
    step: "02",
    title: "Place-Based Field Case Studies",
    body: "Broad global indicators become tangible when grounded in regional watersheds, coral reefs, rainforest corridors, and coastal restoration initiatives.",
  },
  {
    step: "03",
    title: "Balanced Solutions Analysis",
    body: "Instead of simplified silver bullets, we examine ecological trade-offs, implementation timelines, and how systemic policy aligns with daily action.",
  },
] as const;

const ABOUT_PILLARS: readonly PillarGridItem[] = CONTENT_PILLARS.map((p) => ({
  id: p.slug,
  slug: p.slug,
  name: p.title,
  description: p.subtitle,
  cover_image_path: null,
}));

export default function AboutPage() {
  return (
    <>
      <PageHeroBanner
        eyebrow="Who We Are"
        title="About THE LIVING EARTH"
        description="A journey to understand, protect, and restore our planet through documentary storytelling and verified science."
        imageSrc="/images/hero-planet.jpg"
        imageAlt="Misty mountain peaks and evergreen rainforest canopy"
      >
        <Breadcrumbs tone="dark" items={[{ label: "Home", href: "/" }, { label: "About" }]} />
      </PageHeroBanner>

      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
        {/* Asymmetric Vision & Mission + Landscape Photo */}
        <section aria-labelledby="vision-mission-heading" className="grid gap-10 lg:grid-cols-12 lg:items-center">
          <MotionReveal className="space-y-8 lg:col-span-6">
            <h2 id="vision-mission-heading" className="sr-only">
              Our Vision and Mission
            </h2>

            <div className="space-y-2.5">
              <h3 className="font-heading text-3xl font-medium text-foreground">Our Vision</h3>
              <p className="text-base leading-relaxed text-muted-foreground">
                A publicly literate world where nature and humanity thrive together—guided by calm,
                accurate understanding of how climate, water, forests, and human systems depend on
                one another.
              </p>
            </div>

            <div className="space-y-2.5 border-t border-border pt-6">
              <h3 className="font-heading text-3xl font-medium text-foreground">Our Mission</h3>
              <p className="text-base leading-relaxed text-muted-foreground">
                To deliver accessible environmental journalism, transparent scientific indicators
                with named provenance, and regional conservation case studies that inspire
                informed ecological stewardship.
              </p>
            </div>

            {/* 4 Circular Icon Value Medallions */}
            <div className="grid grid-cols-2 gap-4 pt-2 sm:grid-cols-4">
              {CORE_VALUES.map((val) => {
                const Icon = val.icon;
                return (
                  <div
                    key={val.title}
                    className="group flex flex-col items-center rounded-xl border border-border bg-card p-4 text-center transition-[transform,border-color,box-shadow] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-xs motion-reduce:transform-none"
                  >
                    <span className="flex size-11 items-center justify-center rounded-lg bg-secondary text-primary transition-transform duration-300 group-hover:scale-105 group-hover:-rotate-6 motion-reduce:transform-none">
                      <Icon className="size-5" aria-hidden="true" />
                    </span>
                    <p className="mt-2.5 font-heading text-base font-medium text-foreground">
                      {val.title}
                    </p>
                    <p className="mt-1 text-[11px] leading-snug text-muted-foreground">
                      {val.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </MotionReveal>

          <MotionReveal delay={0.08} className="lg:col-span-6">
            <figure className="overflow-hidden rounded-xl border border-border bg-card shadow-xs">
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
                <Image
                  src="/images/about-earth.jpg"
                  alt="Aerial view of coastal river delta channels flowing through mangroves to the sea"
                  fill
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="object-cover transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:scale-[1.03] motion-reduce:transform-none"
                />
              </div>
              <figcaption className="border-t border-border bg-card px-5 py-3.5 text-xs leading-relaxed text-muted-foreground">
                Coastal deltas connect terrestrial watersheds, mangrove biodiversity, and marine
                currents into a single living system.
              </figcaption>
            </figure>
          </MotionReveal>
        </section>

        {/* Atmospheric Misty Banner — Why Environmental Awareness Matters & Approach */}
        <section
          id="approach"
          aria-labelledby="awareness-heading"
          className="relative isolate mt-16 overflow-hidden rounded-xl border border-border bg-earth-deep-forest px-6 py-12 text-earth-ivory sm:px-10 sm:py-14 scroll-mt-24"
        >
          <Image
            src="/images/hero-planet.jpg"
            alt=""
            aria-hidden="true"
            fill
            sizes="(min-width: 1280px) 1200px, 100vw"
            className="object-cover object-center opacity-25"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/65 to-black/80"
          />

          <div className="relative">
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-xs font-medium text-earth-sage">
                Methodology &amp; Purpose
              </p>
              <h2
                id="awareness-heading"
                className="mt-2 font-heading text-3xl font-medium tracking-tight text-earth-ivory sm:text-4xl"
              >
                Why Environmental Awareness Matters
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-earth-ivory/82 sm:text-base">
                Every topic on THE LIVING EARTH follows a three-layer editorial approach connecting
                scientific measurements with place-based reporting and balanced restoration options.
              </p>
            </div>

            <div className="mt-10 grid gap-5 lg:grid-cols-3">
              {APPROACH_STEPS.map((item) => (
                <div
                  key={item.step}
                  className="rounded-xl border border-white/15 bg-black/30 p-6 transition-[transform,border-color,background-color] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 hover:border-earth-sage/55 hover:bg-black/40 motion-reduce:transform-none"
                >
                  <span className="font-heading text-2xl font-medium text-earth-soft-sage">
                    {item.step}
                  </span>
                  <h3 className="mt-2.5 font-heading text-xl font-medium text-earth-ivory">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-earth-ivory/80">{item.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Five Circular Pillar Medallions */}
        <section aria-labelledby="about-pillars-heading" className="mt-16">
          <SectionHeading
            headingId="about-pillars-heading"
            title="Our Five Pillars"
            description="Select any domain to inspect scientific context, stories, case studies, and citations."
            align="center"
          />

          <div className="mt-8">
            <PillarGrid pillars={ABOUT_PILLARS} variant="circular" />
          </div>
        </section>

        <div className="mt-16">
          <CTASection
            title="Together for a Greener Tomorrow."
            description="Navigate Earth's five living systems or reach out with questions and verified source contributions."
            primaryLabel="Explore Our Planet"
            primaryHref="/our-planet"
            secondaryLabel="Contact Us"
            secondaryHref="/contact"
          />
        </div>
      </div>
    </>
  );
}
