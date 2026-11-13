import { ReferenceForm } from "@/components/admin/references/reference-form";
import { PageHeader } from "@/components/admin/shared/page-header";

export default function AdminReferenceCreatePage() {
  return (
    <div className="mx-auto max-w-4xl">
      <PageHeader
        title="Add Scientific Reference"
        description="Register a verified publication or dataset before citing it in articles, case studies, or statistics."
      />
      <ReferenceForm />
    </div>
  );
}
