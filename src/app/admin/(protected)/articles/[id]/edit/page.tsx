import { ArticleForm } from "@/components/admin/articles/article-form";
import { ErrorState } from "@/components/admin/shared/error-state";
import { PageHeader } from "@/components/admin/shared/page-header";
import { getArticleForEdit } from "@/features/articles/queries";

export default async function AdminArticleEditPage({
  params,
}: {
  readonly params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const result = await getArticleForEdit(id);

  if (!result.ok) {
    return (
      <div>
        <PageHeader title="Edit Article" />
        <ErrorState
          message={result.error}
          retryHref="/admin/articles"
          retryLabel="Back to Articles"
        />
      </div>
    );
  }

  return (
    <div>
      <PageHeader title="Edit Article" description={result.data.article.title} />
      <ArticleForm
        lookups={result.data.lookups}
        initialData={result.data.article}
        initialReferenceIds={result.data.selectedReferenceIds}
      />
    </div>
  );
}
