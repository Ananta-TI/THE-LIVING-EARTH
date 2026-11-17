import type { Metadata } from "next";
import { Suspense } from "react";
import { LoadingState } from "@/components/public/loading-state";
import { OurPlanetInteractiveView } from "@/components/public/our-planet-interactive-view";
import { getOurPlanetData } from "@/features/public/queries";

export const metadata: Metadata = {
  title: "Our Planet",
  description:
    "Examine global environmental case studies like Mangrove Restoration in Coastal Indonesia alongside major planetary pressures, verified statistics, and scientific sources.",
  alternates: {
    canonical: "/our-planet",
  },
};

async function OurPlanetContent() {
  const result = await getOurPlanetData();

  if (result.status === "unconfigured") {
    return (
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <p className="text-muted-foreground">Content unavailable.</p>
      </div>
    );
  }

  if (result.status === "error") {
    return (
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <p className="text-muted-foreground">{result.message}</p>
      </div>
    );
  }

  const { caseStudies, statistics, references } = result.data;

  return (
    <OurPlanetInteractiveView
      caseStudies={caseStudies.map((cs) => ({
        id: cs.id,
        title: cs.title,
        slug: cs.slug,
        summary: cs.summary,
        country: cs.country,
        region: cs.region,
        latitude: cs.latitude,
        longitude: cs.longitude,
        cover_image_path: cs.cover_image_path,
        pillarName: cs.pillarName,
        pillarSlug: cs.pillarSlug,
        start_date: cs.start_date,
        end_date: cs.end_date,
      }))}
      statistics={statistics.map((s) => ({
        id: s.id,
        indicator: s.indicator,
        value: s.value,
        unit: s.unit,
        geographic_scope: s.geographic_scope,
        measurement_year: s.measurement_year,
        methodology: s.methodology,
        reference: s.reference ? { organization: s.reference.organization, title: s.reference.title } : null,
        publication_date: s.publication_date,
      }))}
      references={references.map((r) => ({
        id: r.id,
        title: r.title,
        organization: r.organization,
        source_type: r.source_type,
        source_url: r.source_url,
        publication_date: r.publication_date,
        author: r.author,
      }))}
    />
  );
}

export default function OurPlanetPage() {
  return (
    <Suspense fallback={<LoadingState label="Loading planetary data..." />}>
      <OurPlanetContent />
    </Suspense>
  );
}