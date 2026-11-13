import Link from "next/link";
import { Plus } from "lucide-react";
import { ErrorState } from "@/components/admin/shared/error-state";
import { PageHeader } from "@/components/admin/shared/page-header";
import { StatisticsTable } from "@/components/admin/statistics/statistics-table";
import { Button } from "@/components/ui/button";
import { getStatisticsList } from "@/features/statistics/queries";

export default async function AdminStatisticsPage() {
  const result = await getStatisticsList();

  return (
    <div>
      <PageHeader
        title="Environmental Statistics"
        description="Manage verified global and regional environmental indicators with mandatory scientific references."
        actions={
          <Button asChild size="sm" className="gap-1.5">
            <Link href="/admin/statistics/create">
              <Plus className="size-4" aria-hidden="true" />
              <span>Add Statistic</span>
            </Link>
          </Button>
        }
      />

      {result.ok ? (
        <StatisticsTable items={result.data.items} pillars={result.data.pillars} />
      ) : (
        <ErrorState message={result.error} retryHref="/admin" />
      )}
    </div>
  );
}
