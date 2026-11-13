import { ErrorState } from "@/components/admin/shared/error-state";
import { PageHeader } from "@/components/admin/shared/page-header";
import { TopicsManager } from "@/components/admin/topics/topics-manager";
import { getTopicsOverview } from "@/features/topics/queries";

export default async function AdminTopicsPage() {
  const result = await getTopicsOverview();

  return (
    <div>
      <PageHeader
        title="Topics Taxonomy"
        description="Create, organize, and activate thematic topics under each environmental pillar."
      />
      {result.ok ? (
        <TopicsManager topics={result.data.topics} pillars={result.data.pillars} />
      ) : (
        <ErrorState message={result.error} retryHref="/admin" />
      )}
    </div>
  );
}
