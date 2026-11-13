import Link from "next/link";
import { ArrowLeft, Mail } from "lucide-react";
import { MessageStatusActions } from "@/components/admin/messages/message-status-actions";
import { ErrorState } from "@/components/admin/shared/error-state";
import { PageHeader } from "@/components/admin/shared/page-header";
import { StatusBadge } from "@/components/admin/shared/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getContactSubmissionById } from "@/features/messages/queries";
import { formatDateTimeLong } from "@/lib/utils/format";

export default async function AdminMessageDetailPage({
  params,
}: {
  readonly params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const result = await getContactSubmissionById(id);

  if (!result.ok) {
    return (
      <div className="mx-auto max-w-3xl">
        <PageHeader title="Contact Message" />
        <ErrorState
          message={result.error}
          retryHref="/admin/messages"
          retryLabel="Back to Inbox"
        />
      </div>
    );
  }

  const msg = result.data;
  const mailtoHref = `mailto:${encodeURIComponent(msg.email)}?subject=${encodeURIComponent(
    `Re: ${msg.subject}`,
  )}`;

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <PageHeader
        title={msg.subject}
        description={`Submitted by ${msg.name} (${msg.email}) on ${formatDateTimeLong(msg.created_at)}`}
        actions={<StatusBadge status={msg.status} />}
      />

      <Card>
        <CardHeader className="border-b border-border/60">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="font-heading text-lg">{msg.name}</CardTitle>
              <CardDescription>{msg.email}</CardDescription>
            </div>
            <Button asChild size="sm" className="gap-1.5">
              <a href={mailtoHref}>
                <Mail className="size-4" aria-hidden="true" />
                <span>Reply via Email</span>
              </a>
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-6 pt-6">
          <div className="rounded-xl border border-border bg-muted/20 p-5">
            <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground">
              {msg.message}
            </p>
          </div>

          <div className="border-t border-border pt-4">
            <p className="mb-2.5 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
              Workflow Status
            </p>
            <MessageStatusActions messageId={msg.id} currentStatus={msg.status} />
          </div>
        </CardContent>
      </Card>

      <Button asChild variant="outline" size="sm" className="gap-1.5">
        <Link href="/admin/messages">
          <ArrowLeft className="size-4" aria-hidden="true" />
          <span>Back to Inbox</span>
        </Link>
      </Button>
    </div>
  );
}
