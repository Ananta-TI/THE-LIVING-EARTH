import { ErrorState } from "@/components/admin/shared/error-state";
import { PageHeader } from "@/components/admin/shared/page-header";
import { PillarsManager } from "@/components/admin/pillars/pillars-manager";
import { getPillarsWithRelations } from "@/features/pillars/queries";

export default async function AdminPillarsPage() {
  const result = await getPillarsWithRelations();

  return (
    <div>
      <PageHeader
        title="Environmental Pillars"
        description="Manage descriptions, display order, cover visuals, and active state for the five core environmental themes."
      />
      {result.ok ? (
        <PillarsManager pillars={result.data} />
      ) : (
        <ErrorState message={result.error} retryHref="/admin" />
      )}
    </div>
  );
}
