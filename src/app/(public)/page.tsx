import { Suspense } from "react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Recycle, ShieldCheck, Sprout, Sun } from "lucide-react";
import { ArticleCard } from "@/components/public/article-card";
import { CTASection } from "@/components/public/cta-section";
import { EmptyState } from "@/components/public/empty-state";
import { HeroSection } from "@/components/public/hero-section";
import { LoadingState } from "@/components/public/loading-state";
import { MotionReveal } from "@/components/public/motion-reveal";
import { PillarGrid, type PillarGridItem } from "@/components/public/pillar-grid";
import { SectionHeading } from "@/components/public/section-heading";
import { getHomePageData } from "@/features/public/queries";
import { CONTENT_PILLARS } from "@/lib/constants/pillars";
import { formatNumber } from "@/lib/utils/format";

export const metadata: Metadata = {
  title: "Home",
  description:
    "Our planet is changing. Explore verified environmental insights, five planetary pillars, field stories, and pathways for ecological restoration.",
  alternates: {
    canonical: "/",
  },
};

const FALLBACK_PILLAR_CARDS: readonly PillarGridItem[] = CONTENT_PILLARS.map((p) => ({
  id: p.slug,
  slug: p.slug,
  name: p.title,
  description: p.subtitle,
  cover_image_path: null,
}));

const SOLUTIONS_CARDS = [
  {
    title: "Renewable Energy",
    description: "Transitioning grids toward solar, wind, and storage infrastructure.",
    imageSrc: "/images/solar-wind.jpg",
    icon: Sun,
  },
  {
    title: "Forest Conservation",
    description: "Safeguarding primary tropical and boreal canopies and wildlife corridors.",
    imageSrc: "/images/pillar-forests.jpg",
    icon: ShieldCheck,
  },
  {
    title: "Ecosystem Restoration",
    description: "Rebuilding wetlands, mangrove shorelines, and watershed soil health.",
    imageSrc: "/images/mangrove-coastal.jpg",
    icon: Sprout,
  },
  {
    title: "Circular Systems",
    description: "Cutting upstream waste through repair, reuse, and material recovery.",
    imageSrc: "/images/pillar-solutions.jpg",
    icon: Recycle,
  },
] as const;

async function HomeDynamicSections() {
  const result = await getHomePageData();
  const pillars: readonly PillarGridItem[] =
    result.status === "ok" && result.data.pillars.length > 0
      ? result.data.pillars
      : FALLBACK_PILLAR_CARDS;
  const featuredStories = result.status === "ok" ? result.data.featuredStories : [];
  const keyStatistics = result.status === "ok" ? result.data.keyStatistics : [];

  return (
    <>
      {/* 2. Explore Our Planet — 5-Column Portrait Pillars */}
      <section aria-labelledby="home-pillars-heading" className="py-14 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            headingId="home-pillars-heading"
            title="Explore Our Planet"
            description="Five interconnected environmental domains documenting Earth's changing biosphere."
            actionLabel="View all"
            actionHref="/explore"
          />

          <div className="mt-8">
            <PillarGrid pillars={pillars} variant="portrait" />
          </div>
        </div>
      </section>

      {/* 3. Featured Stories */}
      <section
        aria-labelledby="home-stories-heading"
        className="border-t border-border/70 bg-card/65 py-14 sm:py-16"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            headingId="home-stories-heading"
            title="Featured Stories"
            description="Long-form ecological reporting and explanatory essays grounded in scientific evidence."
            actionLabel="View all"
            actionHref="/stories"
          />

          <div className="mt-8">
            {featuredStories.length > 0 ? (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {featuredStories.slice(0, 3).map((story) => (
                  <ArticleCard key={story.id} article={story} />
                ))}
              </div>
            ) : (
              <EmptyState
                title="Editorial dispatches coming soon"
                description="Published articles from our editorial workspace will appear here automatically. Explore our five environmental pillars or examine global challenges on Our Planet."
                actionLabel="Explore Our Planet"
                actionHref="/our-planet"
                secondaryLabel="Browse Pillars"
                secondaryHref="/explore"
              />
            )}
          </div>
        </div>
      </section>

      {/* 4. Dark Forest + Green Sprout Banner — Environmental Insights (Screen 1) */}
      <section
        aria-labelledby="home-insights-heading"
        className="relative isolate overflow-hidden border-y border-border bg-[#13281f] py-14 text-earth-ivory sm:py-16"
      >
        <Image
          src="/images/pillar-solutions.jpg"
          alt="Young green sprout emerging from fertile dark soil"
          fill
          sizes="100vw"
          className="object-cover object-right opacity-55"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/60 to-black/10"
        />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-10 lg:grid-cols-12">
            <div className="space-y-6 lg:col-span-8">
              <div className="space-y-2">
                <h2
                  id="home-insights-heading"
                  className="font-heading text-3xl font-medium tracking-tight text-earth-ivory sm:text-4xl"
                >
                  Environmental Insights
                </h2>
                <p className="max-w-xl text-sm leading-relaxed text-earth-ivory/80">
                  Key planetary indicators verified against primary scientific assessments.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                {keyStatistics.slice(0, 3).map((stat, idx) => {
                  const isPercent = stat.unit === "%";
                  const formattedValue = isPercent
                    ? `~${formatNumber(stat.value)}%`
                    : `${formatNumber(stat.value)}${stat.unit}`;

                  return (
                    <MotionReveal key={stat.id} delay={idx * 0.06}>
                      <div className="border-t border-earth-sage/40 pt-4 transition-colors duration-300 hover:border-earth-soft-sage">
                        <p className="font-heading text-4xl font-medium tracking-tight text-earth-ivory tabular-nums sm:text-5xl">
                          {formattedValue}
                        </p>
                        <p className="mt-2 text-sm font-medium text-earth-ivory/95">
                          {stat.indicator}
                        </p>
                        <p className="mt-1 text-xs text-earth-soft-sage/85">
                          {stat.reference?.organization ?? "Verified Source"} · {stat.measurement_year}
                        </p>
                      </div>
                    </MotionReveal>
                  );
                })}
              </div>

              <div>
                <Link
                  href="/our-planet#sources"
                  className="group inline-flex items-center gap-1.5 text-xs font-medium text-earth-soft-sage transition-colors hover:text-earth-ivory focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-earth-sage"
                >
                  <span>Inspect Data &amp; Scientific Sources</span>
                  <ArrowRight
                    className="size-3.5 transition-transform duration-200 group-hover:translate-x-1 motion-reduce:transform-none"
                    aria-hidden="true"
                  />
                </Link>
              </div>
            </div>
</div>
        </div>
      </section>
    </>
  );
}

export default function HomePage() {
  return (
    <>
      {/* 1. Atmospheric Hero */}
      <HeroSection />

      {/* 2-4. Explore Our Planet (5-Col), Featured Stories, Dark Forest Environmental Insights */}
      <Suspense
        fallback={
          <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
            <LoadingState label="Loading pillars, featured stories, and environmental insights..." />
          </div>
        }
      >
        <HomeDynamicSections />
      </Suspense>

      {/* 5. Solutions & Restoration 4-Card Row */}
      <section aria-labelledby="home-solutions-heading" className="py-14 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            headingId="home-solutions-heading"
            title="Solutions & Restoration"
            description="Practical ecological stewardship combining clean infrastructure, primary habitat protection, and material circularity."
            actionLabel="View all"
            actionHref="/solutions"
          />

          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {SOLUTIONS_CARDS.map((card, idx) => {
              const Icon = card.icon;
              return (
                <MotionReveal key={card.title} delay={idx * 0.06}>
                  <Link
                    href="/solutions"
                    className="group flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card shadow-2xs transition-[transform,border-color,box-shadow] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 hover:border-primary/45 hover:shadow-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring motion-reduce:transform-none"
                  >
                    <div className="relative aspect-[16/10] w-full overflow-hidden bg-muted">
                      <Image
                        src={card.imageSrc}
                        alt={card.title}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        className="object-cover transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04] motion-reduce:transform-none"
                      />
                    </div>
                    <div className="flex flex-1 flex-col justify-between p-5">
                      <div>
                        <div className="flex items-center gap-2.5">
                          <span className="inline-flex size-8 items-center justify-center rounded-lg bg-secondary text-primary transition-transform duration-300 group-hover:scale-105 group-hover:-rotate-6 motion-reduce:transform-none">
                            <Icon className="size-4" aria-hidden="true" />
                          </span>
                          <h3 className="font-heading text-lg font-medium text-foreground transition-colors group-hover:text-primary">
                            {card.title}
                          </h3>
                        </div>
                        <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                          {card.description}
                        </p>
                      </div>
                      <span className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-primary">
                        <span>Explore pathway</span>
                        <ArrowRight
                          className="size-3.5 transition-transform duration-200 group-hover:translate-x-1 motion-reduce:transform-none"
                          aria-hidden="true"
                        />
                      </span>
                    </div>
                  </Link>
                </MotionReveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* 6. Full-Width Forest CTA Banner */}
      <section aria-label="Continue exploring" className="pb-16 sm:pb-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <CTASection
            title="Together, we can build a healthier, more sustainable planet."
            description="Explore our scientific pillars, examine global ecological pressures, or get in touch with the editorial desk."
            primaryLabel="Explore Solutions"
            primaryHref="/solutions"
            secondaryLabel="About Our Mission"
            secondaryHref="/about"
          />
        </div>
      </section>
    </>
  );
}
