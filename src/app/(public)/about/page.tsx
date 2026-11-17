import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { EditorialPageHero } from "@/components/public/editorial-page-hero";
import { EditorialSection } from "@/components/public/editorial-section";
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
  },
  {
    title: "Action",
    description: "Practical, evidence-led conservation pathways.",
  },
  {
    title: "Clarity",
    description: "Accessible storytelling without alarmism.",
  },
  {
    title: "Collaboration",
    description: "Shared civic, scientific, and community care.",
  },
] as const;

const APPROACH_STEPS = [
  {
    step: "01",
    title: "Primary scientific documentation",
    body: "Research summaries cite peer-reviewed journals, environmental assessments, and institutional datasets with clear observation dates and measurement units.",
  },
  {
    step: "02",
    title: "Place-based field case studies",
    body: "Broad global indicators become tangible when grounded in regional watersheds, coral reefs, rainforest corridors, and coastal restoration initiatives.",
  },
  {
    step: "03",
    title: "Balanced solutions analysis",
    body: "Instead of simplified silver bullets, we examine ecological trade-offs, implementation timelines, and how systemic policy aligns with daily action.",
  },
] as const;

export default function AboutPage() {
  return (
    <>
      <EditorialPageHero
        index="Section 01"
        context="Who we are"
        title="An environmental record, kept in public"
        standfirst="THE LIVING EARTH documents how the planet is changing and what is being done about it. Every number we publish carries a source; every place we describe has been reported."
        imageSrc="/images/hero-planet.jpg"
        imageAlt="Misty mountain peaks and evergreen rainforest canopy"
      />

      <div className="mx-auto w-full max-w-[1400px] px-4 py-16 sm:px-6 sm:py-20 lg:px-10">
        {/* Vision & mission, set as a two-column editorial spread. */}
        <EditorialSection
          headingId="about-vision-heading"
          index="Section 02"
          title="Vision and mission"
        >
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
            <div className="space-y-12 lg:col-span-7">
              <div>
                <h3 className="font-mono text-[10px] tracking-[0.12em] text-earth-muted">
                  VISION
                </h3>
                <p className="mt-4 font-heading text-xl leading-snug text-foreground sm:text-2xl">
                  A publicly literate world where nature and humanity thrive together — guided by
                  calm, accurate understanding of how climate, water, forests, and human systems
                  depend on one another.
                </p>
              </div>

              <div className="border-t border-border pt-10">
                <h3 className="font-mono text-[10px] tracking-[0.12em] text-earth-muted">
                  MISSION
                </h3>
                <p className="mt-4 max-w-[64ch] text-[15px] leading-relaxed text-muted-foreground">
                  To deliver accessible environmental journalism, transparent scientific indicators
                  with named provenance, and regional conservation case studies that inspire
                  informed ecological stewardship.
                </p>
              </div>

              <div className="border-t border-border pt-10">
                <h3 className="font-mono text-[10px] tracking-[0.12em] text-earth-muted">
                  WORKING PRINCIPLES
                </h3>
                <dl className="mt-4 border-t border-border">
                  {CORE_VALUES.map((value) => (
                    <div
                      key={value.title}
                      className="flex flex-col gap-1 border-b border-border py-3.5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-8"
                    >
                      <dt className="font-heading text-lg text-foreground">{value.title}</dt>
                      <dd className="text-sm text-muted-foreground sm:text-right">
                        {value.description}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>

            <figure className="lg:col-span-5">
              <div className="relative aspect-4/3 w-full overflow-hidden bg-secondary lg:aspect-3/4">
                <Image
                  src="/images/about-earth.jpg"
                  alt="Aerial view of coastal river delta channels flowing through mangroves to the sea"
                  fill
                  sizes="(min-width: 1024px) 40vw, 100vw"
                  className="object-cover"
                />
              </div>
              <figcaption className="mt-4 border-t border-border pt-3 font-mono text-[10px] leading-relaxed tracking-[0.1em] text-earth-muted">
                COASTAL DELTAS CONNECT TERRESTRIAL WATERSHEDS, MANGROVE BIODIVERSITY, AND MARINE
                CURRENTS INTO A SINGLE LIVING SYSTEM.
              </figcaption>
            </figure>
          </div>
        </EditorialSection>

        {/* Editorial method, framed as a numbered record rather than three cards. */}
        <EditorialSection
          id="approach"
          className="mt-20 scroll-mt-28 sm:mt-28"
          headingId="about-approach-heading"
          index="Section 03"
          title="How each entry is made"
          lede="Every topic on THE LIVING EARTH follows a three-layer editorial approach connecting scientific measurements with place-based reporting and balanced restoration options."
        >
          <ol className="border-t border-border">
            {APPROACH_STEPS.map((item) => (
              <li
                key={item.step}
                className="grid gap-4 border-b border-border py-8 lg:grid-cols-12 lg:gap-10"
              >
                <p className="font-mono text-[11px] text-earth-muted tabular-nums lg:col-span-2">
                  {item.step}
                </p>
                <h3 className="font-heading text-xl leading-snug text-foreground lg:col-span-4 sm:text-2xl">
                  {item.title}
                </h3>
                <p className="max-w-[62ch] text-[15px] leading-relaxed text-muted-foreground lg:col-span-6">
                  {item.body}
                </p>
              </li>
            ))}
          </ol>
        </EditorialSection>

        {/* The five domains, as a compact index rather than medallion cards. */}
        <EditorialSection
          className="mt-20 scroll-mt-28 sm:mt-28"
          headingId="about-domains-heading"
          index="Section 04"
          title="The five domains we cover"
          lede="Each domain holds its own topics, published notes, field studies, and measurements."
          aside={
            <Link
              href="/explore"
              className="group/x inline-flex items-center gap-2 border-b border-foreground/25 pb-1 text-sm font-medium text-foreground transition-colors duration-200 hover:border-primary hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
            >
              <span>Open the domain ledger</span>
              <span
                aria-hidden="true"
                className="transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/x:translate-x-1 motion-reduce:transform-none"
              >
                &rarr;
              </span>
            </Link>
          }
        >
          <ol className="border-t border-border">
            {CONTENT_PILLARS.map((pillar) => (
              <li key={pillar.slug} className="border-b border-border">
                <Link
                  href={pillar.href}
                  className="group/row grid items-baseline gap-x-8 gap-y-2 py-5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring lg:grid-cols-12"
                >
                  <span className="font-mono text-[11px] text-earth-muted tabular-nums lg:col-span-1">
                    {pillar.code}
                  </span>
                  <span className="font-heading text-xl text-foreground transition-colors duration-200 group-hover/row:text-primary lg:col-span-4">
                    {pillar.title}
                  </span>
                  <span className="text-sm leading-relaxed text-muted-foreground lg:col-span-6">
                    {pillar.subtitle}
                  </span>
                  <span
                    aria-hidden="true"
                    className="hidden text-muted-foreground transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/row:translate-x-1 group-hover/row:text-primary motion-reduce:transform-none lg:col-span-1 lg:block lg:text-right"
                  >
                    &rarr;
                  </span>
                </Link>
              </li>
            ))}
          </ol>
        </EditorialSection>

        <EditorialSection
          className="mt-20 scroll-mt-28 sm:mt-28"
          headingId="about-contact-heading"
          index="Section 05"
          title="Corrections and contributions"
          lede="If a figure on this site is wrong, we want to hear it first. Send the citation and we will review, correct, and republish with a note."
          aside={
            <Link
              href="/contact"
              className="group/x inline-flex items-center gap-2 border-b border-foreground/25 pb-1 text-sm font-medium text-foreground transition-colors duration-200 hover:border-primary hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
            >
              <span>Reach the editorial desk</span>
              <span
                aria-hidden="true"
                className="transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/x:translate-x-1 motion-reduce:transform-none"
              >
                &rarr;
              </span>
            </Link>
          }
        >
          <p className="max-w-[70ch] text-[15px] leading-relaxed text-muted-foreground">
            We publish the source behind every measurement, including its geographic scope,
            observation year, and stated limitations. Where the science is uncertain, we say so
            rather than smoothing it over.
          </p>
        </EditorialSection>
      </div>
    </>
  );
}
