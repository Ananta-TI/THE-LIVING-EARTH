import Link from "next/link";
import { Plus } from "lucide-react";
import { ArticlesTable } from "@/components/admin/articles/articles-table";
import { ErrorState } from "@/components/admin/shared/error-state";
import { PageHeader } from "@/components/admin/shared/page-header";
import { Button } from "@/components/ui/button";
import { getArticlesList } from "@/features/articles/queries";

interface ArticlesSearchParams {
  readonly q?: string;
  readonly pillar?: string;
  readonly status?: string;
  readonly featured?: string;
  readonly sort?: string;
  readonly page?: string;
}

export default async function AdminArticlesPage({
  searchParams,
}: {
  readonly searchParams: Promise<ArticlesSearchParams>;
}) {
  const params = await searchParams;
  const parsedPage = Number(params.page ?? "1");
  const page = Number.isFinite(parsedPage) && parsedPage >= 1 ? Math.floor(parsedPage) : 1;

  const statusFilter =
    params.status === "draft" || params.status === "published" || params.status === "archived"
      ? params.status
      : "all";

  const featuredFilter =
    params.featured === "featured" || params.featured === "standard" ? params.featured : "all";

  const sortFilter =
    params.sort === "created_desc" || params.sort === "title_asc"
      ? params.sort
      : "updated_desc";

  const result = await getArticlesList({
    search: params.q ?? "",
    pillarId: params.pillar ?? "all",
    status: statusFilter,
    featured: featuredFilter,
    sort: sortFilter,
    page,
    pageSize: 12,
  });

  return (
    <div>
      <PageHeader
        title="Editorial Articles"
        description="Write, review, feature, and publish environmental knowledge articles linked to pillars, topics, and scientific citations."
        actions={
          <Button asChild size="sm" className="gap-1.5">
            <Link href="/admin/articles/create">
              <Plus className="size-4" aria-hidden="true" />
              <span>New Article</span>
            </Link>
          </Button>
        }
      />

      {result.ok ? (
        <ArticlesTable
          items={result.data.items}
          totalCount={result.data.totalCount}
          page={result.data.page}
          pageSize={result.data.pageSize}
          pillars={result.data.pillars}
          initialFilters={{
            search: params.q ?? "",
            pillarId: params.pillar ?? "all",
            status: statusFilter,
            featured: featuredFilter,
            sort: sortFilter,
          }}
        />
      ) : (
        <ErrorState message={result.error} retryHref="/admin" />
      )}
    </div>
  );
}
