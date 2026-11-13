import { ArticleForm } from "@/components/admin/articles/article-form";
import { ErrorState } from "@/components/admin/shared/error-state";
import { PageHeader } from "@/components/admin/shared/page-header";
import { getArticleFormLookups } from "@/features/articles/queries";

export default async function AdminArticleCreatePage() {
  const lookupsResult = await getArticleFormLookups();

  return (
    <div>
      <PageHeader
        title="Create Article"
        description="Draft a new environmental knowledge story with Markdown formatting and scientific citations."
      />
      {lookupsResult.ok ? (
        <ArticleForm lookups={lookupsResult.data} />
      ) : (
        <ErrorState message={lookupsResult.error} retryHref="/admin/articles" />
      )}
    </div>
  );
}
