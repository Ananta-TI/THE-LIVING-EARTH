import { Suspense } from "react";
import type { Metadata } from "next";
import { AnimatedContent } from "@/components/public/animated-content";
import { ClosingBand } from "@/components/public/closing-band";
import { FeatureNote } from "@/components/public/feature-note";
import { FieldDataPanel } from "@/components/public/field-data-panel";
import { FieldNoteGrid } from "@/components/public/field-note-grid";
import { HomeHero, type HeroSlide } from "@/components/public/home-hero";
import { LoadingState } from "@/components/public/loading-state";
import { SectionHeading } from "@/components/public/section-heading";
import { getHomePageData } from "@/features/public/queries";
import { CONTENT_PILLARS } from "@/lib/constants/pillars";
import { getHomeFieldNotes } from "@/lib/utils/field-notes";
import { resolveEditorialImageUrl } from "@/lib/utils/media-url";

export const metadata: Metadata = {
  title: "Home",
  description:
    "Our planet is changing. Explore verified environmental insights, five planetary pillars, field stories, and pathways for ecological restoration.",
  alternates: {
    canonical: "/",
  },
};

const SLIDE_TOPICS: Readonly<Record<string, string>> = {
  "climate-atmosphere": "Rising temperatures",
  "oceans-water": "Warming seas",
  "forests-biodiversity": "Canopy loss",
  "pollution-human-impact": "Air and water quality",
  "solutions-restoration": "Restoration at scale",
};

function fallbackSlides(): readonly HeroSlide[] {
  return CONTENT_PILLARS.slice(0, 5).map((pillar) => ({
    slug: pillar.slug,
    name: pillar.title,
    imageSrc: resolveEditorialImageUrl(null, { pillarSlug: pillar.slug }),
    topic: SLIDE_TOPICS[pillar.slug] ?? null,
  }));
}

async function HomeDynamicSections() {
  const result = await getHomePageData();
  const pillars = result.status === "ok" ? result.data.pillars : [];
  const featuredStories = result.status === "ok" ? result.data.featuredStories : [];
  const keyStatistics = result.status === "ok" ? result.data.keyStatistics : [];
  const lead = featuredStories[0] ?? null;
  const notes = getHomeFieldNotes(6);

  const slides: readonly HeroSlide[] =
    pillars.length > 0
      ? pillars.slice(0, 5).map((pillar) => ({
          slug: pillar.slug,
          name: pillar.name,
          imageSrc: resolveEditorialImageUrl(pillar.cover_image_path, { pillarSlug: pillar.slug }),
          topic: SLIDE_TOPICS[pillar.slug] ?? null,
        }))
      : fallbackSlides();

  return (
    <>
      <HomeHero slides={slides} />

      {lead ? (
        <section aria-labelledby="home-lead-note-heading" className="mx-auto w-full max-w-[1400px] px-4 pt-16 sm:px-6 sm:pt-24 lg:px-10">
          <h2 id="home-lead-note-heading" className="sr-only">
            Lead field note
          </h2>
          <AnimatedContent distance={30} duration={0.8} threshold={0.05} blur={4}>
            <FeatureNote article={lead} sequence="01" />
          </AnimatedContent>
        </section>
      ) : null}

      <section
        aria-labelledby="home-notes-heading"
        className="mx-auto w-full max-w-[1400px] px-4 pt-20 sm:px-6 sm:pt-28 lg:px-10"
      >
        <SectionHeading
          headingId="home-notes-heading"
          title="From the field"
          description="Dispatches and case studies, listed in the order they were recorded."
        />
        <div className="mt-10">
          <AnimatedContent
            distance={22}
            duration={0.7}
            threshold={0.05}
            stagger={0.05}
            trigger="scroll"
          >
            <FieldNoteGrid notes={notes} startIndex={lead ? 1 : 0} />
          </AnimatedContent>
        </div>
      </section>

      <div className="mt-20 sm:mt-28">
        <FieldDataPanel statistics={keyStatistics} />
      </div>

      <ClosingBand pillars={pillars.map((pillar) => ({ name: pillar.name, slug: pillar.slug }))} />
    </>
  );
}

export default function HomePage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto w-full max-w-[1400px] px-4 py-24 sm:px-6 lg:px-10">
          <LoadingState label="Loading pillars, field notes, and measurements..." />
        </div>
      }
    >
      <HomeDynamicSections />
    </Suspense>
  );
}
