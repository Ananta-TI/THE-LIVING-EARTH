import { Suspense } from "react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar, Clock } from "lucide-react";
import { ArticleCard } from "@/components/public/article-card";
import { Breadcrumbs } from "@/components/public/breadcrumbs";
import { CTASection } from "@/components/public/cta-section";
import { ErrorState } from "@/components/public/error-state";
import { LoadingState } from "@/components/public/loading-state";
import { MarkdownArticle } from "@/components/public/markdown-article";
import { ReferenceList } from "@/components/public/reference-list";
import { SectionHeading } from "@/components/public/section-heading";
import { Badge } from "@/components/ui/badge";
import { PUBLISHED_ARTICLES } from "@/data";
import { getStoryDetailBySlug } from "@/features/public/queries";
import { formatDateTime } from "@/lib/utils/format";
import { resolveEditorialImageUrl } from "@/lib/utils/media-url";
import { estimateReadingTimeMinutes } from "@/lib/utils/reading-time";

interface StoryDetailPageProps {
  readonly params: Promise<{ readonly slug: string }>;
}

export function generateStaticParams() {
  return PUBLISHED_ARTICLES.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: StoryDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const result = await getStoryDetailBySlug(slug);

  if (result.status !== "ok" || !result.data) {
    return {
      title: "Environmental Story",
      description: "Read published environmental journalism and analysis on THE LIVING EARTH.",
      alternates: {
        canonical: `/stories/${slug}`,
      },
    };
  }

  const { article } = result.data;
  const imageUrl = resolveEditorialImageUrl(article.cover_image_path, {
    pillarSlug: article.pillarSlug,
  });

  return {
    title: article.seo_title || article.title,
    description: article.seo_description || article.excerpt,
    alternates: {
      canonical: `/stories/${article.slug}`,
    },
    openGraph: {
      type: "article",
      title: article.seo_title || article.title,
      description: article.seo_description || article.excerpt,
      publishedTime: article.published_at ?? undefined,
      images: [
        {
          url: imageUrl,
          alt: article.title,
        },
      ],
    },
  };
}

async function StoryDetailContent({
  params,
}: {
  readonly params: Promise<{ readonly slug: string }>;
}) {
  const { slug } = await params;
  const result = await getStoryDetailBySlug(slug);

  if (result.status === "unconfigured") {
    return (
      <ErrorState
        title="Story unavailable"
        description="This story is not available right now."
        actionHref="/stories"
        actionLabel="Back to Stories"
      />
    );
  }

  if (result.status === "error") {
    return (
      <ErrorState
        title="Unable to load story"
        description={result.message}
        actionHref="/stories"
        actionLabel="Back to Stories"
      />
    );
  }

  if (!result.data) {
    notFound();
  }

  const { article, references, relatedArticles } = result.data;
  const imageSrc = resolveEditorialImageUrl(article.cover_image_path, {
    pillarSlug: article.pillarSlug,
  });
  const readingMinutes = estimateReadingTimeMinutes(article.content);

  return (
    <>
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Stories", href: "/stories" },
          { label: article.pillarName, href: `/explore/${article.pillarSlug}` },
          { label: article.title },
        ]}
      />

      <article className="mx-auto max-w-4xl">
        <header className="space-y-5">
          <div className="flex flex-wrap items-center gap-2.5 text-sm text-muted-foreground">
            <Link
              href={`/explore/${article.pillarSlug}`}
              className="focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              <Badge variant="secondary">{article.pillarName}</Badge>
            </Link>
            {article.topicName ? <Badge variant="outline">{article.topicName}</Badge> : null}
            {article.published_at ? (
              <span className="inline-flex items-center gap-1.5">
                <Calendar className="size-3.5" aria-hidden="true" />
                <time dateTime={article.published_at}>
                  {formatDateTime(article.published_at)}
                </time>
              </span>
            ) : null}
            {readingMinutes ? (
              <span className="inline-flex items-center gap-1.5">
                <Clock className="size-3.5" aria-hidden="true" />
                <span>{readingMinutes} min read</span>
              </span>
            ) : null}
          </div>

          <h1 className="font-heading text-3xl leading-[1.15] font-medium tracking-tight text-foreground sm:text-5xl">
            {article.title}
          </h1>

          <p className="text-lg leading-relaxed text-muted-foreground sm:text-xl">
            {article.excerpt}
          </p>
        </header>

        <figure className="mt-8 overflow-hidden rounded-xl border border-border bg-muted">
          <div className="relative aspect-[16/9] w-full">
            <Image
              src={imageSrc}
              alt={article.title}
              fill
              priority
              sizes="(min-width: 1024px) 896px, 100vw"
              className="object-cover"
            />
          </div>
        </figure>

        <div className="mt-10 border-b border-border pb-12">
          <MarkdownArticle content={article.content} className="mx-auto max-w-[68ch]" />
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
          <Link
            href="/stories"
            className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            <span>Back to all stories</span>
          </Link>

          <Link
            href={`/explore/${article.pillarSlug}`}
            className="text-sm font-medium text-muted-foreground hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            Explore {article.pillarName} →
          </Link>
        </div>

        {references.length > 0 ? (
          <section aria-labelledby="story-references-heading" className="mt-14">
            <SectionHeading
              headingId="story-references-heading"
              title="Sources & References"
              description="Scientific and institutional documentation supporting this story."
            />
            <div className="mt-6">
              <ReferenceList references={references} />
            </div>
          </section>
        ) : null}
      </article>

      {relatedArticles.length > 0 ? (
        <section aria-labelledby="story-related-heading" className="mt-20 border-t border-border pt-14">
          <SectionHeading
            headingId="story-related-heading"
            title="Related Stories"
            actionLabel="All Stories"
            actionHref="/stories"
          />
          <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {relatedArticles.map((related) => (
              <ArticleCard key={related.id} article={related} />
            ))}
          </div>
        </section>
      ) : null}

      <div className="mt-20">
        <CTASection
          title="Connect ecological understanding with practical restoration."
          description="Explore conservation pathways on Solutions or inspect regional case studies on Our Planet."
          primaryLabel="Explore Solutions"
          primaryHref="/solutions"
          secondaryLabel="Our Planet"
          secondaryHref="/our-planet"
        />
      </div>
    </>
  );
}

export default function StoryDetailPage({ params }: StoryDetailPageProps) {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <Suspense fallback={<LoadingState label="Loading story..." />}>
        <StoryDetailContent params={params} />
      </Suspense>
    </div>
  );
}
