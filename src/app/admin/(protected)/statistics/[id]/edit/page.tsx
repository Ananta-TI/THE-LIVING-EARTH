import { ErrorState } from "@/components/admin/shared/error-state";
import { PageHeader } from "@/components/admin/shared/page-header";
import { StatisticForm } from "@/components/admin/statistics/statistic-form";
import { getStatisticForEdit } from "@/features/statistics/queries";

export default async function AdminStatisticEditPage({
  params,
}: {
  readonly params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const result = await getStatisticForEdit(id);

  if (!result.ok) {
    return (
      <div>
        <PageHeader title="Edit Environmental Statistic" />
        <ErrorState
          message={result.error}
          retryHref="/admin/statistics"
          retryLabel="Back to Statistics"
        />
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Edit Environmental Statistic"
        description={result.data.statistic.indicator}
      />
      <StatisticForm
        lookups={result.data.lookups}
        initialData={result.data.statistic}
      />
    </div>
  );
}
