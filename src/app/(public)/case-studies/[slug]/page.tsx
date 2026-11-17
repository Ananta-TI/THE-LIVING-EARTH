import { Suspense } from "react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Building2, Calendar, Compass, MapPin } from "lucide-react";
import { Breadcrumbs } from "@/components/public/breadcrumbs";
import { CaseStudyCard } from "@/components/public/case-study-card";
import { CTASection } from "@/components/public/cta-section";
import { ErrorState } from "@/components/public/error-state";
import { LoadingState } from "@/components/public/loading-state";
import { MarkdownArticle } from "@/components/public/markdown-article";
import { ReferenceList } from "@/components/public/reference-list";
import { SectionHeading } from "@/components/public/section-heading";
import { Badge } from "@/components/ui/badge";
import { PUBLISHED_CASE_STUDIES } from "@/data";
import { getCaseStudyDetailBySlug } from "@/features/public/queries";
import { formatDateTime } from "@/lib/utils/format";
import { resolveEditorialImageUrl } from "@/lib/utils/media-url";

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

  return (
    <>
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Our Planet", href: "/our-planet" },
          { label: caseStudy.pillarName, href: `/explore/${caseStudy.pillarSlug}` },
          { label: caseStudy.title },
        ]}
      />

      <article className="mx-auto max-w-4xl">
        <header className="space-y-5">
          <div className="flex flex-wrap items-center gap-2.5 text-sm text-muted-foreground">
            <Link
              href={`/explore/${caseStudy.pillarSlug}`}
              className="focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              <Badge variant="secondary">{caseStudy.pillarName}</Badge>
            </Link>
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="size-3.5 text-primary" aria-hidden="true" />
              <span>{locationLabel}</span>
            </span>
          </div>

          <h1 className="font-heading text-3xl leading-[1.15] font-medium tracking-tight text-foreground sm:text-5xl">
            {caseStudy.title}
          </h1>

          <p className="text-lg leading-relaxed text-muted-foreground sm:text-xl">
            {caseStudy.summary}
          </p>

          {/* Verified Study Metadata Bar */}
          <dl className="grid gap-4 rounded-xl border border-border bg-secondary/35 p-5 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <dt className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                <MapPin className="size-3.5 text-primary" aria-hidden="true" />
                <span>Location</span>
              </dt>
              <dd className="mt-1 text-sm font-medium text-foreground">{locationLabel}</dd>
            </div>

            {caseStudy.organization ? (
              <div>
                <dt className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                  <Building2 className="size-3.5 text-primary" aria-hidden="true" />
                  <span>Lead / Documenting Body</span>
                </dt>
                <dd className="mt-1 text-sm font-medium text-foreground">
                  {caseStudy.organization}
                </dd>
              </div>
            ) : null}

            {caseStudy.start_date || caseStudy.end_date ? (
              <div>
                <dt className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                  <Calendar className="size-3.5 text-primary" aria-hidden="true" />
                  <span>Observation Period</span>
                </dt>
                <dd className="mt-1 text-sm font-medium text-foreground">
                  {caseStudy.start_date ? formatDateTime(caseStudy.start_date) : "Ongoing"}
                  {caseStudy.end_date ? ` – ${formatDateTime(caseStudy.end_date)}` : " – Present"}
                </dd>
              </div>
            ) : null}

            {hasCoordinates ? (
              <div>
                <dt className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                  <Compass className="size-3.5 text-primary" aria-hidden="true" />
                  <span>Coordinates</span>
                </dt>
                <dd className="mt-1 text-sm font-medium text-foreground">
                  {caseStudy.latitude!.toFixed(4)}°, {caseStudy.longitude!.toFixed(4)}°
                </dd>
              </div>
            ) : null}
          </dl>
        </header>

        <figure className="mt-8 overflow-hidden rounded-xl border border-border bg-muted">
          <div className="relative aspect-[16/9] w-full">
            <Image
              src={imageSrc}
              alt={`${caseStudy.title} — ${locationLabel}`}
              fill
              priority
              sizes="(min-width: 1024px) 896px, 100vw"
              className="object-cover"
            />
          </div>
        </figure>

        <div className="mt-10 border-b border-border pb-12">
          <MarkdownArticle content={caseStudy.content} className="mx-auto max-w-[68ch]" />
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
          <Link
            href="/our-planet"
            className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            <span>Back to Our Planet</span>
          </Link>

          <Link
            href={`/explore/${caseStudy.pillarSlug}`}
            className="text-sm font-medium text-muted-foreground hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            Explore {caseStudy.pillarName} →
          </Link>
        </div>

        {references.length > 0 ? (
          <section aria-labelledby="case-refs-heading" className="mt-14">
            <SectionHeading
              headingId="case-refs-heading"
              title="Sources & References"
              description="Supporting research and field documentation for this case study."
            />
            <div className="mt-6">
              <ReferenceList references={references} />
            </div>
          </section>
        ) : null}
      </article>

      {relatedCaseStudies.length > 0 ? (
        <section
          aria-labelledby="case-related-heading"
          className="mt-20 border-t border-border pt-14"
        >
          <SectionHeading
            headingId="case-related-heading"
            title="Related Regional Case Studies"
            actionLabel="Our Planet Overview"
            actionHref="/our-planet"
          />
          <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {relatedCaseStudies.map((item) => (
              <CaseStudyCard key={item.id} caseStudy={item} />
            ))}
          </div>
        </section>
      ) : null}

      <div className="mt-20">
        <CTASection
          title="Understand the restoration methods behind regional recovery."
          description="Explore conservation principles, renewable systems, and community stewardship on our Solutions page."
          primaryLabel="Explore Solutions"
          primaryHref="/solutions"
          secondaryLabel="Browse Stories"
          secondaryHref="/stories"
        />
      </div>
    </>
  );
}

export default function CaseStudyDetailPage({ params }: CaseStudyPageProps) {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <Suspense fallback={<LoadingState label="Loading regional case study..." />}>
        <CaseStudyDetailContent params={params} />
      </Suspense>
    </div>
  );
}
