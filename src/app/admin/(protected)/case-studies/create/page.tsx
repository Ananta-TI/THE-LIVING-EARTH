import { CaseStudyForm } from "@/components/admin/case-studies/case-study-form";
import { ErrorState } from "@/components/admin/shared/error-state";
import { PageHeader } from "@/components/admin/shared/page-header";
import { getCaseStudyLookups } from "@/features/case-studies/queries";

export default async function AdminCaseStudyCreatePage() {
  const lookups = await getCaseStudyLookups();

  return (
    <div>
      <PageHeader
        title="Create Case Study"
        description="Document a regional environmental case study with geographic coordinates and verified sources."
      />
      {lookups.ok ? (
        <CaseStudyForm lookups={lookups.data} />
      ) : (
        <ErrorState message={lookups.error} retryHref="/admin/case-studies" />
      )}
    </div>
  );
}
