import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { ArticleCard } from "@/components/public/article-card";
import { CTASection } from "@/components/public/cta-section";
import { EditorialPageHero } from "@/components/public/editorial-page-hero";
import { EditorialSection } from "@/components/public/editorial-section";
import { ErrorState } from "@/components/public/error-state";
import { LoadingState } from "@/components/public/loading-state";
import { MarkdownArticle } from "@/components/public/markdown-article";
import { ReferenceList } from "@/components/public/reference-list";
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
      <EditorialPageHero
        index="Field note"
        context={article.pillarName}
        title={article.title}
        standfirst={article.excerpt}
        imageSrc={imageSrc}
        imageAlt={article.title}
      >
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-[10px] tracking-[0.12em] text-earth-ivory/70">
          {article.topicName ? <span>{article.topicName}</span> : null}
          {article.published_at ? (
            <time dateTime={article.published_at}>
              {formatDateTime(article.published_at)}
            </time>
          ) : null}
          {readingMinutes ? <span>{readingMinutes} min read</span> : null}
        </div>
      </EditorialPageHero>

      <div className="mx-auto w-full max-w-[1400px] px-4 py-16 sm:px-6 sm:py-20 lg:px-10">
        <article className="mx-auto max-w-[72ch]">
          <MarkdownArticle content={article.content} />
        </article>

        <div className="mx-auto mt-12 flex max-w-[72ch] flex-wrap items-center justify-between gap-4 border-t border-border pt-6">
          <Link
            href="/stories"
            className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            <span>Back to the archive</span>
          </Link>

          <Link
            href={`/explore/${article.pillarSlug}`}
            className="text-sm font-medium text-muted-foreground hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            Explore {article.pillarName} →
          </Link>
        </div>

        {references.length > 0 ? (
          <div className="mx-auto mt-20 max-w-[1400px]">
            <EditorialSection
              headingId="story-references-heading"
              index="Sources"
              title="Sources & references"
              lede="Scientific and institutional documentation supporting this story."
            >
              <ReferenceList references={references} />
            </EditorialSection>
          </div>
        ) : null}

        {relatedArticles.length > 0 ? (
          <div className="mx-auto mt-20 max-w-[1400px]">
            <EditorialSection
              headingId="story-related-heading"
              index="Related"
              title="Related notes"
              lede="Other dispatches filed under the same domain."
              aside={
                <Link
                  href="/stories"
                  className="group/x inline-flex items-center gap-2 border-b border-foreground/25 pb-1 text-sm font-medium text-foreground transition-colors duration-200 hover:border-primary hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
                >
                  <span>All notes</span>
                  <span
                    aria-hidden="true"
                    className="transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/x:translate-x-1 motion-reduce:transform-none"
                  >
                    &rarr;
                  </span>
                </Link>
              }
            >
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {relatedArticles.map((related) => (
                  <ArticleCard key={related.id} article={related} />
                ))}
              </div>
            </EditorialSection>
          </div>
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
      </div>
    </>
  );
}

export default function StoryDetailPage({ params }: StoryDetailPageProps) {
  return (
    <Suspense fallback={<LoadingState label="Loading story..." />}>
      <StoryDetailContent params={params} />
    </Suspense>
  );
}