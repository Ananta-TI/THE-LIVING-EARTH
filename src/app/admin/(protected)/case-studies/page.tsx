import Link from "next/link";
import { Plus } from "lucide-react";
import { CaseStudiesTable } from "@/components/admin/case-studies/case-studies-table";
import { ErrorState } from "@/components/admin/shared/error-state";
import { PageHeader } from "@/components/admin/shared/page-header";
import { Button } from "@/components/ui/button";
import { getCaseStudiesList } from "@/features/case-studies/queries";

export default async function AdminCaseStudiesPage() {
  const result = await getCaseStudiesList();

  return (
    <div>
      <PageHeader
        title="Geographic Case Studies"
        description="Manage place-based ecological studies, coordinates, timelines, and scientific references."
        actions={
          <Button asChild size="sm" className="gap-1.5">
            <Link href="/admin/case-studies/create">
              <Plus className="size-4" aria-hidden="true" />
              <span>New Case Study</span>
            </Link>
          </Button>
        }
      />

      {result.ok ? (
        <CaseStudiesTable items={result.data.items} pillars={result.data.pillars} />
      ) : (
        <ErrorState message={result.error} retryHref="/admin" />
      )}
    </div>
  );
}
