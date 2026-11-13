import { MessagesTable } from "@/components/admin/messages/messages-table";
import { ErrorState } from "@/components/admin/shared/error-state";
import { PageHeader } from "@/components/admin/shared/page-header";
import { getContactSubmissions } from "@/features/messages/queries";

export default async function AdminMessagesPage() {
  const result = await getContactSubmissions();

  return (
    <div>
      <PageHeader
        title="Contact Submissions Inbox"
        description="Review reader inquiries, collaboration requests, and scientific data correction reports."
      />
      {result.ok ? (
        <MessagesTable messages={result.data} />
      ) : (
        <ErrorState message={result.error} retryHref="/admin" />
      )}
    </div>
  );
}
