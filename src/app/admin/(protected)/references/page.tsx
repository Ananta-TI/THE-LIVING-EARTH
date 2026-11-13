import Link from "next/link";
import { Plus } from "lucide-react";
import { ReferencesTable } from "@/components/admin/references/references-table";
import { ErrorState } from "@/components/admin/shared/error-state";
import { PageHeader } from "@/components/admin/shared/page-header";
import { Button } from "@/components/ui/button";
import { getReferencesWithUsage } from "@/features/references/queries";

export default async function AdminReferencesPage() {
  const result = await getReferencesWithUsage();

  return (
    <div>
      <PageHeader
        title="Scientific References"
        description="Manage authoritative scientific journals, global reports, and institutional datasets cited across the platform."
        actions={
          <Button asChild size="sm" className="gap-1.5">
            <Link href="/admin/references/create">
              <Plus className="size-4" aria-hidden="true" />
              <span>Add Reference</span>
            </Link>
          </Button>
        }
      />

      {result.ok ? (
        <ReferencesTable references={result.data} />
      ) : (
        <ErrorState message={result.error} retryHref="/admin" />
      )}
    </div>
  );
}
