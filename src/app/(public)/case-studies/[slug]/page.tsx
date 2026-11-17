import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  CaseStudyFooter,
  CaseStudyOpener,
  CaseStudySources,
  CaseStudySpecLedger,
  type CaseStudySpecRow,
} from "@/components/public/case-study-detail";
import { CaseStudyCard } from "@/components/public/case-study-card";
import { CTASection } from "@/components/public/cta-section";
import { EditorialSection } from "@/components/public/editorial-section";
import { ErrorState } from "@/components/public/error-state";
import { LoadingState } from "@/components/public/loading-state";
import { MarkdownArticle } from "@/components/public/markdown-article";
import { PUBLISHED_CASE_STUDIES } from "@/data";
import { getCaseStudyDetailBySlug } from "@/features/public/queries";
import { formatDateTime } from "@/lib/utils/format";
import { resolveEditorialImageUrl } from "@/lib/utils/media-url";

const SOURCE_TYPE_LABELS: Record<string, string> = {
  scientific_journal: "Scientific journal",
  research_report: "Research report",
  government_data: "Government data",
  international_organization: "International organisation",
  institutional_report: "Institutional report",
  other: "Authoritative source",
};

interface CaseStudyPageProps {
  readonly params: Promise<{ readonly slug: string }>;
}

export function generateStaticParams() {
  return PUBLISHED_CASE_STUDIES.map((caseStudy) => ({ slug: caseStudy.slug }));
}

export async function generateMetadata({ params }: CaseStudyPageProps): Promise<Metadata> {
  const { slug } = await params;
  const result = await getCaseStudyDetailBySlug(slug);

  if (result.status !== "ok" || !result.data) {
    return {
      title: "Environmental Case Study",
      description: "Field documentation and regional environmental findings on THE LIVING EARTH.",
      alternates: {
        canonical: `/case-studies/${slug}`,
      },
    };
  }

  const { caseStudy } = result.data;
  return {
    title: caseStudy.title,
    description: caseStudy.summary,
    alternates: {
      canonical: `/case-studies/${caseStudy.slug}`,
    },
    openGraph: {
      type: "article",
      title: `${caseStudy.title} | THE LIVING EARTH`,
      description: caseStudy.summary,
      images: [
        {
          url: resolveEditorialImageUrl(caseStudy.cover_image_path, {
            pillarSlug: caseStudy.pillarSlug,
          }),
          alt: caseStudy.title,
        },
      ],
    },
  };
}

async function CaseStudyDetailContent({
  params,
}: {
  readonly params: Promise<{ readonly slug: string }>;
}) {
  const { slug } = await params;
  const result = await getCaseStudyDetailBySlug(slug);

  if (result.status === "unconfigured") {
    return (
      <ErrorState
        title="Case study unavailable"
        description="This case study is not available right now."
        actionHref="/our-planet"
        actionLabel="Back to Our Planet"
      />
    );
  }

  if (result.status === "error") {
    return (
      <ErrorState
        title="Unable to load case study"
        description={result.message}
        actionHref="/our-planet"
        actionLabel="Back to Our Planet"
      />
    );
  }

  if (!result.data) {
    notFound();
  }

  const { caseStudy, references, relatedCaseStudies } = result.data;
  const imageSrc = resolveEditorialImageUrl(caseStudy.cover_image_path, {
    pillarSlug: caseStudy.pillarSlug,
  });
  const locationLabel = caseStudy.region
    ? `${caseStudy.region}, ${caseStudy.country}`
    : caseStudy.country;

  const hasCoordinates =
    typeof caseStudy.latitude === "number" && typeof caseStudy.longitude === "number";

  const startLabel = caseStudy.start_date
    ? formatDateTime(caseStudy.start_date)
    : "Ongoing";

  const specRows: CaseStudySpecRow[] = [
    { label: "Domain", value: caseStudy.pillarName },
    { label: "Location", value: locationLabel },
    ...(caseStudy.organization
      ? [{ label: "Documenting body", value: caseStudy.organization }]
      : []),
    {
      label: "Observation period",
      value: `${startLabel}${caseStudy.end_date ? ` – ${formatDateTime(caseStudy.end_date)}` : " – Present"}`,
    },
    ...(hasCoordinates
      ? [
          {
            label: "Coordinates",
            value: `${caseStudy.latitude!.toFixed(4)}°, ${caseStudy.longitude!.toFixed(4)}°`,
          },
        ]
      : []),
  ];

  const sources = references.map((ref) => ({
    id: ref.id,
    title: ref.title,
    organization: ref.organization,
    sourceTypeLabel: SOURCE_TYPE_LABELS[ref.source_type] ?? "Authoritative source",
    sourceUrl: ref.source_url,
    meta: [
      ref.author ?? null,
      ref.publication_date ? `Published ${formatDateTime(ref.publication_date)}` : null,
    ]
      .filter(Boolean)
      .join(" · "),
  }));

  return (
    <>
      <CaseStudyOpener
        index="Regional record"
        pillarName={caseStudy.pillarName}
        pillarSlug={caseStudy.pillarSlug}
        title={caseStudy.title}
        summary={caseStudy.summary}
        location={locationLabel}
        imageSrc={imageSrc}
        startLabel={startLabel}
      />

      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-10">
        <div className="mt-14 grid gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-32">
              <CaseStudySpecLedger rows={specRows} />
            </div>
          </div>

          <article className="lg:col-span-8">
            <MarkdownArticle content={caseStudy.content} />

            <div className="mt-12">
              <CaseStudyFooter
                pillarName={caseStudy.pillarName}
                pillarSlug={caseStudy.pillarSlug}
              />
            </div>
          </article>
        </div>

        {sources.length > 0 ? (
          <div className="mt-20">
            <CaseStudySources sources={sources} />
          </div>
        ) : null}

        {relatedCaseStudies.length > 0 ? (
          <div className="mt-20">
            <EditorialSection
              headingId="case-related-heading"
              index="Related records"
              title="Other regional studies"
              lede="Field documentation from comparable landscapes, filed in the same format."
              aside={
                <Link
                  href="/our-planet"
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-primary underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
                >
                  All planetary data
                </Link>
              }
            >
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {relatedCaseStudies.slice(0, 2).map((item) => (
                  <CaseStudyCard key={item.id} caseStudy={item} />
                ))}
              </div>
            </EditorialSection>
          </div>
        ) : null}

        <div className="mt-20 pb-4">
          <CTASection
            title="Understand the restoration methods behind regional recovery."
            description="Explore conservation principles, renewable systems, and community stewardship on our Solutions page."
            primaryLabel="Explore Solutions"
            primaryHref="/solutions"
            secondaryLabel="Browse Stories"
            secondaryHref="/stories"
          />
        </div>
      </div>
    </>
  );
}

export default function CaseStudyDetailPage({ params }: CaseStudyPageProps) {
  return (
    <Suspense fallback={<LoadingState label="Loading regional case study..." />}>
      <CaseStudyDetailContent params={params} />
    </Suspense>
  );
}
