import { Suspense } from "react";
import type { Metadata } from "next";
import { EditorialPageHero } from "@/components/public/editorial-page-hero";
import { EmptyState } from "@/components/public/empty-state";
import { ErrorState } from "@/components/public/error-state";
import { LoadingState } from "@/components/public/loading-state";
import { StoriesFilterBar } from "@/components/public/stories-filter-bar";
import { StoriesPagination } from "@/components/public/stories-pagination";
import { StoryLedger } from "@/components/public/story-ledger";
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
        title="Stories unavailable"
        description="Story content is not available right now."
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

  const { articles, totalCount, pillars } = result.data;
  const offset = (page - 1) * PAGE_SIZE;

  return (
    <div className="space-y-12">
      <StoriesFilterBar
        pillars={pillars}
        initialQuery={search}
        initialPillarSlug={pillarSlug}
        totalCount={totalCount}
      />

      {articles.length === 0 ? (
        <EmptyState
          title={
            search || pillarSlug
              ? "Nothing in the archive matches this filter"
              : "The archive is empty"
          }
          description={
            search || pillarSlug
              ? "Try a broader search term, or clear the domain filter to see every note on file."
              : "Long-form essays and field dispatches will appear here as the editorial desk publishes them."
          }
          actionLabel={search || pillarSlug ? "Clear filters" : "Browse the domains"}
          actionHref={search || pillarSlug ? "/stories" : "/explore"}
        />
      ) : (
        <StoryLedger articles={articles} startIndex={offset} />
      )}

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
      <EditorialPageHero
        index="Section 03"
        context="The archive"
        title="Every note, in the order it was recorded"
        standfirst="Long-form reporting and field dispatches across all five domains — each entry carries its domain, topic, publication date, and reading time."
        imageSrc="/images/hero-planet.jpg"
        imageAlt="Forest river valley canopy representing environmental stories"
      />

      <div className="mx-auto w-full max-w-[1400px] px-4 py-16 sm:px-6 sm:py-20 lg:px-10">
        <Suspense fallback={<LoadingState label="Loading the archive..." />}>
          <StoriesArchiveContent searchParams={searchParams} />
        </Suspense>
      </div>
    </>
  );
}
