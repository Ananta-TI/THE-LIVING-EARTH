import { ErrorState } from "@/components/admin/shared/error-state";
import { PageHeader } from "@/components/admin/shared/page-header";
import { StatisticForm } from "@/components/admin/statistics/statistic-form";
import { getStatisticLookups } from "@/features/statistics/queries";

export default async function AdminStatisticCreatePage() {
  const lookups = await getStatisticLookups();

  return (
    <div>
      <PageHeader
        title="Add Environmental Statistic"
        description="Record a quantitative environmental indicator tied to an authoritative scientific reference."
      />
      {lookups.ok ? (
        <StatisticForm lookups={lookups.data} />
      ) : (
        <ErrorState message={lookups.error} retryHref="/admin/statistics" />
      )}
    </div>
  );
}
