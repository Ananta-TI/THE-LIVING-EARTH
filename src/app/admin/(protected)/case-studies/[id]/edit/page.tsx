import { CaseStudyForm } from "@/components/admin/case-studies/case-study-form";
import { ErrorState } from "@/components/admin/shared/error-state";
import { PageHeader } from "@/components/admin/shared/page-header";
import { getCaseStudyForEdit } from "@/features/case-studies/queries";

export default async function AdminCaseStudyEditPage({
  params,
}: {
  readonly params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const result = await getCaseStudyForEdit(id);

  if (!result.ok) {
    return (
      <div>
        <PageHeader title="Edit Case Study" />
        <ErrorState
          message={result.error}
          retryHref="/admin/case-studies"
          retryLabel="Back to Case Studies"
        />
      </div>
    );
  }

  return (
    <div>
      <PageHeader title="Edit Case Study" description={result.data.caseStudy.title} />
      <CaseStudyForm
        lookups={result.data.lookups}
        initialData={result.data.caseStudy}
        initialReferenceIds={result.data.selectedReferenceIds}
      />
    </div>
  );
}
