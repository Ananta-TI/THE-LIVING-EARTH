import { Suspense } from "react";
import type { Metadata } from "next";
import { ArticleCard } from "@/components/public/article-card";
import { Breadcrumbs } from "@/components/public/breadcrumbs";
import { CTASection } from "@/components/public/cta-section";
import { EmptyState } from "@/components/public/empty-state";
import { ErrorState } from "@/components/public/error-state";
import { FeaturedStory } from "@/components/public/featured-story";
import { LoadingState } from "@/components/public/loading-state";
import { PageHeroBanner } from "@/components/public/page-hero-banner";
import { SectionHeading } from "@/components/public/section-heading";
import { StoriesFilterBar } from "@/components/public/stories-filter-bar";
import { StoriesPagination } from "@/components/public/stories-pagination";
import { getStoriesList } from "@/features/public/queries";

export const metadata: Metadata = {
  title: "Stories",
  description:
    "Read long-form environmental stories, field essays, and ecological reporting across THE LIVING EARTH.",
  alternates: {
    canonical: "/stories",
  },
};

interface StoriesPageProps {
  readonly searchParams: Promise<{
    readonly q?: string;
    readonly pillar?: string;
    readonly page?: string;
  }>;
}

const PAGE_SIZE = 9;

async function StoriesArchiveContent({
  searchParams,
}: {
  readonly searchParams: StoriesPageProps["searchParams"];
}) {
  const resolved = await searchParams;
  const search = (resolved.q ?? "").trim();
  const pillarSlug = (resolved.pillar ?? "").trim();
  const parsedPage = Number.parseInt(resolved.page ?? "1", 10);
  const page = Number.isFinite(parsedPage) && parsedPage > 0 ? parsedPage : 1;

  const result = await getStoriesList({
    search: search || undefined,
    pillarSlug: pillarSlug || undefined,
    page,
    pageSize: PAGE_SIZE,
  });

  if (result.status === "unconfigured") {
    return (
      <ErrorState
        title="Stories database configuration required"
        description="Published stories require an active public Supabase configuration."
      />
    );
  }

  if (result.status === "error") {
    return (
      <ErrorState
        title="Unable to load published stories"
        description={result.message}
      />
    );
  }

  const { featuredStory, articles, totalCount, pillars } = result.data;
  const isDefaultFirstPage = page === 1 && !search && !pillarSlug;
  const gridArticles =
    isDefaultFirstPage && featuredStory
      ? articles.filter((item) => item.id !== featuredStory.id)
      : articles;

  return (
    <div className="space-y-10">
      <StoriesFilterBar
        pillars={pillars}
        initialQuery={search}
        initialPillarSlug={pillarSlug}
        totalCount={totalCount}
      />

      {isDefaultFirstPage && featuredStory ? (
        <section aria-label="Featured Story">
          <FeaturedStory article={featuredStory} />
        </section>
      ) : null}

      {articles.length === 0 ? (
        <EmptyState
          title={
            search || pillarSlug
              ? "No published stories match your filter"
              : "No environmental stories published yet"
          }
          description={
            search || pillarSlug
              ? "Try broadening your search title or clearing the environmental pillar filter."
              : "Long-form environmental essays and dispatches will appear here once published in the editorial CMS."
          }
          actionLabel={search || pillarSlug ? "Clear Filters" : "Explore Pillars"}
          actionHref={search || pillarSlug ? "/stories" : "/explore"}
          secondaryLabel="Explore Our Planet"
          secondaryHref="/our-planet"
        />
      ) : gridArticles.length > 0 ? (
        <section aria-labelledby="more-stories-heading" className="space-y-6">
          <SectionHeading headingId="more-stories-heading" title="More Stories" />
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {gridArticles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        </section>
      ) : null}

      <StoriesPagination
        page={page}
        pageSize={PAGE_SIZE}
        totalCount={totalCount}
        search={search}
        pillarSlug={pillarSlug}
      />
    </div>
  );
}

export default function StoriesPage({ searchParams }: StoriesPageProps) {
  return (
    <>
      <PageHeroBanner
        eyebrow="Editorial Archive"
        title="Our Stories"
        description="Insights, field narratives, and scientific explainers for a changing and sustainable world."
        imageSrc="/images/hero-planet.jpg"
        imageAlt="Forest river valley canopy representing environmental stories"
      >
        <Breadcrumbs tone="dark" items={[{ label: "Home", href: "/" }, { label: "Stories" }]} />
      </PageHeroBanner>

      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <Suspense fallback={<LoadingState label="Loading published stories..." />}>
          <StoriesArchiveContent searchParams={searchParams} />
        </Suspense>

        <div className="mt-16">
          <CTASection
            title="Explore the regional studies behind the stories."
            description="Examine documented environmental case studies and verified statistics on Our Planet."
            primaryLabel="Explore Our Planet"
            primaryHref="/our-planet"
            secondaryLabel="Explore Pillars"
            secondaryHref="/explore"
          />
        </div>
      </div>
    </>
  );
}
